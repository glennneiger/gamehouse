import { /* auth, */ database/*, storage */ } from '../Firebase';

import { games } from './games';

const maxPlayers = 16;


export function createNewRoom(roomCode, callback) {
  database.ref(`rooms/${roomCode}`).set({
    open: true, players: [], game: games.newRoom
  });

  watchForNewPlayers(roomCode, callback);
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



export function watchForNewPlayers(roomCode, callback) {
  database.ref(`rooms/${roomCode}/players`).on('child_added', data => callback(data));
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

  let res = await database.ref(`rooms/${roomCode}`).once('value', data => {

    if (data.toJSON() === null) {

      return false

    } else {

      let room = data.toJSON();

      let players = [];
      let index = 0;

      if (room.open && room.players) {
        let playersObj = room.players;
        //convert obj to arr
        players = Object.values(playersObj);
        index = players[players.length - 1].index + 1;
      }
      
      if (!room.open || (players.length >= maxPlayers)) {
        return false; //room is not open, or room is maxed out
      }

      players.push({name, img, index}); // add the new player
      let open = players.length === maxPlayers ? false : true; //cap room at maxPlayers

      database.ref(`rooms/${roomCode}`).update({
        players, open 
      });

    }
  });

  return res.toJSON();
};






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