"use client";

import { ImagePath } from "@/constants/index";
import Image from "next/image";
import { Card, Col } from "reactstrap";
import FollowSection from "./followSection";
import { InfoSection } from "./InfoSection";
import UserSocialMedia from "./userSocialMedia";
import { useProfile } from "@/hooks/useProfile";
import { useRef, useState } from "react";

const UserData = () => {
  const { user, updateProfilePicture } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        await updateProfilePicture(file);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  return (
    <Col sm="12">
      <Card className="hovercard text-center">
        <div className="cardheader"></div>
        <div className="user-image">
          <div className="avatar">
            <Image
              width={1599}
              height={470}
              alt="Profile"
              src={
                previewImage || 
                user?.profilePicture || 
                `${ImagePath}/user/7.jpg`
              }
            />
          </div>
          <div className="icon-wrapper" onClick={handleImageClick}>
            <i className="icofont icofont-pencil-alt-5"></i>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
        <div className="info">
          <InfoSection />
          <hr />
          <UserSocialMedia />
          <FollowSection />
        </div>
      </Card>
    </Col>
  );
};

export default UserData;