import { TotalTransactionHeading, SpecialDiscount } from "@/constants";
import { transactionItems } from "@/data/general/dashboard/default";
import { ImagePath, UpgradePlan } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const TotalTransaction = () => {
  return (
    <div style={{ margin: "-1px" }}>
      <Col
        xl="12"
        className="box-col-4 mb-4"
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scoped styles */}
        <style>
          {`
          .Total_transaction_card_header {
            position: relative;
            padding-left: 15px;
          }

          .Total_transaction_card_header::before {
            width: 4px;
            height: 26px;
            top: 20px;
            background: var(--theme-default);
            position: absolute;
            content: "";
            left: 0;
          }

          .quick-access-link {
            font-size: 14px;
          }

          @media (max-width: 576px) {
            .quick-access-link {
              font-size: 10px !important;
            }
          }

          .top-right-image {
            position: absolute;
            top: -9px;
            right: -5px;
            padding: 10px;
          }
        `}
        </style>

        {/* Top-right corner image */}
        <div className="top-right-image">
          <Image
            className="img-fluid"
            width={134}
            height={119}
            src={`${ImagePath}/dashboard/bg-1.png`}
            alt="vector pattern"
          />
        </div>

        <CardHeader className="border-0 pb-0 p-2 Total_transaction_card_header">
          <h2 style={{ marginTop: "11px" }}>{"Quick Access"}</h2>
        </CardHeader>

        <CardBody>
          <Row className="g-3" style={{ padding: "30px" }}>
            {transactionItems.map((item, index) => (
              <Col xs="3" key={index}>
                <div className="text-center">
                  <Link
                    href={item.href}
                    className="fw-bold text-decoration-none d-block mt-2 quick-access-link"
                  >
                    <div
                      className={`rounded ${item.bg} d-flex justify-content-center align-items-center mx-auto`}
                      style={{
                        width: "40px",
                        height: "40px",
                        padding: "10px",
                        marginBottom:"5px",
                        borderRadius: "25px",
                        boxShadow: `0px 33.0121px 32.2097px 0px ${item.shadowColor}`,
                      }}
                    >
                      {item.icon}
                    </div>
                    {item.label}
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Col>
    </div>
  );
};

export default TotalTransaction;
