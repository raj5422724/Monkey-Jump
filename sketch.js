var Monkey, Monkeyanim;
var Banana, Bananaimg, BananaGroup;
var Obstacle, Obstacleimg, ObstacleGroup;
var Grd, Grdimg, IGrd;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var Score, BananaC;
var gameover, gimg, restart, restartimg;

localStorage.HighestScore = 0;

function preload() {
  Monkeyanim = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png");
  Monkey_still = loadImage("Monkey_01.png");
  Grdimg = loadImage("jungle.jpg");
  Bananaimg = loadImage("Banana.png");
  Obstacleimg = loadImage("stone.png");
  gimg = loadImage("gameover.png");
  restartimg = loadImage("restart.png");
}

function setup() {
  createCanvas(400, 200);

  Monkey = createSprite(50, 180, 20, 50);

  Monkey.addAnimation("running", Monkeyanim);
  Monkey.addAnimation("still", Monkey_still);
  Monkey.scale = 0.5;

  Grd = createSprite(200, 180, 400, 20);
  Grd.addImage(Grdimg);
  Grd.x = Grd.width / 2;
  Grd.velocityX = -(6 + 3 * Score / 100);

  gameover = createSprite(200, 80);
  gameover.addImage(gimg);

  restart = createSprite(200, 140);
  restart.addImage(restartimg);

  gameover.scale = 0.5;
  restart.scale = 0.3;

  gameover.visible = false;
  restart.visible = false;

  IGrd = createSprite(200, 190, 400, 10);
  IGrd.visible = false;

  Monkey.depth = Grd.depth + 1;


  BananaGroup = new Group();
  ObstacleGroup = new Group();

  Score = 0;
  BananaC = 0;

}

function draw() {
  //Monkey.debug = true;
  background(255);

  //console.log(Monkey.y);

  if (BananaGroup.isTouching(Monkey)) {
    BananaC++;
    BananaGroup.destroyEach();
    switch (BananaC) {
      case 2:
        Monkey.scale = 0.525;
        break;
      case 4:
        Monkey.scale = 0.550;
        break;
      case 6:
        Monkey.scale = 0.575;
        break;
      case 8:
        Monkey.scale = 0.6;
        break;
      case 10:
        Monkey.scale = 0.625;
        break;
      default:
        break;
    }
  }

  if (gamestate === PLAY) {


    Score = Score + Math.round(getFrameRate() / 60);
    Grd.velocityX = -(6 + 3 * Score / 100);

    if (keyDown("space") && Monkey.y >= 156) {
      Monkey.velocityY = -12;
    }

    Monkey.velocityY = Monkey.velocityY + 0.8

    if (Grd.x < 0) {
      Grd.x = Grd.width / 2;
    }

    Monkey.collide(IGrd);
    spawnBananas();
    spawnObstacles();


    if (ObstacleGroup.isTouching(Monkey)) {
      gamestate = END;
    }
  } else if (gamestate === END) {

    Monkey.changeAnimation("still", Monkey_still);

    gameover.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    Grd.velocityX = 0;
    Monkey.velocityY = 0;
    ObstacleGroup.setVelocityXEach(0);
    BananaGroup.setVelocityXEach(0);

    //set lifetime of the game objects so that they are never destroyed
    ObstacleGroup.setLifetimeEach(-1);
    BananaGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
  fill("white");
  text("Score: " + Score, 300, 50);
  text("Bananas Consumed - " + BananaC, 25, 25);
  textSize(14);
  textStyle(BOLD);
  text("HI " + localStorage.HighestScore, 220, 50);
}

function spawnBananas() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var Banana = createSprite(600, 120, 40, 10);
    Banana.y = Math.round(random(80, 120));
    Banana.addImage(Bananaimg);
    Banana.scale = 0.5;
    Banana.velocityX = -(6 + 3 * Score / 100);

    //assign lifetime to the variable
    Banana.lifetime = 200;

    //add each cloud to the group
    BananaGroup.add(Banana);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.addImage(Obstacleimg);
    obstacle.setCollider("circle", 0, 0, 30);
    obstacle.velocityX = -(6 + 3 * Score / 100);

    //obstacle.debug = true;

    //assign scale and lifetime to the obstacle    
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    ObstacleGroup.add(obstacle);
  }
}

function reset() {
  gamestate = PLAY;
  gameover.visible = false;
  restart.visible = false;

  Monkey.changeAnimation("running", Monkeyanim);
  Monkey.scale = 0.5;

  ObstacleGroup.destroyEach();
  BananaGroup.destroyEach();

  if (localStorage.HighestScore < Score) {
    localStorage.HighestScore = Score;
  }

  Score = 0;
  BananaC = 0;

}