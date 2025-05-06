import CommonCardHeader from "@/common-components/CommonCardHeader";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { VoteByConsumer } from "@/constants";
import { Card, CardBody, Col } from "reactstrap";

const SatisfactionRate = () => {
  return (
    <Col xl="6" sm="6" className="rate-column">
      <Card className="title-line widget-1">
        <CommonCardHeader  headClass="card-no-border" title={"Satisfaction Rate"} />
        <CardBody className="pt-0">
          <div className="light-card satisfaction-box common-box">
            <div className="widget-icon primary widget-round">
              <SvgIcon iconId="like-shape" />
            </div>
            <div>
              <h2>89,786(82%)</h2>
              <span className="f-light f-w-500 f-12">{VoteByConsumer}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SatisfactionRate;
