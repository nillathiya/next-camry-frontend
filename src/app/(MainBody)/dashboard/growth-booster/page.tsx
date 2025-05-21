"use client";

import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getRewardSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import {
  getUserRankAndTeamMetricsAsync,
  updateProfileAsync,
} from "@/redux-toolkit/slices/userSlice";
import React, { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Table, Badge, Spinner, Container } from "reactstrap";

const GrowthBooster = () => {
  const dispatch = useAppDispatch();
  const {
    userRankAndTeamMetric,
    loading: { getUserRankAndTeamMetric },
  } = useAppSelector((state) => state.user);

  const {
    rewardSettings,
    loading: { getRewardSettings },
  } = useAppSelector((state) => state.setting);

  useEffect(() => {
    // Only dispatch if data is not already loaded
    if (!rewardSettings.length) {
      dispatch(getRewardSettingsAsync());
    }
    if (!userRankAndTeamMetric) {
      dispatch(getUserRankAndTeamMetricsAsync());
    }
  }, [dispatch, rewardSettings.length, userRankAndTeamMetric]);

  const userRank = userRankAndTeamMetric?.rank || 0;

  const maxRows = useMemo(
    () => Math.max(...rewardSettings.map((d) => d.value.length), 0),
    [rewardSettings]
  );

  const userLevel = useMemo(() => {
    if (!userRankAndTeamMetric || !rewardSettings.length) return 0;

    for (let level = 0; level < maxRows; level++) {
      const allCriteriaMet = rewardSettings.every((setting) => {
        const userValue = userRankAndTeamMetric[setting.slug] ?? 0;
        const requiredValue = parseFloat(setting.value[level]) || 0;

        if (
          setting.slug === "rank" ||
          setting.slug === "months" ||
          setting.slug === "reward"
        ) {
          return true;
        }

        return userValue >= requiredValue;
      });

      if (!allCriteriaMet) return level;
    }
    return maxRows;
  }, [rewardSettings, userRankAndTeamMetric, maxRows]);

  useEffect(() => {
    if (userRank !== userLevel + 1) {
      const updateData = {
        myRank: userLevel + 1,
      };
      dispatch(
        updateProfileAsync({
          payload: updateData,
          type: "data",
        })
      )
        .unwrap()
        .then(() => console.log("User rank updated successfully"))
        .catch(() => toast.error("Failed to update rank"));
    }
  }, [userRank, userLevel, dispatch]);

  const getUserProgress = (slug: string, levelIndex: number) => {
    if (!userRankAndTeamMetric) return "0 / 0";

    const userValue =
      slug === "growth_booster"
        ? userRankAndTeamMetric.total_team_business
        : userRankAndTeamMetric[slug] ?? 0;

    const requiredValue =
      rewardSettings.find((d) => d.slug === slug)?.value[levelIndex] || "0";

    switch (slug) {
      case "rank":
        return userValue === 0
          ? requiredValue
          : `${userValue}/${requiredValue}`;
      case "reward":
      case "self_business":
      case "direct_business":
      case "total_team_business":
      case "growth_booster":
        return `${userValue.toLocaleString()} / ${parseFloat(
          requiredValue
        ).toLocaleString()}`;
      default:
        return `${userValue} / ${requiredValue}`;
    }
  };

  return (
    <Container fluid>
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Camry Growth Booster</h3>
        </div>
        <div className="card-body p-4">
          {getRewardSettings ||
          getUserRankAndTeamMetric ||
          !userRankAndTeamMetric ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2">Loading...</p>
            </div>
          ) : rewardSettings.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No Reward settings available
            </div>
          ) : (
            <div className="table-responsive rounded">
              <Table hover bordered className="table-striped rounded">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Levels
                    </th>
                    {rewardSettings.map((d) => (
                      <th key={d.slug} scope="col" className="px-4 py-3">
                        {d.title ? d.title.toUpperCase() : "N/A"}
                      </th>
                    ))}
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: maxRows }).map((_, level) => {
                    const isAchieved = level < userLevel;
                    const isRunning = level === userLevel;
                    const isNext = level > userLevel;

                    return (
                      <tr
                        key={level}
                        className={
                          isRunning
                            ? "table-warning font-weight-bold"
                            : isAchieved
                            ? "table-success"
                            : ""
                        }
                      >
                        <td className="px-4 py-3 font-weight-bold">
                          Level {level + 1}
                        </td>
                        {rewardSettings.map((setting) => (
                          <td key={setting.slug} className="px-4 py-3">
                            {getUserProgress(setting.slug, level)}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          {isAchieved ? (
                            <Badge color="success" pill>
                              Level Achieved ✅
                            </Badge>
                          ) : isRunning ? (
                            <Badge color="warning" pill>
                              🔹 Running
                            </Badge>
                          ) : (
                            <Badge color="info" pill>
                              🚀 Next Level
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default GrowthBooster;