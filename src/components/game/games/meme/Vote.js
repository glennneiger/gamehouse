import React, {Component} from 'react';

import {inputRequest, closeRequest} from '../../../../actions/';
import {requests} from '../../../../actions/requestTypes';
import {screens, pairMemes} from './helpers';
import {getPlayersFromIndices} from '../../../../helpers/functions';

import Timer from '../../other/Timer';
import Title from './Title';

export default class Vote extends Component {

  constructor(props) {
    super(props);
    const pairs = pairMemes(props.memes);
    this.state = {
      pairs,
      round: -1,
      showStats: false,
      startTimer: false,
      votesReceived: 0,
      points: [0,0]
    }
  }


  componentDidMount() {
    this.props.playAudio('music', '0');
    this.props.playVideo('vote');
    this.props.playVoice('vote/0', ()=>{
      document.querySelector('.Title').classList.add('cross-zoom-out');
      setTimeout(this.nextRound, 800);
    });
  }

  nextRound = ()=> {
    const receiveVote = input => {
      const {players, recordVote} = this.props;
      const {pairs, round} = this.state;
      let {votesReceived} = this.state;
      let memeIndex = pairs[round][input.message];
      recordVote(memeIndex);
      votesReceived++;
      this.setState({votesReceived});
      if (votesReceived===players.length) {
        this.concludeVoting();
      }
    }

    this.setState({round: this.state.round + 1, votesReceived: 0});
    document.getElementById('meme-0').classList.add('cross-zoom-in');
    setTimeout(() => {
      document.getElementById('meme-1').classList.add('cross-zoom-in');

      const {players, room} = this.props;
      players.forEach(player=>{
        inputRequest(room.code, requests.meme.vote, null, player.index, receiveVote);
      });
      this.setState({startTimer:true});
    }, 300);
  }

  concludeVoting = ()=> {
    document.getElementById('meme-0').classList.add('slide-left');
    document.getElementById('meme-1').classList.add('slide-right');

    const {pairs, round} = this.state;
    const {memes, addPoints} = this.props;
    let {votesReceived} = this.state;
    let points = [0,0];
    pairs[round].forEach((memeIndex,i)=>{
      points[i] = Math.round((memes[memeIndex].votes / votesReceived) * 1000);
      addPoints(memes[memeIndex].uploader, points[i]);
      addPoints(memes[memeIndex].captioner, points[i]);
    });
    this.setState({points, startTimer: false});

    setTimeout(() => {
      this.setState({showStats: true});
      setTimeout(this.concludeRound, 4500);
    }, 600);
  }

  concludeRound = ()=> {
    document.getElementById('stat-0').classList.add('slide-left');
    document.getElementById('stat-1').classList.add('slide-right');
    setTimeout(() => {
      this.setState({showStats: false});
      const {round, pairs} = this.state;
      if (round<pairs.length-1) {
        this.nextRound();
      } else {
        this.props.switchScreen(screens.final);
      }
    }, 600);

  }

  renderMemes = ()=> {
    const {memes} = this.props;
    const {pairs, round} = this.state;
    let renderedMemes = pairs[round].map((index,i)=>{
      const meme = memes[index];
      return (
        <div className="meme" id={'meme-'+i} key={index}>
          <div className="caption">{meme.caption}</div>
          <img alt="meme" src={meme.image} />
        </div>
      )
    });
    return <div id="memes">{renderedMemes}</div>
  }

  renderStats = ()=> {
    const {memes, players} = this.props;
    const {pairs, round, points} = this.state;
    const getName = index => getPlayersFromIndices(index, players).name;
    let renderedStats = pairs[round].map((index,i)=>{
      const meme = memes[index];
      const direction = i ? 'right' : 'left';
      return (
        <div className={`stat slide-in-from-${direction}`} id={'stat-'+i} key={index}>
          <div className="percent">{Math.round(points[i]/10)}%</div>
          <div><i className="fas fa-camera"></i>&nbsp;:&nbsp;{getName(meme.uploader)}</div>
          <div><i className="far fa-edit"></i>&nbsp;:&nbsp;{getName(meme.captioner)}</div>
          <div className="points">+{points[i]}</div>
        </div>
      )
    });
    return <div id="stats">{renderedStats}</div>
  }

  timeOut =()=> {
    const {room, players} = this.props;
    players.forEach(player=>{
      closeRequest(room.code, player.index);
    });
    this.concludeVoting();
  }

  render() {
    if (this.state.round > -1) {
      return <div className="Meme Vote">
        <Timer seconds={2000} startTimer={this.state.startTimer} onFinish={this.timeOut} code={this.props.room.code} />
        {this.state.showStats ? this.renderStats() : this.renderMemes()}
      </div>
    } else {
      return <Title lines={['Round Three:','Vote']} />;
    }
  }
}