
  

export const getPlayersFromIndices = (indices, players)=> {
  const getPlayerFromIndex = index => {
    return players.filter(player=>{
      return player.index === index;
    })[0];
 }
 if (Array.isArray(indices)) {
   return indices.map(index=>{
     return getPlayerFromIndex(index);
   });
 } else {
   return getPlayerFromIndex(indices);
 }
}


export const shuffle = arr=> {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}