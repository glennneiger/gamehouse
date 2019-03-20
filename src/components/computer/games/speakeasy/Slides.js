import React, {Component} from 'react';
import {screens} from './helpers';
import {closeRequest} from '../../../../actions/index';

export default class Slides extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [
        {src: 'map.svg', alt: 'Map'}, 
        {src: '0.jpg', alt: 'Mailboxes'}, 
        {src: '1.jpg', alt: 'Raid'}, 
        {src: '2.jpg', alt: 'Speakeasy'}, 
        {src: '3.jpg', alt: 'Agent'}, 
        {src: 'map.svg', alt: 'Map'}, 
      ],
      counter:-1,
      images: []
    };
  }

  componentDidMount() {
    this.nextSlide();
  }
  
  nextSlide = ()=> {


    let {counter, slides, images} = this.state;

    if (counter >= 0) {
      let oldSlide=document.getElementById(`slide-${counter}`);
      oldSlide.classList.add('slide-left');
    }

    counter++;

    if (counter===slides.length) {
      setTimeout(() => {
        const {code, hostIndex} = this.props.room;
        closeRequest(code, hostIndex); // close out option to Skip
        this.props.nextTurn();
        this.props.switchScreen(screens.owner);
      }, 1000);
      return;
    }

    images.push(<div id={`slide-${counter}`} className='slide-in-from-right wrapper' key={counter}>
      <div className="slide">
      <img  
        src={`assets/img/speakeasy/${slides[counter].src}`} 
        alt={slides[counter].alt} 
    /></div></div>);

    this.setState({counter, images});

    this.props.playVoice(`rules/slides/${counter}`, this.nextSlide);
  }


  render() {

    return (
      <div className="Speakeasy Slides center-screen" id='slides'>
        {this.state.images}
      </div>
    )
  }
}