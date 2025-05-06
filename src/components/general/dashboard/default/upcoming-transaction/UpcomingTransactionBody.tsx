import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { Successfully, Today, Tomorrow, Unsuccessfully, WaterBill } from "@/constants";
import { UpcomingTransactionData } from "@/data/general/dashboard/default";
import { CardBody } from "reactstrap";

const UpcomingTransactionBody = () => {
  return (
    <CardBody className=" pt-0 transaction-list">
      <ul>
        <li className="transaction-title">
          <span className="f-w-500 f-light f-12">{Today}</span>
        </li>
        <li>
          <div className="transaction-content">
            <div className="transaction-icon bg-light-primary">
              <SvgIcon iconId="bill" />
            </div>
            <div className="transaction-right-content">
              <div>
                <h6>{WaterBill}</h6>
                <span className="f-light f-w-400">{Unsuccessfully}</span>
              </div>
              <span className="txt-danger f-w-500">-$120</span>
            </div>
          </div>
        </li>
        <li className="transaction-title">
          <span className="f-w-500 f-light f-12">{Tomorrow}</span>
        </li>
        {UpcomingTransactionData.map((item, i) => (
          <li key={i}>
            <div className="transaction-content">
              <div className={`transaction-icon ${item.color}`}>
                <SvgIcon iconId={item.icon} />
              </div>
              <div className="transaction-right-content">
                <div>
                  <h6>{item.text}</h6>
                  <span className="f-light f-w-400">{Successfully}</span>
                </div>
                <span className="f-w-500">{item.amount}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </CardBody>
  );
};

export default UpcomingTransactionBody;
