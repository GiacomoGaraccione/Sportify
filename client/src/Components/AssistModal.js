import React from "react";
import { Button, Modal } from "react-bootstrap";
import "../Css files/confirmPage.css";

class AssistModal extends React.Component {
  render() {
    return (
      <Modal
        show={this.props.showHelpModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable={true}
        animation={false}
        onHide={() => this.props.onClickClose()}
      >
        <Modal.Header
          style={{ backgroundColor: "#0098AD" }}
          onClick={() => this.props.onClickClose()}
        >
          <Modal.Title style={{ marginLeft: "auto", marginRight: "auto" }}>
            <b style={{ color: "white" }}>Assistance</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.mode === "home and away" && (
            <h4>
              Selecting the "Home and Away" option will make it so that all
              matches between two teams will be disputed twice.
            </h4>
          )}
          {this.props.mode === "number of teams" && (
            <h4>
              In the first phase of a tournament, this number corresponds to the
              total number of teams enrolled in the tournament.
            </h4>
          )}
          {this.props.mode === "first round group" && (
            <h4>
              The total amount of teams enrolled in the tournament will be
              divided into different groups, with each group having the number
              of teams you choose here.
            </h4>
          )}
          {this.props.mode === "second phase teams" && (
            <h4>
              The number of teams you select here will be the teams that will
              pass the previous phase of the tournament and play in the next
              one.
            </h4>
          )}
          {this.props.mode === "structure" && (
            <>
              There are three possible options for the structure you can select
              for a phase:
              <div className="space"> </div>
              <ul>
                <li key={1}>
                  Play-off: an elimination tournament where teams that win their
                  match will face other winning teams until only one remains.
                </li>
                <div className="space"> </div>
                <li key={2}>
                  Groups: all teams will be divided into equal groups and will
                  face every other team in the group.
                </li>
                <div className="space"> </div>
                <li key={3}>
                  Championship: all teams will play against each other; when all
                  matches will be completed teams will be ranked based on the
                  results of all matches.
                </li>
                <div className="space"> </div>
              </ul>
            </>
          )}
          {this.props.mode === "options" && (
            <>
              There are four possible options for the structure we can suggest
              you:
              <div className="space"> </div>
              <p key={1}>
                Play-off: a single-phase elimination tournament where teams that
                win their match will face other winning teams until only one
                remains.
              </p>
              <div className="space"> </div>
              <p key={2}>
                Groups: a single-phase tournament where all teams will be
                divided into equal groups and will face every other team in the
                group.
              </p>
              <div className="space"> </div>
              <p key={3}>
                A two phase tournament where the first phase will be a
                championship (all teams will face each other), followed by a
                play-off tournament.
              </p>
              <div className="space"> </div>
              <p key={4}>
                A two phase tournament where the first phase will be see teams
                divided into groups, followed by a play-off tournament.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={() => this.props.onClickClose()}>
            {" "}
            Thanks for the explaination!
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AssistModal;
