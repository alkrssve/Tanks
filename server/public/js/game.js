var config = {
  type: Phaser.AUTO,
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
  }
};

var game = new Phaser.Game(config);

const tankStrings = ['blue_tank','purple_tank','yellow_tank'];
const wheelStrings = ['blue_move_right','purple_move_right','yellow_move_right'];
const barrelStrings = ['blue_barrel','purple_barrel','yellow_barrel'];
const trailStrings = ['blue_trail','purple_trail','yellow_trail'];
const ballStrings = ['blue_ball','purple_ball','yellow_ball'];
const pipStrings = ['blue_pip','purple_pip','yellow_pip'];
const shinyPipStrings = ['blue_shinypip','purple_shinypip','yellow_shinypip'];
const superPipStrings = ['super_pip','blue_super_pip','purple_super_pip','yellow_super_pip'];
const lowHealthStrings = ['lowhealth-blue', 'lowhealth-purple', 'lowhealth-yellow'];

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
        
  // tank barrel
  this.load.image('blue_barrel', 'assets/blue_barrel.png')
  this.load.image('purple_barrel', 'assets/purple_barrel.png')
  this.load.image('yellow_barrel', 'assets/yellow_barrel.png')

  // trail
  this.load.image('blue_trail', 'assets/cyan_blur.png')
  this.load.image('purple_trail', 'assets/magenta_blur.png')
  this.load.image('yellow_trail', 'assets/yellow_blur.png')

  // bullets
  this.load.image('blue_ball','assets/blue_ball.png')
  this.load.image('purple_ball','assets/purple_ball.png')
  this.load.image('yellow_ball','assets/yellow_ball.png')

  // tank bodies
  this.load.image('blue_tank', 'assets/base-cyan.png')
  this.load.image('purple_tank', 'assets/base-magenta.png')
  this.load.image('yellow_tank', 'assets/base-yellow.png')

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
  var self = this;
  this.socket = io();
  this.players = this.add.group();
  this.barrels = this.add.group();
  this.wheels = this.add.group();
  this.pips = this.physics.add.staticGroup()
  this.platforms = this.add.group();
  this.balls1 = this.add.group();
  this.balls2 = this.add.group();
  this.balls3 = this.add.group();

  this.playerIcon
  this.ammoIcon

  this.pipRefId = 0

  this.shinyPip

  // sound effects loaded in
  this.pipCollected = this.sound.add('pipCollect')
  this.shinyPipCollected = this.sound.add('shinyPipCollect')
  this.gravitySwitch = this.sound.add('gravitySwitch')
  this.shootSound = this.sound.add('shoot')
  this.whiteSuperPipCollected = this.sound.add('superPipCollect_white')
  this.blueSuperPipCollected = this.sound.add('superPipCollect_blue')
  this.purpleSuperPipCollected = this.sound.add('superPipCollect_purple')
  this.yellowSuperPipCollected = this.sound.add('superPipCollect_yellow')

  // setting sprites/images
  const bg = this.add.image(500,300, 'background').setScale(1)
  this.lobbyScreen = this.physics.add.staticImage(500,300, 'background').setScale(1).setDepth(9)
  this.scrollClouds = this.add.sprite(100, -500, 'background2')
  this.scrollRate = 0.15

  const boundMarkerBottom = this.add.sprite(600, 705, 'bound_marker').setScale(1.5).setDepth(0)
  var boundMarkerTop = this.add.sprite(600, 95, 'bound_marker').setScale(1.5).setDepth(0)
  boundMarkerTop.flipY = true

  const tree1 = this.add.sprite(Phaser.Math.Between(450, 750), 605, 'tree').setScale(0.2).setDepth(0)

  // platform sprites
  const floorCenter = this.add.sprite(595, 775, 'floor_center').setDepth(1)
  const ceilingRight = this.add.sprite(980, 25, 'ceiling_right').setDepth(1)
  const ceilingLeft = this.add.sprite(220, 25, 'ceiling_left').setDepth(1)
  const centerRight = this.add.sprite(835, 375, 'center_right').setDepth(0)
  const centerLeft = this.add.sprite(365, 375, 'center_left').setDepth(0)
  const platform2 = this.add.sprite(1350, 550, 'platform').setDepth(1)
  const platform3 = this.add.sprite(-150, 550, 'platform').setDepth(1)

  // ???
  var scrtChance = Phaser.Math.Between(0, 50000)

  if (scrtChance == 2312) {
  const scrt = this.add.image(592.5, 770, 'secret').setDepth(3)
  }

  // texts and text style
  this.style = {color: '#FFF', fontSize: 36, fontWeight: 'bold', fontFamily: 'Calibri'}
  this.currentAmmoText = this.add.text(25, 10, '0', this.style).setScrollFactor(0).setOrigin(0.5,0).setDepth(3)
  this.currentHealthText = this.add.text(1090, 755, '100 HP', this.style).setScrollFactor(0).setOrigin(0.5,0).setDepth(3)
  this.waitingLobbyText = this.add.text(600, 375, '', this.style).setScrollFactor(0).setOrigin(0.5,0).setDepth(10).setAlpha(1)
  this.startingLobbyText = this.add.text(600, 375, '', this.style).setScrollFactor(0).setOrigin(0.5,0).setDepth(10).setAlpha(1)
  // player sockets //////////////////////////////////////////////////////////////////

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        var colorTemp = Math.floor(Math.random()*(3))
        displayPlayers(self, players[id], tankStrings[colorTemp], barrelStrings[colorTemp], wheelStrings[colorTemp], ballStrings[colorTemp], trailStrings[colorTemp], colorTemp);
      } else {
        var colorTemp = Math.floor(Math.random()*(3))
        displayPlayers(self, players[id], tankStrings[colorTemp], barrelStrings[colorTemp], wheelStrings[colorTemp], ballStrings[colorTemp], trailStrings[colorTemp], colorTemp);
      }
    });
  });

  this.socket.on('newPlayer', function (playerInfo) {
    var colorTemp = Math.floor(Math.random()*(3))
    displayPlayers(self, playerInfo, tankStrings[colorTemp], barrelStrings[colorTemp], wheelStrings[colorTemp], ballStrings[colorTemp], trailStrings[colorTemp], colorTemp);
  });

  this.socket.on('disconnect', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.emitter.on = false
        player.destroy();
      }
    });
    self.barrels.getChildren().forEach(function (barrel) {
      if (playerId === barrel.playerId) {
        barrel.destroy();
      }
    });
    self.wheels.getChildren().forEach(function (wheel) {
      if (playerId === wheel.playerId) {
        wheel.destroy();
      }
    });
    self.balls1.getChildren().forEach(function (ball1) {
      if (playerId === ball1.playerId) {
        ball1.destroy();
      }
    });

  });

  this.socket.on('playerDestroy', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.emitter.on = false
        player.destroy();
      }
    });
    self.barrels.getChildren().forEach(function (barrel) {
      if (playerId === barrel.playerId) {
        barrel.destroy();
      }
    });
    self.wheels.getChildren().forEach(function (wheel) {
      if (playerId === wheel.playerId) {
        wheel.destroy();
      }
    });
    self.balls1.getChildren().forEach(function (ball1) {
      if (playerId === ball1.playerId) {
        ball1.destroy();
      }
    });
  })

  this.socket.on('playerUpdates', function (players, barrels, wheels, balls1) {
    Object.keys(players).forEach(function (id) {
      self.players.getChildren().forEach(function (player) {
        if (players[id].playerId === player.playerId) {
          player.setRotation(players[id].rotation);
          player.setPosition(players[id].x, players[id].y);
          player.setScale(players[id].scale);
          player.mouseX = players[id].mouseX;
          player.mouseY = players[id].mouseY;
          player.flipX = players[id].flipX;
          player.flipY = players[id].flipY;
          player.ammo = players[id].ammo;
          player.health = players[id].health;
          if (player.health <= 25) {
            player.setTexture(lowHealthStrings[player.color])
          } else {
            player.setTexture(tankStrings[player.color])
          }
        }
      });
    });
    Object.keys(barrels).forEach(function (id) {
      self.barrels.getChildren().forEach(function (barrel) {
        if (barrels[id].playerId === barrel.playerId) {
          barrel.setRotation(barrels[id].rotation);
          barrel.setPosition(barrels[id].x, barrels[id].y);
          barrel.setScale(barrels[id].scale);
          barrel.mouseX = barrels[id].mouseX;
          barrel.mouseY = barrels[id].mouseY;
        }
      });
    });
    Object.keys(wheels).forEach(function (id) {
      self.wheels.getChildren().forEach(function (wheel) {
        if (wheels[id].playerId === wheel.playerId) {
          wheel.setRotation(wheels[id].rotation);
          wheel.setPosition(wheels[id].x, wheels[id].y);
          wheel.setScale(wheels[id].scale);
          wheel.mouseX = wheels[id].mouseX;
          wheel.mouseY = wheels[id].mouseY;
          wheel.flipX = wheels[id].flipX;
          wheel.flipY = wheels[id].flipY;
        }
      });
    });
    Object.keys(balls1).forEach(function (id) {
      self.balls1.getChildren().forEach(function (ball1) {
        if (balls1[id].playerId === ball1.playerId) {
          ball1.setPosition(balls1[id].x, balls1[id].y);
          ball1.mouseX = balls1[id].mouseX;
          ball1.mouseY = balls1[id].mouseY;
        }
      })
    });
  });

  this.socket.on('healthAmmoUpdate', function (ammo, health, playId) {
    self.players.getChildren().forEach(function (player) {
      if (player.playerId == playId) {
        self.currentHealthText.setText(health.toFixed(0) + ' HP')
        self.currentAmmoText.setText(ammo)
        if(ammo > 99) {
          self.currentAmmoText.setX(30)
          self.ammoIcon.setX(69)
        }
        else if(ammo > 9) {
          self.currentAmmoText.setX(25)
          self.ammoIcon.setX(55)
        }

      }
    })
  })
  
  this.socket.on('healthAmmoIcons', function (playId) {
    self.players.getChildren().forEach(function (player) {
      if (player.playerId == playId) {
        self.playerIcon = self.add.sprite(1170, 770, player.tankColor).setScale(0.15).setDepth(3);
        self.ammoIcon = self.add.image(50, 28, player.ballColor).setDepth(3);
      }
    })
  })

  this.socket.on('returnBall', function (ballData) {

  })

  this.socket.on('flipSound', function () {
    self.gravitySwitch.play()
  })

  this.socket.on('shotSound', function () {
    self.shootSound.play()
  })

  // platform effect sockets /////////////////////////////////////////////////////////

  this.socket.on('centerPlatformFade', function (centerPlatform) {
    self.tweens.add({
      targets: self.centerPlatform,
      alpha: 0,
      duration: 750
    })
  })

  this.socket.on('centerPlatformDestroy', function (centerPlatform) {
    self.centerPlatform.destroy()
  })

  this.socket.on('ceilingFall', function (ceiling) {
    self.ceiling.setGravityY(-205)
  })

  this.socket.on('ceilingDisappear', function (ceiling) {
    self.ceiling.setGravityY(-700)
  })

  this.socket.on('ceilingDestroy', function (ceiling) {
    self.ceiling.destroy()
  })

  this.socket.on('floorFall', function (floor) {
    self.floor.setGravityY(-195)
  })

  this.socket.on('floorDisappear', function (floor) {
    self.floor.setGravityY(500)
  })

  this.socket.on('floorDestroy', function (floor) {
    self.floor.destroy()
  })

  this.socket.on('dangerScreenPlay', function (dangerScreen) {
    self.tweens.add({
      targets: self.dangerScreen,
      alpha: 0.3,
      duration: 250
    })
  })

  this.socket.on('dangerScreenStop', function (dangerScreen) {
    self.tweens.add({
      targets: self.dangerScreen,
      alpha: 0,
      duration: 250
    })
  })

  this.socket.on('dangerScreenDisable', function (dangerScreen) {
    self.dangerScreen.destroy()
  })


  // pip sockets /////////////////////////////////////////////////////////////////////

  this.socket.on('pipLocation', function (pipData) {
    self.pips.getChildren().forEach(function (pip) {
      if (pip.id == pipData.id) {
        pip.disableBody()
        pip.enableBody(true, pipData.x, pipData.y)
        pip.setScale(0.01).setAlpha(0)
        pip.setTexture(pipStrings[Math.floor(Math.random()*(3))])
        self.tweens.add({
          targets: pip,
          alpha: 1,
          scale: 0.07,
          duration: 500
        })
      }
    })  
  })

  this.socket.on('pipSpawn', function (pipData) {
    var pip = self.pips.create(pipData.x, pipData.y, pipStrings[Math.floor(Math.random()*(3))]).setOrigin(0.5,0.5).setCircle(5).setScale(0.01).setDepth(1).setAlpha(0)
    pip.id = self.pipRefId
    self.tweens.add({
      targets: pip,
      alpha: 1,
      scale: 0.07,
      duration: 500
    })
    self.pipRefId++   
  })

  this.socket.on('pipReplace', function (pipData) {
    self.pips.getChildren().forEach(function (pip) {
      if (pip.id == pipData.id) {
        self.pipCollected.play()
        pip.disableBody()
        pip.enableBody(true, pipData.x, pipData.y)
        pip.setScale(0.01).setAlpha(0)
        pip.setTexture(pipStrings[Math.floor(Math.random()*(3))])
        self.tweens.add({
          targets: pip,
          alpha: 1,
          scale: 0.07,
          duration: 500
        })
      }
    })   
  })

  this.socket.on('pipSound', function () {
    self.pipCollected.play()
  })

  // shiny pip sockets
  this.socket.on('shinyPipLocation', function (pipData) {
    self.shinyPip.disableBody()
    self.shinyPip.enableBody(true, pipData.x, pipData.y)
    self.shinyPip.setScale(0.01).setAlpha(0)
    self.shinyPip.setTexture(shinyPipStrings[Math.floor(Math.random()*(3))])
    self.tweens.add({
      targets: self.shinyPip,
      alpha: 1,
      scale: 0.05,
      duration: 500
    })  
  })

  this.socket.on('shinyPipSpawn', function (pipData) {
    self.shinyPip = self.physics.add.staticImage(pipData.x, pipData.y, shinyPipStrings[Math.floor(Math.random()*(3))]).setOrigin(0.5, 0.5).setCircle(10).setScale(0.01).setDepth(1).setAlpha(0)
    self.tweens.add({
      targets: self.shinyPip,
      alpha: 1,
      scale: 0.05,
      duration: 500
    })   
  })

  this.socket.on('shinyPipReplace', function (pipData) {
    self.shinyPip.disableBody()
    self.shinyPip.enableBody(true, pipData.x, pipData.y)
    self.shinyPip.setScale(0.01).setAlpha(0)
    self.shinyPip.setTexture(shinyPipStrings[Math.floor(Math.random()*(3))])
    self.tweens.add({
      targets: self.shinyPip,
      alpha: 1,
      scale: 0.05,
      duration: 500
    })   
  })

  this.socket.on('shinyPipSound', function () {
    self.shinyPipCollected.play()
  })

  // super pip sockets
  this.socket.on('superPipSpawn', function (pipData) {
    if (!self.superPip) {
      self.superPip = self.physics.add.staticImage(pipData.x, pipData.y, superPipStrings[pipData.color]).setCircle(10).setScale(0.01).setDepth(1).setAlpha(0)
      self.tweens.add({
        targets: self.superPip,
        alpha: 1,
        scale: 0.075,
        duration: 500
      })
    }
    else {
      self.superPip.disableBody()
      self.superPip.enableBody(true, pipData.x, pipData.y)
      self.superPip.setScale(0.01).setAlpha(0)
      self.superPip.setTexture(superPipStrings[pipData.color])
      self.tweens.add({
        targets: self.superPip,
        alpha: 1,
        scale: 0.075,
        duration: 500
      })  
    }   
  })

  this.socket.on('superPipReplace', function (pipData) {
    self.superPip.disableBody()
    self.superPip.enableBody(true, pipData.x, pipData.y)
    self.superPip.setScale(0.01).setAlpha(0)
    self.superPip.setTexture(superPipStrings[pipData.color])
    self.tweens.add({
      targets: self.superPip,
      alpha: 1,
      scale: 0.075,
      duration: 500
    })   
  })

  this.socket.on('superPipSound', function (color) {
    if (color == 0) {
      self.whiteSuperPipCollected.play()
    }
    else if (color == 1) {
      self.blueSuperPipCollected.play()
    }
    else if (color == 2) {
      self.purpleSuperPipCollected.play()
    }
    else {
      self.yellowSuperPipCollected.play()
    }
  })

  // platform intialization sockets //////////////////////////////////////////////////

  this.socket.on('floorLocation',function (floorValues) {
    self.floor = self.physics.add.image(floorValues.x, floorValues.y, 'floor').setGravityY(-200).setImmovable(true);
  })
  this.socket.on('ceilingLocation',function (ceilingValues) {
    self.ceiling = self.physics.add.image(ceilingValues.x, ceilingValues.y, 'ceiling').setGravityY(-200).setImmovable(true);
  })
  this.socket.on('centerPlatformLocation',function (centerPlatformValues) {
    self.centerPlatform = self.add.image(centerPlatformValues.x, centerPlatformValues.y, 'platform').setAlpha(centerPlatformValues.alpha);
  })
  this.socket.on('dangerScreen',function (dangerScreenValues) {
    self.dangerScreen = self.add.image(dangerScreenValues.x, dangerScreenValues.y, 'danger_screen').setAlpha(0).setDepth(6)
  })

  // client controls /////////////////////////////////////////////////////////////////

  this.cursors = this.input.keyboard.createCursorKeys();
  this.keys = this.input.keyboard.addKeys({
    a:  Phaser.Input.Keyboard.KeyCodes.A,
    s:  Phaser.Input.Keyboard.KeyCodes.S,
    d:  Phaser.Input.Keyboard.KeyCodes.D,
    w:  Phaser.Input.Keyboard.KeyCodes.W
  });
  
  this.mouse = this.input.activePointer
  this.input.mouse.disableContextMenu()

  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;
  this.downKeyPressed = false;
  this.mousex = parseInt(this.mouse.x);
  this.mousey = parseInt(this.mouse.y);
  this.mouseButtonPressed = false;
  this.gravityDown = false
  this.gravityCounter = 0;
  
  var FKey = this.input.keyboard.addKey('F')

  FKey.on('down', function () {

      if (this.scale.isFullscreen)
      {
          this.scale.stopFullscreen()
      }
      else
      {
          this.scale.startFullscreen()
      }

  }, this)

  this.timer = 3
  this.returnTimer = 0
}

function update() { 

  if (this.players.getLength() > 1 && this.returnTimer == 0) {
    this.timer -= 0.02
    this.waitingLobbyText.text = 'Game starting in... ' + this.timer.toFixed(1)
    if (this.timer < 0) {
      this.lobbyScreen.visible = false
      this.waitingLobbyText.text = ''
      this.returnTimer++
    }
  } 
  else if (this.returnTimer == 0) {
    this.timer = 3
    this.lobbyScreen.visible = true
    this.startingLobbyText.text = ''
    this.waitingLobbyText.text = this.players.getLength() + ' player(s) ready. Waiting for more...'
  }

  if(this.scrollClouds.x > 800){
    this.scrollRate = -0.15
  }
  else if(this.scrollClouds.x < 100) {
  this.scrollRate = 0.15
  }

  this.scrollClouds.x += this.scrollRate

  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;
  const down = this.downKeyPressed;
  const mouseX = this.mousex;
  const mouseY = this.mousey;
  const mouseButton = this.mouseButtonPressed;
  const gravDown = this.gravityDown;

  const mouseValX = mouseX + 'x'
  const mouseValY = mouseY + 'y'

  if (this.cursors.left.isDown || this.keys.a.isDown) {
    this.leftKeyPressed = true;
    this.rightKeyPressed = false;
  } else if (this.cursors.right.isDown || this.keys.d.isDown) {
    this.rightKeyPressed = true;
    this.leftKeyPressed = false;
  } else {
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    
  }

  if (this.cursors.up.isDown || this.keys.w.isDown) {
    this.gravityDown = true;
    this.upKeyPressed = true;
    this.downKeyPressed = false;
  } else if (this.cursors.down.isDown || this.keys.s.isDown) {
    this.gravityDown = true;
    this.downKeyPressed = true;
    this.upKeyPressed = false;
  } else {
    this.upKeyPressed = false;
    this.downKeyPressed = false;
  }

  if (Phaser.Input.Keyboard.JustDown(this.keys.w) || Phaser.Input.Keyboard.JustDown(this.keys.s)
  || Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
    this.gravityCounter++
  }

  if (this.mouse.isDown) {
    this.mouseButtonPressed = true;
  } else {
    this.mouseButtonPressed = false;
  }

  if (this.mouse.x > 0 || this.mouse.y > 0) {
    this.mousex = parseInt(this.mouse.x)
    this.mousey = parseInt(this.mouse.y)
  }

  if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || down !== this.downKeyPressed || mouseX != this.mousex || mouseY != this.mousey || mouseButton != this.mouseButtonPressed || gravDown != this.gravityDown) {
    this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed, down: this.downKeyPressed, mouseX: this.mousex, mouseY: this.mousey, mouseButton: this.mouseButtonPressed, gravDown: this.gravityDown });
  }

}

function displayPlayers(self, playerInfo, sprite1, sprite2, sprite3, ballColor, trailColor, color) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite1).setScale(0.175).setSize(301, 301, true).setDepth(3);
  const barrel = self.add.sprite(playerInfo.x, playerInfo.y, sprite2).setScale(0.175).setSize(301, 301, true).setDepth(2);
  const wheel = self.add.sprite(playerInfo.x, playerInfo.y, sprite3).setScale(0.175).setSize(301, 301, true).setDepth(2);
  const trail = self.add.particles(trailColor)
  const ball1 = self.add.sprite(playerInfo.x, playerInfo.y, ballColor)

  player.emitter = trail.createEmitter({
    speed: 0,
    scale: { start: 0.06, end: 0},
    alpha: {start: 0.75, end: 0},
    frequency: 100,
    lifespan: 1000,
  })

  player.emitter.startFollow(player)

  player.tankColor = sprite1;
  player.ballColor = ballColor;
  player.color = color;
  ball1.ballColor = ballColor;

  player.playerId = playerInfo.playerId;
  barrel.playerId = playerInfo.playerId;
  wheel.playerId = playerInfo.playerId;
  ball1.playerId = playerInfo.playerId

  self.players.add(player);
  self.barrels.add(barrel);
  self.wheels.add(wheel);
  self.balls1.add(ball1);

}


