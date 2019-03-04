import { /* auth, */ database/*, storage */ } from '../Firebase';

import { games } from './games';

export function createNewRoom(roomCode, callback) {
  database.ref(`rooms/${roomCode}`).set({
    open: true, players: [], game: games.newRoom
  });

  watchForNewPlayers(roomCode, callback);
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

export async function joinRoom(roomCode, name, img) {

  let res = await database.ref(`rooms/${roomCode}`).once('value', data => {

    if (data.toJSON() === null) {

      return false

    } else {

      let room = data.toJSON();

      let players = [];

      if (room.open && room.players) {
        let playersObj = room.players;
        //convert obj to arr
        for (let i = 0; i < 10; i++) {
          if (playersObj[i]) {
            players.push(playersObj[i]);
          } else {
            i=10;
          }
        }
      }
      
      if (!room.open || (players.length >= 10)) {
        return false; //room is not open, or room is maxed out
      }

      let index = players.length;
      players.push({name, img, index}); // add the new player
      let open = players.length === 10 ? false : true; //cap room at 10

      database.ref(`rooms/${roomCode}`).update({
        players, open 
      });

    }
  });

  return res.toJSON();
};