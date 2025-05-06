import { ImagePath } from "@/constants";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import Image from "next/image";
import Link from "next/link";

export default function BackButton() {
  return (
    <li className="back-btn">
      <Link href={`/dashboard/default`}>
        <Image
          height={50}
          width={50}
          className="img-fluid"
          src={`${ImagePath}/logo/logo-icon.png`}
          alt=""
        />
      </Link>
      <div className="mobile-back text-end">
        <span>{"Back"}</span>
        <i className="fa fa-angle-right ps-2"></i>
      </div>
    </li>
  );
}
