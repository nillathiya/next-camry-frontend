import { ImagePath } from "@/constants";
import Image from "next/image";
import { TopReferralPages } from "@/constants";
import TopReferralBody from "./top-referral/TopReferralBody";
import { Col } from "reactstrap";

const DiscountCard = () => {
  return (
    <Col xs="12" className="col-xl-100 order-xl-i">
      <div className="offer-banner reflection">
        <div className="offer-content">
          <h2>
            {"Referral"}
            <span className="f-light f-12 d-block f-w-500">
              Invite more to unlock your next level
            </span>
          </h2>
        </div>
        <TopReferralBody />
      </div>

      <style jsx>{`
        .reflection {
          width: 100%;
          position: relative;
          overflow: hidden;
          background-color: #666;
        }

        .reflection::after {
          content: "";
          position: absolute;
          bottom: -180px;
          left: 0;
          width: 30px;
          height: 100%;
          background-color: #fff;
          opacity: 0;
          transform: rotate(-45deg);
          animation: reflect 2s ease-in-out infinite;
        }

        @keyframes reflect {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          80% {
            transform: scale(0) rotate(-45deg);
            opacity: 0.5;
          }
          81% {
            transform: scale(4) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: scale(50) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>
    </Col>
  );
};

export default DiscountCard;
