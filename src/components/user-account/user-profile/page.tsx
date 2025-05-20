import { Container, Row } from "reactstrap";
import UserData from "./profileUser/userData";
import EditProfileContainer from "./editProfile/page";

const UsersProfileContainer = () => {
  return (
    <Container fluid>
      <div className="user-profile">
        <Row>
          {/* <UserData /> */}
          <EditProfileContainer/>
        </Row>
      </div>
    </Container>
  );
};

export default UsersProfileContainer;
