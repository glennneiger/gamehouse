import { database/*, storage */ } from '../Firebase';

import { games } from '../helpers/games';

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


// used by game to request input from device
export function inputRequest(roomCode, requestType, requestMessage, playersToReceive, callback) {
  const handleInput = (input, index)=> {
    if (input.type!==requestType) return;

    if (input.closeRequest) {
      database.ref(`rooms/${roomCode}/players/${index}/input`).off();
      database.ref(`rooms/${roomCode}/players/${index}`).update({
        request: null, //close it out
        input: null //close it out
      });
    }

    callback(input, index);
  }

  const sendRequest = playerIndex=> {
    database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({
      request: {type: requestType, message: requestMessage}
    });    
    watchForChange(roomCode, `players/${playerIndex}/input`, input=>handleInput(input, playerIndex));
  }

  if (Array.isArray(playersToReceive)) {
    playersToReceive.forEach(playerIndex => {
      sendRequest(playerIndex);
    });
  } else {
    sendRequest(playersToReceive); // if only one player was passed as arg as int
  }
}



// used by device to send input to game. 
export function sendInput(roomCode, playerIndex, requestType, message, closeRequest/*boolean*/) {
  database.ref(`rooms/${roomCode}`).once('value', async data => {
    const room = await data.toJSON();
    if (!room) return;
    let player = database.ref(`rooms/${roomCode}/players/${playerIndex}`);
    player.update({
      input: {message, closeRequest, type: requestType}
    });
  });
}

// used by game to close an open request, if for example, time runs out to submit
export async function closeRequest(roomCode, playerIndex) {
  await database.ref(`rooms/${roomCode}/players/${playerIndex}`).once('value', async data => {
    const player = await data.toJSON();
    if (!player) return;
    await database.ref(`rooms/${roomCode}/players/${playerIndex}/input`).off();
    await database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({  //send 'expired' first so that device gets notified to clear
      request: 'expired'
    });
    database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({
      request: null,
      input: null 
    });
  });
}


// returns players, IFF number of players changes (not if anything else changes within players)
export function watchForChangeInPlayers(roomCode, callback) {
  database.ref(`rooms/${roomCode}/players`).on('child_added', async data => {
    const value = await data.toJSON();
    if (!value) return;
    callback(value, 'added');
  });
  database.ref(`rooms/${roomCode}/players`).on('child_removed', async data => {
    const value = await data.toJSON();
    if (!value) return;
    callback(value, 'removed');
  });

}

export function watchForChange(roomCode, child, callback, notifyEvenIfNull) {
  database.ref(`rooms/${roomCode}/${child}`).on('value', async data => {
    const value = await data.toJSON();
    if (!value && !notifyEvenIfNull) return;
    callback(value);
  });
}

export function removeWatcher(roomCode, child) {
  database.ref(`rooms/${roomCode}/${child}`).off('value');
}


export async function getValue(roomCode, value) {
  const data = await database.ref(`rooms/${roomCode}/${value}`).once('value');
  const res = await data.toJSON();
  return res;
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
        if (room.totalPlayers===1 || !room.players) { //last player to leave
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