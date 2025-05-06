import { useAppSelector } from "@/redux-toolkit/Hooks";
import { SidebarItemType } from "@/types/layout";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, FormGroup } from "reactstrap";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";

export default function FullSearch() {
  const { isSearchBarOpen } = useAppSelector((state) => state.layout);
  const [searchValue, setSearchValue] = useState("");
  const [searchItems,setSearchItems] = useState<any>([])
  const [searchWord, setSearchWord] = useState("");
  const { linkItemsArray } = useAppSelector((store) => store.bookmarkData);

  const searchLinkItems = (e: { target: { value: any; }; }) => {
    let searchWord = e.target.value
    let copy = [...linkItemsArray];
    let result = copy.filter((item) => item.name.toLowerCase().includes(searchWord.toLowerCase()));
    setSearchItems(result);
    setSearchWord(searchWord)
  };

  useEffect(() => {
    if (searchWord.trim() !== "") {
      document.body.classList.add("offcanvas");
    } else {
      document.body.classList.remove("offcanvas");
    }
    return () => {
      document.body.classList.remove("offcanvas");
    };
  }, [searchWord]);

  return (
      <Form className={`form-inline search-full col ${isSearchBarOpen ? "open" : ""}`}>
        <FormGroup className="form-group w-100">
          <div className="Typeahead Typeahead--twitterUsers">
            <SearchInput setSearchItems={setSearchItems} handleSearch={searchLinkItems}  />
            <SearchResult suggestion={searchItems} />
          </div>
        </FormGroup>
      </Form>
  );
}
