import * as PIXI from "pixi.js";
import { resolution } from "./resolution";
import { collisionCheck } from "./collisionCheck";
import { Platform, Player } from "./types";

export class Platforms {
  readonly stage: PIXI.Container;
  private platforms: Platform[] = [];
  public platformSpeed = 0;
  public bananaSize = 45;
  private tileSize = 120;

  constructor(stage: PIXI.Container) {
    this.stage = stage;
  }

  public init() {
    this.platforms = [];
    this.addPlatform(10, 600, false);
    this.addPlatform(200, 500);
    this.addPlatform(400, 600);
    this.addPlatform(600, 500);
    this.platformSpeed = 0;
  }

  public startTileMovement() {
    this.platformSpeed = 1;
  }

  public setTilePositions() {
    this.generateTile();
    for (let i = 0; i < this.platforms.length; i++) {
      this.platforms[i].tile.x -= this.platformSpeed;

      if (this.platforms[i].banana) {
        this.platforms[i].banana.x -= this.platformSpeed;
      }

      if (this.platforms[i].tile.x < -200) {
        this.platforms = this.platforms.filter(
          (platform) => platform !== this.platforms[i]
        );
      }
    }
  }

  public playerIsOnPlatform(player: Player): boolean {
    let isOnPlatform = false;
    for (let i = 0; i < this.platforms.length; i++) {
      const collision = collisionCheck(player, this.platforms[i].tile);
      // Bottom collision
      if (collision === "b") {
        isOnPlatform = true;
        break;
      }
    }
    return isOnPlatform;
  }

  public isCollidingWithBanana(player: Player): boolean {
    let isColliding = false;
    for (let i = 0; i < this.platforms.length; i++) {
      if (this.platforms[i].banana.visible) {
        const collision = collisionCheck(player, this.platforms[i].banana);
        if (collision) {
          this.platforms[i].banana.visible = false;
          isColliding = true;
        }
      }
    }

    return isColliding;
  }

  public generateTile() {
    const shouldAddTile =
      this.platforms[this.platforms.length - 1].tile.x < 600;
    if (!shouldAddTile) return;

    // Make sure tile starts outside of viewable area
    const xPos = resolution.width;

    const lastPlatformY = this.platforms[this.platforms.length - 1].tile.y;
    const maxReachable = lastPlatformY - 150;

    const bottom = resolution.height - this.tileSize;
    const yPos = Math.random() * (bottom - maxReachable) + maxReachable;

    this.addPlatform(xPos, yPos);
    this.setTilePositions();
  }

  public addPlatform(x: number, y: number, addBanana = true) {
    const tile = this.getTileSprite();
    tile.position.x = x;
    tile.position.y = y;

    const banana = this.getBanana(x, y);

    const platform: Platform = {
      banana,
      tile,
    };

    if (!addBanana) banana.visible = false;
    this.platforms.push(platform);
    this.stage.addChild(tile);
    this.stage.addChild(banana);
  }

  public getBanana(x: number, y: number) {
    var baseTexture = new PIXI.BaseTexture("./../assets/banana.png");
    var texture = new PIXI.Texture(baseTexture);
    const banana = PIXI.Sprite.from(texture);

    banana.position.x = x + 30;
    banana.position.y = y - 55;

    banana.width = this.bananaSize;
    banana.height = this.bananaSize;

    return banana;
  }

  public getTileSprite(): PIXI.Sprite {
    var baseTexture = new PIXI.BaseTexture("./../assets/tile.png");
    var texture = new PIXI.Texture(
      baseTexture,
      new PIXI.Rectangle(0, 0, this.tileSize, this.tileSize)
    );
    return PIXI.Sprite.from(texture);
  }
}
