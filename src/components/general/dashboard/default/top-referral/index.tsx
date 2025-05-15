import CommonDropdown from "@/common-components/CommonDropdown";
import { TopReferralPages } from "@/constants";
import { Card, CardHeader, Col } from "reactstrap";
import TopReferralBody from "./TopReferralBody";

const TopReferral = () => {
  return (
    <Col xl="6" md="6" className="order-md-ii">
      <Card className=" title-line">
        <CardHeader className="card-no-border report-option">
          <div className="header-top">
            <h2>
              {TopReferralPages}
              <span className="f-light f-12 d-block f-w-500">
                Up to $100 per referral
              </span>
            </h2>
            {/* <CommonDropdown
              dropdownItems={["Monthly", "Weekly", "Yearly"]}
              dropdownToggle="Generate Report"
            /> */}
          </div>
        </CardHeader>
        <TopReferralBody />
      </Card>
    </Col>
  );
};

export default TopReferral;
