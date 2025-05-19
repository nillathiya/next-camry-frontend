import { Href } from "@/constants";
import { usePlan } from "@/hooks/usePlans";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import { useEffect, useState } from "react";
import { Badge, CardBody, CardHeader, Input, Spinner } from "reactstrap";
import styled from "styled-components";

interface LevelStatus {
  level: number;
  levelIncome: string;
  reqDirects: string;
  status: number;
}

const ScrollContainer = styled.div`
  height: 700px;
  overflow-y: scroll;

  scrollbar-width: thin;
  scrollbar-color: #888 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

const TodoList = () => {
  const { loading: userSliceLoading, userTeamMetric } = useAppSelector(
    (state) => state.user
  );
  const { usePlanDailyLevel, usePlanDailyLevelReqDirect, loading } = usePlan();
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);

  const getUserLevelStatus = (
    levelDirectRequirement: number,
    userDirects: number
  ) => {
    const isUnlocked = userDirects >= levelDirectRequirement;
    return {
      reqDirects: `${userDirects}/${levelDirectRequirement}`,
      status: isUnlocked ? 1 : 2,
    };
  };

  useEffect(() => {
    const userDirects = Number(userTeamMetric?.userTotalDirects) || 0; // Mocked user directs count
    const dailyLevelRequirements = usePlanDailyLevel?.() || [];
    const dailyLevelDirectRequirements = usePlanDailyLevelReqDirect?.() || [];

    if (dailyLevelRequirements.length && dailyLevelDirectRequirements.length) {
      let prev = 0;
      const statusData = dailyLevelRequirements.map((levelIncome, index) => {
        const parsedNumdailyLevelDirectRequirements = Number(
          dailyLevelDirectRequirements[index]
        );
        const levelDirectRequirement =
          parsedNumdailyLevelDirectRequirements + prev || 0;

        prev = levelDirectRequirement; // Update for next iteration

        const { reqDirects, status } = getUserLevelStatus(
          levelDirectRequirement,
          userDirects
        );

        return {
          level: index,
          levelIncome: String(levelIncome),
          reqDirects,
          status,
        };
      });

      setLevelStatus(statusData);
    } else {
      setLevelStatus([]);
    }
  }, [usePlanDailyLevel, usePlanDailyLevelReqDirect]);

  return (
    <ScrollContainer className="col-xl-30 order-xl-ii todo-wrapper">
      <CardHeader className="card-no-border order-lists">
        <div className="header-top">
          <h2>
            Level Status
            <span className="f-light f-12 d-block f-w-500">
              User Level Status
            </span>
          </h2>
          {/* <div className="card-header-right-icon">
            <a className="link-with-icon" href={Href}>
              + Create
            </a>
          </div> */}
        </div>
      </CardHeader>
      <CardBody className="notification to-do-list">
        {loading || userSliceLoading.getUserTeamMetric ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <Spinner color="primary" />
          </div>
        ) : levelStatus.length === 0 ? (
          <div className="text-center">No level data available</div>
        ) : (
          <ul className="custom-scrollbar">
            {levelStatus.map((item) => (
              <li className="d-flex align-items-center" key={item.level}>
                <div
                  className={`activity-dot-${
                    item.status === 1 ? "success" : "danger"
                  }`}
                />
                <div className="d-flex w-100 align-items-center">
                  <div className="checkbox-checked">
                    <div className="form-check">
                      <Input
                        className="form-check-input"
                        id={`list-level-${item.level}`}
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <h6>Level {item.level}</h6>
                    <span className="f-w-500 f-12 f-light">
                      {item.reqDirects} Directs
                    </span>
                  </div>
                  <Badge
                    color={`light-${item.status === 1 ? "success" : "danger"}`}
                    className="ms-auto"
                  >
                    {item.status === 1 ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </ScrollContainer>
  );
};

export default TodoList;
