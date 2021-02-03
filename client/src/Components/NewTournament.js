import React, { useState , useEffect } from "react";

/************ REACT BOOTSTRAP ************/
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
//import Alert from "react-bootstrap/Alert";

import Guided from "../Images/soccer2.png";
import Custom from "../Images/pencil2.png";

function NewTournament(props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [validated, setValidated] = useState("");
  const [customBool, setCustomBool] = useState(false);
  const [guidedBool, setGuidedBool] = useState(false);
  const [enabled /*, setEnabled*/] = useState(true);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if(flag){
      if (
        !props.tournamentTitle ||
        props.tournaments.find((t) => {
          return t.title.toLowerCase() === props.tournamentTitle.toLowerCase();
        })
      ) {
        let dels = document.getElementsByClassName("form-control form-control-lg");
        for (let i = 0; i < dels.length; i++) {
          dels[i].classList.add("red-border");
        }
        if(!props.tournamentTitle){
          setValidated("Choose a valid tournament name.");
        }
        else{
          setValidated("Tournament name already exists.")
        }
      }
      else{
        setValidated("");
        let dels = document.getElementsByClassName("form-control form-control-lg");
        for (let i = 0; i < dels.length; i++) {
          dels[i].classList.remove("red-border");
        }
      }
    }
    else setFlag(true);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tournamentTitle]);

  const closeModal = () => {
    setShowDeleteModal(false);
    setCustomBool(false);
    setGuidedBool(false);
  };

  const myFunction = (state) => {
    switch (state) {
      case "guided":
        setGuidedBool(true);
        setShowDeleteModal(true);
        break;

      case "custom":
        setCustomBool(true);
        setShowDeleteModal(true);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Container style={{ padding: "3%" }}>
        <Row
          className="content-groups"
          style={{ backgroundColor: "#B2E97C", border: "solid 1px", marginTop: "0px"}}
        >
          <Col className="bold-text" style={{ padding: "3%" }}>
            New Tournament
          </Col>
        </Row>
        <Row style={{ marginTop: "5%" }}>
          <CardDeck>
            <Card style={{ borderColor: "black" }}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => myFunction("guided")}
              >
                <Card.Img
                  variant="top"
                  src={Guided}
                  style={{ padding: "15%", backgroundColor: "#D0F285" }}
                />
                <Card.Body>
                  <Card.Title>Guided Setup</Card.Title>
                  <Card.Text>
                    Tell us the number of teams that will take part in the
                    tournament and choose among the options we suggest you!
                  </Card.Text>
                </Card.Body>
              </div>
            </Card>

            <Card style={{ borderColor: "black" }}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => myFunction("custom")}
              >
                <Card.Img
                  variant="top"
                  src={Custom}
                  style={{ backgroundColor: "#60A665" }}
                />
                <Card.Body>
                  <Card.Title>Custom Setup</Card.Title>
                  <Card.Text>
                    Create the tournament you prefer, with all possible levels
                    of freedom!
                  </Card.Text>
                </Card.Body>
              </div>
            </Card>
          </CardDeck>
        </Row>
        <TournamentModal
          validated={validated}
          setValidated={setValidated}
          show={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          deleteTournament={props.deleteTournament}
          activeTournament={props.activeTournament}
          closeModal={closeModal}
          errorAudio={props.errorAudio}
          setTournamentTitle={props.setTournamentTitle}
          tournamentTitle={props.tournamentTitle}
          guidedBool={guidedBool}
          customBool={customBool}
          setGuided={props.setGuided}
          setCustom={props.setCustom}
          tournaments={props.tournaments}
          enabled={enabled}
        />
      </Container>
    </>
  );
}

function TournamentModal(props) {
  let {validated} = props;
  //const [err, setErr] = useState({ bool: false, msg: null });

  const handleSubmit = (event) => {
    if (
      !props.tournamentTitle ||
      props.tournaments.find((t) => {
        return t.title.toLowerCase() === props.tournamentTitle.toLowerCase();
      })
    ) {
      props.errorAudio.play();
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      if (props.guidedBool) {
        props.setGuided(true);
      } else if (props.customBool) {
        props.setCustom(true);
      }
    }
  };

  const updateField = (t) => {
    props.setTournamentTitle(t);
  };

  return (
    <Modal
      show={props.show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable={true}
      animation={false}
      onHide={() => props.setShowDeleteModal(false)}
    >
      {props.guidedBool ? (
        <Modal.Header
          style={{ backgroundColor: "#B5DD79" }}
          onClick={() => props.setShowDeleteModal(false)}
        >
          <Modal.Title style={{ marginLeft: "auto", marginRight: "auto" }}>
            <b>Insert Tournament Name</b>
          </Modal.Title>
        </Modal.Header>
      ) : (
        <Modal.Header
          style={{ backgroundColor: "#4A9C5F" }}
          onClick={() => props.setShowDeleteModal(false)}
        >
          <Modal.Title style={{ marginLeft: "auto", marginRight: "auto" }}>
            <b>Insert Tournament Name</b>
          </Modal.Title>
        </Modal.Header>
      )}
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col className="content" style={{ textAlign: "center" }}>
              <Row>
                <Form.Group
                  controlId="validationCustom01"
                  style={{ width: "100%" }}
                >
                  <Form.Control
                    required
                    type="text"
                    placeholder="Tournament Name"
                    size="lg"
                    onChange={(ev) => updateField(ev.target.value)}
                    style={{
                      textAlign: "center",
                      width: "70%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  />
                  {validated &&
                    <div className="red">{validated}</div>
                  }
                </Form.Group>
              </Row>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.closeModal()}>
            Go Back
          </Button>
          {props.guidedBool ? (
            <Button
              style={{ backgroundColor: "#B5DD79", border: "none" }}
              type="submit"
              disabled={!props.enabled}
            >
              Next
            </Button>
          ) : (
            <Button
              style={{ backgroundColor: "#4A9C5F", border: "none" }}
              type="submit"
              disabled={!props.enabled}
            >
              Next
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export { NewTournament };
