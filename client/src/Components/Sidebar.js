import React from 'react';

/************ REACT BOOTSTRAP ************/
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row'

/************ SIDEBAR ************/
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

/************ ICONS ************/
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import logo from '../Images/Sportify.png'

function Sidebar(props) {
  const onClickSidenav = function(){
    setTimeout(() => {
      let dels = document.getElementsByClassName("side-navigation-panel-select-inner-option hover:bg-gray-100 hover:text-gray-800 hover:border-pink-500 block px-16 py-2 text-sm text-gray-700 border-l-2 cursor-pointer");
      for (let i = 0; i < dels.length; i++) {
        if (dels[i].textContent === "Delete Tournament") {
          dels[i].classList.add("red");
          break;
        }
      }
    }, 5);
  }

  if(!props.newTournament){
    return(
      <>
      <Container fluid>
        <Row style={{height: '30%'}}>
          <img onClick={() => props.toHome()} src={logo} alt='not found' style={{cursor: 'pointer'}} />
        </Row>
      </Container>
      <div className='sidenav' onClick={() => onClickSidenav()}>
      <Navigation
        activeItemId={props.activeItemId}
        // you can use your own router's api to get pathname
        //activeItemId="/management/members"
        items={props.items}
        onSelect={({itemId}) => {
          props.setActiveTournament(itemId[2]);
          props.setTournamentTitle(itemId[2].title);
          props.phase(itemId[1].tournamentTitle, itemId[1].phaseNumber, itemId[1].phaseType);
          props.setActiveItemId(itemId);
        }}
      /> 
      </div>
      <div>
      <button
      className="btn-menu plusIcon"
      onClick={() => props.Tournament()}
      type="button"
      >
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </button> 
      </div>
      </>
    );
  }

  else {
    return(
      <>
      <Container fluid>
        <Row>
         <img onClick={() => props.toHome()} src={logo} alt='not found' style={{cursor: 'pointer' }}/>
        </Row>
      </Container>
      
      <div className='sidenav' onClick={() => onClickSidenav()}>
      <Navigation
        // you can use your own router's api to get pathname
        //activeItemId="/management/members"
        onSelect={({itemId}) => {
          if(itemId !== "/newTournament"){
            props.setActiveTournament(itemId[2]);
            props.phase(itemId[1].tournamentTitle, itemId[1].phaseNumber, itemId[1].phaseType);
            props.setTournamentTitle(itemId[0]);
            props.setActiveItemId(itemId);
          }
        }}
        items={props.items}
      /> 
      </div>
      
      </>
    ) ;
  }
}

export {Sidebar};