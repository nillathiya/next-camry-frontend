import React from "react";
import CartHeaderList from "./CartHeaderList";
import { Badge } from "reactstrap";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { Cart } from "@/constants";

const CartHeader = () => {
  return (
    <li className="cart-nav onhover-dropdown">
      <div className="cart-box onhover-click">
        <SvgIcon iconId="stroke-ecommerce" />
        <Badge color="primary" pill>
          {"2"}
        </Badge>
      </div>
      <div className="cart-dropdown onhover-show-div">
        <h6 className="f-18 mb-0 dropdown-title">{Cart}</h6>
        <CartHeaderList />
      </div>
    </li>
  );
};
export default CartHeader;
