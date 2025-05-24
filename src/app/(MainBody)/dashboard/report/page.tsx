"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Spinner,
  Alert,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getAllIncomeTransactionAsync, resetFetched } from "@/redux-toolkit/slices/fundSlice";
import moment from "moment";
import { useWalletSettings } from "@/hooks/useWalletSettings";

const filterOptions = [
  "Today",
  "Last Week",
  "Last Month",
  "This Year",
  "Last Year",
  "Custom Range",
];

const Report = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("Today");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const { getWalletNameBySlug } = useWalletSettings();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const {
    incomeTransaction,
    fetched,
    loading: { getAllIncomeTransaction },
  } = useAppSelector((state) => state.fund);

  useEffect(() => {
    if (!fetched) {
      // Only fetch if not already fetched
      dispatch(getAllIncomeTransactionAsync({}))
        .unwrap()
        .catch((err: string) =>
          setError(err || "Server Error, Please Try Later")
        );
    }
  }, [dispatch, fetched]);

  // Handle filter changes (optional: fetch new data when filter changes)
  useEffect(() => {
    // Only refetch when filter/custom dates change AND fetched is true (i.e., data was already fetched)
    if (fetched) {
      dispatch(resetFetched("getAllIncomeTransaction"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, customStartDate, customEndDate]);

  useEffect(() => {
    // Only fetch if not already fetched
    if (!fetched) {
      const params: any = {};
      if (filter === "Custom Range" && customStartDate && customEndDate) {
        params.startDate = customStartDate;
        params.endDate = customEndDate;
      } else {
        // Map filter to date range for API params
        const now = moment();
        if (filter === "Today") {
          params.startDate = now.startOf("day").toISOString();
          params.endDate = now.endOf("day").toISOString();
        } else if (filter === "Last Week") {
          params.startDate = now.clone().subtract(7, "days").toISOString();
          params.endDate = now.toISOString();
        } else if (filter === "Last Month") {
          params.startDate = now.clone().subtract(30, "days").toISOString();
          params.endDate = now.toISOString();
        } else if (filter === "This Year") {
          params.startDate = now.startOf("year").toISOString();
          params.endDate = now.endOf("year").toISOString();
        } else if (filter === "Last Year") {
          params.startDate = moment()
            .subtract(1, "year")
            .startOf("year")
            .toISOString();
          params.endDate = moment()
            .subtract(1, "year")
            .endOf("year")
            .toISOString();
        }
      }
      dispatch(getAllIncomeTransactionAsync(params))
        .unwrap()
        .catch((err: string) =>
          setError(err || "Server Error, Please Try Later")
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetched, filter, customStartDate, customEndDate]);

  const filteredData = useMemo(() => {
    return incomeTransaction.filter((item) => {
      if (item.status !== 1) return false;
      const createdAt = moment(item.createdAt);
      if (!createdAt.isValid()) return false;
      // Client-side filtering (optional, since API now handles date filtering)
      return true; // Rely on API params for filtering
    });
  }, [incomeTransaction]);

  const incomeSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    filteredData.forEach((txn) => {
      const source = txn.source || "Unknown";
      summary[source] = (summary[source] || 0) + txn.amount;
    });
    return summary;
  }, [filteredData]);

  const totalIncome = useMemo(() => {
    return Object.values(incomeSummary).reduce(
      (acc: number, val: number) => acc + val,
      0
    );
  }, [incomeSummary]);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Income Report</h5>
        <div className="d-flex align-items-center">
          <Label className="me-2 mb-0 fw-bold">Filter:</Label>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
              caret
              color="light"
              className="bg-white text-primary border-primary"
            >
              {filter}
            </DropdownToggle>
            <DropdownMenu>
              {filterOptions.map((opt) => (
                <DropdownItem key={opt} onClick={() => setFilter(opt)}>
                  {opt}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        {filter === "Custom Range" && (
          <Row className="mb-4">
            <Col md="6">
              <FormGroup>
                <Label for="startDate" className="fw-bold">
                  Start Date
                </Label>
                <Input
                  type="date"
                  id="startDate"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="border-primary"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="endDate" className="fw-bold">
                  End Date
                </Label>
                <Input
                  type="date"
                  id="endDate"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="border-primary"
                />
              </FormGroup>
            </Col>
          </Row>
        )}
        {getAllIncomeTransaction ? (
          <div className="text-center py-5">
            <Spinner
              color="primary"
              style={{ width: "3rem", height: "3rem" }}
            />
            <p className="mt-2">Loading data...</p>
          </div>
        ) : error ? (
          <Alert color="danger" className="rounded-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        ) : Object.keys(incomeSummary).length === 0 ? (
          <Alert color="info" className="rounded-3">
            <i className="bi bi-info-circle me-2"></i>
            No income data found for selected filter.
          </Alert>
        ) : (
          <>
            <Row className="mb-4 align-items-center">
              <Col>
                <h4 className="text-success mb-0">
                  Total Income: ${totalIncome.toFixed(2)}
                </h4>
              </Col>
            </Row>
            <Row>
              {Object.entries(incomeSummary).map(([source, amount]) => (
                <Col lg="3" sm="6" key={source} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody className="text-center d-flex flex-column justify-content-center">
                      <h6 className="text-uppercase text-muted mb-2">
                        {getWalletNameBySlug(source)?.toUpperCase()}
                      </h6>
                      <h4 className="text-primary mb-0">
                        ${amount.toFixed(2)}
                      </h4>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default Report;