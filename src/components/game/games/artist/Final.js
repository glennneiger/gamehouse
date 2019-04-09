import React, {Component} from 'react';

import Picture from './Picture';

import {screens} from './helpers';

import {games} from '../../../../helpers/games';
import {inputRequest} from '../../../../actions/';
import {requests} from '../../../../actions/requestTypes';

export default class Final extends Component {


  constructor(props) {
    super(props);
    this.state={
      leftCard: null,
      rightCard: null
    }
  }

  componentDidMount() {

    const {code, hostIndex} = this.props.room;
    // ask host (player[hostIndex]) if play again
    inputRequest(code, requests.playAgain, null, hostIndex, this.handleReceiveInput);

    this.startAnimation();

  }

  handleReceiveInput = input=>{
    if (input.message===true) { //playAgain
      this.props.switchScreen(screens.intro);
    } else {
      // go back to lobby
      this.props.switchGame(games.gameRoom);
    }
  }

  startAnimation = ()=> {
    const {roundContent, playerOrder} = this.props;
    let counter = 0;
    const numOfRounds = playerOrder.length;

    const getCounterPlus = addend=> {
      let res = counter + addend;
      if (res >= numOfRounds) {
        res -= numOfRounds;
      }
      return res;
    }

    const addPics = ()=> {

      const leftImgSrc = roundContent[0][playerOrder[counter]]; //img from first round 
      const leftCaption = roundContent[1][playerOrder[getCounterPlus(1)]] //caption from second round

      const finalDrawingRound = Math.floor((numOfRounds - 1) / 2) * 2;
      const finalTypingRound = Math.floor(numOfRounds / 2) * 2 - 1;

      const rightImgSrc = roundContent[finalDrawingRound][playerOrder[getCounterPlus(finalDrawingRound)]]; //img from final drawing round 
      const rightCaption = roundContent[finalTypingRound][playerOrder[getCounterPlus(finalTypingRound)]] //caption from final typing round

      const leftCard = (
        <div className="slide-card slide-in-from-left" id={"left-card-"+counter}>
          <Picture src={leftImgSrc} />
          <div className="caption-small">{leftCaption}</div>
        </div>
      );

      const rightCard = (
        <div className="slide-card slide-in-from-right" id={"right-card-"+counter}>
          <Picture src={rightImgSrc} />
          <div className="caption-small">{rightCaption}</div>
        </div>
      );

      this.setState({leftCard, rightCard})
    }


    const swapPics = ()=> {
      document.getElementById('left-card-'+counter).classList.add('slide-left');
      document.getElementById('right-card-'+counter).classList.add('slide-right');
      counter = getCounterPlus(1);
      setTimeout(()=>{
        this.setState({leftCard:null, rightCard:null});
        addPics();
      }, 500);
    }

    addPics();

    setInterval(() => {
      swapPics();
    }, 7500);

  }

  renderAnimation = ()=> {
    const {leftCard, rightCard} = this.state;

    return (
      <div className="row">
        <div className="left">
          {leftCard}
        </div>
        <div className="center">
          <div className="slide-in-from-top"><i className="fas fa-arrow-alt-circle-right"></i></div>
        </div>
        <div className="right">
          {rightCard}
        </div>
      </div>
    )
  }

  render() {

    return (
      <div className="Artist Final">
        <div className="v-80">{this.renderAnimation()}</div>
        <div className="v-15 bottom slide-in-from-bottom"><div id="play-again">Play Again?</div></div>
      </div>
    )
  }
}