import ColorsComponent from "./ColorsComponent";
import DarkLayout from "./DarkLayout";
import LayoutType from "./LayoutType";
import LightLayout from "./LightLayout";
import MixLayout from "./MixLayout";
import SideBarIconType from "./SideBarIconType";
import SidebarType from "./SidebarType";

export default function SidebarCusmizer() {
  return (
    <>
      <LayoutType />
      <SidebarType />
      <SideBarIconType />
      <ColorsComponent />
      <LightLayout />
      <DarkLayout />
      <MixLayout />
    </>
  );
}
