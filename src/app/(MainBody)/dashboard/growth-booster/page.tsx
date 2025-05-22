"use client";

import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getRewardSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import {
  getUserRewardTeamMetricsAsync,
  updateProfileAsync,
} from "@/redux-toolkit/slices/userSlice";
import { IRewardSettings } from "@/types";
import React, { useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { Table, Badge, Spinner, Container } from "reactstrap";

const GrowthBooster = () => {
  const dispatch = useAppDispatch();
  const {
    userRewardTeamMetrics,
    loading: { getUserRewardTeamMetrics },
  } = useAppSelector((state) => state.user);

  const {
    rewardSettings,
    loading: { getRewardSettings },
  } = useAppSelector((state) => state.setting);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    // Only dispatch if data is not already loaded
    if (!rewardSettings.length) {
      dispatch(getRewardSettingsAsync());
    }
    if (
      !userRewardTeamMetrics ||
      (typeof userRewardTeamMetrics === "object" &&
        Object.keys(userRewardTeamMetrics).length === 0)
    ) {
      dispatch(getUserRewardTeamMetricsAsync());
    }

    hasFetched.current = true;
  }, [dispatch, rewardSettings.length, userRewardTeamMetrics]);

  const userRank = userRewardTeamMetrics?.rank || 0;

  const maxRows = useMemo(
    () =>
      Math.max(
        ...rewardSettings.map((d: IRewardSettings) => d.value.length),
        0
      ),
    [rewardSettings]
  );

  // Check if a specific level is achieved
  const isLevelAchieved = (level: number): boolean => {
    if (!userRewardTeamMetrics || !rewardSettings.length) return false;

    return rewardSettings.every((setting: IRewardSettings) => {
      const requiredValueRaw = setting.value[level];
      const requiredValue =
        typeof requiredValueRaw === "string"
          ? parseFloat(requiredValueRaw)
          : requiredValueRaw;

      let userValue: number;
      if (setting.slug === "growth_booster") {
        // Use the value at the specific level from total_team_business
        userValue = Array.isArray(userRewardTeamMetrics.total_team_business)
          ? userRewardTeamMetrics.total_team_business[level] ?? 0
          : userRewardTeamMetrics.total_team_business ?? 0;
      } else {
        const value = userRewardTeamMetrics[setting.slug];
        userValue = Array.isArray(value) ? value[level] : value || 0;
      }

      // Skip certain slugs that don't require comparison
      if (
        setting.slug === "rank" ||
        setting.slug === "months" ||
        setting.slug === "reward"
      ) {
        return true;
      }

      return typeof userValue === "number" && userValue >= requiredValue;
    });
  };

  // Get the highest achieved level
  const getUserLevel = (): number => {
    let highestAchievedLevel = 0;
    for (let level = 0; level < maxRows; level++) {
      if (isLevelAchieved(level)) {
        highestAchievedLevel = level + 1;
      } else {
        break;
      }
    }
    return highestAchievedLevel;
  };

  // Get status for a specific level
  const getUserLevelStatus = (
    currentLevel: number
  ): "achieved" | "running" | "next" => {
    if (isLevelAchieved(currentLevel)) {
      return "achieved";
    }

    // Check if this is the "running" level (first unachieved level with some progress)
    const hasProgress = rewardSettings.some((setting: IRewardSettings) => {
      let userValue: number;
      if (setting.slug === "growth_booster") {
        userValue = Array.isArray(userRewardTeamMetrics?.total_team_business)
          ? userRewardTeamMetrics.total_team_business[currentLevel] ?? 0
          : userRewardTeamMetrics?.total_team_business ?? 0;
      } else {
        const value = userRewardTeamMetrics?.[setting.slug];
        userValue = Array.isArray(value) ? value[currentLevel] : value || 0;
      }
      return typeof userValue === "number" && userValue > 0;
    });
    // Find the first unachieved level
    for (let level = 0; level < maxRows; level++) {
      if (!isLevelAchieved(level)) {
        if (level === currentLevel && hasProgress) {
          return "running";
        }
        return "next";
      }
    }

    return "next";
  };

  const userLevel = getUserLevel();

  // Update user rank when level changes
  // useEffect(() => {
  //   if (userRank !== userLevel && userLevel > 0) {
  //     const updateData = {
  //       myRank: userLevel,
  //     };
  //     dispatch(
  //       updateProfileAsync({
  //         payload: updateData,
  //         type: "data",
  //       })
  //     )
  //       .unwrap()
  //       .then(() => console.log("User rank updated successfully"))
  //       .catch(() => toast.error("Failed to update rank"));
  //   }
  // }, [userRank, userLevel, dispatch]);

  const getUserProgress = (slug: string, levelIndex: number): string => {
    if (!userRewardTeamMetrics) return "0 / 0";

    let userValue: number;

    if (slug === "growth_booster") {
      if (Array.isArray(userRewardTeamMetrics.total_team_business)) {
        userValue = userRewardTeamMetrics.total_team_business[levelIndex] ?? 0;
      } else {
        userValue = Number(userRewardTeamMetrics.total_team_business) || 0;
      }
    } else {
      userValue = Number(userRewardTeamMetrics[slug]) || 0;
    }

    const requiredValue =
      rewardSettings.find((d: IRewardSettings) => d.slug === slug)?.value[
        levelIndex
      ] || "0";

    switch (slug) {
      case "rank":
        return userValue === 0
          ? `${requiredValue}`
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
          {(getRewardSettings || getUserRewardTeamMetrics) && (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2">Loading...</p>
            </div>
          )}
          {!getRewardSettings &&
            !getUserRewardTeamMetrics &&
            rewardSettings?.length === 0 && (
              <div className="text-center py-5 text-muted">
                No Reward settings available
              </div>
            )}
          {!getRewardSettings &&
            !getUserRewardTeamMetrics &&
            rewardSettings?.length > 0 && (
              <div className="table-responsive rounded">
                <Table hover bordered className="table-striped rounded">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Levels
                      </th>
                      {rewardSettings.map((d: IRewardSettings) => (
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
                      const status = getUserLevelStatus(level);
                      return (
                        <tr
                          key={level}
                          className={
                            status === "running"
                              ? "table-warning font-weight-bold"
                              : status === "achieved"
                              ? "table-success"
                              : ""
                          }
                        >
                          <td className="px-4 py-3 font-weight-bold">
                            Level {level + 1}
                          </td>
                          {rewardSettings.map((setting: IRewardSettings) => (
                            <td key={setting.slug} className="px-4 py-3">
                              {getUserProgress(setting.slug, level)}
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            {status === "achieved" ? (
                              <Badge color="success" pill>
                                Level Achieved ✅
                              </Badge>
                            ) : status === "running" ? (
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
