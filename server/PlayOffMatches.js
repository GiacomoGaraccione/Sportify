class PlayOffMatches {
    constructor (id, round, match, idTeam1, nameTeam1, seedTeam1, idTeam2, nameTeam2, seedTeam2, scoreTeam1, scoreTeam2){
        this.id=id;
        this.round=round;
        this.match=match;
        this.idTeam1=idTeam1;
        this.nameTeam1=nameTeam1;
        this.seedTeam1=seedTeam1;
        this.idTeam2=idTeam2;
        this.nameTeam2=nameTeam2;
        this.seedTeam2=seedTeam2;
        this.scoreTeam1=scoreTeam1;
        this.scoreTeam2=scoreTeam2;
    }
    getId(){
        return this.id;
    }

    getRound(){
        return this.round;
    }

    getMatch(){
        return this.match;
    }

    getIdTeam1(){
        return this.idTeam1;
    }

    getNameTeam1(){
        return this.nameTeam1;
    }

    getSeedTeam1(){
        return this.seedTeam1;
    }

    getIdTeam2(){
        return this.idTeam1;
    }

    getNameTeam2(){
        return this.nameTeam1;
    }

    getSeedTeam2(){
        return this.seedTeam1;
    }

    getScoreTeam1 (){
        return this.scoreTeam1;
    }

    getScoreTeam2 (){
        return this.scoreTeam2;
    }
}

module.exports = PlayOffMatches;