'use-strict'
const db = require('./db.js');
const { response } = require('express');
let PlayOffMatches = require('./PlayOffMatches');

exports.getGroupsComposition = function (name, order){
    return new Promise((resolve, reject)=>{
        const sql = "Select G.Name as 'Group', Te.Name as Team from Teams Te, GroupsComposition GC, Groups G, Tournaments T Where G.Id_Group=GC.'Group' and GC.Team=Te.Id_Team and G.Tournament=T.Id_Tournament and T.Tournament_Name=? and G.Phase_Order=?" //Ricavo Id Torneo"
        db.all(sql, [name, order], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        });
    });
}

exports.getGroups = function (name, order){
    return new Promise((resolve, reject)=>{
        const sql = "Select G.Name as GroupName from Groups G, Tournaments T Where G.Tournament=T.Id_Tournament and T.Tournament_Name=? and G.Phase_Order=?" //Ricavo Id Torneo"
        db.all(sql, [name, order], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        });
    });
}

exports.getMatches = function (filter){
    return new Promise((resolve, reject)=>{
        let sql = "Select Id_Tournament from Tournaments where Tournament_Name=?" //Ricavo Id Torneo"
        db.all(sql, [filter], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                sql= "Select M.Team_1, M.Team_2, M.Time, M.Date from Matches M where M.Tournament=? and M.Phase_Order='1' Order by M.Date"; //Ricavo partite torneo
                db.all(sql, [rows[0].Id_Tournament], (err, rows1)=>{
                    if(err){
                        reject(err);
                    }else{
                        let result = [];
                        rows1.forEach((el)=>{
                            if(el.Team_1!='Team to be defined' && el.Team_1!='Previous Winner' && el.Team_2!='Team to be defined' && el.Team_2!='Previous Winner' && el.Team_1!= null && el.Team_2!= null && el.Team_1 !== ' ' && el.Team_2 !== ' ' && el.Team_1 !== 'Riposo' && el.Team_2 !== 'Riposo'){
                                let obj = {Team_1: el.Team_1, Team_2:el.Team_2, Time:el.Time, Date:el.Date};
                                result.push(obj);
                            }
                        });
                        resolve (result);
                    }
                });
            }          
        });
    });
}

exports.getAllTournaments = function (){
    return new Promise((resolve, reject)=>{
        //Query to obtain groups phases
        let sql = "Select T.Id_Tournament as id, T.Custom as custom, T.Started as started, T.Tournament_Name as title, T.N_Teams as enrolled_teams, P.Phase_Order as phase_number, P.Phase_Type as type, COUNT(G.Id_Group) as groups_number, G.Input_Teams as group_teams, P.AR as home_away From Tournaments T, Phases P, Groups G where T.Id_Tournament = P.Tournament and P.Tournament = G.Tournament and P.Phase_Order=G.Phase_Order and G.Name LIKE 'Group%' Group By G.Tournament, G.Phase_order" 
        db.all(sql, [], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                //Query to obtain championship phases
                let sql = "Select T.Id_Tournament as id, T.Custom as custom, T.Started as started, T.Tournament_Name as title, T.N_Teams as enrolled_teams, P.Phase_Order as phase_number, P.Phase_Type as type, COUNT(G.Id_Group) as groups_number, G.Input_Teams as group_teams, P.AR as home_away From Tournaments T, Phases P, Groups G where T.Id_Tournament = P.Tournament and P.Tournament = G.Tournament and P.Phase_Order=G.Phase_Order and G.Name LIKE 'Championship%' Group By G.Tournament, G.Phase_order";
                db.all(sql, [], (err, rows2)=>{
                    if(err){
                        reject(err);
                    }else{
                        //Query to obtain playOff phases
                        let sql = "Select T.Id_Tournament as id, T.Custom as custom, T.Started as started, T.Tournament_Name as title, T.N_Teams as enrolled_teams, P.Phase_Order as phase_number, P.Phase_Type as type, Pl.Input_Teams as qualified_teams, P.AR as home_away From Tournaments T, Phases P, PlayOff Pl where T.Id_Tournament = P.Tournament and P.Tournament = Pl.Tournament and P.Phase_Order=Pl.Phase_Order" 
                        db.all(sql, [], (err, rows1)=>{
                            if(err){
                                reject(err);
                            }else{
                                let aux={};
                                let tournaments=[];
                                rows.forEach((el)=>{
                                    rows1.push(el);
                                });
                                rows2.forEach((er)=>{
                                    rows1.push(er);
                                });
                                rows1.sort( compare );
                                rows1.forEach((el)=>{
                                    if(el.type=='Groups' || el.type==='Championship'){
                                        aux={id:el.id, title:el.title, enrolled_teams:el.enrolled_teams, custom: el.custom, started: el.started, phases: [
                                            {phase_number:el.phase_number,
                                            structure: {
                                                type:el.type, 
                                                group_teams:el.group_teams,
                                                groups_number:el.groups_number,
                                                home_away:el.home_away
                                            }}
                                        ]}
                                    }
                                    else if(el.type=='Play-off'){
                                        aux={id:el.id, title:el.title, enrolled_teams:el.enrolled_teams, custom: el.custom, started: el.started, phases: [
                                            {phase_number:el.phase_number,
                                            structure: {
                                                type:el.type, 
                                                qualified_teams:el.qualified_teams,
                                                home_away:el.home_away
                                            }}
                                        ]}
                                    }
                                    tournaments.push(aux);
                                });
                                tournaments.sort(compare);
                                const arrayHashmap = tournaments.reduce((obj, item) => {
                                    obj[item.id] ? obj[item.id].phases.push(...item.phases) : (obj[item.id] = { ...item });
                                    return obj;
                                }, {});
                                
                                const mergedArray = Object.values(arrayHashmap); 
                                resolve(mergedArray);
                            }
                        });
                    }
                });
            }
        });
    });
}

function compare( a, b ) {
    if(a.id==b.id){
        if(a.phase_number < b.phase_number)
            return -1;
        if(a.phase_number > b.phase_number)
            return 1; 
    }
    if ( a.id < b.id ){
      return -1;
    }
    if ( a.id > b.id ){
      return 1;
    }
    return 0;
}

function findPower (num) {
    let pos = Math.ceil(Math.log2(num));
    let p = Math.pow(2, pos);

    return p;
}
  
exports.getPlayOff = function (name, order){
    return new Promise((resolve, reject)=>{
        let sql = "Select Id_Tournament from Tournaments where Tournament_Name=?" //Ricavo Id Torneo"
        db.all(sql, [name], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                sql = "Select M.Id_Match, M.Team_1, M.Team_2, M.Level, M.Score1, M.Score2, M.Match, M.Seed1, M.Seed2 from Matches M Where M.Tournament=? and M.Phase_Order=?";
                db.all(sql, [rows[0].Id_Tournament, order], (err, rows1)=>{
                    if(err){
                        reject(err);
                    }else{
                        let result = [];
                        rows1.forEach((el)=>{
                            let obj = new PlayOffMatches(el.Id_Match, el.Level, el.Match, 0, el.Team_1, el.Seed1, 0, el.Team_2, el.Seed2, el.Score1, el.Score2);
                            result.push(obj);
                        });
                        resolve (result);

                    }
                });
            }
        });
    });
}

exports.addTournament = function (body){
    return new Promise((resolve, reject)=>{
        let bol = false;
        let sql = "Insert into Tournaments (N_Teams, Tournament_Name, N_Phases, Started, Custom) values (?, ?, ?, ?, ?)" //Ricavo Id Torneo"
        db.all(sql, [body.enrolled_teams, body.title, body.phases.length, bol, body.custom], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                sql = "Select max(Id_Tournament) as id from Tournaments";
                db.all(sql, [], (err, rows1) => {
                    if(err){
                        reject(err);
                    }
                    else {
                        resolve(rows1[0].id);
                    }
                })
                
            }
        });
    });
}

exports.addPhases = function (body){
    let elements = [];
    let placeholders= [];
    let aux;
    body.phases.forEach((e)=>{elements.push(body.id);elements.push(e.structure.type);elements.push(e.phase_number);elements.push(e.structure.home_away);});
    for(let i=0;i<Object.keys(body.phases).length;i++){
        aux = '(?,?,?,?)'
        placeholders=placeholders.concat(aux);
        if(i!=Object.keys(body.phases).length-1)
            placeholders.concat(',');
    }
    return new Promise((resolve, reject)=>{
        let bol = false;
        let sql = "Insert into Phases (Tournament, Phase_Type, Phase_Order, AR) values "+placeholders; 
        db.all(sql, elements, (err, rows)=>{
            if(err){
                reject(err);
            }else{
                let elementsGroups = [];
                let elementsPlayOff = [];
                let elementsChampionship = [];
                let placeholdersGroups= [];
                let placeholdersPlayOff= [];
                let placeholdersChampionship= [];
                let aux;
                body.phases.forEach((e)=>{
                    if(e.structure.type=="Play-off"){
                        elementsPlayOff.push(e.structure.qualified_teams);elementsPlayOff.push(body.id);elementsPlayOff.push(e.phase_number);
                    }
                    else if(e.structure.type=="Groups"){//Struttura gruppi 
                        let Alphabet =['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                        let groupsName = [];
                        for(let i=0; i < e.structure.groups_number;i++){
                            groupsName.push("Group " + Alphabet[i]);
                        }
                        groupsName.forEach((el)=>{
                            elementsGroups.push(e.structure.group_teams);elementsGroups.push(el);elementsGroups.push(body.id);elementsGroups.push(e.phase_number);
                        });
                    }
                    else if(e.structure.type=="Championship"){
                        elementsChampionship.push(e.structure.group_teams);elementsChampionship.push("Championship");elementsChampionship.push(body.id);elementsChampionship.push(e.phase_number);
                    }
                });
                for(let i=0;i<Object.keys(elementsPlayOff).length/3;i++){
                    aux = '(?,?,?)'
                    placeholdersPlayOff=placeholdersPlayOff.concat(aux);
                    if(i!=Object.keys(elementsPlayOff).length-1)
                        placeholdersPlayOff.concat(',');
                }
                for(let i=0;i<Object.keys(elementsGroups).length/4;i++){
                    aux = '(?,?,?,?)'
                    placeholdersGroups=placeholdersGroups.concat(aux);
                    if(i!=Object.keys(elementsGroups).length-1)
                        placeholdersGroups.concat(',');
                }
                for(let i=0;i<Object.keys(elementsChampionship).length/4;i++){
                    aux = '(?,?,?,?)'
                    placeholdersChampionship=placeholdersChampionship.concat(aux);
                    if(i!=Object.keys(elementsChampionship).length-1)
                        placeholdersChampionship.concat(',');
                }
                if(elementsGroups.length!=0){
                    sql = "Insert into Groups (Input_Teams, Name, Tournament, Phase_Order) values "+placeholdersGroups; //Ricavo Id Torneo"
                    db.all(sql, elementsGroups, (err, rows1)=>{
                        if(err){
                            reject(err);
                        }
                    });

                }
                if(elementsChampionship.length!=0){
                    sql = "Insert into Groups (Input_Teams, Name, Tournament, Phase_Order) values "+placeholdersChampionship; //Ricavo Id Torneo"
                    db.all(sql, elementsChampionship, (err, rows1)=>{
                        if(err){
                            reject(err);
                        }
                    });

                }
                if(elementsPlayOff.length!=0){
                    sql = "Insert into PlayOff (Input_Teams, Tournament, Phase_Order) values "+placeholdersPlayOff; //Ricavo Id Torneo"
                    db.all(sql, elementsPlayOff, (err, rows2)=>{
                        if(err){
                            reject(err);
                        }
                    });
                }
                resolve(rows);
            }
        });
    });
}

exports.getTeams = function (){
    return new Promise((resolve, reject)=>{
        const sql = "Select Name, City from Teams Where Id_Team!='17'";
        db.all(sql, [], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                let body = [];
                let aux;
                rows.forEach((er)=>{
                    aux={name:er.Name, city:er.City};
                    body.push(aux);
                });
                resolve(body);
            }
        });
    });
}

exports.addTeam = function (body){
    return new Promise((resolve, reject)=>{
        const sql = "INSERT into TEAMS (Name, City) values (?,?)";
        db.all(sql, [body.name, body.city], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                resolve (null);
            }
        });
    });
}

exports.startTournament = function (body){
    return new Promise((resolve, reject)=>{
        let results=[];
        let sql = "Select * from teams";
        db.all(sql, [], (err, rows)=>{
            if(err){
                reject(err);
            }else{
                let Ids=[];
                body.teams.forEach((el)=>{
                    rows.find((res)=>{if(res.Name == el){Ids.push(res.Id_Team); return res.Id_Team}});
                });
                let manageGroups = [];
                let aux1=[];
                let elementsGroups = [];
                if(body.phases[0].structure.type=='Groups'){//Prima fase a gruppi
                    let teams = Ids;
                    //Selezionare i gruppi creati del torneo
                    sql = "Select Id_Group from Groups where Tournament=? and Phase_Order=?";
                    db.all(sql, [body.id, body.phases[0].phase_number], (err, rows1)=>{
                        if(err){
                            reject(err);
                        }else{
                            let groups=rows1;
                            //Inserire le squadre in quei gruppi
                            for(let i = 0; i<body.phases[0].structure.groups_number;i++){
                                for(let j=0; j<body.phases[0].structure.group_teams;j++){
                                    let item1 = Math.floor(Math.random() * teams.length);
                                    let team = teams[item1];
                                    teams.splice(item1,1);
                                    elementsGroups.push(team, groups[i].Id_Group);
                                    aux1.push(team);
                                }
                                manageGroups.push(aux1);
                                aux1=[];
                                //groups[i]--->Id gruppo estratto dal db, viene cambiato ogni volta si esce dal primo for
                            }
                            //Insert into GroupsComposition di elementsGroups
                            let aux= {};
                            let placeholdersGroups=[];
                            for(let i=0;i<Object.keys(elementsGroups).length/2;i++){
                                aux = '(?,?)'
                                placeholdersGroups=placeholdersGroups.concat(aux);
                                if(i!=Object.keys(elementsGroups).length-1)
                                    placeholdersGroups.concat(',');
                            }
                            sql = "Insert into GroupsComposition (Team, 'Group') values " +placeholdersGroups; //Ricavo Id Torneo"
                            db.all(sql, elementsGroups, (err, rows2)=>{
                                if(err){
                                    reject(err);
                                }
                            });
                            //Insert into Matches
                            let manageGroups2 = [];
                            let aux2=[];
                            manageGroups.forEach((temp)=>{
                                temp.forEach((out)=>{
                                    rows.find((res)=>{if(res.Id_Team == out){aux2.push(res.Name); return res.Name}});
                                });
                                manageGroups2.push(aux2);
                                aux2=[];
                            });
                            //Managesgroups2 contiene i gironi con i nomi delle squadre
                            //HERE
                            //Controllo se ci sono gironi con squadre dispari
                            manageGroups2.forEach((gruppo)=>{
                                (gruppo.length % 2 ) && gruppo.push('Riposo');
                                for (let i = 0; i < gruppo.length - 1; i++) {
                                    //i+1 numero giornata
                                    for (let j = 0; j < gruppo.length/2 ; j++) {
                                        results.push({"Team_1":`${gruppo[gruppo.length -j -1]}`, "Team_2":`${gruppo[j]}`, "Giornata": `${i+1}`});
                                    }
                                    gruppo.splice(1,0,gruppo.pop());
                                }
                            });
                            /*manageGroups2.forEach((temp)=>{
                                for (let i = 0; i < temp.length - 1; i++) {
                                    // This is where you'll capture that last value
                                    for (let j = i + 1; j < temp.length; j++) {
                                        results.push({"Team_1":`${temp[i]}`, "Team_2": `${temp[j]}`});
                                    }
                                }
                            });*/
                            let elements3=[];
                            results.forEach((res)=>{
                                elements3.push(res.Team_1, res.Team_2, res.Giornata, "19.00", body.id, 1);
                            });
                            let lunghezza = elements3.length;
                            let elelementsDef=[];
                            let last=0;
                            if(lunghezza>996){
                                while(lunghezza>996){
                                    let prov=[];
                                    last++;
                                    for(let i=0;i<996;i++){
                                        prov.push(elements3[i]);
                                    }
                                    lunghezza=lunghezza-996;
                                    elelementsDef.push(prov);
                                    prov=[];
                                    if(lunghezza<=996){
                                        for(let i=996*last;i<elements3.length;i++){
                                            prov.push(elements3[i]);
                                        }
                                        elelementsDef.push(prov);
                                        lunghezza=0;
                                    }
                                }
                                let placeFinal=[];
                                elelementsDef.forEach((place)=>{
                                    let placeholders2=[];
                                    for(let i=0;i<Object.keys(place).length/6;i++){
                                        placeholders2=placeholders2.concat('(?,?,?,?,?,?)');
                                        if(i!=Object.keys(place).length-1)
                                            placeholders2.concat(',');
                                    }
                                    placeFinal.push(placeholders2);
                                });
                                elelementsDef.map((el, i)=>{
                                    sql = "Insert into Matches (Team_1, Team_2, Date, Time, Tournament, Phase_Order) values " +placeFinal[i]; //Ricavo Id Torneo"
                                    db.all(sql, el, (err, rows3)=>{
                                    if(err){
                                        reject(err);
                                    }
                                    });
                                });
                            }
                            else{
                                let placeholders2=[];
                                for(let i=0;i<Object.keys(elements3).length/6;i++){
                                    placeholders2=placeholders2.concat('(?,?,?,?,?,?)');
                                    if(i!=Object.keys(elements3).length-1)
                                        placeholders2.concat(',');
                                }
                                sql = "Insert into Matches (Team_1, Team_2, Date, Time, Tournament, Phase_Order) values " +placeholders2; //Ricavo Id Torneo"
                                db.all(sql, elements3, (err, rows3)=>{
                                    if(err){
                                        reject(err);
                                    }
                                });
                            }
                        }
                    });
                }
                else if(body.phases[0].structure.type=='Play-off') {//Prima fase playOff

                    //Calculate teams that will play directly in the second round
                    let secondRoundTeams = findPower(body.teams.length) - body.teams.length;

                    //Calculate the number of rounds that will form the tournament
                    let numberOfRounds = Math.ceil(Math.log2(body.teams.length));

                    let seed=1;
                    let elementsPlayOff=[];
                    let teams=body.teams;
                    if(secondRoundTeams!==0){//Number of teams isn't a power of 2
                        for(let i =0; i<secondRoundTeams;i++){
                            teams.push(" ");
                        }
                    }
                    let teamsPerRound = teams.length;
                    for (let i=0; i<numberOfRounds;i++){//Calculation of each round
                        //calculate number of matches that will take place during the round
                        let matchesPerRound = teamsPerRound / 2;

                        //update number of teams that will pass in the next round
                        teamsPerRound = matchesPerRound;

                        for (let j = 0; j < matchesPerRound; j++) { //creation of a match
                            if(i==0){//Primo livello
                                let item1 = Math.floor(Math.random() * teams.length);
                                let team1 = teams[item1];
                                teams.splice(item1,1);
                                let team2;
                                if(team1 === " " ){
                                    team2 = teams[0];
                                    teams.splice(0,1);
                                }
                                else{
                                    let item2 = Math.floor(Math.random() * teams.length);
                                    team2 = teams[item2];
                                    teams.splice(item2,1);
                                }
                                /*while(team1===' '&& team2===' '){
                                    item2 = Math.floor(Math.random() * teams.length);
                                    team2 = teams[item2];
                                }*/
                                elementsPlayOff.push(team1, team2, "2020-12-30", "15.00", i+1, " ", " ", j+1, seed, seed+1, body.id, body.phases[0].phase_number);
                            }else{//Altri livelli
                                elementsPlayOff.push("Previous Winner", "Previous Winner", "2020-12-30", "15.00", i+1, " ", " ", j+1, seed, seed+1, body.id, body.phases[0].phase_number);
                            }
                        }
                    }
                    //Insert into Matches di elementsPlayOff
                    let lunghezza = elementsPlayOff.length;
                            let elelementsDef=[];
                            let last=0;
                            if(lunghezza>996){
                                while(lunghezza>996){
                                    let prov=[];
                                    last++;
                                    for(let i=0;i<996;i++){
                                        prov.push(elementsPlayOff[i]);
                                    }
                                    lunghezza=lunghezza-996;
                                    elelementsDef.push(prov);
                                    prov=[];
                                    if(lunghezza<=996){
                                        for(let i=996*last;i<elementsPlayOff.length;i++){
                                            prov.push(elementsPlayOff[i]);
                                        }
                                        elelementsDef.push(prov);
                                        lunghezza=0;
                                    }
                                }
                                let placeFinal=[];
                                elelementsDef.forEach((place)=>{
                                    let placeholders2=[];
                                    for(let i=0;i<Object.keys(place).length/6;i++){
                                        placeholders2=placeholders2.concat('(?,?,?,?,?,?)');
                                        if(i!=Object.keys(place).length-1)
                                            placeholders2.concat(',');
                                    }
                                    placeFinal.push(placeholders2);
                                });
                                elelementsDef.map((el, i)=>{
                                    sql = "Insert into Matches (Team_1, Team_2, Date, Time, Tournament, Phase_Order) values " +placeFinal[i]; //Ricavo Id Torneo"
                                    db.all(sql, el, (err, rows3)=>{
                                    if(err){
                                        reject(err);
                                    }
                                    });
                                });
                            }
                    else{
                        let placeholders3=[];
                        for(let i=0;i<Object.keys(elementsPlayOff).length/12;i++){
                            placeholders3=placeholders3.concat('(?,?,?,?,?,?,?,?,?,?,?,?)');
                            if(i!=Object.keys(elementsPlayOff).length-1)
                                placeholders3.concat(',');
                        }
                        sql = "Insert into Matches (Team_1, Team_2, Date, Time, Level, Score1, Score2, Match, Seed1, Seed2, Tournament, Phase_Order) values " +placeholders3; //Ricavo Id Torneo"
                        db.all(sql, elementsPlayOff, (err, rows3)=>{
                            if(err){
                                reject(err);
                            }
                        });
                    }
                }
                else if(body.phases[0].structure.type=='Championship'){
                    let teams = Ids;
                    //Selezionare i gruppi creati del torneo
                    sql = "Select Id_Group from Groups where Tournament=? and Phase_Order=?";
                    db.all(sql, [body.id, body.phases[0].phase_number], (err, rows1)=>{
                        if(err){
                            reject(err);
                        }else{
                            let groups=rows1;
                            //Inserire le squadre in quei gruppi
                            for(let i = 0; i<body.phases[0].structure.groups_number;i++){
                                for(let j=0; j<body.phases[0].structure.group_teams;j++){
                                    let item1 = Math.floor(Math.random() * teams.length);
                                    let team = teams[item1];
                                    teams.splice(item1,1);
                                    elementsGroups.push(team, groups[i].Id_Group);
                                    aux1.push(team);
                                }
                                manageGroups.push(aux1);
                                aux1=[];
                                //groups[i]--->Id gruppo estratto dal db, viene cambiato ogni volta si esce dal primo for
                            }
                            //Insert into GroupsComposition di elementsGroups
                            let aux= {};
                            let placeholdersGroups=[];
                            for(let i=0;i<Object.keys(elementsGroups).length/2;i++){
                                aux = '(?,?)'
                                placeholdersGroups=placeholdersGroups.concat(aux);
                                if(i!=Object.keys(elementsGroups).length-1)
                                    placeholdersGroups.concat(',');
                            }
                            sql = "Insert into GroupsComposition (Team, 'Group') values " +placeholdersGroups; //Ricavo Id Torneo"
                            db.all(sql, elementsGroups, (err, rows2)=>{
                                if(err){
                                    reject(err);
                                }
                            });
                            //Insert into Matches
                            let manageGroups3 = [];
                            let aux3=[];

                            manageGroups.forEach((temp)=>{
                                temp.forEach((out)=>{
                                    rows.find((res)=>{if(res.Id_Team == out){aux3.push(res.Name); return res.Name}});
                                });
                                manageGroups3.push(aux3);
                                aux2=[];
                            });
                            //Here
                            //Managesgroups3 contiene i gironi con i nomi delle squadre
                            let results1=[];

                            manageGroups3.forEach((gruppo)=>{
                                (gruppo.length % 2 ) && gruppo.push('Riposo');
                                for (let i = 0; i < gruppo.length - 1; i++) {
                                    //i+1 numero giornata
                                    for (let j = 0; j < gruppo.length/2 ; j++) {
                                        results1.push({"Team_1":`${gruppo[gruppo.length -j -1]}`, "Team_2":`${gruppo[j]}`, "Giornata": `${i+1}`});
                                    }
                                    gruppo.splice(1,0,gruppo.pop());
                                }
                            });

                            /*manageGroups3.forEach((temp)=>{
                                for (let i = 0; i < temp.length - 1; i++) {
                                    // This is where you'll capture that last value
                                    for (let j = i + 1; j < temp.length; j++) {
                                        results1.push({"Team_1":`${temp[i]}`, "Team_2": `${temp[j]}`});
                                    }
                                }
                            });*/ 
                            
                            let elements4=[];
                            results1.forEach((res)=>{
                                elements4.push(res.Team_1, res.Team_2, res.Giornata, "17.00", body.id, 1);
                            });
                            let lunghezza = elements4.length;
                            let elelementsDef=[];
                            let last=0;
                            if(lunghezza>996){
                                while(lunghezza>996){
                                    let prov=[];
                                    last++;
                                    for(let i=0;i<996;i++){
                                        prov.push(elements4[i]);
                                    }
                                    lunghezza=lunghezza-996;
                                    elelementsDef.push(prov);
                                    prov=[];
                                    if(lunghezza<=996){
                                        for(let i=996*last;i<elements4.length;i++){
                                            prov.push(elements4[i]);
                                        }
                                        elelementsDef.push(prov);
                                        lunghezza=0;
                                    }
                                }
                                let placeFinal=[];
                                elelementsDef.forEach((place)=>{
                                    let placeholders2=[];
                                    for(let i=0;i<Object.keys(place).length/6;i++){
                                        placeholders2=placeholders2.concat('(?,?,?,?,?,?)');
                                        if(i!=Object.keys(place).length-1)
                                            placeholders2.concat(',');
                                    }
                                    placeFinal.push(placeholders2);
                                });
                                elelementsDef.map((el, i)=>{
                                    sql = "Insert into Matches (Team_1, Team_2, Date, Time, Tournament, Phase_Order) values " +placeFinal[i]; //Ricavo Id Torneo"
                                    db.all(sql, el, (err, rows3)=>{
                                    if(err){
                                        reject(err);
                                    }
                                    });
                                });
                            }
                            else{
                                let placeholders2=[];
                                for(let i=0;i<Object.keys(elements4).length/6;i++){
                                    placeholders2=placeholders2.concat('(?,?,?,?,?,?)');
                                    if(i!=Object.keys(elements4).length-1)
                                        placeholders2.concat(',');
                                }
                                sql = "Insert into Matches (Team_1, Team_2, Date, Time, Tournament, Phase_Order) values " +placeholders2; //Ricavo Id Torneo"
                                db.all(sql, elements4, (err, rows3)=>{
                                    if(err){
                                        reject(err);
                                    }
                                });
                            }
                        }
                    });
                }

//-----------------------SECONDE FASI----------------------------------------------
                if(body.phases.length>0){//C'è più di una fase parto da i=1 perchè escludo la prima fase
                    for (let i=1; i<body.phases.length;i++){
                        let current = body.phases[i];
                        if(current.structure.type=='Groups'){
                            sql = "Select Id_Group from Groups where Tournament=? and Phase_Order=?";
                            db.all(sql, [body.id, current.phase_number], (err, rows1)=>{
                                if(err){
                                    reject(err);
                                }else{
                                    elementsGroups = [];
                                    let groups=rows1;
                                    //Inserire le squadre in quei gruppi
                                    for(let i = 0; i<current.structure.groups_number;i++){
                                        for(let j=0; j<current.structure.group_teams;j++){
                                            elementsGroups.push("17", groups[i].Id_Group);
                                        }
                                        //groups[i]--->Id gruppo estratto dal db, viene cambiato ogni volta si esce dal primo for
                                    }
                                    //Insert into GroupsComposition di elementsGroups
                                    let aux5= {};
                                    let placeholdersGroups5=[];
                                    for(let i=0;i<Object.keys(elementsGroups).length/2;i++){
                                        aux5 = '(?,?)'
                                        placeholdersGroups5=placeholdersGroups5.concat(aux5);
                                        if(i!=Object.keys(elementsGroups).length-1)
                                            placeholdersGroups5.concat(',');
                                    }
                                    sql = "Insert into GroupsComposition (Team,'Group') values " +placeholdersGroups5; //Ricavo Id Torneo"
                                    db.all(sql, elementsGroups, (err, rows2)=>{
                                        if(err){
                                            reject(err);
                                        }
                                    });
                                }
                            });
                        }
                        else if(current.structure.type=='Championship'){
                            sql = "Select Id_Group from Groups where Tournament=? and Phase_Order=?";
                            db.all(sql, [body.id, current.phase_number], (err, rows1)=>{
                                if(err){
                                    reject(err);
                                }else{
                                    elementsGroups = [];
                                    let groups=rows1;
                                    //Inserire le squadre in quei gruppi
                                    for(let i = 0; i<current.structure.groups_number;i++){
                                        for(let j=0; j<current.structure.group_teams;j++){
                                            elementsGroups.push("17", groups[i].Id_Group);
                                        }
                                        //groups[i]--->Id gruppo estratto dal db, viene cambiato ogni volta si esce dal primo for
                                    }
                                    //Insert into GroupsComposition di elementsGroups
                                    let aux5= {};
                                    let placeholdersGroups5=[];
                                    for(let i=0;i<Object.keys(elementsGroups).length/2;i++){
                                        aux5 = '(?,?)'
                                        placeholdersGroups5=placeholdersGroups5.concat(aux5);
                                        if(i!=Object.keys(elementsGroups).length-1)
                                            placeholdersGroups5.concat(',');
                                    }
                                    sql = "Insert into GroupsComposition (Team,'Group') values " +placeholdersGroups5; //Ricavo Id Torneo"
                                    db.all(sql, elementsGroups, (err, rows2)=>{
                                        if(err){
                                            reject(err);
                                        }
                                    });
                                }
                            });
                        }
                        else if(current.structure.type=='Play-off'){
                            //Calculate teams that will play directly in the second round
                            let secondRoundTeams = findPower(current.structure.qualified_teams) - current.structure.qualified_teams;

                            //Calculate the number of rounds that will form the tournament
                            let numberOfRounds = Math.ceil(Math.log2(current.structure.qualified_teams));

                            let seed=1;
                            let elementsPlayOff=[];
                            let teams=[];
                            for(let i=0;i<current.structure.qualified_teams;i++){
                                teams.push("Team to be defined");
                            }
                            if(secondRoundTeams!==0){//Number of teams isn't a power of 2
                                for(let i =0; i<secondRoundTeams;i++){
                                    teams.push(" ");
                                }
                            }
                            let teamsPerRound = teams.length;
                            for (let i=0; i<numberOfRounds;i++){//Calculation of each round
                                //calculate number of matches that will take place during the round
                                let matchesPerRound = teamsPerRound / 2;

                                //update number of teams that will pass in the next round
                                teamsPerRound = matchesPerRound;

                                for (let j = 0; j < matchesPerRound; j++) { //creation of a match
                                    if(i==0){//Primo livello
                                        let item1 = Math.floor(Math.random() * teams.length);
                                        let team1 = teams[item1];
                                        teams.splice(item1,1);
                                        let team2;
                                        if(team1 === " " ){
                                            team2 = teams[0];
                                            teams.splice(0,1);
                                        }
                                        else{
                                            let item2 = Math.floor(Math.random() * teams.length);
                                            team2 = teams[item2];
                                            teams.splice(item2,1);
                                        }
                                        /*while(team1===' '&& team2===' '){
                                            item2 = Math.floor(Math.random() * teams.length);
                                            team2 = teams[item2];
                                        }*/
                                        
                                        elementsPlayOff.push(team1, team2, "2020-12-30", "15.00", i+1, " ", " ", j+1, seed, seed+1, body.id, current.phase_number);
                                    }else{//Altri livelli
                                        elementsPlayOff.push("Previous Winner", "Previous Winner", "2020-12-30", "15.00", i+1, " ", " ", j+1, seed, seed+1, body.id, current.phase_number);
                                    }
                                }
                            }
                            //Insert into Matches di elementsPlayOff
                            let placeholders3=[];
                            for(let i=0;i<Object.keys(elementsPlayOff).length/12;i++){
                                placeholders3=placeholders3.concat('(?,?,?,?,?,?,?,?,?,?,?,?)');
                                if(i!=Object.keys(elementsPlayOff).length-1)
                                    placeholders3.concat(',');
                            }
                            sql = "Insert into Matches (Team_1, Team_2, Date, Time, Level, Score1, Score2, Match, Seed1, Seed2, Tournament, Phase_Order) values " +placeholders3; //Ricavo Id Torneo"
                            db.all(sql, elementsPlayOff, (err, rows4)=>{
                                if(err){
                                    reject(err);
                                }
                            });
                        }
                    }
                }
                //Update flag start tournament
                let value = true;
                sql = 'UPDATE Tournaments SET Started=? Where Tournaments.Id_Tournament=?';
                db.run(sql, [value, body.id], function (err) {
                if (err) {
                    reject(err);
                }
                });
                resolve(rows);
            }
        });
    });
}


exports.deleteTournament = function (tour){
    return new Promise((resolve, reject)=>{
        let sql = 'PRAGMA foreign_keys = ON;';
        db.all(sql, [], (err,rows)=>{
            if(err){
                reject(err); 
            }else{
                sql='DELETE FROM Tournaments WHERE Tournaments.Id_Tournament = ?';
                db.all(sql, [tour], (err,rows)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(rows);
                        }
                });
            }
        });
    });
}

exports.updateName = function (body){
    return new Promise((resolve, reject)=>{
        const sql = 'UPDATE Tournaments SET Tournament_Name=? Where Tournaments.Id_Tournament=?';
        db.all(sql, [body.title, body.id], (err,rows)=>{
            if(err){
                reject(err);
            }else{
                  resolve(rows);
                }
        });
    });
}