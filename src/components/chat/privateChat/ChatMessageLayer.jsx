"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import io from "socket.io-client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { API_URL } from "@/api/route";
import "./chatContainer.css";

const socket = io(API_URL, { transports: ["websocket", "polling"] });

const ChatMessageLayer = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unreadTickets, setUnreadTickets] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState("open");
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedTicketData = tickets.find(
    (ticket) => ticket._id === selectedTicket?._id
  );

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket._id.includes(searchQuery)
  );

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket and tickets setup
  useEffect(() => {
    if (!userId) return;

    fetchTickets();

    // Register user on socket connection
    socket.emit("register", userId);

    // Handle socket connection/reconnection
    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("register", userId);
    });

    // Handle new messages
    socket.on("newMessage", (data) => {
      console.log("New message received:", data);
      console.log("selectedTicket", selectedTicket);
      if (selectedTicket && selectedTicket._id === data.ticketId) {
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) =>
              msg._id === data._id ||
              (msg.text === data.text && msg.createdAt === data.createdAt)
          );
          console.log("messageExists", messageExists);
          if (messageExists) return prev;
          const updatedMessages = [...prev, data];
          console.log("Updated Messages", updatedMessages);
          return updatedMessages;
        });
        // Update tickets state to sync messages
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === data.ticketId
              ? { ...ticket, messages: [...(ticket.messages || []), data] }
              : ticket
          )
        );
        if (data.sender === "user") {
          console.log("Seen request sent by user");
          socket.emit("seenRequest", {
            ticketId: data.ticketId,
            sender: data.sender,
          });
        }
      } else {
        setUnreadTickets((prev) => {
          const updated = new Set(prev);
          updated.add(data.ticketId);
          return updated;
        });
      }
    });

    // Handle messages read
    socket.on("messagesRead", ({ ticketId }) => {
      console.log("Messages read by user:", ticketId);
      if (selectedTicket?._id === ticketId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, isRead: true }))
        );
      }
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t._id === ticketId ? { ...t, unreadMessages: { admin: 0 } } : t
        )
      );
    });

    // Handle seen request
    socket.on("seenRequest", ({ ticketId }) => {
      console.log("Seen request received for ticket:", ticketId);
      if (selectedTicket?._id === ticketId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, isRead: true }))
        );
        socket.emit("seen", { ticketId, sender: "user" });
      }
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t._id === ticketId ? { ...t, unreadMessages: { admin: 0 } } : t
        )
      );
    });

    // Handle seen confirmation
    socket.on("seen", ({ ticketId }) => {
      console.log("Seen event triggered for ticket:", ticketId);
      if (selectedTicket?._id === ticketId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, isRead: true }))
        );
      }
      setUnreadTickets((prev) => {
        const updated = new Set(prev);
        updated.delete(ticketId);
        return updated;
      });
    });

    // Cleanup socket listeners
    return () => {
      socket.off("connect");
      socket.off("newMessage");
      socket.off("messagesRead");
      socket.off("seenRequest");
      socket.off("seen");
    };
  }, [userId, selectedTicket]);

  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets/user/${userId}`);
      const fetchedTickets = response.data.tickets;
      console.log("Fetched tickets:", fetchedTickets);
      setTickets(fetchedTickets);
      const unreadSet = new Set();
      fetchedTickets.forEach((ticket) => {
        if (ticket.unreadMessages?.user > 0) {
          unreadSet.add(ticket._id);
        }
      });
      setUnreadTickets(unreadSet);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(error || "Failed to fetch tickets");
    }
  };

  // Fetch messages for a specific ticket
  const fetchMessages = async (ticket) => {
    try {
      setSelectedTicket(ticket);
      setUnreadTickets((prev) => {
        const updated = new Set(prev);
        updated.delete(ticket._id);
        return updated;
      });

      await axios.patch(`${API_URL}/api/tickets/mark-read`, {
        ticketId: ticket._id,
        userId,
      });

      const response = await axios.get(
        `${API_URL}/api/tickets/${ticket._id}/messages?role=user`
      );

      console.log("response", response);
      if (response.data.status === "success") {
        console.log("Fetched messages:", response.data.data.messages);
        setMessages(response.data.data.messages);
      } else {
        console.error("Failed to fetch messages:", response.data.error);
        toast.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error fetching messages");
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedTicket) return;
    if (selectedTicket.status === "completed") {
      return toast.error("Cannot send messages in a closed/completed ticket");
    }

    const newMessage = {
      ticketId: selectedTicket._id,
      text: input,
      sender: "user",
      isRead: false,
      createdAt: new Date().toISOString(),
      _id: `temp-${Date.now()}`, // Temporary ID for optimistic update
    };

    try {
      console.log("Sending message:", newMessage);
      // Optimistically update messages and tickets
      setMessages((prev) => [...prev, newMessage]);
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === selectedTicket._id
            ? { ...ticket, messages: [...(ticket.messages || []), newMessage] }
            : ticket
        )
      );

      const response = await axios.post(`${API_URL}/api/tickets/message/send`, {
        ticketId: selectedTicket._id,
        text: input,
        sender: "user",
      });
      console.log("Send message response:", response.data);

      setInput("");
      socket.emit("seenRequest", {
        ticketId: selectedTicket._id,
        sender: "user",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Revert optimistic update
      setMessages((prev) => prev.filter((msg) => msg._id !== newMessage._id));
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === selectedTicket._id
            ? {
                ...ticket,
                messages: ticket.messages.filter(
                  (msg) => msg._id !== newMessage._id
                ),
              }
            : ticket
        )
      );
      toast.error("Failed to send message");
    }
  };

  // Create a new ticket
  const createTicket = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/tickets/create`, {
        userId,
        title,
        description,
      });
      console.log("Created ticket:", response.data.ticket);
      setTickets((prev) => [...prev, response.data.ticket]);
      setTitle("");
      setDescription("");
      toast.success("Ticket created successfully");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
  };

  // Handle status filter change
  const handleFilterChanges = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    fetchTickets();
  };

  // Update ticket status
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/tickets/status/${ticketId}`, {
        status: newStatus,
      });
      fetchTickets();
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
      toast.success("Ticket status updated");
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  // Auto-select first ticket
  useEffect(() => {
    if (filteredTickets.length > 0 && !selectedTicket) {
      fetchMessages(filteredTickets[0]);
    }
  }, [filteredTickets]);

  return (
    <>
      <Toaster />
      <div className="chat-wrapper mt-5">
        <div
          className="chat-sidebar card"
          style={{ boxShadow: "7px 7px 21px rgba(0, 0, 0, 0.6)" }}
        >
          {filteredTickets.length > 0 && (
            <div className="chat-sidebar-single active top-profile">
              <div className="img">
                <img src="/assets/images/chat/1.png" alt="image_icon" />
              </div>
              <div className="info">
                {selectedTicket && (
                  <>
                    <h6 className="text-md mb-0">{selectedTicket.title}</h6>
                    <p className="mb-0">{selectedTicket.status}</p>
                  </>
                )}
              </div>
              <div className="action">
                <div className="filter_ticket_section mb-4">
                  <form className="flex items-center gap-3 form-input">
                    <select
                      name="statusFilter"
                      value={statusFilter}
                      onChange={handleFilterChanges}
                      className="ticket_filter_select border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value="open">Open</option>
                      <option value="completed">Completed</option>
                    </select>
                  </form>
                </div>
              </div>
            </div>
          )}

          {filteredTickets.length > 0 && (
            <div className="chat-search">
              <span className="icon">
                <Icon icon="iconoir:search" />
              </span>
              <input
                type="text"
                name="#0"
                autoComplete="off"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {filteredTickets.length > 0 ? (
            <div className="chat-all-list">
              {filteredTickets
                .filter((ticket) => ticket.status === statusFilter)
                .map((ticket) => (
                  <div
                    key={ticket._id}
                    className={`chat-sidebar-single ${
                      selectedTicket?._id === ticket._id ? "active" : ""
                    }`}
                    onClick={() => fetchMessages(ticket)}
                  >
                    <div className="img">
                      <img src="/assets/images/chat/1.png" alt="image_icon" />
                    </div>
                    <div className="info">
                      <h6 className="text-sm mb-1">{ticket.title}</h6>
                    </div>
                    <div className="action text-end">
                      <p className="mb-0 text-neutral-400 text-xs lh-1">Now</p>
                      {unreadTickets.has(ticket._id) && (
                        <span className="w-16-px h-16-px text-xs rounded-circle bg-warning-main text-white d-inline-flex align-items-center justify-content-center">
                          !
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no_ticket text-gray-500 text-center py-4 mb-3 mt-3">
              No tickets available, please create a ticket.
            </p>
          )}
        </div>

        <div
          className="chat-main card"
          style={{ boxShadow: "7px 7px 21px rgba(0, 0, 0, 0.6)" }}
        >
          {filteredTickets.length > 0 ? (
            <>
              {selectedTicket && (
                <>
                  <div className="chat-sidebar-single active">
                    <div className="img">
                      <img src="/assets/images/chat/1.png" alt="image_icon" />
                    </div>
                    <div className="info">
                      <h6 className="text-md mb-0">{`#${selectedTicket._id} (${selectedTicket.title})`}</h6>
                      <p className="mb-0">{selectedTicket.status}</p>
                    </div>
                    <div className="action d-inline-flex align-items-center gap-3">
                      <select
                        value={selectedTicket.status}
                        onChange={(e) =>
                          updateTicketStatus(selectedTicket._id, e.target.value)
                        }
                        className="status_dropdown border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-full"
                      >
                        <option value="open">Open</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="chat-message-list">
                    {console.log("Messages to render:", messages)}
                    {messages.map((msg) => (
                      <p
                        key={msg._id || msg.createdAt}
                        className={`p-2 rounded-lg mb-2 d-flex justify-content-end ${
                          msg.sender === "user"
                            ? "chat-bubble text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <strong>{msg.sender} : </strong> {msg.text}
                        <span className="ml-2 text-xs">
                          {msg.isRead ? "✔✔" : "✔"}
                        </span>
                      </p>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form className="chat-message-box">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
                      name="chatMessage"
                      placeholder="Type message here..."
                    />
                    <div className="chat-message-box-action">
                      <button
                        type="submit"
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                      >
                        Send
                        <Icon icon="f7:paperplane" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          ) : (
            <p className="no_ticket text-gray-500 text-center py-4 mb-3 mt-3">
              No tickets available, please create a ticket.
            </p>
          )}
        </div>
      </div>

      <div className="create_new_ticket_section mt-5">
        <div className="create_filter_ticket">
          <h3>Create a Ticket</h3>
        </div>
        <div className="create_input_section mt-4">
          <form onSubmit={createTicket}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div>
              <button type="submit" className="createButton">
                Create Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatMessageLayer;
