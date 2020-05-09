const { Connection } = require('../../mongo');


module.exports =  { 
   
   start : function(socket, username) {
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
      // mongo((db) => {
         
         Connection.db.collection("game_" + lobbyCode).insertOne({
            lobbyCode: lobbyCode,
            users: [username],
            playerCount : 1,
            mafia_num : 1,
            doctor_num : 1,
            cop_num : 1,
            roundTimer: 300
         }).then(() => {
            console.log("Inserted game state.");
          });;
      // });
      

      // Create a new room
      socket.join(lobbyCode);
      socket.emit('joined lobby', "Joined lobbbby: " + lobbyCode);


   }
}


