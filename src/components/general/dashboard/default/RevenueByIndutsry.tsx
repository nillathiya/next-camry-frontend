import CommonCardHeader from "@/common-components/CommonCardHeader";
import { RevenueByIndustry } from "@/constants";
import { RevenueSliderData } from "@/data/general/dashboard/default";
import { Card, CardBody, Col } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';

const RevenueWidget = () => {
  return (
    <Col xl="6" sm="6" className="revenue-column col-xxl-100 box-col-12">
      <Card className="title-line widget-1">
        <CommonCardHeader headClass="card-no-border" title={RevenueByIndustry} />
        <CardBody className="pt-0">
          <div className="revenue-slider-wrapper">
            <Swiper slidesPerView={1} pagination={{ clickable: true }} modules={[Pagination]} spaceBetween={50} className="revenue-swiper">
              <div className="swiper-wrapper">
                {RevenueSliderData.map((item, i) => (
                  <SwiperSlide key={i}>
                    <div className="light-card satisfaction-box progrees-widget">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="social-content">
                          {item.icon}
                          <span className="f-w-500 f-light">{item.text} </span>
                        </span>
                        <span className="f-12 f-w-500 f-light">{item.percentage}</span>
                      </div>
                      <div className={item.class} style={{ height: 5 }}>
                        <div className="progress-bar-animated progress-bar-striped" role="progressbar" style={{ width: item.percentage }} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RevenueWidget;
