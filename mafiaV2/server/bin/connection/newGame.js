const { Connection } = require('../../mongo');


module.exports =  { 
   
   start : function(socket, username, clientID) {
      var app = require('express');

      function makeid(length) {
         var result           = '';
         var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
         var charactersLength = characters.length;
         for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
         }
         return result;
      }

      var lobbyCode = makeid(5);

      console.log(socket.id);
      var db = Connection.db;

      var gameObject = {
         lobbyCode: lobbyCode,
         status: "lobby",
         users: { [clientID] : username},
         host : { hostID : clientID, hostUsername : username},
         mafiaIDs : [],
         doctorIDs : [],
         copIDs : [],
         playerCount : 1,
         mafiaCount : 1,
         doctorCount : 1,
         copCount : 1,
         roundTimer: 300
      }


         Connection.db.collection("game_" + lobbyCode).insertOne(gameObject).then(() => {
            console.log("Inserted game state.");
          });;

      

      // Create a new room
      socket.join(lobbyCode);
      socket.emit('gameObject', gameObject);


   }
}


