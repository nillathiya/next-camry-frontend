"use client";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import FullSearch from "./full-search";
import HeaderBreadcrumb from "./HeaderBreadcrumb";
import HeaderLogo from "./HeaderLogo";
import RightHeader from "./right-header";

const Header = () => {
  const { sideBarToggle, isSearchBarOpen } = useAppSelector((state) => state.layout);

  return (
    <Row className={`page-header ${sideBarToggle}`} id="page-header">
      <HeaderLogo />
      <HeaderBreadcrumb />
      <Col className={`${isSearchBarOpen ? 'open' : ''} header-wrapper m-0 header-right-wrapper`}>
        <Row className="m-0">
          <FullSearch />
          <Col xs="auto" className="header-logo-wrapper p-0 left-header" />
          <Col xs="auto" className="nav-right pull-right right-header p-0 ms-auto">
            <RightHeader />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Header;
