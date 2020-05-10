import React from 'react';
import socket from '../connection';

class GameLobby extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playerCount : this.props.gameObject.playerCount,
        gameObject : this.props.gameObject,
        userArr : [],
        hostName : this.props.gameObject.host.hostUsername
      };
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
      socket.on('gameObject', (newGameObject) => {
        var userArr = [];
        Object.keys(newGameObject.users).forEach(function(key) {
          userArr.push({'name' : newGameObject.users[key], 'key' : key});
        });
        this.setState({status : newGameObject.status, playerCount : newGameObject.playerCount, userArr : userArr});
      });
    }

    componentWillUnmount() {
    }
  
    render() {

      const userList = this.state.userArr.map(item => 
        (item.name !== this.state.hostName ? <li key={item.key}>{item.name}</li> : <li key={item.key}>{item.name} (Host)</li>));

      //console.log(userList);
    
      return( 
        <div> 
          <h2>Welcome: {this.props.username}</h2>
          <p>There are {this.state.playerCount} players in the lobby.</p>
          <p>Currently in lobby: {this.props.lobbyCode}</p>
          <ul>{userList}</ul>
        </div>
      )
    };
  }

  export default GameLobby;
