"use client";

import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import {
  getUserDirectsAsync,
  getUserHierarchyAsync,
} from "@/redux-toolkit/slices/userSlice";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "reactstrap";

// Type definitions
interface IUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  contactNumber: string;
  wallet_address: string;
  accountStatus: { activeStatus: number; blockStatus: number };
  createdAt: string;
}

interface IHierarchyNode {
  _id: string;
  username: string;
  name: string;
  sponsorUCode: string | null;
  planType: "unilevel" | "binary" | "matrix";
  createdAt: string;
  depth: number;
  leftChild?: string | null;
  rightChild?: string | null;
  children: IHierarchyNode[];
}

interface IUserDirectsQuery {
  userId: string;
}

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserDirects = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { userDirects, loading, hierarchy } = useAppSelector(
    (state) => state.user
  );
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const debouncedFilterText = useDebounce(filterText, 300);

  // Normalize userDirects to match the expected IUser type
  const normalizedUserDirects: IUser[] = useMemo(() => {
    return userDirects.map((user) => ({
      ...user,
      contactNumber: user.contactNumber ?? "",
      wallet_address: user.wallet_address ?? "",
      accountStatus: {
        activeStatus: user.accountStatus?.activeStatus ?? 0,
        blockStatus: user.accountStatus?.blockStatus ?? 0,
      },
      createdAt:
        typeof user.createdAt === "string"
          ? user.createdAt
          : user.createdAt?.toISOString() ?? "",
      updatedAt:
        typeof user.updatedAt === "string"
          ? user.updatedAt
          : user.updatedAt?.toISOString() ?? "",
    }));
  }, [userDirects]);

  // Toggle modal and reset state when closing
  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setSelectedUser(null);
      setExpandedNodes(new Set());
    }
  };

  // Handle view button click
  const handleViewClick = (user: IUser) => {
    setSelectedUser(user);
    setExpandedNodes(new Set());
    setModal(true);
    fetchHierarchy(user._id, 2);
  };

  // Fetch hierarchy data
  const fetchHierarchy = useCallback(
    async (userId: string, maxDepth?: number) => {
      if (!session?.user?.id) {
        toast.error("Please login to view hierarchy");
        return;
      }

      try {
        setHierarchyLoading(true);
        await dispatch(getUserHierarchyAsync({ userId, maxDepth })).unwrap();
      } catch (error: any) {
        console.error("Failed to fetch user hierarchy:", error);
        const message =
          error.status === 404
            ? "User hierarchy not found"
            : error.message || "Failed to fetch hierarchy. Please try again.";
        toast.error(message);
      } finally {
        setHierarchyLoading(false);
      }
    },
    [dispatch, session?.user?.id]
  );

  // Handle expand/collapse button click
  const handleExpandClick = useCallback(
    async (node: IHierarchyNode) => {
      if (!node._id) return;

      const isExpanded = expandedNodes.has(node._id);
      if (isExpanded) {
        // Collapse node
        setExpandedNodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(node._id);
          return newSet;
        });
      } else {
        // Expand node, fetch deeper if necessary
        const hasUnloadedChildren = hierarchy.some(
          (user) =>
            user.sponsorUCode === node._id &&
            !node.children.some((child) => child._id === user._id)
        );
        if (hasUnloadedChildren && node.children.length === 0) {
          try {
            setHierarchyLoading(true);
            const maxDepth = (node.depth || 0) + 1;
            await dispatch(
              getUserHierarchyAsync({ userId: node._id, maxDepth })
            ).unwrap();
          } catch (error: any) {
            console.error("Failed to expand hierarchy:", error);
            toast.error(
              error.message || "Failed to expand hierarchy. Please try again."
            );
          } finally {
            setHierarchyLoading(false);
          }
        }
        setExpandedNodes((prev) => new Set(prev).add(node._id));
      }
    },
    [dispatch, expandedNodes, hierarchy]
  );

  // Dynamic multi-field filtering
  const filteredItems = useMemo(() => {
    if (!debouncedFilterText) return normalizedUserDirects;
    const lowercasedFilter = debouncedFilterText.toLowerCase();
    return normalizedUserDirects.filter(
      (item) =>
        item.username?.toLowerCase().includes(lowercasedFilter) ||
        item.name?.toLowerCase().includes(lowercasedFilter) ||
        item.email?.toLowerCase().includes(lowercasedFilter) ||
        item.contactNumber?.toLowerCase().includes(lowercasedFilter) ||
        item.wallet_address?.toLowerCase().includes(lowercasedFilter)
    );
  }, [normalizedUserDirects, debouncedFilterText]);

  const columns: TableColumn<IUser>[] = useMemo(
    () => [
      {
        name: "Action",
        cell: (row) => (
          <button
            className="btn btn-sm bg-primary text-white"
            onClick={() => handleViewClick(row)}
            aria-label={`View hierarchy for ${row.username || "user"}`}
          >
            View
          </button>
        ),
      },
      {
        name: "Username",
        selector: (row) => row.username || "N/A",
        sortable: true,
        cell: (row) => <span className="font-medium">{row.username}</span>,
      },
      {
        name: "Name",
        selector: (row) => row.name || "N/A",
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.email || "N/A",
        sortable: true,
      },
      {
        name: "WalletAddress",
        selector: (row) => row.wallet_address || "N/A",
        sortable: true,
      },
      {
        name: "Contact",
        selector: (row) => row.contactNumber || "N/A",
        sortable: true,
        minWidth: "150px",
      },
      {
        name: "Status",
        cell: (row) => {
          const status = row.accountStatus?.activeStatus;
          const label =
            status === 1 ? "Active" : status === 0 ? "InActive" : "N/A";
          const color =
            status === 1
              ? "txt-primary"
              : status === 0
              ? "txt-danger"
              : "txt-light";
          return <span className={color}>{label}</span>;
        },
        sortable: true,
      },
      {
        name: "Block Status",
        cell: (row) => {
          const status = row.accountStatus?.blockStatus;
          const label =
            status === 1 ? "UnBlock" : status === 0 ? "Block" : "N/A";
          const color =
            status === 1
              ? "txt-primary"
              : status === 0
              ? "txt-danger"
              : "txt-light";
          return <span className={color}>{label}</span>;
        },
        sortable: true,
      },
      {
        name: "Join Date",
        selector: (row) => new Date(row.createdAt).getTime(),
        cell: (row) => (
          <span className="text-green-600 font-medium">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        ),
        sortable: true,
      },
    ],
    []
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div
        id="row_create_filter"
        className="dataTables_filter d-flex align-items-center"
      >
        <Label className="me-1" htmlFor="user-directs-search">
          Search:
        </Label>
        <Input
          id="user-directs-search"
          onChange={(e: React.ChangeEvent<HTMLFormElement>) =>
            setFilterText(e.target.value)
          }
          type="search"
          value={filterText}
          aria-label="Search user directs by username, name, email, contact, or wallet address"
          disabled={loading.getUserDirects}
        />
        {filterText && debouncedFilterText !== filterText && (
          <span className="ms-2">Filtering...</span>
        )}
        {filterText && (
          <button
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={() => setFilterText("")}
            aria-label="Clear search filter"
          >
            Clear
          </button>
        )}
      </div>
    );
  }, [filterText, debouncedFilterText, loading.getUserDirects]);

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) {
      toast.error("Please login to view directs");
      return;
    }

    try {
      const params: IUserDirectsQuery = {
        userId: session.user.id,
      };
      await dispatch(getUserDirectsAsync(params)).unwrap();
    } catch (error: any) {
      console.error("Failed to fetch user directs:", error);
      const message =
        error.status === 404
          ? "No directs found"
          : error.message || "Failed to fetch data. Please try again.";
      toast.error(message);
    }
  }, [dispatch, session?.user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Build hierarchy from flat list
  const buildHierarchy = useMemo(() => {
    if (
      !hierarchy ||
      !selectedUser ||
      !hierarchy.some((user) => user._id === selectedUser._id)
    ) {
      console.warn("Invalid hierarchy data or selected user");
      return [] as IHierarchyNode[];
    }

    const userMap = new Map<string, IHierarchyNode>();
    hierarchy.forEach((user) => {
      userMap.set(user._id, { ...user, children: [] });
    });

    hierarchy.forEach((user) => {
      const sponsorId = user.sponsorUCode?.toString();
      if (sponsorId && userMap.has(sponsorId)) {
        userMap.get(sponsorId)!.children.push(userMap.get(user._id)!);
      }
    });

    const root = userMap.get(selectedUser._id);
    return root ? [root] : ([] as IHierarchyNode[]);
  }, [hierarchy, selectedUser]);

  // Render hierarchy as a nested list with expand/collapse
  const renderHierarchy = (nodes: IHierarchyNode[], level: number = 0) => {
    return (
      <ul className={`list-group ${level > 0 ? "ms-4" : ""}`}>
        {nodes.map((node) => {
          const isExpanded = expandedNodes.has(node._id);
          const hasChildren =
            node.children.length > 0 ||
            hierarchy.some((user) => user.sponsorUCode === node._id) ||
            (node.planType === "binary" && (node.leftChild || node.rightChild));
          return (
            <li key={node._id} className="list-group-item">
              <div className="d-flex align-items-center mb-2">
                <strong>{node.username || "N/A"}</strong> ({node.name || "N/A"})
                <small className="ms-2">
                  Joined: {new Date(node.createdAt).toLocaleDateString()}
                </small>
                {hasChildren && (
                  <Button
                    color="link"
                    size="sm"
                    className="ms-2 p-0"
                    onClick={() => handleExpandClick(node)}
                    disabled={hierarchyLoading}
                    aria-expanded={isExpanded}
                    aria-label={`${
                      isExpanded ? "Collapse" : "Expand"
                    } hierarchy for ${node.username || "user"}`}
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </Button>
                )}
              </div>
              {isExpanded &&
                node.children.length > 0 &&
                renderHierarchy(node.children, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Container fluid className="advance-init-table">
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader className="pb-0 card-no-border">
              <h2>User Directs</h2>
            </CardHeader>
            <CardBody>
              <div className="table-responsive theme-scrollbar" id="row_create">
                <DataTable
                  data={filteredItems}
                  columns={columns}
                  progressPending={loading.getUserDirects}
                  progressComponent={
                    <Spinner color="primary">Loading...</Spinner>
                  }
                  noDataComponent={
                    !loading.getUserDirects && userDirects.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted">
                          No direct users found for this account.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">No users found.</div>
                    )
                  }
                  highlightOnHover
                  striped
                  pagination
                  className="border custom-scrollbar display dataTable"
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          User Hierarchy for {selectedUser?.username || "User"}
        </ModalHeader>
        <ModalBody>
          {hierarchyLoading ? (
            <div className="text-center">
              <Spinner color="primary" /> Loading hierarchy...
            </div>
          ) : buildHierarchy.length > 0 ? (
            renderHierarchy(buildHierarchy)
          ) : (
            <div>No hierarchy data available.</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default UserDirects;
