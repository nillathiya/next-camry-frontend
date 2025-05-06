import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsSearchBarOpen,
  setSearchClass,
} from "@/redux-toolkit/slices/layout/layoutSlice";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import HeaderBookmark from "./bookmark";
import CartHeader from "./cart-header";
import ChatHeader from "./ChatHeader";
import MaximizeScreen from "./MaximizeScreen";
import NotificationBox from "./NotificationBox";
import ProfileHeader from "./ProfileHeader";
import { signOut } from "next-auth/react";

const MoonLight = dynamic(() => import("./MoonLight"), {
  ssr: false,
});

const RightHeader = () => {
  const dispatch = useDispatch();
  const { isSearchBarOpen, searchClass } = useAppSelector(
    (state) => state.layout
  );

  const handleSearch = () => {
    dispatch(setSearchClass(!searchClass));
    dispatch(setIsSearchBarOpen(!isSearchBarOpen));
  };

  const handleSignOut = () => {
    console.log("User signed out from Header");
    signOut({ redirect: true, callbackUrl: "/login" }); // Redirect to /login after sign-out
  };

  return (
    <ul className="nav-menus simple-list flex-row">
      <li>
        <span className="header-search">
          <SvgIcon onClick={handleSearch} iconId="search" />
        </span>
      </li>
      <MaximizeScreen />
      <NotificationBox />
      <HeaderBookmark />
      <ChatHeader />
      <MoonLight />
      <CartHeader />
      <ProfileHeader />
    </ul>
  );
};

export default RightHeader;
