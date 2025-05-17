import { Href } from "@/constants";
import { usePlan } from "@/hooks/usePlans";
import { useEffect, useState } from "react";
import { Badge, CardBody, CardHeader, Col, Input, Spinner } from "reactstrap";

interface LevelStatus {
  level: number;
  levelIncome: string; // Changed to string to match data type
  reqDirects: string;
  status: number;
}

const TodoList = () => {
  const { usePlanDailyLevel, usePlanDailyLevelReqDirect, loading } = usePlan();
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);

  // Calculate user level status based on direct requirements
  const getUserLevelStatus = (levelDirectRequirement: number, userDirects: number) => {
    const isUnlocked = userDirects >= levelDirectRequirement;
    return {
      reqDirects: `${userDirects}/${levelDirectRequirement}`,
      status: isUnlocked ? 1 : 2,
    };
  };

  // Fetch and process level status data
  useEffect(() => {
    const userDirects = 5; // Mocked user directs count
    const dailyLevelRequirements = usePlanDailyLevel?.() || [];
    const dailyLevelDirectRequirements = usePlanDailyLevelReqDirect?.() || [];

    if (dailyLevelRequirements.length && dailyLevelDirectRequirements.length) {
      const statusData = dailyLevelRequirements.map((levelIncome, index) => {
        const levelDirectRequirement = Number(dailyLevelDirectRequirements[index]) || 0;
        const { reqDirects, status } = getUserLevelStatus(levelDirectRequirement, userDirects);

        return {
          level: index,
          levelIncome: String(levelIncome), // Ensure string type
          reqDirects,
          status,
        };
      });

      setLevelStatus(statusData);
    } else {
      setLevelStatus([]); // Clear status if no data
    }
  }, [usePlanDailyLevel, usePlanDailyLevelReqDirect]);

  return (
    <Col xs="12" xl="3" className="order-xl-2 todo-wrapper">
      <CardHeader className="card-no-border order-lists">
        <div className="header-top">
          <h2>
            Level Status
            <span className="f-light f-12 d-block f-w-500">User Level Status</span>
          </h2>
          <div className="card-header-right-icon">
            <a className="link-with-icon" href={Href}>
              + Create
            </a>
          </div>
        </div>
      </CardHeader>
      <CardBody className="notification to-do-list">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            <Spinner color="primary" />
          </div>
        ) : levelStatus.length === 0 ? (
          <div className="text-center">No level data available</div>
        ) : (
          <ul className="custom-scrollbar">
            {levelStatus.map((item) => (
              <li className="d-flex align-items-center" key={item.level}>
                <div className={`activity-dot-${item.status === 1 ? "success" : "danger"}`} />
                <div className="d-flex w-100 align-items-center">
                  <div className="checkbox-checked">
                    <div className="form-check">
                      <Input
                        className="form-check-input"
                        id={`list-level-${item.level}`}
                        type="checkbox"
                        disabled // Disable checkbox as no handler is provided
                      />
                    </div>
                  </div>
                  <div>
                    <h6>Level {item.level}</h6>
                    <span className="f-w-500 f-12 f-light">{item.reqDirects} Directs</span>
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
    </Col>
  );
};

export default TodoList;