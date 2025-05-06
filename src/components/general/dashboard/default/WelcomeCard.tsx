import { ImagePath, UpgradePlan } from "@/constants";
import Image from "next/image";
import { Button, Card, CardHeader, Col, Row } from "reactstrap";

const WelcomeCard = () => {
  return (
    <Col xl="6" className="box-col-6">
      <Card className="title-line upgrade-card overflow-hidden">
        <Row className=" align-items-end">
          <Col sm="8" xs="11">
            <CardHeader>
              <h2>
                Hi, Welcome back <span className="txt-primary">Wade! </span>
              </h2>
              <p className="mt-2 f-light">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint.{" "}
              </p>
              <Button
                color="primary"
                className="btn-hover-effect btn-sm f-w-500"
                href="../applications/ecommerce/pricing"
              >
                {UpgradePlan}
                <svg className="svg-sprite">
                  <use href="/assets/svg/icon-sprite.svg#logout"> </use>
                </svg>
              </Button>
            </CardHeader>
          </Col>
        </Row>
        <div className="cartoon-image">
          <img
            className="img-fluid"
            src={`${ImagePath}/dashboard/welcome.png`}
            alt="vector"
          />
        </div>
        <Image
          className="img-fluid pattern-image"
          width={134}
          height={119}
          src={`${ImagePath}/dashboard/bg-1.png`}
          alt="vector pattern"
        />
      </Card>
    </Col>
  );
};

export default WelcomeCard;
