import { LayoutTypeTitle } from "@/constants";
import { layoutTypeData } from "@/data/theme-customizer";
import { setLayoutType } from "@/redux-toolkit/slices/layout/themeCustomizerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "reactstrap";
import { RootState } from "@/redux-toolkit/store";
import CommenUL from "./common/CommenUL";

export default function LayoutType() {
  const { layout_type } = useSelector(
    (state: RootState) => state.themeCustomizer
  );
  const dispatch = useDispatch();
  const handleLayout = (layout: string) => {
    dispatch(setLayoutType(layout));
    if (layout === "rtl") {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
      document.body.classList.remove("box-layout");
      document.documentElement.dir = "rtl";
    } else if (layout === "ltr") {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
      document.body.classList.remove("box-layout");
      document.documentElement.dir = "ltr";
    } else if (layout === "box-layout") {
      document.body.classList.remove("ltr");
      document.body.classList.remove("rtl");
      document.body.classList.add("box-layout");
      document.body.classList.remove("offcanvas");
      document.documentElement.dir = "ltr";
    }
  };
  return (
    <>
      <h6>{LayoutTypeTitle}</h6>
      <ul className="main-layout layout-grid flex-row simple-list">
        {layoutTypeData.map(({ type, label }) => (
          <li
            key={type}
            data-attr={type}
            className={`${layout_type === type ? "active" : ""}`}
            onClick={() => handleLayout(type)}
          >
            <div className="header bg-light">
              <CommenUL />
            </div>
            <div className="body">
              <ul className="simple-list flex-row">
                <li
                  className={
                    type === "rtl" ? "bg-light body" : "bg-light sidebar"
                  }
                >
                  {label === "RTL" ? (
                    <Badge color="primary">{label}</Badge>
                  ) : (
                    ""
                  )}
                </li>
                <li
                  className={
                    type === "rtl" ? "bg-light sidebar" : "bg-light body"
                  }
                >
                  {label !== "RTL" ? (
                    <Badge color="primary">{label}</Badge>
                  ) : (
                    ""
                  )}
                </li>
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
