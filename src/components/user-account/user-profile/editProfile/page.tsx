import { Container, Row } from "reactstrap";
import EditProfileForm from "./editProfiles/EditProfileForm";
import MyProfile from "./myProfile/MyProfile";

const EditProfileContainer = () => {
  return (
    <Container fluid>
      <div className="edit-profile">
        <Row>
          <MyProfile />
          <EditProfileForm />
        </Row>
      </div>
    </Container>
  );
};

export default EditProfileContainer;
  