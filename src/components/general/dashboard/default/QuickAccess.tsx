"use client";
import { transactionItems } from "@/data/general/dashboard/default";
import Link from "next/link";
import { CardBody, CardHeader, Col, Row } from "reactstrap";
import { useEffect, useState } from "react";

const QuickAccess = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-only"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mb-4">
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          .animated-border {
            position: relative;
            width: 100%;
            border-radius: 20px;
            animation: animate 4s linear infinite;
            background: repeating-conic-gradient(
              from var(--a),
              #ff2770 0%,
              rgb(255, 207, 50) 5%,
              transparent 5%,
              transparent 40%,
               rgb(255, 174, 0) 50%
            );
          }

          .animated-border::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            border-radius: 20px;
            animation: animate 4s linear infinite;
            animation-delay: -1s;
            background: repeating-conic-gradient(from var(--a), #4562ff 0%, #45f3ff 5%, transparent 5%,
                        transparent 40%,rgb(10, 255, 120) 50%);
          }

          .animated-border::after {
            content: "";
            position: absolute;
            inset: 2px;
            border-radius: 15px;
            background: ${isDarkMode ? "#23262e" : "#ffffff"};
            z-index: 1;
          }

          .animated-inner {
            position: relative;
            border-radius: 15px;
            padding: 8px;
            z-index: 2;
            color: ${isDarkMode ? "#ffffff" : "#000000"};
          }

          @property --a {
            syntax: "<angle>";
            inherits: false;
            initial-value: 0deg;
          }

          @keyframes animate {
            0% { --a: 0deg; }
            100% { --a: 360deg; }
          }

          .Total_transaction_card_header {
            position: relative;
            padding-left: 15px;
          }

          // .Total_transaction_card_header::before {
          //   width: 4px;
          //   height: 26px;
          //   top: 20px;
          //   background: var(--theme-default);
          //   position: absolute;
          //   content: "";
          //   left: 0;
          // }

          .quick-access-link {
            font-size: 14px;
            color: inherit;
          }

          @media (max-width: 576px) {
            .quick-access-link {
              font-size: 10px !important;
            }
          }
        `}
      </style>

      <div className="animated-border">
        <div className="animated-inner">
          <Col xl="12" className="box-col-4 mb-1">
            <CardHeader className="border-0 pb-0 p-2 Total_transaction_card_header">
              <h2 style={{ marginTop: "11px" }}>{"Quick Access"}</h2>
            </CardHeader>

            <CardBody>
              <Row className="g-3" style={{ padding: "10px" }}>
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
                            marginBottom: "5px",
                            borderRadius: "25px",
                            boxShadow: `0px 33px 32px 0px ${item.shadowColor}`,
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
      </div>
    </div>
  );
};

export default QuickAccess;
