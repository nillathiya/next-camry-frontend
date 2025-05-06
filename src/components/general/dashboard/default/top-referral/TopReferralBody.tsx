import { ImagePath } from "@/constants";
import { TopReferralProgressData, TopReferralWebsiteData } from "@/data/general/dashboard/default";
import Image from "next/image";
import { TrendingUp } from "react-feather";
import { Badge, CardBody } from "reactstrap";

const TopReferralBody = () => {
  return (
    <CardBody className="pt-0">
      <div className="referral-content">
        <div className="referral-left-details">
          <div className="d-flex gap-1">
            <h2>129,900</h2>
            <Badge color="light-warning">
              <TrendingUp className="me-1"/>
              4.5%
            </Badge>
          </div>
          <span className="f-light f-12 f-w-500">vs. previous month</span>
        </div>
        <div className="referral-image">
          <img src={`${ImagePath}/dashboard/1.png`} alt="vector" />
        </div>
      </div>
      <div className="progress-stacked referral-progress">
        {TopReferralProgressData.map((item, i) => (
          <div key={i} className="progress" role="progressbar" style={{ width: item.width }}>
            <div className={`progress-bar bg-${item.color}`} />
          </div>
        ))}
      </div>
      <ul className="referral-list">
        {TopReferralWebsiteData.map((item, i) => (
          <li key={i}>
            <div className={`activity-dot-${item.color}`} />
            <a className="f-light f-w-500" href="../applications/search">
              {item.website}
            </a>
            <span className="f-12 f-w-500">{item.percentage}</span>
          </li>
        ))}
      </ul>
    </CardBody>
  );
};

export default TopReferralBody;
