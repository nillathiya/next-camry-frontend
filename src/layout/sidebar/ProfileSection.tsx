import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { ImagePath, WadeWarren } from "@/constants";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfileSection() {
  const { data: session } = useSession();

  //   id: data.data.user._id,
  //   username: data.data.username,
  //   email: data.data.user.email || null,
  //   name: data.data.user.name || null,
  //   token: data.data.token, // backendToken
  //   role: data.data.user.role || "User",

  return (
    <div className="profile-section sidebar-search">
      <div className="profile-wrapper">
        <div className="active-profile">
          <Image
            height={50}
            width={50}
            className="img-fluid"
            src={`${ImagePath}/user.png`}
            alt="user"
          />
          <div className="status bg-success"> </div>
        </div>
        <div>
          <h4>
            {" "}
            {session?.user?.name
              ? session?.user?.name
              : session?.user?.username
              ? session?.user?.username
              : "Guest"}
          </h4>
          <span>{session?.user?.name || ""}</span>
        </div>
      </div>
      <div>
        <SvgIcon iconId="profile-setting" />
      </div>
    </div>
  );
}
