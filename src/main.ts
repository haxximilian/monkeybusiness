import * as PIXI from "pixi.js";
import { resolution } from "./resolution";
import { Platforms } from "./platforms";
import { Player } from "./types";

const maxPlatformSpeed = 15;
const friction = 0.8;
const gravity = 0.4;
const keys: any = [];
let bananaCount = 0;
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
  width: resolution.width,
  height: resolution.height,
  transparent: true,
});

document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
const platforms = new Platforms(stage);

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

function setup() {
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
  platforms.init();
}

function updateScore() {
  if (!scoreText) return;

  scoreText.name = "scoreText";
  scoreText.x = 50;
  scoreText.y = 50;
  scoreText.text = `Score: ${bananaCount.toString()}`;
  stage.addChild(scoreText);
}

function render() {
  if (player.y > resolution.height) {
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

  if (platforms.playerIsOnPlatform(player)) {
    player.grounded = true;
    player.jumping = false;
  }

  if (!player.grounded) {
    player.velY += gravity;
    player.velX *= friction;
  } else {
    // Increase friction if player is on tile
    player.velX *= friction - 0.1;
  }

  if (player.grounded && !player.jumping) {
    player.x -= platforms.platformSpeed;
  }
  player.x += player.velX;

  player.y += player.velY;

  setPlayerPosition(player.x, player.y);
  platforms.setTilePositions();

  // Check banana collisions
  const isCollidingWithBanana = platforms.isCollidingWithBanana(player);
  if (isCollidingWithBanana) {
    bananaCount++;

    // Start game after first banana has been taken
    if (bananaCount === 1) platforms.startTileMovement();
    if (bananaCount % 5 === 0 && platforms.platformSpeed !== maxPlatformSpeed) {
      platforms.platformSpeed += 0.5;
    }
  }
  updateScore();
  requestAnimationFrame(render);
  renderer.render(stage);
}

window.addEventListener("load", function () {
  render();
});
