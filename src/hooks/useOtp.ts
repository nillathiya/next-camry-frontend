import { apiClient } from "@/api/apiClient";
import { ROUTES } from "@/api/route";
import { IApiResponse } from "@/types";
import { useState, useEffect, useCallback } from "react";

// Define types for the hook
interface OtpState {
  otp: string;
  isLoading: boolean;
  error: string | null;
  expiresAt: number | null; // Timestamp in milliseconds
}

interface UseOtpReturn extends OtpState {
  sendOtp: (params: ISendOtpParams) => Promise<void>;
  sendUnauthenticatedOtp: (params: ISendAuthenticatedOtpParams) => Promise<void>;
  startTimer: (minutes: number) => void;
  timeRemaining: string;
}

interface ISendOtpResponse {
  username: string;
  contactNumber: string;
  otp: string;
  expiresAt: Date;
}

interface ISendOtpParams {
  contactNumber: string;
  username: string;
}

interface ISendAuthenticatedOtpParams {
  contactNumber?: string;
  username?: string;
}

export const useOtp = (): UseOtpReturn => {
  const [state, setState] = useState<OtpState>({
    otp: "",
    isLoading: false,
    error: null,
    expiresAt: null,
  });

  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");

  // Function to send OTP for authenticated users
  const sendOtp = useCallback(
    async ({ contactNumber, username }: ISendOtpParams) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        if (!contactNumber || !username) {
          throw new Error("Contact number and username are required");
        }
        const response = await apiClient.post<IApiResponse<ISendOtpResponse>>(
          ROUTES.AUTH.SEND_OTP,
          { contactNumber, username }
        );
        const expiresAt = new Date(response.data.data.expiresAt).getTime();
        setState({
          otp: response.data.data.otp,
          isLoading: false,
          error: null,
          expiresAt,
        });
        // Automatically start the timer with the expiresAt time
        const diffInMs = expiresAt - Date.now();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        if (diffInMinutes > 0) {
          startTimer(diffInMinutes);
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to send OTP",
          otp: "",
          expiresAt: null,
        }));
      }
    },
    []
  );

  // Function to send OTP for unauthenticated users (e.g., registration)
  const sendUnauthenticatedOtp = useCallback(
    async ({ username, contactNumber }: ISendAuthenticatedOtpParams) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await apiClient.post<IApiResponse<ISendOtpResponse>>(
          ROUTES.USER.SEND_AUTHENTICATED_OTP,
          { contactNumber, username }
        );
        const expiresAt = new Date(response.data.data.expiresAt).getTime();
        setState({
          otp: response.data.data.otp,
          isLoading: false,
          error: null,
          expiresAt,
        });
        // Automatically start the timer with the expiresAt time
        const diffInMs = expiresAt - Date.now();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        if (diffInMinutes > 0) {
          startTimer(diffInMinutes);
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to send OTP",
          otp: "",
          expiresAt: null,
        }));
      }
    },
    []
  );

  // Function to start the countdown timer
  const startTimer = useCallback((minutes: number) => {
    if (minutes <= 0) {
      setTimeRemaining("00:00");
      setState((prev) => ({ ...prev, expiresAt: null }));
      return;
    }
    const expiresAt = Date.now() + minutes * 60 * 1000;
    setState((prev) => ({ ...prev, expiresAt }));
  }, []);

  // Effect to handle countdown
  useEffect(() => {
    const expiresAt = state.expiresAt;

    if (!expiresAt) {
      setTimeRemaining("00:00");
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = expiresAt - now;

      if (timeLeft <= 0) {
        setTimeRemaining("00:00");
        setState((prev) => ({ ...prev, expiresAt: null, otp: "" }));
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      setTimeRemaining(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [state.expiresAt]);

  return {
    ...state,
    sendOtp,
    sendUnauthenticatedOtp,
    startTimer,
    timeRemaining,
  };
};