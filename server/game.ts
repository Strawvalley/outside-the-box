export class Game {
  started: boolean;
  admin: string;
  state: 'not-started' | 'thinking' | 'guessing' | 'round-finished' | 'game-finished';

  totalRounds: number;
  round: number;
  points: number;
  secondsLeft: number;

  constructor(admin: string) {
    this.admin = admin;

    this.started = false;
    this.state = 'not-started';
    this.totalRounds = 10;
    this.round = 1;
    this.points = 0;
    this.secondsLeft = 30;
  }

  public startGame() {
    this.started = true;
    this.state = 'thinking';
  }
}