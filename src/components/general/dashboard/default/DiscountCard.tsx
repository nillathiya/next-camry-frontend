import { ImagePath } from "@/constants";
import Image from "next/image";
import { TopReferralPages } from "@/constants";
import TopReferralBody from "./top-referral/TopReferralBody";
import { Col } from "reactstrap";

const DiscountCard = () => {
  return (
    <Col xs="12" className="col-xl-100 order-xl-i">
      <div className="offer-banner">
        <div className="offer-content">
          <h2>
            {"Referral"}
            <span className="f-light f-12 d-block f-w-500">
              Please refer your friends{" "}
            </span>
          </h2>
        </div>
        <TopReferralBody />
      </div>
    </Col>
  );
};

export default DiscountCard;
