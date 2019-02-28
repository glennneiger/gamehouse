import React, {Component} from 'react';
import WriterCard from './WriterCard';

import {inputRequest, watchForChange, receiveSubmission} from '../../../../actions';
import {requests} from '../../../../actions/requestTypes';
import {screens, findWinners} from './helpers';

class Write extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitted: [], // indices of all players who have submitted 
      texts: {}, // map writer index => what they're writing
      votingOpen: false, // first half is writers writing, second half is voters voting 
      voters: [], // indices of players who will be voting 
      votes: {}, // map writer indices => arr of indices of players who voted for them
      writers: props.writers
    }
  }

  componentDidMount() {
    this.props.playVideo('storytime/write');
    
    this.sendWriteRequests();

    let voters = [];
    let votes = {};
    for (let i = 0; i < this.props.room.players.length; i++) {
      voters.push(i);
    }

    let {code} = this.props.room;

    this.state.writers.forEach(writer=>{
      voters.splice(voters.indexOf(writer.index), 1);
      votes[writer.index] = []; 
      watchForChange(code, `players/${writer.index}/input`, data=>this.updateText(data, writer.index));
      watchForChange(code, `players/${writer.index}/request`, data=>this.handleSubmissions(data, writer.index));
    });

    voters.forEach(voter=>{
      watchForChange(code, `players/${voter}/input`, data=>this.recordVote(data, voter));
      watchForChange(code, `players/${voter}/request`, data=>this.handleSubmissions(data, voter));
    });

    this.setState({
      voters,
      votes
    });
  }

  updateText = async (data, index)=> {
    const newText = await data.toJSON();
    if (newText===null) {
      return;
    }
    let {texts} = this.state;
    texts[index] = newText;
    this.setState({texts});
  }

  recordVote = async (data, voter)=> {

    let vote = await data.toJSON();

    if (vote === null) {
      return;
    } 

    let {votes} = this.state;
    if (votes[vote]===undefined) {
      return;
    }
    votes[vote].push(voter);
    this.setState({votes});
  }

  sendWriteRequests = ()=> {
    // sends notif to phones to request input
    let playersToReceive = [];
    this.state.writers.forEach(writer => {
      playersToReceive.push(writer.index);
    });
    inputRequest(this.props.room.code, requests.storyTime.writeLine, this.props.prompt, playersToReceive);
  }

  handleSubmissions = async (data, index)=> {
    let submission = await data.toJSON();

    if (submission !== 'submitted') {
      return;
    } 
    receiveSubmission(this.props.room.code, index);

    let {submitted} = this.state;
    submitted.push(index);
    this.setState({submitted});
    let {writers, room} = this.props;

    if (!this.state.votingOpen) {
      //writing phase
      if (submitted.length===writers.length) {
        //all writers have submitted 
        this.handleAllWritersSubmitted();
      }      
    } else {
      //voting phase
      if (submitted.length===room.players.length) {
        //all writers have submitted 
        this.handleAllVotersSubmitted();    
      }
    }
  }

  handleAllWritersSubmitted = ()=> {

    // play voice 

    //play voting music

    this.openVoting();
  }

  handleAllVotersSubmitted = ()=> {
    let {votes, texts} = this.state;
    let {writers} = this.props;
    let winners = findWinners(writers, votes);
    let winner;
    if (winners.length > 0) {
      //handle tie 

      //choose winner at random
      winner = winners[Math.floor(Math.random()*winners.length)];
    } else {
      winner = winners[0];
    }
    let winningText = texts[winner.index];
    this.props.declareWinner(winner, winningText);
    this.props.switchScreen(screens.winner);
  }

  openVoting = ()=> {
    this.setState({votingOpen: true})
    inputRequest(this.props.room.code, requests.storyTime.vote, this.state.writers, this.state.voters);
  }

  renderWriterCards = ()=> {
    let cards = this.state.writers.map((writer, i) => {
      let text = this.state.texts[writer.index];
      if (!text) {
        text = ' ';
      }
      let {players} = this.props.room;
      let {submitted, votes} = this.state;
      return (
        <WriterCard key={i} name={writer.name} img={writer.img} text={text} submitted={submitted.includes(writer.index)} votes={votes[writer.index]} players={players}/>
      )
    }
  );
    return cards;
  }

  render() {
    return (
      <div className="StoryTime">

        <div className="row">
          <div className="story-text">
            {this.props.story}<br/>{this.props.prompt}...
          </div>
        </div>

        <div className="row writer-cards">
          {this.renderWriterCards()}
        </div>
      </div>
    )
  }
}

export default Write;