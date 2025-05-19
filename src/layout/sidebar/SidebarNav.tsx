import { Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Pinned } from "@/constants/index";
import { SidebarItemType, SidebarMenuType } from "@/types/layout";
import { MenuItem, MenuItemChild } from "@/types";
import BackButton from "./BackButton";
import SidebarSubMenu from "./SidebarSubMenu";
import { useMenuItems } from "@/hooks/useUserSettings";
import { RootState } from "../../redux-toolkit/store";
import { usePathname } from "next/navigation";

type PositiveNumber = number & { __brand: "PositiveNumber" };

export default function SidebarNav({
  sidebarMargin,
}: {
  sidebarMargin: number;
}) {
  const [activeMenu, setActiveMenu] = useState<SidebarItemType[]>([]);
  const { pinedMenu, sidebarSearchTerm } = useSelector(
    (state: RootState) => state.layout
  );
  const menuItems = useMenuItems();
  const DEFAULT_ICON = "circle";
  const pathname = usePathname();

  const convertedMenuList = useMemo(() => {
    if (!menuItems?.items || menuItems.items.length === 0) return [];

    const getSafeIcon = (icon?: string) =>
      icon ? icon.replace("Icon", "").toLowerCase() : DEFAULT_ICON;

    return [
      {
        title: "Main Menu",
        menu: menuItems.items
          .filter((item: MenuItem) => item.status)
          .map((item: MenuItem) => {
            const parentKey = item.key ? `/${item.key}` : "";
            return {
              title: item.label,
              name: item.label,
              icon: getSafeIcon(item.icon),
              url: item.key ? `/dashboard${parentKey}` : undefined,
              type: "link",
              active: undefined,
              subMenu: item.children
                ? item.children
                  .filter((child: MenuItemChild) => child.status)
                  .map((child: MenuItemChild) => {
                    const childUrl = parentKey
                      ? `${parentKey}/${child.key.replace(
                        `${item.key}/`,
                        ""
                      )}`
                      : `/${child.key}`;
                    return {
                      title: child.label,
                      url: `/dashboard${childUrl}`,
                      icon: getSafeIcon(child.icon),
                      type: "sub",
                      active: undefined,
                    };
                  })
                : undefined,
            };
          }),
      },
    ] as SidebarMenuType[];
  }, [menuItems]);
  const filteredMenuList = useMemo(() => {
    if (!sidebarSearchTerm) return convertedMenuList;
    const searchTerm = sidebarSearchTerm.toLowerCase();
    return convertedMenuList.map((mainMenu) => ({
      ...mainMenu,
      menu: mainMenu.menu.filter((submenu) => {
        const matchesTitle = submenu.title?.toLowerCase().includes(searchTerm);
        const matchesSubMenu = submenu.subMenu?.some((child) =>
          child.title?.toLowerCase().includes(searchTerm)
        );
        return matchesTitle || matchesSubMenu;
      }),
    }));
  }, [sidebarSearchTerm, convertedMenuList]);

  const shouldHideMenu = (mainMenu: SidebarMenuType) =>
    mainMenu.menu.every((item) => pinedMenu.includes(item.title || ""));

  const isActive = (url?: string): boolean => {
    if (!url) return false;
    const normalizedPathname = pathname.split("?")[0].replace(/\/$/, "");
    const normalizedUrl = url.split("?")[0].replace(/\/$/, "");
    return normalizedPathname === normalizedUrl || normalizedPathname.startsWith(normalizedUrl);
  };

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
                  className={`pin-title sidebar-main-title ${pinedMenu.length > 0 ? "show" : ""
                    }`}
                >
                  <div>
                    <h6>{Pinned}</h6>
                  </div>
                </li>
                {filteredMenuList.map((mainMenu, i) => (
                  <Fragment key={i}>
                    <li
                      className={`sidebar-main-title ${shouldHideMenu(mainMenu) ? "d-none" : ""
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
                        active: isActive(item.url),
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
