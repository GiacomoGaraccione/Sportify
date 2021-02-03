import React, { useState } from "react";
import { Row, Col, /*Container,*/ Carousel } from "react-bootstrap";
import SwiperCore, {
  Navigation,
  Pagination,
  EffectFade,
  Autoplay,
} from "swiper";
import "swiper/swiper-bundle.css";
import "../Css files/Groups.css";
import Larrow from "../Images/Left.png";
import Rarrow from "../Images/Right.png";

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 1,
    }}
  />
);

SwiperCore.use([Navigation, Pagination, EffectFade, Autoplay]);

function Groups(props) {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <>
      <div style={{ marginLeft: "2%" }}>
        <div className="custom-space"></div>
        
        <Row
          className="content-groups custom-header"
          style={{ backgroundColor: "#B2E97C", border: "solid 1px" }}
        >
          {props.groupList[0].GroupName === "Championship" &&
            <Col className="bold-text" style={{ padding: "3%" }}>
              {props.tournamentTitle}: Championship
            </Col>
          }
          {props.groupList[0].GroupName !== "Championship" && <>
              <Col className="bold-text" style={{ padding: "3%" }}>
                {props.tournamentTitle}: Groups
              </Col>
            </>
          }
        </Row>
        
        
        {props.groupList[0].GroupName !== "Championship" && <>
          <img src={Larrow} alt="img1" id="larrow" className="arrow"/>
          <img src={Rarrow} alt="img2" id="rarrow" className="arrow"/>
        </>}

        <Carousel
          interval={null}
          slide={false}
          activeIndex={index}
          onSelect={handleSelect}
          prevIcon={
            <span aria-hidden="true" className="carousel-control-prev-icon" />
          }
        >

          
          {props.groupList.map((el, i) => (
            <Carousel.Item key={i} interval={null}>
              &nbsp; &nbsp;
              <div className="custom-body">
              {el.GroupName !== "Championship" &&
                <div className="custom-groups">{el.GroupName}</div>
              }
              
              <Row className="justify-content-md-center subtitle uff">
                <Col className="first-col"></Col>
                <Col>Played</Col>
                <Col>Won</Col>
                <Col>Drawn</Col>
                <Col>Lost</Col>
                <Col>For</Col>
                <Col>Against</Col>
                <Col>Goal</Col>
                <Col>Points</Col>
              </Row>
              {props.groupsComposition.map((ex, i) => {
                if (ex.Group === el.GroupName) {
                  return (
                    <div key={i}>
                      <Row className="row-team">
                        <Col className="first-col">{ex.Team}</Col>
                        <Col>0</Col>
                        <Col>0</Col>
                        <Col>0</Col>
                        <Col>0</Col>
                        <Col>0</Col>
                        <Col>0</Col>
                        <Col>0</Col>
                        <Col>0</Col>
                      </Row>
                      <ColoredLine color="black"></ColoredLine>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </>
  );
}
export { Groups };
