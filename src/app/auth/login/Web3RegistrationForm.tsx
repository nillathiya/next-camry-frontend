"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAppDispatch } from "@/redux-toolkit/Hooks";
import { web3RegisterAsync } from "@/redux-toolkit/slices/userSlice";
import { toast } from "react-toastify";
import {
  useWeb3RegistrationFields,
  useWeb3RegistrationWithOtp,
} from "@/hooks/useWebsiteSettings";
import countries from "i18n-iso-countries";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useAccount } from "wagmi";
import { SiweMessage } from "siwe";
import { useOtp } from "@/hooks/useOtp";

// Load English locale for country names
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

// Define the input type union, including custom 'phone' for PhoneInput
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

// Define the field configuration type
interface FormField {
  key: string;
  label: string;
  type: InputType;
  required: boolean;
}

// Parse the value array into form fields
const parseFormFields = (value: string[]): FormField[] => {
  return value.map((item) => {
    const [key, label] = item.split(":");
    let type: InputType = "text";
    const required = !/\(optional\)/i.test(label);

    if (key === "email") type = "email";
    if (key === "contactNumber") type = "phone";
    if (key === "password") type = "password";

    return {
      key,
      label: label.replace(/\(optional\)/i, "").trim(),
      type,
      required,
    };
  });
};

// Function to get full country name from country code
const getCountryName = (countryCode: string): string => {
  if (!countryCode) return "";
  const countryName = countries.getName(countryCode, "en", {
    select: "official",
  });
  return countryName || countryCode;
};

interface Web3RegistrationFormProps {
  address?: string;
  chainId?: number;
}

const Web3RegistrationForm = ({
  address: propAddress,
  chainId: propChainId,
}: Web3RegistrationFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signMessageAsync } = useSignMessage();
  const { address: connectedAddress, chain } = useAccount();
  const web3RegistrationWithOtp = useWeb3RegistrationWithOtp() || "no";
  const value = useWeb3RegistrationFields() || [];
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const initialFormData = value.reduce((acc, item) => {
    const [key] = item.split(":");
    if (key === "contactNumber") {
      acc[key] = "";
      acc["address"] = { country: "", countryCode: "" };
    } else {
      acc[key] = "";
    }
    return acc;
  }, {} as Record<string, any>);

  const [regFormData, setRegFormData] = useState(initialFormData);
  const [inputOtp, setInputOtp] = useState<string>("");
  const formFields = parseFormFields(value);
  const { sendOtp, otp, isLoading, timeRemaining, error } = useOtp();

  // Use connectedAddress from useAccount, fallback to propAddress
  const walletAddress = connectedAddress || propAddress;
  // Use chainId from useAccount, fallback to propChainId or default to 56 (Binance Smart Chain)
  const chainId = chain?.id || propChainId || 56;

  // Handle input changes
  const handleInputChange = (
    key: string,
    value: string,
    phoneInput?: boolean
  ) => {
    if (phoneInput) {
      const phoneNumber = parsePhoneNumber(value || "");
      if (phoneNumber) {
        const countryCode = phoneNumber.country || "";
        const fullCountryName = getCountryName(countryCode);
        setRegFormData((prev) => ({
          ...prev,
          [key]: value,
          address: {
            country: fullCountryName,
            countryCode: phoneNumber.countryCallingCode || "",
          },
        }));
        return;
      }
    }
    setRegFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRequestOtp = async () => {
    if (!regFormData.username || !regFormData.contactNumber) {
      toast.error("Username and Contact Number are required to request OTP");
      return;
    }

    try {
      await sendOtp({
        username: regFormData.username,
        contactNumber: regFormData.contactNumber,
      });

      if (error) {
        toast.error("Failed to request OTP. Please try again.");
        return;
      }
      toast.success("OTP requested successfully!");
      setIsOtpSent(true);
    } catch (error) {
      console.error("OTP request error:", error);
      toast.error("Failed to request OTP. Please try again.");
    }
  };

  // Handle form submission
  const regFormSubmitHandle = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!walletAddress || !chainId) {
      toast.error("Wallet Not Connected or Chain ID Missing");
      return;
    }

    try {
      // Register the user
      const registrationData = {
        ...regFormData,
        wallet_address: walletAddress,
        ...(web3RegistrationWithOtp === "yes" ? { otp: inputOtp } : {}),
      };

      console.log("Registering user with data:", registrationData);
      await dispatch(web3RegisterAsync(registrationData)).unwrap();
      toast.success("Registration successful!");

      // Fetch nonce from backend
      console.log(
        "Fetching nonce from:",
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/nonce`
      );
      const nonceResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/nonce`,
        { credentials: "include" }
      );
      if (!nonceResponse.ok) {
        throw new Error(`Failed to fetch nonce: ${nonceResponse.statusText}`);
      }
      const response = await nonceResponse.json();
      console.log("nonceResponse:", response);
      const nonce = response.data.nonce;

      // Validate domain
      const domain = window.location.host || "localhost:3000";
      if (!domain) {
        throw new Error("Domain is empty or undefined");
      }
      console.log("Domain:", domain);

      // Create SIWE message
      const siweMessage = new SiweMessage({
        domain,
        address: walletAddress,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
      console.log("SIWE message object:", siweMessage);
      console.log("Prepared SIWE message:", siweMessage.prepareMessage());

      // Sign the message
      const message = siweMessage.prepareMessage();
      console.log("Prepared message for signing:", message);
      const signature = await signMessageAsync({ message });
      console.log("Signature:", signature);

      // Log in using SIWE
      console.log("Calling signIn with SIWE credentials", {
        message: JSON.stringify(siweMessage),
        signature,
      });
      const loginResult = await signIn("siwe", {
        redirect: false,
        message: JSON.stringify(siweMessage),
        signature,
        callbackUrl: "/dashboard/project",
      });

      if (loginResult?.error) {
        console.error("SIWE login error:", loginResult.error);
        toast.error("SIWE login failed: " + loginResult.error);
        return;
      }

      console.log("SIWE login successful:", loginResult);
      localStorage.removeItem("showWeb3RegForm");
      setRegFormData(initialFormData);
      router.push("/dashboard/project");
    } catch (error) {
      console.error("Registration or SIWE error:", error);
      toast.error(error || "Registration failed. Please try again.");
    }
  };

  console.log("regFormData:", regFormData);

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs="12" className="p-0">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
          <div className="login-card login-dark">
            <Form className="theme-form" onSubmit={regFormSubmitHandle}>
              <h4>Create Account</h4>
              <p>Please provide details to register your wallet</p>
              {formFields.map(({ key, label, type, required }) => (
                <FormGroup key={key}>
                  <Label className="col-form-label">{label}</Label>
                  {type === "phone" ? (
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="IN"
                      value={regFormData[key]}
                      onChange={(value) =>
                        handleInputChange(key, value || "", true)
                      }
                      placeholder={`Enter ${label.toLowerCase()}`}
                      required={required}
                      className="form-control"
                    />
                  ) : (
                    <Input
                      type={type}
                      value={regFormData[key]}
                      onChange={(event) =>
                        handleInputChange(key, event.target.value)
                      }
                      placeholder={`Enter ${label.toLowerCase()}`}
                      required={required}
                    />
                  )}
                </FormGroup>
              ))}

              {web3RegistrationWithOtp === "yes" && (
                <>
                  <FormGroup>
                    <Label className="col-form-label">OTP</Label>
                    <Input
                      type="text"
                      value={inputOtp}
                      onChange={(event) => setInputOtp(event.target.value)}
                      placeholder="Enter OTP"
                      required
                    />
                  </FormGroup>
                  {isOtpSent && timeRemaining !== "00:00" && (
                    <FormGroup>
                      <Label className="col-form-label">
                        Time Remaining: {timeRemaining}
                      </Label>
                    </FormGroup>
                  )}
                  <FormGroup>
                    <Button
                      type="button"
                      color="secondary"
                      block
                      onClick={handleRequestOtp}
                      disabled={isLoading || timeRemaining !== "00:00"}
                    >
                      {isLoading ? "Sending OTP..." : "Request OTP"}
                    </Button>
                  </FormGroup>
                </>
              )}
              <div className="form-group mb-0">
                <div className="text-end mt-3">
                  <Button type="submit" color="primary" block>
                    Register
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Web3RegistrationForm;
