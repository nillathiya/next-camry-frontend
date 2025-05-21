"use client";

import React, { useEffect, useMemo, useState } from "react";
import Tree from "react-d3-tree";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Input,
  Label,
} from "reactstrap";
import "./genelogy.css";
import { API_URL } from "@/api/route";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { toast } from "react-toastify";
import {
  getUserHierarchyAsync,
  getUserLevelWiseGenerationAsync,
  getUserWithPackageInfoAsync,
} from "@/redux-toolkit/slices/userSlice";
import { IUser, IUserLevelWiseGenerationResponse } from "@/types";
import DataTable, { TableColumn } from "react-data-table-component";

interface ITreeNode {
  _id: string;
  username: string;
  name: string;
  sponsorUCode?: string;
  profileImage?: string;
  children: ITreeNode[];
  attributes: { Level: number };
  rawData: any;
  collapsed: boolean;
}

interface IUserDetails {
  user: {
    username: string;
    profilePicture?: string;
    sponsorUCode?: { username: string };
  };
  totalInvestment: string;
}

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

const Generation = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { hierarchy } = useAppSelector((state: any) => state.user);

  const [treeData, setTreeData] = useState<ITreeNode | null>(null);
  // show selected user info
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<IUser | null>(
    null
  );
  const [userGenerationTreeLoading, setUserGenerationTreeLoading] =
    useState(false);
  const [selectedUserDetailsLoading, setSelectedUserDetailsLoading] =
    useState(false);
  const [modal, setModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [showTableView, setShowTableView] = useState(false);
  const [levelData, setLevelData] = useState<
    IUserLevelWiseGenerationResponse[]
  >([]);
  const [levelDataLoading, setLevelDataLoading] = useState(false);
  // showing selected team
  const [levelInput, setLevelInput] = useState<string>("2");
  const [showTeamTable, setShowTeamTable] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<IUser[]>([]);
  const debouncedFilterText = useDebounce(filterText, 300);
  const normalizedUserGenerationTree: ITreeNode[] = useMemo(() => {
    return hierarchy.map((user: any) => ({
      _id: user._id || "",
      username: user.username || "",
      name: user.name || "",
      sponsorUCode: user.sponsorUCode || "",
      profileImage: user.profileImage || "",
      contactNumber: user.contactNumber || "",
      wallet_address: user.wallet_address || "",
    }));
  }, [hierarchy]);

  console.log("selectedUser", selectedUser);
  console.log("selectedUserDetail", selectedUserDetail);

  useEffect(() => {
    (async () => {
      if (!session) return;
      setUserGenerationTreeLoading(true);
      try {
        if (normalizedUserGenerationTree.length === 0) {
          await dispatch(
            getUserHierarchyAsync({
              userId: session.user.id,
              maxDepth: 2,
            })
          ).unwrap();
        }
      } catch (error: any) {
        toast.error(error || "Server error");
      } finally {
        setUserGenerationTreeLoading(false);
      }
    })();
  }, [dispatch, normalizedUserGenerationTree.length, session]);

  useEffect(() => {
    if (!session || normalizedUserGenerationTree.length === 0) return;

    const userMap = new Map<string, ITreeNode>();
    const visited = new Set<string>();

    normalizedUserGenerationTree.forEach((user: any) => {
      userMap.set(user._id, {
        _id: user._id,
        name: user.name,
        username: user.username,
        attributes: { Level: 0 },
        children: [],
        rawData: { ...user },
        collapsed: false,
      });
    });

    normalizedUserGenerationTree.forEach((user: any) => {
      if (
        user.sponsorUCode &&
        userMap.has(user.sponsorUCode) &&
        !visited.has(user._id)
      ) {
        const parent = userMap.get(user.sponsorUCode)!;
        const child = userMap.get(user._id)!;

        const isCycle = (node: ITreeNode, targetId: string): boolean => {
          if (node._id === targetId) return true;
          return node.children.some((child) => isCycle(child, targetId));
        };

        if (!isCycle(parent, user._id)) {
          child.attributes.Level = parent.attributes.Level + 1;
          parent.children.push(child);
          visited.add(user._id);
        } else {
          console.warn(`Cycle detected for user: ${user._id}`);
        }
      }
    });

    const rootNode = userMap.get(session.user.id);
    if (rootNode) {
      setTreeData(rootNode);
    } else {
      console.error("Root user not found in hierarchy");
      setTreeData(null);
    }
  }, [normalizedUserGenerationTree, session?.user.id]);

  const handleShowTableWiseGeneration = async () => {
    if (!session) return;
    const level = parseInt(levelInput);
    if (isNaN(level) || level < 1) {
      toast.error("Please enter a valid level (positive number)");
      return;
    }
    setLevelDataLoading(true);
    try {
      const response = await dispatch(
        getUserLevelWiseGenerationAsync({
          userId: session.user.id,
          level,
        })
      ).unwrap();
      setLevelData(response.data || []);
      setShowTableView(true);
    } catch (error: any) {
      toast.error(error || "Server error");
    } finally {
      setLevelDataLoading(false);
    }
  };

  const handleBackToTreeView = () => {
    setShowTableView(false);
    setShowTeamTable(false);
    setLevelData([]);
    setSelectedTeam([]);
  };

  const handleViewTeam = (team: IUser[]) => {
    setSelectedTeam(team || []);
    setShowTeamTable(true);
    console.log("selectedTeam", selectedTeam);
  };

  const handleBackToLevelTable = () => {
    setShowTeamTable(false);
    setSelectedTeam([]);
  };

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }: any) => {
    return (
      <g>
        {nodeDatum.children?.length > 0 && (
          <circle
            r={15}
            className="cursor-pointer hover:scale-110 transition-transform"
            fill="rgb(77, 92, 177)"
            stroke="white"
            onClick={(e: any) => {
              e.stopPropagation();
              toggleNode();
            }}
          />
        )}
        <text
          x="-5"
          y="5"
          fill="black"
          strokeWidth="1"
          fontSize="12"
          textAnchor="middle"
          className="cursor-pointer font-bold text-center darkmode-stroke"
          onClick={(e: any) => {
            e.stopPropagation();
            toggleNode();
          }}
        >
          {nodeDatum.collapsed ? "+" : "-"}
        </text>
        <rect
          x="-22"
          y="-52"
          width="44"
          height="44"
          fill="rgb(77, 92, 177)"
          rx="50%"
        />
        <image
          href={
            nodeDatum.rawData.profileImage ||
            "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"
          }
          x="-20"
          y="-50"
          height="40px"
          width="40px"
          className="tree_generation cursor-pointer hover:scale-110 transition-transform"
          onClick={(e: any) => {
            e.stopPropagation();
            setSelectedUser(nodeDatum.rawData);
            setModal(true);
          }}
        />
        <text
          x={25}
          y={-10}
          fill="black"
          strokeWidth="1"
          className="cursor-pointer text-gray-900 dark:text-gray-100 darkmode-stroke"
          onClick={(e: any) => {
            e.stopPropagation();
            setSelectedUser(nodeDatum.rawData);
            setModal(true);
          }}
        >
          {nodeDatum.name} (L{nodeDatum.attributes.Level})
        </text>
      </g>
    );
  };

  useEffect(() => {
    if (!selectedUser) return;
    (async () => {
      setSelectedUserDetailsLoading(true);
      try {
        const result = await dispatch(
          getUserWithPackageInfoAsync({ userId: selectedUser._id })
        ).unwrap();
        setSelectedUserDetail(result.data);
      } catch (error: any) {
        toast.error(error || "Server error");
      } finally {
        setSelectedUserDetailsLoading(false);
      }
    })();
  }, [selectedUser, dispatch]);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setSelectedUser(null);
    }
  };

  const filteredTreeData = useMemo(() => {
    if (!debouncedFilterText || !treeData) return treeData;
    const lowercasedFilter = debouncedFilterText.toLowerCase();

    const filterNodes = (
      node: ITreeNode,
      visited: Set<string> = new Set()
    ): ITreeNode | null => {
      if (visited.has(node._id)) {
        console.warn(`Cycle detected in filter for node: ${node._id}`);
        return null;
      }
      visited.add(node._id);

      const matches =
        node.username.toLowerCase().includes(lowercasedFilter) ||
        node.name.toLowerCase().includes(lowercasedFilter);

      const filteredChildren = node.children
        .map((child) => filterNodes(child, visited))
        .filter((child): child is ITreeNode => child !== null);

      if (matches || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }
      return null;
    };

    return filterNodes(treeData as ITreeNode) || treeData;
  }, [treeData, debouncedFilterText]);

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div
        id="tree_filter"
        className="dataTables_filter d-flex align-items-center"
      >
        <Label className="me-1" htmlFor="tree-search">
          Search:
        </Label>
        <Input
          id="tree-search"
          onChange={(e: React.ChangeEvent<HTMLFormElement>) =>
            setFilterText(e.target.value)
          }
          type="search"
          value={filterText}
          aria-label="Search tree by username or name"
          disabled={userGenerationTreeLoading}
        />
        {filterText && debouncedFilterText !== filterText && (
          <span className="ms-2">Filtering...</span>
        )}
        {filterText && (
          <Button
            color="outline-secondary"
            size="sm"
            className="ms-2"
            onClick={() => setFilterText("")}
            aria-label="Clear search filter"
          >
            Clear
          </Button>
        )}
      </div>
    );
  }, [filterText, debouncedFilterText, userGenerationTreeLoading]);

  // Columns for level-wise data
  const levelColumns: TableColumn<IUserLevelWiseGenerationResponse>[] = useMemo(
    () => [
      {
        name: "Level",
        selector: (row) => row?.level ?? 0,
        sortable: true,
      },
      {
        name: "Parent",
        selector: (row) => row?.user?.username ?? "N/A",
        sortable: true,
        cell: (row) => (
          <span>
            {row?.user?.username ?? "N/A"} ({row?.user?.name ?? "N/A"})
          </span>
        ),
      },
      {
        name: "Total Directs",
        selector: (row) => row?.totalDirects ?? 0,
        sortable: true,
      },
      {
        name: "Active Directs",
        selector: (row) => row?.activeDirects ?? 0,
        sortable: true,
      },
      {
        name: "Inactive Directs",
        selector: (row) => row?.inActiveDirects ?? 0,
        sortable: true,
      },
      {
        name: "Team Business",
        selector: (row) => row?.totalTeamBusiness ?? "N/A",
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => {
          if (!row) return null;

          // Helper to normalize a user object
          const normalizeUser = (user: IUser) => ({
            ...user,
            sponsorUCode:
              typeof user.sponsorUCode === "object"
                ? user.sponsorUCode.username
                : user.sponsorUCode,
          });

          return (
            <div className="d-flex flex-column flex-lg-row gap-2 ">
              <Button
                color="primary"
                size="sm"
                onClick={() => {
                  if (row?.user) {
                    const userData = normalizeUser(row.user);
                    setSelectedUser(userData);
                    setModal(true);
                  } else {
                    toast.error("User data not available");
                  }
                }}
                disabled={!row?.user}
                className="w-100 w-md-auto"
              >
                View User
              </Button>
              <Button
                color="info"
                size="sm"
                onClick={() => {
                  const normalizedTeam = (row?.team ?? []).map(normalizeUser);
                  handleViewTeam(normalizedTeam);
                }}
                className="w-100 w-md-auto"
              >
                View Team
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );
  // Columns for team table
  const teamColumns: TableColumn<IUser>[] = useMemo(
    () => [
      {
        name: "Username",
        selector: (row) => row?.username ?? "N/A",
        sortable: true,
      },
      {
        name: "Name",
        selector: (row) => row?.name ?? "N/A",
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row?.email ?? "N/A",
        sortable: true,
      },
      {
        name: "Contact Number",
        selector: (row) => row?.contactNumber ?? "N/A",
        sortable: true,
      },
      {
        name: "Wallet Address",
        selector: (row) => row?.wallet_address ?? "N/A",
        sortable: true,
      },
      {
        name: "Sponsor",
        selector: (row) => {
          if (
            typeof row.sponsorUCode === "object" &&
            row.sponsorUCode !== null
          ) {
            const username = row.sponsorUCode.username || "N/A";
            const name = row.sponsorUCode.name
              ? ` (${row.sponsorUCode.name})`
              : "";
            return username + name;
          }
          return row.sponsorUCode ?? "N/A";
        },
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <Button
            color="primary"
            size="sm"
            onClick={() => {
              setSelectedUser(row);
              setModal(true);
            }}
          >
            View
          </Button>
        ),
        button: true,
      },
    ],
    []
  );

  const levelTableSubHeader = useMemo(() => {
    return (
      <div
        id="level_filter"
        className="dataTables_filter d-flex align-items-center gap-2"
      >
        <Button
          color="secondary"
          size="sm"
          onClick={handleBackToTreeView}
          aria-label="Back to tree view"
        >
          Back to Tree View
        </Button>
      </div>
    );
  }, []);

  const teamTableSubHeader = useMemo(() => {
    return (
      <div
        id="team_filter"
        className="dataTables_filter d-flex align-items-center gap-2"
      >
        <Button
          color="secondary"
          size="sm"
          onClick={handleBackToLevelTable}
          aria-label="Back to level table"
        >
          Back to Levels
        </Button>
      </div>
    );
  }, []);

  const headerComponentMemo = useMemo(() => {
    return (
      <div className="d-flex align-items-center gap-2 mt-4">
        <Label htmlFor="level-input">Level:</Label>
        <Input
          id="level-input"
          type="number"
          value={levelInput}
          onChange={(e: React.ChangeEvent<HTMLFormElement>) =>
            setLevelInput(e.target.value)
          }
          min="1"
          style={{ width: "100px" }}
          disabled={userGenerationTreeLoading}
        />
        <Button
          color="light"
          onClick={handleShowTableWiseGeneration}
          disabled={userGenerationTreeLoading}
        >
          Show Table Wise
        </Button>
      </div>
    );
  }, [levelInput, userGenerationTreeLoading]);
  // console.log("filteredTreeData", filteredTreeData);
  return (
    <Container fluid className="advance-init-table">
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader className="pb-0 card-no-border">
              <h2>User Team Hierarchy</h2>
              {!showTableView && headerComponentMemo}
            </CardHeader>
            <CardBody>
              {showTableView ? (
                showTeamTable ? (
                  <div
                    className="table-responsive theme-scrollbar"
                    id="team_table"
                  >
                    <DataTable
                      data={selectedTeam}
                      columns={teamColumns}
                      noDataComponent={
                        <div className="text-center py-3 w-100">
                          No team members found.
                        </div>
                      }
                      highlightOnHover
                      striped
                      pagination
                      className="border custom-scrollbar display dataTable"
                      subHeader
                      subHeaderComponent={teamTableSubHeader}
                    />
                  </div>
                ) : (
                  <div
                    className="table-responsive theme-scrollbar"
                    id="level_table"
                  >
                    <DataTable
                      data={levelData}
                      columns={levelColumns}
                      progressPending={levelDataLoading}
                      progressComponent={
                        <div className="text-center py-3 w-100">
                          <Spinner color="primary">Loading...</Spinner>
                        </div>
                      }
                      noDataComponent={
                        <div className="text-center py-3 w-100">
                          No hierarchy data found.
                        </div>
                      }
                      highlightOnHover
                      striped
                      pagination
                      className="border custom-scrollbar display dataTable"
                      subHeader
                      subHeaderComponent={levelTableSubHeader}
                    />
                  </div>
                )
              ) : (
                <div className="theme-scrollbar" id="tree_view">
                  {subHeaderComponentMemo}
                  <div className="darkmode_generation">
                    {userGenerationTreeLoading ? (
                      <div className="text-center">
                        <Spinner color="primary">Loading...</Spinner>
                      </div>
                    ) : filteredTreeData ? (
                      <Tree
                        data={filteredTreeData}
                        orientation="vertical"
                        translate={{ x: 300, y: 50 }}
                        pathFunc="step"
                        nodeSize={{ x: 200, y: 100 }}
                        separation={{ siblings: 1.5, nonSiblings: 2 }}
                        collapsible={true}
                        renderCustomNodeElement={renderCustomNodeElement}
                      />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No downline members found.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggleModal} size="md">
        <ModalHeader toggle={toggleModal}>
          User Details for {selectedUser?.username || "User"}
        </ModalHeader>
        <ModalBody>
          {selectedUserDetailsLoading ? (
            <div className="text-center">
              <Spinner color="primary">Loading...</Spinner>
            </div>
          ) : selectedUserDetail ? (
            <div className="d-flex align-items-center gap-4">
              <img
                src={
                  selectedUserDetail.profilePicture
                    ? selectedUserDetail.profilePicture.startsWith("http")
                      ? selectedUserDetail.profilePicture
                      : `${API_URL}${selectedUserDetail.profilePicture}`
                    : "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"
                }
                alt="User"
                className="w-14 h-14 rounded-circle shadow-md"
              />
              <div className="text-gray-900 dark:text-gray-100">
                <p>
                  <strong>Username:</strong>{" "}
                  {selectedUserDetail.username || "N/A"}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUserDetail.name || "N/A"}
                </p>
                <p>
                  <strong>Sponsor:</strong>{" "}
                  {typeof selectedUserDetail.sponsorUCode === "object" &&
                  selectedUserDetail.sponsorUCode.username ? (
                    <>
                      {selectedUserDetail.sponsorUCode.username}
                      {selectedUserDetail.sponsorUCode.name &&
                        ` (${selectedUserDetail.sponsorUCode.name})`}
                    </>
                  ) : (
                    "N/A"
                  )}
                </p>

                <p>
                  <strong>Package:</strong> {selectedUserDetail.package || "0"}
                </p>
              </div>
            </div>
          ) : (
            <p>No user details available.</p>
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

export default Generation;
