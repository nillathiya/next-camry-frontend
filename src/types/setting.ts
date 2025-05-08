export interface IWebsiteSettings {
  _id: string;
  name: string;
  title: string;
  slug: string;
  type: string[] | boolean | number | string | undefined;
  value: string[];
  description?: string;
  adminStatus: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for menu item children
export interface MenuItemChild {
  key: string;
  label: string;
  status: boolean | string;
  icon?: string;
}

// Interface for menu items (for "Menu Items" setting)
export interface MenuItem {
  key: string;
  title: string;
  label: string;
  slug: string;
  status: boolean;
  children?: MenuItemChild[];
  icon?: string;
}

// Interface for generic setting options/values
export interface SettingOption {
  key: string;
  label: string;
  status: boolean;
}

// Main user setting interface
export interface IUserSetting {
  _id: string;
  __v?: number;
  title: string;
  name: string;
  slug: string;
  type: "array" | "boolean" | "string" | "number" | "text";
  options: string[] | SettingOption[] | string;
  image: string | null;
  value: MenuItem[] | SettingOption[] | boolean | string | number;
  status: number;
  adminStatus: number;
}

export interface IWalletSettings {
  _id: string;
  parentId?: string; // Ref to Wallet._id
  slug: string;
  name?: string;
  wallet?: string;
  type?: string;
  binary: number;
  matrix: number;
  universal: number;
  singleLeg: number;
  status: number;
  adminStatus: number;
  column?: string;
  createdAt: string;
  updatedAt: string;
}
