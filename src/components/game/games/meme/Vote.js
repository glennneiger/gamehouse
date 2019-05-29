import React, {Component} from 'react';

import {inputRequest} from '../../../../actions/';
import {requests} from '../../../../actions/requestTypes';
import {/*screens,*/ pairMemes} from './helpers';
import {getPlayersFromIndices} from '../../../../helpers/functions';

import Timer from '../../other/Timer';
import Title from './Title';

export default class Vote extends Component {

  constructor(props) {
    super(props);
    const pairs = pairMemes(props.memes);
    this.state = {
      pairs, // pair meme indices for each round 
      round: -1, // current round, starts at 0. At -1 we show title screen
      showStats: false, // show stats at the end of each round 
      startTimer: false, 
      votesReceived: 0, // votes received this round 
      points: [0,0], // points awarded to left meme and right meme, changes each round
      bonusRound: false, // are we currently in the bonus round
      dankestMeme: null  // meme index of the winner of the dankest meme bonus round
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
      if (input===null || !(input.message || input.message===0)) return;
      const {players, recordVote} = this.props;
      const {pairs, round, bonusRound} = this.state;
      let {votesReceived} = this.state;
      let memeIndex = pairs[round][input.message];
      recordVote(memeIndex, bonusRound);
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
    this.setState({startTimer: false});
    document.getElementById('meme-0').classList.add('slide-left');
    document.getElementById('meme-1').classList.add('slide-right');

    const {pairs, round, bonusRound} = this.state;
    const {memes, addPoints} = this.props;
    let {votesReceived} = this.state;

    if (bonusRound) {
      let dankestMeme = null;
      let pair = pairs[round];

        // first look at only votes from bonus round
      if (memes[pair[0]].bonusVotes > memes[pair[1]].bonusVotes) {
        dankestMeme = memes[pair[0]].index;
      } else if (memes[pair[1]].bonusVotes > memes[pair[0]].bonusVotes) {
        dankestMeme = memes[pair[1]].index;
        // if it's a tie, include votes from earlier
      } else if (memes[pair[0]].bonusVotes + memes[pair[0]].votes > memes[pair[1]].bonusVotes + memes[pair[1]].votes) {
        dankestMeme = memes[pair[0]].index;
      } else if (memes[pair[1]].bonusVotes + memes[pair[1]].votes > memes[pair[0]].bonusVotes + memes[pair[0]].votes) {
        dankestMeme = memes[pair[1]].index;
        // if it's still a tie, select at random
      } else {
        const rndX = Math.floor(Math.random()*2);
        dankestMeme = memes[pair[rndX]].index;
      }
      this.setState({dankestMeme});

    } else {
      let points = [0,0];
      pairs[round].forEach((memeIndex,i)=>{
        if (votesReceived) {
          points[i] = Math.round((memes[memeIndex].votes / votesReceived) * 1000);
        }
        addPoints(memes[memeIndex].uploader, points[i]);
        addPoints(memes[memeIndex].captioner, points[i]);
      });
      this.setState({points});
    }

    const interval = bonusRound ? 50000 : 4500;

    setTimeout(() => {
      this.setState({showStats: true});
      if (bonusRound) this.animateDankest();
      setTimeout(this.concludeRound, interval);
    }, 600);
  }

  animateDankest = ()=> {
    let counter = 0;
    let animate = setInterval(()=>{
      let letter = document.getElementById('dankest-'+counter);
      if (letter) letter.classList.add('cross-zoom-in');
      counter++;
      if (counter>6) {
        clearInterval(animate);
        setTimeout(() => {
          let dankest = document.getElementById('dankest');
          if (dankest) dankest.classList.add('cross-zoom-out');
        }, 1000);
      }
    }, 150);
  }

  concludeRound = ()=> {
    const {bonusRound} = this.state;
    if (bonusRound) {
      document.getElementById('meme-2').classList.add('cross-zoom-out');
    } else {
      document.getElementById('stat-0').classList.add('slide-left');
      document.getElementById('stat-1').classList.add('slide-right');
    }
    setTimeout(() => {
      this.setState({showStats: false});
      const {round, pairs} = this.state;
      if (round===pairs.length-1) {
        this.startBonusRound();
      } else {
        this.nextRound();
      }
    }, 600);
  }

  addBonusRoundMemes = ()=> {
    let pairs = this.state.pairs.slice();
    const sortedMemes = this.props.memes.slice().sort((a, b)=> b.votes - a.votes);
    let bonusPair = [];
    for (let i=0; i<2; i++) {
      bonusPair.push(sortedMemes[i].index);
    }
    pairs.push(bonusPair);
    this.setState({pairs});
  }

  startBonusRound = ()=> {
    this.addBonusRoundMemes();
    this.setState({bonusRound: true, round: -1});
    this.props.playVoice('bonus/0', ()=>{
      let title = document.querySelector('.Title');
      if (title) title.classList.add('cross-zoom-out');
      setTimeout(()=>{
        this.setState({bonusRound: true, round: this.state.pairs.length-2});
        this.nextRound();
      }, 800);
    });
  }

  renderMemes = ()=> {
    const {memes} = this.props;
    const {pairs, round} = this.state;
    let renderedMemes = pairs[round].map((index,i)=>{
      const meme = memes[index];
      return this.renderMeme(meme, i);
    });
    return <div id="memes">{renderedMemes}</div>
  }

  renderMeme = (meme, i) => (
    <div className={`meme${i===2 ? ' cross-zoom-in' : ''}`} id={'meme-'+i} key={i}>
      <div className="caption">{meme.caption}</div>
      <img alt="meme" src={meme.image} />
    </div>
  )
  

  renderStats = ()=> {
    const Credits = meme=> (
      <div className="credits">
        <div><i className="fas fa-camera"></i>&nbsp;:&nbsp;{getName(meme.uploader)}</div>
        <div><i className="far fa-edit"></i>&nbsp;:&nbsp;{getName(meme.captioner)}</div>
      </div>
    )
    
    const {bonusRound} = this.state;
    const {memes, players} = this.props;
    const getName = index => getPlayersFromIndices(index, players).name;
    let renderedStats;

    if (bonusRound) {
      const {dankestMeme} = this.state;
      renderedStats = <div>
          <div id="dankest">
            <div id="dankest-0">D</div>
            <div id="dankest-1">A</div>
            <div id="dankest-2">N</div>
            <div id="dankest-3">K</div>
            <div id="dankest-4">E</div>
            <div id="dankest-5">S</div>
            <div id="dankest-6">T</div>
          </div>
          {this.renderMeme(memes[dankestMeme], 2)}
        </div>
    } else {
      const {pairs, round, points} = this.state;
      renderedStats = pairs[round].map((index,i)=>{
        const meme = memes[index];
        const direction = i ? 'right' : 'left';
        return (
          <div className={`stat slide-in-from-${direction}`} id={'stat-'+i} key={index}>
            <div className="percent">{Math.round(points[i]/10)}%</div>
            {Credits(meme)}
            <div className="points">+{points[i]}</div>
          </div>
        )
      });
    }
    return <div id="stats">{renderedStats}</div>
  }

  // timeOut =()=> {
  //   const {room, players} = this.props;
  //   players.forEach(player=>{
  //     closeRequest(room.code, player.index);
  //   });
  //   this.concludeVoting();
  // }

  render() {
    const {round, bonusRound, startTimer, showStats} = this.state;
    if (round > -1) {
      return <div className="Meme Vote">
        <Timer seconds={30} startTimer={startTimer} onFinish={this.concludeVoting} code={this.props.room.code} />
        {showStats ? this.renderStats() : this.renderMemes()}
      </div>
    } else {
      const lines = bonusRound ? ['Bonus Round:','Dankest Meme'] : ['Round Three:','Vote'];
      return <Title lines={lines} />;
    }
  }
}