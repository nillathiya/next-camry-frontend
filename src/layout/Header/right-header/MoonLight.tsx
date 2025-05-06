import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { toggleDarkMode } from "@/redux-toolkit/slices/layout/themeCustomizerSlice";

const MoonLight = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((store) => store.themeCustomizer);

  const darkModeHandler = () => {
    dispatch(toggleDarkMode());
    const body = document.body;
    if (darkMode) {
      body.classList.remove("dark-only");
      body.classList.remove("dark-sidebar");
      body.classList.add("light-only");
    } else {
      body.classList.remove("light-only");
      body.classList.remove("dark-sidebar");
      body.classList.add("dark-only");
    }
  };

  return (
    <li>
      <div className="mode">
        {darkMode ? (
          <SvgIcon
            className="moon-icon d-block"
            iconId="moon"
            onClick={darkModeHandler}
          />
        ) : (
          <SvgIcon
            className="sun-icon"
            iconId="sun"
            onClick={darkModeHandler}
          />
        )}
      </div>
    </li>
  );
};
export default MoonLight;
