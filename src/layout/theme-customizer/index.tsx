import { CallbackNavType } from "@/types/layout";
import { useState } from "react";
import NavCustomizer from "./nav-customizer";
import TabCustomizer from "./tab-customizer";

export default function ThemeCustomizer() {
  const [selected, setSelected] = useState("check-layout");
  const [openCus, setOpenCus] = useState(false);

  const callbackNav: CallbackNavType = (select, open) => {
    setSelected(select);
    setOpenCus(open);
  };

  return (
    <>
      {/* <div className={`customizer-links ${openCus ? "open" : ""}`}>
        <NavCustomizer callbackNav={callbackNav} selected={selected} />
      </div> */}
      <div className={`customizer-contain ${openCus ? "open" : ""}`}>
        <TabCustomizer selected={selected} callbackNav={callbackNav} />
      </div>
    </>
  );
}
