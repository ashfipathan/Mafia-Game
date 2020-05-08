import React from 'react';
import io from 'socket.io-client';

class GameLobby extends React.Component {
    constructor(props) {
      super(props);
      this.state = {username : '', lobbyCode : '', inLobby : false, playerCount : 0};
    }

    componentDidMount() {
      console.log(this.props.socket.id);
      this.props.socket.on('joined lobby', (data) => {
        this.setState({playerCount : this.state.playerCount + 1});
        console.log(data);
      });
    }

    componentWillUnmount() {

    }
  
    render() {
      return( <h2> {this.state.playerCount} Players in the lobby. </h2>)
    };
  }

  export default GameLobby;
