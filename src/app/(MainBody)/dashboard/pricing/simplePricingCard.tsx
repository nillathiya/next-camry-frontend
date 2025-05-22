"use client";

import { Button, Card, CardBody, Col, Row, Alert, Spinner } from "reactstrap";
import CommonCardHeader from "@/common-components/CommonCardHeader";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getAllUserOrdersAsync } from "@/redux-toolkit/slices/userSlice";
import { formatDate } from "@/lib/dateFormate";

const SimplePricingCard = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const {
    userOrders,
    loading: { getUserOrders },
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        await dispatch(getAllUserOrdersAsync()).unwrap();
      } catch (error) {
        setError(error || "Package Not Found");
      }
    };
    fetchUserOrders();
  }, [dispatch]);

  // Sort userOrders by createdAt in ascending order
  const sortedOrders = [...userOrders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // console.log("userOrders",userOrders);
  // console.log("sortedOrders",sortedOrders);
  return (
    <Card className="shadow-sm border-0">
      <CommonCardHeader title={"Purchased Packages"} />
      <CardBody className="pricing-content py-4">
        <Row className="g-sm-4 g-3">
          {getUserOrders ? (
            <div className="text-center py-5">
              <Spinner color="primary" size="lg" />
            </div>
          ) : error ? (
            <Alert color="danger" className="m-3 rounded-3">
              {error}
            </Alert>
          ) : sortedOrders.length === 0 ? (
            <Alert color="info" className="m-3 rounded-3">
              No packages found
            </Alert>
          ) : (
            sortedOrders.map((order, index) => (
              <Col xl="3" sm="6" className="xl-50 box-col-6" key={index}>
                <Card
                  className="text-center pricing-simple shadow-lg border-0 rounded-3 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
                >
                  <CardBody className="p-4">
                    <h3 className="fw-bold text-primary mb-3">
                      {typeof order.pinId === "object"
                        ? order.pinId.name
                        : "N/A"}
                    </h3>
                    <h1 className="text-success mb-3">${order.amount}</h1>
                    <h5 className="text-muted mb-3">
                      {typeof order.pinId === "object" &&
                      order.pinId?.description
                        ? order.pinId.description
                        : "N/A"}
                    </h5>
                    <h6
                      className={`mb-3 fw-semibold ${
                        order.status === 1
                          ? "text-success"
                          : order.status === 0
                          ? "text-warning"
                          : "text-danger"
                      }`}
                    >
                      {order.status === 1
                        ? "Running"
                        : order.status === 0
                        ? "Pending"
                        : "Expired"}
                    </h6>
                    <h6 className="text-muted mb-0">
                      {formatDate(order.createdAt)}
                    </h6>
                  </CardBody>
                  <div className="p-3">
                    <Button
                      block
                      tag="a"
                      color="primary"
                      size="lg"
                      href={"#"}
                      disabled={true}
                      className="btn-gradient fw-bold rounded-pill"
                      style={{
                        background: "linear-gradient(90deg, #007bff, #00b4db)",
                        border: "none",
                      }}
                    >
                      Purchase
                    </Button>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </CardBody>
    </Card>
  );
};

export default SimplePricingCard;
