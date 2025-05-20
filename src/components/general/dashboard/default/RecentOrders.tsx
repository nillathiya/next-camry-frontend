"use client";
import { useEffect, useState } from "react";
import CommonDropdown from "@/common-components/CommonDropdown";
// Removed moment
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { Badge, CardBody, CardHeader, Col, Spinner } from "reactstrap";
import { formatDate } from "@/lib/dateFormate"; // ✅ Use your custom formatter
import { IPinSettings } from "@/types/setting";
import { getAllUserOrdersAsync } from "@/redux-toolkit/slices/userSlice";
import { IOrder } from "@/types";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";

const RecentOrders = () => {
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const {
    userOrders,
    loading: { getUserOrders },
  } = useAppSelector((state) => state.user);
  const currency = useCompanyCurrency();
  useEffect(() => {
    if (!getUserOrders || userOrders.length === 0) {
      dispatch(getAllUserOrdersAsync());
    }
  }, []);
  const getStatusColor = (status: number | undefined): string => {
    switch (status) {
      case 1:
        return "success"; // green badge
      case 0:
        return "warning"; // yellow/orange badge
      case 2:
        return "danger"; // red badge
      default:
        return "secondary"; // grey badge
    }
  };

  const getStatusText = (status: number | undefined) => {
    switch (status) {
      case 1:
        return "Running";
      case 0:
        return "Pending";
      case 2:
        return "Expire";
      default:
        return "Unknown";
    }
  };

  const sortedData = [...((userOrders as IOrder[]) || [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .filter((item) => {
      if (!selectedStatus || selectedStatus === "All") return true;
      return getStatusText(item.status) === selectedStatus;
    });

  return (
    <Col xl="12" sm="12" className="col-xl-30 order-xl-ii customer-order">
      <CardHeader className="card-no-border">
        <div className="header-top order-lists d-flex justify-content-between align-items-center">
          <h2>Plan History</h2>
          <div className="card-header-right-icon">
            <CommonDropdown
              dropdownItems={["All", "Pending", "Running", "Expire"]}
              dropdownToggle="All Orders"
              onSelect={(value: string) =>
                setSelectedStatus(value === "All Orders" ? "" : value)
              }
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="transaction-list recent-orders">
        <ul className="order-list mb-0">
          {getUserOrders ? (
            <div className="text-center py-4">
              <Spinner color="primary" />
            </div>
          ) : (
            <div className="package-list">
              {sortedData.length === 0 ? (
                <div className="text-muted text-center py-3">
                  No packages found
                </div>
              ) : (
                sortedData.map((order) => (
                  <>
                    <div
                      key={order._id}
                      className="mb-3 border p-3 rounded d-flex justify-content-between flex-wrap"
                    >
                      {/* Right Side: Name & Description */}
                      <div className="text-end">
                        <h6 className="mb-1 text-start">
                          {`${
                            typeof order.pinId === "object" && order.pinId.name
                              ? order.pinId.name
                              : "N/A"
                          } / ${currency}${order.bv}`}
                        </h6>
                        <Badge color="light-primary">
                          {typeof order.pinId === "object" &&
                          order.pinId.description
                            ? order.pinId.description
                            : "N/A"}
                        </Badge>
                      </div>

                      {/* Left Side: Status & Date */}
                      <div className="text-start">
                        <div className="f-light f-w-500 f-12 mb-1">
                          <Badge color={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="text-muted f-12">
                          {formatDate(order.createdAt)}{" "}
                          {/* ✅ Using your custom function */}
                        </div>
                      </div>
                    </div>
                  </>
                ))
              )}
            </div>
          )}
        </ul>
      </CardBody>
    </Col>
  );
};

export default RecentOrders;
