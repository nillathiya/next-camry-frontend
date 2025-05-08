"use client";

import { useState, useEffect } from "react";
import CommonCardHeader from "@/common-components/CommonCardHeader";
import { EditProfile, UpdateProfile } from "@/constants/index";
import { Button, Card, CardFooter, Col, Form } from "reactstrap";
import { EditProfileFormBody } from "./EditProfileFormBody";
import { useProfile } from "@/hooks/useProfile";

const EditProfileForm = () => {
  const { user, updateUserProfile } = useProfile();
  
  // Initialize form data with proper structure from API response
  const [formData, setFormData] = useState({
    username: user?.data?._doc?.username || "",
    name: user?.data?._doc?.name || "",
    email: user?.data?._doc?.email || "",
    contactNumber: user?.data?._doc?.contactNumber || "",
    address: {
      line1: user?.data?._doc?.address?.line1 || "",
      city: user?.data?._doc?.address?.city || "",
      state: user?.data?._doc?.address?.state || "",
      country: user?.data?._doc?.address?.country || "",
      countryCode: user?.data?._doc?.address?.countryCode || "",
      postalCode: user?.data?._doc?.address?.postalCode || ""
    }
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user?.data?._doc) {
      setFormData({
        username: user.data._doc.username || "",
        name: user.data._doc.name || "",
        email: user.data._doc.email || "",
        contactNumber: user.data._doc.contactNumber || "",
        address: {
          line1: user.data._doc.address?.line1 || "",
          city: user.data._doc.address?.city || "",
          state: user.data._doc.address?.state || "",
          country: user.data._doc.address?.country || "",
          countryCode: user.data._doc.address?.countryCode || "",
          postalCode: user.data._doc.address?.postalCode || ""
        }
      });
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateUserProfile({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address
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
            <Button color="primary" type="submit">{UpdateProfile}</Button>
          </CardFooter>
        </Card>
      </Form>
    </Col>
  );
};

export default EditProfileForm;