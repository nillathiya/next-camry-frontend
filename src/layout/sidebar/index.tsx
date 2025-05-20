import { useAppDispatch } from "@/redux-toolkit/Hooks";
import { getLinkItemsArray } from "@/redux-toolkit/slices/bookMarkDataSlice";
import { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store";
import LogoIconWrapper from "./LogoIconWrapper";
import LogoWrapper from "./LogoWrapper";
import ProfileSection from "./ProfileSection";
import SidebarNav from "./SidebarNav";
import SidebarSearch from "./SidebarSearch";
import { ArrowLeft, ArrowRight } from "react-feather";

// Define PositiveNumber type in Sidebar if not imported
type PositiveNumber = number & { __brand: "PositiveNumber" };

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const [sidebarMargin, setSidebarMargin] = useState(0); // Plain number
  const { sideBarToggle } = useSelector((state: RootState) => state.layout);

  useEffect(() => {
    // Existing useEffect logic
    let num = 0;
    const tempt: any = [];
    const getAllLink = (item: any, icon: JSX.Element | undefined) => {
      if (item.length > 0) {
        item.map((ele: any) => getAllLink(ele, icon));
      } else {
        num = num + 1;
        tempt.push({
          name: item.title,
          pathName: item.url,
          icon: icon,
          bookmarked: false,
          id: num,
        });
      }
    };
    dispatch(getLinkItemsArray(tempt));
  }, [dispatch]);

  // Helper to create PositiveNumber
  const toPositiveNumber = (value: number): PositiveNumber => {
    if (value < 0) {
      return 0 as PositiveNumber; // Ensure non-negative
    }
    return value as PositiveNumber;
  };

  return (
    <div
      className={`sidebar-wrapper ${sideBarToggle}`}
      id="sidebar-wrapper"
      data-sidebar-layout="stroke-svg"
    >
      <div>
        <LogoWrapper />
        <LogoIconWrapper />
        <ProfileSection />
        <SidebarSearch />
        <nav className="sidebar-main">
          <div
            className={`left-arrow ${sidebarMargin === 0 && "disabled"}`}
            id="left-arrow"
            onClick={() => setSidebarMargin(Math.max(0, sidebarMargin + 700))}
          >
            <ArrowLeft />
          </div>
          <div id="sidebar-menu">
            <SidebarNav sidebarMargin={toPositiveNumber(sidebarMargin)} />
          </div>
          <div
            className={`right-arrow ${sidebarMargin <= 0 && "disabled"}`} // Adjusted condition
            onClick={() => setSidebarMargin(Math.max(0, sidebarMargin - 700))}
            id="right-arrow"
          >
            <ArrowRight />
          </div>
        </nav>
      </div>
    </div>
  );
}