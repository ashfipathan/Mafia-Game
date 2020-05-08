module.exports =  { 
   
   start : function(socket) {
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

      // Create a new room
      socket.join(lobbyCode);
      socket.emit('joined lobby', "Joined lobbbby: " + lobbyCode);
   }
}


