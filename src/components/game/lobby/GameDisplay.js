import React, {Component} from 'react';

export default class GameDisplay extends Component {


  render() {
    const {selection, games} = this.props;
    const {title, id, description, min, max, time} = games[selection];
    return (
      <div className="GameDisplay row">
        <img src={`./assets/img/gamecovers/${id}.png`} alt={title} />
        <div className="details column">
          <div className="description">{description}</div>
          <div className="row stats">
            <div className="player-count"><i className="fas fa-user-friends"></i><br/>{min}-{max}</div>
            <div className="play-time"><i className="far fa-clock"></i><br />{time} min </div>
          </div>
        </div>
      </div>
    )
  }

}