import { TodayRevenue } from "@/constants";
import { RevenueChartOptions } from "@/data/general/dashboard/default";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader, Col } from "reactstrap";

const Revenue = () => {
  return (
    <Col xl="6" sm="6">
      <Card className="title-line widget-1">
        <CardHeader className="card-no-border">
          <h2>Revenue</h2>
          <span className="f-w-500 f-12 f-light mt-0">
            {TodayRevenue} <span className="txt-primary">30% OFF</span>
          </span>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="revenue-chart-container">
            <ReactApexChart type="line" height={140} options={RevenueChartOptions} series={RevenueChartOptions.series} />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Revenue;
