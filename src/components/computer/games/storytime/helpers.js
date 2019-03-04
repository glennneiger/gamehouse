export const screens = {
  intro: 'intro',
  read: 'read',
  next: 'next',
  write: 'write',
  winner: 'winner',
  final: 'final'
}

export const storyStarts = [
  // 'test'
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
    // [2,3,3,3,3,3,3,2], // if there are 11 players 
    // [3,3,3,3,3,3,3,3], // if there are 12 players 
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

export const findWinners = (writers, votes) => {
  let maxVotes = 0;
  writers.forEach(writer => {
    if (votes[writer.index].length > maxVotes) {
      maxVotes = votes[writer.index].length;
    }    
  });
  let winners = []; //possible more than one winners if there's a tie
  writers.forEach(writer => {
    if (votes[writer.index].length === maxVotes) {
      winners.push(writer);
    }    
  });
  return winners;
}

export const read = (text, callback)=> {
  const speaker = {
    "name": "Alex",
    "lang": "en-US"
  }

  let msg = new SpeechSynthesisUtterance();

  msg.volume = 1; // 0 to 1
  msg.rate = 1.1; // 0.1 to 10
  msg.pitch = 1.5; // 0 to 2
  msg.text = text;
  const voice = speaker;
  msg.voiceURI = voice.name;
  msg.lang = voice.lang;
  speechSynthesis.speak(msg);  

  var _wait =()=> {
    if ( ! window.speechSynthesis.speaking ) {
      callback();
      return;
    }
    window.setTimeout( _wait, 200 );
  }
  _wait();
}