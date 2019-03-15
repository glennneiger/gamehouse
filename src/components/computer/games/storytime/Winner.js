import React, {Component} from 'react';
import {screens, read} from './helpers';

import WriterCard from './WriterCard';

class Winner extends Component {

  constructor(props) {
    super(props);
    this.state = {nextScreen: screens.next};
  }

  componentDidMount() {
    this.props.playVideo('storytime/winner');

    const {turn, winningText} = this.props;

    let nextScreen = screens.next; // the "who's next" screen. Usually the next screen after winner screen...
    if (turn===1 || turn===4 || turn===6) { // except on these turns, it goes to read story 
      nextScreen = screens.read;
      let vidIndex = 0;
      if (turn===4) vidIndex = 1;
      if (turn===6) vidIndex = 2;
      this.props.preloadVideo('storytime/read0' + vidIndex);
    } else if (turn===7) {
      nextScreen = screens.final; // and after last turn, it goes to final screen
      this.props.preloadVideo('storytime/final');
    } else {
      this.props.preloadVideo('storytime/next');
    }

    this.setState({nextScreen});

    setTimeout(()=> {read(winningText, this.handleFinishReading)}, 1100);
  }

  handleFinishReading = ()=> {
    const {turn} = this.props;
    
    this.props.playVoice(`winner/${turn}`, this.nextScreen);
  }

  nextScreen = ()=> {
    this.props.nextTurn();
    this.props.switchScreen(this.state.nextScreen);
  }


  render() {
    return (
      <div className="StoryTime Winner">
        <div className="center-screen">
          <WriterCard name={this.props.winner.name} img={this.props.winner.img} text={this.props.winningText} />
        </div>
      </div>
    )
  }
}

export default Winner;