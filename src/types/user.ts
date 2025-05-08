import { ChangeEventHandler } from "react";
import { InputType } from "reactstrap/types/lib/Input";

export interface IUser {
  _id: string;
  parentUCode?: string;
  name: string;
  email: string;
  password: string;
  contactNumber?: string;
  city?: string;
  gender?: "Male" | "Female" | "Other";
  dob?: Date;
  state?: string;
  myRank?: string;
  username: string;
  walletId?: string;
  sponsorUCode?: string;
  country?: string;
  wallet_address?: string;
  address?: IUserAddress;
  withdraw_status: number;
  position: number;
  parent?: string;
  img?: string;
  profilePicture?: string;
  ip?: string;
  source?: string;
  accessLevel?: number[];
  resetPasswordToken?: string;
  settings?: Record<string, any>;
  planName?: string;
  role?: string;
  accountStatus?: {
    activeId?: number;
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
  cryptoAddress?: string;
  upi?: {
    gPay?: string;
    phonePe?: string;
    bharatPe?: string;
    payTM?: string;
    upiId?: string;
  };
  nominee?: {
    name?: string;
    relation?: string;
    dob?: string;
    address?: string;
    city?: string;
    state?: string;
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
  reason?: string;
  kycStatus: number;
  status: number;
  lastLogin?: Date;
  lastActivity?: Date;
  // createdAt: string;
  updatedAt: string;
}

export interface ICheckWalletQuery {
  address: string;
}

export interface IRegisterUserResponse {
  token: string;
  user: IUser;
}

export interface CommonUserFormGroupProps {
  value: string | undefined;
  disabled: boolean | undefined;
  readOnly: boolean | undefined;
  tag: string;
  name: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
  title: string;
  type: InputType;
  placeholder?: string;
  defaultValue?: string;
  row?: number;
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

export interface IUser extends IUserProfile {
  id: string;
  role?: string;
  createdAt?: string;
}

export type ProfileUpdatePayload = Partial<IUserProfile> | FormData;
export type ProfileUpdateType = 'data' | 'avatar';