import { ImagePath } from "@/constants";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import Image from "next/image";
import Link from "next/link";

export default function LogoIconWrapper() {
  
  return (
    <div className="logo-icon-wrapper">
      <Link href={`/dashboard/default`}>
        <Image height={36} width={35} className="img-fluid" src={`${ImagePath}/logo/logo-icon.png`} alt="" />
      </Link>
    </div>
  );
}
