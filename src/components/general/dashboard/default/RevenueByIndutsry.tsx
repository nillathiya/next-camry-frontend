import CommonCardHeader from "@/common-components/CommonCardHeader";
import { CappingMultiplier, RevenueByIndustry } from "@/constants";
import { Card, CardBody, Col, Spinner } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { ReactNode, useEffect, useMemo } from "react";
import {
  getAllUserOrdersAsync,
  getUserCappingStatusAsync,
} from "@/redux-toolkit/slices/userSlice";
import "swiper/css";
import "swiper/css/pagination";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";

interface CappingData {
  percentage?: string;
  amount: string;
  text: string;
  icon: ReactNode;
  class: string;
}

const RevenueWidget = () => {
  const dispatch = useAppDispatch();
  const { userCappingStatus, loading, userOrders } = useAppSelector(
    (state) => state.user
  );

  const companyCurrency = useCompanyCurrency();
  // Fetch data only when needed
  useEffect(() => {
    if (!userCappingStatus && !loading.getUserCappingStatus) {
      dispatch(getUserCappingStatusAsync());
    }
    if (!loading.getUserOrders && userOrders.length === 0) {
      dispatch(getAllUserOrdersAsync());
    }
  }, []);

  // Calculate totals
  const totalPackageAmount = useMemo(
    () =>
      userOrders.reduce((acc, order) => {
        if (order.status === 1) acc += order.amount;
        return acc;
      }, 0),
    [userOrders]
  );

  const userTotalCapping = useMemo(
    () => Number(totalPackageAmount) * Number(CappingMultiplier),
    [totalPackageAmount]
  );

  const remainingCap = userCappingStatus?.remainingCap || 0;
  const cappingProgress = useMemo(
    () =>
      remainingCap && userTotalCapping
        ? Math.min((remainingCap / userTotalCapping) * 100, 100).toFixed(1)
        : "0",
    [remainingCap, userTotalCapping]
  );

  const progressStyles = [
    {
      progressClass:
        "progress progress-stripe-primary with-light-background mt-2",
      textClass: "text-primary",
    },
    {
      progressClass:
        "progress progress-stripe-secondary with-light-background mt-2",
      textClass: "text-secondary",
    },
    {
      progressClass:
        "progress progress-stripe-success with-light-background mt-2",
      textClass: "text-success",
    },
  ];

  const getProgressStyle = (index: number) => {
    return progressStyles[index % progressStyles.length];
  };

  const textMapping: Record<string, string> = {
    userTotalCapping: "Total Capping",
    totalPackageAmount: "Total Package",
    remainingCap: "Remaining Capping",
  };

  const iconMapping: Record<string, string> = {
    userTotalCapping: "fa-cube",
    totalPackageAmount: "fa-wallet",
    remainingCap: "fa-chart-line",
  };

  // Prepare capping data
  const cappingData: CappingData[] = useMemo(() => {
    const values = {
      userTotalCapping: userTotalCapping.toFixed(1),
      totalPackageAmount: totalPackageAmount.toFixed(1),
      remainingCap: remainingCap.toFixed(1),
    };

    return Object.entries(values).map(([key, value], index) => {
      const { progressClass, textClass } = getProgressStyle(index);
      return {
        amount: `${companyCurrency}${value}`,
        percentage: key === "remainingCap" ? `${cappingProgress}%` : undefined,
        text: textMapping[key],
        icon: <i className={`fa ${textClass} ${iconMapping[key]} me-1`} />,
        class: progressClass,
      };
    });
  }, [userTotalCapping, totalPackageAmount, remainingCap, cappingProgress]);

  // Check if data is loading
  const isLoading = loading.getUserCappingStatus || loading.getUserOrders;

  return (
    <Col xl={6} sm={6} className="revenue-column col-xxl-100 box-col-12">
      <Card className="title-line widget-1">
        <CommonCardHeader
          headClass="card-no-border"
          title={"Capping Overview"}
        />
        <CardBody className="pt-0">
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: 100 }}
            >
              <Spinner color="primary" />
            </div>
          ) : (
            <div className="revenue-slider-wrapper">
              <Swiper
                slidesPerView={1}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                spaceBetween={50}
                className="revenue-swiper"
              >
                {cappingData.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="light-card satisfaction-box progress-widget">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="social-content">
                          {item.icon}
                          <span className="f-w-500 f-light">{item.text}</span>
                        </span>
                        <span className="f-12 f-w-500 f-light">
                          {item.amount}
                        </span>
                      </div>
                      {item.percentage && (
                        <div className={item.class} style={{ height: 5 }}>
                          <div
                            className="progress-bar-animated progress-bar-striped"
                            role="progressbar"
                            style={{ width: item.percentage }}
                            aria-valuenow={parseFloat(item.percentage)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default RevenueWidget;
