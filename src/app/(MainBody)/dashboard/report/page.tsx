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
import { getAllIncomeTransactionAsync } from "@/redux-toolkit/slices/fundSlice";
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
    loading: { getAllIncomeTransaction },
  } = useAppSelector((state) => state.fund);

  useEffect(() => {
    if (incomeTransaction.length === 0) {
      dispatch(getAllIncomeTransactionAsync({}))
        .unwrap()
        .catch((err: string) =>
          setError(err || "Server Error, Please Try Later")
        );
    }
  }, [dispatch, incomeTransaction.length]);

  const filteredData = useMemo(() => {
    const now = moment();
    return incomeTransaction.filter((item) => {
      const createdAt = moment(item.createdAt);
      if (!createdAt.isValid()) return false; // Skip invalid dates
      if (filter === "Today") {
        return createdAt.isSame(now, "day");
      } else if (filter === "Last Week") {
        return createdAt.isAfter(moment().subtract(7, "days"));
      } else if (filter === "Last Month") {
        return createdAt.isAfter(moment().subtract(30, "days"));
      } else if (filter === "This Year") {
        return createdAt.isSame(now, "year");
      } else if (filter === "Last Year") {
        const lastYear = moment().subtract(1, "year").year();
        return createdAt.year() === lastYear;
      } else if (
        filter === "Custom Range" &&
        customStartDate &&
        customEndDate
      ) {
        const start = moment(customStartDate);
        const end = moment(customEndDate);
        if (start.isValid() && end.isValid()) {
          return createdAt.isBetween(start, end, undefined, "[]");
        }
        return false;
      }
      return true;
    });
  }, [incomeTransaction, filter, customStartDate, customEndDate]);

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
