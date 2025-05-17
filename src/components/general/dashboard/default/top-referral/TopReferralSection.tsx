"use client";
import React, { useEffect, useState } from "react";
import { ImagePath } from "@/constants";
import { TopReferralProgressData } from "@/data/general/dashboard/default";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { useCompanyCurrency } from "@/hooks/useCompanyInfo";
import { getUserIncomeInfoAsync } from "@/redux-toolkit/slices/fundSlice";
import { Spinner, CardBody } from "reactstrap";
import { useWalletSettings } from "@/hooks/useWalletSettings";

const TopReferralSection = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const currency = useCompanyCurrency();
  const { getWalletNameBySlug } = useWalletSettings();
  const {
    userIncomeInfo,
    loading: { getUserIncomeInfo },
  } = useAppSelector((state) => state.fund);

  useEffect(() => {
    const fetchUserIncomingInfo = async () => {
      try {
        await dispatch(getUserIncomeInfoAsync()).unwrap();
      } catch (error) {
        setError(error || "Server Error, Please Try Later");
      }
    };
    fetchUserIncomingInfo();
  }, []);

  const colors = [
    "primary",
    "success",
    "warning",
    "secondary",
    "info",
    "danger",
  ];

  const userIncomeArray = userIncomeInfo
    ? Object.entries(userIncomeInfo).map(([key, value], index) => ({
        userIncome: key,
        income: `${currency }${value}`,
        color: colors[index % colors.length],
      }))
    : [];

  const totalIncome = userIncomeInfo
    ? Object.values(userIncomeInfo).reduce((acc, val) => acc + Number(val), 0)
    : 0;

  return (
    <CardBody className="pt-0">
      {getUserIncomeInfo ? (
        <div className="spinner-container d-flex justify-content-center align-items-center py-5">
          <Spinner color="primary">Loading...</Spinner>
        </div>
      ) : (
        <>
          <div className="referral-content">
            <div className="referral-left-details">
              <div className="d-flex gap-1">
                <h2>{currency}{totalIncome.toLocaleString()}</h2>
              </div>
              <span className="f-light f-12 f-w-500">Total Income</span>
            </div>
            <div className="referral-image">
              <img src={`${ImagePath}/dashboard/1.png`} alt="vector" />
            </div>
          </div>

          <div className="progress-stacked referral-progress">
            {TopReferralProgressData.map((item, i) => (
              <div
                key={i}
                className="progress"
                role="progressbar"
                style={{ width: item.width }}
              >
                <div className={`progress-bar bg-${item.color}`} />
              </div>
            ))}
          </div>

          <ul className="referral-list">
            {userIncomeArray.map((item, i) => (
              <li key={i}>
                <div className={`activity-dot-${item.color}`} />
                <a className="f-light f-w-500" href="../applications/search">
                {getWalletNameBySlug(item.userIncome)}
                </a>
                <span className="f-12 f-w-500">{item.income}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </CardBody>
  );
};

export default TopReferralSection;
