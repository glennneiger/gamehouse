import React, {Component} from 'react';

import {inputRequest, closeRequest} from '../../../../actions/';
import {requests} from '../../../../actions/requestTypes';
import {screens, pairMemes} from './helpers';

import Timer from '../../other/Timer';
import Title from './Title';

export default class Vote extends Component {

  constructor(props) {
    super(props);
    const pairs = pairMemes(props.memes);
    this.state = {
      pairs,
      round: -1
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
    this.setState({round: this.state.round+1});
    document.getElementById('meme-0').classList.add('cross-zoom-in');
    setTimeout(() => {
      document.getElementById('meme-1').classList.add('cross-zoom-in');
    }, 300);
  }

  renderMemes = ()=> {
    const {memes} = this.props;
    const {pairs, round} = this.state;
    let renderedMemes = pairs[round].map((index,i)=>{
      const meme = memes[index];
      return <div className="meme" id={'meme-'+i} key={index}>
      <div className="caption">{meme.caption}</div>
      <img alt="meme" src={meme.image} />
    </div>
    });
    return <div id="memes">{renderedMemes}</div>
  }

  render() {
    if (this.state.round > -1) {
      return <div className="Meme Vote">
        {this.renderMemes()}
      </div>
    } else {
      return <Title lines={['Round Three:','Vote']} />;
    }
  }
}