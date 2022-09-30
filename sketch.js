var PLAY = 1;
var END = 0;
var gameState = PLAY;


var groundImage, ground;
var hero, heroImage;
var dreadnought, vultureDroid, house;
var dreadnoughtImage, vultureDroidImage, houseImage;
var obstacleGroup, houseGroup;
var gameOver,gameOverImg; 
var restart,restartImg;
var score;  
var mainSound;
var crashSound;




function preload() {
  groundImage = loadImage("assets/tatooine.jpeg");
  heroImage = loadImage("assets/pc.png");
  dreadnoughtImage = loadImage("assets/dreadnought.png");
  vultureDroidImage = loadImage("assets/vulture-droid.png");
  houseImage = loadImage("assets/buildings.png");
  gameOverImg = loadImage("assets/gameover.png");
  restartImg = loadImage("assets/restart.png");
  mainSound = loadSound("assets/maintheme.mp3");
  crashSound = loadSound("assets/crash.mp3");
}





function setup() {
  createCanvas(displayWidth, displayHeight);

  //ground sprite
  ground = createSprite(200, 200, 1800, 900);
  ground.addImage('background', groundImage);
  ground.scale = 1.7
  

  //hero sprite
  hero = createSprite(150, 100, 60, 60);
  hero.addImage('heroship', heroImage);
  hero.scale = 0.4;

  //invisible ground
  invisibleGround = createSprite(900, 800, 1800, 20);
  invisibleGround.visible = false;

  obstacleGroup = new Group();
  houseGroup = new Group();

  //adding gameover and restart
  gameOver = createSprite(700,300);
  gameOver.addImage("gameOver",gameOverImg);

  restart = createSprite(700,360);
  restart.addImage("restart",restartImg);

  score = 0;

  if (!mainSound.isPlaying()) {
    mainSound.play();
    mainSound.setVolume(0.1);
  }

  
}

function draw() {
  background('black');
  
  


  if (gameState === PLAY) {

    if (!mainSound.isPlaying()){
      mainSound.play()
      mainSound.setVolume(0.1);
    }

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -2

    score = score + Math.round(getFrameRate()/60);

    
    

    //infinite background
    if (ground.x < 1) {
      ground.x = 600
    }
    
    //movement of hero
    if (keyDown(UP_ARROW)) {
      hero.y = hero.y - 5
    }

    if (keyDown(DOWN_ARROW)) {
      hero.y = hero.y + 5
    }

    if (keyDown(LEFT_ARROW)) {
      hero.x = hero.x - 5
    }
    if (keyDown(RIGHT_ARROW)) {
      hero.x = hero.x + 5
    }

    if (hero.y < 0) {
      hero.y = 100;
    }

    if (obstacleGroup.isTouching(hero) || houseGroup.isTouching(hero) || invisibleGround.isTouching(hero)) {
      
      gameState = END;
    crashSound.play();
    mainSound.pause();
    
    }

    //obstacles 
    createObstacles();
    createHouse();
  }

  else if (gameState === END){

    ground.velocityX = 0;
    houseGroup.setVelocityXEach(0);
    hero.velocityX = 0;
    hero.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);

    gameOver.visible = true;
    restart.visible = true;

    //lifetime
    houseGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    
    
  }

  //restart

  if (mousePressedOver(restart)){
    reset();
  }


  drawSprites();
  text("score:"+ score,1000,40);
}

function createHouse() {

  if (frameCount % 100 === 0) {
    var house = createSprite(1100, 700, 60, 60);
    house.setCollider('circle', 0, 0, 90)

    house.velocityX = -4;
    house.addImage('house', houseImage);
    house.scale = 0.3
    house.lifetime = 300
    houseGroup.add(house);

  }
}

function createObstacles() {

  if (frameCount % 70 === 0) {
    //creating the dreadnought
    var obstacle = createSprite(1300, Math.round(random(100, 400)), 60, 60);
    obstacle.velocityX = -(7+score/100);
    

    obstacle.setCollider('circle', 0, 0, 90)
    //obstacle.debug = true;
    // speed
    obstacle.velocityX = -7;

    //randomising ships
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addImage('dreadnought', dreadnoughtImage);
        break;
      case 2: obstacle.addImage('vultureDroid', vultureDroidImage);
        break;
      default: break;

    }

    obstacle.scale = 0.4;
    //lifetime
    obstacle.lifetime = 300;
    obstacleGroup.add(obstacle);

    //depth
    obstacle.depth = hero.depth;
    hero.depth = hero.depth + 1;

  }
}

function reset(){
  gameState = PLAY
  restart.visible = false;
  gameOver.visible = false;

  obstacleGroup.destroyEach();
  houseGroup.destroyEach();

  hero.x = 150;
  hero.y = 100;

  score = 0;

  


}