import { Dashboard, Default } from "@/constants";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, Col } from "reactstrap";

const HeaderBreadcrumb = () => {
  const [titles, setTitles] = useState<string[]>([Dashboard, Default]);
  const path = usePathname();
  const first = titles[titles.length - 1];
  const second = titles[titles.length - 2];
  const capitalize = (str: string) => {
    return str?.charAt(0).toUpperCase() + str.slice(1);
  };
  useEffect(() => {
    setTitles(path.split("/"));
  }, [path]);

  return (
    <Col xs="auto" className="header-right-wrapper page-title">
      <div>
        <h2>{capitalize(first)}</h2>
        <Breadcrumb className="justify-content-sm-start align-items-center mb-0">
          <BreadcrumbItem>
            <Link href={`/dashboard/default`}>{"Home"}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem className="f-w-500">
            {capitalize(second)}
          </BreadcrumbItem>
          <BreadcrumbItem className="f-w-500">
            {capitalize(first)}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </Col>
  );
};

export default HeaderBreadcrumb;
