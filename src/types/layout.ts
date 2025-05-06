import { ChangeEvent, ReactNode } from "react";

export interface SubChildrenType {
  title: string;
  type: string;
  url: string;
}

export interface SidebarChildrenType {
  url?: string;
  id?: number;
  icon?: string;
  active?: boolean;
  title: string;
  type: string;
  subMenu?: SubChildrenType[];
  bookmark?: boolean;
}

export interface SidebarItemType {
  id?: number;
  title?: string | any;
  name?: string
  icon?: string;
  badge?: boolean;
  badgeName?: string;
  badgeColor?: string;
  type?: string;
  active?: boolean;
  url?: string;
  pathName?:string;
  bookmark?: boolean;
  subMenu?: SidebarChildrenType[];
}

export interface SidebarSliceType {
  linkItemsArray: SearchBarArrayType[];
  bookmarkedData: bookmarkedDataType[];
}
export interface SearchBarArrayType {
  name: string;
  pathName: any;
  icon: ReactNode;
  bookmarked: boolean;
  id: number;
}

export interface bookmarkedDataType {
  icon: string;
  name?: string;
  title?: string
  pathName: string;
  id?: number;
}

export interface SidebarMenuType {
  id?: number;
  title?: string | any;
  menu: SidebarItemType[];
}

export interface LayoutStateProps {
  isSearchBarOpen?: boolean;
  bookMarkClass: boolean;
  pinedMenu: string[];
  sideBarToggle: string | undefined;
  sidebarSearchTerm: string;
  bookmarkToggle: string | undefined;
  removeSidebar: string | undefined;
  searchClass:boolean
}

export interface MenuListType {
  menu: SidebarItemType[];
  setActiveMenu: (temp: SidebarItemType[]) => void;
  activeMenu: any;
  level: number;
}

export interface SearchInputProp {
  setSearchItems?:any
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface SearchResultProp {
  suggestion: SidebarItemType[];
}
export interface ChangeLngType {
  data: string;
  logo: string;
  language: string;
}

export interface CallbackNavType {
  (select: string, open: boolean): void;
}
export interface NavCustomizerProps {
  callbackNav: CallbackNavType;
  selected: string;
}

export interface ConfigurationProps {
  modal: boolean;
  toggle: () => void;
}

export interface ColorsType {
  colorBackground1: string;
  colorBackground2: string;
}

export interface ChangeLngType {
  data: string;
  language: string;
}
