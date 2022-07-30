import * as PIXI from "pixi.js";

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  velX: number;
  velY: number;
  jumping: boolean;
  grounded: boolean;
}

export interface Platform {
  banana: PIXI.Sprite;
  tile: PIXI.Sprite;
}
