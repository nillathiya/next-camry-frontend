"use client";

import { setupApiInterceptors } from "@/api/apiClient";
import { store } from "@/redux-toolkit/store";
import React from "react";
import { Provider } from "react-redux";
const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default MainProvider;
