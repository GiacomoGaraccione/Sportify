import React from "react";
import "../App.css";
import "../Css files/confirmPage.css";

import { Row, Col, Modal, ListGroup, Button } from "react-bootstrap";
import Confirm from "../Images/confirm.png";

class ConfirmModal extends React.Component {
  createItem = (phase) => {
    return <ListGroup.Item key={phase.phase_number}>
          <Row className="justify-content-md-center">
            <Col md="auto" className="confirmElementCenter">
              Phase {phase.phase_number}
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md="auto" className="content">
              {phase.structure.type}
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md="auto" className="content">
              {phase.structure.qualified_teams} teams
            </Col>
          </Row>
          {(phase.structure.home_away === 1 ||
            phase.structure.home_away === true) && (
            <Row className="justify-content-md-center">
              <Col md="auto" className="content">
                Matches done "home and away" style
              </Col>
            </Row>
          )}
        </ListGroup.Item>
  };

  render() {
    return (
      <Modal
        show={this.props.showSaveModal}
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
          <>
            {!this.props.saved && this.props.options.length > 0 && (
              <>
                {this.props.phases.length === 1 && (
                  <ListGroup>
                    <ListGroup.Item key={1}>
                      <Row className="justify-content-md-center">
                        <Col md="auto" className="content">
                          {this.props.phases[0].structure.type}
                        </Col>
                      </Row>
                      <Row className="justify-content-md-center">
                        <Col md="auto" className="content">
                          {this.props.numberOfTeams} teams
                        </Col>
                      </Row>
                      {(this.props.phases[0].structure.home_away === 1 ||
                        this.props.phases[0].structure.home_away === true) && (
                        <Row className="justify-content-md-center">
                          <Col md="auto" className="content">
                            Matches done "home and away" style
                          </Col>
                        </Row>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                )}
                {this.props.phases.length > 1 && (
                  <ListGroup>
                    {this.props.phases.map((phase) => this.createItem(phase))}
                  </ListGroup>
                )}
              </>
            )}
            {this.props.saved && (
              <h4> Your selected structure has been saved!</h4>
            )}
          </>
        </Modal.Body>
        {!this.props.saved && (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.props.onClickClose()}
            >
              Go Back
            </Button>
            <Button
              style={{ width: "20%" }}
              variant="success"
              onClick={() => this.props.onClickSave()}
            >
              <Row>
                <img
                  style={{ width: "20%", marginLeft: "8%", marginRight: "5%" }}
                  src={Confirm}
                  alt="confirm"
                />
                <div
                  style={{
                    marginTop: "auto",
                    marginRight: "auto",
                  }}
                >
                  Confirm
                </div>
              </Row>
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    );
  }
}

export default ConfirmModal;
