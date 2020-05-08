module.exports =  {
   join : function(socket, username, lobbyCode) {
   
      var app = require('express');

      console.log(socket);
      console.log(socket.id);
      console.log(lobbyCode);
      // Create a new room
      socket.join(lobbyCode);
      socket.to(lobbyCode).emit('joined lobby', username + " joined lobby: " + lobbyCode);
      //socket.broadcast.to(lobbyCode).emit(username + " has joined the lobby!");

   }
}
 
 
 