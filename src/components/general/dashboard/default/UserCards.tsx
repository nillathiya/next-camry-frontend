import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { UserCardData } from "@/data/general/dashboard/default";
import { Card, CardBody, Col, Row } from "reactstrap";

const UserCards = () => {
  return (
    <Col xl="6" className=" box-col-6">
      <Row className="tread-cards">
        {UserCardData.map((item, i) => (
          <Col key={i} xl="6" sm="6">
            <Card className=" widget-1">
              <CardBody className="common-box">
                <div className={`${item.color} widget-icon widget-round`}>
                  <SvgIcon iconId={item.svg} />
                </div>
                <div>
                  <h3 className="f-w-600">{item.heading}</h3>
                  <span className="f-w-500 f-light f-12">{item.title}</span>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Col>
  );
};

export default UserCards;
