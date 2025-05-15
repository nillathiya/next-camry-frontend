"use client";

import CommonCardHeader from "@/common-components/CommonCardHeader";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import {
  getAllIncomeTransactionAsync,
  getUserIncomeInfoAsync,
} from "@/redux-toolkit/slices/fundSlice";
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  Button,
  CardHeader,
} from "reactstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import { IIncomeTransaction } from "@/types";
import { formatDate } from "@/lib/dateFormate";
import { formatTxType } from "@/utils/stringUtils";
import { exportToCSV } from "@/utils/csvUtils";

// Custom styles
const styles = `
  .income-report-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: none;
  }

  .source-select {
    max-width: 300px;
    border-radius: 6px;
  }

  .data-table-container {
    transition: opacity 0.3s ease-in-out;
  }

  .data-table-container.loading {
    opacity: 0.5;
  }

  .table-row {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .card-header {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
    border-bottom: 1px solid #e9ecef;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

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

interface IncomeReportProps {
  transactions: IIncomeTransaction[];
  loading: boolean;
}

function IncomeReport() {
  const dispatch = useAppDispatch();
  const {
    incomeTransaction,
    userIncomeInfo,
    loading: { getAllIncomeTransaction, getUserIncomeInfo },
  } = useAppSelector((state) => state.fund);
  const [selectedSource, setSelectedSource] = useState("");
  const [isSourceSwitching, setIsSourceSwitching] = useState(false);

  const skipSlugs = ["main_wallet", "fund_wallet"];
  const filteredSlugs = Object.keys(userIncomeInfo).filter(
    (slug) => !skipSlugs.includes(slug)
  );

  // Handle source change with loading state
  useEffect(() => {
    if (selectedSource) {
      setIsSourceSwitching(true);
      const timer = setTimeout(() => {
        setIsSourceSwitching(false);
      }, 500); // Simulate loading delay
      return () => clearTimeout(timer);
    }
  }, [selectedSource]);

  const filteredTx = selectedSource
    ? incomeTransaction.filter((tx) => tx.source === selectedSource)
    : incomeTransaction;

  useEffect(() => {
    dispatch(getUserIncomeInfoAsync());
    dispatch(getAllIncomeTransactionAsync({}));
  }, [dispatch]);

  // Show spinner when either userIncomeInfo or transactions are loading
  if (getUserIncomeInfo) {
    return (
      <Container fluid>
        <div className="spinner-container">
          <Spinner color="primary">Loading...</Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="advance-init-table">
      <Row>
        <Col sm={12}>
          <Card>
            <CommonCardHeader title="Income Report" />
            <CardBody>
              <FormGroup>
                <Label for="sourceSelect" className="fw-semibold">
                  Filter by Source
                </Label>
                <Input
                  type="select"
                  name="source"
                  id="sourceSelect"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  disabled={getUserIncomeInfo}
                  className="source-select"
                >
                  <option value="">All Sources</option>
                  {filteredSlugs.map((source, index) => (
                    <option key={index} value={source}>
                      {source}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <IncomeReportComponent
                transactions={filteredTx}
                loading={getAllIncomeTransaction || isSourceSwitching}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function IncomeReportComponent({ transactions, loading }: IncomeReportProps) {
  const [filterText, setFilterText] = useState("");
  const debouncedFilterText = useDebounce(filterText, 300);

  const filteredTx = useMemo(() => {
    if (!debouncedFilterText) return transactions;

    const lowercasedFilter = debouncedFilterText.toLowerCase().trim();

    const includesFilter = (value: unknown): boolean => {
      if (value == null) return false;
      if (value instanceof Date) {
        return formatDate(value).toLowerCase().includes(lowercasedFilter);
      }
      if (typeof value === "string" && value.includes("_")) {
        return formatTxType(value).toLowerCase().includes(lowercasedFilter);
      }
      const stringValue = String(value).trim();
      return stringValue.toLowerCase().includes(lowercasedFilter);
    };

    const filterCode = (
      code: IIncomeTransaction["uCode"] | IIncomeTransaction["txUCode"]
    ): boolean => {
      if (code == null) return false;
      if (typeof code === "string") {
        return includesFilter(code);
      }
      if (typeof code === "object") {
        return (
          includesFilter(code.username) ||
          includesFilter(code.name) ||
          includesFilter(code._id)
        );
      }
      return false;
    };

    return transactions.filter((tx: IIncomeTransaction) =>
      [
        filterCode(tx.uCode),
        filterCode(tx.txUCode),
        includesFilter(tx.txType),
        includesFilter(tx.walletType),
        includesFilter(tx.amount),
        includesFilter(tx.txCharge),
        includesFilter(tx.postWalletBalance),
        includesFilter(tx.currentWalletBalance),
        includesFilter(tx.response),
        includesFilter(tx.remark),
        includesFilter(tx.status),
        includesFilter(tx.createdAt),
        includesFilter(tx.updatedAt),
      ].some(Boolean)
    );
  }, [transactions, debouncedFilterText]);

  const columns: TableColumn<IIncomeTransaction>[] = useMemo(
    () => [
      {
        name: "Username",
        selector: (row) =>
          typeof row.uCode === "object"
            ? row.uCode?.username || row.uCode?.name || "N/A"
            : "N/A",
        sortable: true,
        cell: (row) => (
          <span className="fw-medium">
            {typeof row.uCode === "object"
              ? row.uCode?.username || row.uCode?.name || "N/A"
              : "N/A"}
          </span>
        ),
      },
      {
        name: "Tx Type",
        selector: (row) => (row.txType ? formatTxType(row.txType) : "N/A"),
        sortable: true,
      },
      {
        name: "Amount",
        selector: (row) => row.amount || "N/A",
        sortable: true,
        cell: (row) => (
          <span className="text-primary fw-semibold">
            {row.amount || "N/A"}
          </span>
        ),
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => {
          const status = row.status;
          const label =
            status === 1
              ? "Confirmed"
              : status === 0
              ? "Pending"
              : status === 2
              ? "Failed"
              : "N/A";
          const colorClass =
            status === 1
              ? "btn btn-sm btn-success rounded-pill"
              : status === 0
              ? "btn btn-sm btn-warning rounded-pill"
              : status === 2
              ? "btn btn-sm btn-danger rounded-pill"
              : "btn btn-sm btn-secondary rounded-pill";
          return <span className={colorClass}>{label}</span>;
        },
        sortable: true,
      },
      {
        name: "Remark",
        selector: (row) => row.remark || "N/A",
        sortable: true,
      },
      {
        name: "Date",
        selector: (row) => new Date(row.createdAt).getTime(),
        cell: (row) => (
          <span className="text-success fw-medium">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        ),
        sortable: true,
      },
    ],
    []
  );

  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div
          id="row_create_filter"
          className="dataTables_filter d-flex align-items-center"
        >
          <Label className="me-2 fw-semibold" htmlFor="user-directs-search">
            Search:
          </Label>
          <Input
            id="user-directs-search"
            onChange={(e: React.ChangeEvent<HTMLFormElement>) =>
              setFilterText(e.target.value)
            }
            type="search"
            value={filterText}
            className="rounded-6"
            style={{ maxWidth: "250px" }}
            disabled={loading}
          />
        </div>
        {filterText && debouncedFilterText !== filterText && (
          <Spinner size="sm" color="primary" className="ms-2" />
        )}
        {filterText && (
          <Button
            color="secondary"
            outline
            size="sm"
            onClick={() => setFilterText("")}
          >
            Clear
          </Button>
        )}
        <Button
          color="primary"
          size="sm"
          onClick={() => exportToCSV(filteredTx, columns, "income_report.csv")}
        >
          Export to CSV
        </Button>
      </div>
    ),
    [filterText, debouncedFilterText, loading, filteredTx, columns]
  );

  return (
    <div
      className={`table-responsive theme-scrollbar data-table-container ${
        loading ? "loading" : ""
      }`}
      id="row_create"
    >
      <DataTable
        data={filteredTx}
        columns={columns}
        progressPending={loading}
        progressComponent={
          <div className="spinner-container">
            <Spinner color="primary">Loading...</Spinner>
          </div>
        }
        noDataComponent={<div>No transactions found.</div>}
        highlightOnHover
        striped
        pagination
        className="border rounded-8 custom-scrollbar"
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        customStyles={{
          rows: {
            style: {
              animation: "fadeIn 0.3s ease-in-out",
            },
          },
          table: {
            style: {
              borderRadius: "8px",
              overflow: "hidden",
            },
          },
          head: {
            style: {
              background: "#f8f9fa",
              fontWeight: "600",
            },
          },
        }}
      />
    </div>
  );
}

export default IncomeReport;
