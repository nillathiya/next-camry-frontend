import CommonDropdown from "@/common-components/CommonDropdown";
import { SpecialDiscount, TotalProfit } from "@/constants";
import { ProfitChartOptions } from "@/data/general/dashboard/default";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader, Col } from "reactstrap";

const TotalProfitCard = () => {
  const chartOptions = {
    ...ProfitChartOptions,
    tooltip: {
      enabled: true,
      enabledOnSeries: true, 
    }
  };
  return (
    <Col xl="6" md="6">
      <Card className=" height-equal title-line">
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
              <CommonDropdown dropdownToggle="Weekly" dropdownItems={["Monthly", "Weekly", "Yearly"]} />
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="profit-data">
            <h2>
              $15,087
              <span className="f-light f-w-500 f-12">
                (Another <span className="txt-primary me-1">$35,098</span>to Goal){" "}
              </span>
            </h2>
          </div>
          <div className="profit-chart-container">
            <ReactApexChart options={chartOptions} series={chartOptions.series} height={255} type="line" />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TotalProfitCard;
