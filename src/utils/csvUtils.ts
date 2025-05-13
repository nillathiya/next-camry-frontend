import { formatDate } from "@/lib/dateFormate";
import { TableColumn } from "react-data-table-component";
import { formatTxType } from "./stringUtils";

export const exportToCSV = <T>(
  data: T[],
  columns: TableColumn<T>[],
  filename: string = "export.csv"
): void => {
  const headers = columns.map((col) => col.name).join(",");

  const rows = data
    .map((item) =>
      columns
        .map((col) => {
          let name = String(col.name).toLowerCase();
          let value = col.selector ? col.selector(item) : "N/A";

          if (name.includes("date")) {
            value = formatDate(new Date(value as number));
          } else if (name.includes("tx type") || name.includes("transaction")) {
            value = formatTxType(String(value)); // Format transaction type
          }

          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");

  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
