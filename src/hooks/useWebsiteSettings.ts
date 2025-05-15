import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import { IWebsiteSettings } from "../types";

export const useCompanyInfo = (
  title: string,
  slug: string
): IWebsiteSettings["type"] => {
  const { websiteSettings } = useAppSelector((state) => state.setting);

  return useMemo(() => {
    return websiteSettings.find(
      (data: IWebsiteSettings) => data.title === title && data.slug === slug
    )?.value;
  }, [websiteSettings, title, slug]);
};

export const useCompanyInfoValues = (
  criteria: { title: string; slug: string }[]
): IWebsiteSettings["type"][] => {
  const { websiteSettings } = useAppSelector((state) => state.setting);

  return useMemo(() => {
    return criteria.map(
      ({ title, slug }) =>
        websiteSettings.find(
          (data: IWebsiteSettings) => data.title === title && data.slug === slug
        )?.value
    );
  }, [websiteSettings, criteria]);
};

export const useRegistrationType = (): string | undefined => {
  const registrationType = useCompanyInfo("Registration", "registration_type");
  console.log("registrationType", registrationType);
  return Array.isArray(registrationType) ? registrationType[0] : undefined;
};

export const useRegistrationFields = (): string[] | undefined => {
  const registrationType = useCompanyInfo(
    "Registration",
    "registration_fields"
  );
  return Array.isArray(registrationType) ? registrationType : undefined;
};

export const useWeb3RegistrationFields = (): string[] | undefined => {
  const registrationType = useCompanyInfo(
    "Registration",
    "web3_registration_fields"
  );
  return Array.isArray(registrationType) ? registrationType : undefined;
};

export const useWeb3RegistrationWithOtp = (): string | undefined => {
  const registrationType = useCompanyInfo(
    "Registration",
    "web3_registration_with_otp"
  );
  return Array.isArray(registrationType) ? registrationType[0] : undefined;
};

export const useRegistrationWithOtp = (): string | undefined => {
  const registrationType = useCompanyInfo(
    "Registration",
    "registration_with_otp"
  );
  return Array.isArray(registrationType) ? registrationType[0] : undefined;
};

export const useWeb3RegistrationWithUsdt = (): string | undefined => {
  const registrationType = useCompanyInfo(
    "Registration",
    "web3_registration_with_usdt"
  );
  return Array.isArray(registrationType) ? registrationType[0] : undefined;
};

export const useWeb3RegistrationWithUsdtFees = (): number | undefined => {
  const registrationType = useCompanyInfo(
    "Registration",
    "web3_registration_with_usdt_fees"
  );
  return registrationType ?? undefined;
};
