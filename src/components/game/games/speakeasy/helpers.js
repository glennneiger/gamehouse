export const screens = {
  intro: 'intro',
  breakdown: 'breakdown',
  map: 'map',
  owner: 'owner',
  party: 'party',
  rounds: 'rounds',
  slides: 'slides',
  final: 'final'
}

export const getNumAgents = numPlayers=> {
  let numAgents;
  if (numPlayers < 8) {
    numAgents = 2;
  } else if (numPlayers < 11) {
    numAgents = 3;
  } else {
    numAgents = 4;
  }
  return numAgents;
}

export const assignAgents = (playersArr, owner)=> {
  let players = playersArr.slice();
  const numAgents = getNumAgents(players.length);
  let agents = [];
  while (agents.length < numAgents) {
    let rndX = Math.floor(Math.random()*players.length);
    if (players[rndX].index !== owner) {
      agents.push(players[rndX].index);
      players.splice(rndX, 1);
    }
  }
  return agents;
}