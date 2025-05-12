import { ICheckWalletQuery, IUserDirectsQuery } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define the ROUTES object with proper typing
interface Routes {
  AUTH: {
    ADMIN_LOGIN: string;
    GET_NONCE: string;
    REGISTER: string;
    WEB3_REGISTER: string;
    LOGOUT: string;
    CHANGE_PASSWORD: string;
    IMPERSONATE: string;
    SEND_OTP: string;
  };
  COMPANY_INFO: {
    GET_ALL: string;
    UPDATE: (id: string) => string;
    DELETE: string;
  };
  SUPPORT: {
    GET_ALL: (
      ticket?: string,
      username?: string,
      date?: string,
      status?: number,
      limit?: number,
      page?: number
    ) => string;
    UPDATE: (id: string) => string;
    GET_ALL_TICKETS: string;
    GET_MESSAGES: (ticketId: string) => string;
    REPLY_MESSAGE: string;
    UPDATE_TICKET_STATUS: (ticketId: string) => string;
  };
  WITHDRAWAL: {
    GET_ALL: string;
    UPDATE_REQUEST: string;
  };
  USER: {
    GET_USER_WALLET: string;
    GET_BY_ID: string;
    GET_ALL: string;
    UPDATE_USER: any;
    CHECK_WALLET: (params: ICheckWalletQuery) => string;
    GET_USER_DIRECTS: (params: IUserDirectsQuery) => string;
    GET_PROFILE: string;
    EDIT_PROFILE: string;
    CHECK_NAME: string;
    GET_GENERATION_TREE: string;
    GET_DETAILS_WITH_INVEST_INFO: string;
    ADD_MEMBER: string;
    SEND_AUTHENTICATED_OTP: string;
  };
  ORDER: {
    GET_ALL: string;
    GET_BY_ID: (orderId: string) => string;
  };
  TRANSACTION: {
    GET_ALL: string;
    FUND: {
      VERIFY: string;
      GET_ALL: string;
      DIRECT_TRANSFER: string;
    };
    INCOME: {
      GET_ALL: string;
    };
  };
  SETTINGS: {
    GET_RANK_SETTINGS: string;
    GET_USER_SETTINGS: string;
    GET_ADMIN_SETTINGS: string;
    GET_WEBSITE_SETTINGS: string;
    GET_WALLET_SETTINGS: string;
    GET_COMPANY_INFO_SETTINGS: string;
    UPDATE_USER_SETTING: (id: string) => string;
    UPDATE_ADMIN_SETTING: (id: string) => string;
    CREATE: string;
    UPDATE: (id: string) => string;
    DELETE: (id: string) => string;
    DELETE_ROW: string;
    SAVE_ROW: string;
  };
  NEWS_EVENT: {
    CREATE: string;
    GET_ALL: string;
    UPDATE: string;
  };
  CONTACT_US: {
    GET_MESSAGES: string;
    TOGGLE_STATUS: string;
  };
}

// Define and export the ROUTES object
export const ROUTES: Routes = {
  AUTH: {
    ADMIN_LOGIN: `${API_URL}/api/auth/admin/login`,
    GET_NONCE: `${API_URL}/api/auth/nonce`,
    REGISTER: `${API_URL}/api/auth/register`,
    WEB3_REGISTER: `${API_URL}/api/auth/web3-register`,
    LOGOUT: `${API_URL}/api/auth/admin/logout`,
    CHANGE_PASSWORD: `${API_URL}/api/auth/change-password`,
    IMPERSONATE: `${API_URL}/api/auth/admin/impersonate`,
    SEND_OTP: `${API_URL}/api/auth/send-otp`,
  },
  COMPANY_INFO: {
    GET_ALL: `${API_URL}/api/company-info/get`,
    UPDATE: (id: string) => `${API_URL}/api/company-info/update/${id}`,
    DELETE: `${API_URL}/api/company-info/delete`,
  },
  SUPPORT: {
    GET_ALL: (
      ticket?: string,
      username?: string,
      date?: string,
      status?: number,
      limit?: number,
      page?: number
    ) => {
      const query = new URLSearchParams();

      if (ticket !== undefined && ticket !== null)
        query.append("ticket", ticket.toString());
      if (username !== undefined && username !== null)
        query.append("username", username.toString());
      if (date !== undefined && date !== null)
        query.append("date", date.toString());
      if (status !== undefined && status !== null)
        query.append("status", status.toString());
      if (limit !== undefined && limit !== null)
        query.append("limit", limit.toString());
      if (page !== undefined && page !== null)
        query.append("page", page.toString());

      return `${API_URL}/api/support/get-requests?${query.toString()}`;
    },
    UPDATE: (id: string) => `${API_URL}/api/support/update-request/${id}`,
    GET_ALL_TICKETS: `${API_URL}/api/tickets/all`,
    GET_MESSAGES: (ticketId: string) =>
      `${API_URL}/api/tickets/${ticketId}/messages`,
    REPLY_MESSAGE: `${API_URL}/api/tickets/message/reply`,
    UPDATE_TICKET_STATUS: (ticketId) =>
      `${API_URL}/api/tickets/status/${ticketId}`,
  },
  WITHDRAWAL: {
    GET_ALL: `${API_URL}/api/withdrawal/get-all-transactions`,
    UPDATE_REQUEST: `${API_URL}/api/withdrawal/update-request`,
  },
  USER: {
    GET_USER_WALLET: `${API_URL}/api/user/wallet`,
    GET_BY_ID: `${API_URL}/api/user/info/get`,
    GET_ALL: `${API_URL}/api/user/get-all`,
    UPDATE_USER: `${API_URL}/api/user/update/profile`,
    CHECK_WALLET: (params: ICheckWalletQuery) => {
      const query = new URLSearchParams();
      (Object.keys(params) as (keyof ICheckWalletQuery)[]).forEach((param) => {
        const value = params[param];
        if (value !== undefined && value !== null) {
          query.append(param, String(value));
        }
      });
      return `${API_URL}/api/user/check-wallet?${query.toString()}`;
    },
    GET_USER_DIRECTS: (params: IUserDirectsQuery) => {
      const query = new URLSearchParams();
      (Object.keys(params) as (keyof IUserDirectsQuery)[]).forEach((param) => {
        const value = params[param];
        if (value !== undefined && value !== null) {
          query.append(param, String(value));
        }
      });
      return `${API_URL}/api/user/list/directs?${query.toString()}`;
    },
    GET_PROFILE: `${API_URL}/api/user/profile`,
    EDIT_PROFILE: `${API_URL}/api/user/edit-profile`,
    CHECK_NAME: `${API_URL}/api/user/check-name`,
    GET_GENERATION_TREE: `${API_URL}/api/user/generation-tree`,
    GET_DETAILS_WITH_INVEST_INFO: `${API_URL}/api/user/details-with-investment`,
    ADD_MEMBER: `${API_URL}/api/user/create`,
    SEND_AUTHENTICATED_OTP: `${API_URL}/api/user/send-otp`,
  },
  ORDER: {
    GET_ALL: `${API_URL}/api/orders/get-all`,
    GET_BY_ID: (orderId: string) => `${API_URL}/api/orders/get/${orderId}`,
  },
  TRANSACTION: {
    GET_ALL: `${API_URL}/api/transaction/get-all`,
    FUND: {
      VERIFY: `${API_URL}/api/fund/transactions/verify`,
      GET_ALL: `${API_URL}/api/transaction/fund/all`,
      DIRECT_TRANSFER: `${API_URL}/api/transaction/direct-fund-transfer`,
    },
    INCOME: {
      GET_ALL: `${API_URL}/api/transaction/income/all`,
    },
  },
  SETTINGS: {
    GET_RANK_SETTINGS: `${API_URL}/api/rank-settings/get`,
    GET_USER_SETTINGS: `${API_URL}/api/user-setting`,
    GET_ADMIN_SETTINGS: `${API_URL}/api/admin-settings/get`,
    GET_WEBSITE_SETTINGS: `${API_URL}/api/website-setting/global`,
    GET_WALLET_SETTINGS: `${API_URL}/api/wallet-setting`,
    GET_COMPANY_INFO_SETTINGS: `${API_URL}/api/company-info`,
    UPDATE_USER_SETTING: (id: string) =>
      `${API_URL}/api/user-settings/update/${id}`,
    UPDATE_ADMIN_SETTING: (id: string) =>
      `${API_URL}/api/admin-settings/update/${id}`,

    CREATE: `${API_URL}/api/rank-settings/create`,
    UPDATE: (id: string) => `${API_URL}/api/rank-settings/update/${id}`,
    DELETE: (id: string) => `${API_URL}/api/rank-settings/delete/${id}`,
    DELETE_ROW: `${API_URL}/api/rank-settings/delete-row`,
    SAVE_ROW: `${API_URL}/api/rank-settings/save-row`,
  },
  NEWS_EVENT: {
    CREATE: `${API_URL}/api/news-events/create`,
    GET_ALL: `${API_URL}/api/news-events/get-all`,
    UPDATE: `${API_URL}/api/news-events/update`,
  },
  CONTACT_US: {
    GET_MESSAGES: `${API_URL}/api/contact-us/list`,
    TOGGLE_STATUS: `${API_URL}/api/contact-us/change-status`,
  },
};
