import { Cancel, ConfigurationTitle, CopyTextButton } from "@/constants";
import { ConfigurationProps } from "@/types/layout";
import { toast } from "react-toastify";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import ConfigDB from "@/config/ThemeConfig";
import ConfigurationContent from "./ConfigurationContent";

export default function Configuration({ modal, toggle }: ConfigurationProps) {
  const handleThemeCopy = async () => {
    try {
      const configDB = ConfigDB;
      await navigator.clipboard.writeText(JSON.stringify(configDB));
      toast.success("Code copied to clipboard!", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "light",
      });
    } catch (err) {
      toast.error("Failed to copy text to clipboard.", {
        position: "bottom-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "light",
      });
    }
  };

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      className="modal-body"
      centered={true}
    >
      <ModalHeader toggle={toggle}>{ConfigurationTitle}</ModalHeader>
      <ModalBody>
        <Container fluid={true} className="bd-example-row">
          <Row>
            <p>
              {
                "To replace our design with your desired theme. Please do configuration as mention"
              }
            </p>
            <p>
              <b> {"Path : src > Config > ThemeConfig.jsx "}</b>
            </p>
          </Row>
          <ConfigurationContent />
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="notification"
          onClick={handleThemeCopy}
        >
          {CopyTextButton}
        </Button>
        <Button color="secondary" onClick={toggle}>
          {Cancel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
