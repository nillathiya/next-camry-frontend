"use client";

import { useState } from "react";
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
import { registerUserAsync } from "@/redux-toolkit/slices/userSlice";
import { toast } from "react-toastify";
import { useRegistrationFields } from "@/hooks/useWebsiteSettings";
// Import i18n-iso-countries
import countries from "i18n-iso-countries";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";

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
  // Get country name in English
  const countryName = countries.getName(countryCode, "en", {
    select: "official",
  });
  return countryName || countryCode; // Fallback to country code if not found
};

const RegistrationForm = () => {
  const router = useRouter();
  const value = useRegistrationFields() || [];
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
  const dispatch = useAppDispatch();

  // Parse form fields
  const formFields = parseFormFields(value);

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
        const fullCountryName = getCountryName(countryCode); // Get full country name

        setRegFormData((prev) => ({
          ...prev,
          [key]: value,
          address: {
            country: fullCountryName, // Store full country name
            countryCode: phoneNumber.countryCallingCode || "",
          },
        }));
        return;
      }
    }

    setRegFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle form submission
  const regFormSubmitHandle = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(registerUserAsync(regFormData)).unwrap();
      toast.success("Registration successful!");
      setRegFormData(initialFormData);
      router.push("/auth/login");
    } catch (error) {
      toast.error(
        (error as Error)?.message || "Registration failed. Please try again."
      );
    }
  };

  console.log("regFormData", regFormData);

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs="12" className="p-0">
          <div className="login-card login-dark">
            <div className="login-main">
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
                <div className="form-group mb-0">
                  <div className="text-end mt-3">
                    <Button type="submit" color="primary" block>
                      Register
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
