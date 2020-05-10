import React from 'react';
import socket from '../connection';

class MainMenu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {username : '', lobbyCode : ''};

      

      this.handleChangeUsername = this.handleChangeUsername.bind(this);
      this.handleChangeLobbyCode = this.handleChangeLobbyCode.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeUsername(event) {
     this.setState({username: event.target.value});
     this.props.onUsernameChange(event.target.value);
    }

    handleChangeLobbyCode(event) {
     this.setState({lobbyCode: event.target.value});
     this.props.onLobbyChange(event.target.value);
    }
  
    handleSubmit(event) {
      if (this.state.lobbyCode === "") {
        socket.emit('new game', {'clientID' : this.props.clientID, 'username' : this.state.username});
       } 
       else {
         socket.emit('join game', {'clientID' : this.props.clientID, 'username' : this.state.username, 'lobbyCode' : this.state.lobbyCode});
       }
 
       console.log({ "ClientID" : this.props.clientID, "Username" : this.state.username, "Lobby Code" : this.state.lobbyCode });
     

      event.preventDefault();
    }


  
    render() {
      
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
             Username:
             <input type="text" value={this.props.username} onChange={this.handleChangeUsername} />
            </label>
            <br></br>
            <label>
              Lobby Code:
              <input type="text" value={this.props.lobbyCode} onChange={this.handleChangeLobbyCode} />
            </label>
            <p> Leave Lobby Code empty to create a new game.</p>
            <input type="submit" value="Submit" />
          </form>
        ) 
    };
  }

  export default MainMenu;
