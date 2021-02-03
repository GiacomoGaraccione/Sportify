import React from "react";
import "../App.css";
import "../Css files/CustomSetup.css";

import {
  Row,
  Col,
  Container,
  Form,
  FormGroup,
  Button,
  Carousel,
  Image,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import Switch from "react-switch";

import EliminationTournament from "../Images/PlayOff_Only.png";
import Championship from "../Images/Championship_Only.png";
import ChampionshipTournament from "../Images/Championship_PlayOff.png";
import Groups_4_3_1 from "../Images/groups_4_3_1.png"; //12 squadre
import Groups_4_3_2 from "../Images/groups_4_3_2.png";

import Groups_5_3_1 from "../Images/groups_5_3_1.png"; //15 squadre
import Groups_5_3_2 from "../Images/groups_5_3_2.png";

import Groups_4_4_1 from "../Images/groups_4_4_1.png"; //16 squadre
import Groups_4_4_2 from "../Images/groups_4_4_2.png";

import Groups_6_3_1 from "../Images/groups_6_3_1.png"; //18 squadre
import Groups_6_3_2 from "../Images/groups_6_3_2.png";

import Groups_4_5_1 from "../Images/groups_4_5_1.png"; //20 squadre
import Groups_4_5_2 from "../Images/groups_4_5_2.png";
import Groups_5_4_1 from "../Images/groups_5_4_1.png";
import Groups_5_4_2 from "../Images/groups_5_4_2.png";

import Groups_7_3_1 from "../Images/groups_7_3_1.png"; //21 squadre
import Groups_7_3_2 from "../Images/groups_7_3_2.png";

import Groups_4_6_1 from "../Images/groups_4_6_1.png"; //24 squadre
import Groups_4_6_2 from "../Images/groups_4_6_2.png";
import Groups_6_4_1 from "../Images/groups_6_4_1.png";
import Groups_6_4_2 from "../Images/groups_6_4_2.png";
import Groups_8_3_1 from "../Images/groups_8_3_1.png";
import Groups_8_3_2 from "../Images/groups_8_3_2.png";

import Groups_5_5_1 from "../Images/groups_5_5_1.png"; //25 squadre
import Groups_5_5_2 from "../Images/groups_5_5_2.png";

import Groups_9_3_1 from "../Images/groups_9_3_1.png"; //27 squadre
import Groups_9_3_2 from "../Images/groups_9_3_2.png";

import Groups_4_7_1 from "../Images/groups_4_7_1.png"; //28 squadre
import Groups_4_7_2 from "../Images/groups_4_7_2.png";
import Groups_7_4_1 from "../Images/groups_7_4_1.png";
import Groups_7_4_2 from "../Images/groups_7_4_2.png";

import Groups_5_6_1 from "../Images/groups_5_6_1.png"; //30 squadre
import Groups_5_6_2 from "../Images/groups_5_6_2.png";
import Groups_6_5_1 from "../Images/groups_6_5_1.png";
import Groups_6_5_2 from "../Images/groups_6_5_2.png";
import Groups_10_3_1 from "../Images/groups_10_3_1.png";
import Groups_10_3_2 from "../Images/groups_10_3_2.png";

import Groups_4_8_1 from "../Images/groups_4_8_1.png"; //32 squadre
import Groups_4_8_2 from "../Images/groups_4_8_2.png";
import Groups_8_4_1 from "../Images/groups_8_4_1.png";
import Groups_8_4_2 from "../Images/groups_8_4_2.png";

import ConfirmModal from "./ConfirmModal.js";
import AssistModal from "./AssistModal.js";

class GuidedSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      numberOfTeams: 0,
      mode: null,
      showSaveModal: false,
      showErrorModal: false,
      showHelpModal: false,
      saved: false,
      options: [],
      numbersOfGroups: [],
      phases: [],
      tournament: null,
      assistMode: null,
      newTitle: '',
      validated: false,
    };
  }

  componentDidMount() {
    if (this.props.tournament.phases.length > 0) {
      //Update di torneo già esistente
      let numberOfTeams = this.props.tournament.enrolled_teams;
      let mode;
      let numberOfGroups = [];
      if (this.props.tournament.phases.length === 1) {
        //1 sola fase, può essere a eliminazione (mode = 0) o campionato (mode = 1)
        mode =
          this.props.tournament.phases[0].structure.type === "Play-off" ? 0 : 1;
      } else {
        //2 fasi, la prima può essere campionato o gironi, la seconda è sempre eliminazione
        let phase1 = this.props.tournament.phases[0].structure.type;
        let secondPhaseTeams = this.props.tournament.phases[1].structure
          .qualified_teams;
        if (phase1 === "Championship") {
          //in base ai qualified teams della seconda fase si decide la struttura
          if (secondPhaseTeams === 4) {
            mode = 2;
          } else if (secondPhaseTeams === 8) {
            mode = 3;
          } else {
            mode = 4;
          }
        } else {
          //prima fase a gironi

          //calcolo del numero di gironi possibili con il numero di squadre inserite
          let max = Math.floor(numberOfTeams / 2);
          let numRounds = 0;
          for (let i = 4; i < max && numRounds < 4; i++) {
            if (numberOfTeams % i === 0) {
              numRounds++;
              numberOfGroups.push(i);
            }
          }

          let groups = this.props.tournament.phases[0].structure.groups_number;
          let secondPhaseTeams = this.props.tournament.phases[1].structure
            .qualified_teams;

          if (groups === numberOfGroups[0]) {
            //casi 5 e 6
            if (secondPhaseTeams === numberOfTeams / groups) {
              mode = 5;
            } else {
              mode = 6;
            }
          } else if (groups === numberOfGroups[1]) {
            //casi 7 e 8
            if (secondPhaseTeams === numberOfTeams / groups) {
              mode = 7;
            } else {
              mode = 8;
            }
          } else if (groups === numberOfGroups[2]) {
            //casi 9 e 10
            if (secondPhaseTeams === numberOfTeams / groups) {
              mode = 9;
            } else {
              mode = 10;
            }
          } else if (groups === numberOfGroups[3]) {
            //casi 11 e 11
            if (secondPhaseTeams === numberOfTeams / groups) {
              mode = 11;
            } else {
              mode = 12;
            }
          }
        }
      }
      if (
        (numberOfTeams === 12 ||
          numberOfTeams === 15 ||
          numberOfTeams === 16) &&
        mode > 3
      ) {
        mode--;
      }
      this.createOptions(numberOfTeams);
      if (this.props.tournament.phases[0].structure.home_away) {
        this.handleChange(true);
      }
      this.setState({
        numberOfTeams: numberOfTeams,
        phases: this.props.tournament.phases,
        mode: mode,
        newTitle: this.props.tournamentTitle,
      });
    }
  }

  /**
   * Aggiorna la scelta dell'utente relativa all'avere partite andata e ritorno o solo andata, cambiando anche l'aspetto dello Switch associato
   * @param checked Boolean che indica la scelta di avere partite "Home and Away" o meno
   */
  handleChange(checked) {
    let newChecked = !this.state.checked;
    this.setState({ checked: newChecked });
  }

  /**
   * Calcola le possibili strutture da mostrare all'utente nel Carousel in base al numero di squadre inserito
   * @param teams numero di squadre inserito dall'utente o passato come props da App.js
   */
  createOptions = (teams) => {
    let max = Math.floor(teams / 2);
    let numRounds = 0;
    let values = [];
    let mode = this.state.mode === null ? 0 : this.state.mode;

    //calcola numero di gironi possibili partendo da almeno 4 gironi e arrivando a teams/2 escluso
    for (let i = 4; i < max && numRounds < 4; i++) {
      if (teams % i === 0) {
        numRounds++;
        values.push(i);
      }
    }

    let options = [];
    let id = 0;
    options.push({
      firstPhase: "Play-off, " + teams + " teams",
      secondPhase: "",
      img: EliminationTournament,
      id: id,
    });
    options.push({
      firstPhase: "Championship, " + teams + " teams.",
      secondPhase: "",
      img: Championship,
      id: id + 1,
    });

    id = 2;

    if (teams > 4) {
      options.push({
        firstPhase: "Championship, " + teams + " teams.",
        secondPhase: "Play-off, 4 best teams.",
        img: ChampionshipTournament,
        id: id,
      });
      id++;
    }

    if (teams > 8) {
      options.push({
        firstPhase: "Championship, " + teams + " teams.",
        secondPhase: "Play-off, 8 best teams.",
        img: ChampionshipTournament,
        id: id,
      });
      id++;
    }

    if (teams > 16) {
      options.push({
        firstPhase: "Championship, " + teams + " teams.",
        secondPhase: "Play-off, 16 best teams.",
        img: ChampionshipTournament,
        id: id,
      });
      id++;
    }

    if (parseInt(teams, 10) === 12) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_4_3_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_4_3_2,
        id: id + 1,
      });
    }

    if (parseInt(teams, 10) === 15) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_5_3_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_5_3_2,
        id: id + 1,
      });
    }

    if (parseInt(teams, 10) === 16) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_4_4_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_4_4_2,
        id: id + 1,
      });
    }

    if (parseInt(teams, 10) === 18) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_6_3_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_6_3_2,
        id: id + 1,
      });
    }

    if (parseInt(teams, 10) === 20) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_4_5_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_4_5_2,
        id: id + 1,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + values[1] + " teams",
        img: Groups_5_4_1,
        id: id + 2,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + 2 * values[1] + " teams",

        img: Groups_5_4_2,
        id: id + 3,
      });
    }

    if (parseInt(teams, 10) === 21) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_7_3_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_7_3_2,
        id: id + 1,
      });
    }

    if (parseInt(teams, 10) === 24) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_4_6_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_4_6_2,
        id: id + 1,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + values[1] + " teams",
        img: Groups_6_4_1,
        id: id + 2,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + 2 * values[1] + " teams",

        img: Groups_6_4_2,
        id: id + 3,
      });
      options.push({
        firstPhase: values[2] + " groups of " + teams / values[2] + " teams",
        secondPhase: "Play-off, " + values[2] + " teams",
        img: Groups_8_3_1,
        id: id + 4,
      });
      options.push({
        firstPhase: values[2] + " groups of " + teams / values[2] + " teams",
        secondPhase: "Play-off, " + 2 * values[2] + " teams",

        img: Groups_8_3_2,
        id: id + 5,
      });
    }

    if (parseInt(teams, 10) === 25) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_5_5_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_5_5_2,
        id: id + 1,
      });
    }

    if (parseInt(teams, 10) === 27) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_9_3_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_9_3_2,
        id: id + 1,
      });
    }

    if (parseInt(teams, 10) === 28) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_4_7_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_4_7_2,
        id: id + 1,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + values[1] + " teams",
        img: Groups_7_4_1,
        id: id + 2,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + 2 * values[1] + " teams",

        img: Groups_7_4_2,
        id: id + 3,
      });
    }

    if (parseInt(teams, 10) === 30) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_5_6_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_5_6_2,
        id: id + 1,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + values[1] + " teams",
        img: Groups_6_5_1,
        id: id + 2,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + 2 * values[1] + " teams",

        img: Groups_6_5_2,
        id: id + 3,
      });
      options.push({
        firstPhase: values[2] + " groups of " + teams / values[2] + " teams",
        secondPhase: "Play-off, " + values[2] + " teams",
        img: Groups_10_3_1,
        id: id + 4,
      });
      options.push({
        firstPhase: values[2] + " groups of " + teams / values[2] + " teams",
        secondPhase: "Play-off, " + 2 * values[2] + " teams",

        img: Groups_10_3_2,
        id: id + 5,
      });
    }

    if (parseInt(teams, 10) === 32) {
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + values[0] + " teams",
        img: Groups_4_8_1,
        id: id,
      });
      options.push({
        firstPhase: values[0] + " groups of " + teams / values[0] + " teams",
        secondPhase: "Play-off, " + 2 * values[0] + " teams",

        img: Groups_4_8_2,
        id: id + 1,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + values[1] + " teams",
        img: Groups_8_4_1,
        id: id + 2,
      });
      options.push({
        firstPhase: values[1] + " groups of " + teams / values[1] + " teams",
        secondPhase: "Play-off, " + 2 * values[1] + " teams",

        img: Groups_8_4_2,
        id: id + 3,
      });
    }

    let modes = [];
    for (let item of options) {
      modes.push(item.id);
    }
    if (modes.indexOf(mode) === -1) {
      mode = 0;
    }

    this.setState({
      numberOfTeams: teams,
      options: options,
      numbersOfGroups: values,
      mode: mode,
    });
  };

  /**
   * Riceve il nuovo numero di squadre inserito dall'utente e aggiorna le opzioni presentate
   * @param event evento causato dall'utente quando cambia il numero di squadre nel campo apposito
   */
  onChangeValue = (event) => {
    event.preventDefault();
    let teams = event.target.value;
    if(teams === 1){
        teams = 2;
    }
    if (!teams || teams < 0) {
      teams = 0;
    } else if (teams > 32) {
      teams = 32;
    }
    if (teams >= 2) {
      this.createOptions(teams);
    } else if (!teams) {
      this.setState({ numberOfTeams: 0, options: [] });
    } else if (teams < 2) {
      this.setState({ numberOfTeams: teams, options: [] });
    }
  };

  /**
   * Mostra uno dei due possibili Modal quando l'utente sceglie di salvare
   *  - errore se l'utente prova a salvare senza aver inserito il numero di squadre
   *  - riepilogo opzioni (dopo aver calcolato la struttura)
   */
  showModal = () => {
    if (this.state.numberOfTeams > 0) {
      this.computeStructure();
      this.setState({ showSaveModal: true });
    } else {
      this.setState({ showErrorModal: true });
    }
  };

  /**
   * Chiude tutti i Modal aperti dall'utente (errore, salvataggio, messaggio di aiuto)
   */
  onClickClose = () => {
    this.setState({
      showSaveModal: false,
      showErrorModal: false,
      saved: false,
      showHelpModal: false,
    });
  };

  /**
   * Calcola la struttura del torneo scelta dall'utente in base alla selezione fatta nel Carousel
   */
  computeStructure = () => {
    let mode = this.state.mode;
    if (
      (this.state.numberOfTeams === "12" ||
        this.state.numberOfTeams === "15" ||
        this.state.numberOfTeams === "16") &&
      this.state.mode > 3
    ) {
      mode++;
    }

    if (
      this.props.tournament.phases.length > 0 &&
      (this.state.numberOfTeams === 12 ||
        this.state.numberOfTeams === 15 ||
        this.state.numberOfTeams === 16) &&
      mode > 3
    ) {
      mode++;
    }

    let phases = [];
    let numbersOfGroups = this.state.numbersOfGroups;

    switch (mode) {
      case 0: //elimination
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 1: //campionato
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Championship",
              group_teams: this.state.numberOfTeams,
              groups_number: 1,
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 2: //campionato + torneo tra i migliori 4
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Championship",
              group_teams: this.state.numberOfTeams,
              groups_number: 1,
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: 4,
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 3: //campionato + torneo tra i migliori 8
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Championship",
              group_teams: this.state.numberOfTeams,
              groups_number: 1,
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: 8,
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 4: //campionato + torneo tra i migliori 16
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Championship",
              group_teams: this.state.numberOfTeams,
              groups_number: 1,
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: 16,
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 5: //gironi + torneo, una squadra a girone passa
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Groups",
              group_teams: this.state.numberOfTeams / numbersOfGroups[0],
              groups_number: numbersOfGroups[0],
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: numbersOfGroups[0],
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 6: //gironi + torneo, due squadre a girone passano
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Groups",
              group_teams: this.state.numberOfTeams / numbersOfGroups[0],
              groups_number: numbersOfGroups[0],
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: 2 * numbersOfGroups[0],
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 7: //gironi + torneo, una squadra a girone passa
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Groups",
              group_teams: this.state.numberOfTeams / numbersOfGroups[1],
              groups_number: numbersOfGroups[1],
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: numbersOfGroups[1],
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 8: //gironi + torneo, due squadre a girone passano
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Groups",
              group_teams: this.state.numberOfTeams / numbersOfGroups[1],
              groups_number: numbersOfGroups[1],
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: 2 * numbersOfGroups[1],
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 9: //gironi + torneo, una squadra a girone passa
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Groups",
              group_teams: this.state.numberOfTeams / numbersOfGroups[2],
              groups_number: numbersOfGroups[2],
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: numbersOfGroups[2],
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 10: //gironi + torneo, due squadre a girone passano
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Groups",
              group_teams: this.state.numberOfTeams / numbersOfGroups[2],
              groups_number: numbersOfGroups[2],
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: 2 * numbersOfGroups[2],
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 11: //gironi + torneo, una squadra a girone passa
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Groups",
              group_teams: this.state.numberOfTeams / numbersOfGroups[3],
              groups_number: numbersOfGroups[3],
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: numbersOfGroups[3],
              home_away: this.state.checked,
            },
          },
        ];
        break;
      case 12: //gironi + torneo, due squadre a girone passano
        phases = [
          {
            phase_number: 1,
            structure: {
              type: "Groups",
              group_teams: this.state.numberOfTeams / numbersOfGroups[3],
              groups_number: numbersOfGroups[3],
              qualified_teams: this.state.numberOfTeams,
              home_away: this.state.checked,
            },
          },
          {
            phase_number: 2,
            structure: {
              type: "Play-off",
              group_teams: 3,
              groups_number: 2,
              qualified_teams: 2 * numbersOfGroups[3],
              home_away: this.state.checked,
            },
          },
        ];
        break;
      default:
        break;
    }
    //API.save(phases);

    this.setState({ phases: phases });
  };

  onClickSave = () => {
    if (!this.props.update) {
      let t = {
        id: this.props.tournaments.length + 1,
        title: this.props.tournamentTitle,
        enrolled_teams: this.state.numberOfTeams,
        phases: this.state.phases,
        custom: 0,
      };
      this.props.createTournament(t);
    } else {
      let t = {
        id: this.props.tournament.id,
        title: this.state.newTitle,
        enrolled_teams: this.state.numberOfTeams,
        phases: this.state.phases,
        custom: 0,
      };
      this.props.updateTournament(t);
    }
  };

  /**
   * Salva nello stato quale slide l'utente sta visualizzando e quindi sceglierà di salvare come struttura
   * @param event Identificatore della slide del Carousel selezionata dall'utente
   */
  onSelectCarousel = (event) => {
    let mode = event;

    this.setState({ mode: mode });
  };

  /**
   * Mostra il Modal di assistenza quando viene cliccata l'icona relativa all'opzione "Home and Away"
   */
  onClickHelp = (assistMode) => {
    this.setState({ showHelpModal: true, assistMode: assistMode });
  };

  /**
   * Ritorna il numero di squadre passate come props da App.js, se questo esiste
   * Serve per mostrare i valori già caricati correttamente in pagina se si sceglie di modificare un torneo già creato
   */
  getNumberOfTeams = () => {
    if (this.state.numberOfTeams > 0) {
      return this.state.numberOfTeams;
    } else {
      return "";
    }
  };

  onChangeTitle = (event) => {
    if (
      !event.target.value ||
      (event.target.value.toLowerCase() !== this.props.tournamentTitle.toLowerCase() && this.props.tournaments.find((t) => {
        return t.title.toLowerCase() === event.target.value.toLowerCase();
      }))
    ) {
      let dels = document.getElementById("tournament-title");
      dels.classList.add("red-border");
      if(!event.target.value){
        this.setState({validated: "Choose a valid tournament name."});
      }
      else{
        this.setState({validated: "Tournament name already exists."});
      }
    }
    else{
      let dels = document.getElementById("tournament-title");
      dels.classList.remove("red-border"); 
      this.setState({validated: ''});
    }
    this.setState({ newTitle: event.target.value });
  };

  render() {
    return (
      <>
        {!this.props.update && (
          <Carousel slide={false}>
            <Row
              className="content-groups custom-header-guided"
              style={{ backgroundColor: "#B2E97C", border: "solid 1px" }}
            >
              <Col className="bold-text" style={{ padding: "3%" }}>
                {this.props.tournamentTitle}
              </Col>
            </Row>
          </Carousel>
        )}
        <div className="custom-layout" style={{ padding: "3%" }}>
          {this.props.update > 0 && (
            <Form>
              <FormGroup
                className="tournament-title"
                controlId="tournament-title"
              >
                <Form.Control
                  size="lg"
                  type="text"
                  name="tournament-title"
                  value={this.state.newTitle}
                  onChange={(event) => this.onChangeTitle(event)}
                  required
                />
              </FormGroup>
              {this.state.validated &&
                  <div className="red">{this.state.validated}</div>
              }
            </Form>
          )}
          <Container>
            <Row className="h-100 d-inline-block">{""}</Row>
            <Row className="justify-content-md-between align-items-center">
              <Col md="auto" style={{ padding: "0px" }}>
                <h4 className="subtitle"> Number of Teams</h4>
              </Col>
              <Col md="auto" style={{ marginTop: "28px" }}>
                <Form>
                  <Form.Group controlId="teams">
                    <Form.Control
                      type="number"
                      min={0}
                      max={32}
                      onChange={(event) => this.onChangeValue(event)}
                      autoFocus
                      required
                      value={this.getNumberOfTeams()}
                    ></Form.Control>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="h-100 d-inline-block">{""}</Row>
            <Row className="justify-content-md-between">
              <Col md="auto" style={{ padding: "0px" }}>
                <div className="guided-label">
                  Home and away games{" "}
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    onClick={() => this.onClickHelp("home and away")}
                  ></FontAwesomeIcon>
                </div>
              </Col>
              <Col md="auto">
                <Switch
                  onChange={() => this.handleChange(!this.state.checked)}
                  checked={this.state.checked}
                  id="normal-switch"
                />
              </Col>
            </Row>
            <Row className="h-100 d-inline-block">{""}</Row>
            <Row className="justify-content-md-center">
              <Col md="auto">
                {this.state.numberOfTeams < 2 && (
                  <div className="small-guided-label">
                    Please select at least two teams so we can compute possible
                    tournament structures.{" "}
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      onClick={() => this.onClickHelp("options")}
                    ></FontAwesomeIcon>
                  </div>
                )}
              </Col>
            </Row>
            <Row className="h-100 d-inline-block">{""}</Row>

            <Row
              className="justify-content-md-center"
              style={{ marginTop: "-20px" }}
            >
              <Col md="auto">
                {this.state.numberOfTeams >= 2 && (
                  <>
                    <Row className="justify-content-md-center">
                      <Col md="auto"></Col>
                    </Row>
                    <Row className="h-10 d-inline-block">{""}</Row>
                    <Carousel
                      interval={null}
                      onSelect={(event) => this.onSelectCarousel(event)}
                      activeIndex={this.state.mode}
                      slide={false}
                    >
                      {this.state.options.map((option) => (
                        <Carousel.Item interval={null} key={option.id}>
                          <Row className="justify-content-md-center">
                            <Col md="auto">
                              <p style={{ fontSize: "2rem" }}>
                                <b
                                  style={{ color: "#469860", fontSize: "2rem" }}
                                >
                                  First phase:{" "}
                                </b>{" "}
                                <b>{option.firstPhase}</b>
                              </p>
                            </Col>
                          </Row>
                          {option.secondPhase !== "" && (
                            <Row className="justify-content-md-center">
                              <Col md="auto">
                                <p style={{ fontSize: "2rem" }}>
                                  <b
                                    style={{
                                      color: "#469860",
                                      fontSize: "2rem",
                                    }}
                                  >
                                    Second phase:{" "}
                                  </b>{" "}
                                  <b>{option.secondPhase}</b>
                                </p>
                              </Col>
                            </Row>
                          )}
                          <Row className="h-100 d-inline-block">{""}</Row>

                          <Row className="justify-content-md-center">
                            <Col md="auto">
                              <Image
                                style={{ width: "100%" }}
                                src={option.img}
                                alt="img"
                                rounded
                              ></Image>
                            </Col>
                          </Row>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </>
                )}
              </Col>
            </Row>

            <Row className="h-100 d-inline-block">{""}</Row>
            <Row className="justify-content-md-between">
              <Col md="auto">
                <Button
                  variant="danger"
                  onClick={() => {
                    this.props.setGuided(false);
                    this.props.setUpdate(false);
                  }}
                >
                  {" "}
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                  ></FontAwesomeIcon> Back{" "}
                </Button>
              </Col>
              {this.state.options.length > 0 && (
                <Col md="auto">
                  <div
                    className="small-guided-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Swipe left and right to see different options{" "}
                  </div>
                </Col>
              )}
              <Col md="auto">
                <Button
                  variant="success"
                  onClick={() => this.showModal()}
                  disabled={this.state.numberOfTeams < 2 || this.state.validated}
                >
                  {" "}
                  Save{" "}
                </Button>
              </Col>
            </Row>
            <ConfirmModal
              showSaveModal={this.state.showSaveModal}
              onClickClose={() => this.onClickClose()}
              saved={this.state.saved}
              options={this.state.options}
              phases={this.state.phases}
              onClickSave={() => this.onClickSave()}
              numberOfTeams={this.state.numberOfTeams}
              checked={this.state.checked}
            ></ConfirmModal>
            <AssistModal
              showHelpModal={this.state.showHelpModal}
              onClickClose={this.onClickClose}
              mode={this.state.assistMode}
            ></AssistModal>
          </Container>
        </div>
      </>
    );
  }
}

export default GuidedSetup;
