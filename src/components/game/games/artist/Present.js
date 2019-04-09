import React, {Component} from 'react';
import Canvas from 'react-canvas-draw';

export default class Present extends Component {

  constructor(props) {
    super(props);

    const width = Math.round(window.innerWidth/3);

    this.state={
      canvasProps: {
        loadTimeOffset: 0,
        lazyRadius: 0,
        brushRadius: 2,
        brushColor: "#000",
        hideGrid: true,
        canvasWidth: width,
        canvasHeight: width,
        disabled: true,
        imgSrc: "",
        immediateLoading: true
      },
      displayItems: [
        <div className="flex-item small-item" key="placeholder1"></div>,
        <div className="flex-item small-item" key="placeholder2"></div>
      ]
    }
  }


  componentDidMount(){
    this.startPresentation();
  }

  startPresentation = ()=> {

    let index = 0;
    let round = 0;

    const removeItem = removeAdditional=> {
      let itemToRemove = document.querySelector('.flexbox').lastChild;
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
        innerContent = <Canvas saveData={content} {...this.state.canvasProps} />
      } else {
        innerContent = <div className="caption">{content}</div>
      }
      
      const newItem = <div key={round} className={`flex-item new-item ${size}-item`} id={`item-${round}`}>{innerContent}</div>;

      let displayItems = this.state.displayItems.slice();

      if (round===0) {
        removeItem(true);
        const blankItem=<div className="flex-item new-item small-item" key="placeholder"></div>;
        displayItems.unshift(blankItem)
      }

      removeItem();
      displayItems.unshift(newItem);
      this.setState({displayItems});
    }

    const increment =()=>{
      round++;
      index++;
      let max = this.props.playerOrder.length;
      if (round>=max) {
        round=0;
        index++;
      }
      if (index>=max) {
        index-=max;
      }
    }

    addItem(0,0);

    setInterval(() => {
      increment();
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