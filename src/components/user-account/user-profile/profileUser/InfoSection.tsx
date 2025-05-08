import { Href } from "@/constants/index";
import { UserAddressData, UserProfileData } from "@/data/users/index";
import Link from "next/link";
import { Col, Row } from "reactstrap";

export const InfoSection = () => {
  return (
    <Row className="g-3">
      <Col sm="6" xl="4" className="order-sm-1 order-xl-0">
        <Row className="g-3">
          {UserProfileData.map(({ iconClass, text, spanText }, index) => (
            <Col md="6" key={index}>
              <div className="tour-email text-start">
                <h6 className="mb-1">
                  <i className={`fa fa-${iconClass} me-2`}></i>
                  {text}
                </h6>
                <span>{spanText}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Col>
      <Col sm="12" xl="4" className="order-sm-0 order-xl-1">
        <div className="user-designation">
          <div className="title">
            <Link target="_blank" href={Href}>
              Mark jecno
            </Link>
          </div>
          <div className="desc">designer</div>
        </div>
      </Col>
      <Col sm="6" xl="4" className="order-sm-2 order-xl-2">
        <Row className="g-3">
          {UserAddressData.map(({ iconClass, text, spanText }, index) => (
            <Col md="6" key={index}>
              <div className="tour-email text-start">
                <h6 className="mb-1">
                  <i className={`fa fa-${iconClass}`}></i>
                  {text}
                </h6>
                <span>{spanText}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};