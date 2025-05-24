import { Href } from "@/constants";
import { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

interface CommonDropdown {
  dropdownItems?: string[];
  dropdownToggle?: string;
  onSelect: (value: string) => void;
}
const CommonDropdown = ({ dropdownItems, dropdownToggle, onSelect  }: CommonDropdown) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const days = ["Today", "Tomorrow", "Yesterday"];

  return (
    <Dropdown className={`${dropdownToggle ? "" : "location-menu icon-dropdown"}`} isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="transparent" className={`${dropdownToggle ? "dropdown-toggle btn" : "pe-0"} border-0 dropdown-toggle`}>
        {dropdownToggle ? dropdownToggle : 
        <svg className="svg-sprite mb-1">
          <use href="../../assets/svg/icon-sprite.svg#more-horizontal"> </use>
        </svg>}
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-end">
        {(dropdownItems || days).map((item, i) => (
          <DropdownItem key={i} tag="a" href={Href} onClick={() => onSelect(item)}>
            {item}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>

  );
};

export default CommonDropdown;
