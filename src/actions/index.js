import { auth, database, storage } from '../Firebase';

import { games } from './games';

export function createNewRoom(roomCode, callback) {
  database.ref(`rooms/${roomCode}`).set({
    open: true, players: [], game: games.newRoom
  });

  connectToRoom(roomCode, callback);
}

export function selectGame(roomCode, game) {
  database.ref(`rooms/${roomCode}`).update({
    game
  });
}

export function connectToRoom(roomCode, callback) {
  database.ref(`rooms/${roomCode}`).on('value', data => callback(data));
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


      players.push({name, img}); // add the new player
      let open = players.length === 10 ? false : true; //cap room at 10

      database.ref(`rooms/${roomCode}`).update({
        players, open 
      });

    }
  });

  return res.toJSON();
};