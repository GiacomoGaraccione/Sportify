import '../Css files/CustomSetup.css';

import React, { useState, useEffect } from 'react';
import { Row, Col, Carousel } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import Switch from "react-switch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faQuestionCircle, } from '@fortawesome/free-solid-svg-icons'


import { OrizontalLine } from './OrizontalLine.js';
import PlayOff from "../Images/NewTourn.png";
import Championship from "../Images/custom_championship.png";
import Groups from "../Images/custom_groups.png";
import ConfirmModal from "./ConfirmModal.js";
import AssistModal from "./AssistModal.js";

function CustomSetup(props) {
    let { tournament, tournaments} = props;

    let [numPhases, setNumPhases] = useState(0);
    let [phases, setPhases] = useState([]);
    let [submitted, setSubmitted] = useState(false);
    let [submitDisable, setSubmitDisable] = useState(true);
    let [assistMode, setAssistMode] = useState("");
    let [showHelpModal, setShowHelpModal] = useState(false);
    const [title, setTitle] = useState("")
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [totalTeams, setTotalTeams] = useState(0);
    const [statePhases, setStatePhases] = useState([]);
    const [validated, setValidated]=useState('');

    useEffect(() => {
        if (tournament.phases) {
            setNumPhases(tournament.phases.length);
            let phs = [...tournament.phases];
            for(let i = 0; i < phs.length; i++){
                if(phs[i].structure.type === "Championship"){
                    phs[i].structure.qualified_teams = phs[i].structure.group_teams;
                    phs[i].structure.group_teams = 3;
                    phs[i].structure.groups_number = 2;
                }
            }
            setPhases(phs);
            setTitle(tournament.title);
            props.setTournamentTitle(props.tournament.title);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tournament]);

    useEffect(() => {

        if (tournament.phases) {
            setNumPhases(tournament.phases.length);
            let phs = [...tournament.phases];
            setPhases(phs);
            setTitle(tournament.title);
            props.setTournamentTitle(props.tournament.title);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tournament]);

    useEffect(() => {
        if (numPhases && numPhases < phases.length) {
            let ps = [...phases];
            ps.length = numPhases;
            setPhases(ps);
        }
        else if (numPhases && numPhases > phases.length) {
            let ps = [...phases];
            for (let i = phases.length; i < numPhases; i++) {
                if(statePhases[i]) ps[i] = statePhases[i];
                else{
                    let p = {
                        phase_number: i + 1,
                        structure: {
                            type: "Championship",
                            group_teams: 3,
                            groups_number: 2,
                            qualified_teams: 2,
                            home_away: false
                        },
                    };
                    ps[i] = p;
                }
                
            }
            setPhases(ps);

        }
        else if (!numPhases && phases.length) {
            let ps = [];
            setPhases(ps);
        }
        if(tournament.phases){
            if (numPhases && title) setSubmitDisable(false);
            else setSubmitDisable(true);
        }
        else{
            if (numPhases) setSubmitDisable(false);
            else setSubmitDisable(true);
        } 
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numPhases, phases]);

    useEffect(() => {
        if(phases.length){
            let sp = [...statePhases];
            for(let i = 0; i < phases.length; i++){
                sp[i] = phases[i];
            }
            setStatePhases(sp);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phases]);

    const onChangeNumPhases = function (event) {
        const num = event.target.value[event.target.value.length - 1];
        let actual_num;
        const max = 5;
        const min = 0;
        if (num === "+") {
            if (numPhases < max) actual_num = numPhases + 1;
        }
        else if (num === "-") {
            if (numPhases > min) actual_num = numPhases - 1;
        }
        else if (Number.isInteger(parseInt(num)) && parseInt(num) > 0) {
            if (parseInt(num) < max) actual_num = parseInt(num);
            else actual_num = max;
        }
        else actual_num = min;
        setNumPhases(actual_num);
    }

    const handleSubmit = function (event) {
        if (!tournament.phases) {
            event.preventDefault();
            if (!submitDisable) {
                let et;
                if (phases[0].structure.type !== "Groups") et = phases[0].structure.qualified_teams;
                else et = phases[0].structure.group_teams * phases[0].structure.groups_number;
                setTotalTeams(et);
                for(let i = 0; i < phases.length; i++){
                    if (phases[i].structure.type === "Groups") phases[i].structure.qualified_teams = phases[i].structure.group_teams * phases[i].structure.groups_number;
                }
                setShowSaveModal(true);
            }
        }
        else {
            event.preventDefault();
            let et;
            if (phases[0].structure.type !== "Groups") et = phases[0].structure.qualified_teams;
            else et = phases[0].structure.group_teams * phases[0].structure.groups_number;
            setTotalTeams(et);
            for(let i = 0; i < phases.length; i++){
                if (phases[i].structure.type === "Groups") phases[i].structure.qualified_teams = phases[i].structure.group_teams * phases[i].structure.groups_number;
            }
            setShowSaveModal(true);
        }
    }

    const handleBack = function (event) {
        event.preventDefault();
        props.setCustom(false);
        props.setUpdate(false);
        props.setTournamentTitle('');
        //setSubmitted(true);
    }

    const handleHelp = function (assistMode) {
        setAssistMode(assistMode);
        setShowHelpModal(true);
    }

    const onClickClose = function () {
        setAssistMode("");
        for(let i = 0; i < phases.length; i++){
            if (phases[i].structure.type === "Groups") phases[i].structure.qualified_teams = 2;
        }
        setShowHelpModal(false);
    }

    const onChangeStructure = function (event, id) {
        let p = [...phases];

        if (p[id].structure.type === "Groups" || event.target.value === "Groups") {
            switch (event.target.value) {
                case "Groups":
                    p[id].structure.qualified_teams = 5;
                    const actual_mul = p[id].structure.group_teams * p[id].structure.groups_number;
                    for (let i = id + 1; i < p.length; i++) {
                        switch (p[i].structure.type) {
                            case "Groups":
                                p[i].structure.groups_number = 2;
                                p[i].structure.group_teams = parseInt(actual_mul / 2);
                                break;
                            default:
                                p[i].structure.qualified_teams = actual_mul;
                        }
                    }
                    break;
                default:
                    p[id].structure.groups_number = 2;
                    p[id].structure.group_teams = 3;
                    const actual_qual_t = p[id].structure.qualified_teams;
                    for (let i = id + 1; i < p.length; i++) {
                        switch (p[i].structure.type) {
                            case "Groups":
                                p[i].structure.groups_number = 2;
                                p[i].structure.group_teams = parseInt(actual_qual_t / 2);
                                break;
                            default:
                                p[i].structure.qualified_teams = actual_qual_t;
                        }
                    }
            }
        }
        p[id].structure.type = event.target.value;
        setPhases(p);
    }

    const onChangeGroupsNumber = function (event, id) {
        let p = [...phases];
        if (phases[id - 1]) {
            const old_qual_t = parseInt(phases[id - 1].structure.qualified_teams);
            const old_mul = parseInt(phases[id - 1].structure.group_teams) * parseInt(phases[id - 1].structure.groups_number);
            const actual_mul = parseInt(phases[id].structure.group_teams) * parseInt(event.target.value);
            if (phases[id - 1].structure.type === "Groups" && actual_mul > old_mul) {
                p[id].structure.groups_number = parseInt(old_mul / parseInt(phases[id].structure.group_teams));
            }
            else if (phases[id - 1].structure.type !== "Groups" && actual_mul > old_qual_t) {
                p[id].structure.groups_number = parseInt(old_qual_t / parseInt(phases[id].structure.group_teams));
            }
            else {
                p[id].structure.groups_number = parseInt(event.target.value);
            }
        }
        else {
            p[id].structure.groups_number = parseInt(event.target.value);
        }

        setPhases(p);
    }

    const onChangeGroupTeams = function (event, id) {
        let p = [...phases];

        if (phases[id - 1]) {
            const old_qual_t = parseInt(phases[id - 1].structure.qualified_teams);
            const old_mul = parseInt(phases[id - 1].structure.group_teams) * parseInt(phases[id - 1].structure.groups_number);
            const actual_mul = parseInt(phases[id].structure.groups_number) * parseInt(event.target.value);
            if (phases[id - 1].structure.type === "Groups" && actual_mul > old_mul) {
                p[id].structure.group_teams = parseInt(old_mul / parseInt(phases[id].structure.groups_number));
            }
            else if (phases[id - 1].structure.type !== "Groups" && actual_mul > old_qual_t) {
                p[id].structure.group_teams = parseInt(old_qual_t / parseInt(phases[id].structure.groups_number));
            }
            else {
                p[id].structure.group_teams = parseInt(event.target.value);
            }
        }
        else {
            p[id].structure.group_teams = parseInt(event.target.value);
        }
        setPhases(p);
    }

    const onChangeQualifiedTeams = function (event, id) {
        let p = [...phases];
        if (phases[id - 1]) {
            const old_qual_t = parseInt(phases[id - 1].structure.qualified_teams);
            const old_mul = parseInt(phases[id - 1].structure.group_teams) * parseInt(phases[id - 1].structure.groups_number);
            if (phases[id - 1].structure.type === "Groups" && parseInt(event.target.value) > old_mul) {
                p[id].structure.qualified_teams = old_mul;
            }
            else if (phases[id - 1].structure.type !== "Groups" && parseInt(event.target.value) > old_qual_t) {
                p[id].structure.qualified_teams = old_qual_t;
            }
            else {
                p[id].structure.qualified_teams = parseInt(event.target.value);
            }
        }
        else {
            p[id].structure.qualified_teams = parseInt(event.target.value);
        }
        setPhases(p);
    }

    const onChangeHomeAway = function (checked, event, id) {
        let i = parseInt(id[id.length - 1]);
        let p = [...phases];
        p[i].structure.home_away = checked;
        setPhases(p);
    }

    const onChangeTitle = function (event) {
        setTitle(event.target.value);
        if (
            !event.target.value ||
            (event.target.value.toLowerCase() !== tournament.title.toLowerCase() && tournaments.find((t) => {
              return t.title.toLowerCase() === event.target.value.toLowerCase();
            }))
          ) {
            let dels = document.getElementById("tournament-title-con");
            dels.classList.add("red-border");
            if(!submitDisable)
                setSubmitDisable(true);
            if(!event.target.value){
              setValidated("Choose a valid tournament name.");
            }
            else{
              setValidated("Tournament name already exists.")
            }
          }
          else{
            setValidated("");
            if(submitDisable && numPhases)
                setSubmitDisable(false);
            let dels = document.getElementById("tournament-title-con");
            dels.classList.remove("red-border");
          }
    }

    const onClickCloseSave = function () {
        setShowSaveModal(false);
    }

    const onClickSave = function () {
        setShowSaveModal(false);
        setSubmitted(true);
        if (!tournament.phases) {
            if (!submitDisable) {
                let ts = props.tournaments.length + 1;
                let et;
                if (phases[0].structure.type !== "Groups") et = phases[0].structure.qualified_teams;
                else et = phases[0].structure.group_teams * phases[0].structure.groups_number;
                const t = {
                    id: ts,
                    title: props.tournamentTitle,
                    enrolled_teams: et,
                    started: false,
                    phases: phases,
                    custom: 1
                };
                props.createTournament(t);
                setSubmitted(true);
            }
        }
        else {
            let et;
            if (phases[0].structure.type !== "Groups") et = phases[0].structure.qualified_teams;
            else et = phases[0].structure.group_teams * phases[0].structure.groups_number;

            const t = {
                id: tournament.id,
                title: title,
                enrolled_teams: et,
                started: false,
                phases: phases,
                custom: 1
            };
            props.updateTournament(t);
            setSubmitted(true);
        }
    }

    let up;
    if(!tournament.phases){up=true;}
    else up=false;

    return <>
        {submitted && <Redirect to="/" />}
        {!tournament.phases &&
        <Carousel slide={false}>
        <div className="custom-space"></div>
            <Row
                className="content-groups custom-header"
                style={{ backgroundColor: "#B2E97C", marginTop: "150px", zIndex: "1"}}
            >
                <Col className="bold-text" style={{ padding: "3%" }}>
                {props.tournamentTitle}
                </Col>
            </Row>
        </Carousel>
        }

        <div className={"custom-layout " + (up && "custom-body" )} style={{ padding: '3%'}}>
            <Form method="POST" onSubmit={(event) => handleSubmit(event)} onKeyDown={(event) => event.key !== 'Enter'}>
                {tournament.phases &&
                    <>
                        <FormGroup className="tournament-title" controlId="tournament-title-con">
                            <Form.Control size='lg' type="text" name="tournament-title" value={title} onChange={(event) => onChangeTitle(event)} required />
                        </FormGroup>
                        {validated &&
                        <div className="red">{validated}</div>
                        }
                    </>
                }
                <FormGroup className="f-group" controlId="num-phases">
                    <Form.Label className="subtitle">Number of Phases</Form.Label>
                    <Form.Control className="control" type="num-phases" name="num-phases" value={numPhases} onChange={(event) => onChangeNumPhases(event)} required autoFocus />
                </FormGroup>
                <OrizontalLine />
                {phases.map((phase) => {
                    return <Phase key={phase.phase_number} phase={phase} phases={phases} onChangeStructure={onChangeStructure} onChangeGroupsNumber={onChangeGroupsNumber} onChangeGroupTeams={onChangeGroupTeams} onChangeQualifiedTeams={onChangeQualifiedTeams} onChangeHomeAway={onChangeHomeAway} handleHelp={handleHelp} tournament={tournament}/>
                })}

                <FormGroup className="f-group" controlId="enrolled_teams">
                    <Form.Label className="enrolled_teams">Total enrolled teams</Form.Label>
                    {phases[0] && phases[0].structure.type !== "Groups" &&
                        <Form.Control className="control" type="enrolled_teams" name="enrolled_teams" value={phases[0].structure.qualified_teams} required autoFocus readOnly disabled />
                    }
                    {phases[0] && phases[0].structure.type === "Groups" &&
                        <Form.Control className="control" type="enrolled_teams" name="enrolled_teams" value={phases[0].structure.group_teams * phases[0].structure.groups_number} required autoFocus readOnly disabled />
                    }
                    {!phases[0] &&
                        <Form.Control className="control" type="enrolled_teams" name="enrolled_teams" value="0" required autoFocus readOnly disabled />
                    }
                </FormGroup>


                <div style={{
                        position: "fixed",
                        bottom: "-50px",
                        backgroundColor: "white",
                        width: "61vw"
                    }}>
                    <FormGroup className="f-group-submit" controlId={"submit"}>
                        <Button className="control" variant="danger" type="back" onClick={(event) => handleBack(event)}> <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon> Back </Button>
                        <Button className="control" variant="success" type="submit" onClick={(event) => handleSubmit(event)} disabled={submitDisable}>Save</Button>
                    </FormGroup>
                </div>

            </Form>
            <AssistModal showHelpModal={showHelpModal} mode={assistMode} onClickClose={onClickClose}></AssistModal>

        </div>
        <ConfirmModal showSaveModal={showSaveModal} onClickClose={onClickCloseSave} onClickSave={onClickSave} saved={false} phases={phases} numberOfTeams={totalTeams} checked={phases.length && phases[0].structure.home_away} options={["hello"]} />

    </>
}

function Phase(props) {

    let { phase, phases, onChangeStructure, onChangeGroupsNumber, onChangeGroupTeams, onChangeQualifiedTeams, onChangeHomeAway, handleHelp, tournament } = props;
    let id = phase.phase_number - 1;
    return <>
        {phase && phase.structure && phases[id] && phases[id].structure && <>

            <div className="subtitle">Phase {phase.phase_number}</div>
            <FormGroup className="f-group" controlId={"structure" + id}>
                <Form.Label className="f-label">Structure <FontAwesomeIcon icon={faQuestionCircle} onClick={() => handleHelp("structure")}></FontAwesomeIcon></Form.Label>
                <div className="f-group-structure">
                    {phase.structure.type === "Play-off" &&
                        <img src={PlayOff} alt="Play-off"></img>
                    }
                    {phase.structure.type === "Championship" &&
                        <img src={Championship} alt="Championship"></img>
                    }
                    {phase.structure.type === "Groups" &&
                        <img src={Groups} alt="Groups"></img>
                    }
                    {phase.structure.type === "Groups" &&
                        <Form.Control className="control groups_number" as="select" type="groups_number" name="groups_number" value={phases[id].structure.groups_number} onChange={(event) => onChangeGroupsNumber(event, id)} required>
                            <OptionsGroupsNumber phase={phase} phases={phases} min={2} max={8} />

                        </Form.Control>
                    }
                    <Form.Control className="structure-control" as="select" type="structure" name="structure" value={phases[id].structure.type} onChange={(event) => onChangeStructure(event, id)} required>
                        <option>Play-off</option>
                        <option>Groups</option>
                        <option>Championship</option>
                    </Form.Control>
                </div>
            </FormGroup>

            {phase.structure.type === "Groups" &&
                <FormGroup className="f-group" controlId={"group_teams" + id}>
                    <Form.Label className="f-label">Teams for each group {id === 0 && <FontAwesomeIcon icon={faQuestionCircle} onClick={() => handleHelp("first round group")}></FontAwesomeIcon>}</Form.Label>
                    <Form.Control className="control" as="select" type="group_teams" name="group_teams" value={phases[id].structure.group_teams} onChange={(event) => onChangeGroupTeams(event, id)} required>
                        <OptionsGroupTeams phase={phase} phases={phases} min={3} max={12} />
                    </Form.Control>
                </FormGroup>
            }
            {phase.structure.type !== "Groups" &&
                <FormGroup className="f-group" controlId={"qualified_teams" + id}>
                    {id === 0 &&
                        <Form.Label className="f-label">Number of teams <FontAwesomeIcon icon={faQuestionCircle} onClick={() => handleHelp("number of teams")}></FontAwesomeIcon></Form.Label>
                    }
                    {id !== 0 &&
                        <Form.Label className="f-label">Phase {phase.phase_number} qualified teams <FontAwesomeIcon icon={faQuestionCircle} onClick={() => handleHelp("second phase teams")}></FontAwesomeIcon></Form.Label>
                    }
                    <Form.Control className="control" as="select" type="qualified_teams" name="qualified_teams" value={phases[id].structure.qualified_teams} onChange={(event) => onChangeQualifiedTeams(event, id)} required>
                        <OptionsQualifiedTeams phase={phase} phases={phases} min={2} max={32} />
                    </Form.Control>
                </FormGroup>
            }
            <FormGroup className="f-group" controlId={"home_away" + id}>
                <div className='check'>
                    <label htmlFor='customSwitches'>
                        Home and away games <FontAwesomeIcon icon={faQuestionCircle} onClick={() => handleHelp("home and away")}></FontAwesomeIcon>
                    </label>
                    {!tournament.phases &&
                        <Switch
                            id={'customSwitches' + id}
                            checked={phases[id].structure.home_away}
                            onChange={onChangeHomeAway}
                        />
                    }
                    {tournament.phases && 
                        <Switch
                            id={'customSwitches' + id}
                            checked={phases[id].structure.home_away === 1}
                            onChange={onChangeHomeAway}
                        />
                    }
                </div>
            </FormGroup>
            <OrizontalLine />
        </>
        }
    </>
}

function OptionsGroupsNumber(props) {
    let { phase, phases, min, max } = props;
    let id = phase.phase_number - 1;
    let array = [];
    for (let i = min + 1; i <= max; i++) array[i - min - 1] = i;

    return <>
        <option>{min}</option>

        {array.filter((v) => {
            if (phases[id - 1] && phases[id - 1].structure.type === "Groups" && v <= parseInt(parseInt(phases[id - 1].structure.group_teams * phases[id - 1].structure.groups_number) / phase.structure.group_teams))
                return true;
            else if (phases[id - 1] && phases[id - 1].structure.type !== "Groups" && v <= parseInt(phases[id - 1].structure.qualified_teams / phase.structure.group_teams))
                return true;
            else if (!phases[id - 1])
                return true;
            else return false;
        }).map((v) => <option key={v}>{v}</option>)}
    </>
}

function OptionsGroupTeams(props) {
    let { phase, phases, min, max } = props;
    let id = phase.phase_number - 1;
    let array = [];
    for (let i = min + 1; i <= max; i++) array[i - min - 1] = i;

    return <>
        <option>{min}</option>

        {array.filter((v) => {
            if (phases[id - 1] && phases[id - 1].structure.type === "Groups" && v <= parseInt(parseInt(phases[id - 1].structure.group_teams * phases[id - 1].structure.groups_number) / phase.structure.groups_number))
                return true;
            else if (phases[id - 1] && phases[id - 1].structure.type !== "Groups" && v <= parseInt(phases[id - 1].structure.qualified_teams / phase.structure.groups_number))
                return true;
            else if (!phases[id - 1])
                return true;
            else return false;
        }).map((v) => <option key={v}>{v}</option>)}
    </>
}

function OptionsQualifiedTeams(props) {
    let { phase, phases, min, max } = props;
    let id = phase.phase_number - 1;
    let array = [];
    for (let i = min + 1; i <= max; i++) array[i - min - 1] = i;

    return <>
        <option>{min}</option>

        {array.filter((v) => {
            if (phases[id - 1] && phases[id - 1].structure.type === "Groups" && v <= phases[id - 1].structure.group_teams * phases[id - 1].structure.groups_number)
                return true;
            else if (phases[id - 1] && phases[id - 1].structure.type !== "Groups" && v <= phases[id - 1].structure.qualified_teams)
                return true;
            else if (!phases[id - 1])
                return true;
            else return false;
        }).map((v) => <option key={v}>{v}</option>)}

    </>
}

export { CustomSetup };