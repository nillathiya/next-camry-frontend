import { Href } from "@/constants/index";
import { UserAddressData, UserProfileData } from "@/data/users/index";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { Col, Row } from "reactstrap";

export const InfoSection = () => {
  const { user } = useProfile();

  const addressData = [
    {
      iconClass: UserAddressData[2]?.iconClass || "phone",
      text: "Contact",
      spanText:
        user?.contactNumber && user?.address?.countryCode
          ? user.contactNumber
              .replace(`+${user.address.countryCode}`, "")
              .replace(`${user.address.countryCode}`, "")
          : "Not available",
    },
    {
      iconClass: UserAddressData[3]?.iconClass || "map-marker",
      text: "Location",
      spanText: user?.address
        ? `${user.address.line1}, ${user.address.city}, ${user.address.state}, ${user.address.country}, ${user.address.postalCode}`
        : "",
    },
  ];

  return (
    <Row className="g-3">
      <Col sm="6" xl="4" className="order-sm-1 order-xl-0">
        <Row className="g-3">
          {UserProfileData.map(({ iconClass, text, key }, index) => (
            <Col md="6" key={index}>
              <div className="tour-email text-start">
                <h6 className="mb-1">
                  <i className={`fa fa-${iconClass} me-2`}></i>
                  {text}
                </h6>
                <span>{(user as any)?.[key] || "Not available"}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Col>
      <Col sm="12" xl="4" className="order-sm-0 order-xl-1">
        <div className="user-designation">
          <div className="title">
            <Link target="_blank" href={Href}>
              {user?.name || ""}
            </Link>
          </div>
          <div className="desc">designer</div>
        </div>
      </Col>
      <Col sm="6" xl="4" className="order-sm-2 order-xl-2">
        <Row className="g-3">
          {addressData.map(({ iconClass, text, spanText }, index) => (
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
    </Row>
  );
};