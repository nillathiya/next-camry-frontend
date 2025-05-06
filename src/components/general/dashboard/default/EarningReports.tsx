import CommonDropdown from "@/common-components/CommonDropdown";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { EarningReportHeading, Profit, WeeklyEarningOverview } from "@/constants";
import { EarningChartOptions } from "@/data/general/dashboard/default";
import ReactApexChart from "react-apexcharts";
import { TrendingDown, TrendingUp } from "react-feather";
import { Badge, Card, CardBody, CardHeader, Col } from "reactstrap";

const EarningReports = () => {
  return (
    <Col md="6">
      <Card className="title-line">
        <CardHeader className="card-no-border">
          <div className="header-top">
            <div>
              <h2>
                {EarningReportHeading}
                <span className="d-block f-w-500 f-light f-12">{WeeklyEarningOverview}</span>
              </h2>
            </div>
            <div className="card-header-right-icon">
              <CommonDropdown />
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="report-chart-container">
            <ReactApexChart series={EarningChartOptions.series} height={255} type="bar" options={EarningChartOptions} />
          </div>
          <ul className="report-list">
            <li>
              <div className="light-card report-icon">
                <SvgIcon iconId="status-up" />
              </div>
              <div>
                <span className="f-12 f-w-500 f-light">{Profit}</span>
                <h4 className="mt-1 f-w-600">
                  $98.50
                  <Badge color="light-primary" className="ms-1 txt-primary">
                    <TrendingUp className="me-1"/>
                    13.5%
                  </Badge>
                </h4>
              </div>
            </li>
            <li>
              <div className="light-card report-icon">
                <SvgIcon iconId="expense" />
              </div>
              <div>
                <span className="f-12 f-w-500 f-light">Expense</span>
                <h4 className="mt-1 f-w-600">
                  $109.90
                  <Badge color="light-warning" className="ms-1 txt-warning">
                    <TrendingDown className="me-1"/>
                    1.05%
                  </Badge>
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
