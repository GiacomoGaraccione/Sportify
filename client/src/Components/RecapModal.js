import React from "react";
import { Button, Modal, Row, Col, ListGroup } from "react-bootstrap";
import Play2 from "../Images/play2.png";

class RecapModal extends React.Component {
  createItem = (team, index) => {
    return <ListGroup.Item key={index}>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <b>{team}</b>
            </Col>
          </Row>
        </ListGroup.Item>
  };

  render() {
    return (
      <Modal
        show={this.props.showRecapModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable={true}
        animation={false}
        onHide={() => this.props.onClickClose()}
      >
        <Modal.Header
          style={{ backgroundColor: "#6DBE6C" }}
          onClick={() => this.props.onClickClose()}
        >
          <Modal.Title style={{ marginLeft: "auto", marginRight: "auto" }}>
            <b>Do you confirm these options?</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.teams.length > 1 && (
            <ListGroup>
              {this.props.teams.map((team, index) =>
                this.createItem(team, index)
              )}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.props.onClickClose()}>
            Go Back
          </Button>
          <Button
            style={{ width: "20%" }}
            variant="success"
            onClick={() => this.props.onClickSave()}
          >
            <Row>
              <img
                style={{ width: "25%", marginLeft: "12%", marginRight: "5%" }}
                src={Play2}
                alt="play2"
              />
              <div
                style={{
                  marginTop: "auto",
                  marginRight: "auto",
                }}
              >
                Start
              </div>
            </Row>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default RecapModal;
