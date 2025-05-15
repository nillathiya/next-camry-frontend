import { TotalTransactionHeading, SpecialDiscount } from "@/constants";
import { transactionItems } from "@/data/general/dashboard/default";
import Link from "next/link";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const TotalTransaction = () => {
  return (
    <Col xl="12" className="box-col-6">
      <Card className="widget-1">
        <CardHeader className="border-0 pb-0">
          <h2>{TotalTransactionHeading}</h2>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            {transactionItems.map((item, index) => (
              <Col xl="6" sm="6" key={index}>
                <Card className="h-70">
                  <CardBody className="d-flex align-items-center gap-3">
                    <div
                      className={`d-flex align-items-center justify-content-center rounded-circle ${item.bg}`}
                      style={{ width: "50px", height: "40px", boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <Link
                        href={item.href}
                        className="fw-bold text-dark text-decoration-none"
                      >
                        {item.label}
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TotalTransaction;
