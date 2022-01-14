const players = {};
const barrels = {};
const wheels = {};
const balls1 = {};

const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 1200,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  autoFocus: false
};

const tankStrings = ['blue_tank','purple_tank','yellow_tank'];
const wheelStrings = ['blue_move_right','purple_move_right','yellow_move_right'];
const barrelStrings = ['blue_barrel','purple_barrel','yellow_barrel'];
const trailStrings = ['blue_trail','purple_trail','yellow_trail'];
const ballStrings = ['blue_ball','purple_ball','yellow_ball'];
const pipStrings = ['blue_pip','purple_pip','yellow_pip'];
const shinyPipStrings = ['blue_shinypip','purple_shinypip','yellow_shinypip'];
const superPipStrings = ['super_pip','blue_super_pip','purple_super_pip','yellow_super_pip'];

var tempSprite1 = ''
var tempSprite2 = ''

function preload() {

  this.load.image('star', 'assets/star_gold.png');

  this.load.image('background', 'assets/background.png')
  this.load.image('background2', 'assets/background2.png')

  // danger
  this.load.image('danger_screen', 'assets/danger.png')
  this.load.image('bound_marker', 'assets/boundMarker.png')


  // trees
  this.load.image('tree',"assets/tree1.png")

  this.load.image('bound', 'assets/wallbound.png')
  this.load.image('floorbound', 'assets/floor_bound.png')
  this.load.image('floor', 'assets/floor.png')
  this.load.image('floor_center', 'assets/floor_center.png')
  this.load.image('ceiling', 'assets/ceiling.png')
  this.load.image('ceiling_right', 'assets/ceiling_right.png')
  this.load.image('ceiling_left', 'assets/ceiling_left.png')
  this.load.image('platform', 'assets/platform.png')
  this.load.image('center_right', 'assets/center_right.png')
  this.load.image('center_left', 'assets/center_left.png')

  // tank wheels
  this.load.spritesheet('blue_move_right','assets/blue_wheel_right.png', { frameWidth: 301, frameHeight: 301 })
  this.load.spritesheet('purple_move_right','assets/purple_wheel_right1.png', { frameWidth: 301, frameHeight: 301 })
  this.load.spritesheet('yellow_move_right','assets/yellow_wheel_right1.png', { frameWidth: 301, frameHeight: 301 })
  this.load.image('white_move_right','assets/white_wheel_right.png')
  
  // tank barrel
  this.load.image('blue_barrel', 'assets/blue_barrel.png')
  this.load.image('purple_barrel', 'assets/purple_barrel.png')
  this.load.image('yellow_barrel', 'assets/yellow_barrel.png')
  this.load.image('white_barrel', 'assets/white_barrel.png')

  // trail
  this.load.image('blue_trail', 'assets/cyan_blur.png')
  this.load.image('purple_trail', 'assets/magenta_blur.png')
  this.load.image('yellow_trail', 'assets/yellow_blur.png')

  // bullets
  this.load.image('blue_ball','assets/blue_ball.png')
  this.load.image('purple_ball','assets/purple_ball.png')
  this.load.image('yellow_ball','assets/yellow_ball.png')

  // tank bodies
  this.load.image('blue_tank', 'assets/base-cyan.png');
  this.load.image('purple_tank', 'assets/base-magenta.png')
  this.load.image('yellow_tank', 'assets/base-yellow.png')
  this.load.image('white_tank', 'assets/base-white.png')
  
  // lowhealth tank
  this.load.image('lowhealth-blue', 'assets/lowhealth_cyan.png')
  this.load.image('lowhealth-purple', 'assets/lowhealth_magenta.png')
  this.load.image('lowhealth-yellow', 'assets/lowhealth_yellow.png')

  // pips
  this.load.image('blue_pip', 'assets/blue-pip.png');
  this.load.image('purple_pip', 'assets/purple-pip.png');
  this.load.image('yellow_pip', 'assets/yellow-pip.png');

  // shiny pips
  this.load.image('blue_shinypip','assets/blue-shinypip.png')
  this.load.image('purple_shinypip','assets/purple-shinypip.png')
  this.load.image('yellow_shinypip','assets/yellow-shinypip.png')
  
  // super pip
  this.load.image('super_pip','assets/super-pip.png')
  this.load.image('blue_super_pip','assets/super-pip-cyan.png')
  this.load.image('purple_super_pip','assets/super-pip-magenta.png')
  this.load.image('yellow_super_pip','assets/super-pip-yellow.png')

  // ???
  this.load.image('secret','assets/secret.png')

  // sounds
  this.load.audio('pipCollect', 'assets/sounds/pop3.mp3')
  this.load.audio('shinyPipCollect', 'assets/sounds/zen6.mp3')
  this.load.audio('gravitySwitch', 'assets/sounds/burst11.mp3')
  this.load.audio('shoot', 'assets/sounds/sfx-pop.mp3')
  this.load.audio('superPipCollect_white', 'assets/sounds/zen6_white.mp3')
  this.load.audio('superPipCollect_blue', 'assets/sounds/zen6_blue.mp3')
  this.load.audio('superPipCollect_purple', 'assets/sounds/zen6_purple.mp3')
  this.load.audio('superPipCollect_yellow', 'assets/sounds/zen6_yellow.mp3')

}

function create() {
  const self = this;
  this.players = this.physics.add.group();
  this.barrels = this.physics.add.group();
  this.wheels = this.physics.add.group();
  this.platforms = this.physics.add.staticGroup();
  this.pips = this.physics.add.staticGroup();
  this.balls1 = this.physics.add.group();
  this.balls2 = this.physics.add.group();
  this.balls3 = this.physics.add.group();

  this.gameStarted = false

  this.pipRefId = 0

  if (this.pips.getLength() < 8) {

    var pip = this.pips.create(Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685), pipStrings[Math.floor(Math.random()*(3))]).setOrigin(0.5, 0.5).setCircle(5).setScale(0).setDepth(1).setAlpha(0)
    pip.id = this.pipRefId
    io.emit('pipSpawn', {x: pip.x, y: pip.y, id: pip.id})
    pip.disableBody(true, true)
    pip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    this.pipRefId++
  }

  this.physics.add.overlap(this.players, this.pips, function (player, pip) {
    pip.disableBody(true, true)
    pip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    players[player.playerId].ammo += 1
    io.emit('pipReplace', {x: pip.x, y: pip.y, id: pip.id})
    io.to(player.playerId).emit('healthAmmoUpdate', players[player.playerId].ammo, players[player.playerId].health , players[player.playerId].playerId)
    io.to(player.playerId).emit('pipSound')
  })

// shiny pips
  this.shinyPip = this.physics.add.staticSprite(Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685), shinyPipStrings[Math.floor(Math.random()*(3))]).setOrigin(0.5, 0.5).setCircle(10).setScale(0.04)
  io.emit('shinyPipSpawn', {x: self.shinyPip.x, y: self.shinyPip.y})
  this.shinyPip.disableBody(true, true)
  this.shinyPip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))

  this.physics.add.overlap(this.players, this.shinyPip, function (shinyPip, player) {
    self.shinyPip.disableBody(true, true)
    self.shinyPip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    if (players[player.playerId].health < 175) {
      players[player.playerId].health += 25
      players[player.playerId].scale += 0.015
      players[player.playerId].speed -= 10
    }
    else if (players[player.playerId].health < 200) {
      var tempHealth = 200 - players[player.playerId].health
      var diff = tempHealth/25
      players[player.playerId].health += tempHealth
      players[player.playerId].scale += (0.015 * diff)
      players[player.playerId].speed -= (10 * diff)
    }
    players[player.playerId].ammo += 1
    io.emit('shinyPipReplace', {x: self.shinyPip.x, y: self.shinyPip.y})
    io.to(player.playerId).emit('healthAmmoUpdate', players[player.playerId].ammo, players[player.playerId].health , players[player.playerId].playerId)
    io.to(player.playerId).emit('pipSound')
  })

// super pips
  this.superPipColor = Math.floor(Math.random()*(4))
  this.superPip = this.physics.add.staticSprite(Phaser.Math.Between(80, 1120), 110, superPipStrings[this.superPipColor]).setScale(0.075).setDepth(1).setAlpha(0).setCircle(10)
  io.emit('superPipSpawn', {x: self.superPip.x, y: self.superPip.y, color: self.superPipColor})
  this.superPip.disableBody(true, true)
  this.superPip.enableBody(true, Phaser.Math.Between(80, 1120), 110)
  this.superPipColor = Math.floor(Math.random()*(4))

  this.physics.add.overlap(this.players, this.superPip, function (superPip, player) {
    io.to(player.playerId).emit('superPipSound', self.superPipColor)
    if (self.superPipColor == 0) {
      players[player.playerId].ammo += 5
    }
    else if (self.superPipColor == 1) {

    }
    else if (self.superPipColor == 2) {
      if (players[player.playerId].health < 150) {
        players[player.playerId].health += 50
        players[player.playerId].scale += (0.015 * 2)
        players[player.playerId].speed -= (10 * 2)
      }
      else if (players[player.playerId].health < 200) {
          var tempHealth = 200 - players[player.playerId].health
          var diff = tempHealth/25
          players[player.playerId].health += tempHealth
          players[player.playerId].scale += (0.015 * diff)
          players[player.playerId].speed -= (10 * diff)
      }
    }
    else {
      
    }
    self.superPip.disableBody(true, true)
    self.superPip.enableBody(true, Phaser.Math.Between(80, 1120), 110)
    self.superPipColor = Math.floor(Math.random()*(4))
    io.emit('superPipReplace', {x: self.superPip.x, y: self.superPip.y, color: self.superPipColor})
    io.to(player.playerId).emit('healthAmmoUpdate', players[player.playerId].ammo, players[player.playerId].health , players[player.playerId].playerId)

  })

// setting
  const bg = this.add.image(500,300, 'background').setScale(1)
  this.scrollClouds = this.add.sprite(100, -500, 'background2')

  this.dangerScreen = this.physics.add.staticImage(600, 400, 'danger_screen').setAlpha(0).setDepth(6)
  const boundMarkerBottom = this.physics.add.staticImage(600, 705, 'bound_marker').setScale(1.5).setDepth(0)
  var boundMarkerTop = this.physics.add.staticImage(600, 95, 'bound_marker').setScale(1.5).setDepth(0)
  boundMarkerTop.flipY = true

  const tree1 = this.add.sprite(Phaser.Math.Between(450, 750), 605, 'tree').setScale(0.2).setDepth(0)

  const leftBound = this.physics.add.staticImage(-20, 400, 'bound').setDepth(0)
  const rightBound = this.physics.add.staticImage(1220, 400, 'bound').setDepth(0)
  const bottomBound = this.physics.add.staticImage(600, 820, 'floorbound').setDepth(0)
  const topBound = this.physics.add.staticImage(600, -20, 'floorbound').setDepth(0)

// platforms
  const floorCenter = this.physics.add.staticImage(595, 775, 'floor_center').setDepth(1)
  const ceilingRight = this.physics.add.staticImage(980, 25, 'ceiling_right').setDepth(1)
  const ceilingLeft = this.physics.add.staticImage(220, 25, 'ceiling_left').setDepth(1)
  const centerRight = this.physics.add.staticImage(835, 375, 'center_right').setDepth(0)
  const centerLeft = this.physics.add.staticImage(365, 375, 'center_left').setDepth(0)
  const platform2 = this.physics.add.staticImage(1350, 550, 'platform').setDepth(1)
  const platform3 = this.physics.add.staticImage(-150, 550, 'platform').setDepth(1)
  
  this.platforms.add(floorCenter)
  this.platforms.add(ceilingRight)
  this.platforms.add(ceilingLeft)
  this.platforms.add(centerRight)
  this.platforms.add(centerLeft)
  this.platforms.add(platform2)
  this.platforms.add(platform3)
  this.platforms.add(leftBound)
  this.platforms.add(rightBound)
  this.platforms.add(bottomBound)
  this.platforms.add(topBound)

  this.floor = this.physics.add.image(595, 775, 'floor').setDepth(1).setGravityY(-200).setImmovable(true)
  this.ceiling = this.physics.add.image(600, 25, 'ceiling').setDepth(1).setGravityY(-200).setImmovable(true)
  this.centerPlatform = this.physics.add.image(600, 375, 'platform').setDepth(1).setAlpha(1).setGravityY(-200).setImmovable(true)

  this.physics.add.overlap(this.centerPlatform, this.shinyPip, function (centerPlatform, shinyPip) {
    self.shinyPip.disableBody()
    self.shinyPip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    io.emit('shinyPipLocation', {x: self.shinyPip.x, y: self.shinyPip.y})
  })

  this.physics.add.overlap(this.platforms, this.shinyPip, function (platform, shinyPip) {
    self.shinyPip.disableBody()
    self.shinyPip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    io.emit('shinyPipLocation', {x: self.shinyPip.x, y: self.shinyPip.y})
  })

  this.physics.add.overlap(this.centerPlatform, this.pips, function (centerPlatform, pip) {
    pip.disableBody(true, true)
    pip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    io.emit('pipLocation', {x: pip.x, y: pip.y, id: pip.id})
  })

  this.physics.add.overlap(this.platforms, this.pips, function (platform, pip) {
    pip.disableBody(true, true)
    pip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    io.emit('pipLocation', {x: pip.x, y: pip.y, id: pip.id})
  })

  this.physics.add.overlap(this.pips, this.pips, function (pip1, pip2) {
    pip2.disableBody(true, true)
    pip2.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    io.emit('pipLocation', {x: pip2.x, y: pip2.y, id: pip2.id})
  })

  this.physics.add.overlap(this.shinyPip, this.pips, function (shinyPip, pip) {
    pip.disableBody(true, true)
    pip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    io.emit('pipLocation', {x: pip.x, y: pip.y, id: pip.id})
  })


  ///////

  this.physics.add.overlap(this.floor, this.balls1, function (floor, ball1) {
    ball1.disableBody()
    ball1.enableBody(true, players[ball1.playerId].x, players[ball1.playerId].y).setGravity(0, -200)
    ball1.active = false
    io.emit('returnBall', {x: ball1.x, y: ball1.y, id: ball1.playerId})
  })
  this.physics.add.overlap(this.ceiling, this.balls1, function (ceiling, ball1) {
    ball1.disableBody()
    ball1.enableBody(true, players[ball1.playerId].x, players[ball1.playerId].y).setGravity(0, -200)
    ball1.active = false
    io.emit('returnBall', {x: ball1.x, y: ball1.y, id: ball1.playerId})
  })
  this.physics.add.overlap(this.centerPlatform, this.balls1, function (centerPlatform, ball1) {
    ball1.disableBody()
    ball1.enableBody(true, players[ball1.playerId].x, players[ball1.playerId].y).setGravity(0, -200)
    ball1.active = false
    io.emit('returnBall', {x: ball1.x, y: ball1.y, id: ball1.playerId})
  })
  this.physics.add.overlap(this.platforms, this.balls1, function (platform, ball1) {
    ball1.disableBody()
    ball1.enableBody(true, players[ball1.playerId].x, players[ball1.playerId].y).setGravity(0, -200)
    ball1.active = false
    io.emit('returnBall', {x: ball1.x, y: ball1.y, id: ball1.playerId})
  })

  this.physics.add.overlap(this.players, this.balls1, function (player, ball1) {
    if (players[player.playerId].playerId != balls1[ball1.playerId].playerId) {
      players[player.playerId].health -= 25
      players[player.playerId].scale -= 0.015
      players[player.playerId].alpha -= 0.5
      ball1.disableBody()
      ball1.enableBody(true, players[ball1.playerId].x, players[ball1.playerId].y).setGravity(0, -200)
      ball1.active = false
      io.emit('damaged', players[player.playerId].playerId)
      io.to(player.playerId).emit('healthAmmoUpdate', players[player.playerId].ammo, players[player.playerId].health , players[player.playerId].playerId)
      io.to(ball1.playerId).emit('pipSound')
    }
  })



  // action platform collisions
  this.physics.add.collider(this.players, this.floor);
  this.physics.add.collider(this.players, this.ceiling);
  this.physics.add.collider(this.players, this.centerPlatform);
  this.physics.add.collider(this.barrels, this.floor);
  this.physics.add.collider(this.barrels, this.ceiling);
  this.physics.add.collider(this.barrels, this.centerPlatform);
  this.physics.add.collider(this.wheels, this.floor);
  this.physics.add.collider(this.wheels, this.ceiling);
  this.physics.add.collider(this.wheels, this.centerPlatform);

  // immovable platform collisions
  this.physics.add.collider(this.players, leftBound);
  this.physics.add.collider(this.players, rightBound);
  this.physics.add.collider(this.players, floorCenter);
  this.physics.add.collider(this.players, ceilingRight);
  this.physics.add.collider(this.players, ceilingLeft);
  this.physics.add.collider(this.players, centerRight);
  this.physics.add.collider(this.players, centerLeft);
  this.physics.add.collider(this.players, platform2);
  this.physics.add.collider(this.players, platform3);

  this.physics.add.collider(this.barrels, leftBound);
  this.physics.add.collider(this.barrels, rightBound);
  this.physics.add.collider(this.barrels, floorCenter);
  this.physics.add.collider(this.barrels, ceilingRight);
  this.physics.add.collider(this.barrels, ceilingLeft);
  this.physics.add.collider(this.barrels, centerRight);
  this.physics.add.collider(this.barrels, centerLeft);
  this.physics.add.collider(this.barrels, platform2);
  this.physics.add.collider(this.barrels, platform3);

  this.physics.add.collider(this.wheels, leftBound);
  this.physics.add.collider(this.wheels, rightBound);
  this.physics.add.collider(this.wheels, floorCenter);
  this.physics.add.collider(this.wheels, ceilingRight);
  this.physics.add.collider(this.wheels, ceilingLeft);
  this.physics.add.collider(this.wheels, centerRight);
  this.physics.add.collider(this.wheels, centerLeft);
  this.physics.add.collider(this.wheels, platform2);
  this.physics.add.collider(this.wheels, platform3);




  io.on('connection', function (socket) {
    console.log('user [' + socket.id + '] connected');
    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 1100) + 100,
      y: 660,
      alpha: 1,
      mouseX: 0,
      mouseY: 0,
      tankColor: '',
      ballColor: '',
      skin: '',
      emitter: null,
      ammo: 0,
      health: 100,
      scale: 0.175,
      playerId: socket.id,
      flipX: false,
      flipY: false,
      speed: 200,
      shotSpeed: 500,
      speedPower: false,
      shotPower: false, 
      gravityCounter: 0,
      input: {
        left: false,
        right: false,
        up: false,
        down: false,
        mouseButton: false,
        gravdown: false
      }
    };
    barrels[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 1100) + 100,
      y: 660,
      mouseX: null,
      mouseY: null,
      scale: 0.175,
      playerId: socket.id,
      input: {
        left: false,
        right: false,
        up: false,
        down: false,
        mouseButton: false
      }
    };
    wheels[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 1100) + 100,
      y: 660,
      mouseX: 0,
      mouseY: 0,
      scale: 0.175,
      playerId: socket.id,
      flipX: false,
      flipY: false,
      input: {
        left: false,
        right: false,
        up: false,
        down: false,
        mouseButton: false
      }
    };
    balls1[socket.id] = {
      x: null,
      y: null,
      ballColor: '',
      mouseX: null,
      mouseY: null,
      playerId: socket.id,
      input: {
        left: false,
        right: false,
        up: false,
        down: false,
        mouseButton: false
      },
      active: false
    }
    // add player to server
    addPlayer(self, players[socket.id]);
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    io.to(players[socket.id].playerId).emit('healthAmmoIcons', players[socket.id].playerId)


    self.pips.getChildren().forEach(function (pip) {
    // send the pips to the new player
      socket.emit('pipSpawn', { x: pip.x, y: pip.y, id: pip.id })
    })
    socket.emit('shinyPipSpawn', {x: self.shinyPip.x, y: self.shinyPip.y})
    self.superPipColor = Math.floor(Math.random()*(4))
    socket.emit('superPipSpawn', {x: self.superPip.x, y: self.superPip.y, color: self.superPipColor})
    
    // send the platforms to the new player
    socket.emit('floorLocation', { x: self.floor.x, y: self.floor.y, gravY: self.floor.gravityY })
    socket.emit('ceilingLocation', { x: self.ceiling.x, y: self.ceiling.y, gravY: self.ceiling.gravityY })
    socket.emit('centerPlatformLocation', { x: self.centerPlatform.x, y: self.centerPlatform.y, alpha: self.centerPlatform.alpha })
    socket.emit('dangerScreen', { x: self.dangerScreen.x, y: self.dangerScreen.y})

    socket.on('disconnect', function () {
      console.log('user [' + socket.id + '] disconnected');
      // remove player from server
      removePlayer(self, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerInput', function (inputData) {
      handlePlayerInput(self, socket.id, inputData);
    });

    socket.on('gameStart', function () {
      io.emit('gameBegin')
      self.gameStarted = true
    }) 

    socket.on('gameEnd', function () {
      io.emit('gameRestart')
      self.gameStarted = false
      self.time.now = 0
      self.resetPlatforms()
    })

  });

  this.tempStart = 0

  const playerIcon = self.add.sprite(1170, 770, this.tempSprite1).setScale(0.15).setDepth(3);
  const ammoIcon = self.add.sprite(50, 28, this.tempSprite2).setDepth(3)

}

function update() {

  this.players.getChildren().forEach((player) => {

    if (players[player.playerId].health <= 0) {
      removePlayer(this, players[player.playerId].playerId)
      io.emit('playerDestroy', players[player.playerId].playerId);
    }

    if (players[player.playerId].y > 850 || players[player.playerId].y < -50) {
      players[player.playerId].health = 0
      io.to(player.playerId).emit('healthAmmoUpdate', players[player.playerId].ammo, players[player.playerId].health , players[player.playerId].playerId)
      removePlayer(this, players[player.playerId].playerId)
      io.emit('playerDestroy', players[player.playerId].playerId);
    }

    if (players[player.playerId].health <= 25) {
      players[player.playerId].shotSpeed = 250
    }
    else {
      players[player.playerId].shotSpeed = 500
    }


  })

  // // timer temps
  // var i = 0
  // var j = 0
  // var k = 0

  // var a = 0

  // if (this.gameStarted == true && this.time.now > 20000 && this.centerPlatform.alpha > 0) {
  //   if (i == 0) {
  //     io.emit('centerPlatformFade', this.centerPlatform)
  //     i++
  //   }
  //   if(this.time.now > 20750) {
  //     if (i == 1) {
  //       io.emit('centerPlatformDestroy', this.centerPlatform)
  //       this.centerPlatform.disableBody()
  //       i++
  //     }
  //   }
  // }

  // if (this.gameStarted == true && this.time.now > 123000) {
  //   if (a == 0) {
  //     io.emit('dangerScreenPlay', this.dangerScreen)
  //     a++
  //   }
  // }

  // if (this.gameStarted == true && this.time.now > 124000) {
  //   if (a == 1) {
  //     io.emit('dangerScreenStop', this.dangerScreen)
  //     a++ 
  //   }
  // }

  // if (this.gameStarted == true && this.time.now > 125000 && this.ceiling.y > 0) {
  //   if (j == 0) {
  //     io.emit('ceilingFall', this.ceiling)
  //     j++
  //   }
  //   this.ceiling.setGravityY(-205)
  //   if (this.time.now > 128000) {
  //     if (j == 1) {
  //       io.emit('ceilingDisappear', this.ceiling)
  //       this.ceiling.setGravityY(-700)
  //       j++
  //     }
  //     if (this.time.now > 130000) {
  //       if (j == 2) {
  //         io.emit('ceilingDestroy', this.ceiling)
  //         this.ceiling.disableBody()
  //         k++
  //       }
  //     }
  //   }
  // }

  // if (this.gameStarted == true && this.time.now > 183000) {
  //   if (a == 2) {
  //     io.emit('dangerScreenPlay', this.dangerScreen)
  //     a++
  //   }
  // }

  // if (this.gameStarted == true && this.time.now > 184000) {
  //   if (a == 3) {
  //     io.emit('dangerScreenStop', this.dangerScreen)
  //     a++ 
  //   }
  // }

  // if (this.gameStarted == true && this.time.now > 185000 && this.floor.y < 800) {
  //   if (k == 0) {
  //     io.emit('floorFall', this.floor)
  //     k++
  //   }
  //   this.floor.setGravityY(-195)
  //   if (this.time.now > 188000) {
  //     if (k == 1) {
  //       io.emit('floorDisappear', this.floor)
  //       this.floor.setGravityY(500)
  //       k++
  //     }
  //     if (this.time.now > 190000) {
  //       if (k == 2) {
  //         io.emit('floorDestroy', this.floor)
  //         this.floor.disableBody()
  //         k++
  //       }
  //     }
  //   }
  // }

  // if (this.gameStarted == true && this.time.now > 190000) {
  //   if (a == 4) {
  //     io.emit('dangerScreenDisable', this.dangerScreen)
  //     a++ 
  //   }
  // }

  if (this.time.now > 190000) {
    this.players.getChildren().forEach((player) => {
      players[player.playerId].health -= 0.05
      players[player.playerId].scale -= 0.00003
      players[player.playerId].speed += 0.02
      io.to(player.playerId).emit('healthAmmoUpdate', players[player.playerId].ammo, players[player.playerId].health , players[player.playerId].playerId)
    })
  }

  if (this.pips.getLength() < 8) {

    var pip = this.pips.create(Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685), pipStrings[Math.floor(Math.random()*(3))]).setOrigin(0.5, 0.5).setCircle(5).setScale(0).setDepth(1).setAlpha(0)
    pip.id = this.pipRefId
    io.emit('pipSpawn', {x: pip.x, y: pip.y, id: pip.id})
    pip.disableBody(true, true)
    pip.enableBody(true, Phaser.Math.Between(80, 1120), Phaser.Math.Between(315, 685))
    this.pipRefId++
  }

  this.players.getChildren().forEach((player) => {
    
    var touchingFloor = player.body.onFloor()
    var touchingCeil = player.body.touching.up

    const input = players[player.playerId].input;
    if (this.gameStarted == true && input.left) {
      player.setVelocityX(-players[player.playerId].speed);
      player.flipX = true;
    } else if (this.gameStarted == true && input.right) {
      player.setVelocityX(players[player.playerId].speed);
      player.flipX = false;
    } else {
      player.setVelocityX(0);
    }

    if (players[player.playerId].health <= 5) {
      players[player.playerId].gravityCounter += 5
    }

    if (this.gameStarted == true && input.up && input.gravDown && players[player.playerId].gravityCounter < 6) {
      player.setGravityY(-650)
      if (!touchingFloor && !touchingCeil && !player.flipY) {
        players[player.playerId].gravityCounter++
        players[player.playerId].health -= 5
        players[player.playerId].scale -= (0.015 / 5)
        players[player.playerId].speed += 2
        io.to(player.playerId).emit('flipSound')
        io.to(player.playerId).emit('healthAmmoUpdate', players[player.playerId].ammo, players[player.playerId].health , players[player.playerId].playerId)
        input.gravDown = false
      }
      player.flipY = true
    } 
    else if (this.gameStarted == true && input.down && input.gravDown && players[player.playerId].gravityCounter < 6) {
      player.setGravityY(650)
      if (!touchingFloor && !touchingCeil && player.flipY) {
        players[player.playerId].gravityCounter++
        players[player.playerId].health -= 5
        players[player.playerId].scale -= (0.015 / 5)
        players[player.playerId].speed += 2
        io.to(player.playerId).emit('flipSound')
        io.to(player.playerId).emit('healthAmmoUpdate', players[player.playerId].ammo, players[player.playerId].health , players[player.playerId].playerId)
        input.gravDown = false
      }
      player.flipY = false
    } 
    else {
      player.setAcceleration(0);
    }

    if (touchingFloor || touchingCeil) {
      players[player.playerId].gravityCounter = 0
    }
    player.setScale(players[player.playerId].scale)
    players[player.playerId].alpha = player.alpha
    players[player.playerId].x = player.x;
    players[player.playerId].y = player.y;
    players[player.playerId].flipX = player.flipX;
    players[player.playerId].flipY = player.flipY;
    players[player.playerId].rotation = player.rotation;

  });

  this.barrels.getChildren().forEach((barrel) => {

    const input = barrels[barrel.playerId].input;
    
    if (input.left) {
      barrel.setVelocityX(-players[barrel.playerId].speed);
    } else if (input.right) {
      barrel.setVelocityX(players[barrel.playerId].speed);
    } else {
      barrel.setVelocityX(0);
    }

    if (input.up) {
      barrel.setGravityY(-650)
    } else if (input.down) {
      barrel.setGravityY(650)
    } else {
      barrel.setAcceleration(0);
    }
    if (this.gameStarted == true) {
      barrels[barrel.playerId].rotation = Phaser.Math.Angle.Between(barrel.x,barrel.y,input.mouseX,input.mouseY) + Math.PI/2
    }
    barrels[barrel.playerId].scale = players[barrel.playerId].scale
    barrels[barrel.playerId].x = players[barrel.playerId].x
    barrels[barrel.playerId].y = players[barrel.playerId].y
    barrels[barrel.playerId].mouseX = input.mouseX;
    barrels[barrel.playerId].mouseY = input.mouseY;
    
  });

  this.wheels.getChildren().forEach((wheel) => {

    const input = wheels[wheel.playerId].input;
    if (input.left) {
      wheel.setVelocityX(-players[wheel.playerId].speed);
      wheel.flipX = true;
    } else if (input.right) {
      wheel.setVelocityX(players[wheel.playerId].speed);
      wheel.flipX = false;
    } else {
      wheel.setVelocityX(0);
    }

    if (input.up) {
      wheel.setGravityY(-650)
      wheel.flipY = true
    } else if (input.down) {
      wheel.setGravityY(650)
      wheel.flipY = false
    } else {
      wheel.setAcceleration(0);
    }

    wheels[wheel.playerId].scale = players[wheel.playerId].scale
    wheels[wheel.playerId].x = players[wheel.playerId].x
    wheels[wheel.playerId].y = players[wheel.playerId].y
    wheels[wheel.playerId].flipX = players[wheel.playerId].flipX;
    wheels[wheel.playerId].flipY = players[wheel.playerId].flipY;
    wheels[wheel.playerId].mouseX = 0;
    wheels[wheel.playerId].mouseY = 0;
    wheels[wheel.playerId].rotation = wheel.rotation;
  });
  this.balls1.getChildren().forEach((ball1) => {

    const input = balls1[ball1.playerId].input;
    
    if (this.gameStarted == true && input.mouseButton && !ball1.active && players[ball1.playerId].ammo > 0) {
      ball1.enableBody()
      ball1.setGravityY(300)
      this.physics.moveTo(ball1, input.mouseX, input.mouseY, players[ball1.playerId].shotSpeed)
      ball1.active = true
      players[ball1.playerId].ammo--
      io.to(players[ball1.playerId].playerId).emit('healthAmmoUpdate', players[ball1.playerId].ammo, players[ball1.playerId].health , players[ball1.playerId].playerId)
      io.to(players[ball1.playerId].playerId).emit('shotSound')

    } 
    else if (ball1.active == false) {
      ball1.disableBody()
      ball1.setX(players[ball1.playerId].x)
      ball1.setY(players[ball1.playerId].y)
    }

    balls1[ball1.playerId].x = ball1.x
    balls1[ball1.playerId].y = ball1.y
    balls1[ball1.playerId].mouseX = input.mouseX;
    balls1[ball1.playerId].mouseY = input.mouseY;

  });

  io.emit('playerUpdates', players, barrels, wheels, balls1);

}

function handlePlayerInput(self, playerId, input) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].input = input;
    }
  });
  self.barrels.getChildren().forEach((barrel) => {
    if (playerId === barrel.playerId) {
      barrels[barrel.playerId].input = input;
    }
  });
  self.wheels.getChildren().forEach((wheel) => {
    if (playerId === wheel.playerId) {
      wheels[wheel.playerId].input = input;
    }
  });
  self.balls1.getChildren().forEach((ball1) => {
    if (playerId === ball1.playerId) {
      balls1[ball1.playerId].input = input;
    }
  });
}

function addPlayer(self, playerInfo) {
  var colorTemp = Math.floor(Math.random()*(3))
  const player = self.physics.add.image(playerInfo.x, playerInfo.y, tankStrings[colorTemp]).setScale(0.175).setSize(301, 301, true).setDepth(3);
  const barrel = self.physics.add.image(playerInfo.x, playerInfo.y, barrelStrings[colorTemp]).setScale(0.175).setSize(301, 301, true).setDepth(2);
  const wheel = self.physics.add.image(playerInfo.x, playerInfo.y, wheelStrings[colorTemp]).setScale(0.175).setSize(301, 301, true).setDepth(2);
  const trail = self.add.particles(trailStrings[colorTemp])
  const ball1 = self.physics.add.sprite(playerInfo.x, playerInfo.y, ballStrings[colorTemp]).setGravityY(-200).setCircle(4)

  player.emitter = trail.createEmitter({
    speed: 0,
    scale: { start: 0.06, end: 0},
    alpha: {start: 0.75, end: 0},
    frequency: 100,
    lifespan: 1000,
  })

  player.emitter.startFollow(player)

  this.tempSprite1 = tankStrings[colorTemp];
  this.tempSprite2 = ballStrings[colorTemp];
  player.tankColor = tankStrings[colorTemp];
  player.ballColor = ballStrings[colorTemp];
  ball1.ballColor = ballStrings[colorTemp];

  player.playerId = playerInfo.playerId;
  barrel.playerId = playerInfo.playerId;
  wheel.playerId = playerInfo.playerId;
  ball1.playerId = playerInfo.playerId

  self.players.add(player);
  self.barrels.add(barrel);
  self.wheels.add(wheel);
  self.balls1.add(ball1)

}

function removePlayer(self, playerId) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.emitter.on = false
      player.destroy();
    }
  });
  self.barrels.getChildren().forEach((barrel) => {
    if (playerId === barrel.playerId) {
      barrel.destroy();
    }
  });
  self.wheels.getChildren().forEach((wheel) => {
    if (playerId === wheel.playerId) {
      wheel.destroy();
    }
  });
  self.balls1.getChildren().forEach((ball1) => {
    if (playerId === ball1.playerId) {
      ball1.destroy();
    }
  });


}

function resetPlatforms() {
  self.floor.enableBody(true, 595, 775).setGravityY(-200).setImmovable(true)
  self.ceiling.enableBody(true, 600, 25).setGravityY(-200).setImmovable(true)
  self.centerPlatform.enableBody(true, 600, 375).setAlpha(1).setGravityY(-200).setImmovable(true)
  self.floor.visible = true
  self.ceiling.visible = true
  self.centerPlatform.visible = true
  io.emit('updatePlatforms')
}

// this.floor = this.physics.add.image(595, 775, 'floor').setDepth(1).setGravityY(-200).setImmovable(true)
// this.ceiling = this.physics.add.image(600, 25, 'ceiling').setDepth(1).setGravityY(-200).setImmovable(true)
// this.centerPlatform = this.physics.add.image(600, 375, 'platform').setDepth(1).setAlpha(1).setGravityY(-200).setImmovable(true)


const game = new Phaser.Game(config);
window.gameLoaded();
