"use client";

import { useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { IoCloseCircleOutline } from "react-icons/io5";
import DiscountCard from "./DiscountCard";
import MemberStatisticsCard from "./member-statictics";
import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import RevenueWidget from "./RevenueByIndutsry";
import SalesPipelineChart from "./SalesPipeline";
import SatisfactionRate from "./SatisfactionRate";
import TodoList from "./TodoList";
import TopReferral from "./top-referral";
import TotalProfitCard from "./TotalProfit";
import QuickAccess from "./QuickAccess";
import UpcomingTransactionCard from "./upcoming-transaction";
import UserCards from "./UserCards";
import WelcomeCard from "./WelcomeCard";
import EarningReports from "./EarningReports";
import Highlight from "./Hignlight";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { setShowDashboardPopup } from "@/redux-toolkit/slices/userSlice";

const DefaultContainer = () => {
  const dispatch = useAppDispatch();
  const { showDashboardPopup } = useAppSelector((state) => state.user);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <Container fluid className="default-dashboard">
      <style>{`
        .modal-backdrop.show {
          background-color: rgba(0, 0, 0, 0.8) !important;
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
        }
      `}</style>
      <Row className="size-column">
        <Highlight />
        <Col xl="9" className="col-xl-100 box-col-12">
          <Row>
            <QuickAccess />
            <WelcomeCard />
            <UserCards />
            <Col xl="6">
              <Row className="small-charts">
                <Revenue />
                <SalesPipelineChart />
                <SatisfactionRate />
                <RevenueWidget />
              </Row>
            </Col>
            <TopReferral />
            <TotalProfitCard />
            <EarningReports />
            <UpcomingTransactionCard />
            <MemberStatisticsCard />
          </Row>
        </Col>
        <Col xl="3" className="col-xl-100">
          <Card>
            <Row>
              <RecentOrders />
              <DiscountCard />
              <TodoList />
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={showDashboardPopup} centered contentClassName="p-0">
        <ModalBody className="position-relative p-0 text-center">
          <IoCloseCircleOutline
            size={30}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
              color: "#fff",
              zIndex: 1051,
            }}
            onClick={() => dispatch(setShowDashboardPopup(false))}
            aria-label="Close popup"
          />
          <img
            src="/assets/images/profileimg.jpg"
            alt="Popup"
            style={{ maxWidth: "100%", height: "auto", display: "block" }}
          />
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default DefaultContainer;
