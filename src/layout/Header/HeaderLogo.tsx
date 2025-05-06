import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { ImagePath } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { setSideBarToggle } from "@/redux-toolkit/slices/layout/layoutSlice";
import { useAppSelector } from "@/redux-toolkit/Hooks";

const HeaderLogo = () => {
  const dispatch = useDispatch();
  
  const { sideBarToggle } = useAppSelector((state) => state.layout);

  const handleSidebarToggle = () => {
    if (sideBarToggle == "close_icon") {
      dispatch(setSideBarToggle(""));
    } else if (sideBarToggle == "") {
      dispatch(setSideBarToggle("close_icon"));
    }
  };

  return (
    <Col xs="auto" className="header-left-wrapper">
      <div className="header-logo-wrapper p-0 left-header">
        <div className="logo-wrapper">
          <Link href={`/dashboard/default`}>
            <Image className="img-fluid" src={`${ImagePath}/logo/logo_dark.png`} alt="" height={30} width={102} />
          </Link>
        </div>
      </div>
      <div className="toggle-sidebar" onClick={handleSidebarToggle}>
        <SvgIcon className="status_toggle sidebar-toggle" iconId="collapse-sidebar" />
      </div>
    </Col>
  );
};

export default HeaderLogo;
