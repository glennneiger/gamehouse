import React, {Component} from 'react';
import Canvas from 'react-canvas-draw';

export default class Present extends Component {

  constructor(props) {
    super(props);
    this.state={
      canvasProps: {
        loadTimeOffset: 0,
        lazyRadius: 0,
        brushRadius: 2,
        brushColor: "#000",
        catenaryColor: "#0a0302",
        gridColor: "rgba(150,150,150,0.17)",
        hideGrid: true,
        canvasWidth: 500,
        canvasHeight: 500,
        disabled: true,
        imgSrc: "",
        immediateLoading: true
      },
      displayItems: []
    }
  }


  componentDidMount(){
    this.startPresentation();
  }

  startPresentation = ()=> {

    let index = 0;
    let round = 0;

    const clearItem = index=> {
      let item = document.getElementById(`item-${index}`);
      if (!item) return;
      item.classList.add('slide-up');
      setTimeout(() => {
        let displayItems = this.state.displayItems.slice();
        displayItems.shift();
        this.setState({displayItems});
      }, 900);
    }

    const addItem = (round, index)=> {
      const {roundContent, playerOrder} = this.props;
      let displayItems = this.state.displayItems.slice();
      let newItem;
      let content = roundContent[round][playerOrder[index]];
      if (round%2===0) {
        newItem = <Canvas saveData={content} {...this.state.canvasProps} />
      } else {
        newItem=<div className="caption">{content}</div>
      }
      if (displayItems.length>0) {
        let lastItem = document.getElementById(`item-${round-1}`);
        if (lastItem) {
          lastItem.classList.remove('bottom');
          lastItem.classList.add('top');
        }
      }
      if (displayItems.length>1) {
        clearItem(round-2);
      }
      displayItems.push(<div key={round} className="item bottom slide-in-from-bottom" id={`item-${round}`}><div className="center-screen">{newItem}</div></div>);
      this.setState({displayItems});
    }

    const increment =()=>{
      round++;
      index++;
      let max = this.props.playerOrder.length;
      if (round>=max) {
        clearItem(round-1);
        clearItem(round-2);
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
    }, 3000);
  }

  renderItems = ()=> {
    return <div className="presentation">
      {this.state.displayItems}
    </div>
  }

  render() {
    return (
      <div className="Artist">
        {this.renderItems()}
      </div>
    )
  }
}