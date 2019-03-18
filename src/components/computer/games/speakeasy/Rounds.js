import React, {Component} from 'react';
import {screens} from './helpers';

export default class Rounds extends Component {

  constructor(props) {
    super(props);
    const successes = this.props.successes.slice();
    this.state={
      successes
    };
  }

  componentDidMount() {
    const {turn} = this.props;
    if (turn===-1) {
      this.explainRules();
    }
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