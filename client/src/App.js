import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import API from "./Api.js";

/************ REACT BOOTSTRAP ************/
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/************ ICONS ************/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

/************ SOUNDS ************/
import soundCreate from "./Sounds/soundCreate.wav";
import soundUpdate from "./Sounds/soundUpdate.wav";
import soundError from "./Sounds/soundError.wav";
import soundDelete from "./Sounds/soundDelete.wav";
import soundLoading from "./Sounds/soundLoading.wav";
import soundStart from "./Sounds/soundStart.wav";

/************ COMPONENTS ************/
import "./App.css";
import { Sidebar } from "./Components/Sidebar";
import { Homepage } from "./Components/Homepage";
import { NewTournament } from "./Components/NewTournament";
import { Groups } from "./Components/Groups";
import { PlayOff } from "./Components/PlayOff";
import { Matches } from "./Components/Matches";
import { StartTournament, DeleteModal } from "./Components/StartTournament";
import { CustomSetup } from "./Components/CustomSetup.js";
import GuidedSetup from "./Components/GuidedSetup.js";
import { TeamSelection } from "./Components/TeamSelection.js";
import Loading from "./Components/Loading.js";

function App() {
  const createAudio = new Audio(soundCreate);
  const deleteAudio = new Audio(soundDelete);
  const updateAudio = new Audio(soundUpdate);
  const errorAudio = new Audio(soundError);
  const loadingAudio = new Audio(soundLoading);
  const startAudio = new Audio(soundStart);

  /************ HOOK ************/
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [phases /*setPhases*/] = useState([]);

  const [tournaments, setTournaments] = useState([]);
  const [items, setItems] = useState([]);

  const [activeTournament, setActiveTournament] = useState([]);
  const [tournamentTitle, setTournamentTitle] = useState("");
  const [activeItemId, setActiveItemId] = useState("");

  const [groupsComposition, setGroupComposition] = useState([]);
  const [groupList, setGroupList] = useState([]);

  const [playOffList, setPlayOffList] = useState([]);

  const [dateList, setDateList] = useState([]);
  const [matchesList, setMatchesList] = useState([]);

  const [newTournament, setNewTournament] = useState(false);
  const [guided, setGuided] = useState(false);
  const [custom, setCustom] = useState(false);
  const [groups, setGroups] = useState(false);
  const [playoff, setPlayoff] = useState(false);
  const [matches, setMatches] = useState(false);
  const [tournamentNotStarted, setTournamentNotStarted] = useState(false);
  const [update, setUpdate] = useState(false);
  const [teamSelection, setTeamSelection] = useState(false);
  const [showCreateToast, setShowCreateToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showStartToast, setShowStartToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSec, setLoadingSec] = useState(true);
  const [phaseT, setPhaseT] = useState("");

  /************ FUNCTIONS ************/
  const openModal = () => {
    setShowDeleteModal(true);
  };

  useEffect(() => {
    if(!loading){
      setTimeout(() => {
        setLoadingSec(false);
      }, 1000);
    }
    else{
      setLoadingSec(true);
    }
  }, [loading]);

  const toHome = () => {
    let newItems = items;
    if (newItems[newItems.length - 1].title === "New Tournament") {
      newItems.splice(newItems.length - 1, 1);
      setItems(newItems);
      setNewTournament(false);
      setGuided(false);
      setCustom(false);
      setUpdate(false);
      setActiveTournament([]);
      setTournamentTitle("");
      setActiveItemId("");
    } else if (groups || playoff || matches || tournamentNotStarted) {
      SetSidebar();
      setTournamentNotStarted(false);
      setGroups(false);
      setPlayoff(false);
      setMatches(false);
      setUpdate(false);
      setTeamSelection(false);
      setActiveTournament([]);
      setTournamentTitle("");
    }
  };

  const Tournament = () => {
    setGuided(false);
    setCustom(false);
    setActiveTournament([]);
    setTournamentTitle("");
    setActiveItemId("");
    setGroups(false);
    setPlayoff(false);
    setMatches(false);
    setUpdate(false);
    setTournamentNotStarted(false);
    let newItems = items;
    newItems.push({
      title: "New Tournament",
      itemId: "/newTournament",
      elemBefore: () => <FontAwesomeIcon icon={faTrophy} />,
    });
    setItems(newItems);
    setNewTournament(true);
    //setActiveItemId('/newTournament');
  };

  const createTournament = (t) => {
    setLoading(true);
    loadingAudio.play();
    API.createTournament(t)
      .then(() => {
        API.getAllTournaments()
          .then((tournaments) => {
            setTournaments(tournaments);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
        SetSidebar();
        createAudio.play();
        setShowCreateToast(true);
      })
      .catch(() => {
        setLoading(false);
      });
    toHome();
  };

  const startTournament = (selectedTeams) => {
    const newActiveTournament = { ...activeTournament, teams: selectedTeams };
    setLoading(true);
    loadingAudio.play();
    API.startTournament(newActiveTournament)
      .then(() => {
        API.getAllTournaments()
          .then((tournaments) => {
            setTournaments(tournaments);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
        SetSidebar();
        startAudio.play();
        setShowStartToast(true);
      })
      .catch(() => {
        setLoading(false);
      });
    toHome();
  };

  const deleteTournament = (t) => {
    setLoading(true);
    loadingAudio.play();
    API.deleteTournament(t.id)
      .then(() => {
        API.getAllTournaments()
          .then((tournaments) => {
            setTournaments(tournaments);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
        SetSidebar();
        deleteAudio.play();
        setShowDeleteToast(true);
        setShowDeleteModal(false);
      })
      .catch(() => {
        setLoading(false);
      });
    toHome();
  };

  const updateTournament = (t) => {
    setLoading(true);
    loadingAudio.play();
    API.deleteTournament(t.id)
      .then(() => {
        API.createTournament(t)
          .then(() => {
            API.getAllTournaments()
              .then((tournaments) => {
                setTournaments(tournaments);
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
            SetSidebar();
            updateAudio.play();
            setShowUpdateToast(true);
          })
          .catch(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
    toHome();
  };

  const phase = (tournamentTitle, phaseNumber, phaseType) => {
    function compare(a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }
    setPhaseT(phaseType);
    let newItems = items;
    if (newItems[newItems.length - 1].title === "New Tournament") {
      newItems.splice(newItems.length - 1, 1);
      setItems(newItems);
      setNewTournament(false);
      setGuided(false);
      setCustom(false);
    }

    switch (phaseType) {
      case "Groups":
        setLoading(true);
        loadingAudio.play();
        API.getGroupsComposition(tournamentTitle, phaseNumber)
          .then((groups) => {
            setGroupComposition(groups);
            API.getGroups(tournamentTitle, phaseNumber)
              .then((groupsList) => {
                setGroupList(groupsList);
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
          })
          .catch(() => {
            setLoading(false);
          });
        setTournamentNotStarted(false);
        setNewTournament(false);
        setMatches(false);
        setPlayoff(false);
        setGroups(true);
        break;

      case "Play-off":
        setLoading(true);
        loadingAudio.play();
        API.getPlayOff(tournamentTitle, phaseNumber).then((matches) => {
          let result = [];
          let aux;
          matches.forEach((el) => {
            aux = {};
            aux = {
              id: el.id,
              round: el.round,
              match: el.match,
              players: [
                {
                  id: el.idTeam1,
                  name: el.nameTeam1,
                  seed: el.seedTeam1,
                },
                {
                  id: el.idTeam2,
                  name: el.nameTeam2,
                  seed: el.seedTeam2,
                },
              ],
              score: [el.scoreTeam1, el.scoreTeam2],
            };
            result.push(aux);
            setLoading(false);
          });
          setPlayOffList(result);
        });

        setNewTournament(false);
        setMatches(false);
        setGroups(false);
        setTournamentNotStarted(false);
        setPlayoff(true);
        break;

      case "Matches":
        setLoading(true);
        loadingAudio.play();
        API.getMatches(tournamentTitle)
          .then((matches) => {
            let dates = [];
            matches.forEach((el) => {
              if (dates.indexOf(el.Date) === -1) dates.push(el.Date);
            });
            dates.sort(compare); //eppoibbasta
            setDateList(dates);
            setMatchesList(matches);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });

        setNewTournament(false);
        setGroups(false);
        setPlayoff(false);
        setTournamentNotStarted(false);
        setMatches(true);
        break;

      case "notStarted":
        setNewTournament(false);
        setMatches(false);
        setGroups(false);
        setPlayoff(false);
        setTeamSelection(false);
        setTournamentNotStarted(true);
        setGuided(false);
        setCustom(false);
        setUpdate(false);
        break;

      case "Delete":
        setNewTournament(false);
        setMatches(false);
        setGroups(false);
        setPlayoff(false);
        setTeamSelection(false);
        setTournamentNotStarted(false);
        setUpdate(false);
        setGuided(false);
        setCustom(false);
        openModal();
        break;

      default:
        setLoading(true);
        loadingAudio.play();
        API.getGroupsComposition(tournamentTitle, phaseNumber)
          .then((groups) => {
            setGroupComposition(groups);
            API.getGroups(tournamentTitle, phaseNumber)
              .then((groupsList) => {
                setGroupList(groupsList);
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
          })
          .catch(() => {
            setLoading(false);
          });
        setTournamentNotStarted(false);

        setNewTournament(false);
        setMatches(false);
        setGroups(true);
        setPlayoff(false);
        break;
    }
  };

  const SetSidebar = () => {
    let newItems = [];
    tournaments.forEach((tournament) => {
      let newItem = {
        title: null,
        itemId: null,
        elemBefore: () => <FontAwesomeIcon icon={faTrophy} />,
        subNav: [],
      };

      newItem.title = tournament.title;
      newItem.itemId = "/" + tournament.title.replace(/\s/g, "").toLowerCase();

      if (tournament.started) {
        tournament.phases.forEach((phase) => {
          newItem.subNav.push({
            title: "Phase " + phase.phase_number + ": " + phase.structure.type,
            itemId: [
              tournament.title + " phase " + phase.phase_number,
              {
                tournamentId: tournament.id,
                tournamentTitle: tournament.title,
                phaseNumber: phase.phase_number,
                phaseType: phase.structure.type,
              },
              tournament,
            ],
          });
        });

        newItem.subNav.push({
          title: "Matches",
          itemId: [
            tournament.title + " Matches",
            {
              tournamentId: tournament.id,
              tournamentTitle: tournament.title,
              phaseType: "Matches",
            },
            tournament,
          ],
        });

        newItem.subNav.push({
          title: "Delete Tournament",
          itemId: [
            tournament.title + " Delete",
            {
              tournamentId: tournament.id,
              tournamentTitle: tournament.title,
              phaseType: "Delete",
            },
            tournament,
          ],
        });
      } else {
        newItem.subNav.push({
          title: "Manage Tournament",
          itemId: [
            tournament.title,
            {
              tournamentId: tournament.id,
              tournamentTitle: tournament.title,
              phaseType: "notStarted",
            },
            tournament,
          ],
        });
        newItem.subNav.push({
          title: "Delete Tournament",
          itemId: [
            tournament.title + " Delete",
            {
              tournamentId: tournament.id,
              tournamentTitle: tournament.title,
              phaseType: "Delete",
            },
            tournament,
          ],
        });
      }
      newItems.push(newItem);
    });
    setItems(newItems);
  };

  useEffect(() => {
    API.getAllTournaments()
      .then((tournaments) => {
        setTournaments(tournaments);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    SetSidebar();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    SetSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournaments]);

  const onCloseCreateToast = () => {
    setShowCreateToast(false);
  };

  const onCloseDeleteToast = () => {
    setShowDeleteToast(false);
  };

  const onCloseUpdateToast = () => {
    setShowUpdateToast(false);
  };

  const onCloseStartToast = () => {
    setShowStartToast(false);
  };

  return (
    <>
      <Router>
        <Switch>
          <Route
            path="/guided"
            render={(props) => {
              if (newTournament && guided) {
                let tournament = {
                  phases: [],
                };
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                            setTournamentTitle={setTournamentTitle}
                          />
                        </Col>
                        <Col md={9}>
                            <GuidedSetup
                              setTournamentTitle={setTournamentTitle}
                              updateTournament={updateTournament}
                              tournaments={tournaments}
                              tournamentTitle={tournamentTitle}
                              phases={phases}
                              createTournament={createTournament}
                              setGuided={setGuided}
                              tournament={tournament}
                              update={update}
                              setUpdate={setUpdate}
                            />
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/custom"
            render={(props) => {
              if (newTournament && custom) {
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            setTournamentTitle={setTournamentTitle}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                          />
                        </Col>
                        <Col md={9}>
                          <CustomSetup
                            updateTournament={updateTournament}
                            setUpdate={setUpdate}
                            setTournamentTitle={setTournamentTitle}
                            tournaments={tournaments}
                            setTournaments={setTournaments}
                            setCustom={setCustom}
                            tournamentTitle={tournamentTitle}
                            createTournament={createTournament}
                            tournament={activeTournament}
                          />
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/newTournament"
            render={(props) => {
              if (newTournament) {
                if (guided) {
                  return <Redirect to="/guided" />;
                } else if (custom) {
                  return <Redirect to="/custom" />;
                }
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            setTournamentTitle={setTournamentTitle}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                          />
                        </Col>
                        <Col md={9}>
                          <NewTournament
                            errorAudio={errorAudio}
                            tournamentTitle={tournamentTitle}
                            setTournamentTitle={setTournamentTitle}
                            Tournament={Tournament}
                            setGuided={setGuided}
                            setCustom={setCustom}
                            tournaments={tournaments}
                          />
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/startTournament"
            render={(props) => {
              if (tournamentNotStarted && !update && !teamSelection) {
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            setTournamentTitle={setTournamentTitle}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                          />
                        </Col>
                        <Col md={9}>
                          <StartTournament
                            startTournament={startTournament}
                            setTeamSelection={setTeamSelection}
                            deleteTournament={deleteTournament}
                            activeTournament={activeTournament}
                            update={update}
                            setUpdate={setUpdate}
                          />
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/teamSelection"
            render={(props) => {
              if (tournamentNotStarted && !update && teamSelection) {
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            setTournamentTitle={setTournamentTitle}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                          />
                        </Col>
                        <Col md={9}>
                          <TeamSelection
                            soundError={errorAudio}
                            setTeamSelection={setTeamSelection}
                            tournament={activeTournament}
                            startTournament={startTournament}
                            loadingAudio={loadingAudio}
                          />
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/update"
            render={(props) => {
              if (tournamentNotStarted && !teamSelection && update) {
                if (activeTournament.custom) {
                  return (
                    <>
                      <Container fluid>
                        <Row>
                          <Col md={3} className="sticky-top">
                            <Sidebar
                              setTournamentTitle={setTournamentTitle}
                              activeItemId={activeItemId}
                              setActiveItemId={setActiveItemId}
                              items={items}
                              setItems={setItems}
                              newTournament={newTournament}
                              setNewTournament={setNewTournament}
                              Tournament={Tournament}
                              toHome={toHome}
                              setGroups={setGroups}
                              setPlayoff={setPlayoff}
                              setMatches={setMatches}
                              phase={phase}
                              setTournamentNotStarted={setTournamentNotStarted}
                              setActiveTournament={setActiveTournament}
                            />
                          </Col>
                          <Col md={9}>
                          {loadingSec && <Loading msg={"Loading " + tournamentTitle + "..."}/>}
                          {!loadingSec &&
                            <CustomSetup
                              updateTournament={updateTournament}
                              tournaments={tournaments}
                              setTournaments={setTournaments}
                              setCustom={setCustom}
                              tournamentTitle={tournamentTitle}
                              setTournamentTitle={setTournamentTitle}
                              createTournament={createTournament}
                              tournament={activeTournament}
                              setUpdate={setUpdate}
                            />
                          }
                          </Col>
                        </Row>
                      </Container>
                    </>
                  );
                } else if (!activeTournament.custom) {
                  return (
                    <>
                      <Container fluid>
                        <Row>
                          <Col md={3} className="sticky-top">
                            <Sidebar
                              setTournamentTitle={setTournamentTitle}
                              activeItemId={activeItemId}
                              setActiveItemId={setActiveItemId}
                              items={items}
                              setItems={setItems}
                              newTournament={newTournament}
                              setNewTournament={setNewTournament}
                              Tournament={Tournament}
                              toHome={toHome}
                              setGroups={setGroups}
                              setPlayoff={setPlayoff}
                              setMatches={setMatches}
                              phase={phase}
                              setTournamentNotStarted={setTournamentNotStarted}
                              setActiveTournament={setActiveTournament}
                            />
                          </Col>
                          <Col md={9}>
                          {loadingSec && <Loading msg={"Loading " + tournamentTitle + "..."}/>}
                          {!loadingSec &&
                            <GuidedSetup
                              updateTournament={updateTournament}
                              tournaments={tournaments}
                              tournamentTitle={tournamentTitle}
                              phases={phases}
                              createTournament={createTournament}
                              setGuided={setGuided}
                              tournament={activeTournament}
                              update={update}
                              setUpdate={setUpdate}
                            />
                          }
                          </Col>
                        </Row>
                      </Container>
                    </>
                  );
                }
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/groups"
            render={(props) => {
              if (groups) {
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            setTournamentTitle={setTournamentTitle}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                          />
                        </Col>
                        <Col md={9}>
                        {loadingSec && <Loading msg={"Loading " + phaseT + " of " + tournamentTitle + "..."}/>}
                        {!loadingSec &&
                          <Groups
                            tournamentTitle={tournamentTitle}                          
                            groupList={groupList}
                            groupsComposition={groupsComposition}
                          />
                        }
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/playoff"
            render={(props) => {
              if (playoff) {
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            setTournamentTitle={setTournamentTitle}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                          />
                        </Col>
                        <Col md={9}>
                        {loadingSec && <Loading msg={"Loading Playoff of " + tournamentTitle + "..."}/>}
                        {!loadingSec &&
                          <PlayOff playOffList={playOffList} tournamentTitle={tournamentTitle} />
                        }
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/matches"
            render={(props) => {
              if (matches) {
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            setTournamentTitle={setTournamentTitle}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                          />
                        </Col>
                        <Col md={9}>
                        {loadingSec && <Loading msg={"Loading Matches of " + tournamentTitle + "..."}/>}
                        {!loadingSec &&
                          <Matches
                            dateList={dateList}
                            matchesList={matchesList}
                            tournamentTitle={tournamentTitle}
                          />
                        }
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              } else {
                return <Redirect to="/" />;
              }
            }}
          />
          <Route
            path="/"
            render={(props) => {
              if (newTournament) {
                return <Redirect to="/newTournament" />;
              } else if (groups) {
                return <Redirect to="/groups" />;
              } else if (playoff) {
                return <Redirect to="/playoff" />;
              } else if (matches) {
                return <Redirect to="/matches" />;
              } else if (teamSelection) {
                return <Redirect to="/teamSelection" />;
              } else if (update) {
                return <Redirect to="/update" />;
              } else if (tournamentNotStarted) {
                return <Redirect to="/startTournament" />;
              } else {
                return (
                  <>
                    <Container fluid>
                      <Row>
                        <Col md={3} className="sticky-top">
                          <Sidebar
                            setTournamentTitle={setTournamentTitle}
                            activeItemId={activeItemId}
                            setActiveItemId={setActiveItemId}
                            items={items}
                            setItems={setItems}
                            newTournament={newTournament}
                            setNewTournament={setNewTournament}
                            Tournament={Tournament}
                            toHome={toHome}
                            setGroups={setGroups}
                            setPlayoff={setPlayoff}
                            setMatches={setMatches}
                            phase={phase}
                            setTournamentNotStarted={setTournamentNotStarted}
                            setActiveTournament={setActiveTournament}
                          />
                        </Col>
                        <Col md={9}>
                          <Homepage
                            showCreateToast={showCreateToast}
                            onCloseCreateToast={onCloseCreateToast}
                            showDeleteToast={showDeleteToast}
                            onCloseDeleteToast={onCloseDeleteToast}
                            showUpdateToast={showUpdateToast}
                            onCloseUpdateToast={onCloseUpdateToast}
                            showStartToast={showStartToast}
                            onCloseStartToast={onCloseStartToast}
                          />
                          <DeleteModal 
                            show={showDeleteModal} 
                            setShowDeleteModal={setShowDeleteModal} 
                            deleteTournament={deleteTournament} 
                            activeTournament={activeTournament}/>
                        </Col>
                      </Row>
                    </Container>
                  </>
                );
              }
            }}
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;
