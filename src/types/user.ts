import { ChangeEventHandler, ElementType } from "react";
import { InputType } from "reactstrap/types/lib/Input";
import { IPinSettings } from "./setting";

export interface IUser {
  _id: string;
  parentUCode?: string;
  sponsorUCode?: string | {
    _id:string;
    username:string;
    name:string
  };
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  username: string;
  walletId?: string;
  wallet_address?: string;
  gender?: string;
  dob?: Date;
  role: string;
  kycStatus: number;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    countryCode?: string;
    postalCode?: string;
  };
  accountStatus?: {
    activeStatus?: number;
    blockStatus?: number;
    activeDate?: Date;
  };
  bankDetails?: {
    account?: string;
    IFSC?: string;
    bank?: string;
    accountType?: string;
  };
  upiDetails?: {
    gPay?: string;
    phonePe?: string;
    bharatPe?: string;
    payTM?: string;
    upiId?: string;
  };
  nominee: {
    name?: string;
    relation?: string;
    dob?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      country?: string;
      countryCode?: string;
      postalCode?: string;
    };
  };
  panCard?: {
    panNo?: string;
    image?: string;
  };
  identityProof?: {
    proofType?: "Adhaar" | "VoterID" | "Passport" | "Driving License";
    proofNumber?: string;
    image1?: string;
    image2?: string;
  };
  payment?: {
    paymentId?: string;
    amount?: number;
    dateTime?: Date;
  };
  profilePicture?: string;
  ip?: string;
  source?: string;
  accessLevels?: number[];
  resetPasswordToken?: string;
  settings?: Record<string, any>;
  validityDate?: Date;
  planName?: string;
  cryptoAddress?: string;
  metadata?: Record<string, any>;
  lastLogin?: Date;
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
  myRank?: string;
  withdraw_status: number;
  position: number;
  reason?: string;
  status: number;
  package?: number;
}

export interface ICheckWalletQuery {
  address: string;
}

export interface IRegisterUserResponse {
  token: string;
  user: IUser;
}

export interface IUserWalletInfo {
  [key: string]: string | number | null;
}

export interface CommonUserFormGroupProps {
  value: string | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  tag?: ElementType;
  name: string | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  title: string;
  type: InputType;
  placeholder?: string;
  defaultValue?: string;
  row?: number;
  invalid?: boolean;
}

export interface IUserAddress {
  stateCode: any;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
}

export interface IUserProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  profilePicture?: string;
  address?: IUserAddress;
}

export type ProfileUpdatePayload = Partial<IUserProfile> | FormData;
export type ProfileUpdateType = "data" | "avatar";

export interface IUserDirectsQuery {
  userId: string;
  limit?: number | string;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
  withPackage?: string;
  page?: number | string;
}

export interface IGetUserGenerationPayload {
  userId: string;
  maxDepth?: number;
}

export interface INewsEvent {
  _id: string;
  title: string;
  description: string;
  images: string[];
  hotlinks?: Hotlink[];
  tags?: string[];
  category: "news" | "event";
  date: string;
  eventDate?: string;
  createdAt?: string;
  expiresAt: string | null;
}

export interface UserState {
  user: IUser | null;
  userWallet: IUserWalletInfo | null;
  userDirects: IUser[];
  hierarchy: IUserHierarchy[];
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  newsEvents: INewsEvent[];
  newsThumbnails: string[];
  latestNews: INewsEvent[];
}

interface Hotlink {
  label: string;
  url: string;
  _id?: string;
}

export interface IUserHierarchy {
  _id: string;
  username: string;
  name: string;
  sponsorUCode: string;
  planType: "unilevel" | "binary" | "matrix";
  createdAt: string;
  depth: number;
}

export type IHierarchyNode = IUserHierarchy & { children: IHierarchyNode[] };

export interface IUserTopUpPayload {
  pinId: string;
  amount?: number;
  username?: string;
}

export interface IOrder {
  _id: string;
  uCode:
    | string
    | {
        _id: string;
        username: string;
        name: string;
      };
  pinId: string | IPinSettings;
  activeId: number;
  txType: string;
  bv: string;
  pv?: string;
  payOutStatus: number;
  amount: number;
  validity?: number;
  status: number;
  billingAddress?: string;
  shippingAddress?: string;
  orderDate?: Date;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserRankAndTeamMetric {
  [slug: string]: number | number[];
}

export interface IUserRewardTeamMetrics {
  [slug: string]: number | number[];
}
export interface IUserTeamMetric {
  activeRoiIncomeRequiredDirects: number;
  userTotalDirects: number;
  userActiveDirects: number;
  userInActiveDirects: number;
  userTotalGeneration: number;
}

export interface IUserCappingStatus {
  totalPackageAmount: number;
  totalCapping: number;
  remainingCap: number;
  cappingProgress: string;
}

export interface IUserLevelWiseGenerationQuery {
  userId: string;
  level?: number;
}

export interface IUseWithPackageQuery {
  userId: string;
}

export interface IUserLevelWiseGenerationResponse {
  level: number;
  user: IUser;
  team: IUser[];
  totalTeamBusiness: number;
  totalDirects: number;
  activeDirects: number;
  inActiveDirects: number;
}
