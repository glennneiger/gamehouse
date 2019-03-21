import React, {Component} from 'react';

export default class GameSelector extends Component {

  renderTitles = ()=> {
    const {games, selection} = this.props;
    return games.map((game, i)=>{
      let css = '';
      if (selection===i) css='selected';
      return (
        <p className={css} key={i}>{game.title}</p>
      )
    });
  }

  render() {
    return (
      <div className="GameSelector">
        {this.renderTitles()}
      </div>
    )
  }

}