export interface StateGame {
  currentLevel: number;
  WhoisTurning: number;
  CooldownTime: number;
  changeTurn: boolean;
  conditionWin: boolean;
  setupTeam1: boolean;
  setupTeam2: boolean;
  botDelayTime: number;
  delayTime: number;
}
export interface controlCameraGame {
  introGame: boolean;
  startCam1: boolean;
  startCam2: boolean;
}
