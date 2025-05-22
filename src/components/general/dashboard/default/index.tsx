import { Card, Col, Container, Row } from "reactstrap";
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

const DefaultContainer = () => {
  return (
    <Container fluid className="default-dashboard">
      <Row className="size-column">
        <Highlight/>
        <Col xl="9" className=" col-xl-100 box-col-12">
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
    </Container>
  );
};

export default DefaultContainer;
