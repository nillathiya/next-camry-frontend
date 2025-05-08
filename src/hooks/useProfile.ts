"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import {
  getProfileAsync,
  updateProfileAsync,
} from "@/redux-toolkit/slices/userSlice";

interface AddressData {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
}

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user && !loading) {
      fetchProfile();
    }
  }, [user, status]);

  const fetchProfile = async () => {
    return dispatch(getProfileAsync()).unwrap();
  };

  const updateUserProfile = async (profileData: any) => {
    try {
      const result = await dispatch(
        updateProfileAsync({
          payload: profileData,
          type: "data",
        })
      ).unwrap();

      // Refetch profile to ensure UI has latest data
      await fetchProfile();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    // formData.append("field", "profilePicture");
    // formData.append("action", "update");

    return dispatch(
      updateProfileAsync({
        payload: formData,
        type: "avatar",
      })
    ).unwrap();
  };

  return {
    user,
    isLoading: loading,
    error,
    fetchProfile,
    updateUserProfile,
    updateProfilePicture,
  };
};
