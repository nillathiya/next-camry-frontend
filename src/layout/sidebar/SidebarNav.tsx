import { Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Pinned } from "@/constants/index";
import { SidebarItemType, SidebarMenuType } from "@/types/layout";
import { MenuItem } from "@/types";
import BackButton from "./BackButton";
import SidebarSubMenu from "./SidebarSubMenu";
import { useMenuItems } from "@/hooks/useUserSettings";
import { RootState } from "../../redux-toolkit/store";
import { usePathname } from "next/navigation";

// Define a type for positive numbers
type PositiveNumber = number & { __brand: "PositiveNumber" };

export default function SidebarNav({
  sidebarMargin,
}: {
  sidebarMargin: PositiveNumber;
}) {
  // Align activeMenu with SidebarItemType
  const [activeMenu, setActiveMenu] = useState<SidebarItemType[]>([]);
  const { pinedMenu, sidebarSearchTerm } = useSelector(
    (state: RootState) => state.layout
  );
  const menuItems = useMenuItems();
  const DEFAULT_ICON = "circle";
  const pathname = usePathname();

  console.log("menuItems",menuItems);
  // Convert API menu items to SidebarMenuType
  const convertedMenuList = useMemo(() => {
    if (!menuItems?.length) return [];

    console.log("menuItems", menuItems);

    const getSafeIcon = (icon?: string) =>
      icon ? icon.replace("Icon", "").toLowerCase() : DEFAULT_ICON;

    return [
      {
        title: "Main Menu",
        menu: menuItems
          .filter((item) => item.status)
          .map((item) => ({
            title: item.label,
            name: item.label,
            icon: getSafeIcon(item.icon),
            url: item.key,
            type: "link",
            active: undefined, // Explicitly set to undefined to avoid type issues
            subMenu: item.children
              ? item.children
                  .filter((child) => child.status)
                  .map((child) => ({
                    title: child.label,
                    url: child.key,
                    icon: getSafeIcon(child.icon),
                    type: "sub",
                    active: undefined, // Explicitly set to undefined
                  }))
              : undefined,
          })),
      },
    ] as SidebarMenuType[];
  }, [menuItems]);

  console.log("convertedMenuList", convertedMenuList);

  // Filter menu based on search term
  const filteredMenuList = useMemo(() => {
    if (!sidebarSearchTerm) return convertedMenuList;

    return convertedMenuList.map((mainMenu) => ({
      ...mainMenu,
      menu: mainMenu.menu.filter((submenu) =>
        submenu.title?.toLowerCase().includes(sidebarSearchTerm.toLowerCase())
      ),
    }));
  }, [sidebarSearchTerm, convertedMenuList]);

  const shouldHideMenu = (mainMenu: SidebarMenuType) =>
    mainMenu.menu.every((item) => pinedMenu.includes(item.title || ""));

  // Highlight active menu item based on pathname
  const isActive = (url?: string): boolean => !!url && pathname === url;

  console.log("filteredMenuList", filteredMenuList);

  return (
    <ul className="sidebar-links simple-list custom-scrollbar" id="simple-bar">
      <div className="simplebar-wrapper">
        <div className="simplebar-mask">
          <div className="simplebar-offset">
            <div className="simplebar-content-wrapper">
              <div
                className="simplebar-content"
                style={{ marginLeft: `${sidebarMargin}px` }}
              >
                <BackButton />
                {filteredMenuList.length === 0 && (
                  <li className="sidebar-main-title">
                    <div>
                      <h6>No menu items available</h6>
                    </div>
                  </li>
                )}
                <li
                  className={`pin-title sidebar-main-title ${
                    pinedMenu.length > 0 ? "show" : ""
                  }`}
                >
                  <div>
                    <h6>{Pinned}</h6>
                  </div>
                </li>
                {filteredMenuList.map((mainMenu, i) => (
                  <Fragment key={i}>
                    <li
                      className={`sidebar-main-title ${
                        shouldHideMenu(mainMenu) ? "d-none" : ""
                      }`}
                    >
                      <div>
                        <h6 className="lan-1">{mainMenu.title}</h6>
                      </div>
                    </li>
                    <SidebarSubMenu
                      menu={mainMenu.menu.map((item) => ({
                        ...item,
                        title: item.name || item.title,
                        active: isActive(item.url), // Explicitly boolean
                      }))}
                      activeMenu={activeMenu}
                      setActiveMenu={setActiveMenu}
                      level={0}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ul>
  );
}
