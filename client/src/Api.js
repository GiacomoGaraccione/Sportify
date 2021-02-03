const BASEURL = '/api';

async function getMatches(filter) {
    let url = "/matches";
    if (filter) {
        const queryParams = "?filter=" + filter;
        url += queryParams
    }
    const response = await fetch(BASEURL + url);
    const matchesJson = await response.json();
    if (response.ok) {
        return matchesJson;
    } else {
        let err = { status: response.status, errObj: matchesJson };
        throw err; //Oggetto con errore proveniente dal server
    }
}

async function getGroups(name, order) {
    let url = "/groups";
    if (name && order) {
        const queryParams = "?name=" + name + "&order=" + order;
        url += queryParams
    }
    const response = await fetch(BASEURL + url);
    const groupsJson = await response.json();
    if (response.ok) {
        return groupsJson;
    } else {
        let err = { status: response.status, errObj: groupsJson };
        throw err; //Oggetto con errore proveniente dal server
    }
}

async function getGroupsComposition(name, order) {
    let url = "/groupsComposition";
    if (name && order) {
        const queryParams = "?name=" + name + "&order=" + order;
        url += queryParams
    }
    const response = await fetch(BASEURL + url);
    const groupsJson = await response.json();
    if (response.ok) {
        return groupsJson;
    } else {
        let err = { status: response.status, errObj: groupsJson };
        throw err; //Oggetto con errore proveniente dal server
    }
}

async function getPlayOff(name, order) {
    let url = "/playOff";
    if (name && order) {
        const queryParams = "?name=" + name + "&order=" + order;
        url += queryParams
    }
    const response = await fetch(BASEURL + url);
    const playOffJson = await response.json();
    if (response.ok) {
        return playOffJson;
    } else {
        let err = { status: response.status, errObj: playOffJson };
        throw err; //Oggetto con errore proveniente dal server
    }
}

async function createTournament(structure) {
    structure.phases.forEach(element => {
        if (element.structure.type === 'Championship') {
            element.structure.groups_number = 1;
            element.structure.group_teams = element.structure.qualified_teams;
        }
    });

    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/createTournament', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(structure),
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function getAllTournaments() {
    let url = "/allTournaments";
    const response = await fetch(BASEURL + url);
    const tournamentsJson = await response.json();
    if (response.ok) {
        return tournamentsJson;
    } else {
        let err = { status: response.status, errObj: tournamentsJson };
        throw err; //Oggetto con errore proveniente dal server
    }
}

async function getTeams() {
    let url = "/teams";
    const response = await fetch(BASEURL + url);
    const teamsJson = await response.json();
    if (response.ok) {
        return teamsJson;
    } else {
        let err = { status: response.status, errObj: teamsJson };
        throw err; //Oggetto con errore proveniente dal server
    }
}

async function addTeam(structure) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/addTeam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(structure),
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function startTournament(structure) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/startTournament', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(structure),
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteTournament(tournament) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/tournament?tournament=' + tournament, {

            method: 'DELETE',
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });

}

async function updateTournamentName(tournament) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/tournament', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tournament),
        }).then((response) => {
            const status = response.status; // needed for later, when response is consumed
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });

}

const API = { getMatches, getGroups, getPlayOff, getGroupsComposition, createTournament, getAllTournaments, getTeams, addTeam, startTournament, deleteTournament, updateTournamentName };

export default API