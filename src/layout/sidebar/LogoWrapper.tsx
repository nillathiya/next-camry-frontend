import { DefaultLogo, ImagePath } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { Grid } from "react-feather";
import { useDispatch } from "react-redux";
import { setSideBarToggle } from "@/redux-toolkit/slices/layout/layoutSlice";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import { useCompanyLogo } from "@/hooks/useCompanyInfo";
import { API_URL } from "@/api/route";

export default function LogoWrapper() {
  const companyLogo = useCompanyLogo();

  const dispatch = useDispatch();
  const { sideBarToggle } = useAppSelector((state) => state.layout);
  const handleSidebarToggle = () => {
    if (sideBarToggle == "close_icon") {
      dispatch(setSideBarToggle(""));
    } else if (sideBarToggle == "") {
      dispatch(setSideBarToggle("close_icon"));
    }
  };
  const closeSideBar = () => {
    dispatch(setSideBarToggle("close_icon"));
  };
  return (
    <div className="logo-wrapper">
      <Link href={`/dashboard/default`}>
        <Image
          height={102}
          width={90}
          className="img-fluid"
          src={
            companyLogo
              ? `${API_URL}${companyLogo}`
              : `${ImagePath}${DefaultLogo}`
          }
          alt=""
        />
      </Link>
      <div className="back-btn" onClick={closeSideBar}>
        <i className="fa fa-angle-left"></i>
      </div>
      <div className="toggle-sidebar" onClick={handleSidebarToggle}>
        <Grid className="status_toggle middle sidebar-toggle" />
      </div>
    </div>
  );
}
