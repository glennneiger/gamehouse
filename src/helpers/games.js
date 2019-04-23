export const games = {
  landing: 'landing',
  newRoom: 'new-room',
  gameRoom: 'game-room',
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