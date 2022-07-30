import { Player } from "./types";
import * as PIXI from "pixi.js";

export function collisionCheck(
  player: Player,
  sprite: PIXI.Sprite
): string | null {
  if (!sprite.visible) return null;
  // get the vectors to check against
  var vX = player.x + player.width / 2 - (sprite.x + sprite.width / 2),
    vY = player.y + player.height / 2 - (sprite.y + sprite.height / 2),
    // add the half widths and half heights of the objects
    hWidths = player.width / 2 + sprite.width / 2,
    hHeights = player.height / 2 + sprite.height / 2,
    colDir = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        player.y += oY;
      } else {
        colDir = "b";
        player.y -= oY;
      }
    } else {
      if (vX > 0) {
        colDir = "l";
        player.x += oX;
      } else {
        colDir = "r";
        player.x -= oX;
      }
    }
  }
  return colDir;
}
