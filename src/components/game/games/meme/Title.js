/*

props.lines = Arr[String]

Takes lines of text and animates them into splash screen 
one word at a time

*/

import React, {Component} from 'react';

export default class Title extends Component {

  constructor(props) {
    super(props);
    const words = props.lines.map(line=>line.split(' '));
    this.state = {
      words
    }
  }

  componentDidMount() {
    let i=0;
    let j=0;
    const animate = setInterval(()=>{
      const words=this.state.words.slice();
      document.getElementById(`line-${i}-word-${j}`).classList.add('cross-zoom-in');
      j++;
      if (j>words[i].length-1) {
        j=0;
        i++;
        if (i>words.length-1) {
          clearInterval(animate);
        }
      }
    }, 350);
  }

  render() {

    const {words} = this.state;

    const renderedLines = words.map((line,i)=>{
      const renderedWords = line.map((word,j)=> {
        return <div key={j} id={`line-${i}-word-${j}`} className="word">{word}</div>
      });
      return <div key={i} className="line">
        {renderedWords}
      </div>
    });

    return (
      <div className="Meme Title center-screen">
        {renderedLines}
      </div>
    )
  }
}