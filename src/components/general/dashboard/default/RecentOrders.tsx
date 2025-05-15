"use client";
import { useEffect, useState } from "react";
import CommonDropdown from "@/common-components/CommonDropdown";
// Removed moment
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getPinSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import { Badge, CardBody, CardHeader, Col, Spinner } from "reactstrap";
import { formatDate } from "@/lib/dateFormate"; // ✅ Use your custom formatter
import { IPinSettings } from "@/types/setting";

const RecentOrders = () => {
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const {
    pinSettings,
    loading: { getPinSettings },
  } = useAppSelector((state) => state.setting);

  useEffect(() => {
    if (!pinSettings || pinSettings.length === 0) {
      dispatch(getPinSettingsAsync());
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

  const sortedData = [...((pinSettings as IPinSettings[]) || [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .filter((item) => {
      if (!selectedStatus || selectedStatus === "All") return true;
      return getStatusText(item.status) === selectedStatus;
    });

  return (
    <Col xl="12" sm="6" className="col-xl-30 order-xl-ii customer-order">
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
          {getPinSettings ? (
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
                sortedData.map((item) => (
                  <>
                    <div
                      key={item._id}
                      className="mb-3 border p-3 rounded d-flex justify-content-between flex-wrap"
                    >
                      {/* Right Side: Name & Description */}
                      <div className="text-end">
                        <h6 className="mb-1">{item.name}</h6>
                        <Badge color="light-primary">{item.description}</Badge>
                      </div>

                      {/* Left Side: Status & Date */}
                      <div className="text-start">
                        <div className="f-light f-w-500 f-12 mb-1">
                          <Badge color={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                        </div>
                        <div className="text-muted f-12">
                          {formatDate(item.createdAt)}{" "}
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
