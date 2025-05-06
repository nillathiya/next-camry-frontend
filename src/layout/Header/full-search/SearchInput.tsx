import React, { useState } from "react";
import { Input } from "reactstrap";
import { X } from "react-feather";
import { useSelector, useDispatch } from "react-redux";
import { SearchBarArrayType, SearchInputProp } from "@/types/layout";
import { setIsSearchBarOpen } from "@/redux-toolkit/slices/layout/layoutSlice";
import { useAppSelector } from "@/redux-toolkit/Hooks";

const SearchInput = ({ handleSearch }: SearchInputProp) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const { isSearchBarOpen } = useAppSelector((state) => state.layout);

  const searchToggle = () => {
    dispatch(setIsSearchBarOpen(!isSearchBarOpen));
  };

  const clearInput = () => {
    setInputValue("");
    document.body.classList.remove("offcanvas");
  };
  return (
    <div className="u-posRelative">
      <Input
        className="demo-input Typeahead-input w-100"
        type="text"
        placeholder="Search yuri .."
        onChange={(e) => {
          handleSearch(e);
          setInputValue(e.target.value);
        }}
        value={inputValue}
      />
      <div className="spinner-border Typeahead-spinner" role="status">
        <span className="sr-only">{"Loading..."}</span>
      </div>
      <X
        className="close-search"
        onClick={() => {
          searchToggle();
          clearInput();
        }}
      />
    </div>
  );
};
export default SearchInput;
