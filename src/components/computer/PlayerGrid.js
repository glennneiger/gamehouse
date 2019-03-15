import React, {Component} from 'react';
import Card from './ProfileCard';


class PlayerGrid extends Component {
  constructor(props) {
    super(props);

    const rows = this.props.rows || 2;
    const max = this.props.max || 16;
    const across = max / rows;

    this.state = {
      cards: [], players: [], rows, across
    }
  }

  componentDidUpdate() {

    const oldPlayers = this.state.players.slice();
    const players = this.props.players.slice();

    if (players.length !== oldPlayers.length) {
      if (players.length > oldPlayers.length) {
        const playersToAdd = players.slice(oldPlayers.length, players.length);
        this.addCards(playersToAdd);
      } else {
        let indicesOfPlayersToKeep = players.map(player=>player.index);
        let playersToRemove = oldPlayers.filter(player => !indicesOfPlayersToKeep.includes(player.index));
        this.removeCards(playersToRemove);
      }
      this.setState({players});
    }
  }

  addCards = playersToAdd=> {
    let {players} = this.state;

    let cards = []; 
    // get cards from state.players, not from state.cards. state.cards might not reflect players that have been removed but are still in the process of being animated out. Therefore, state.players is more up-to-date
    players.forEach(player=>{
      const key = player.index;
      cards.push(this.createCard(player.name, player.img, key))
    });

    let interval = 10;
    playersToAdd.forEach(player => {
      const key = player.index;
      // add one at a time with slight intervals between for a smoother effect
      setTimeout(()=>{
        cards.push(this.createCard(player.name, player.img, key));    
        this.setState({cards});
      }, interval);
      interval += 150;
    });
  }

  createCard = (name, img, key) => {
    const {rows, across} = this.state;
    const {hideNames} = this.props;
    return (
      <div className={`flex-item new-item grow-${across}`} key={key} id={`flex-${key}`} style={{height: `${100/rows}%`}} >
        <Card name={name} img={img} hideName={hideNames} />
      </div>
    );
  }

  removeCards = playersToRemove=> {
    let interval = 10;
    playersToRemove.forEach(player=>{
      const i = player.index; 
      setTimeout(()=>{
        let item = document.getElementById(`flex-${i}`);
        item.classList.add('remove-item');
        item.addEventListener('animationend', ()=> {
          this.clearCard(i);
        })
      }, interval);
      interval += 150;
    });
  }

  clearCard = index=> {
    let {cards} = this.state;
    cards = cards.filter(card=> parseInt(card.key) !== index);
    this.setState({cards})
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