import React, {Component} from 'react';
import Video from '../../VideoBackground';
import WriterCard from './WriterCard';

import {inputRequest, watchForChange, receiveSubmission} from '../../../../actions';
import {requests} from '../../../../actions/requestTypes';

class Write extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitted: [], // indices of all players who have submitted 
      texts: {}, // map writer index => what they're writing
      votingOpen: false, // first half is writers writing, second half is voters voting 
      voters: [], // indices of players who will be voting 
      votes: {} // map writer indices => arr of indices of players who voted for them
    }
  }

  componentDidMount() {
    this.sendWriteRequests();

    let voters = [];
    let votes = {};
    for (let i = 0; i < this.props.room.players.length; i++) {
      voters.push(i);
    }
    this.props.writers.forEach(writer=>{
      voters.splice(voters.indexOf(writer.index), 1);
      votes[writer.index] = []; 
      watchForChange(this.props.room.code, `players/${writer.index}/input`, data=>this.updateText(data, writer.index));
      watchForChange(this.props.room.code, `players/${writer.index}/request`, data=>this.handleSubmissions(data, writer.index));
    });

    this.setState({voters, votes});
  }

  updateText = async (data, index)=> {
    let {texts} = this.state;
    texts[index] = await data.toJSON();
    this.setState({texts});
  }

  sendWriteRequests = ()=> {
    // sends notif to phones to request input
    let playersToReceive = [];
    this.props.writers.forEach(writer => {
      playersToReceive.push(writer.index);
    });
    inputRequest(this.props.room.code, requests.storyTime.writeLine, this.props.prompt, playersToReceive);
  }

  handleSubmissions = async (data, index)=> {
    let submission = await data.toJSON();
    console.log(submission);
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
    console.log('all in')
    this.openVoting();
  }

  handleAllVotersSubmitted = ()=> {

  }

  openVoting = ()=> {
    this.setState({votingOpen: true})
    inputRequest(this.props.room.code, requests.storyTime.vote, this.props.writers, this.state.voters);
  }

  renderWriterCards = ()=> {
    let cards = this.props.writers.map((writer, i) => {
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
        <Video video="storytime/write" />

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