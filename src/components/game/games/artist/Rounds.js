import React, {Component} from 'react';

import Timer from '../../other/Timer';

import {inputRequest} from '../../../../actions';
import {requests} from '../../../../actions/requestTypes';

export default class Draw extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startTimer: false,
      content: {},
      round: -1
    }
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState({round:0});
      this.startRound(0);
    }, 1500);
  }

  startRound = round=> {
    const {playVoice, room, players, roundContent, prevPlayer} = this.props;

    let content = {};
    players.forEach(player=>{
      content[player.index] = '';
    });
    this.setState({content});

    const next = ()=>{
      this.setState({startTimer: true});
      players.forEach(player => {
        let message = null;
        if (round>0) message = `${roundContent[round-1][prevPlayer(player.index)]}`;
        let request;
        round % 2 === 0 ? request=requests.artist.draw : request=requests.artist.type;
        inputRequest(room.code, request, message, player.index, this.recordInput);
      });
    }; 

    const changeSong = ()=> {
      let index;
      if (round===2) {
        index=1;
      } else if (round===6) {
        index=2;
      } else if (round===10) {
        index=3;
      } else if (round===14) {
        index=0;
      } else {
        return;
      };
      const {playAudio} = this.props;
      playAudio('music', index);;
    }

    playVoice(`rounds/${round}`, next);

    changeSong();
  }

  concludeRound = ()=> {
    const finish=()=> {
      document.getElementById('wrapper').classList.add('slide-up');
      setTimeout(() => {
        this.props.nextScreen();
      }, 900);
    }

    this.setState({startTimer:false});
    const {playVoice, recordContent, players, playerOrder} = this.props;
    let {round} = this.state;
    playVoice(`timesup/${round}`, ()=>{
      let content = {};
      playerOrder.forEach(index=>{
        content[index]=`${this.state.content[index]}`;
      })
      recordContent(content);
      if (round===players.length-1) {
        finish();
      } else {
        round++;
        this.setState({round});
        this.startRound(round);
      }
    });
  }

  recordInput = (input, playerIndex)=> {
    let {content} = this.state;
    content[playerIndex] = input.message;
    this.setState({content});
  }

  renderRoundCounter = ()=> {
    const {players} = this.props;
    const {round} = this.state;
    const counters=players.map((player, i)=>(
      <div key={i} className={`round-counter${i<=round ? ' highlighted' : ''}`}>{i+1}</div>
    ));

    let across=2;
    if ([5,6,9].includes(players.length)){
      across=3;
    } else if ([7,8,11,12,16].includes(players.length)){
      across=4;
    } else if ([10,13,14,15].includes(players.length)){
      across=5;
    }

    return (
      <div className="slide-in-from-top" id="wrapper">
        <div className={`round-counter-container length-${across}`}>
          {counters}
        </div>
      </div>
    )
  }

  render() {
    let {startTimer, round} = this.state;
    let seconds;
    if (round===0) {
      seconds=80;
    } else if (round%2===0) {
      seconds=70;
    } else {
      seconds=25;
    }

    return (
      <div className="Artist center-screen">
        <Timer seconds={seconds} startTimer={startTimer} onFinish={this.concludeRound} code={this.props.room.code} />
        {this.renderRoundCounter()}
      </div>
    )
  }
}