import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import ConfigDB from "@/config/ThemeConfig";
import { Href } from "@/constants/index";
import { MenuListType, SidebarItemType } from "@/types/layout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "reactstrap";
import { setPinedMenu } from "../../redux-toolkit/slices/layout/layoutSlice";
import { RootState } from "../../redux-toolkit/store";

export default function SidebarSubMenu({
  menu,
  setActiveMenu,
  activeMenu,
  level,
}: MenuListType) {
  const layout = ConfigDB.settings.sidebar.type;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { pinedMenu } = useSelector((state: RootState) => state.layout);

  const handlePined = (value: string) => {
    if (!pinedMenu.includes(value)) {
      dispatch(setPinedMenu([...pinedMenu, value]));
    } else {
      const filterMenu = pinedMenu.filter((item) => item !== value);
      dispatch(setPinedMenu(filterMenu));
    }
  };

  const isActive = (item: SidebarItemType): boolean => {
    if (!item.url) return false;

    // Normalize paths by removing trailing slashes
    const itemPath = item.url.replace(/\/+$/, "");
    const currentPath = pathname.replace(/\/+$/, "");

    return currentPath === itemPath;
  };

  const isChildActive = (item: SidebarItemType): boolean => {
    if (!item.subMenu) return false;
    return item.subMenu.some((subItem) => isActive(subItem));
  };

  const isMenuOpen = (item: SidebarItemType): boolean => {
    return activeMenu[level] === item.title || isChildActive(item);
  };

  return (
    <>
      {menu.map((item, i) => (
        <li
          key={i}
          className={`${level === 0 ? "sidebar-list" : ""} ${
            pinedMenu.includes(item.title) ? "pined" : ""
          } ${isActive(item) || isChildActive(item) ? "active" : ""}`}
        >
          {level === 0 && (
            <i
              className="fa fa-thumb-tack"
              onClick={() => item.title && handlePined(item.title)}
            />
          )}

          {item.subMenu?.length ? (
            <Badge color="primary" className="ms-2">
              {item.subMenu.length}
            </Badge>
          ) : null}

          <Link
            className={`${level === 0 ? "sidebar-link sidebar-title" : ""} ${
              isActive(item) ? "active" : ""
            }`}
            href={item.url || Href}
            onClick={(e) => {
              if (item.subMenu) {
                e.preventDefault();
                const temp = [...activeMenu];
                temp[level] =
                  temp[level] === item.title ? undefined : item.title;
                setActiveMenu(temp);
              }
            }}
          >
            {item.icon && level === 0 && (
              <SvgIcon className="stroke-icon" iconId={`stroke-${item.icon}`} />
            )}
            {level === 0 ? (
              <span className="lan-3">{item.title}</span>
            ) : (
              item.title
            )}

            {item.subMenu && (
              <>
                {layout === "compact-wrapper" && (
                  <div className="according-menu">
                    {isMenuOpen(item) ? (
                      <i className="fa fa-angle-down" />
                    ) : (
                      <i className="fa fa-angle-right" />
                    )}
                  </div>
                )}
                {layout === "horizontal-wrapper" && (
                  <span className="sub-arrow arrow-none">
                    {isMenuOpen(item) ? (
                      <i className="fa fa-angle-down" />
                    ) : (
                      <i className="fa fa-angle-right" />
                    )}
                  </span>
                )}
              </>
            )}
          </Link>

          {item.subMenu && (
            <ul
              className={`${
                level === 0
                  ? "sidebar-submenu"
                  : "nav-sub-childmenu submenu-content"
              }`}
              style={{
                display: isMenuOpen(item) ? "block" : "none",
              }}
            >
              <SidebarSubMenu
                menu={item.subMenu}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                level={level + 1}
              />
            </ul>
          )}
        </li>
      ))}
    </>
  );
}
