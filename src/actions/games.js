export const games = {
  landing: 'landing',
  newRoom: 'new-room',
  gameRoom: 'game-room',
  storyTime: 'story-time',
  speakEasy: 'speak-easy'
};

export const gameDetails = [
  {
    id: games.storyTime,
    title: 'Story Time',
    folder: 'storytime',
    description: "There's no telling what hilarious stories will be told when all your friends have a say!",
    min: 3,
    max: 16,
    time: 30
  },
  {
    id: games.speakEasy,
    title: 'Speakeasy',
    folder: 'speakeasy',
    description: 'A game for Prohibition era bootleggers! Keep the speakeasy in business. But let an undercover agent in by mistake and get shut down!',
    min: 5,
    max: 16,
    time: 35
  }
];