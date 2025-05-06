import { Href } from "@/constants";
import { TodoListData } from "@/data/general/dashboard/default";
import { Badge, CardBody, CardHeader, Col, Input } from "reactstrap";

const TodoList = () => {
  return (
    <Col xs="12" className="col-xl-30 order-xl-ii todo-wrapper">
      <CardHeader className="card-no-border order-lists">
        <div className="header-top">
          <h2>
            To do List
            <span className="f-light f-12 d-block f-w-500">80 Orders in a December</span>
          </h2>
          <div className="card-header-right-icon">
            <a className="link-with-icon" href={Href}>
              + Create
            </a>
          </div>
        </div>
      </CardHeader>
      <CardBody className="notification to-do-list">
        <ul className="custom-scrollbar">
          {TodoListData.map((item, i) => (
            <li className="d-flex align-items-center" key={i}>
              <div className={`activity-dot-${item.color} `} />
              <div className="d-flex w-100 align-items-center">
                <div className="checkbox-checked">
                  <div className="form-check">
                    <Input className="form-check-input" id="list-1" type="checkbox" />
                  </div>
                </div>
                <div>
                  <h6>{item.heading}</h6>
                  <span className="f-w-500 f-12 f-light">{item.time}</span>
                </div>
                <Badge color={`light-${item.color}`} className="ms-auto">
                  {item.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Col>
  );
};

export default TodoList;
