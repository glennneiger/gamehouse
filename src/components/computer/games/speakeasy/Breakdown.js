import React, {Component} from 'react';
import {screens} from './helpers';

export default class Breakdown extends Component {

  constructor(props) {
    super(props);

    const numPlayers = this.props.room.players.length;
    let numAgents;
    if (numPlayers < 8) {
      numAgents = 2;
    } else if (numPlayers < 11) {
      numAgents = 3;
    } else if (numPlayers < 14) {
      numAgents = 4;
    } else {
      numAgents = 5;
    }
    this.state = {numAgents};
  }

  componentDidMount() {
    this.props.playVideo('speakeasy/back');
    const {turn} = this.props;
    if (turn===-1) {
      this.explainRules();
    }
  }

  explainRules = ()=> {

    const slideIn = id=> {
      document.getElementById(id).classList.add('slide-in-from-right');
    }

    const introduceOwner = ()=> {
      this.props.playVoice(`rules/breakdown/0`, introduceAgents);
      slideIn('owner');
    }

    const introduceAgents = ()=> {
      this.props.playVoice(`rules/breakdown/1-${this.state.numAgents}`, introduceDrinkers);
      slideIn('agents');
    }

    const introduceDrinkers = ()=> {
      const next = ()=> {this.nextScreen(screens.rounds)}
      this.props.playVoice(`rules/breakdown/2`, next);
      slideIn('drinkers');
    }

    introduceOwner();
  }

  nextScreen = screen=> {
    document.getElementById('breakdown').classList.add('slide-up');
    setTimeout(() => {
      this.props.switchScreen(screen);
    }, 1000);
  }

  render() {
    const {numAgents} = this.state;
    const numPlayers = this.props.room.players.length;
    return (
      <div className="Speakeasy Breakdown center-screen">
        <div className="column" id="breakdown">
          <div className="v-5"></div>
          <div className="v-25">
            <div id='owner' className="line">1 Boss</div>
          </div>
          <div className="v-25">
            <div id='agents' className="line">{numAgents} Agents</div> 
          </div>
          <div className="v-25">
            <div id='drinkers' className="line">{numPlayers-numAgents-1} Drinkers</div>
          </div>
        </div>
      </div>
    )
  }
}