export const screens = {
  intro: 'intro',
  read: 'read',
  next: 'next',
  write: 'write',
  winner: 'winner',
  final: 'final'
}

export const getStoryStart = ()=>{
  const storyStarts = [
    'a little boy named Jacob, who lived in a cabin in the woods with his grandmother',
    'a mouse named Whiskers who lived in an old house',
    'a prince named Jacob who lived in a castle',
    'a frog named Hopper who lived in a swamp',
    'a dog named Belle who lived in a house in the suburbs',
    'a dog named Max who lived on a farm',
    'a man named Jacob who worked in an office',
    'a lobster named Lenny who lived in the ocean',
    'a boy named Jacob who worked at a diner in a small town',
    'an old man named Jacob who lived with his cat in an old house by a creek',
    'a man named Jacob who built robots',
    'a man named Jacob who owned his own bakery',
    'a bear named Fuzzy who lived in the woods',
    'a stray cat named Mittens who lived in the alley',
    'a single father named Jacob who worked at a car dealership',
    'a robot named Turbo',
    'a man named Jacob who was afraid of clowns',
    'a boy named Jacob who hated school',
    'a kitten named Princess who loved to play',
    'an old man named Jacob who played the violin',
    'a boy named Jacob who loved animals',
    'a firefighter named Jacob who was very brave',
    'a police officer named Jacob who lived in the big city',
    'a mechanic named Jacob who loved cars',
    'a whale named Finny who lived in the ocean',
    'a dragon named Puff-Puff who lived in a cave',
    'a unicorn named Misty who wanted to make friends',
    'a young man named Jacob who wanted to make a living as an artist',
    'a teddy bear named Chubby who came to life when no one was home',
    'an old man named Jacob who lived by the park',
    'a duck named Wobbles who lived by a pond',
    'a boy named Jacob who loved to ride horses',
    'a boy named Jacob who wanted to become an actor',
    'a young man named Jacob who wanted to be a professional athlete',
    'a boy named Jacob who loved sea shells',
    'a man named Jacob who had a magic wand',
    'a poor farming family who struggled to put food on the table',
    'an orphan boy named Jacob who lived on the streets',
    'an orphan named Jacob who longed for a family',
    'a stray dog named Spot who longed for a home',
    'a boy named Jacob who wanted to make friends but was very shy',
    'a doctor named Jacob who loved his job',
    'a boy named Jacob who wished he could fly',
    'a father named Jacob who lived in a small house with his five children',
    'a plumber named Jacob who wanted to be a singer',
    'a boy named Jacob who dreamed of meeting an alien from a far away planet',
    'a boy named Jacob who wished for a puppy',
    'a man named Jacob who couldn\'t afford a home',
    'a man named Jacob who was the mayor of a small town',
    'a boy named Jacob who went to school in a small town',
    'a man named Jacob who lived with his roommates in a small apartment in a big city',
    'a young man named Jacob who worked as a cashier at a grocery store',
    'a young man named Jacob who worked as a barista at a small coffee shop',
    'a man named Jacob who loved to fish',
    'an artist named Jacob who loved to paint',
    'a young man named Jacob who loved to dance',
    'a boy named Jacob who loved his dog',
    'a boy named Jacob who loved his horse',
    'a boy named Jacob who had a pet dragon named Sparky',
    'a boy named Jacob who wanted to meet Santa Claus',
    'a man named Jacob who worked at the zoo',
    'a boy named Jacob who wanted to be a pirate',
    'a boy named Jacob who came from a poor family',
    'a racecar driver named Jacob',
    'a brilliant scientist named Jacob',
    'a student named Jacob who took his assignments very seriously'
  ]

  const makeMale = text=> {
    const names = ['Michael','Chris','Joshua','Matthew','Jacob','Nicholas','Andrew','Daniel','Tyler','Joseph','Brandon','David','James','Ryan','John','Zachary','Justin','William','Anthony','Robert','Jonathan','Austin','Alexander','Kyle','Kevin','Thomas','Cody','Jordan','Eric','Benjamin','Aaron','Christian','Samuel','Dylan','Steven','Brian','Jose','Timothy','Nathan','Adam','Richard','Patrick','Charles','Sean','Jason','Cameron','Jeremy','Mark','Stephen','Jesse','Juan','Alex','Travis','Jeffrey','Ethan','Caleb','Luis','Jared','Logan','Hunter','Trevor','Bryan','Evan','Paul','Taylor','Kenneth','Connor','Dustin','Noah','Carlos','Devin','Gabriel','Ian','Nathaniel','Gregory','Derek','Corey','Scott','Bradley','Dakota','Antonio','Marcus','Blake','Garrett','Edward','Luke','Shawn','Peter','Seth','Mitchell','Adrian','Victor','Miguel','Shane','Chase','Isaac','Spencer','Lucas','Jack','Raymond'];

    const rnd = Math.floor(Math.random() * names.length);
    const name = names[rnd];
    return text.split('Jacob').join(name);
  }

  const makeFemale = text=> {
    const names = ['Jessica','Ashley','Emily','Sarah','Samantha','Amanda','Brittany','Elizabeth','Taylor','Megan','Hannah','Kayla','Lauren','Stephanie','Jennifer','Nicole','Alexis','Victoria','Amber','Alyssa','Courtney','Rebecca','Danielle','Jasmine','Brianna','Katherine','Alexandra','Madison','Morgan','Melissa','Michelle','Kelsy','Chelsea','Anna','Kimberly','Tiffany','Olivia','Mary','Christina','Allison','Abigail','Sara','Shelby','Heather','Haley','Maria','Kaitlyn','Laura','Erin','Andrea','Natalie','Jordan','Brooke','Julia','Emma','Vanessa','Erica','Sydney','Kelly','Kristen','Katelyn','Marissa','Amy','Crystal','Paige','Cassandra','Gabrielle','Katie','Lindsey','Destiny','Kathryn','Jacqueline','Shannon','Jenna','Angela','Savannah','Mariah','Sierra','Alicia','Miranda','Jamie','Catherine','Grace','Monica','Sabrina','Madline','Caroline','Molly','Erika','Mackenzie','Leah','Diana','Whitney','Cheyenne','Bailey','Christine','Angelica','Cynthia','Karen'];

    const rnd = Math.floor(Math.random() * names.length);
    const name = names[rnd];
    return text.split('Jacob').join(name).split(' his ').join(' her ').split(' he ').join(' she ').split(' man ').join(' woman ').split(' boy ').join(' girl ').split(' prince ').join(' princess ').split(' father ').join(' mother ');
  }

  let rnd = Math.floor(Math.random() * storyStarts.length);
  let storyStart = storyStarts[rnd];
  rnd = Math.floor(Math.random() * 2);
  rnd ? storyStart = makeMale(storyStart) : storyStart = makeFemale(storyStart);

  return storyStart;
}

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