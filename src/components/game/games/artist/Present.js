import React, {Component} from 'react';
import Picture from './Picture';

export default class Present extends Component {

  constructor(props) {
    super(props);

    this.state={
      displayItems: [
        <div className="flex-item small-item" key="placeholder1"></div>,
        <div className="flex-item small-item" key="placeholder2"></div>
      ]
    }
  }


  componentDidMount(){
    const {title, playAudio, preloadMusic} = this.props;
    playAudio('music', `${title}/final`);
    preloadMusic(`lobby`);

    this.startPresentation();
  }

  startPresentation = ()=> {

    let index = 0;
    let round = 0;
    let counter = 0;

    const removeItem = removeAdditional=> {
      let flexbox = document.querySelector('.flexbox');
      if (!flexbox) return;
      let itemToRemove = flexbox.lastChild;
      if (removeAdditional) itemToRemove = itemToRemove.previousSibling;
      itemToRemove.classList.remove('new-item');
      itemToRemove.classList.add('remove-item');
      setTimeout(() => {
        let displayItems = this.state.displayItems.slice();
        displayItems.pop();
        this.setState({displayItems});
      }, 900);
    }

    const addItem = (round, index)=> {
      const {roundContent, playerOrder} = this.props;

      let size = 'small';

      let innerContent;
      let content = roundContent[round][playerOrder[index]];
      if (round%2===0) { 
        size = 'large'
        innerContent = <Picture src={content} />
      } else {
        innerContent = <div className="caption">{content}</div>
      }
      
      const newItem = <div key={round} className={`flex-item new-item ${size}-item`} id={`item-${round}`}>{innerContent}</div>;

      let displayItems = this.state.displayItems.slice();

      if (round===0) {
        removeItem(true);
        const blankItem=<div className="flex-item new-item small-item" key="placeholder"></div>;
        displayItems.unshift(blankItem);
      }

      removeItem();
      displayItems.unshift(newItem);
      this.setState({displayItems});
    }

    const increment =()=>{
      let max = this.props.playerOrder.length;
      round++;
      index++;
      if (round>=max) {
        counter++;
        if (counter===max) {
          counter = -1;
          this.props.nextScreen();
          clearInterval(interval);
          return;
        }
        round=0;
        index++;
      }
      if (index>=max) {
        index-=max;
      }
    }

    addItem(0,0);

    const interval = setInterval(() => {
      increment();
      if (counter===-1) return;
      addItem(round, index);
    }, 5000);
  }


  render() {
    return (
      <div className="Artist">
        <div className="flexbox">
          {this.state.displayItems}
        </div>
      </div>
    )
  }
}