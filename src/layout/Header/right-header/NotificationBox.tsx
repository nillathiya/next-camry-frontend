import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { CheckAll, Href, ImagePath, Notifications } from "@/constants";
import Image from "next/image";
import { Badge } from "reactstrap";
import { NotificationsData } from "@/data/layout/RightHeader";

const NotificationBox = () => {
  return (
    <li className="onhover-dropdown">
      <div className="notification-box onhover-click">
        <SvgIcon iconId="notification" />
        <Badge color="success" pill>
          {"3 "}
        </Badge>
      </div>
      <div className="onhover-show-div notification-dropdown">
        <h6 className="f-18 mb-0 dropdown-title">{Notifications} </h6>
        <ul className="simple-list">
          {NotificationsData.map((item) => (
            <li className="d-flex" key={item.id}>
              <div className="notification-image">
                <Image height={50} width={50} className="img-fluid" src={`${ImagePath}/avtar/${item.image}`} alt="user" />
                <div className={`notification-icon bg-${item.color}`}>
                  <i className={`fa fa-${item.icon}`}></i>
                </div>
              </div>
              <div>
                <p>
                  <span className="f-w-500 me-1">{item.name}</span>
                  {item.text}
                </p>
                <span className="f-light">{item.time}</span>
              </div>
            </li>
          ))}
          <li>
            <a className="f-w-700" href={Href}>
              {CheckAll}
            </a>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default NotificationBox;
