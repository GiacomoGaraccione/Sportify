import React, { useEffect } from "react";
import "../Css files/Homepage.css";

/************ SWIPER ************/
import soccer from "../Images/soccer.jpg";
import padel from "../Images/padel.jpg";
import tennis from "../Images/tennis.jpg";
import volley from "../Images/volley.jpg";
import basket from "../Images/basket.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation,
  Pagination,
  EffectFade,
  Autoplay,
} from "swiper";
import "swiper/swiper-bundle.css";
SwiperCore.use([Navigation, Pagination, EffectFade, Autoplay]);

function Homepage(props) {
  useEffect(() => {
    if (props.showCreateToast) {
      setInterval(props.onCloseCreateToast, 5000);
    }
    if (props.showDeleteToast) {
      setInterval(props.onCloseDeleteToast, 5000);
    }
    if (props.showUpdateToast) {
      setInterval(props.onCloseUpdateToast, 5000);
    }
    if (props.showStartToast) {
      setInterval(props.onCloseStartToast, 5000);
    }
  });
  return (
    <>
      {props.showCreateToast && (
        <>
          <div className="notification-container">
            <div className="notification-toast">
              <div>
                <p className="notification-message">
                  Your tournament has been saved correctly!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {props.showDeleteToast && (
        <>
          <div className="notification-container">
            <div className="notification-toast">
              <div>
                <p className="notification-message">
                  Your tournament has been deleted correctly!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {props.showUpdateToast && (
        <>
          <div className="notification-container">
            <div className="notification-toast">
              <div>
                <p className="notification-message">
                  Your tournament has been updated correctly!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {props.showStartToast && (
        <>
          <div className="notification-container">
            <div className="notification-toast">
              <div>
                <p className="notification-message">
                  Your tournament has started correctly!
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      <Gallery />
    </>
  );
}

function Gallery(props) {
  return (
    <>
      <Swiper
        id="main"
        tag="section"
        wrapperTag="span"
        effect="fade"
        loop="true"
        grabCursor="true"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          type: "custom",
        }}
        spaceBetween={0}
        slidesPerView={1}
      >
        <SwiperSlide key={0} tag="li">
          {" "}
          <img
            className="img-responsive-width"
            src={soccer}
            style={{ listStyle: "none" }}
            alt="Resource not found"
          />{" "}
        </SwiperSlide>
        <SwiperSlide key={1} tag="li">
          {" "}
          <img
            className="img-responsive-width"
            src={padel}
            style={{ listStyle: "none" }}
            alt="Resource not found"
          />{" "}
        </SwiperSlide>
        <SwiperSlide key={2} tag="li">
          {" "}
          <img
            className="img-responsive-width"
            src={tennis}
            style={{ listStyle: "none" }}
            alt="Resource not found"
          />{" "}
        </SwiperSlide>
        <SwiperSlide key={3} tag="li">
          {" "}
          <img
            className="img-responsive-width"
            src={basket}
            style={{ listStyle: "none" }}
            alt="Resource not found"
          />{" "}
        </SwiperSlide>
        <SwiperSlide key={4} tag="li">
          {" "}
          <img
            className="img-responsive-width"
            src={volley}
            style={{ listStyle: "none" }}
            alt="Resource not found"
          />{" "}
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export { Homepage };
