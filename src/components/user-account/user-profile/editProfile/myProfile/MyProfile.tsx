"use client";

import CommonCardHeader from "@/common-components/CommonCardHeader";
import { ImagePath, MyProfiles, Save } from "@/constants/index";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { UserFormHead } from "./UserFormHead";
import { useProfile } from "@/hooks/useProfile";
import { API_URL } from "@/api/route";

const MyProfile = () => {
  const { user } = useProfile();
  
  const imageSrc = user?.profilePicture 
  ? `${API_URL}${user.profilePicture}` 
  : `${ImagePath}/profileimg.jpg`; 

  return (
    <Col xl="4">
      <Card className="title-line">
        <CommonCardHeader title={MyProfiles} />
        <CardBody>
          <Form onSubmit={(event) => event.preventDefault()}>
            <UserFormHead 
              name={user?.name || ''}
              email={user?.email || ''}
              profilePicture={imageSrc} 
            />
            
            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={user?.email || ''}
                readOnly
                placeholder="Email Address"
              />
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value="********"
                readOnly
                placeholder="Password"
              />
            </FormGroup>

            {/* <div className="form-footer">
              <Button color="primary" className="d-block">
                {Save}
              </Button>
            </div> */}
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MyProfile;