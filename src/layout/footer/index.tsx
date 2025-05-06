import { Globe } from "react-feather";
import { Col, Container, Row } from "reactstrap";
// import Languages from "./FooteLanguage";

const FooterLayout = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row className="gy-1">
          <Col lg="6" md="7" className="footer-copyright">
            <p className="mb-0 f-light f-w-500">{"Copyright 2024 © Yuri theme by pixelstrap"}</p>
          </Col>
          <Col lg="6" md="5">
            <div className="d-flex">
              {/* <Languages /> */}
              <div className="lang-title f-light f-w-500">
                <Globe className="me-1" />
                <span>{"Select Region"}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterLayout;
