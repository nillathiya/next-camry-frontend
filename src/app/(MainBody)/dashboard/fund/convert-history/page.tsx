"use client";

import { formatDate } from "@/lib/dateFormate";
import { FUND_TX_TYPE } from "@/lib/fundType";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import {
  getAllFundTransactionAsync,
  selectUserFundConvertHistory,
  selectUserFundTransfer,
} from "@/redux-toolkit/slices/fundSlice";
import { IFundTransaction } from "@/types/fund";
import { formatTxType } from "@/utils/stringUtils";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
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
  Button,
  Spinner,
} from "reactstrap";
import { exportToCSV } from "@/utils/csvUtils";
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

const DepositHistory = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.fund);
  const fundConvertHistory = useAppSelector(selectUserFundConvertHistory);
  const { data: session } = useSession();
  const [filterText, setFilterText] = useState("");
  const debouncedFilterText = useDebounce(filterText, 300);

  useEffect(() => {
    const fetchConvertHistory = async () => {
      try {
        const params = {
          txType: FUND_TX_TYPE.FUND_CONVERT,
        };
        await dispatch(getAllFundTransactionAsync(params)).unwrap();
      } catch (error) {
        toast.error(error || "Server Error, Please Try Later");
      }
    };
    fetchConvertHistory();
  }, []);
console.log("fundConvertHistory",fundConvertHistory);

  const filteredTx = useMemo(() => {
    if (!debouncedFilterText) return fundConvertHistory;

    const lowercasedFilter = debouncedFilterText.toLowerCase().trim();

    // Helper function to safely check if a value includes the filter text
    const includesFilter = (value: unknown): boolean => {
      if (value == null) return false;
      // Handle Date objects
      if (value instanceof Date) {
        return formatDate(value).toLowerCase().includes(lowercasedFilter);
      }
      // Handle txType specifically
      if (typeof value === "string" && value.includes("_")) {
        return formatTxType(value).toLowerCase().includes(lowercasedFilter);
      }
      // Convert to string, trim, and lowercase for strings or numbers
      const stringValue = String(value).trim();
      return stringValue.toLowerCase().includes(lowercasedFilter);
    };

    // Helper function to filter uCode or txUCode (string, null, or object)
    const filterCode = (
      code: IFundTransaction["uCode"] | IFundTransaction["txUCode"]
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

    return fundConvertHistory.filter((tx: IFundTransaction) =>
      [
        filterCode(tx.uCode),
        filterCode(tx.txUCode),
        includesFilter(tx.txType),
        includesFilter(tx.debitCredit),
        includesFilter(tx.fromWalletType),
        includesFilter(tx.walletType),
        includesFilter(tx.amount),
        includesFilter(tx.txCharge),
        includesFilter(tx.paymentSlip),
        includesFilter(tx.txNumber),
        includesFilter(tx.uuid),
        includesFilter(tx.postWalletBalance),
        includesFilter(tx.currentWalletBalance),
        includesFilter(tx.method),
        includesFilter(tx.account),
        includesFilter(tx.withdrawalAccountType),
        includesFilter(tx.withdrawalAccount),
        includesFilter(tx.withdrawalMethod),
        includesFilter(tx.response),
        includesFilter(tx.reason),
        includesFilter(tx.remark),
        includesFilter(tx.isRetrieveFund),
        includesFilter(tx.status),
        includesFilter(tx.createdAt),
        includesFilter(tx.updatedAt),
      ].some(Boolean)
    );
  }, [fundConvertHistory, debouncedFilterText]);

  const columns: TableColumn<IFundTransaction>[] = useMemo(
    () => [
      {
        name: "Username",
        selector: (row) =>
          typeof row.uCode === "object"
            ? row.uCode?.username || row.uCode?.name || "N/A"
            : "N/A",
        sortable: true,
        cell: (row) => {
          if (typeof row.uCode === "object") {
            return (
              <span>
                {row.uCode?.username
                  ? row.uCode.username
                  : row.uCode?.name
                  ? row.uCode.name
                  : "N/A"}
              </span>
            );
          }
          return "N/A";
        },
      },
      {
        name: "Tx Type",
        selector: (row) => (row.txType ? formatTxType(row.txType) : "N/A"),
        sortable: true,
      },
      {
        name: "Debit/Credit",
        selector: (row) => row.debitCredit || "N/A",
        sortable: true,
      },
      {
        name: "Amount",
        selector: (row) => row.amount || "N/A",
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => {
          const status = row.status;
          return status === 1
            ? "Confirmed"
            : status === 0
            ? "Pending"
            : status === 2
            ? "Rejected"
            : "N/A";
        },
        cell: (row) => {
          const status = row.status;
        
          const label =
            status === 1
              ? "Confirmed"
              : status === 0
              ? "Pending"
              : status === 2
              ? "Rejected"
              : "N/A";
        
          const colorClass =
            status === 1
              ? "btn btn-sm btn-success rounded-pill"
              : status === 0
              ? "btn btn-sm btn-primary rounded-pill"
              : status === 2
              ? "btn btn-sm btn-danger rounded-pill"
              : "btn btn-sm btn-secondary rounded-pill";
        
          return (
            <span
              className={colorClass}
              style={{
                whiteSpace: "nowrap",
                fontSize: "13px",
                padding: "4px 8px",
                minWidth: "90px",
                display: "inline-block",
              }}
            >
              {label}
            </span>
          );
        },
        sortable: true,
      },
      {
        name: "Date",
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
          onChange={(e: React.ChangeEvent<HTMLFormElement | HTMLInputElement>) =>
            setFilterText(e.target.value)
          }
          type="search"
          value={filterText}
          aria-label="Search user directs by username, name, email, contact, or wallet address"
          disabled={loading}
        />
        {filterText && debouncedFilterText !== filterText && (
          <span className="ms-2">Filtering...</span>
        )}
        {filterText && (
          <Button
            color="secondary"
            outline
            size="sm"
            className="ms-2"
            onClick={() => setFilterText("")}
            aria-label="Clear search filter"
          >
            Clear
          </Button>
        )}
        <Button
          color="primary"
          size="sm"
          className="ms-2"
          onClick={() =>
            exportToCSV(filteredTx, columns, "deposit_history.csv")
          }
          aria-label="Export table data to CSV"
        >
          Export
        </Button>
      </div>
    );
  }, [filterText, debouncedFilterText, loading]);

  return (
    <Container fluid className="advance-init-table">
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader className="pb-0 card-no-border">
              <h2>Convert History</h2>
            </CardHeader>
            <CardBody>
              <div className="table-responsive theme-scrollbar" id="row_create">
                <DataTable
                  data={filteredTx}
                  columns={columns}
                  progressPending={loading}
                  progressComponent={
                    <Spinner color="primary">Loading...</Spinner>
                  }
                  noDataComponent={
                    <div>Fund Convert Transaction Not Found.</div>
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
    </Container>
  );
};

export default DepositHistory;
