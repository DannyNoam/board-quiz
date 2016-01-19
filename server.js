var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io,
    PORT = 5000,
    rooms = [],
    currentRoomNumber = 0,
    NUMBER_OF_QUESTIONS = 3;

app.use("/", express.static(__dirname + '/'));

server = http.Server(app);
server.listen(PORT);

io = socketIO(server);

io.on('connection', function (socket) {
    
  this.players = {};
    
  socket.on('finding-game', function (playerData) {
      this.players["PLAYER_1"] = new Player(socket.id, playerData.avatar);
      if(Lobby.getNumberOfPlayersWaiting() > 0) {
          this.roomName = Lobby.getFirstRoom().name;
          this.players["PLAYER_2"] = Lobby.getFirstRoom().player;
          joinRoom(this.roomName);
          cleanUpLobbyForGameFound();
          initiateGame(this.roomName, this.players["PLAYER_1"], this.players["PLAYER_2"]);
      } else {
          var roomName = generateRoomName();
          joinRoom(this.roomName);
          Lobby.addRoom(this.roomName, this.players["PLAYER_1"]);
          Lobby.addPlayer(this.players["PLAYER_1"]);
      }
  }.bind(this));
    
  socket.on('get-players-health', function() {
      console.log("Getting players' health!")
      socket.emit('players-health', {player1Health: this.players["PLAYER_1"].getHealth(), player2Health: this.players["PLAYER_2"].getHealth()});
  }.bind(this));
    
  socket.on('disconnect', function (playerData) {
      Lobby.removePlayer(socket.id);
      Lobby.removeRoom(socket.id);
  });
    
  socket.on('roll-dice', function() {
      console.log("Server: dice rolled");
      io.to(this.roomName).emit('dice-number', {number: Dice.roll()});
  });
    
  socket.on('get-random-question', function(data) {
      var category = data.categories[Dice.roll()];
      var question = data.questions[category]["QUESTION_" + randomNumberBetween(1, NUMBER_OF_QUESTIONS)];
     io.to(this.roomName).emit('random-question', {category: category, question: question});
  }.bind(this));
    
  socket.on('new-turn', function() {
      io.to(this.roomName).emit('init-new-turn', {player1Health: this.players["PLAYER_1"].getHealth(), player2Health: this.players["PLAYER_2"].getHealth()});
  }.bind(this));
    
  socket.on('deal-damage', function(data) {
      var playerToDamage = this.players[data.player_to_damage];
      playerToDamage.takeHit(data.damage);
      io.to(this.roomName).emit('damage-dealt', {player_who_answered: data.player_who_answered, player1Health: this.players["PLAYER_1"].getHealth(), player2Health: this.players["PLAYER_2"].getHealth(), answer: data.answer});
  }.bind(this));
    
  socket.on('shuffle-answer-indices', function(data) {
      var indices = data.indices.sort(function() {
          return 0.5 - Math.random();
      });
      console.log(indices);
      io.to(this.roomName).emit('shuffled-answer-indices', data.indices); 
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
      io.to(roomName).emit('game-found', {roomName: roomName, player1Id: player1Id, player2Id: player2Id, player1Avatar: player1Avatar, player2Avatar: player2Avatar});
  }
    
  function joinRoom(roomName) {
      socket.join(roomName);
  }
    
  function generateRoomName() {
      var roomName = 'Room_' + currentRoomNumber;
      currentRoomNumber++;
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
        return Math.floor(Math.random() * 6) + 1;
    }
};

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
}