import { DarkLayoutTitle } from "@/constants";
import { darkColorOptions } from "@/data/theme-customizer";
import { addSideBarBackGround } from "@/redux-toolkit/slices/layout/themeCustomizerSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function DarkLayout() {
  const dispatch = useDispatch();
  const [colorBackground1, setColorBackground1] = useState("");
  const [colorBackground2, setColorBackground2] = useState("");

  const handleColorChange = (primaryColor: string, secondaryColor: string) => {
    dispatch(addSideBarBackGround("dark-only"));
    document.body.className = "dark-only";
    setColorBackground1(primaryColor);
    setColorBackground2(secondaryColor);
    document.documentElement.style.setProperty(
      "--theme-default",
      colorBackground1
    );
    document.documentElement.style.setProperty(
      "--theme-secondary",
      colorBackground2
    );
  };
  return (
    <>
      <h6>{DarkLayoutTitle}</h6>
      <ul className="layout-grid customizer-color flex-row dark">
        {darkColorOptions.map((colorOption, index) => (
          <li
            key={index}
            className="color-layout"
            data-attr={colorOption.name}
            data-primary={colorOption.primary}
            data-secondary={colorOption.secondary}
            onClick={() =>
              handleColorChange(colorOption.primary, colorOption.secondary)
            }
          >
            <div />
          </li>
        ))}
      </ul>
    </>
  );
}
