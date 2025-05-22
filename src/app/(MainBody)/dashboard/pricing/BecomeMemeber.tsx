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
import {
  getAllUserOrdersAsync,
  getUserWalletAsync,
  userTopUpAsync,
} from "@/redux-toolkit/slices/userSlice";
import { toast } from "react-toastify";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";
import { useTopUpFundWallet } from "@/hooks/useUserSettings";
import { useWalletSettings } from "@/hooks/useWalletSettings";

const BecomeMember = () => {
  const [error, setError] = useState("");
  const {
    pinSettings,
    loading: { getPinSettings },
  } = useAppSelector((state) => state.setting);

  const {
    loading: { getUserWallet },
  } = useAppSelector((state) => state.user);

  const { loading: topUpFundWalletLoading, value: topUpFundWallet } =
    useTopUpFundWallet();

  const filterdTopUpFundWallet = topUpFundWallet?.filter(
    (wallet) => wallet.status
  );
  const dispatch = useAppDispatch();
  const currency = useCompanyCurrency();
  const [selectedPin, setSelectedPin] = useState("");
  const { getWalletBalanceBySlug, getWalletNameBySlug } = useWalletSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getPinSettingsAsync()).unwrap();
        await dispatch(getUserWalletAsync()).unwrap();
      } catch (error) {
        setError(error || "Package Not Found");
      }
    };
    fetchData();
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
        dispatch(getUserWalletAsync()).unwrap(),
      ]);
    } catch (error) {
      toast.error(error || "Server Error,Please Try Later");
    }
  };

  return (
    <Card>
      <CommonCardHeader title={"Become Member"} />
      <CardBody className="pricing-block">
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center">
              {topUpFundWalletLoading || getUserWallet ? (
                <Spinner size="sm" color="primary" />
              ) : topUpFundWallet !== null ? (
                <h5 className="mb-0 d-flex align-items-center flex-wrap">
                  {topUpFundWallet?.map((wallet, index) => (
                    <span key={wallet.key || index} className="me-3">
                      {getWalletNameBySlug(wallet.key)}: {currency} (
                      {Number(getWalletBalanceBySlug(wallet.key) ?? 0).toFixed(
                        2
                      )}
                      )
                    </span>
                  ))}
                </h5>
              ) : (
                <Alert color="warning" className="mb-0">
                  Unable to load wallet balance
                </Alert>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          {getPinSettings || getUserWallet ? (
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
                      disabled={topUpFundWalletLoading}
                      onClick={() => handleTopUp(setting._id)}
                    >
                      {topUpFundWalletLoading ? (
                        <Spinner color="primary" />
                      ) : (
                        "Buy"
                      )}
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
