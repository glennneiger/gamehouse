export const games = {
  landing: 'landing',
  newRoom: 'newroom',
  gameRoom: 'lobby',
  storyTime: 'storytime',
  speakEasy: 'speakeasy',
  artist: 'passtheart',
  meme: 'meme'
};

export const gameDetails = [
  {
    id: games.storyTime,
    title: 'Story Time',
    description: "There's no telling what hilarious stories will be told when all your friends have a say!",
    min: 3,
    max: 16,
    time: 20
  },
  {
    id: games.meme,
    title: 'Meme U',
    description: "Turn your friends' photos into dank memes!",
    min: 3,
    max: 16,
    time: 15
  },
  {
    id: games.speakEasy,
    title: 'Speakeasy',
    description: 'A game for Prohibition era bootleggers! Keep the speakeasy in business. But let an undercover agent in by mistake and get shut down!',
    min: 5,
    max: 12,
    time: 20
  },
  {
    id: games.artist,
    title: 'Pass the Art',
    description: "A game of telephone for sketchers – Draw. Interpret. Repeat.",
    min: 5,
    max: 16,
    time: 15
  }
];

const getAudio = (game) => {

  let audio = [];

  const addFiles = (folder, from, through) => {
    if (through || through===0) {
      for (let i=from; i<=through; i++) {
        audio.push(`${folder}/${i}`);
      }
    } else {
      audio.push(`${folder}/${from}`);
    }
  }

  if (game===games.storyTime){
    addFiles('intro', 0, 1);
    addFiles('next', 0, 7);
    addFiles('read', 0);
    addFiles('read', 7);
    addFiles('tie', 0);
    addFiles('voteclose', 0, 7);
    addFiles('voteopen', 0, 7);
    addFiles('winner', 0, 7);
  } else if (game===games.artist){
    addFiles('intro', 0);
    addFiles('rounds', 0, 15);
    addFiles('timesup', 0, 15);   
  } else if (game===games.speakEasy){
    addFiles('gameover/agentwin', 0);
    addFiles('gameover/speakeasywin', 0, 2);
    addFiles('intro', 0, 1);
    addFiles('newlocation', 0, 2);
    addFiles('party/commentary', 0, 4);
    addFiles('party/intro', 1, 5);
    addFiles('party/intro/newlocation', 1, 2);
    addFiles('party/noraid', 1, 5);
    addFiles('party/raid', 1, 4);
    addFiles('party/raid/final', 0);
    addFiles('party/raid/onlyone', 0);
    addFiles('party/whoelse', 0, 4);
    addFiles('restart', 0);
    addFiles('roles', 0);
    addFiles('rules/breakdown', 0);
    addFiles('rules/breakdown', '1-2');
    addFiles('rules/breakdown', '1-3');
    addFiles('rules/breakdown', '1-4');
    addFiles('rules/breakdown', '1-5');
    addFiles('rules/breakdown', 2);
    addFiles('rules/rounds', 0, 2);
    addFiles('rules/slides', 0, 5);
    addFiles('sendinvitation', 1, 5);
    addFiles('sendinvitation/afterraid', 1, 2);
    addFiles('sendinvitation/alreadyfull', 0);
    addFiles('wheretogo', 1, 5);
  } else if (game===games.meme){
    addFiles('intro', 0);
    addFiles('upload', 0);
    addFiles('caption', 0);
  }
  return audio;
}

export const gameMediaFiles = {
  [games.newRoom]: {
    video: ['0'],
    music: ['0'],
    audio: []
  },
  [games.gameRoom]: {
    video: ['0'],
    music: ['0'],
    audio: []
  },
  [games.storyTime]: {
    video: ['final','intro','next','read00','read01','read02','winner','write01','write02','write03','write04','write05','write06','write07','write00'],
    music: ['0','1','2','3','final'],
    audio: getAudio(games.storyTime)
  },
  [games.artist]: {
    video: ['intro'],
    music: ['0','1','2','3','final'],
    audio: getAudio(games.artist)
  },
  [games.meme]: {
    video: ['intro','upload','caption','vote'],
    music: ['0','1','2'],
    audio: getAudio(games.meme)
  },
  [games.speakEasy]: {
    video: ['back','drinking','intro','raid0','raid1','raid2'],
    music: ['0','bad0','bad1','drinking0','drinking1','drinking2','gameover','happy0','happy1','happy2'],
    audio: getAudio(games.speakEasy)
  }
}
