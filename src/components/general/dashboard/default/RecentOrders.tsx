import CommonDropdown from "@/common-components/CommonDropdown";
import { ImagePath } from "@/constants";
import { RecentOrdersData } from "@/data/general/dashboard/default";
import { Badge, CardBody, CardHeader, Col } from "reactstrap";

const RecentOrders = () => {
  return (
    <Col xl="12" sm="6" className="col-xl-30 order-xl-ii customer-order">
      <CardHeader className="card-no-border">
        <div className="header-top order-lists">
          <div>
            <h2>
              Recent Orders<span className="d-block f-w-500 f-light f-12">80 Orders in a December</span>
            </h2>
          </div>
          <div className="card-header-right-icon">
            <CommonDropdown dropdownItems={["Pending", "Success", "Deliver"]} dropdownToggle="All Orders" />
          </div>
        </div>
      </CardHeader>
      <CardBody className="transaction-list recent-orders">
        <ul className="order-list mb-0">
          {RecentOrdersData.map((item, i) => (
            <li key={i}>
              <div className="light-card">
                <img src={`${ImagePath}/dashboard/product/${item.image}`} alt="TV" />
              </div>
              <div className="order-content">
                <div>
                  <h6 className="mb-1">{item.item}</h6>
                  <span>
                    <Badge color="badge badge-light-primary">{item.code}</Badge>
                    <span className="f-light f-w-500 f-12 ms-2">{item.quantity}</span>
                  </span>
                </div>
                <div className="text-end">
                  <CommonDropdown dropdownItems={['Add to cart ', 'cancel']} />
                  <span className="f-light f-w-500 f-12">{item.price}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Col>
  );
};

export default RecentOrders;
