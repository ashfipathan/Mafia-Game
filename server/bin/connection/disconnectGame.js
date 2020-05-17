const { Connection } = require('../../mongo');

module.exports =  {
   leave : function(socket, clientID, lobbyCode) {
   
      var app = require('express');

      // Update Game Object
      var query = {"lobbyCode" : lobbyCode}

      
      Connection.db.collection("game_" + lobbyCode).findOne(query).then((data) => {
        var gameObject = data;
        
        // If Host leaves, the game is deleted
        if (clientID === gameObject.host.hostID) {
            // Drop collection from DB
            Connection.db.collection("game_" + lobbyCode).drop(function (err, delOK) {
                if (err) throw err;
                if (delOK) console.log("game_" + lobbyCode + " has been deleted.");

                // Notify remaining players in lobby
                socket.nsp.to(lobbyCode).emit('host left', "game_" + lobbyCode + " has been deleted.");

            });
        }
        else {
            var playerCount = gameObject.playerCount - 1;
            var users = gameObject.users;
            delete users[clientID];
            gameObject.playerCount = playerCount;
            gameObject.users = users;


            var updateValues = { $set: {playerCount : playerCount, users : users}};
            Connection.db.collection("game_" + lobbyCode).updateOne(query, updateValues).then(() => {
            });;

            socket.nsp.to(lobbyCode).emit('gameObject', gameObject);

            }
      });
   }
}
 
 
 