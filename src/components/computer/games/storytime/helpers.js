export const screens = {
  intro: 'intro',
  read: 'read',
  next: 'next',
  write: 'write',
  winner: 'winner',
  scores: 'scores',
  final: 'final'
}

export const storyStarts = [
  'a little boy named Chuck, who lived in a cabin in the woods with his grandmother',
  'a mouse named Whiskers who loved peanut butter',
  'a princess named Victoria who lived in a castle',
  'a frog named Hopper who lived in a swamp',
  'a fairy named Belinda who could grant wishes',
  'a dog named Fluffy who lived in a house in the suburbs',
  'a dog named Max who lived on a farm'
]

export const getWritersPerTurn = numPlayers=> {
  // how many players compete each turn? 

  const breakdowns = [
    [2,2,2,2,2,2,2,2], // if there are 4 players 
    [2,2,2,3,3,3,3,2], // if there are 5 players 
    [3,3,3,3,3,3,3,3], // ... 
    [2,2,3,3,3,3,3,2],
    [3,3,3,3,3,3,3,3],
    [3,3,3,3,4,4,4,3],
    [4,4,4,4,4,4,4,3], // if there are 10 players 
  ]
  const breakdown = breakdowns[numPlayers - 4];

  return breakdown;
}

export const shuffle = arr=> {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


export const getPrompt = turn=> {
  const prompts = [
    'And every day',
    'Until one day',
    'Because of that',
    'Unfortunately',
    'And because of that',
    'Until finally',
    'And ever since that day',
    'And the moral of the story is'
  ]
  return prompts[turn];
}