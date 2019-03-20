
  

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