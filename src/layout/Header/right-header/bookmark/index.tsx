"use client";
import { AddNewBookmark, BookmarkTitle, Href } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/Hooks";
import { bookmarkToggle } from "@/redux-toolkit/slices/layout/layoutSlice";
import { Bookmark } from "react-feather";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import { BackButton } from "./BackButton";
import { MainContent } from "./MainContent";
import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";

const HeaderBookmark = () => {
  const dispatch = useAppDispatch();
  const bookmarkToggleClass = useAppSelector((store) => store.layout.bookmarkToggle);

  return (
    <li className="onhover-dropdown">
      <div className="notification-box">
        {/* <Bookmark /> */}
        <SvgIcon iconId='fill-star' />

      </div>
      <div className="onhover-show-div bookmark-flip">
        <div className="flip-card">
          <div className={`flip-card-inner ${bookmarkToggleClass}`}>
            <div className="front dropdown-title p-0">
              <h6 className="f-18 mb-4 dropdown-title">{BookmarkTitle}</h6>
              <ListGroup className="simple-list pt-0 p-3 bookmark-dropdown">
                <MainContent />
                <ListGroupItem className="text-center pb-0">
                  <a className="flip-btn f-w-700" onClick={() => dispatch(bookmarkToggle("flipped"))} href={Href} id="flip-btn">
                    {AddNewBookmark}
                  </a>
                </ListGroupItem>
              </ListGroup>
            </div>
            <BackButton />
          </div>
        </div>
      </div>
    </li>
  );
};

export default HeaderBookmark;
