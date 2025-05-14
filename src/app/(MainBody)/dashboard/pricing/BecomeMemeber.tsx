import { Button, Card, CardBody, Col, Row } from "reactstrap";
import CommonCardHeader from "@/common-components/CommonCardHeader";

interface BecomeMemberData {
  type: string;
  price: string;
  benefit: string[];
}
const BecomeMember = () => {
  const BecomeMemberData: BecomeMemberData[] = [
    {
      type: "standard",
      price: "10",
      benefit: ["xyx", "abc", "mym"],
    },
    {
      type: "standard",
      price: "10",
      benefit: ["xyx", "abc", "mym"],
    },
    {
      type: "standard",
      price: "10",
      benefit: ["xyx", "abc", "mym"],
    },
    {
      type: "standard",
      price: "10",
      benefit: ["xyx", "abc", "mym"],
    },
  ];
  return (
    <Card>
      <CommonCardHeader title={"Become Member"} />
      <CardBody className="pricing-block">
        <Row>
          {BecomeMemberData.map((item, index) => (
            <Col lg="3" sm="6" className="box-col-3" key={index}>
              <div className="pricingtable">
                <div className="pricingtable-header">
                  <h4 className="title">{item.type}</h4>
                </div>
                <div className="price-value">
                  <span className="currency">$</span>
                  <span className="amount">{item.price}</span>
                  <span className="duration">/mo</span>
                </div>
                <ul className="pricing-content">
                  {item.benefit.map((data, index) => (
                    <li key={index}>{data}</li>
                  ))}
                </ul>
                <div className="pricingtable-signup">
                  <Button tag="a" size="lg" color="primary" href={"#"}>
                    {"SignUp"}
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  );
};

export default BecomeMember;
