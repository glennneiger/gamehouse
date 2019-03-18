import React, {Component} from 'react';
import {screens, getNumAgents} from './helpers';

export default class Breakdown extends Component {

  constructor(props) {
    super(props);

    const numPlayers = this.props.room.players.length;
    const numAgents = getNumAgents(numPlayers) 
    this.state = {numAgents};
  }

  componentDidMount() {
    const {turn} = this.props;
    if (turn===-1) {
      this.props.playVideo('speakeasy/back');
      this.explainRules();
    } else if (turn===0) {
      this.props.playVoice('roles/0');
      this.slideIn('owner');
      this.slideIn('agents', 'left');
      this.slideIn('drinkers');
      const next = ()=> {
        this.props.nextTurn();
        this.props.animateOut('breakdown', screens.map);
      }
      this.props.assignRoles(next);
    }
  }

  slideIn = (id, fromDirection)=> {
    if (!fromDirection) fromDirection='right';
    document.getElementById(id).classList.add(`slide-in-from-${fromDirection}`);
  }

  explainRules = ()=> {

    const introduceOwner = ()=> {
      this.props.playVoice(`rules/breakdown/0`, introduceAgents);
      this.slideIn('owner');
    }

    const introduceAgents = ()=> {
      this.props.playVoice(`rules/breakdown/1-${this.state.numAgents}`, introduceDrinkers);
      this.slideIn('agents');
    }

    const introduceDrinkers = ()=> {
      const next = ()=> {this.props.animateOut('breakdown', screens.rounds)}
      this.props.playVoice(`rules/breakdown/2`, next);
      this.slideIn('drinkers');
    }
    introduceOwner();
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
            <div id='drinkers' className="line">{numPlayers-numAgents-1} Patrons</div>
          </div>
        </div>
      </div>
    )
  }
}