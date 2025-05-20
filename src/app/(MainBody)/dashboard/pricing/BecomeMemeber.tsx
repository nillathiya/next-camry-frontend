"use client";

import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Spinner,
  Alert,
} from "reactstrap";
import CommonCardHeader from "@/common-components/CommonCardHeader";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { useEffect, useState } from "react";
import { getPinSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import { getAllUserOrdersAsync, userTopUpAsync } from "@/redux-toolkit/slices/userSlice";
import { toast } from "react-toastify";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";

const BecomeMember = () => {
  const [error, setError] = useState("");
  const {
    pinSettings,
    loading: { getPinSettings },
  } = useAppSelector((state) => state.setting);
  const {
    loading: { userTopUp }, // Replace 'topUpUser' with the correct property, e.g., 'userTopUp'
  } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const currency = useCompanyCurrency();
  const [selectedPin, setSelectedPin] = useState("");

  useEffect(() => {
    const fetchPinSettings = async () => {
      try {
        await dispatch(getPinSettingsAsync()).unwrap();
      } catch (error) {
        setError(error || "Package Not Found");
      }
    };
    fetchPinSettings();
  }, []);

  const handleTopUp = async (pinId: string) => {
    try {
      const formData = {
        pinId,
      };
      await dispatch(userTopUpAsync(formData)).unwrap();
      toast.success("Top-up successful!");

      await Promise.all([
        dispatch(getPinSettingsAsync()).unwrap(),
        dispatch(getAllUserOrdersAsync()).unwrap(),
      ]);
    } catch (error) {
      toast.error(error || "Server Error,Please Try Later");
    }
  };
  return (
    <Card>
      <CommonCardHeader title={"Become Member"} />
      <CardBody className="pricing-block">
        <Row>
          {getPinSettings ? (
            <div className="text-center py-4">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <Alert color="danger" className="m-3">
              {error}
            </Alert>
          ) : pinSettings.length === 0 ? (
            <Alert color="info" className="m-3">
              No Package Found
            </Alert>
          ) : (
            pinSettings.map((setting, index) => (
              <Col lg="3" sm="6" className="box-col-3" key={index}>
                <div className="pricingtable">
                  <div className="pricingtable-header">
                    <h4 className="title">{setting.name}</h4>
                  </div>
                  <div className="price-value">
                    <span className="currency">{currency}</span>
                    <span className="amount">{setting.rateMin}</span>
                    <span className="duration">/mo</span>
                  </div>
                  {setting.description && (
                    <ul className="pricing-content">
                      <li key={index}>{setting.description}</li>
                    </ul>
                  )}

                  <div className="pricingtable-signup">
                    <Button
                      tag="a"
                      size="lg"
                      color="primary"
                      href={"#"}
                      disabled={userTopUp}
                      onClick={() => handleTopUp(setting._id)}
                    >
                      {userTopUp ? <Spinner color="primary" /> : "Buy"}
                    </Button>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </CardBody>
    </Card>
  );
};

export default BecomeMember;
