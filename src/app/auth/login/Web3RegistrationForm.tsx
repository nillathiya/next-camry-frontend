"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  FormFeedback,
} from "reactstrap";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAppDispatch } from "@/redux-toolkit/Hooks";
import { web3RegisterAsync } from "@/redux-toolkit/slices/userSlice";
import { toast } from "react-toastify";
import {
  useWeb3RegistrationFields,
  useWeb3RegistrationWithOtp,
  useWeb3RegistrationWithUsdt,
  useWeb3RegistrationWithUsdtFees,
} from "@/hooks/useWebsiteSettings";
import {
  useCompanyTokenContract,
  useComapnyBscAddress,
} from "@/hooks/useCompanyInfo";
import countries from "i18n-iso-countries";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useSignMessage,
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { SiweMessage } from "siwe";
import { useOtp } from "@/hooks/useOtp";
import { contractAbi } from "@/ABI/contract";
import { abi as usdtAbi } from "@/ABI/usdtAbi";
import { parseUnits, maxUint256 } from "viem";

// Load English locale for country names
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

// Define input types
type InputType =
  | "text"
  | "email"
  | "tel"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "file"
  | "hidden"
  | "image"
  | "range"
  | "search"
  | "url"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "phone";

// Define form field configuration
interface FormField {
  key: string;
  label: string;
  type: InputType;
  required: boolean;
}

// Define form data structure
interface FormData {
  [key: string]: string | { country: string; countryCode: string };
}

// Parse form fields from configuration
const parseFormFields = (value: string[]): FormField[] =>
  value.map((item) => {
    const [key, label] = item.split(":");
    let type: InputType = "text";
    const required = !/\(optional\)/i.test(label);

    if (key === "email") type = "email";
    if (key === "contactNumber") type = "phone";
    if (key === "password") type = "password";

    return { key, label: label.replace(/\(optional\)/i, "").trim(), type, required };
  });

// Get full country name from country code
const getCountryName = (countryCode: string): string =>
  countryCode ? countries.getName(countryCode, "en", { select: "official" }) || countryCode : "";

interface Web3RegistrationFormProps {
  address?: string;
  chainId?: number;
}

const Web3RegistrationForm = ({ address: propAddress, chainId: propChainId }: Web3RegistrationFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signMessageAsync } = useSignMessage();
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync, isPending: isWritingContract } = useWriteContract();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  // Configuration hooks
  const web3RegistrationWithOtp = useWeb3RegistrationWithOtp() || "no";
  const web3RegistrationWithUsdt = useWeb3RegistrationWithUsdt() || "no";
  const web3RegistrationWithUsdtFees = useWeb3RegistrationWithUsdtFees() ?? 1;
  const tokenContract = useCompanyTokenContract();
  const comapnyBscAddress = useComapnyBscAddress();
  const value = useWeb3RegistrationFields() || [];

  // State
  const [formData, setFormData] = useState<FormData>(() =>
    value.reduce(
      (acc, item) => {
        const [key] = item.split(":");
        if (key === "contactNumber") {
          acc[key] = "";
          acc["address"] = { country: "", countryCode: "" };
        } else if (key === "sponsor") {
          acc[key] = ref || "";
        } else {
          acc[key] = "";
        }
        return acc;
      },
      {} as FormData
    )
  );
  const [inputOtp, setInputOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<"approving" | "depositing" | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);

  // OTP hook
  const { sendOtp, isLoading: isOtpLoading, timeRemaining, error: otpError } = useOtp();

  // Wallet and chain
  const walletAddress = connectedAddress || propAddress;
  const chainId = propChainId || 56; // Default to Binance Smart Chain

  // USDT payment amount
  const AMOUNT = useMemo(() => parseUnits(web3RegistrationWithUsdtFees.toString(), 18), [web3RegistrationWithUsdtFees]);

  // Check USDT balance
  const { data: usdtBalance } = useReadContract({
    address: tokenContract as `0x${string}`,
    abi: usdtAbi,
    functionName: "balanceOf",
    args: [walletAddress!],
    query: { enabled: !!walletAddress && web3RegistrationWithUsdt === "yes" },
  });

  // Wait for transaction receipt
  const { data: receipt, error: receiptError, isLoading: isReceiptLoading } = useWaitForTransactionReceipt({
    hash: transactionHash || undefined,
  });

  // Form fields
  const formFields = useMemo(() => parseFormFields(value), [value]);

  // Validate form data
  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<string, string>> = {};
    formFields.forEach(({ key, label, required }) => {
      if (required && !formData[key]) {
        errors[key] = `${label} is required`;
      }
      if (key === "email" && formData[key] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[key] as string)) {
        errors[key] = "Invalid email format";
      }
      if (key === "password" && formData[key] && (formData[key] as string).length < 8) {
        errors[key] = "Password must be at least 8 characters";
      }
    });

    if (web3RegistrationWithOtp === "yes" && !inputOtp) {
      errors.otp = "OTP is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, formFields, inputOtp, web3RegistrationWithOtp]);

  // Handle input changes
  const handleInputChange = useCallback(
    (key: string, value: string, phoneInput = false) => {
      if (phoneInput) {
        const phoneNumber = parsePhoneNumber(value || "");
        if (phoneNumber) {
          const countryCode = phoneNumber.country || "";
          const fullCountryName = getCountryName(countryCode);
          setFormData((prev) => ({
            ...prev,
            [key]: value,
            address: { country: fullCountryName, countryCode: phoneNumber.countryCallingCode || "" },
          }));
        } else {
          setFormData((prev) => ({ ...prev, [key]: value }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [key]: value }));
      }
      // Clear error for this field
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  // Handle OTP request
  const handleRequestOtp = useCallback(async () => {
    if (!formData.username || !formData.contactNumber) {
      toast.error("Username and Contact Number are required to request OTP");
      return;
    }

    try {
      await sendOtp({
        username: formData.username as string,
        contactNumber: formData.contactNumber as string,
      });

      if (otpError) {
        toast.error(otpError || "Failed to request OTP");
        return;
      }
      toast.success("OTP sent successfully!");
      setIsOtpSent(true);
    } catch (error: any) {
      toast.error(error?.message || "Failed to request OTP");
    }
  }, [formData.username, formData.contactNumber, sendOtp, otpError]);

  // Handle USDT payment
  const handleUsdtPayment = useCallback(
    async (): Promise<string> => {
      if (!walletAddress || !tokenContract || !comapnyBscAddress) {
        throw new Error("Wallet or contract addresses missing");
      }

      if (usdtBalance && (usdtBalance as bigint) < AMOUNT) {
        throw new Error("Insufficient USDT balance");
      }

      try {
        // Approve USDT
        setIsProcessingPayment("approving");
        const approveHash = await writeContractAsync({
          address: tokenContract as `0x${string}`,
          abi: usdtAbi,
          functionName: "approve",
          args: [comapnyBscAddress, maxUint256],
        });
        setTransactionHash(approveHash);

        // Wait for approval confirmation
        await new Promise<void>((resolve, reject) => {
          const checkReceipt = () => {
            if (receiptError) {
              reject(new Error(`Approval failed: ${receiptError.message}`));
            } else if (receipt) {
              resolve();
            }
          };
          checkReceipt();
          if (!receipt && !receiptError) {
            const interval = setInterval(checkReceipt, 1000);
            return () => clearInterval(interval);
          }
        });
        toast.success("USDT allowance approved!");
        setTransactionHash(null); // Clear hash

        // Deposit USDT
        setIsProcessingPayment("depositing");
        const depositHash = await writeContractAsync({
          address: comapnyBscAddress as `0x${string}`,
          abi: contractAbi,
          functionName: "package",
          args: [AMOUNT],
        });
        setTransactionHash(depositHash);

        // Wait for deposit confirmation
        await new Promise<void>((resolve, reject) => {
          const checkReceipt = () => {
            if (receiptError) {
              reject(new Error(`Deposit failed: ${receiptError.message}`));
            } else if (receipt) {
              resolve();
            }
          };
          checkReceipt();
          if (!receipt && !receiptError) {
            const interval = setInterval(checkReceipt, 1000);
            return () => clearInterval(interval);
          }
        });
        toast.success("Payment successful!");
        return depositHash;
      } catch (error: any) {
        const message = error?.message?.includes("User rejected")
          ? "Transaction rejected by user"
          : error?.message || "Transaction failed";
        throw new Error(message);
      } finally {
        setIsProcessingPayment(null);
        setTransactionHash(null);
      }
    },
    [walletAddress, tokenContract, comapnyBscAddress, usdtBalance, AMOUNT, writeContractAsync, receipt, receiptError]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!validateForm()) {
        toast.error("Please fix form errors before submitting");
        return;
      }

      if (!walletAddress || !chainId) {
        toast.error("Please connect your wallet");
        return;
      }

      try {
        let depositHash: string | undefined;

        // Process USDT payment if required
        if (web3RegistrationWithUsdt === "yes") {
          depositHash = await handleUsdtPayment();
        }

        // Register user
        const registrationData = {
          ...formData,
          wallet_address: walletAddress,
          ...(web3RegistrationWithOtp === "yes" ? { otp: inputOtp } : {}),
          ...(depositHash ? { hash: depositHash } : {}),
        };

        await dispatch(web3RegisterAsync(registrationData)).unwrap();
        toast.success("Registration successful!");

        // Fetch nonce for SIWE
        const nonceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/nonce`, {
          credentials: "include",
        });
        if (!nonceResponse.ok) {
          throw new Error(`Failed to fetch nonce: ${nonceResponse.statusText}`);
        }
        const { data: { nonce } } = await nonceResponse.json();

        // Create SIWE message
        const domain = window.location.host || "localhost:3000";
        const siweMessage = new SiweMessage({
          domain,
          address: walletAddress,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });

        // Sign message
        const message = siweMessage.prepareMessage();
        const signature = await signMessageAsync({ message });

        // Sign in with SIWE
        const loginResult = await signIn("siwe", {
          redirect: false,
          message: JSON.stringify(siweMessage),
          signature,
          callbackUrl: "/dashboard/default",
        });

        if (loginResult?.error) {
          throw new Error(`SIWE login failed: ${loginResult.error}`);
        }

        localStorage.removeItem("showWeb3RegForm");
        setFormData(formFields.reduce((acc, { key }) => {
          acc[key] = key === "sponsor" ? ref || "" : key === "contactNumber" ? "" : "";
          if (key === "contactNumber") acc["address"] = { country: "", countryCode: "" };
          return acc;
        }, {} as FormData));
        setInputOtp("");
        router.push("/dashboard/default");
      } catch (error: any) {
        toast.error(error?.message || "Registration failed");
      }
    },
    [
      validateForm,
      walletAddress,
      chainId,
      web3RegistrationWithUsdt,
      handleUsdtPayment,
      formData,
      inputOtp,
      web3RegistrationWithOtp,
      dispatch,
      signMessageAsync,
      router,
      ref,
      formFields,
    ]
  );

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs="12" className="p-0">
          <div className="mb-4">
            <ConnectButton
              chainStatus="icon"
              showBalance={false}
              accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
            />
          </div>
          <div className="login-card login-dark">
            <Form className="theme-form" onSubmit={handleSubmit}>
              <h4>Create Account</h4>
              <p>Please provide details to register your wallet</p>
              {isProcessingPayment ? (
                <div className="text-center py-4">
                  <Spinner color="primary" />
                  <p className="mt-2">
                    {isProcessingPayment === "approving" ? "Approving USDT..." : "Processing Payment..."}
                  </p>
                </div>
              ) : (
                <>
                  {formFields.map(({ key, label, type, required }) => (
                    <FormGroup key={key}>
                      <Label className="col-form-label">{label}</Label>
                      {type === "phone" ? (
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          defaultCountry="IN"
                          value={formData[key] as string}
                          onChange={(value) => handleInputChange(key, value || "", true)}
                          placeholder={`Enter ${label.toLowerCase()}`}
                          required={required}
                          className={`form-control ${formErrors[key] ? "is-invalid" : ""}`}
                        />
                      ) : (
                        <Input
                          type={type}
                          value={formData[key] as string}
                          onChange={(event) => handleInputChange(key, event.target.value)}
                          placeholder={`Enter ${label.toLowerCase()}`}
                          required={required}
                          invalid={!!formErrors[key]}
                        />
                      )}
                      {formErrors[key] && <FormFeedback>{formErrors[key]}</FormFeedback>}
                    </FormGroup>
                  ))}

                  {web3RegistrationWithOtp === "yes" && (
                    <>
                      <FormGroup>
                        <Label className="col-form-label">OTP</Label>
                        <Input
                          type="text"
                          value={inputOtp}
                          onChange={(event) => {
                            setInputOtp(event.target.value);
                            setFormErrors((prev) => ({ ...prev, otp: undefined }));
                          }}
                          placeholder="Enter OTP"
                          required
                          invalid={!!formErrors.otp}
                        />
                        {formErrors.otp && <FormFeedback>{formErrors.otp}</FormFeedback>}
                      </FormGroup>
                      {isOtpSent && timeRemaining !== "00:00" && (
                        <FormGroup>
                          <Label className="col-form-label">Time Remaining: {timeRemaining}</Label>
                        </FormGroup>
                      )}
                      <FormGroup>
                        <Button
                          type="button"
                          color="secondary"
                          block
                          onClick={handleRequestOtp}
                          disabled={isOtpLoading || timeRemaining !== "00:00"}
                        >
                          {isOtpLoading ? "Sending OTP..." : "Request OTP"}
                        </Button>
                      </FormGroup>
                    </>
                  )}

                  <FormGroup className="mb-0">
                    <div className="text-end mt-3">
                      <Button
                        type="submit"
                        color="primary"
                        block
                        disabled={isProcessingPayment !== null || isWritingContract || !walletAddress || isReceiptLoading}
                      >
                        Register{" "}
                        {web3RegistrationWithUsdt === "yes" ? `(${web3RegistrationWithUsdtFees} USDT)` : ""}
                      </Button>
                    </div>
                  </FormGroup>
                </>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Web3RegistrationForm;