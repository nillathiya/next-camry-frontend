export interface IUser {
  _id: string;
  parentUCode?: string;
  sponsorUCode?: string;
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
  // Account & Status
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
}
