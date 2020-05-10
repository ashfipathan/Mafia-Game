const { Connection } = require('../../mongo');

module.exports =  {
   join : function(socket, username, clientID,lobbyCode) {
   
      var app = require('express');

      console.log(socket.id);
      console.log(lobbyCode);

      // Create a new room
      socket.join(lobbyCode);

      //socket.broadcast.to(lobbyCode).emit(username + " has joined the lobby!");

      // Update Game Object
      var query = {"lobbyCode" : lobbyCode}

      var gameObject;
      Connection.db.collection("game_" + lobbyCode).findOne(query).then((data) => {
         gameObject = data;

      
         var playerCount = gameObject.playerCount + 1;
         var users = gameObject.users;
         users[clientID] = username;
         gameObject.playerCount = playerCount;
         gameObject.users = users;


         var updateValues = { $set: {playerCount : playerCount, users : users}};
         Connection.db.collection("game_" + lobbyCode).updateOne(query, updateValues).then(() => {
            console.log("Updated game state.");
         });;

         socket.nsp.to(lobbyCode).emit('gameObject', gameObject);
      });
   }
}
 
 
 