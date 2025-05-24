import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, Col, Spinner } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CommonDropdown from "@/common-components/CommonDropdown";
import { SpecialDiscount, TotalProfit } from "@/constants";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getAllIncomeTransactionAsync, resetFetched } from "@/redux-toolkit/slices/fundSlice";
import { IIncomeTransaction } from "@/types";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";

// Base chart options (unchanged)
const baseChartOptions: any = {
  chart: {
    height: 255,
    type: "line",
    toolbar: { show: false },
    dropShadow: {
      enabled: true,
      top: 4,
      left: 0,
      blur: 2,
      colors: ["var(--theme-default)", "#83BF6E", "#F99B0D"],
      opacity: 0.02,
    },
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    strokeDashArray: 6,
    position: "back",
    xaxis: { lines: { show: false } },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  },
  colors: ["var(--theme-default)", "#83BF6E", "#F99B0D"],
  stroke: {
    width: 3,
    curve: "smooth",
    opacity: 1,
  },
  markers: {
    size: 0,
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    marker: { show: true },
    y: {
      formatter: (val: number) => `${val.toFixed(2)}`,
    },
  },
  xaxis: {
    type: "category",
    crosshairs: { show: false },
    labels: {
      style: {
        colors: "var(--chart-text-color)",
        fontSize: "12px",
        fontFamily: "Rubik, sans-serif",
        fontWeight: 400,
      },
    },
    axisTicks: { show: false },
    axisBorder: { show: false },
    tooltip: { enabled: false },
  },
  fill: {
    opacity: 1,
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 1,
      opacityFrom: 0.95,
      opacityTo: 1,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    tickAmount: 5,
    labels: {
      formatter: (val: number) => `${val.toFixed(0)}`,
    },
  },
  legend: { show: false },
  responsive: [
    {
      breakpoint: 651,
      options: { chart: { height: 210 } },
    },
  ],
};

const TotalProfitCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    incomeTransaction,
    loading: { getAllIncomeTransaction },
    fetched,
  } = useAppSelector((state) => state.fund);
  const currency = useCompanyCurrency();
  const [chartData, setChartData] = useState<any>({
    series: [{ name: "No Data", type: "line", data: [0] }],
    options: {
      ...baseChartOptions,
      xaxis: { ...baseChartOptions.xaxis, categories: ["No Data"] },
    },
  });
  const [filter, setFilter] = useState<string>("Weekly");
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  const fetchAndProcessData = useCallback(
    async (
      timeFilter: string,
      transactions: IIncomeTransaction[] | null | undefined,
      isLoading: boolean,
      isFetched: boolean
    ) => {
      try {
        setIsDataLoaded(false);

        // Check if transactions are null, undefined, or empty
        const isTransactionsEmpty = !transactions || transactions.length === 0;

        // Fetch only if not loading, transactions are empty, and not already fetched
        if (!isLoading && isTransactionsEmpty && !isFetched) {
          // console.log("Fetching transactions"); // Debugging log
          await dispatch(getAllIncomeTransactionAsync({})).unwrap();
          return; // Exit early to let useEffect re-run with updated transactions
        }

        // If transactions are empty but fetched, show "No Data" without resetting fetched
        if (isTransactionsEmpty && isFetched) {
          // console.log("No transactions available, but fetched"); // Debugging log
          setChartData({
            series: [{ name: "No Data", type: "line", data: [0] }],
            options: {
              ...baseChartOptions,
              xaxis: { ...baseChartOptions.xaxis, categories: ["No Data"] },
            },
          });
          setTotalProfit(0);
          setIsDataLoaded(true);
          return;
        }

        // If transactions exist, process them
        if (transactions) {
          // Filter transactions by createdAt and status
          const now = moment();
          let filteredTransactions: IIncomeTransaction[] = transactions.filter(
            (t) => t.status === 1 && moment(t.createdAt).isValid()
          );
          if (timeFilter === "Weekly") {
            filteredTransactions = filteredTransactions.filter((t) =>
              moment(t.createdAt).isAfter(now.clone().subtract(1, "week"))
            );
          } else if (timeFilter === "Monthly") {
            filteredTransactions = filteredTransactions.filter((t) =>
              moment(t.createdAt).isAfter(now.clone().subtract(1, "month"))
            );
          } else if (timeFilter === "Yearly") {
            filteredTransactions = filteredTransactions.filter((t) =>
              moment(t.createdAt).isAfter(now.clone().subtract(1, "year"))
            );
          }

          // Group transactions by source, filtering out undefined sources
          const sources = Array.from(
            new Set(
              filteredTransactions
                .map((t) => t.source)
                .filter((s): s is string => s != null)
            )
          );

          // Group transactions by date (day only)
          const dates = Array.from(
            new Set(
              filteredTransactions
                .map((t) => moment(t.createdAt).format("YYYY-MM-DD"))
                .filter((d): d is string => d != null)
            )
          ).sort((a, b) => moment(a).valueOf() - moment(b).valueOf());

          // Create series for each source
          const series = sources.length
            ? sources.map((source) => ({
                name: source,
                type: "line",
                data: dates.map((date) => {
                  const transactionsOnDate = filteredTransactions.filter(
                    (t) =>
                      t.source === source &&
                      moment(t.createdAt).format("YYYY-MM-DD") === date
                  );
                  return transactionsOnDate.reduce(
                    (sum, t) => sum + t.amount,
                    0
                  );
                }),
              }))
            : [{ name: "No Data", type: "line", data: [0] }];

          // Calculate total profit for status === 1
          const total = filteredTransactions.reduce(
            (sum, t) => sum + t.amount,
            0
          );
          setTotalProfit(total);

          // Update chart options with dynamic categories (dates)
          const updatedOptions = {
            ...baseChartOptions,
            xaxis: {
              ...baseChartOptions.xaxis,
              categories: dates.length
                ? dates.map((date) => moment(date).format("MMM DD"))
                : ["No Data"],
            },
          };

          setChartData({ series, options: updatedOptions });
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setChartData({
          series: [{ name: "No Data", type: "line", data: [0] }],
          options: {
            ...baseChartOptions,
            xaxis: { ...baseChartOptions.xaxis, categories: ["No Data"] },
          },
        });
        setTotalProfit(0);
        setIsDataLoaded(true);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchAndProcessData(
      filter,
      incomeTransaction,
      getAllIncomeTransaction,
      fetched.getAllIncomeTransaction
    );
  }, [filter, incomeTransaction, getAllIncomeTransaction, fetched.getAllIncomeTransaction, fetchAndProcessData]);

  const handleDropdownSelect = useCallback((selected: string) => {
    setFilter(selected);
  }, []);

  return (
    <Col xl="6" md="6">
      <Card className="height-equal title-line">
        <CardHeader className="card-no-border">
          <div className="header-top">
            <h2>{TotalProfit}</h2>
            <div className="card-header-right-icon">
              <CommonDropdown
                dropdownToggle={filter}
                dropdownItems={["Weekly", "Monthly", "Yearly"]}
                onSelect={handleDropdownSelect}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          {getAllIncomeTransaction || !isDataLoaded ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: 255 }}
            >
              <Spinner color="primary" />
            </div>
          ) : chartData.series[0]?.name === "No Data" ? (
            <div
              className="d-flex justify-content-center align-items-center text-muted"
              style={{ height: 255 }}
            >
              No transactions available
            </div>
          ) : (
            <>
              <div className="profit-data">
                <h2>
                  {currency}
                  {totalProfit.toLocaleString()}
                  <span className="f-light f-500 f-12">
                    (Another{" "}
                    <span className="txt-primary me-1">{currency}35,098</span>
                    to Goal)
                  </span>
                </h2>
              </div>
              <div className="profit-chart-container">
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  height={255}
                  type="line"
                />
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default TotalProfitCard;