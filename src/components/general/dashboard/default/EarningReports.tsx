import CommonDropdown from "@/common-components/CommonDropdown";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { EarningReportHeading, WeeklyEarningOverview } from "@/constants";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getAllIncomeTransactionAsync } from "@/redux-toolkit/slices/fundSlice";
import { ApexOptions } from "apexcharts";
import { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { TrendingDown } from "react-feather";
import { Badge, Card, CardHeader, CardBody, Col } from "reactstrap";

const EarningReports = () => {
  const dispatch = useAppDispatch();
  const { incomeTransaction, fetched, error: reduxError } = useAppSelector(
    (state) => state.fund
  );
  const [error, setError] = useState("");
  const currency = useCompanyCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  }>({
    series: [{ name: "Income", data: [0, 0, 0, 0, 0] }],
    options: {
      chart: { type: "bar", height: 255 },
      xaxis: { categories: ["", "", "", "", ""] },
      yaxis: { title: { text: `Income (${currency})` } },
      dataLabels: { enabled: false },
      colors: ["#1ab7ea"],
      plotOptions: {
        bar: {
          columnWidth: "20%",
        },
      },
    },
  });

  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchIncomeTransaction = async () => {
      try {
        await dispatch(getAllIncomeTransactionAsync({})).unwrap();
      } catch (error) {
        setError(error || "Server Error, Please Try Later");
      }
    };
    if (!fetched && incomeTransaction.length === 0) {
      console.log("Fetching income transactions...");
      fetchIncomeTransaction();
    }
  }, [dispatch, fetched, incomeTransaction]);

  const latestDate = useMemo(() => {
    if (incomeTransaction.length === 0) return null;
    return incomeTransaction
      .filter((tx) => tx.status === 1)
      .reduce(
        (latest, tx) => {
          const txDate = new Date(tx.createdAt);
          return txDate > latest ? txDate : latest;
        },
        new Date(incomeTransaction[0].createdAt)
      );
  }, [incomeTransaction]);

  useEffect(() => {
    if (incomeTransaction.length === 0 || !latestDate) return;

    let periods = [];
    let periodIncome = [0, 0, 0, 0, 0];
    let total = 0;

    if (selectedPeriod === "Monthly") {
      for (let i = 4; i >= 0; i--) {
        const date = new Date(latestDate);
        date.setMonth(latestDate.getMonth() - i);
        periods.push(
          date.toLocaleString("default", { month: "short", year: "numeric" })
        );
      }
      incomeTransaction.forEach((tx) => {
        if (tx.status === 1) {
          const txDate = new Date(tx.createdAt);
          const monthDiff =
            (latestDate.getFullYear() - txDate.getFullYear()) * 12 +
            (latestDate.getMonth() - txDate.getMonth());
          if (monthDiff >= 0 && monthDiff < 5) {
            periodIncome[4 - monthDiff] += tx.amount;
            total += tx.amount;
          }
        }
      });
    } else if (selectedPeriod === "Weekly") {
      for (let i = 4; i >= 0; i--) {
        const weekEnd = new Date(latestDate);
        weekEnd.setDate(latestDate.getDate() - i * 7);
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() - 6);
        periods.push(
          `${weekStart.toLocaleString("default", {
            month: "short",
            day: "numeric",
          })} - ${weekEnd.toLocaleString("default", {
            month: "short",
            day: "numeric",
          })}`
        );
      }
      incomeTransaction.forEach((tx) => {
        if (tx.status === 1) {
          const txDate = new Date(tx.createdAt);
          const daysDiff = Math.floor(
            (latestDate.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const weekIndex = Math.floor(daysDiff / 7);
          if (weekIndex >= 0 && weekIndex < 5) {
            periodIncome[4 - weekIndex] += tx.amount;
            total += tx.amount;
          }
        }
      });
    } else if (selectedPeriod === "Yearly") {
      for (let i = 4; i >= 0; i--) {
        const year = latestDate.getFullYear() - i;
        periods.push(year.toString());
      }
      incomeTransaction.forEach((tx) => {
        if (tx.status === 1) {
          const txDate = new Date(tx.createdAt);
          const yearDiff = latestDate.getFullYear() - txDate.getFullYear();
          if (yearDiff >= 0 && yearDiff < 5) {
            periodIncome[4 - yearDiff] += tx.amount;
            total += tx.amount;
          }
        }
      });
    }

    setChartData((prev) => ({
      ...prev,
      series: [{ name: "Income", data: periodIncome }],
      options: { ...prev.options, xaxis: { categories: periods } },
    }));
    setTotalIncome(total);
  }, [incomeTransaction, selectedPeriod, latestDate]);

  if (error || reduxError) {
    return (
      <Col md="6">
        <Card className="title-line">
          <CardHeader className="card-no-border">
            <h2>{EarningReportHeading}</h2>
          </CardHeader>
          <CardBody>
            <p>{error || reduxError}</p>
          </CardBody>
        </Card>
      </Col>
    );
  }

  if (fetched && incomeTransaction.length === 0) {
    return (
      <Col md="6">
        <Card className="title-line">
          <CardHeader className="card-no-border">
            <h2>{EarningReportHeading}</h2>
          </CardHeader>
          <CardBody>
            <p>No transactions found. Start earning today!</p>
          </CardBody>
        </Card>
      </Col>
    );
  }

  return (
    <Col md="6">
      <Card className="title-line">
        <CardHeader className="card-no-border">
          <div className="header-top">
            <div>
              <h2>
                {EarningReportHeading}
                <span className="d-block f-w-500 f-light f-12">
                  {WeeklyEarningOverview}
                </span>
              </h2>
            </div>
            <div className="card-header-right-icon">
              <CommonDropdown
                dropdownItems={["Monthly", "Weekly", "Yearly"]}
                onSelect={(item) => setSelectedPeriod(item)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="report-chart-container">
            <ReactApexChart
              series={chartData.series}
              height={255}
              type="bar"
              options={chartData.options}
            />
          </div>
          <ul className="report-list">
            <li>
              <div className="light-card report-icon">
                <SvgIcon iconId="expense" />
              </div>
              <div>
                <span className="f-12 f-w-500 f-light">Total Income</span>
                <h4 className="mt-1 f-w-600">
                  {currency}
                  {totalIncome.toFixed(2)}
                </h4>
              </div>
            </li>
          </ul>
        </CardBody>
      </Card>
    </Col>
  );
};

export default EarningReports;