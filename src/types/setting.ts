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

export interface ICompanyInfo {
  _id: string;
  name: string;
  title: string;
  slug: string;
  type: string;
  value?: string;
  description?: string;
  adminStatus: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPinSettings {
  _id: string;
  slug: string;
  name: string;
  rateMin?: number;
  rateMax?: number;
  description?: string;
  type?: "fix" | "range";
  roi?: number;
  bv?: number;
  pv?: number;
  gst?: number;
  status?: number;
  createdAt: string;
  updatedAt:string;
}

export interface IRankSettings {
  title?: string;
  slug: string;
  type?: string;
  value: string[];
  status: number;
}


export interface IRewardSettings {
  title?: string;
  slug: string;
  type?: string;
  value: string[];
  status: number;
}

export interface IPlan {
  _id:string;
  title: string;
  slug: string;
  value: string[];
  order:number;
  createdAt: string;
  updatedAt: string;
}
