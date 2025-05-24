import { Href, MembersStatistics } from "@/constants";
import { Card, CardHeader, Col } from "reactstrap";
import MemberStatisticsBody from "./MemberStatisticsBody";

const MemberStatisticsCard = () => {
  return (
    <Col xl="6" className="order-md-iii">
      <Card className="title-line table-responsive custom-scrollbar member-wrapper">
        <CardHeader className="card-no-border">
          <div className="header-top">
            <h2>
              {MembersStatistics}
              <span className="f-12 f-w-500 f-light d-block">
                Latest 4 Directs
              </span>
            </h2>
            <div className="card-header-right-icon">
              <a
                className="link-with-icon"
                href={"/dashboard/genelogy/directs"}
              >
                Show All
              </a>
            </div>
          </div>
        </CardHeader>
        <MemberStatisticsBody />
      </Card>
    </Col>
  );
};

export default MemberStatisticsCard;
