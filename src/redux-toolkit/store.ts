import { configureStore } from "@reduxjs/toolkit";
import ThemeCustomizerReducer from "./slices/layout/themeCustomizerSlice";
import LayoutReducer from "./slices/layout/layoutSlice";
import BookmarkDataReducer from "./slices/bookMarkDataSlice";
import { persistStore, persistReducer } from "redux-persist";
import settingReducer from "./slices/settingSlice";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import fundReducer from "./slices/fundSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["showDashboardPopup"],
};

const settingPersistConfig = {
  key: "setting",
  storage,
  whitelist: ["companyInfo"],
};
const persistedSettingReducer = persistReducer(
  settingPersistConfig,
  settingReducer
);

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    themeCustomizer: ThemeCustomizerReducer,
    layout: LayoutReducer,
    bookmarkData: BookmarkDataReducer,
    setting: persistedSettingReducer,
    user: persistedUserReducer,
    fund: fundReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
