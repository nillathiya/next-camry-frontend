import { Button, Card, CardBody, Col, Row } from "reactstrap";
import CommonCardHeader from "@/common-components/CommonCardHeader";

const SimplePricingCard = () => {
    const SimplePricingData=[
        {
            tSimplePricingDataitle:"standard",
            price:"10",
            plan:"xyx"
        }
    ]
  return (
    <Card>
      <CommonCardHeader title={"Simple Pricing Card"} />
      <CardBody className="pricing-content">
        <Row className="g-sm-4 g-3">
          {SimplePricingData.map((item, index) => (
            <Col xl='3' sm='6' className="xl-50 box-col-6"key={index}>
              <Card className="text-center pricing-simple">
                <CardBody>
                  <h3>{item.tSimplePricingDataitle}</h3>
                  <h1>${item.price}</h1>
                  <h6 className="mb-0">{item.plan}</h6>
                </CardBody>
                <div>
                  <Button block tag="a" color="primary" size="lg" href={"#"}>{"Purchase"}</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  );
};

export default SimplePricingCard;
