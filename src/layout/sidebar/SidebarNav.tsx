import { Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Pinned } from "@/constants/index";
import { SidebarItemType, SidebarMenuType } from "@/types/layout";
import BackButton from "./BackButton";
import SidebarSubMenu from "./SidebarSubMenu";
import { useUserSettings } from "@/hooks/useUserSettings";
import { RootState } from "../../redux-toolkit/store";
import { usePathname } from "next/navigation"; // Add this import

interface MenuItem {
  url: string;
  key: string;
  label: string;
  name?: string;
  icon?: string;
  status: boolean | string;
  children?: MenuItem[];
}

export default function SidebarNav({
  sidebarMargin,
}: {
  sidebarMargin: number;
}) {
  const [activeMenu, setActiveMenu] = useState<string[]>([]); // Changed to string[]
  const { pinedMenu, sidebarSearchTerm } = useSelector(
    (state: RootState) => state.layout
  );
  const { userSettings } = useUserSettings();
  const DEFAULT_ICON = "circle";
  const pathname = usePathname(); // Added pathname hook

  // Get menu items from API response
  const menuSettings = userSettings.find(
    (setting) => setting.slug === "menu_items"
  );
  const apiMenuItems = (menuSettings?.value || []) as MenuItem[];

  // Convert API menu items to your existing format
  const convertedMenuList = useMemo(() => {
    if (!apiMenuItems.length) return [];

    const getSafeIcon = (icon?: string) => {
      return icon ? icon.replace("Icon", "").toLowerCase() : DEFAULT_ICON;
    };

    return [
      {
        title: menuSettings?.name || "Main Menu",
        menu: apiMenuItems
          .filter((item) => item.status === true || item.status === "true")
          .map((item) => ({
            title: item.label,
            displayName: item.label,
            icon: getSafeIcon(item.icon),
            url: item.key, // Use key directly without adding extra slash
            subMenu: item.children
              ? item.children
                  .filter(
                    (child) => child.status === true || child.status === "true"
                  )
                  .map((child) => ({
                    title: child.label,
                    displayName: child.label,
                    url: child.key, // Use key directly without adding extra slash
                    icon: getSafeIcon(child.icon),
                  }))
              : undefined,
          })),
      },
    ];
  }, [apiMenuItems, menuSettings]);

  const filteredMenuList = useMemo(() => {
    if (!sidebarSearchTerm) return convertedMenuList;

    return convertedMenuList.map((mainMenu) => {
      const filteredSubMenu = mainMenu.menu.filter((submenu) => {
        if (submenu.title) {
          return submenu.title
            .toLowerCase()
            .includes(sidebarSearchTerm.toLowerCase());
        }
        return false;
      });
      return {
        ...mainMenu,
        menu: filteredSubMenu,
      };
    });
  }, [sidebarSearchTerm, convertedMenuList]);

  const shouldHideMenu = (mainMenu: SidebarMenuType) => {
    return mainMenu.menu
      .map((data) => data.title)
      .every((tittles) => pinedMenu.includes(tittles as string));
  };

  return (
    <ul className="sidebar-links simple-list custom-scrollbar" id="simple-bar">
      <div className="simplebar-wrapper">
        <div className="simplebar-mask">
          <div className="simplebar-offset">
            <div className="simplebar-content-wrapper">
              <div
                className="simplebar-content"
                style={{ marginLeft: sidebarMargin.toString() + "px" }}
              >
                <BackButton />
                <li
                  className={`pin-title sidebar-main-title ${
                    pinedMenu.length > 0 ? "show" : ""
                  } `}
                >
                  <div>
                    <h6>{Pinned}</h6>
                  </div>
                </li>
                {filteredMenuList &&
                  filteredMenuList.map((mainMenu, i) => (
                    <Fragment key={i}>
                      <li
                        className={`sidebar-main-title ${
                          shouldHideMenu(mainMenu) ? "d-none" : ""
                        }`}
                      >
                        <div>
                          <h6 className="lan-1">{(mainMenu.title)}</h6>
                        </div>
                      </li>
                      <SidebarSubMenu
                        menu={mainMenu.menu.map((item) => ({
                          ...item,
                          title: item.displayName || item.title,
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
