import CommonDropdown from "@/common-components/CommonDropdown";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import {
  Href,
  NewReport,
  Performance,
  Report,
  SpecialDiscount,
  ThisWeek,
  TotalTransactionHeading,
} from "@/constants";
import { TotalTransactionChartOptions } from "@/data/general/dashboard/default";
import ReactApexChart from "react-apexcharts";
import { Button, CardBody, CardHeader, Col } from "reactstrap";

const TotalTransaction = () => {
  return (
    <Col xl="12" sm="6" className="col-xl-40 order-xl-ii discount-report">
      <CardHeader className="card-no-border">
        <div className="header-top">
          <div>
            <h2>
              {TotalTransactionHeading}
              <span className="d-block f-w-500 f-light f-12">
                {SpecialDiscount}
                <span className="txt-primary">60% OFF</span>
              </span>
            </h2>
          </div>
          <CommonDropdown />
        </div>
      </CardHeader>
      <CardBody className="transaction-report">
        <div className="total-transaction-wrapper">
          <ReactApexChart
            type="bar"
            height={200}
            series={TotalTransactionChartOptions.series}
            options={TotalTransactionChartOptions}
          />
        </div>
        <div className="report-content">
          <h5>{Report}</h5>
          <ul>
            <li>
              <span className="f-12 f-light f-w-500">{ThisWeek}</span>
              <h6>+78.32 %</h6>
              <div
                className="progress progress-stripe-primary with-light-background"
                style={{ height: 5 }}
              >
                <div
                  className="progress-bar-animated progress-bar-striped"
                  role="progressbar"
                  style={{ width: "70%" }}
                  aria-valuenow={10}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </li>
            <li>
              <span className="f-12 f-light f-w-500">{ThisWeek}</span>
              <h6>-34.52 %</h6>
              <div
                className="progress progress-stripe-success with-light-background"
                style={{ height: 5 }}
              >
                <div
                  className="progress-bar-animated progress-bar-striped"
                  role="progressbar"
                  style={{ width: "70%" }}
                  aria-valuenow={10}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </li>
          </ul>
        </div>
        <div className="report-button">
          <div>
            <h5 className="f-w-600">
              +95.62 %{" "}
              <span className="f-light f-12 f-w-500">{Performance}</span>
            </h5>
          </div>
          <Button color="primary" className="f-w-500 f-12" href={Href}>
            {NewReport}
            <SvgIcon iconId="logout" className="svg-sprite" />
          </Button>
        </div>
      </CardBody>
    </Col>
  );
};

export default TotalTransaction;
