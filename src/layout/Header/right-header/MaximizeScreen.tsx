import { Href } from "@/constants";
import { useState } from "react";
import { Maximize } from "react-feather";

export default function MaximizeScreen() {
  const [fullScreen, setFullScreen] = useState(false);

  const fullScreenHandler = (isFullScreen: boolean) => {
    setFullScreen(isFullScreen);
    if (isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document?.exitFullscreen();
    }
  };

  return (
    <li>
      <a className="text-dark" onClick={() => fullScreenHandler(!fullScreen)} href={Href}>
        <Maximize />
      </a>
    </li>
  );
}
