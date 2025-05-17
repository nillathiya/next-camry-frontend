import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Spinner } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import CommonDropdown from "@/common-components/CommonDropdown";
import { SpecialDiscount, TotalProfit } from "@/constants";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getAllIncomeTransactionAsync } from "@/redux-toolkit/slices/fundSlice";
import { IIncomeTransaction } from "@/types";

// Base chart options
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
    discrete: [
      {
        seriesIndex: 1,
        dataPointIndex: 3,
        fillColor: "#54BA4A",
        strokeColor: "var(--white)",
        size: 6,
      },
    ],
  },
  tooltip: {
    enabled: true,
    shared: false,
    intersect: false,
    marker: { width: 5, height: 5 },
  },
  xaxis: {
    type: "category",
    min: 0.9,
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
  yaxis: { tickAmount: 5 },
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
  } = useAppSelector((state) => state.fund);
  const [chartData, setChartData] = useState<any>({
    series: [],
    options: baseChartOptions,
  });
  const [filter, setFilter] = useState<string>("Weekly");
  const [totalProfit, setTotalProfit] = useState<number>(0);

  const fetchAndProcessData = async (timeFilter: string) => {
    try {
      if (!getAllIncomeTransaction && incomeTransaction.length === 0) {
        await dispatch(getAllIncomeTransactionAsync({})).unwrap();
      }

      // Filter transactions by createdAt based on timeFilter
      const now = moment();
      let filteredTransactions: IIncomeTransaction[] = incomeTransaction;
      if (timeFilter === "Weekly") {
        filteredTransactions = incomeTransaction.filter((t) =>
          moment(t.createdAt).isAfter(now.clone().subtract(1, "week"))
        );
      } else if (timeFilter === "Monthly") {
        filteredTransactions = incomeTransaction.filter((t) =>
          moment(t.createdAt).isAfter(now.clone().subtract(1, "month"))
        );
      } else if (timeFilter === "Yearly") {
        filteredTransactions = incomeTransaction.filter((t) =>
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
      // Sort dates and ensure they are strings
      const dates = Array.from(
        new Set(
          filteredTransactions
            .map((t) => t.createdAt)
            .filter((d): d is string => d != null)
        )
      ).sort((a, b) => moment(a).valueOf() - moment(b).valueOf());

      // Create series for each source
      const series = sources.map((source) => ({
        name: source,
        type: "line",
        data: dates.map((date) => {
          const transactionsOnDate = filteredTransactions.filter(
            (t) => t.source === source && t.createdAt === date
          );
          return transactionsOnDate.reduce((sum, t) => sum + t.amount, 0);
        }),
      }));

      // Calculate total profit
      const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
      setTotalProfit(total);

      // Update chart options with dynamic categories (dates)
      const updatedOptions = {
        ...baseChartOptions,
        xaxis: {
          ...baseChartOptions.xaxis,
          categories: dates.map((date) => moment(date).format("MMM DD")),
        },
      };

      setChartData({ series, options: updatedOptions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchAndProcessData(filter);
  }, [filter, incomeTransaction]);

  const handleDropdownSelect = (selected: string) => {
    setFilter(selected);
  };

  return (
    <Col xl="6" md="6">
      <Card className="height-equal title-line">
        <CardHeader className="card-no-border">
          <div className="header-top">
            <h2>
              {TotalProfit}
              <span className="f-light f-12 d-block f-w-500">
                {SpecialDiscount}
                <span className="txt-primary">60% OFF</span>
              </span>
            </h2>
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
          {getAllIncomeTransaction ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: 255 }}
            >
              <Spinner color="primary" />
            </div>
          ) : (
            <>
              <div className="profit-data">
                <h2>
                  ${totalProfit.toLocaleString()}
                  <span className="f-light f-500 f-12">
                    (Another <span className="txt-primary me-1">$35,098</span>to
                    Goal)
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
