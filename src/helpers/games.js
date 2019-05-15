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

export const gameMediaFiles = {
  [games.newRoom]: {
    video: ['0'],
    audio: ['0']
  },
  [games.gameRoom]: {
    video: ['0'],
    audio: ['0']
  },
  [games.storyTime]: {
    video: ['final','intro','next','read00','read01','read02','winner','write01','write02','write03','write04','write05','write06','write07','write00'],
    audio: ['0','1','2','3','final']
  },
  [games.artist]: {
    video: ['intro'],
    audio: ['0','1','2','3','final']
  },
  [games.speakEasy]: {
    video: ['back','drinking','intro','raid0','raid1','raid2'],
    audio: ['0','bad0','bad1','drinking0','drinking1','drinking2','gameover','happy0','happy1','happy2']
  }
}