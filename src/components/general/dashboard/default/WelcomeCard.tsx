import { ImagePath, UpgradePlan } from "@/constants";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button, Card, CardHeader, Col, Row } from "reactstrap";

const WelcomeCard = () => {
  const { data: session } = useSession();
  return (
    <Col xl="6" className="box-col-6">
      <Card className="title-line upgrade-card overflow-hidden">
        <Row className=" align-items-end">
          <Col sm="8" xs="11">
            <CardHeader>
              <h2>
                Hi, Welcome back{" "}
                <span className="txt-primary">
                  {session?.user?.username
                    ? session?.user?.username
                    : session?.user?.name
                    ? session?.user?.name
                    : "Guest"}
                </span>
              </h2>
              <p className="mt-2 f-light">
                Great to see you again! Explore new features and take your
                experience to the next level with our premium plan.{" "}
              </p>
              <Button
                color="primary"
                className="btn-hover-effect btn-sm f-w-500"
                href="pricing"
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
