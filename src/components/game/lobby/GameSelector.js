import React, {Component} from 'react';

export default class GameSelector extends Component {

  renderTitles = ()=> {
    const {games, selection, previewGame, selectGame} = this.props;
    return games.map((game, i)=>{
      let css = '';
      if (selection===i) css='selected';
      return (
        <p className={css} key={i} onMouseOver={()=>previewGame(i)} onClick={selectGame}>{game.title}</p>
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