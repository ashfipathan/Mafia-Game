exports.foo = (req,res) => {

    let socket_id = [];
    const io = req.app.get('socketio');
  
    io.on('connection', function(socket) {
      console.log("made to routes...");
      // Create a new room
      socket.join(lobbyCode);
      socket.emit('joined lobby', "Joined lobby: " + lobbyCode);
   });
  }