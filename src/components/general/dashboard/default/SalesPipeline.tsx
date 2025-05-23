import { SalesPipeline, SpecialDiscount } from "@/constants";
import ReactApexChart from "react-apexcharts";
import { Alert, Card, CardBody, CardHeader, Col } from "reactstrap";
import { ApexOptions } from "apexcharts";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import {
  getAllFundTransactionAsync,
  getAllIncomeTransactionAsync,
  selectedTotalIncomeAmount,
  selectedTotalWithdrawalAmount,
} from "@/redux-toolkit/slices/fundSlice";
import {
  getAllUserOrdersAsync,
  selectTotalOrderAmount,
} from "@/redux-toolkit/slices/userSlice";
import { useEffect, useMemo, useState } from "react";
import { FUND_TX_TYPE } from "@/lib/fundType";

const SalesPipelineChart = () => {
  const dispatch = useAppDispatch();
  const {
    loading: { getAllFundTransaction, getAllIncomeTransaction },
  } = useAppSelector((state) => state.fund);
  const {
    loading: { getUserOrders },
  } = useAppSelector((state) => state.user);
  const totalIncomeAmount = useAppSelector(selectedTotalIncomeAmount);
  const totalWithdrawalAmount = useAppSelector(selectedTotalWithdrawalAmount);
  const totalOrderAmount = useAppSelector(selectTotalOrderAmount);

  // State to manage error messages
  const [errors, setErrors] = useState<{
    userOrders?: string;
    fundTransactions?: string;
    incomeTransactions?: string;
  }>({});

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setErrors({});

      const apiCalls = [
        async () => {
          if (!getUserOrders && totalOrderAmount === 0) {
            try {
              await dispatch(getAllUserOrdersAsync()).unwrap();
            } catch {
              setErrors((prev) => ({
                ...prev,
                userOrders:
                  "Failed to fetch user orders. Please try again later.",
              }));
            }
          }
        },
        async () => {
          if (!getAllFundTransaction && totalWithdrawalAmount === 0) {
            try {
              await dispatch(
                getAllFundTransactionAsync({
                  txType: FUND_TX_TYPE.FUND_WITHDRAWAL,
                })
              ).unwrap();
            } catch {
              setErrors((prev) => ({
                ...prev,
                fundTransactions:
                  "Failed to fetch fund transactions. Please try again later.",
              }));
            }
          }
        },
        async () => {
          if (!getAllIncomeTransaction && totalIncomeAmount === 0) {
            try {
              await dispatch(getAllIncomeTransactionAsync({})).unwrap();
            } catch {
              setErrors((prev) => ({
                ...prev,
                incomeTransactions:
                  "Failed to fetch income transactions. Please try again later.",
              }));
            }
          }
        },
      ];

      await Promise.all(apiCalls.map((call) => call()));
    };

    fetchData();
  }, []);

  // Calculate percentages
  const series = useMemo(() => {
    const total = totalIncomeAmount + totalWithdrawalAmount + totalOrderAmount;
    if (total === 0) return [33.33, 33.33, 33.33];

    const incomePercent = (totalIncomeAmount / total) * 100;
    const withdrawalPercent = (totalWithdrawalAmount / total) * 100;
    const orderPercent = (totalOrderAmount / total) * 100;

    return [
      Number(incomePercent.toFixed(2)),
      Number(withdrawalPercent.toFixed(2)),
      Number(orderPercent.toFixed(2)),
    ];
  }, [totalIncomeAmount, totalWithdrawalAmount, totalOrderAmount]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      series,
      labels: ["Income", "Withdrawals", "Orders"],
      chart: {
        width: 220,
        height: 220,
        type: "donut",
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
          donut: {
            labels: {
              show: true,
              name: {
                offsetY: 4,
              },
              value: {
                show: true,
                fontSize: "16px",
                formatter: (val) => `${val}%`,
              },
              total: {
                show: true,
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                label: "Total",
                formatter: () => "100%",
                color: "#000",
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
      colors: ["#f99b0d", "#009DB5", "#7fbe71"],
      fill: {
        type: "gradient",
      },
      legend: {
        show: false, // Hides the default Apex legend
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
        {
          breakpoint: 1750,
          options: {
            chart: {
              offsetX: 10,
            },
            legend: {
              show: false,
            },
          },
        },
        {
          breakpoint: 1800,
          options: {
            chart: {
              width: 154,
              height: 154,
              offsetX: 40,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "lighten",
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: "darken",
            value: 0.85,
          },
        },
      },
    }),
    [series]
  );

  const isLoading =
    getUserOrders || getAllFundTransaction || getAllIncomeTransaction;

  // Function to dismiss an error
  const dismissError = (key: keyof typeof errors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  return (
    <Col xl="6" sm="6">
      <Card className="title-line widget-1 sales-pipeline">
        <CardHeader className="card-no-border">
          <h2>{"Transaction Distribution"}</h2>
        </CardHeader>
        <CardBody className="pt-0">
          {/* Display error alerts */}
          {Object.entries(errors).map(([key, message]) => (
            <Alert
              key={key}
              color="danger"
              isOpen={!!message}
              toggle={() => dismissError(key as keyof typeof errors)}
              className="mb-3"
            >
              {message}
            </Alert>
          ))}

          <div
          className="sales_content"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0rem",
            }}
          >
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                <ReactApexChart
                  series={series}
                  options={chartOptions}
                  type="donut"
                  height={140}
                  width={140}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    minWidth: 120,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{ color: "#f99b0d", fontSize: "20px" }}
                      aria-label="Income color"
                    >
                      ●
                    </span>
                    <span style={{ fontSize: "12px", fontWeight:"bold" }}>Income: {series[0]}%</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{ color: "#009DB5", fontSize: "20px" }}
                      aria-label="Withdrawals color"
                    >
                      ●
                    </span>
                    <span style={{ fontSize: "12px", fontWeight:"bold" }}>Withdrawals: {series[1]}%</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{ color: "#7fbe71", fontSize: "20px" }}
                      aria-label="Orders color"
                    >
                      ●
                    </span>
                    <span style={{ fontSize: "12px" , fontWeight:"bold" }}>Orders: {series[2]}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SalesPipelineChart;
