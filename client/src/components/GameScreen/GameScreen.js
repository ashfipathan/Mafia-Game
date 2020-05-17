import React from 'react';
import socket from '../../connection';
import './gameScreen.css';

// Components
import Timer from '../Timer';
import ListGroup from 'react-bootstrap/ListGroup'
// Game statuses 
const specialVote = 'specialVote';
const discussion = 'discussion';
const closingVote = 'closingVote';
const outcome = 'outcome';
const roundEnd = 'roundEnd';
const gameOver = 'gameOver';




class GameScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        gameObject : this.props.gameObject,
        // roundStatus : this.props.roundData.roundStatus
        roundStatus : specialVote,
        voteID : '',
        username : '',
        role : ''
      };

      this.handleVote = this.handleVote.bind(this);

    }

    handleVote(event) {
      let data = {clientID : this.props.clientID, voteID : event.target.dataset.value, role : this.state.role}
      this.setState({voteID : event.target.dataset.value});
      socket.emit('vote',  data);
      console.log(data);
    }

    componentDidMount() {
      // Listener for incoming round updates
      socket.on('round update', (newGameObject) => {
        this.setState({roundStatus : newGameObject.roundData.status});
      });

      // Set Role State
       // Role (put into function later)
       if (this.state.gameObject.mafiaIDs.includes(this.props.clientID)) {
        this.setState({role : 'Mafia'});
      }
      else if (this.state.gameObject.doctorIDs.includes(this.props.clientID)) {
        this.setState({role : 'Doctor'});
      }
      else if (this.state.gameObject.copIDs.includes(this.props.clientID)) {
        this.setState({role : 'Cop'});
      }
      else {
        this.setState({role : 'Civillian'});
      }
    }

    render() {

      // Timer
      if (this.state.roundStatus === specialVote || this.state.roundStatus === closingVote) {
        var timer = <Timer minutes={0} seconds={30} />
      }
      else if (this.state.roundStatus === discussion) {
        timer = <Timer minutes={this.props.gameObject.roundTimer / 60} seconds={this.props.gameObject.roundTimer % 60} />
      } else {
        timer = <h2>this.props.gameObject.roundData.voteOutcome</h2>
      }

      // Round Status
      if (this.state.roundStatus === specialVote) {
        var status = "Special Characters Votes";
      }
      else if (this.state.roundStatus === discussion) {
        status = "Discussion Period";
      }
      else if (this.state.roundStatus === closingVote) {
        status = "Voting Period";
      }
      else {
        status = "Discussion Period";
      }

      var status = <h3>{status}</h3>;

      // User List
      var users = this.state.gameObject.users;
      var userList = [];
      for (var x in users) {
        userList.push(<ListGroup.Item action as="li" key={x} data-value={x} onClick={this.handleVote}>{users[x]}</ListGroup.Item>);
      }

      // Players Remaining
      // var alivePlayers = this.state.roundData.alive.length;
      var alivePlayers = 3;
      // Last Player killed
      // var killedLast = this.props.gameObject.users[this.state.roundData.killed];
      var killedLast = "DR MRS VANDERTRAMP";

      return(
        <div>
          <h1>MAFIA</h1>
          {timer}
          {status}
          {this.state.role}
          <ListGroup as="ul">
            {userList}
          </ListGroup>
          <p>{alivePlayers} Players Alive</p>
          <p>{killedLast} was the most recent casualty.</p>
        </div>
      )
    };
  }

  export default GameScreen;
