"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [isSending, setIsSending] = useState(false);
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

  // Fetch all tickets
  const fetchTickets = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets/user/${userId}`);
      const fetchedTickets = response.data.tickets;
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
      toast.error(error?.response?.data?.message || "Failed to fetch tickets");
    }
  }, [userId]);

  // Fetch messages for a specific ticket
  const fetchMessages = useCallback(
    async (ticket) => {
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

        if (response.data.status === "success") {
          setMessages(response.data.data.messages);
        } else {
          toast.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Error fetching messages");
      }
    },
    [userId]
  );

  // Socket and tickets setup
  useEffect(() => {
    if (!userId) return;

    fetchTickets();

    // Register user on socket connection
    socket.emit("register", userId);

    // Handle socket connection/reconnection
    const handleConnect = () => {
      socket.emit("register", userId);
    };

    // Handle new messages
    const handleNewMessage = (data) => {
      if (selectedTicket && selectedTicket._id === data.ticketId) {
        setMessages((prev) => {
          // Check for optimistic message by text and sender
          const optimisticIndex = prev.findIndex(
            (msg) =>
              msg._id && // Add check for _id existence
              typeof msg._id === "string" &&
              msg._id.startsWith("temp-") &&
              msg.text &&
              msg.text.trim() === data.text.trim() &&
              msg.sender === data.sender
          );

          if (optimisticIndex !== -1) {
            // Replace optimistic message with server message
            const updated = [...prev];
            updated[optimisticIndex] = data;
            return updated;
          }

          // Check for duplicate server message
          if (prev.some((msg) => msg._id === data._id)) {
            return prev;
          }

          return [...prev, data];
        });

        // Mark as seen if message is from admin
        if (data.sender === "admin") {
          socket.emit("seenRequest", {
            ticketId: data.ticketId,
            sender: "user",
          });
        }
      } else {
        // Add to unread if not the current ticket
        setUnreadTickets((prev) => new Set(prev).add(data.ticketId));
      }
    };

    // Handle messages read
    const handleMessagesRead = ({ ticketId }) => {
      if (selectedTicket?._id === ticketId) {
        setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
      }
    };

    // Handle seen confirmation
    const handleSeen = ({ ticketId }) => {
      if (selectedTicket?._id === ticketId) {
        setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
      }
      setUnreadTickets((prev) => {
        const updated = new Set(prev);
        updated.delete(ticketId);
        return updated;
      });
    };

    socket.on("connect", handleConnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("seen", handleSeen);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("seen", handleSeen);
    };
  }, [userId, selectedTicket, fetchTickets]);

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedTicket || isSending) return;
    if (selectedTicket.status === "completed") {
      return toast.error("Cannot send messages in a closed/completed ticket");
    }

    setIsSending(true);
    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      ticketId: selectedTicket._id,
      text: input.trim(),
      sender: "user",
      isRead: false,
      createdAt: new Date().toISOString(),
      _id: tempId,
    };

    try {
      // Optimistically update messages
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      await axios.post(`${API_URL}/api/tickets/message/send`, {
        ticketId: selectedTicket._id,
        text: input.trim(),
        sender: "user",
      });

      socket.emit("seenRequest", {
        ticketId: selectedTicket._id,
        sender: "user",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Revert optimistic update
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
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
      setTickets((prev) => [...prev, response.data.ticket]);
      setTitle("");
      setDescription("");
      toast.success("Ticket created successfully");
      fetchMessages(response.data.ticket); // Auto-select the new ticket
      if (description.trim()) {
        const tempId = `temp-${Date.now()}`;
        const newMessage = {
          ticketId: response.data.ticket._id,
          text: description.trim(),
          sender: "user",
          isRead: false,
          createdAt: new Date().toISOString(),
          _id: tempId,
        };
        setMessages((prev) => [...prev, newMessage]);

        await axios.post(`${API_URL}/api/tickets/message/send`, {
          ticketId: response.data.ticket._id,
          text: description.trim(),
          sender: "user",
        });

        socket.emit("seenRequest", {
          ticketId: response.data.ticket._id,
          sender: "user",
        });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
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
  }, [filteredTickets, fetchMessages, selectedTicket]);

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
                  <select
                    name="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="ticket_filter_select border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <option value="open">Open</option>
                    <option value="completed">Completed</option>
                  </select>
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
                    {messages.map((msg) => (
                      <p
                        key={msg._id}
                        className={`p-2 rounded mb-2 d-flex justify-content-${
                          msg.sender === "user" ? "end" : "start"
                        }`}
                      >
                        <span
                          className={`px-3 py-2 rounded ${
                            msg.sender === "user"
                              ? "bg-primary text-white"
                              : "bg-light text-dark"
                          }`}
                        >
                          <strong>{msg.sender}:</strong> {msg.text}
                          <span className="ms-2 small">
                            {msg.isRead ? "✔✔" : "✔"}
                          </span>
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
                      placeholder="Type message here..."
                      disabled={isSending}
                    />
                    <div className="chat-message-box-action">
                      <button
                        type="submit"
                        onClick={sendMessage}
                        disabled={!input.trim() || isSending}
                        className="btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1"
                      >
                        {isSending ? "Sending..." : "Send"}
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
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
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
