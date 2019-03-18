import React, {Component} from 'react';


export default class Map extends Component {


  componentDidMount() {
    const {turn, requestNewLocation} = this.props;
    if (turn===0) {
      requestNewLocation();
    }
  }

  render() {
    return (
      <div className="Speakeasy Map center-screen">
        <img src="assets/img/speakeasy/map.svg" alt="map" className="slide-in-from-bottom"/>
      </div>
    )
  }
}