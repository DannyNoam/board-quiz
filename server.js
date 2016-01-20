var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io,
    rooms = [],
    roomNumberSuffix = 0;

var NUMBER_OF_QUESTIONS_PER_CATEGORY = 10,
    PORT = 5000,
    ROOM_NAME_PREFIX = 'Room_',
    QUESTION_PREFIX = 'QUESTION_',
    PLAYER_1 = "PLAYER_1",
    PLAYER_2 = "PLAYER_2";

var socketConstants = {
    'emit' : {
        'PLAYERS_HEALTH' : 'players-health',
        'DICE_NUMBER' : 'dice-number',
        'RANDOM_QUESTION' : 'random-question',
        'INIT_NEW_TURN' : 'init-new-turn',
        'DAMAGE_DEALT' : 'damage-dealt',
        'SHUFFLED_ANSWER_INDICES' : 'shuffled-answer-indices',
        'GAME_FOUND' : 'game-found'
    },
    
    'on' : {
        'CONNECTION' : 'connection',
        'FINDING_GAME' : 'finding-game',
        'GET_PLAYERS_HEALTH' : 'get-players-health',
        'DISCONNECT' : 'disconnect',
        'ROLL_DICE' : 'roll-dice',
        'GET_RANDOM_QUESTION' : 'get-random-question',
        'NEW_TURN' : 'new-turn',
        'DEAL_DAMAGE' : 'deal-damage',
        'SHUFFLE_ANSWER_INDICES' : 'shuffle-answer-indices'
    }
};

var setupServer = (function() {
    app.use("/", express.static(__dirname + '/'));
    server = http.Server(app);
    server.listen(PORT);
    io = socketIO(server);
})();

io.on(socketConstants.on.CONNECTION, function (socket) {
    
  this.players = {};
    
  socket.on(socketConstants.on.FINDING_GAME, function (playerData) {
      this.players[PLAYER_1] = new Player(socket.id, playerData.avatar);
      if(Lobby.getNumberOfPlayersWaiting() > 0) {
          this.roomName = Lobby.getFirstRoom().name;
          this.players[PLAYER_2] = Lobby.getFirstRoom().player;
          joinRoom(this.roomName);
          cleanUpLobbyForGameFound();
          initiateGame(this.roomName, this.players[PLAYER_1], this.players[PLAYER_2]);
      } else {
          var roomName = generateRoomName();
          joinRoom(this.roomName);
          Lobby.addRoom(this.roomName, this.players[PLAYER_1]);
          Lobby.addPlayer(this.players[PLAYER_1]);
      }
  }.bind(this));
    
  socket.on(socketConstants.on.GET_PLAYERS_HEALTH, function() {
      socket.emit(socketConstants.emit.PLAYERS_HEALTH, {player1Health: this.players[PLAYER_1].getHealth(), player2Health: this.players[PLAYER_2].getHealth()});
  }.bind(this));
    
  socket.on(socketConstants.on.DISCONNECT, function (playerData) {
      Lobby.removePlayer(socket.id);
      Lobby.removeRoom(socket.id);
  });
    
  socket.on(socketConstants.on.ROLL_DICE, function() {
      io.to(this.roomName).emit(socketConstants.emit.DICE_NUMBER, {number: Dice.roll()});
  });
    
  socket.on(socketConstants.on.GET_RANDOM_QUESTION, function(data) {
      var category = data.categories[Dice.roll()];
      var question = data.questions[category][QUESTION_PREFIX + randomNumberBetween(1, NUMBER_OF_QUESTIONS_PER_CATEGORY)];
     io.to(this.roomName).emit(socketConstants.emit.RANDOM_QUESTION, {category: category, question: question});
  }.bind(this));
    
  socket.on(socketConstants.on.NEW_TURN, function() {
      io.to(this.roomName).emit(socketConstants.emit.INIT_NEW_TURN, {player1Health: this.players[PLAYER_1].getHealth(), player2Health: this.players[PLAYER_2].getHealth()});
  }.bind(this));
    
  socket.on(socketConstants.on.DEAL_DAMAGE, function(data) {
      var playerToDamage = this.players[data.player_to_damage];
      playerToDamage.takeHit(data.damage);
      io.to(this.roomName).emit(socketConstants.emit.DAMAGE_DEALT, {player_who_answered: data.player_who_answered, player1Health: this.players[PLAYER_1].getHealth(), player2Health: this.players[PLAYER_2].getHealth(), answer: data.answer});
  }.bind(this));
    
  socket.on(socketConstants.on.SHUFFLE_ANSWER_INDICES, function(data) {
      var indices = data.indices.sort(function() {
          return 0.5 - Math.random();
      });
      io.to(this.roomName).emit(socketConstants.emit.SHUFFLED_ANSWER_INDICES, data.indices); 
  });
    
    
  function cleanUpLobbyForGameFound() {
      Lobby.removePlayer(socket.id);
      Lobby.removePlayer(Lobby.getFirstRoom().player.getId());
      Lobby.removeRoom(Lobby.getFirstRoom().name);
  }
    
  function initiateGame(roomName, player1, player2) {
      var player1Id = player1.getId();
      var player2Id = player2.getId();
      var player1Avatar = player1.getAvatar();
      var player2Avatar = player2.getAvatar();
      io.to(roomName).emit(socketConstants.emit.GAME_FOUND, {roomName: roomName, player1Id: player1Id, player2Id: player2Id, player1Avatar: player1Avatar, player2Avatar: player2Avatar});
  }
    
  function joinRoom(roomName) {
      socket.join(roomName);
  }
    
  function generateRoomName() {
      var roomName = ROOM_NAME_PREFIX + roomNumberSuffix;
      roomNumberSuffix++;
      return roomName;
  }
    
});

var Player = function(id, avatar) {
    var id = id;
    var avatar = avatar;
    var health = 30;
    
    this.takeHit = function(damage) {
        health = health - damage;
        if(health < 0) {
            health = 0;
        }
    };
    
    this.isAlive = function() {
        return health > 0;
    };
    
    this.getId = function() {
        return id;
    };
    
    this.getAvatar = function() {
        return avatar;
    };
    
    this.getHealth = function() {
        return health;
    };
};

var Lobby = {
    players: [],
    rooms: [],
    
    addPlayer: function(player) {
        Lobby.players[Lobby.players.length] = player;
    },
    
    addRoom: function(roomName, player) {
        Lobby.rooms[Lobby.rooms.length] = {name: roomName, player: player};
    },
    
    getNumberOfPlayersWaiting: function() {
        return Lobby.players.length;
    },
    
    removePlayer: function(id) {
        Lobby.players = Lobby.players.filter(function(player) {
            return player.getId() !== id;
        });
    },
    
    getFirstPlayer: function() {
        return Lobby.players[0];
    },
    
    getFirstRoom: function() {
        return Lobby.rooms[0];
    },
    
    removeRoom: function(roomName) {
        Lobby.rooms = Lobby.rooms.filter(function(room) {
            return room.name !== roomName;
        });
    },
};

var Dice = {
    roll : function() {
        return randomNumberBetween(1,6);
    }
};

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
}