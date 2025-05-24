"use client";

import { ImagePath } from "@/constants/index";
import Image from "next/image";
import { Row } from "reactstrap";

interface UserFormHeadProps {
  name: string;
  email: string;
  profilePicture: string;
}

export const UserFormHead = ({ name, email, profilePicture }: UserFormHeadProps) => {
  return (
    <Row className="mb-2">
      <div className="profile-title">
        <Image 
          width={70} 
          height={70} 
          className="img-70 rounded-circle" 
          alt="Profile" 
          src={profilePicture} 
        />
        <div className="flex-grow-1">
          <h4 className="mb-1 text-uppercase">{name}</h4>
          <p>{email}</p>
        </div>
      </div>
    </Row>
  );
};