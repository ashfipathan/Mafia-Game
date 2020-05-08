import React from 'react';
import GameLobby from './GameLobby';
import io from 'socket.io-client';
const socket = io('http://localhost:9000', {transports: ['websocket'], upgrade: false, 'force new connection' : true});



class MainMenu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {username : '', lobbyCode : '', inLobby : false};

      
  
      this.handleChangeUsername = this.handleChangeUsername.bind(this);
      this.handleChangeLobbyCode = this.handleChangeLobbyCode.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeUsername(event) {
      this.setState({username: event.target.value});
    }

    handleChangeLobbyCode(event) {
      this.setState({lobbyCode: event.target.value});
    }
  
    handleSubmit(event) {
      if (this.state.lobbyCode === "") {
        socket.emit('new game', {'clientID' : this.props.clientID, 'username' : this.state.username});
        this.setState({inLobby : true});
      } 
      else {
        socket.emit('join game', {'clientID' : this.props.clientID, 'username' : this.state.username, 'lobbyCode' : this.state.lobbyCode});
        this.setState({inLobby : true});
      }

      console.log({ "ClientID" : this.props.clientID, "Username" : this.state.username, "Lobby Code" : this.state.lobbyCode });
  
      event.preventDefault();
    }


  
    render() {
      if (this.state.inLobby) {
        return (
            <GameLobby socket={socket} />
        )
      } 
      else {
        return (
          <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
          </label>
          <br></br>
          <label>
            Lobby Code:
            <input type="text" value={this.state.lobbyCode} onChange={this.handleChangeLobbyCode} />
          </label>
          <p> Leave Lobby Code empty to create a new game.</p>
          <input type="submit" value="Submit" />
        </form>
        
      )
      }
    };
  }

  export default MainMenu;
