"use client";

import {
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
  Card,
  CardFooter,
  Form,
} from "reactstrap";
import CommonUserFormGroup from "../common/CommonUserFormGroup";
import { Country, State, City } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FormEvent, useEffect, useState, ChangeEvent } from "react";
import CommonCardHeader from "@/common-components/CommonCardHeader";
import { EditProfile, UpdateProfile } from "@/constants/index";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "react-toastify";

// Define interfaces for form data
interface Address {
  line1: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postalCode: string;
}

interface FormData {
  username: string;
  name: string;
  email: string;
  contactNumber: string;
  address: Address;
}

// Define interfaces for country-state-city library
interface CountryType {
  isoCode: string;
  name: string;
}

interface StateType {
  isoCode: string;
  name: string;
}

interface CityType {
  name: string;
}

// Define props for EditProfileFormBody
interface EditProfileFormBodyProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// EditProfileFormBody Component
export const EditProfileFormBody: React.FC<EditProfileFormBodyProps> = ({
  formData,
  setFormData,
}) => {
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});

  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states and reset cities when country changes
  useEffect(() => {
    if (formData.address.country) {
      const countryObj = countries.find(
        (c) => c.name === formData.address.country
      );
      if (countryObj) {
        setStates(State.getStatesOfCountry(countryObj.isoCode));
        setCities([]); // Reset cities
      } else {
        setStates([]);
        setCities([]);
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.address.country, countries]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.address.state && formData.address.country) {
      const countryObj = countries.find(
        (c) => c.name === formData.address.country
      );
      const stateObj = states.find((s) => s.name === formData.address.state);
      if (countryObj && stateObj) {
        setCities(City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode));
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [formData.address.state, formData.address.country, states]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Workaround for reactstrap Input type="select" type mismatch
  const handleAddressSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePhoneChange = (value: string, country: { dialCode: string }) => {
    setFormData((prev) => ({
      ...prev,
      contactNumber: value,
      address: { ...prev.address, countryCode: country.dialCode },
    }));
    setFormErrors((prev) => ({ ...prev, contactNumber: undefined }));
  };

  return (
    <CardBody>
      <Row>
        <Col sm="6" md="6">
          <CommonUserFormGroup
            type="text"
            title="Username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            name="username"
            disabled={true}
            readOnly={false}
            invalid={!!formErrors.username}
          />
          {formErrors.username && (
            <div className="invalid-feedback d-block">{formErrors.username}</div>
          )}
        </Col>
        <Col sm="6" md="6">
          <CommonUserFormGroup
            type="email"
            title="Email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            readOnly={false}
            invalid={!!formErrors.email}
          />
          {formErrors.email && (
            <div className="invalid-feedback d-block">{formErrors.email}</div>
          )}
        </Col>
        <Col sm="6" md="6">
          <CommonUserFormGroup
            type="text"
            title="Name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            readOnly={false}
            invalid={!!formErrors.name}
          />
          {formErrors.name && (
            <div className="invalid-feedback d-block">{formErrors.name}</div>
          )}
        </Col>
        <Col sm="6" md="6">
          <FormGroup>
            <Label>Mobile Number</Label>
            <PhoneInput
              country={"in"}
              value={formData.contactNumber}
              onChange={handlePhoneChange}
              inputClass={`form-control ${formErrors.contactNumber ? "is-invalid" : ""}`}
              containerClass="w-100"
            />
            {formErrors.contactNumber && (
              <div className="invalid-feedback d-block">{formErrors.contactNumber}</div>
            )}
          </FormGroup>
        </Col>
        <Col md="12">
          <CommonUserFormGroup
            type="text"
            title="Address Line 1"
            placeholder="Your address"
            value={formData.address.line1}
            onChange={handleAddressInputChange}
            name="line1"
            readOnly={false}
            invalid={!!formErrors.line1}
          />
          {formErrors.line1 && (
            <div className="invalid-feedback d-block">{formErrors.line1}</div>
          )}
        </Col>
        <Col sm="6" md="6">
          <FormGroup>
            <Label>Country</Label>
            <Input
              type="select"
              value={formData.address.country}
              onChange={handleAddressSelectChange as any} // Workaround for reactstrap type issue
              name="country"
              invalid={!!formErrors.country}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Input>
            {formErrors.country && (
              <div className="invalid-feedback d-block">{formErrors.country}</div>
            )}
          </FormGroup>
        </Col>
        <Col sm="6" md="6">
          <FormGroup>
            <Label>State</Label>
            <Input
              type="select"
              value={formData.address.state}
              onChange={handleAddressSelectChange as any} // Workaround for reactstrap type issue
              name="state"
              disabled={!states.length}
              invalid={!!formErrors.state}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </Input>
            {formErrors.state && (
              <div className="invalid-feedback d-block">{formErrors.state}</div>
            )}
          </FormGroup>
        </Col>
        <Col sm="6" md="6">
          <FormGroup>
            <Label>City</Label>
            <Input
              type="select"
              value={formData.address.city}
              onChange={handleAddressSelectChange as any} // Workaround for reactstrap type issue
              name="city"
              disabled={!cities.length}
              invalid={!!formErrors.city}
            >
              <option value="">Select City</option>
              {countries.length > 0 &&
                cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
            </Input>
            {formErrors.city && (
              <div className="invalid-feedback d-block">{formErrors.city}</div>
            )}
          </FormGroup>
        </Col>
        <Col sm="6" md="6">
          <CommonUserFormGroup
            type="text"
            title="Postal Code"
            placeholder="Postal Code"
            value={formData.address.postalCode}
            onChange={handleAddressInputChange}
            name="postalCode"
            readOnly={false}
            invalid={!!formErrors.postalCode}
          />
          {formErrors.postalCode && (
            <div className="invalid-feedback d-block">{formErrors.postalCode}</div>
          )}
        </Col>
      </Row>
    </CardBody>
  );
};

// EditProfileForm Component
const EditProfileForm: React.FC = () => {
  const { user, updateUserProfile } = useProfile();

  // Initialize form data with proper structure from API response
  const [formData, setFormData] = useState<FormData>({
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
    address: {
      line1: user?.address?.line1 || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "", // Fixed
      country: user?.address?.country || "",
      countryCode: user?.address?.countryCode || "",
      postalCode: user?.address?.postalCode || "",
    },
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        address: {
          line1: user.address?.line1 || "",
          city: user.address?.city || "",
          state: user.address?.state || "", // Fixed
          country: user.address?.country || "",
          countryCode: user.address?.countryCode || "",
          postalCode: user.address?.postalCode || "",
        },
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<string, string>> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.name) errors.name = "Name is required";
    if (!formData.contactNumber) errors.contactNumber = "Mobile number is required";
    if (!formData.address.line1) errors.line1 = "Address line 1 is required";
    if (!formData.address.country) errors.country = "Country is required";
    if (!formData.address.state) errors.state = "State is required";
    if (!formData.address.city) errors.city = "City is required";
    if (!formData.address.postalCode) errors.postalCode = "Postal code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix form errors before submitting");
      return;
    }

    try {
      await updateUserProfile({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error?.message || "Failed to update profile");
    }
  };

  return (
    <Col xl="8">
      <Form onSubmit={handleSubmit}>
        <Card>
          <CommonCardHeader title={EditProfile} />
          <EditProfileFormBody formData={formData} setFormData={setFormData} />
          <CardFooter className="text-end">
            <Button color="primary" type="submit">
              {UpdateProfile}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </Col>
  );
};

export default EditProfileForm;