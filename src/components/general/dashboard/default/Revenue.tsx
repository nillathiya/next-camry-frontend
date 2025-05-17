import { TodayRevenue } from "@/constants";
import { RevenueChartOptions as baseOptions } from "@/data/general/dashboard/default";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getAllIncomeTransactionAsync } from "@/redux-toolkit/slices/fundSlice";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

// Chart data type definition
interface ChartData {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

const Revenue = () => {
  const dispatch = useAppDispatch();
  const [chartData, setChartData] = useState<ChartData>({
    categories: [],
    series: [],
  });
  const currency = useCompanyCurrency();

  const {
    incomeTransaction,
    loading: { getAllIncomeTransaction },
  } = useAppSelector((state) => state.fund);

  useEffect(() => {
    const fetchIncomeTransaction = async () => {
      try {
        await dispatch(getAllIncomeTransactionAsync({})).unwrap();
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    };
    if (!getAllIncomeTransaction && incomeTransaction.length === 0) {
      fetchIncomeTransaction();
    }
  }, [dispatch, getAllIncomeTransaction, incomeTransaction.length]);

  useEffect(() => {
    if (incomeTransaction.length > 0) {
      const now = dayjs();
      const last5Weeks = [...Array(5)].map((_, i) => {
        const week = now.subtract(4 - i, "week");
        return {
          label: `Week ${week.isoWeek()}`,
          start: week.startOf("isoWeek"),
          end: week.endOf("isoWeek"),
        };
      });

      const weeklyIncome = last5Weeks.map(({ start, end }) => {
        const total = incomeTransaction
          .filter(
            (tx) =>
              tx.status === 1 &&
              dayjs(tx.createdAt).isAfter(start) &&
              dayjs(tx.createdAt).isBefore(end)
          )
          .reduce((sum, tx) => sum + tx.amount, 0);

        return total;
      });

      setChartData({
        categories: last5Weeks.map((w) => w.label),
        series: [
          {
            name: "Weekly Income",
            data: weeklyIncome,
          },
        ],
      });
    }
  }, [incomeTransaction]);

  return (
    <Col xl="6" sm="12">
      <Card className="title-line widget-1">
        <CardHeader className="card-no-border">
          <h2>{TodayRevenue}</h2>
          <span className="f-w-500 f-12 f-light mt-0">
            {TodayRevenue} <span className="txt-primary">Last 5 Weeks</span>
          </span>
        </CardHeader>
        <CardBody className="pt-0">
          <div
            className="revenue-chart-container"
            style={{ overflowX: "auto", overflowY: "hidden" }}
          >
            <div style={{ minWidth: "500px" }}>
              <ReactApexChart
                type="line"
                height={140}
                options={{
                  ...baseOptions,
                  chart: {
                    ...baseOptions.chart,
                    toolbar: { show: true },
                    zoom: { enabled: true },
                  },
                  xaxis: {
                    categories: chartData.categories,
                    labels: { rotate: -35 },
                    tooltip: { enabled: true },
                  },
                  yaxis: {
                    min: 0,
                    max:
                      chartData.series.length > 0
                        ? Math.max(...chartData.series[0].data) * 1.1
                        : 100,
                    labels: {
                      formatter: (val) => `${currency}${val.toLocaleString()}`,
                    },
                  },
                  tooltip: {
                    y: {
                      formatter: (val) => `${currency}${val.toLocaleString()}`,
                      title: { formatter: () => "Weekly Total" },
                    },
                  },
                  dataLabels: { enabled: true },
                  stroke: { curve: "smooth" },
                }}
                series={chartData.series}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Revenue;
