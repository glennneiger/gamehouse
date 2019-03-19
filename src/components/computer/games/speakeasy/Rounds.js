import React, {Component} from 'react';
import {screens} from './helpers';

export default class Rounds extends Component {

  constructor(props) {
    super(props);
    let successes = this.props.successes.slice();
    if (successes.length>0) {
      successes.pop(); // start out not including latest stat. This will be added in as animation
    }
    this.state={
      successes,
      gameOver: false
    };
  }

  componentDidMount() {
    const {turn} = this.props;
    if (turn===-1) {
      this.explainRules();
    } else {

      this.props.playVideo('speakeasy/back');

      const {numRaids} = this.props;
      const gameOver = (numRaids===3 || (turn-numRaids)===3);

      if (gameOver) {

        this.props.playAudio('music', 'speakeasy/gameover');
        this.props.preloadMusic('speakeasy/0');
        this.props.preloadVideo('speakeasy/intro');
        this.setState({gameOver});

      } else {

        const {successes} = this.props;
        let music = 'speakeasy/';
        if (successes[successes.length-1]) { //if you just had a success
          //play happy music 
          music += `happy${turn-numRaids}`;
        } else {
          //play sad 
          music += `bad${numRaids-1}`;
        }
        this.props.playAudio('music', music);
        this.props.preloadMusic(`speakeasy/drinking${turn % 3}`);
        this.props.preloadVideo('speakeasy/drinking');

      }

      this.animateBoard();
    }
  }

  animateBoard = ()=> {
    
    setTimeout(() => {
      const successes = this.props.successes.slice();
      this.setState({successes});
    
      if (this.state.gameOver) {
  
        const {numRaids} = this.props;
  
        const speakeasyWin = numRaids < 3;
        this.handleGameOver(speakeasyWin);
  
      } else {
        setTimeout(() => {
          const {nextTurn, animateOut} = this.props;
          nextTurn();
          animateOut('board', screens.map)
        }, 3500);
      }
    }, 2000);
  }

  handleGameOver = speakeasyWin=> {
    let voice = 'gameover/';
    if (speakeasyWin) {
      voice += `speakeasywin/${this.props.numRaids}`;
    } else {
      voice += 'agentwin/0';
    }
    this.props.playVoice(voice, ()=>{this.props.animateOut('board', screens.final)});
  }

  explainRules = ()=> {

    const introduceRounds = ()=> {
      this.props.playVoice(`rules/rounds/0`, explainLose);
    }

    const explainLose = ()=> {
      this.props.playVoice(`rules/rounds/1`, explainWin);
      let successes = [];
      const interval = setInterval(() => {
        if (successes.length % 2 || successes.length===4) {
          successes.push(false);
        } else {
          successes.push(true);
        }
        this.setState({successes});
        if (successes.length===5) clearInterval(interval);
      }, 10);
    }

    const explainWin = ()=> {
      this.setState({successes:[true,false,true,false,true]})
      this.props.playVoice(`rules/rounds/2`, ()=>{this.props.animateOut('board', screens.slides)});
    }
    
    introduceRounds();
  }

  renderBoard = ()=> {
    const {successes} = this.state;
    const successIndicators = [];
    for (let i=0; i<5; i++) {
      let css = "indicator";
      let content = '';
      if (successes[i]) {
        css += ' success';
        content = <div><i className="fas fa-wine-glass-alt"></i></div>
      } else if (successes[i]===false) {
        css += ' fail';
        content = <div><i className="fas fa-taxi"></i></div>
      } else {
        css += ' number';
        content = <div>{i+1}</div>
      }
      successIndicators.push(<div className={css} key={i}>{content}</div>)
    }
    return (
      <div className="slide-in-from-bottom">
        <div className="board row" id="board">
          {successIndicators}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="Speakeasy Rounds center-screen">
        {this.renderBoard()}
      </div>
    )
  }
}