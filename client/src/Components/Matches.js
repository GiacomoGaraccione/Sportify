import "../Css files/Matches.css";

import React, { useState } from "react";
import { Row, Col, /*Container,*/ Carousel } from "react-bootstrap";
import moment from "moment";
import jsPDF from "jspdf";

import download from "../Images/download.png";
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

function Matches(props) {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const generatePDF = (event) => {
    event.preventDefault();
    let result = [];

    let matchesPerDay = props.matchesList.length / props.dateList.length;
    let matchesDone = 0;

    let date = "Day " + props.matchesList[0].Date;
    let matches = [];
    if (props.dateList.length === 1) {
      for (let i = 0; i < props.matchesList.length; i++) {
        matches.push(
          props.matchesList[i].Team_1 + " - " + props.matchesList[i].Team_2
        );
      }
      result.push({ date: date, matches: matches });
    } else {
      for (let i = 0; i < props.matchesList.length; i++) {
        if (matchesDone === matchesPerDay) {
          matchesDone = 0;
          result.push({ date: date, matches: matches });
          date = "Day " +  props.matchesList[i].Date;
          matches = [];
          //doc.setFontSize(20);
          //doc.text(35, 50, props.matchesList[i].Date);
          //doc.setFontSize(12);
        }
        matches.push(
          props.matchesList[i].Team_1 + " - " + props.matchesList[i].Team_2
        );
        /*doc.text(
              10,
              y,
              props.matchesList[i].Team_1 + " - " + props.matchesList[i].Team_2
            );*/
        matchesDone++;
      }
    }
    const LINE_GAP = 10;
    let y = 30;
    let fileName = "Matches_" + props.tournamentTitle;
    var doc = new jsPDF();
    /*doc.setFontSize(30);
    doc.text(1, 25, "Matches for the tournament: " + props.tournamentTitle);
    doc.setFontSize(20);
    doc.text(35, 50, props.matchesList[0].Date);
    doc.setFontSize(12);*/
    doc.setFontSize(22);
    doc.text(
      15,
      20,
      "Matches for the tournament: " + props.tournamentTitle,
      "justify"
    );

    for (let i = 0; i < result.length; i++) {
      if (i > 0) {
        doc.addPage();
        doc.setFontSize(22);
        doc.text(
          15,
          20,
          "Matches for the tournament: " + props.tournamentTitle,
          "justify"
        );
        y = 30;
      }
      doc.setFontSize(18);
      doc.text(15, y + 5, result[i].date, "justify");
      y += LINE_GAP + 5;
      doc.setFontSize(14);
      for (let match of result[i].matches) {
        doc.text(15, y, match, "justify");
        y += LINE_GAP;
      }
    }

    doc.save(fileName);
  };

  return (
    <>
      <div className="other-layout" style={{ marginLeft: "2%" }}>
      <div className="custom-space"></div>
        <Row
          className="content-groups custom-header"
          style={{ backgroundColor: "#B2E97C"}}
        >
          <Col className="bold-text" style={{ padding: "3%" }}>
            {props.tournamentTitle}: Matches
          </Col>
        </Row>
        <Carousel
          interval={null}
          activeIndex={index}
          onSelect={handleSelect}
          slide={false}
          prevIcon={
            <span aria-hidden="true" className="carousel-control-prev-icon" />
          }
        >
          {props.dateList.map((el, j) => (
            <Carousel.Item key={j} interval={null}>
              <div className="custom-matches">{"Day " + el}</div>
              {props.matchesList.filter((ev) => {
                return ev.Date === el;
              })
              .map((ev, i) => {
                  return <div key={i}>
                    &nbsp; &nbsp;
                    <div className="content-matches">
                      <Row
                        className="justify-content-md-center"
                        key={Math.random()}
                      >
                        <Col>{ev.Team_1}</Col>
                        <Col className="match-date">VS</Col>
                        <Col>{ev.Team_2}</Col>
                      </Row>
                      <Row className="justify-content-md-center" key={ev.Id}>
                        <Col></Col>
                        <Col className="match-date">
                          {moment(ev.Time, "HH.mm").format("HH:mm")}
                        </Col>
                        <Col></Col>
                      </Row>
                    </div>
                    <ColoredLine color="black"></ColoredLine>
                  </div>
              })}
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <div>
        <Row className="h-100 d-inline-block">{""}</Row>

        <Row className="justify-content-md-end">
          <Col md="auto" id="export">
            <img src={download} alt="img" onClick={(event) => generatePDF(event)} size={"2x"}/>
          </Col>
        </Row>
      </div>
      <img src={Larrow} alt="img1" id="larrow" className="arrow"/>
      <img src={Rarrow} alt="img2" id="rarrow" className="arrow"/>
    </>
  );
}

export { Matches };
