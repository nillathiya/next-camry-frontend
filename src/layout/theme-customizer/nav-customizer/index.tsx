import { ImagePath } from "@/constants";
import { navCustomizerData } from "@/data/theme-customizer";
import { NavCustomizerProps } from "@/types/layout";
import Image from "next/image";
import { Nav, NavLink } from "reactstrap";

export default function NavCustomizer({
  callbackNav,
  selected,
}: NavCustomizerProps) {
  return (
    <Nav className="flex-column nac-pills" vertical>
      <NavLink
        className={selected === "sidebar-type" ? "active" : ""}
        onClick={() => callbackNav("sidebar-type", true)}
      >
        <div className="settings">
          <Image
            height={40}
            width={40}
            className="img-fluid"
            src={`${ImagePath}/customizer/brush.png`}
            alt=""
          />
        </div>
        <span>{"Quick option"}</span>
      </NavLink>
      {navCustomizerData.map((item) => (
        <NavLink
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            <Image
              height={40}
              width={401}
              className="img-fluid"
              src={`${ImagePath}/customizer/${item.image}`}
              alt=""
            />
          </div>
          <span>{item.title}</span>
        </NavLink>
      ))}
    </Nav>
  );
}
