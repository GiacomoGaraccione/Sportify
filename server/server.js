const express = require('express');
const morgan = require('morgan'); // logging middleware
const moment = require ('moment');
const DAO = require('./dao.js');

const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// DB error
const dbErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };

var today = moment().format("YYYY-MM-DD");//Data odierna

app.get('/api/matches', (req, res)=>{
    let tournament=req.query.filter;
    DAO.getMatches(tournament).then((matches)=>{res.json(matches);}).catch((err)=>{
      res.status(500).json({
          errors: [{'msg' : err}],
      });
    });
});

app.get('/api/groupsComposition', (req, res)=>{
    let tournament=req.query.name;
    let order=req.query.order;
    DAO.getGroupsComposition(tournament, order).then((groups)=>{res.json(groups);}).catch((err)=>{
      res.status(500).json({
          errors: [{'msg' : err}],
      });
    });
});

app.get('/api/groups', (req, res)=>{
  let tournament=req.query.name;
  let order=req.query.order;
  DAO.getGroups(tournament, order).then((groups)=>{res.json(groups);}).catch((err)=>{
    res.status(500).json({
        errors: [{'msg' : err}],
    });
  });
});

app.get('/api/playOff', (req, res)=>{
  let tournament=req.query.name;
  let order=req.query.order;
  DAO.getPlayOff(tournament, order).then((playOff)=>{res.json(playOff);}).catch((err)=>{
    res.status(500).json({
        errors: [{'msg' : err}],
    });
  });
});

app.post('/api/createTournament', (req, res) => {
  if(!req.body) {
      res.status(500).end;
  }

  else {
      DAO.addTournament(req.body).then((out)=>{
        req.body.id = out;
        DAO.addPhases(req.body).then((out)=>{
          res.status(201); 
          res.json(null);
          }).catch((err)=>{
            res.status(500).json({
                errors: [{'param' : 'Server', 'msg': err}],
            });
        });
        }).catch((err)=>{
          res.status(500).json({
              errors: [{'param' : 'Server', 'msg': err}],
          });
      });
  }
});

app.get('/api/allTournaments', (req, res)=>{
  DAO.getAllTournaments().then((tournaments)=>{res.json(tournaments);}).catch((err)=>{
    res.status(500).json({
        errors: [{'msg' : err}],
    });
  });
});-+20

app.get('/api/teams', (req, res)=>{
  DAO.getTeams().then((teams)=>{res.json(teams);}).catch((err)=>{
    res.status(500).json({
        errors: [{'msg' : err}],
    });
  });
});

app.post('/api/addTeam', (req, res)=>{
  if(!req.body)
      res.status(500).end;
  else{
    DAO.addTeam(req.body).then((out)=>{
      res.status(201); 
      res.json(null);
    }).catch((err)=>{
        res.status(500).json({
            errors: [{'param' : 'Server', 'msg': err}],
        });
      });
    }
  });

  app.post('/api/startTournament', (req, res)=>{
    if(!req.body)
        res.status(500).end;
    else{
      DAO.startTournament(req.body).then((out)=>{
        res.status(201); 
        res.json(null);
      }).catch((err)=>{
          res.status(500).json({
              errors: [{'param' : 'Server', 'msg': err}],
          });
        });
      }
    });

  app.delete('/api/tournament', (req, res) => {
    let tourn = req.query.tournament;
    DAO.deleteTournament(tourn)
        .then((result) => { 
          res.status(201); 
          res.json(null);
        }).catch((err)=>res.status(503).json(err));
    });

        
  app.put('/api/tournament', (req, res)=>{
    DAO.updateName(req.body).then((out)=>{res.json(out);}).catch((err)=>{
        res.status(500).json({
            errors: [{'msg' : err}],
        });
    });
  });

  app.listen(port, ()=>console.log(`Server running on http://localhost:${port}/`));