import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { ImagePath, JaneCooper } from "@/constants";
import { chatHeaderData } from "@/data/layout/RightHeader";
import Image from "next/image";
import { Badge, Input, InputGroup, InputGroupText } from "reactstrap";

const ChatHeader = () => {
  return (
    <li className="cart-nav onhover-dropdown">
      <div className="cart-box onhover-click">
        <SvgIcon iconId="email" />
        <Badge color="danger" pill>
          {"2"}
        </Badge>
      </div>
      <div className="onhover-show-div chat-dropdown">
        <div className="dropdown-title">
          <div className="d-flex align-items-center">
            <Image height={50} width={50} className="img-fluid img-40 rounded-circle" src={`${ImagePath}/dashboard/user/1.jpg`} alt="user" />
            <div>
              <h6 className="f-18 mb-0">{JaneCooper}</h6>
              <p className="mb-0">
                <span className="status status-success me-1"></span>
                <span>{"active"}</span>
              </p>
            </div>
          </div>
        </div>
        <ul>
          {chatHeaderData.map((item) => (
            <li className="send-msg" key={item.id}>
              <div>
                <Image height={50} width={50} className="img-fluid img-30 rounded-circle" src={`${ImagePath}/dashboard/user/${item.image}`} alt="user" />
                <div>
                  <p>{item.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="chat-input">
          <InputGroup>
            <Input type="text" placeholder="Type message here..." />
            <InputGroupText className="bg-primary">
              <SvgIcon iconId="send" />
            </InputGroupText>
          </InputGroup>
        </div>
      </div>
    </li>
  );
};

export default ChatHeader;
