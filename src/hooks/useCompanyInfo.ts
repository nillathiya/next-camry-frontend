// hooks/useCompanyInfo.ts
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { ICompanyInfo } from "@/types";
import { useAppSelector } from "@/redux-toolkit/Hooks";

export const useCompanyInfo = (
  title: string,
  slug: string
): string | undefined => {
  const { companyInfo } = useAppSelector((state) => state.setting);

  return useMemo(() => {
    return companyInfo.find(
      (data: ICompanyInfo) => data.title === title && data.slug === slug
    )?.value;
  }, [companyInfo, title, slug]);
};

export const useCompanyInfoValues = (
  criteria: { title: string; slug: string }[]
): (string | undefined)[] => {
  const { companyInfo } = useAppSelector((state) => state.setting);

  return useMemo(() => {
    return criteria.map(
      ({ title, slug }) =>
        companyInfo.find(
          (data: ICompanyInfo) => data.title === title && data.slug === slug
        )?.value
    );
  }, [companyInfo, criteria]);
};

export const useCompanyCurrency = (): string | undefined => {
  return useCompanyInfo("Company", "currency");
};

export const useCompanyName = (): string | undefined => {
  return useCompanyInfo("Company", "name");
};

export const useCompanyFavicon = (): string | undefined => {
  return useCompanyInfo("Company", "favicon");
};

export const useCompanyLogo = (): string | undefined => {
  return useCompanyInfo("Company", "logo");
};

export const useCompanyCopyright = (): string | undefined => {
  return useCompanyInfo("Company", "copyright");
};

export const useComapnyBscAddress = (): string | undefined => {
  return useCompanyInfo("Company", "bsc_address");
};

export const useCompanyTokenContract = (): string | undefined => {
  return useCompanyInfo("Company", "token_contract");
};
