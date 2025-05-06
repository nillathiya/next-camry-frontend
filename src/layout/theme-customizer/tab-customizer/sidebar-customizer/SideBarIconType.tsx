import { SidebarIconTitle } from "@/constants";
import { addSidebarIconType } from "@/redux-toolkit/slices/layout/themeCustomizerSlice";
import { useDispatch } from "react-redux";
import { Badge } from "reactstrap";
import ConfigDB from "@/config/ThemeConfig";
import CommenUL from "./common/CommenUL";

export default function SideBarIconType() {
  const sideBarIconType = ConfigDB.settings.sidebar.iconType;
  const dispatch = useDispatch();
  const handleSideBarIconType = (type: string) => {
    dispatch(addSidebarIconType(type));
  };
  return (
    <>
      <h6>{SidebarIconTitle}</h6>
      <ul className="sidebar-setting layout-grid flex-row simple-list">
        <li
          data-attr={"stroke-svg"}
          className={`${sideBarIconType === "stroke-svg" ? "active" : ""}`}
          onClick={() => handleSideBarIconType("stroke-svg")}
        >
          <div className="header bg-light">
            <CommenUL />
          </div>
          <div className="body bg-light">
            <Badge color="primary">{"Stroke"}</Badge>
          </div>
        </li>
      </ul>
    </>
  );
}
