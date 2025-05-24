"use client";

import { useEffect } from "react";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { CardBody } from "reactstrap";
import { getUserTeamMetricsAsync } from "@/redux-toolkit/slices/userSlice";
import type { IUserTeamMetric } from "@/types";

type MetricItem = {
  key: keyof IUserTeamMetric;
  label: string;
  color: string;
  icon: string;
  isPositive: boolean;
};

const metricMapping: MetricItem[] = [
  {
    key: "userTotalDirects",
    label: "Total Directs",
    color: "bg-light-success",
    icon: "payment",
    isPositive: true,
  },
  {
    key: "userActiveDirects",
    label: "Active Directs",
    color: "bg-light-secondary",
    icon: "transfer",
    isPositive: true,
  },
  {
    key: "userInActiveDirects",
    label: "Inactive Directs",
    color: "bg-light-warning",
    icon: "invoice",
    isPositive: false,
  },
  {
    key: "userTotalGeneration",
    label: "Total Generation",
    color: "bg-light-info",
    icon: "payment",
    isPositive: true,
  },
];

const UpcomingTransactionBody = () => {
  const dispatch = useAppDispatch();
  const { userTeamMetric, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserTeamMetricsAsync());
  }, [dispatch]);

  return (
    <CardBody className="pt-0 transaction-list">
      <ul>
        {loading.getUserRankAndTeamMetric && (
          <li>
            <span className="f-light f-w-400">Loading team metrics...</span>
          </li>
        )}

        {error && (
          <li>
            <span className="txt-danger f-light f-w-400">Error: {error}</span>
          </li>
        )}

        {!loading.getUserRankAndTeamMetric &&
          !error &&
          userTeamMetric &&
          metricMapping.map((item, i) => (
            <li key={i}>
              <div className="transaction-content">
                <div className={`transaction-icon ${item.color}`}>
                  <SvgIcon iconId={item.icon} />
                </div>
                <div className="transaction-right-content">
                  <div>
                    <h6>{item.label}</h6>
                    <span className="f-light f-w-400">
                    </span>
                  </div>
                  <span className="f-w-500">
                    {userTeamMetric[item.key]}
                  </span>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </CardBody>
  );
};

export default UpcomingTransactionBody;
