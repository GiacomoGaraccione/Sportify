import "../Css files/PlayOff.css";

import React from "react";
import Reacket from "reacket";
import { Row, Col, Carousel } from "react-bootstrap";
//import { OrizontalLine } from './OrizontalLine.js';

function PlayOff(props) {
  //Adapting data to Reacket
  let id = 0;
  for (let item of props.playOffList) {
    item.players[0].id = id;
    id++;
    item.players[1].id = id;
    id++;
    item.score = [0, 0];
  }

  return (
    <>
      <div style={{ marginLeft: "2%" }}>
        <Row className="content-groups" style={{ backgroundColor: "#B2E97C"}} >
          <Col className="bold-text" style={{ padding: "3%" }}>
            {props.tournamentTitle}: Playoff
          </Col>
        </Row>
        <Carousel
          interval={null}
          slide={false}
          prevIcon={
            <span aria-hidden="true" className="carousel-control-prev-icon" />
          }
        >
        </Carousel>
            <div className="custom">
              <Reacket matches={props.playOffList} />
            </div>
      </div>
    </>
  );
}

export { PlayOff };
