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

  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.address.country) {
      const countryObj = countries.find(
        (c) => c.name === formData.address.country
      );
      if (countryObj) {
        setStates(State.getStatesOfCountry(countryObj.isoCode));
      }
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
      }
    }
  }, [formData.address.state, formData.address.country, states]);

  const handleInputChange = (e: ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: ChangeEvent<HTMLFormElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handlePhoneChange = (value: string, country: { dialCode: string }) => {
    setFormData((prev) => ({
      ...prev,
      contactNumber: value,
      address: { ...prev.address, countryCode: country.dialCode },
    }));
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
            disabled={undefined}
            readOnly={undefined}
          />
        </Col>
        <Col sm="6" md="6">
          <CommonUserFormGroup
            type="email"
            title="Email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            disabled={undefined}
            readOnly={undefined}
          />
        </Col>
        <Col sm="6" md="6">
          <CommonUserFormGroup
            type="text"
            title="Name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            disabled={undefined}
            readOnly={undefined}
          />
        </Col>
        <Col sm="6" md="6">
          <FormGroup>
            <Label>Mobile Number</Label>
            <PhoneInput
              country={"in"}
              value={formData.contactNumber}
              onChange={handlePhoneChange}
              inputClass="form-control"
              containerClass="w-100"
            />
          </FormGroup>
        </Col>
        <Col md="12">
          <CommonUserFormGroup
            type="text"
            title="Address Line 1"
            placeholder="Your address"
            value={formData.address.line1}
            onChange={handleAddressChange}
            name="line1"
            disabled={undefined}
            readOnly={undefined}
          />
        </Col>
        <Col sm="6" md="6">
          <FormGroup>
            <Label>Country</Label>
            <Input
              type="select"
              value={formData.address.country}
              onChange={handleAddressChange}
              name="country"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col sm="6" md="6">
          <FormGroup>
            <Label>State</Label>
            <Input
              type="select"
              value={formData.address.state}
              onChange={handleAddressChange}
              name="state"
              disabled={!states.length}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col sm="6" md="6">
          <FormGroup>
            <Label>City</Label>
            <Input
              type="select"
              value={formData.address.city}
              onChange={handleAddressChange}
              name="city"
              disabled={!cities.length}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col sm="6" md="6">
          <CommonUserFormGroup
            type="text"
            title="Postal Code"
            placeholder="Postal Code"
            value={formData.address.postalCode}
            onChange={handleAddressChange}
            name="postalCode"
            disabled={undefined}
            readOnly={undefined}
          />
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
      state: user?.address?.city || "",
      country: user?.address?.country || "",
      countryCode: user?.address?.countryCode || "",
      postalCode: user?.address?.postalCode || "",
    },
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user?.username || "",
        name: user?.name || "",
        email: user?.email || "",
        contactNumber: user.contactNumber || "",
        address: {
          line1: user?.address?.line1 || "",
          city: user?.address?.city || "",
          state: user?.address?.city || "",
          country: user?.address?.country || "",
          countryCode: user?.address?.countryCode || "",
          postalCode: user?.address?.postalCode || "",
        },
      });
    }
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateUserProfile({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
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
