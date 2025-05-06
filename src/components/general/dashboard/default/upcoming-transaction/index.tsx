import CommonDropdown from "@/common-components/CommonDropdown";
import { SpecialDiscount, UpcomingTransaction } from "@/constants";
import { Card, CardHeader, Col } from "reactstrap";
import UpcomingTransactionBody from "./UpcomingTransactionBody";

const UpcomingTransactionCard = () => {
  return (
    <Col md="6" className="order-md-i">
      <Card className="title-line">
        <CardHeader className="card-no-border transaction-header">
          <div className="header-top">
            <h2>
              {UpcomingTransaction}
              <span className="f-light f-12 d-block f-w-500">
                {SpecialDiscount}
                <span className="txt-primary">60% OFF</span>
              </span>
            </h2>
            <div className="card-header-right-icon">
              <CommonDropdown dropdownToggle="Weekly" dropdownItems={["Monthly", "Weekly", "Yearly"]} />
            </div>
          </div>
        </CardHeader>
        <UpcomingTransactionBody />
      </Card>
    </Col>
  );
};

export default UpcomingTransactionCard;
