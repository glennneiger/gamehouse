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
  'a mouse named Whiskers who lived in an old house',
  'a princess named Charlotte who lived in a castle',
  'a frog named Hopper who lived in a swamp',
  'a fairy named Belinda who could grant wishes',
  'a dog named Fluffy who lived in a house in the suburbs',
  'a dog named Max who lived on a farm',
  'a man named Fred who worked in an office',
  'a lobster named Lenny who lived in the ocean',
  'a girl named Kate who worked in a diner in a small town',
  'an old widow named Martha who lived with her cat in an old house by a creek',
  'a man Mr. Robertson who built robots',
  'a woman named Kendra who owned her own bakery',
  'a bear named Fuzzy who lived in the woods',
  'a stray cat named Tom who lived in the alley',
  'a single mother named Andrea who worked at a car dealership',
  'a robot named Turbo',
  'a man named Stephen who was afraid of clowns',
  'a boy named Jeff who hated school',
  'a kitten named Princess who loved to play',
  'an old man named Mr. Thompson who played the violin',
  'a girl named Alison who loved animals',
  'a firefighter named Mike who was very brave',
  'a police officer named Karen who lived in the big city',
  'a mechanic named Mike who loved cars',
  'a whale named Finny who lived in the ocean',
  'a dragon named Puff-Puff who lived in a cave',
  'a unicorn named Misty who wanted to make friends',
  'a young woman named Vanessa who wanted to make a living as an artist',
  'an artist named Greg who longed for love',
  'a teddy bear named Chubby who came to life when no one was home',
  'an old man named Phil who lived by the park',
  'a duck named Wobbles who lived by a pond',
  'a girl named Anne who loved to ride horses',
  'a girl named Courtney who wanted to become an actor',
  'a young man named Roger who wanted to be a professional athlete',
  'a girl named Shelly who loved sea shells',
  'a woman named Denice who had a magic wand',
  'a poor farming family who struggled to put food on the table',
  'an orphan boy named Paul who lived on the streets of London',
  'an orphan named Sally who longed for a family',
  'a stray dog named Spot who longed for a home',
  'a girl named Kate who wanted to make friends but was very shy' 
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