import { SalesPipeline, SpecialDiscount } from "@/constants";
import { SalesPipelineChartOptions } from "@/data/general/dashboard/default";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader, Col } from "reactstrap";

const SalesPipelineChart = () => {
  return (
    <Col xl="6" sm="6">
      <Card className="title-line widget-1 sales-pipeline">
        <CardHeader className="card-no-border">
          <h2>{SalesPipeline}</h2>
          <span className="f-w-500 f-12 f-light mt-0">
            {SpecialDiscount}
            <span className="txt-primary">60% OFF</span>
          </span>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="pipeline-chart-container">
            <ReactApexChart series={SalesPipelineChartOptions.series} options={SalesPipelineChartOptions} type="donut" height={290} width={290} />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SalesPipelineChart;
