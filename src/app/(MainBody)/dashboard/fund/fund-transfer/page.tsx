import React from "react";
import { Button, Card, CardBody, Col, Form, Input, Label, Row } from "reactstrap";
import CommonCardHeader from "@/common-components/CommonCardHeader";
function AddFund() {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader title={"Title"} subTitle={"SubTitle"} />
        <CardBody>
          <div className="card-wrapper border rounded-3">
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="g-3">
                <Col md="12">
                  <Label check>A</Label>
                  <Input type="email" placeholder={EmailPlaceHolder} />
                </Col>
                <Col ms="12">
                  <Label check>{PasswordLabel}</Label>
                  <Input type="password" placeholder={PasswordPlaceholder} />
                </Col>
                <Col sm="12">
                  <div className="form-check checkbox-checked">
                    <Input type="checkbox" id="gridCheck1" />
                    <Label htmlFor="gridCheck1" check>
                      {CheckMeOut}
                    </Label>
                  </div>
                </Col>
                <Col sm="12">
                  <Button color="primary">{SignInButton}</Button>
                </Col>
              </Row>
            </Form>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
}

export default AddFund;
