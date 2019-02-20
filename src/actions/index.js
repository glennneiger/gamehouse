import { auth, database, storage } from '../Firebase';

export function createNewRoom(roomCode, callback) {
  database.ref(`rooms/${roomCode}`).set({
    open: true, players: []
  });

  database.ref(`rooms/${roomCode}`).on('value', data => callback(data));
}

export function joinRoom(roomCode, name, img) {

  let roomAvailable = false;
  let players = [];

  database.ref(`rooms/${roomCode}`).once('value', data => {

    if (data.toJSON() === null) {return false}
    let room = data.toJSON();
    roomAvailable = room.open; //true or false

    if (roomAvailable && room.players) {
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
  })
  .then(()=>{
    if (roomAvailable && players.length < 10) {
      //if you're the first player in, you're the vip
      let playerId = players.length;
      let vip = playerId===0 ? true : false;
      players.push({name, img});
      database.ref(`rooms/${roomCode}`).set({
        players, open: true 
      });
      return {vip, entered: true, playerId};
    }
  });
};