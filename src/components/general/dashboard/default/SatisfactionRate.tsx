import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import CommonCardHeader from "@/common-components/CommonCardHeader";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { VoteByConsumer } from "@/constants";
import { Card, CardBody, Col } from "reactstrap";
import { getProfileAsync } from "@/redux-toolkit/slices/userSlice";

const SatisfactionRate = () => {
  const [error, setError] = useState<string | null>(null);
  const {
    user,
    loading: { getProfile },
  } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const fetchUserProfile = async () => {
    try {
      await dispatch(getProfileAsync()).unwrap();
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Server Error, Please Try Later";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    if (!getProfile && !user) {
      fetchUserProfile();
    }
  }, []);

  return (
    <Col xl="6" sm="6" className="rate-column">
      <Card className="title-line widget-1">
        <CommonCardHeader
          headClass="card-no-border"
          title="Rank"
        />
        <CardBody className="pt-0">
          <div className="light-card satisfaction-box common-box">
            <div className="widget-icon primary widget-round">
              <SvgIcon iconId="like-shape" />
            </div>
            <div>
              {getProfile ? (
                <span className="f-light f-w-500 f-12">Loading...</span>
              ) : error ? (
                <span className="f-light f-w-500 f-12 text-danger">
                  {error}
                </span>
              ) : (
                <>
                  <h2>{user?.myRank ?? "0"}</h2>
                  <span className="f-light f-w-500 f-12">{"Rank"}</span>
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SatisfactionRate;
