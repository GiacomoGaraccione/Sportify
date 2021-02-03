# Sportify

## Description

Sportify is a tablet-based application used for creating and organizing tournaments for different sports. It can be used to plan a tournament for any kind of sport whose matches view two teams (with any number of members, including just one person) against one another.
With the application you can choose to simply insert the number of teams that will take part in your tournament and view the options that Sportify will compute based on said number (said options will be limited to tournaments with length of at most two phases), or you can create a customized experience composed of up to five different phases, each with a smaller number of teams passing from the previous one, with three different kinds of structure possible per phase: play-off tournaments, groups of teams facing each other or a championship where all teams will play against all others.

## Running

1. Clone this repository
2. Open it in two different terminals
3. Run `cd client; npm install` in the first one
4. After the installation is complete, run `npm start`
5. Run `cd server; npm install` in the second terminal
6. After the installation is complete, run `node server.js`
7. View the application on your browser on `localhost:3000`