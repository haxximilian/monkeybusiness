import * as PIXI from "pixi.js";
import { collisionCheck } from "./collisionCheck";
import { Player, Platform } from "./types";

const height = 800;
const width = 800;
const maxPlatformSpeed = 15;
const friction = 0.8;
const gravity = 0.4;
const tileSize = 120;
const bananaSize = 45;
const keys: any = [];

let platforms: Platform[] = [];
let bananaCount = 0;
let platformSpeed = 0;
let scoreText: PIXI.Text | null = null;

let player: Player = {
  x: 55,
  y: 500,
  width: 25,
  height: 25,
  speed: 5,
  velX: 0,
  velY: 0,
  jumping: true,
  grounded: false,
};

document.body.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});

var renderer = PIXI.autoDetectRenderer({
  width: width,
  height: height,
  transparent: true,
});

document.body.appendChild(renderer.view);
var stage = new PIXI.Container();

// Score
scoreText = new PIXI.Text(`Score: ${bananaCount.toString()}`);
scoreText.name = "scoreText";
scoreText.x = 50;
scoreText.y = 50;
stage.addChild(scoreText);

const loader = PIXI.Loader.shared;
loader.add("monkey", "./../assets/Run.png").load(setup);

let monkey: any = null;
init();

function setup(loader: any, resources: any) {
  const textures = [];

  for (let i = 0; i < 5; i++) {
    const texture: PIXI.Texture = PIXI.Texture.from("./../assets/Run.png");
    const rect = new PIXI.Rectangle(i * 32, 0, 32, 32);

    texture.frame = rect;
    textures.push(texture);
  }
  monkey = new PIXI.AnimatedSprite(textures);

  monkey.y += player.y;
  monkey.x += player.x;

  monkey.scale.set(1.5, 1.5);

  monkey.autoUpdate = true;
  monkey.animationSpeed = 0.01;
  monkey.updateAnchor = true; // update anchor for each animation frame
  stage.addChild(monkey);
  monkey.play();
}

function setPlayerPosition(x: number, y: number) {
  if (!player || !monkey) return;
  monkey.y = y;
  monkey.x = x;

  if (!monkey) return;
  monkey.anchor.x = 0.5;
  monkey.anchor.y = 0.5;
  monkey.position.x = x;
  monkey.position.y = y;

  stage.addChild(monkey);
}

function getTileSprite(): PIXI.Sprite {
  var baseTexture = new PIXI.BaseTexture("./../assets/tile.png");
  var texture = new PIXI.Texture(
    baseTexture,
    new PIXI.Rectangle(0, 0, tileSize, tileSize)
  );
  return PIXI.Sprite.from(texture);
}

function getBanana(x: number, y: number) {
  var baseTexture = new PIXI.BaseTexture("./../assets/banana.png");
  var texture = new PIXI.Texture(baseTexture);
  const banana = PIXI.Sprite.from(texture);

  banana.position.x = x + 30;
  banana.position.y = y - 55;

  banana.width = bananaSize;
  banana.height = bananaSize;

  return banana;
}

function init() {
  var background = PIXI.Sprite.from("./../assets/bg.png");
  background.anchor.x = 0.5;
  background.anchor.y = 0.5;
  background.position.x = 400;
  background.position.y = 400;
  stage.addChild(background);

  player = {
    x: 55,
    y: 500,
    width: 25,
    height: 25,
    speed: 5,
    velX: 0,
    velY: 0,
    jumping: true,
    grounded: false,
  };
  bananaCount = 0;

  platforms = [];
  addPlatform(10, 600, false);
  addPlatform(200, 500);
  addPlatform(400, 600);
  addPlatform(600, 500);

  platformSpeed = 0;
}

function startTileMovement() {
  platformSpeed = 1;
}

function updateScore() {
  if (!scoreText) return;

  scoreText.name = "scoreText";
  scoreText.x = 50;
  scoreText.y = 50;
  scoreText.text = `Score: ${bananaCount.toString()}`;
  stage.addChild(scoreText);
}

function addPlatform(x: number, y: number, addBanana = true) {
  const tile = getTileSprite();
  tile.position.x = x;
  tile.position.y = y;

  const banana = getBanana(x, y);

  const platform: Platform = {
    banana,
    tile,
  };

  if (!addBanana) banana.visible = false;
  platforms.push(platform);
  stage.addChild(tile);
  stage.addChild(banana);
}

function render() {
  if (player.y > height) {
    stage.removeChildren();
    renderer.render(stage);
    init();
  }

  if (keys[38] || keys[32] || keys[87]) {
    // up arrow or space
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      player.velY = -player.speed * 2.5; //how high to jump
    }
  }
  if (keys[39] || keys[68]) {
    // right arrow
    if (player.velX < player.speed) {
      player.velX++;
    }
  }
  if (keys[37] || keys[65]) {
    // left arrow
    if (player.velX > -player.speed) {
      player.velX--;
    }
  }

  player.grounded = false;

  for (let i = 0; i < platforms.length; i++) {
    const collision = collisionCheck(player, platforms[i].tile);
    // Bottom collision
    if (collision === "b") {
      player.grounded = true;
      player.jumping = false;
    }
  }

  if (!player.grounded) {
    player.velY += gravity;
  }
  player.velX *= friction;

  if (player.grounded && !player.jumping) {
    player.x -= platformSpeed;
  }
  player.x += player.velX;

  player.y += player.velY;

  setPlayerPosition(player.x, player.y);

  const shouldAddTile = platforms[platforms.length - 1].tile.x < 600;
  if (shouldAddTile) {
    generateTile();
  }
  setTilePositions();

  // Check banana collisions
  for (let i = 0; i < platforms.length; i++) {
    if (platforms[i].banana.visible) {
      const collision = collisionCheck(player, platforms[i].banana);
      if (collision) {
        platforms[i].banana.visible = false;
        bananaCount++;

        // Start game after first banana has been taken
        if (bananaCount === 1) startTileMovement();

        if (bananaCount % 5 === 0 && platformSpeed !== maxPlatformSpeed) {
          platformSpeed += 0.5;
        }
        updateScore();
      }
    }
  }

  requestAnimationFrame(render);
  renderer.render(stage);
}

function generateTile() {
  // Make sure tile starts outside of viewable area
  const xPos = width;

  const lastPlatformY = platforms[platforms.length - 1].tile.y;
  const maxReachable = lastPlatformY - 150;

  const bottom = height - tileSize;
  const yPos = Math.random() * (bottom - maxReachable) + maxReachable;

  addPlatform(xPos, yPos);
}

function setTilePositions() {
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].tile.x -= platformSpeed;

    if (platforms[i].banana) {
      platforms[i].banana.x -= platformSpeed;
    }

    if (platforms[i].tile.x < -200) {
      platforms = platforms.filter((platform) => platform !== platforms[i]);
    }
  }
}

window.addEventListener("load", function () {
  render();
});
