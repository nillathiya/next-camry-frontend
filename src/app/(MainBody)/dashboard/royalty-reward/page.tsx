"use client";

import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { getRankSettingsAsync } from "@/redux-toolkit/slices/settingSlice";
import {
  getUserRankAndTeamMetricsAsync,
  updateProfileAsync,
} from "@/redux-toolkit/slices/userSlice";
import { IRankSettings } from "@/types";
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Table, Badge, Spinner, Container } from "reactstrap";

const RoyalityAndRewards = () => {
  const dispatch = useAppDispatch();
  const {
    userRankAndTeamMetric,
    loading: { getUserRankAndTeamMetric },
  } = useAppSelector((state) => state.user);

  const {
    rankSettings,
    loading: { getRankSettings },
  } = useAppSelector((state) => state.setting);

  useEffect(() => {
    dispatch(getRankSettingsAsync());
    dispatch(getUserRankAndTeamMetricsAsync());
  }, [dispatch]);

  const userRank = userRankAndTeamMetric.rank || 0;
  // console.log("userRank", userRank);

  const maxRows = useMemo(
    () =>
      Math.max(
        ...(rankSettings?.map((d: IRankSettings) => d.value.length) || [0]),
        0
      ),
    [rankSettings]
  );

  // Check if a specific level is achieved
  const isLevelAchieved = (level: number): boolean => {
    if (!userRankAndTeamMetric) return false;

    return rankSettings.every((setting: IRankSettings) => {
      const requiredValueRaw = setting.value[level];
      const requiredValue =
        typeof requiredValueRaw === "string"
          ? parseFloat(requiredValueRaw)
          : requiredValueRaw;

      const value = userRankAndTeamMetric[setting.slug];
      const userValue = Array.isArray(value) ? value[level] : value;

      return typeof userValue === "number" && userValue >= requiredValue;
    });
  };

  // Get the highest achieved level
  const getUserLevel = (): number => {
    let highestAchievedLevel = 0;
    for (let level = 0; level < maxRows; level++) {
      if (isLevelAchieved(level)) {
        highestAchievedLevel = level + 1;
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
    const hasProgress = rankSettings.some((setting: IRankSettings) => {
      const value = userRankAndTeamMetric?.[setting.slug];
      const userValue = Array.isArray(value) ? value[currentLevel] : value;
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
    if (!userRankAndTeamMetric) return "0 / 0";

    const value = userRankAndTeamMetric[slug];
    const userValue = Array.isArray(value)
      ? value[levelIndex] || 0
      : value || 0;
    const requiredValue =
      rankSettings.find((d: IRankSettings) => d.slug === slug)?.value[
        levelIndex
      ] || 0;

    switch (slug) {
      case "rank":
        return userValue === 0
          ? `${requiredValue}`
          : `${userValue}/${requiredValue}`;
      case "reward":
      case "self_business":
      case "direct_business":
      case "total_team_business":
        return `${userValue.toLocaleString()} / ${requiredValue.toLocaleString()}`;
      default:
        return `${userValue} / ${requiredValue}`;
    }
  };

  return (
    <Container fluid>
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Royalty & Rewards</h3>
        </div>
        <div className="card-body p-4">
          {(getRankSettings || getUserRankAndTeamMetric) && (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2">Loading...</p>
            </div>
          )}
          {!getRankSettings &&
            !getUserRankAndTeamMetric &&
            rankSettings?.length === 0 && (
              <div className="text-center py-5 text-muted">
                No rank settings available
              </div>
            )}
          {!getRankSettings &&
            !getUserRankAndTeamMetric &&
            rankSettings?.length > 0 && (
              <div className="table-responsive rounded">
                <Table hover bordered className="table-striped rounded">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Levels
                      </th>
                      {rankSettings.map((d: IRankSettings) => (
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
                          {rankSettings.map((setting: IRankSettings) => (
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

export default RoyalityAndRewards;
