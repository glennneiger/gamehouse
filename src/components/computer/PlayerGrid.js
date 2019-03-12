import React, {Component} from 'react';
import Card from './ProfileCard';


class PlayerGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [], players: []
    }
  }

  componentDidUpdate() {
    const {players} = this.props;
    let {cards} = this.state;
    if (players.length !== cards.length) {
      if (players.length > cards.length) {
        const i = players.length-1;
        const newPlayer = players[i];
        const key = players[i].index;
        cards.push(
          <div className="flex-item new-item" key={key} id={`flex-${key}`} >
            <Card name={newPlayer.name} img={newPlayer.img} />
          </div>
        )
        this.setState({cards, players})
      } else {
        const filtered = this.state.players.filter(player => players.indexOf(player)<0);
        const i = filtered[0].index; // should only remove one at a time
        let item = document.getElementById(`flex-${i}`);
        item.classList.add('remove-item');
        item.addEventListener('animationend', ()=> { //  webkitAnimationEnd oAnimationEnd MSAnimationEnd
          cards = cards.filter(card=> parseInt(card.key) !== i);
          this.setState({cards, players})
        });
      }
    }
  }

  renderCards = ()=> {
    return (
      <div className="flexbox">
        {this.state.cards}
      </div>
    )
  }

  render () {
    return (
      <div className="PlayerGrid">
        {this.renderCards()}
      </div>
    )
  }
};

export default PlayerGrid;