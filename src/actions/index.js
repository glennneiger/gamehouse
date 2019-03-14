import { /* auth, */ database/*, storage */ } from '../Firebase';

import { games } from './games';

const maxPlayers = 16;


export function createNewRoom(roomCode) {
  const host = {index: 0, name: ''};
  database.ref(`rooms/${roomCode}`).set({
    players: [], game: games.newRoom, nextIndex: 0, full: false, totalPlayers: 0, host
  });
}

export async function roomExists(roomCode) {
  let exists;
  await database.ref(`rooms/${roomCode}`).once('value', snapshot=> {
    exists = snapshot.hasChild('players');
  });
  return exists;
}

export function updateRoom(roomCode, update) {
  database.ref(`rooms/${roomCode}`).update(update);
}

export function selectGame(roomCode, game) {
  database.ref(`rooms/${roomCode}`).update({
    game
  });
}

export function inputRequest(roomCode, requestType, requestMessage, playersToReceive) {
  playersToReceive.forEach(playerIndex => {
    database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({
      request: {requestType, requestMessage}
    });    
  });
}

export function sendInput(roomCode, playerIndex, input) {
  database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({
    input
  });
}

// like sendInput, but closes the request
export function submitInput(roomCode, playerIndex, input) {
  database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({
    input, request: 'submitted'
  });
}

export function receiveSubmission(roomCode, playerIndex) {
  database.ref(`rooms/${roomCode}/players/${playerIndex}/input`).off();
  database.ref(`rooms/${roomCode}/players/${playerIndex}/request`).off();
  database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({
    request: null, //close it out
    input: null //close it out
  });
}

export function expireRequest(roomCode, playerIndex) {
  database.ref(`rooms/${roomCode}/players/${playerIndex}/input`).off();
  database.ref(`rooms/${roomCode}/players/${playerIndex}/request`).off();
  database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({
    request: 'expired',
    input: null 
  });
}


// returns players, IFF number of players changes (not if anything else changes within players)
export function watchForChangeInPlayers(roomCode, callback) {
  database.ref(`rooms/${roomCode}/players`).on('child_added', data => callback(data, 'added'));
  database.ref(`rooms/${roomCode}/players`).on('child_removed', data => callback(data, 'removed'));

}

export function watchForChange(roomCode, child, callback) {
  database.ref(`rooms/${roomCode}/${child}`).on('value', data => callback(data));
}

export function removeWatcher(roomCode, child) {
  database.ref(`rooms/${roomCode}/${child}`).off('value');
}


export function getValue(roomCode, value) {
  return database.ref(`rooms/${roomCode}/${value}`).once('value');
}


export function deleteRoom(roomCode) {
  database.ref(`rooms/${roomCode}`).remove();
};



export async function joinRoom(roomCode, name, img) {

  let res = await database.ref(`rooms/${roomCode}`).once('value', async data => {

    let room = await data.toJSON();

    if (room === null || room.totalPlayers===maxPlayers) {

      return false

    } else {

      const index = room.nextIndex;

      let hostName = room.host.name;
      const hostIndex = room.host.index;

      const newPlayer = {name, img, index};
      
      if (index===hostIndex) hostName = name;

      const nextIndex = room.nextIndex + 1;
      const totalPlayers = room.totalPlayers + 1;
      const full = (totalPlayers===maxPlayers);
      const host = {name: hostName, index: hostIndex};

      database.ref(`rooms/${roomCode}`).update({
         nextIndex, totalPlayers, full, host
      });
      database.ref(`rooms/${roomCode}/players/${index}`).set(newPlayer);

    }
  });

  return res.toJSON();
};

export function leaveRoom(roomCode, index) {
  if(!roomCode) return;

  database.ref(`rooms/${roomCode}`).once('value', async data => {
    let room = await data.toJSON();
    if (room === null) {
      return;
    } else {

      let {host, totalPlayers, nextIndex} = room;
      
      totalPlayers--;

      if (host.index===index) {
        //if the host is leaving the party, we need to find a new host!
        if (room.totalPlayers===1) { //last player to leave
          host.index=nextIndex;
          host.name=null; //this will get updated when the next player joins and becomes the new host
        } else {
          const players = Object.values(room.players);
          host.index = players[1].index; //next player in line
          host.name = players[1].name;
        }
      }
      database.ref(`rooms/${roomCode}`).update({
        host, totalPlayers, full: false 
      });
      database.ref(`rooms/${roomCode}/players/${index}`).remove();
    }
  });
}






//****** TRACK STATS *****/
export function incrementSessions() {
  if (devMode()) return;
  incrementStat('total-sessions');
}

export async function incrementGame(game) {
  if (devMode()) return;

  let data = await database.ref('stats/total-games').once('value');
  let games = await data.toJSON();
  games++;
  data = await database.ref('stats/total-sessions').once('value');
  let sessions = await data.toJSON();
  const gamesPerSession = Math.round(games/sessions);

  incrementStat(`games/${game}`);
  incrementStat('total-games');
  database.ref('stats').update({
    'avg-games-per-session' : gamesPerSession
  });
}

function incrementStat(stat) {
  database.ref(`stats/${stat}`).transaction(function(currentTotal) {
    return (currentTotal || 0) + 1;
  });
}

function devMode() {
  return (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
}