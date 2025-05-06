import { ImagePath } from "@/constants";
import Image from "next/image";
import { Col } from "reactstrap";

const DiscountCard = () => {
  return (
    <Col xs="12" className="col-xl-100 order-xl-i">
      <div className="offer-banner">
        <div className="offer-content">
          <h2>20% Off Themes</h2>
          <p className="f-w-500 f-12">Get all the latest wordpress theme and plugin coupon in this board.</p>
        </div>
        <img className="img-fluid" src={`${ImagePath}/dashboard/banner.png`} alt="vector" />
      </div>
    </Col>
  );
};

export default DiscountCard;
