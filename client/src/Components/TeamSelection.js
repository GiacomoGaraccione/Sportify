import '../Css files/TeamSelection.css';
import '../Css files/CustomSetup.css';

import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import Col from 'react-bootstrap/Col'

import API from '../Api.js';
import RecapModal from "./RecapModal.js";
import Loading from "./Loading.js";

function TeamSelection(props) {
    let { tournament, soundError } = props;
    let [totalTeams, setTotalTeams] = useState([]);
    let [actualTeams, setActualTeams] = useState([]);
    let [submitDisable, setSubmitDisable] = useState(true);
    let [countSelectedTeams, setCountSelectedTeams] = useState(0);
    let [team, setTeam] = useState("");
    let [submitAddTeamDisable, setSubmitAddTeamDisable] = useState(true);
    let [formOpacity, setFormOpacity] = useState(true);
    let [search, setSearch] = useState("");
    let [place, setPlace] = useState({});
    let [city, setCity] = useState("Caltanissetta");
    let [loading, setLoading] = useState(true);
    let [showRecapModal, setShowRecapModal] = useState(false);
    let [selectedTeams, setSelectedTeams] = useState([]);
    let [msg, setMsg] = useState("");

    const cities = [
        { name: "Caltanissetta", latitude: 37.4888, longitude: 14.0458 },
        { name: "Catania", latitude: 37.5013, longitude: 15.0742 },
        { name: "Torino", latitude: 45.0705, longitude: 7.6868 },
        { name: "Savona", latitude: 44.3091, longitude: 8.4772 },
        { name: "Riesi", latitude: 37.2808, longitude: 14.0832 },
        { name: "Cagliari", latitude: 39.2278, longitude: 9.1111 },
        { name: "Roma", latitude: 41.9028, longitude: 12.4964 },
        { name: "Milano", latitude: 45.4647, longitude: 9.1885 },
        { name: "Firenze", latitude: 43.7696, longitude: 11.2558 },
        { name: "Bologna", latitude: 44.4990, longitude: 11.3276 },
    ];


    useEffect(() => {
        API.getTeams().then((teams) => {
            props.loadingAudio.play();
            let ts = [...teams];
            for (let i = 0; i < teams.length; i++) {
                ts[i].selected = false;
            }
            setTotalTeams(ts);
            setActualTeams(ts);
            setCountSelectedTeams(0);
            //setto la longitudine e la latitudine
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let pos = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                    setPlace(pos);
                    setLoading(false);
                }, () => {
                    setLoading(false);
                });
            }
            else setLoading(false);
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickTeam = function (id) {
        const index = totalTeams.findIndex((t) => t.name === actualTeams[id].name);
        let sts = [...totalTeams];
        if (sts[index].selected) {   //it was first selected; now, it has been deselected
            sts[index].selected = false;
            let c = countSelectedTeams - 1;
            setCountSelectedTeams(c);
            if (c === tournament.enrolled_teams && submitDisable) {
                setSubmitDisable(false);
                let sel_rev = document.getElementById("sel_rev");
                sel_rev.classList.remove("red");
                sel_rev.classList.add("green");
            }
            else if (c !== tournament.enrolled_teams && !submitDisable) {
                setSubmitDisable(true);
                let sel_rev = document.getElementById("sel_rev");
                sel_rev.classList.remove("green");
            }
        }
        else {
            sts[index].selected = true;
            let c = countSelectedTeams + 1;
            setCountSelectedTeams(c);
            if (c === tournament.enrolled_teams && submitDisable) {
                setSubmitDisable(false);
                let sel_rev = document.getElementById("sel_rev");
                sel_rev.classList.add("green");
            }
            else if (c !== tournament.enrolled_teams && !submitDisable) {
                setSubmitDisable(true);
                let sel_rev = document.getElementById("sel_rev");
                sel_rev.classList.add("red");
                sel_rev.classList.remove("green");
            }
        }
        setTotalTeams(sts);
    }

    const onClickAddTeam = function () {
        if (formOpacity) setFormOpacity(false);
        else setFormOpacity(true);
    }

    const handleSubmit = function (event) {
        event.preventDefault();
        let myArray = [];

        totalTeams.forEach(element => {
            if (element.selected)
                myArray.push(element.name)
        });
        setSelectedTeams(myArray);
        setShowRecapModal(true)
        //props.startTournament(myArray);
    }

    const onClickCloseRecap = function () {
        setShowRecapModal(false);
    }

    const onClickSaveRecap = function () {
        setShowRecapModal(false);
        props.startTournament(selectedTeams)
    }

    const handleBack = function (event) {
        event.preventDefault();
        props.setTeamSelection(false);
    }

    const onChangeTeam = function (event) {
        setTeam(event.target.value);
        if(totalTeams.find((t) => t.name.toLowerCase() === event.target.value.toLowerCase()) || !event.target.value){
            const add = document.getElementById("team_name");
            add.classList.add("red-border");
            if(!event.target.value) setMsg("Choose a valid team name.");
            else setMsg("Team name already exists.");
        }
        else{
            setMsg("");
            const add = document.getElementById("team_name");
            add.classList.remove("red-border");
        }
        if (!totalTeams.find((t) => t.name.toLowerCase() === event.target.value.toLowerCase()) && event.target.value && submitAddTeamDisable) setSubmitAddTeamDisable(false);
        else if ((!event.target.value || totalTeams.find((t) => t.name.toLowerCase() === event.target.value.toLowerCase())) && !submitAddTeamDisable) setSubmitAddTeamDisable(true);
    }

    const handleAddTeam = function (event) {
        event.preventDefault();
        if(!submitAddTeamDisable){
            const add = document.getElementById("team_name");
            add.classList.remove("red-border");
            const t = { name: team, city: city };
            API.addTeam(t).then(() => {
                const actual_team = { name: team, city: city, selected: true };
                const tts = [actual_team, ...totalTeams];
                setTotalTeams(tts);
                const actual_tts = tts.filter((t) => {
                    if (t.name.toLowerCase().includes(search.toLowerCase())) return true;
                    else return false;
                });
                setActualTeams(actual_tts);
                let c = countSelectedTeams + 1;
                setCountSelectedTeams(c);
                if (c === tournament.enrolled_teams && submitDisable) {
                    setSubmitDisable(false);
                    let sel_rev = document.getElementById("sel_rev");
                    sel_rev.classList.add("green");
                }
                else if (c !== tournament.enrolled_teams && !submitDisable) {
                    setSubmitDisable(true);
                    let sel_rev = document.getElementById("sel_rev");
                    sel_rev.classList.add("red");
                    sel_rev.classList.remove("green");
                }
                setFormOpacity(true);
            });
        }
        else{
            soundError.play();
            const add = document.getElementById("team_name");
            add.classList.add("red-border");
            if(!team) setMsg("Choose a valid team name.");
            else setMsg("Team name already exists.");
        }
    }

    const onChangeSearch = function (event) {
        setSearch(event.target.value);
        let tts = [...totalTeams];
        const actual_tts = tts.filter((t) => {
            if (t.name.toLowerCase().includes(event.target.value.toLowerCase())) return true;
            else return false;
        });
        setActualTeams(actual_tts);
    }

    const onChangecity = function (event) {
        setCity(event.target.value);
    }

    function getDistanceFromLatLng(lat1, lng1, lat2, lng2, miles) { // miles optional
        if (typeof miles === "undefined") { miles = false; }
        let la1 = lat1 * 111.17;
        let ln1 = lng1 * 111.17;
        let la2 = lat2 * 111.17;
        let ln2 = lng2 * 111.17;
        let d = Math.sqrt(Math.pow(la1 - la2, 2) + Math.pow(ln1 - ln2, 2));
        if (miles) d = d * 0.621371;
        d = d.toFixed(2);
        return d;
    }

    return <>
        <div id="team-selection-layout">
            {loading && <Loading msg="Calculating distances..."/>}
            {!loading && <>
                {tournament && <>
                    <div className="title">
                        Select teams
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16" onClick={() => onClickAddTeam()}>
                            <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                    </div>
                    {!formOpacity &&
                        <Form method="POST" id="add_team">
                            <Form.Row>
                                <Col>
                                    <FormGroup controlId="team_city">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control className="control" as="select" type="city" name="city" value={city} onChange={(event) => onChangecity(event)} required>
                                            {cities.map((c, i) => <option key={i}>{c.name}</option>)}
                                        </Form.Control>
                                    </FormGroup>
                                    <FormGroup controlId="team_name">
                                        <Form.Label>Team name</Form.Label>
                                        <Form.Control className="control" type="text" name="add_team" placeholder="Add a new team" value={team} onChange={(event) => onChangeTeam(event)} autoFocus />
                                        {msg &&
                                            <div className="red">{msg}</div>
                                        }
                                    </FormGroup>
                                </Col>
                                <Col xs={4}>
                                    <Button className="submit" variant="success" type="submit" onClick={(event) => handleAddTeam(event)}>Add</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    }
                    <Form method="POST" id="search">
                        <Form.Control className="control" type="text" name="add_team" placeholder="Search" value={search} onChange={(event) => onChangeSearch(event)} autoFocus />
                    </Form>
                    <Table>
                        <tbody>
                            {actualTeams && !place.latitude &&
                                actualTeams.map((t, i) => {
                                    return <tr key={i} onClick={() => onClickTeam(i)}>
                                        <td> <div className="team">{t.name}</div>
                                            {t.selected &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                                </svg>
                                            }
                                        </td>
                                    </tr>
                                })
                            }
                            {actualTeams && place.latitude &&
                                actualTeams.sort((first, second) => {
                                    let c1 = cities.find((c) => {
                                        return c.name === first.city;
                                    });
                                    let lat1 = c1.latitude;
                                    let lng1 = c1.longitude;
                                    let c2 = cities.find((c) => {
                                        return c.name === second.city;
                                    });
                                    let lat2 = c2.latitude;
                                    let lng2 = c2.longitude
                                    const distanceFirst = getDistanceFromLatLng(lat1, lng1, place.latitude, place.longitude, true);
                                    const distanceSecond = getDistanceFromLatLng(lat2, lng2, place.latitude, place.longitude, true);
                                    return distanceFirst - distanceSecond;
                                })
                                    .map((t, i) => {
                                        let ci = cities.find((c) => {
                                            return c.name === t.city;
                                        });
                                        let lat = ci.latitude;
                                        let lng = ci.longitude
                                        return <tr key={i} onClick={() => onClickTeam(i)}>
                                            <td><div className="team">{t.name} <div className="distance">{getDistanceFromLatLng(lat, lng, place.latitude, place.longitude, true)}km</div></div>
                                                {t.selected &&
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" />
                                                    </svg>
                                                }
                                            </td>
                                        </tr>
                                    })
                            }
                            {!actualTeams[0] &&
                                <tr><td>No team found</td></tr>
                            }
                        </tbody>
                    </Table>
                    <div style={{
                        position: "fixed",
                        bottom: "-50px",
                        backgroundColor: "white",
                        width: "75vw"
                    }}>
                        <Form method="POST">
                            <FormGroup className="f-group-submit" controlId={"submit"}>
                                <Button className="control" variant="danger" type="back" onClick={(event) => handleBack(event)}>Cancel</Button>
                                <div id="sel_rev">You selected {countSelectedTeams}/{tournament.enrolled_teams} teams</div>
                                <Button className="control" variant="success" type="submit" onClick={(event) => handleSubmit(event)} disabled={submitDisable}>Save</Button>
                            </FormGroup>
                        </Form>
                    </div>
                    <RecapModal showRecapModal={showRecapModal} teams={selectedTeams} onClickClose={onClickCloseRecap} onClickSave={onClickSaveRecap}></RecapModal>
                </>
                }
            </>
            }
        </div>
    </>
}


export { TeamSelection };