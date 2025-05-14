// app/InitialApiProvider.tsx
"use client";

import { API_URL } from "@/api/route";
import { useCompanyFavicon, useCompanyName } from "@/hooks/useCompanyInfo";
import InterceptorInitializer from "@/lib/InterceptorInitializer";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import {
  getCompanyInfoSettingsAsync,
  getWebsiteSettingsAsync,
} from "@/redux-toolkit/slices/settingSlice";
import { useEffect, useState } from "react";

interface InitialApiProviderProps {
  children: React.ReactNode;
}

const InitialApiProvider: React.FC<InitialApiProviderProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { websiteSettings, companyInfo } = useAppSelector(
    (state) => state.setting
  );
  const [isLoading, setIsLoading] = useState(true);

  const appName = useCompanyName() || "Default App";
  const favicon = useCompanyFavicon() || "/favicon.ico";
  // Set document title and favicon
  useEffect(() => {
    if (appName && favicon) {
      document.title = appName;

      let link = document.querySelector(
        "link[rel~='icon']"
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link") as HTMLLinkElement;
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = `${API_URL}${favicon}`;
    }
  }, [appName, favicon]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        if (websiteSettings.length === 0) {
          await dispatch(getWebsiteSettingsAsync()).unwrap();
        }
        // if (companyInfo.length === 0) {
        await dispatch(getCompanyInfoSettingsAsync()).unwrap();
        // }
      } catch (error) {
        console.error("Error fetching website settings:", error);
      }
    };

    const initialize = async () => {
      try {
        await Promise.all([
          fetchData(),
          new Promise((resolve) => {
            timeoutId = setTimeout(resolve, 1000);
          }),
        ]);

        if (isMounted) {
          setIsLoading(false);
          document.body.classList.add("loaded");
          window.dispatchEvent(new Event("resize"));
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [dispatch]);

  return (
    <>
      <InterceptorInitializer />
      {isLoading && (
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      )}
      {children}
    </>
  );
};

export default InitialApiProvider;
