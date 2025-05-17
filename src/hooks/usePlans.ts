import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux-toolkit/Hooks";
import { getPlansAsync } from "@/redux-toolkit/slices/settingSlice";

export const usePlan = () => {
  const dispatch = useAppDispatch();
  const {
    plans,
    loading: { getPlans },
  } = useAppSelector((state) => state.setting);

  useEffect(() => {
    if (!getPlans && plans.length === 0) {
      dispatch(getPlansAsync());
    }
  }, [dispatch, getPlans, plans.length]);

  const getPlansValueBySlug = (slug: string): string[] => {
    if (!slug?.trim()) return [];
    const plan = plans.find((plan) => plan.slug.trim() === slug.trim());
    return plan?.value ?? [];
  };

  const usePlanDailyLevel = (): string[] => {
    return getPlansValueBySlug("daily_level");
  };

  const usePlanDailyLevelReqDirect = (): string[] => {
    return getPlansValueBySlug("daily_level_req_direct");
  };
  return {
    getPlansValueBySlug,
    usePlanDailyLevel,
    usePlanDailyLevelReqDirect,
    loading: getPlans,
  };
};
