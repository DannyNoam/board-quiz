var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io,
    rooms = [],
    roomNumberSuffix = 0,
    isGameFull = false;

var NUMBER_OF_QUESTIONS_PER_CATEGORY = 10,
    PORT = process.env.PORT || 5000,
    PLAYER_1 = "PLAYER_1",
    PLAYER_2 = "PLAYER_2";

var SocketConstants = {
    'emit' : {
        'PLAYERS_HEALTH' : 'players-health',
        'DICE_NUMBER' : 'dice-number',
        'RANDOM_QUESTION' : 'random-question',
        'INIT_NEW_TURN' : 'init-new-turn',
        'DAMAGE_DEALT' : 'damage-dealt',
        'SHUFFLED_ANSWER_INDICES' : 'shuffled-answer-indices',
        'GAME_FOUND' : 'game-found',
        'GAME_STATS' : 'game-stats',
        'GAME_STATUS' : 'game-status'
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
        'SHUFFLE_ANSWER_INDICES' : 'shuffle-answer-indices',
        'GAME_ENDED' : 'game-ended',
        'IS_GAME_FULL' : 'is-game-full'
    }
};

var setupServer = (function() {
    app.use("/", express.static(__dirname + '/'));
    server = http.Server(app);
    server.listen(PORT);
    io = socketIO(server);
})();

io.on(SocketConstants.on.CONNECTION, function (socket) {
    
    this.players = {};
    
  socket.on(SocketConstants.on.FINDING_GAME, function (playerData) {
      this.players[PLAYER_1] = new Player(socket.id, playerData.avatar);
      if(Lobby.getNumberOfPlayersWaiting() > 0) {
          this.roomName = Lobby.getFirstRoom().name;
          this.players[PLAYER_2] = Lobby.getFirstRoom().player;
          joinRoom(this.roomName);
          cleanUpLobbyForGameFound();
          initiateGame(this.roomName, this.players[PLAYER_1], this.players[PLAYER_2]);
          isGameFull = true;
      } else {
          joinRoom(this.roomName);
          Lobby.addRoom(this.roomName, this.players[PLAYER_1]);
          Lobby.addPlayer(this.players[PLAYER_1]);
      }
  }.bind(this));
    
  socket.on(SocketConstants.on.GET_PLAYERS_HEALTH, function() {
      socket.emit(SocketConstants.emit.PLAYERS_HEALTH, {player1Health: this.players[PLAYER_1].getHealth(), player2Health: this.players[PLAYER_2].getHealth()});
  }.bind(this));
    
  socket.on(SocketConstants.on.DISCONNECT, function (playerData) {
      Lobby.removePlayer(socket.id);
      Lobby.removeRoom(socket.id);
      isGameFull = false;
  });
    
  socket.on(SocketConstants.on.ROLL_DICE, function() {
      io.to(this.roomName).emit(SocketConstants.emit.DICE_NUMBER, {number: Dice.roll()});
  });
    
    socket.on(SocketConstants.on.IS_GAME_FULL, function() {
      socket.emit(SocketConstants.emit.GAME_STATUS, isGameFull); 
    });
    
  socket.on(SocketConstants.on.GET_RANDOM_QUESTION, function(data) {
      var questionPrefix = 'QUESTION_';
      var category = data.categories[Dice.roll()];
      var question = data.questions[category][questionPrefix + randomNumberBetween(1, NUMBER_OF_QUESTIONS_PER_CATEGORY)];
     io.to(this.roomName).emit(SocketConstants.emit.RANDOM_QUESTION, {category: category, question: question});
  }.bind(this));
    
  socket.on(SocketConstants.on.NEW_TURN, function() {
      io.to(this.roomName).emit(SocketConstants.emit.INIT_NEW_TURN, {player1Health: this.players[PLAYER_1].getHealth(), player2Health: this.players[PLAYER_2].getHealth()});
  }.bind(this));
    
  socket.on(SocketConstants.on.DEAL_DAMAGE, function(data) {
      var playerToDamage = this.players[data.player_to_damage];
      var playerWhoAnswered = this.players[data.player_who_answered];
      updatePlayerAnswerStats(playerWhoAnswered, data);
      playerToDamage.takeHit(data.damage);
      io.to(this.roomName).emit(SocketConstants.emit.DAMAGE_DEALT, {player_who_answered: data.player_who_answered, player1Health: this.players[PLAYER_1].getHealth(), player2Health: this.players[PLAYER_2].getHealth(), answer: data.answer});
  }.bind(this));
    
  socket.on(SocketConstants.on.SHUFFLE_ANSWER_INDICES, function(data) {
      var indices = data.indices.sort(function() {
          return 0.5 - Math.random();
      });
      io.to(this.roomName).emit(SocketConstants.emit.SHUFFLED_ANSWER_INDICES, data.indices); 
  });
    
socket.on(SocketConstants.on.GAME_ENDED, function(data) {
    io.to(this.roomName).emit(SocketConstants.emit.GAME_STATS, {player1CorrectAnswerPercentage: this.players[PLAYER_1].calculateCorrectAnswerPercentage(), player1BestCategory: this.players[PLAYER_1].calculateBestCategory().name, player1BestCategoryPercentage: this.players[PLAYER_1].calculateBestCategory().percentageCorrect, player2CorrectAnswerPercentage: this.players[PLAYER_2].calculateCorrectAnswerPercentage(), player2BestCategory: this.players[PLAYER_2].calculateBestCategory().name, player2BestCategoryPercentage: this.players[PLAYER_2].calculateBestCategory().percentageCorrect, winner: data.winner});
}.bind(this));
    
    
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
      io.to(roomName).emit(SocketConstants.emit.GAME_FOUND, {roomName: roomName, player1Id: player1Id, player2Id: player2Id, player1Avatar: player1Avatar, player2Avatar: player2Avatar});
  }
    
  function joinRoom(roomName) {
      socket.join(roomName);
  }
    
  function generateRoomName() {
      var roomNamePrefix = 'Room_';
      var roomName = roomNamePrefix + roomNumberSuffix;
      roomNumberSuffix++;
      return roomName;
  }
    
  function updatePlayerAnswerStats(player, data) {
      if(data.answerStatus === 'correct') {
          player.increaseCorrectAnswers();
          player.increaseCategoryRightAnswer(data.category);
      } else {
          player.increaseWrongAnswers();
          player.increaseCategoryWrongAnswer(data.category);
      }
  }
    
});

var Player = function(id, avatar) {
    var id = id;
    var avatar = avatar;
    var health = 30;
    var correctAnswers = 0;
    var wrongAnswers = 0;
    var categoryAnswerData = {
        'SPORT' : {
            'right': 0,
            'wrong': 0
        },
        'GEOGRAPHY' : {
            'right' : 0,
            'wrong' : 0
        },
        'HISTORY' : {
            'right' : 0,
            'wrong' : 0
        },
        'SCIENCE' : {
            'right' : 0,
            'wrong' : 0
        },
        'LITERATURE' : {
            'right' : 0,
            'wrong' : 0
        },
        'ENTERTAINMENT' : {
            'right' : 0,
            'wrong' : 0
        }
    }
    
    this.takeHit = function(damage) {
        health = health - damage;
        if(health < 0) {
            health = 0;
        }
    };
    
    this.increaseCorrectAnswers = function() {
        correctAnswers++;
    };
    
    this.increaseWrongAnswers = function() {
        wrongAnswers++;
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
    
    this.increaseCategoryRightAnswer = function(category) {
        console.log(categoryAnswerData);
        console.log(category);
        categoryAnswerData['' + category].right++;
    };
    
    this.increaseCategoryWrongAnswer = function(category) {
        console.log("Category is " + category);
        categoryAnswerData[category].wrong++;
    };
    
    this.calculateCorrectAnswerPercentage = function() {
        var totalNumberOfAnswers = correctAnswers + wrongAnswers;
        var correctAnswerPercentage = ((correctAnswers/totalNumberOfAnswers)*100).toFixed(0);
        return correctAnswerPercentage !== "NaN" ? correctAnswerPercentage + "%" : "0%";
    };
    
    this.calculateBestCategory = function() {
        var bestCategory = {
            'name' : "None",
            'percentageCorrect' : 0
        }
        var categories = ["SPORT", "GEOGRAPHY", "HISTORY", "SCIENCE", "LITERATURE", "ENTERTAINMENT"];
        for(var i = 0; i < categories.length; i++) {
            var numberOfRightAnswers = categoryAnswerData[categories[i]].right;
            var numberOfWrongAnswers = categoryAnswerData[categories[i]].wrong;
            var totalAnswers = numberOfRightAnswers + numberOfWrongAnswers;
            var correctAnswerPercentage = numberOfRightAnswers > 0 ? ((numberOfRightAnswers/totalAnswers)*100).toFixed(0) : 0;
            console.log("Category: " + categories[i]);
            console.log("Percentage correct: " + correctAnswerPercentage);
            if(correctAnswerPercentage > (bestCategory.percentageCorrect)) {
                bestCategory.name = categories[i];
                bestCategory.percentageCorrect = correctAnswerPercentage;
            } else if(correctAnswerPercentage === bestCategory.percentageCorrect) {
                bestCategory.name = bestCategory.name + "/" + categories[i];
            }
        }
        
        return bestCategory;
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