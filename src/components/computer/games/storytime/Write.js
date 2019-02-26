import React, {Component} from 'react';
import Video from '../../VideoBackground';
import WriterCard from './WriterCard';

import {inputRequest, connectToRoom} from '../../../../actions';
import {requests} from '../../../../actions/requestTypes';

class Write extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitted: {}
    }
  }

  componentDidMount() {
    this.sendWriteRequests();
    connectToRoom(this.props.room.code, this.handleSubmissions);

    let submitted = {};
    this.props.writers.forEach(writer=>{
      submitted[writer.index] = false;
    });
    this.setState(submitted);
  }

  handleSubmissions = async data=> {
    let players = await data.toJSON().players;
    this.props.writers.forEach(writer => {
      if (players[writer.index].request==='submitted') {
        let submitted = this.state.submitted;
        submitted[writer.index] = true;
        this.setState(submitted);
      }
    });
  }

  sendWriteRequests = ()=> {
    // sends notif to phones to request input
    let playersToReceive = [];
    this.props.writers.forEach(writer => {
      playersToReceive.push(writer.index);
    });
    inputRequest(this.props.room.code, requests.storyTime.writeLine, this.props.prompt, playersToReceive);
  }

  renderWriterCards = ()=> {
    let cards = this.props.writers.map((writer, i) => {
      let text = this.props.room.players[writer.index].input;
      return (
        <WriterCard key={i} name={writer.name} img={writer.img} text={text} submitted={this.state.submitted[writer.index]}/>
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