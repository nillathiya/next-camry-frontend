import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { UserWalletInfo } from "@/data/general/dashboard/default";
import { useWalletSettings } from "@/hooks/useWalletSettings";
import { Card, CardBody, Col, Row } from "reactstrap";

const UserCards = () => {
  const { getWalletBalanceBySlug, getWalletNameBySlug } = useWalletSettings();
  return (
    <Col xl="6" className=" box-col-6">
      <Row className="tread-cards">
        {UserWalletInfo.map((item, i) => (
          <Col key={i} xl="6" sm="6">
            <Card className=" widget-1">
              <CardBody className="common-box">
                <div className={`${item.color} widget-icon widget-round`}>
                  <SvgIcon iconId={item.svg} />
                </div>
                <div>
                  <h3 className="f-w-600">
                    {getWalletNameBySlug(item.wallet)}
                  </h3>
                  <span className="f-w-500 f-light f-12">
                    {getWalletBalanceBySlug(item.wallet)}
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Col>
  );
};

export default UserCards;
