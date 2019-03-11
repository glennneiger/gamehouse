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
  return database.ref(`rooms/${roomCode}`).remove();
}


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