import React, { useState } from "react";
import "../Css files/confirmPage.css";

/************ REACT BOOTSTRAP ************/
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";

import Play from "../Images/play.png";
import Delete2 from "../Images/delete2.png";
import Custom from "../Images/pencil.jpg";

function StartTournament(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Container style={{ padding: "3%" }}>
        <Row className="content-groups" style={{ backgroundColor: "#B2E97C", border: "solid 1px", marginTop: "0px", fontWeight: "bold"}}>
          <span style={{ fontSize: "45px", margin: "auto" }}>
            {" "}
            {props.activeTournament.title}{" "}
          </span>
        </Row>
        <Row>
          <CardDeck style={{ marginTop: "3%" }}>
            <Card border="success">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => props.setTeamSelection(true)}
              >
                <Card.Img variant="top" src={Play} style={{ padding: "15%" }} />
                <Card.Body>
                  <Card.Title>Start Tournament</Card.Title>
                  <Card.Text>
                    Select the teams that will enroll in your tournament and
                    then start it.
                  </Card.Text>
                </Card.Body>
              </div>
            </Card>
            <Card border="warning">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => props.setUpdate(true)}
              >
                <Card.Img variant="top" src={Custom} />
                <Card.Body>
                  <Card.Title>Edit Tournament</Card.Title>
                  <Card.Text>
                    Change some parameters you previously set in the tournament
                    that now don't fit anymore with your situation.
                  </Card.Text>
                </Card.Body>
              </div>
            </Card>
          </CardDeck>
          <DeleteModal
            show={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            deleteTournament={props.deleteTournament}
            activeTournament={props.activeTournament}
          />
        </Row>
      </Container>
    </>
  );
}

function DeleteModal(props) {
  return (
    <Modal
      show={props.show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable={true}
      animation={false}
      onHide={() => props.setShowDeleteModal(false)}
    >
      <Modal.Header
        style={{ backgroundColor: "#EE5262" }}
        onClick={() => props.setShowDeleteModal(false)}
      >
        <Modal.Title style={{ marginLeft: "auto", marginRight: "auto" }}>
          <b>Delete Tournament</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-md-center">
          <Col className="content" style={{ textAlign: "center" }}>
            Are you sure you want to delete{" "}
            <b>{props.activeTournament.title}</b>?<br></br>
            <small>This operation cannot be undone!</small>
            {/*<img src={Delete} style={{width: '15%', marginLeft: 'auto', marginRight: 'auto', marginTop: '3%'}}/>*/}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => props.setShowDeleteModal(false)}
        >
          Go Back
        </Button>
        <Button
          style={{ width: "20%" }}
          variant="danger"
          onClick={() => props.deleteTournament(props.activeTournament)}
        >
          <Row>
            <img
              style={{ width: "25%", marginLeft: "8%", marginRight: "5%" }}
              src={Delete2}
              alt="delete2"
            />
            <div style={{ marginTop: "auto", marginRight: "auto" }}>
              Delete
            </div>
          </Row>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { StartTournament, DeleteModal };
