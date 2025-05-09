export interface IFundTransaction {
  _id: string;
  txUCode: string | null;
  uCode: string | null;
  txType?: string;
  debitCredit?: string;
  fromWalletType?: string;
  walletType?: string;
  amount?: number;
  txCharge?: number;
  paymentSlip?: string;
  txNumber?: string;
  uuid?: string;
  postWalletBalance?: number;
  currentWalletBalance?: number;
  method?: string | null;
  account?: string | null;
  withdrawalAccountType?: string | null;
  withdrawalAccount?: string | null;
  withdrawalMethod?: string | null;
  response?: string;
  reason?: string;
  remark?: string;
  isRetrieveFund: boolean;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}
