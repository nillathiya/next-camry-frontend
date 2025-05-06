import React, { Fragment } from "react";
import { CardHeader } from "reactstrap";

const CommonCardHeader = ({ headClass, title, subTitle, titleClass }: any) => {
  return (
    <CardHeader className={` ${headClass ? headClass : ''}`}>
      <h2 className={`mb-0 ${titleClass ? titleClass : ''}`}>{title}</h2>
      {subTitle && (
        <p className="f-m-light mt-1">
          {subTitle.map((data: any, index: any) => (
            <Fragment key={index}>
              {data?.text} {data.code && <code>{data.code}</code>}
            </Fragment>
          ))}
        </p>
      )}
    </CardHeader>
  );
};

export default CommonCardHeader;
