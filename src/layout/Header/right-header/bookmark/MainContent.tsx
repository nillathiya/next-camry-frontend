import SvgIcon from "@/common-components/common-icon/CommonSvgIcons";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import { useRouter } from "next/navigation";
import { Col, Row } from "reactstrap";

export const MainContent = () => {
  const { bookmarkedData } = useAppSelector((store) => store.bookmarkData);
  const router = useRouter();
  
  return (
    <Row className="custom-scrollbar">
      {bookmarkedData.map((item, i) => (
        <Col key={i} xs="4" className=" text-center">
          <div className="bookmark-content" onClick={() => router.push(`${item.pathName}`)}>
            <div className="bookmark-icon">
              <SvgIcon iconId={`stroke-${item.icon}`} />
            </div>
            {item.name || item.title}
          </div>
        </Col>
      ))}
    </Row>
  );
};
