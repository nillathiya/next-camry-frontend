"use client";

import { ImagePath } from "@/constants/index";
import Image from "next/image";
import { Card, Col } from "reactstrap";
import FollowSection from "./followSection";
import { InfoSection } from "./InfoSection";
import UserSocialMedia from "./userSocialMedia";
import { useProfile } from "@/hooks/useProfile";
import { useRef, useState } from "react";
import { API_URL } from "@/api/route";

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
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
  
      try {
        await updateProfilePicture(file);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  // Define the image source
  const imageSrc =
  previewImage ||
  (user?.profilePicture ? `${API_URL}${user.profilePicture}?t=${new Date().getTime()}` : null) ||
  `${ImagePath}/user/7.jpg`;

  return (
    <Col sm="12">
      <Card className="hovercard text-center">
        <div 
          className="cardheader" 
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="user-image">
          <div className="avatar">
            <Image
              width={150}
              height={150}
              alt="Profile"
              src={imageSrc}
              style={{ objectFit: "cover" }}
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
