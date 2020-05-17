import React from 'react';
import socket from '../../connection';
import './gameLobby.css';

class GameLobby extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playerCount : this.props.gameObject.playerCount,
        gameObject : this.props.gameObject,
        userArr : [],
        hostName : this.props.gameObject.host.hostUsername,
        hostID : this.props.gameObject.host.hostID
      };

      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
      // Output users that previous joined
      var initialUsers = [];
      var initialGameObject = this.props.gameObject;

      Object.keys(initialGameObject.users).forEach(function(key) {
        initialUsers.push({'name' : initialGameObject.users[key], 'key' : key});
      });
      this.setState({userArr : initialUsers});


      // Set up a listener for incoming/disonnecting players
      socket.on('player joined', (newGameObject) => {
        var userArr = [];
        Object.keys(newGameObject.users).forEach(function(key) {
          userArr.push({'name' : newGameObject.users[key], 'key' : key});
        });
        this.setState({status : newGameObject.status, playerCount : newGameObject.playerCount, userArr : userArr});
      });
    }

    componentWillUnmount() {
    }

    handleSubmit(event) {
      console.log("Start game...");
      let data = {lobbyCode : this.props.lobbyCode};
      console.log(data);
      socket.emit('start game', data);
      event.preventDefault();
    }
  
    render() {

      const userList = this.state.userArr.map(item => 
        (item.key !== this.state.hostID ? <li key={item.key}>{item.name}</li> : <li key={item.key}>{item.name} (Host)</li>));
      
      if(this.state.hostID === this.props.clientID) {
        return( 
          <div className="App"> 
            <h2>Welcome: {this.props.username}</h2>
            <p>There are {this.state.playerCount} players in the lobby.</p>
            <p>Currently in lobby: {this.props.lobbyCode}</p>
            <ul>{userList}</ul>
            <form onSubmit={this.handleSubmit}> <button type="submit">Do the thing</button> </form> 
          </div>)
      }
      else {
        return( 
          <div> 
            <h2>Welcome: {this.props.username}</h2>
            <p>There are {this.state.playerCount} players in the lobby.</p>
            <p>Currently in lobby: {this.props.lobbyCode}</p>
            <ul>{userList}</ul>
          </div>)
      }
    };
  }

  export default GameLobby;
