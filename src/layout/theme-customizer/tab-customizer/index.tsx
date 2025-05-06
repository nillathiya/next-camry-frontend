import React, { useCallback, useState } from "react";
import { Button, TabContent, TabPane } from "reactstrap";
import Configuration from "./configuration-modal";
import SidebarCusmizer from "./sidebar-customizer";
import { NavCustomizerProps } from "@/types/layout";

export default function TabCustomizer({
  callbackNav,
  selected,
}: NavCustomizerProps) {
  const [modal, setModal] = useState(false);
  const toggle = useCallback(() => {
    setModal(!modal);
  }, [modal]);
  return (
    <TabContent activeTab={selected}>
      <div className="customizer-header">
        <i className="icon-close" onClick={() => callbackNav("", false)}></i>
        <h5>{"Preview Settings"}</h5>
        <p className="mb-0">
          {"Try It Real Time  "}
          <i className="fa fa-thumbs-o-up txt-primary"></i>
        </p>
        <Button color="primary" className="plus-popup mt-2" onClick={toggle}>
          {"Configuration"}
        </Button>
        <Configuration modal={modal} toggle={toggle} />
      </div>
      <div className="customizer-body custom-scrollbar">
        <TabPane tabId="sidebar-type">
          <SidebarCusmizer />
        </TabPane>
      </div>
    </TabContent>
  );
}
