import { Emptysearch } from "@/constants";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import Link from "next/link";
import { SearchResultProp, SidebarItemType } from "@/types/layout";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";

const SearchResult = ({ suggestion }: any) => {
  return (
    <>
      <div
        className={`Typeahead-menu custom-scrollbar ${
          suggestion.length > 0 ? "is-open" : ""
        }`}
        id="search-outer"
      >
        <div className="header-search-suggestion custom-scrollbar">
          {suggestion.map((item: SidebarItemType, i: number) => (
            <div className="ProfileCard u-cf" key={i}>
              <div className="ProfileCard-details">
                <div className="ProfileCard-realName">
                  <Link
                    className="realname  w-100 d-flex justify-content-start gap-2"
                    href={`${item?.url || item?.pathName}`}
                  >
                    <SvgIcon iconId={`stroke-${item?.icon}`} />
                    {item?.title || item?.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="Typeahead-menu empty-menu">
        <div className="tt-dataset tt-dataset-0">
          <div className="EmptyMessage">{Emptysearch}</div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;
