import React from 'react';
import socket from '../connection';

// Import components
import GameLobby from './GameLobby/GameLobby';
import MainMenu from './MainMenu/MainMenu';
import GameScreen from './GameScreen/GameScreen';

// Constants
const mainMenuStatus = 'MainMenu';
const lobbyStatus = 'lobby';
const gameStatus = 'inGame';




/**
 * Purpose of this class is to decide which component will be rendered based on game object received
 */
class ComponentController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {status : mainMenuStatus, gameObject : {}, username : '', lobbyCode : ''};
        this.handleLobbyCodeChange = this.handleLobbyCodeChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
        socket.clientID = this.props.clientID;
    }

    // functions to lift user data from MainMenu component
    handleUsernameChange(newUsername) {
        this.setState({username : newUsername});
        socket.username = newUsername;
    }

    handleLobbyCodeChange(newCode) {
        this.setState({lobbyCode : newCode});
        socket.lobbyCode = newCode;
    }

    /**
     * Put socket io event listeners here
     */
    componentDidMount() {
        // Listener for incoming game updates
        socket.on('gameObject', (newGameObject) => {
          this.setState({status : newGameObject.status, gameObject : newGameObject, lobbyCode : newGameObject.lobbyCode});
          socket.lobbyCode = newGameObject.lobbyCode;
          console.log(newGameObject);
        });

        socket.on('host left', (data) => {
            console.log(data);
            this.setState({status : mainMenuStatus});
        });

        socket.on('notEnoughPlayer', (data) => {
            console.log(data);
            this.setState({status : lobbyStatus});
        });

        // Listener to notify server on disconnect
        window.addEventListener('beforeunload', this.componentCleanup);
    }

    componentCleanup() {
        var data = {clientID : this.props.clientID, lobbyCode : this.state.lobbyCode};
        console.log(data);
        socket.emit('disconnectGame', data);
    }
    
    componentWillUnmount() {
  
    }

    render() {
        const username = this.state.username;
        const lobbyCode = this.state.lobbyCode;
        const gameObject = this.state.gameObject;

        if (this.state.status === mainMenuStatus) {
            return (
                <MainMenu clientID={this.props.clientID} onUsernameChange={this.handleUsernameChange} onLobbyChange={this.handleLobbyCodeChange} />
            );
        }
        else if (this.state.status === lobbyStatus) {
            return (
                <GameLobby gameObject={gameObject} username={username} lobbyCode={lobbyCode} clientID={this.props.clientID} />
            );
        } 
        else if (this.state.status === gameStatus) {
            return (
                <GameScreen gameObject={gameObject} clientID={this.props.clientID} />
            );
        }
    };

}

export default ComponentController;