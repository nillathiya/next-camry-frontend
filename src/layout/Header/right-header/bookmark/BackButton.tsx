import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { Back, Href } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { handleBookmarkChange } from "@/redux-toolkit/slices/bookMarkDataSlice";
import { bookmarkToggle } from "@/redux-toolkit/slices/layout/layoutSlice";
import { SearchBarArrayType } from "@/types/layout";
import Link from "next/link";
import { useState } from "react";
import { Input } from "reactstrap";

export const BackButton = () => {
  const [starIcon, setStarIcon] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const { linkItemsArray } = useAppSelector((store) => store.bookmarkData);
  const [searchedItems, setSearchedItems] = useState<SearchBarArrayType[]>([]);

  const searchItems = () => {
    let copy = [...linkItemsArray];
    let result = copy.filter((item) => item.name.toLowerCase().includes(searchWord.toLowerCase()));
    setSearchedItems(result);
  };
  const dispatch = useAppDispatch();
  
  return (
    <div className="back dropdown-title">
      <ul className="p-0 list-group">
        <li className="list-group-item">
          <div className="bookmark-dropdown flip-back-content">
            <Input
              type="text"
              value={searchWord}
              placeholder="search..."
              onChange={(e) => {
                setSearchWord(e.target.value);
                searchItems();
              }}
            />
            <div className={`Typeahead-menu filled-bookmark custom-scrollbar ${searchWord ? "is-open" : ""}`} id="search-outer">
              {searchedItems.map((item, i) => (
                <div key={i} className="ProfileCard u-cf">
                  <div className="ProfileCard-avatar"><SvgIcon iconId={`stroke-${item.icon}`} /></div>
                  <div className="ProfileCard-details">
                    <div className="ProfileCard-realName">
                      <Link className="realname" href={`${item.pathName}`}>
                        {item.name}
                      </Link>
                      <span className="pull-right">
                        <Link href={Href}>
                          <i onClick={() => dispatch(handleBookmarkChange(linkItemsArray[item.id - 1]))} className={`fa mt-1 icon-star ${linkItemsArray[item.id - 1].bookmarked ? "fa-star" : "fa-star-o"}`}></i>
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`empty-bookmark Typeahead-menu ${searchWord && !searchedItems.length ? "is-open" : ""}`}>
              <div className="tt-dataset tt-dataset-0">
                <div className="EmptyMessage">Opps!! There are no result found.</div>
              </div>
            </div>
          </div>
        </li>
        <li className="pb-0 list-group-item">
          <a href={Href} className="f-w-700 d-block flip-back text-decoration-none" onClick={() => dispatch(bookmarkToggle(""))} id="flip-back">
            {Back}
          </a>
        </li>
      </ul>
    </div>
  );
};
