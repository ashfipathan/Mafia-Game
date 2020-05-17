const { Connection } = require('../../mongo');


// Game Constants
const specialVote = 'specialVote';
const discussion = 'discussion';
const closingVote = 'closingVote';
const outcome = 'outcome';
const roundEnd = 'roundEnd';
const gameOver = 'gameOver';

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 * Taken from: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


// assign roles
function assignRoles (clientIDs, mafiaCount, doctorCount, copCount) {
    var roles = {mafiaIDs : [], doctorIDs : [], copIDs : []};
    var playerCount = clientIDs.length;  

    // Randomize order of clients
    shuffle(clientIDs);

    // If not enough players, send back an error
    if (playerCount < (mafiaCount + doctorCount + copCount)) {
        return "notEnoughPlayer";
    }

    console.log(clientIDs);
    // Assign Mafias
    for (var i = 0; i < mafiaCount; i++) {
        roles.mafiaIDs.push(clientIDs[i]);
        clientIDs.shift();
    }

    // Assign Doctors
    for(var j = 0; j < doctorCount; j++) {
        roles.doctorIDs.push(clientIDs[j]);
        clientIDs.shift();
    }

    // Assign Cops
    for (var k = 0; k < copCount; k++) {
        roles.copIDs.push(clientIDs[k]);
        clientIDs.shift();
    }
    return roles;
}


module.exports =  {
   start : function(socket, lobbyCode) {
   
      var app = require('express');

      // Update Game Object
      var query = {"lobbyCode" : lobbyCode}

      Connection.db.collection("game_" + lobbyCode).findOne(query).then((data) => {
        var gameObject = data;

        // Update game status 
        var playerCount = gameObject.playerCount + 1;
        var users = gameObject.users;
        var clientIDs = [];
        for (x in users) {
            clientIDs.push(x);
            ++playerCount;
        }
        var roles = assignRoles(clientIDs, gameObject.mafiaCount, gameObject.doctorCount, gameObject.copCount);
        console.log(roles);

        if (roles == "notEnoughPlayer") {
            socket.emit('notEnoughPlayer', "Not enough players to start game.");
            return;
        }

        // Update game status
        gameObject.status = "inGame";

        // Update game object with roles
        gameObject.mafiaIDs = roles.mafiaIDs;
        gameObject.doctorIDs = roles.doctorIDs;
        gameObject.copIDs = roles.copIDs;

        // Set up Initial Round Data
        var roundData = {
            status : specialVote,
            alive : clientIDs,
            dead : [],
            killed : '',
            saved : '',
            voteOutcome : '',
            winner : '',
            roundNumber : ''
         };

         gameObject.roundDate = roundData;


        var updateValues = { $set: {mafiaIDs : roles.mafiaIDs, doctorIDs : roles.doctorIDs}};
        Connection.db.collection("game_" + lobbyCode).updateOne(query, updateValues).then(() => {
           console.log("Starting game.");
        });;

        socket.nsp.to(lobbyCode).emit('gameObject', gameObject);
        
        
        
      });
   }
}
 
 
 