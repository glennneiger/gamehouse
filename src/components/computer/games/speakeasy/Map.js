import React, {Component} from 'react';
import {screens} from './helpers';

export default class Map extends Component {


  componentDidMount() {
    const {turn, requestNewLocation} = this.props;
    if (turn===0) {
      requestNewLocation(()=>{this.props.animateOut('map', screens.breakdown)});
    } else if (turn===1) {
      
    }
  }

  render() {
    return (
      <div className="Speakeasy Map center-screen">
        <img src="assets/img/speakeasy/map.svg" alt="map" className="slide-in-from-bottom" id="map" />
      </div>
    )
  }
}