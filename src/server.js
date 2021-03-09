var WebSocketServer = require('websocket').server;
var http = require('http');
var mysql = require('mysql');
var pool  = mysql.createPool({
    host     : 'tmp',
    port : 'tmp',
    user     : 'tmp',
    password : 'tmp',
    database : 'tmp'
});

var data = 0;
var clients = [];
var loggedIN = [];
var users_progress = [];
var onlineUsers = [];
var inGameUsers = [];
var server = http.createServer(function(request, response) {});
server.listen(2137, function() {
    console.log("Uruchomiony...");
});

wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  var index = clients.push(connection) - 1;

  console.log((new Date()) + ' Connection accepted.');
  var userID = -1
  var user2dArray = []

  connection.on('message', function(message) {
        userID = userID + 1
        message_str = message.utf8Data

        if (message_str.substring(0,3) == "get") {
            if (message_str.split("get")[1] == "true") {
                    db_get_sudoku(true, function(err, data) {
                        if (!err) {
                            if (message_str.split("get")[2] == "true") {
                                var json = JSON.stringify({ type:'sudokuSingle', data: data});
                                loggedIN[index].sendUTF(json)
                            } else if (message_str.split("get")[2] == "false") {
                                inGameUsers.push([onlineUsers[index].split(" ")[0], -1])
                                var jsonJoin = JSON.stringify({ type:'joining', data: inGameUsers});

                                for (var i = 0; i < loggedIN.length; i++) {
                                    loggedIN[i].sendUTF(jsonJoin)
                                }

                                var json = JSON.stringify({ type:'sudoku', data: data});
                                var jsonREADY = JSON.stringify({ type:'readyUp', data: data});
                                loggedIN[index].sendUTF(json)
                                for (var i = 0; i < loggedIN.length; i++) {
                                    if (i == index) {
                                        continue
                                    }
                                    loggedIN[i].sendUTF(jsonREADY)
                                }
                            }

                        } else {
                            console.log(err);
                        }
                    })

            } else if (message_str.split("get")[1] == "false") {
                db_get_sudoku(false, function(err, data) {
                    if (!err) {
                        if (message_str.split("get")[2] == "true") {
                            var json = JSON.stringify({ type:'sudokuSingle', data: data});
                            loggedIN[index].sendUTF(json)
                        } else if (message_str.split("get")[2] == "false") {
                            inGameUsers.push([onlineUsers[index].split(" ")[0], -1])
                            var jsonJoin = JSON.stringify({ type:'joining', data: inGameUsers});

                            for (var i = 0; i < loggedIN.length; i++) {
                                loggedIN[i].sendUTF(jsonJoin)
                            }

                            var json = JSON.stringify({ type:'sudoku', data: data});
                            var jsonREADY = JSON.stringify({ type:'readyUp', data: data});
                            loggedIN[index].sendUTF(json)
                            for (var i = 0; i < loggedIN.length; i++) {
                                if (i == index) {
                                    continue
                                }
                                loggedIN[i].sendUTF(jsonREADY)
                            }
                        }

                    } else {
                        console.log(err);
                    }
                })
            }
        } else if (message_str.substring(0,4) == "save") {
            var playerID = parseInt(onlineUsers[index].split(" ")[1])
            var gameStr = message_str.split("save")[1]
            var gameID = parseInt(message_str.split("save")[2])
            var hints = parseInt(message_str.split("save")[4])
            var mistakes = parseInt(message_str.split("save")[3])
            var type = message_str.split("save")[5]
            var finished = message_str.split("save")[6]
            db_insert_game(type, playerID, gameID, hints, mistakes, finished, gameStr, function(err, data){
                if (!err) {
                } else {
                    console.log(err);
                }
            })


        } else if (message_str == "join") {
            inGameUsers.push([onlineUsers[index].split(" ")[0], -1])
            var json = JSON.stringify({ type:'joining', data: inGameUsers});

            for (var i = 0; i < loggedIN.length; i++) {
                loggedIN[i].sendUTF(json)
            }
        } else if (message_str == "leave") {
            inGameUsers = []
            var json = JSON.stringify({ type:'joining', data: inGameUsers});

            for (var i = 0; i < loggedIN.length; i++) {
                loggedIN[i].sendUTF(json)
            }
        } else if (message_str.substring(0,4) == "prog") {
            inGameUsers[index][1] = parseInt(message_str.split("prog")[1])
            var jsonProg = JSON.stringify({ type:'prog', data: inGameUsers});
            for (var i = 0; i < loggedIN.length; i++) {
                loggedIN[i].sendUTF(jsonProg)
            }
        } else if (message_str.substring(0,11) == "leaderboard") {
            var playerID = parseInt(onlineUsers[index].split(" ")[1])
            if (message_str.split("leaderboard")[1] == "m") {
                db_get_leaderboard(message_str.split("leaderboard")[1], playerID, function(err, data) {
                    if (!err) {
                        var json = JSON.stringify({ type:'myStats', data: data});
                        loggedIN[index].sendUTF(json)
                    } else {
                        console.log(err);
                    }
                })
            } else if (message_str.split("leaderboard")[1] == "l") {
                db_get_leaderboard(message_str.split("leaderboard")[1], playerID, function(err, data) {
                    if (!err) {
                        var json = JSON.stringify({ type:'myStats', data: data});
                        loggedIN[index].sendUTF(json)
                    } else {
                        console.log(err);
                    }
                })
            }
        } else if (message_str.substring(0,6) == "insert") {
            var sud_exp = message_str.split("insert")[1]
            var sud_game_exp = message_str.split("insert")[2]
            var lvl = message_str.split("insert")[3]

            var jsonWAIT = JSON.stringify({ type:'wait', data: "data"});
            for (var i = 0; i < loggedIN.length; i++) {
                if (i == index) {
                    continue
                }
                loggedIN[i].sendUTF(jsonWAIT)
            }

            db_insert_sudoku(sud_exp, sud_game_exp, lvl, function(err, data){
                if (!err) {
                    console.log(data);
                } else {
                    console.log(err);
                }
            })

        } else {

            var login = null
            if (message_str.split(" ").length == 2) {
                player_email = null
                player_nick = message_str.split(" ")[0]
                player_password = message_str.split(" ")[1]
                console.log("Nick: " + player_nick);
                console.log("Password: " + player_password);
                login = true
                loggedIN.push(connection)
                users_progress.push({usr: connection, prog: 0})

            } else if (message_str.split(" ").length == 3) {
                player_email = message_str.split(" ")[0]
                player_nick = message_str.split(" ")[1]
                player_password = message_str.split(" ")[2]
                console.log("Nick: " + player_nick);
                console.log("Password: " + player_password);
                login = false
                loggedIN.push(connection)
            }

            if (login != null) {
                db_con_query(player_email, player_nick, player_password, login, function(err, data){
                    if (!err) {
                            if (data.length == 0) {
                                var json = JSON.stringify({ type:'denied', data: "User with this nick and password does not exist"});
                                clients[index].sendUTF(json)
                            } else {

                                var json = JSON.stringify({ type:'accepted', data: "ok"});
                                clients[index].sendUTF(json)
                                onlineUsers.push(player_nick+" "+data[0].id_player.toString())
                                var jsonOnline = JSON.stringify({ type:'onlineUsers', data: onlineUsers});
                            }
                            console.log(data);
                    } else {
                        console.log(err);
                    }
                })
            }
        }


  });



  connection.on('close', function(connection) {
    console.log("do widzenia " + connection);
    clients.splice(index, 1);
    loggedIN.splice(index, 1)
    onlineUsers.splice(index, 1)

  });
});

function db_get_sudoku(random, cbac) {
    var game, solution, count

    pool.getConnection(function(err, connection){
        if(err){
            return cb(err);
        }
        if (random) {

            connection.query("SELECT COUNT(*) as countSud FROM `Sud_game_exp`", function(err, data){
                    count = data[0].countSud
            });

            setTimeout(function() {
                var rand = Math.floor((Math.random() * count))
                connection.query("SELECT `Sud_game_ex`,`idSud_game_exp` FROM `Sud_game_exp` WHERE `idSud_game_exp`="+rand.toString(), function(err, data){
                        game = data
                });

                connection.query("SELECT `sud_source_full` FROM `Sud_exp` WHERE `idSud_ex_full`="+rand.toString(), function(err, data){
                        connection.release();
                        cbac(err, [game, data]);
                });
            }, 1000)

        } else if (!random) {
            connection.query("SELECT `Sud_game_ex`,`idSud_game_exp` FROM `Sud_game_exp` ORDER BY `idSud_game_exp` DESC LIMIT 1", function(err, data){
                    game = data
            });

            connection.query("SELECT `sud_source_full` FROM `Sud_exp` ORDER BY `idSud_ex_full` DESC LIMIT 1", function(err, data){
                    connection.release();
                    cbac(err, [game, data]);
            });
        }
    })
}

function db_con_query(email, nick, pass, login, cb) {
    pool.getConnection(function(err, connection){
        if(err){
            return cb(err);
        }
        var tmp
        if (login) {
            connection.query("SELECT * from `pleyars` where binary `Player_nick`='" + nick + "' and binary `password`='" + pass + "'", function(err, data){
                connection.release();
                cb(err, data);
            });
        }
        else if (!login) {
            connection.query("INSERT INTO `pleyars`(`Player_nick`, `email`, `password`) VALUES ('" + nick + "','" + email + "','" + pass + "')", function(err, data){
                tmp = data
                console.log("insert");
            });

            setTimeout(function() {
                connection.query("SELECT * from `pleyars` where binary `Player_nick`='" + nick + "' and binary `password`='" + pass + "'", function(err, data){
                    console.log("select");
                    connection.release();
                    cb(err, data);
                });
            }, 1200)


        }

    });


}



function db_insert_sudoku(exp, game_exp, level, cb) {
    var count

    pool.getConnection(function(err, connection){
        if(err){
            return cb(err);
        }

        connection.query("INSERT INTO `Sud_exp`(`sud_source_full`, `sudoku_counter`) VALUES ('"+ exp + "',0)", function(err, data){
        });

        setTimeout(function() {
            connection.query("SELECT `idSud_ex_full` FROM `Sud_exp` WHERE `sud_source_full`='"+ exp +"'", function(err, data){
                count = data[0].idSud_ex_full
            });

        }, 800)

        setTimeout(function() {
            connection.query("INSERT INTO `Sud_game_exp`(`idSud_ex_full`,`Sud_game_ex`, `level`) VALUES ("+ count.toString() + ",'" + game_exp + "',"+level.toString()+")", function(err, data){
                connection.release();
                cb(err, data);
            });
        }, 1600)



    });


}

function db_insert_game(type, playerID, gameID, hints, mistakes, finished, gameStr, cb) {
    var lastGameId = []

    var finishedBool = false
    if (finished == "true") {
        finishedBool = true
    }

    pool.getConnection(function(err, connection){
        if(err){
            return cb(err);
        }



        if (type == "i") {
            connection.query("INSERT INTO `game`(`id_player`, `idSud_game_exp`, `number_error`, `number_hints`, `game_finished`, `game_table`) VALUES ("+ playerID + "," + gameID + "," + mistakes + "," + hints + "," + finishedBool + ",'" + gameStr + "')", function(err, data){
                connection.release();
                cb(err, data);
            });
        } else if (type == "u") {
            connection.query("SELECT `id_gp` FROM `game` WHERE `id_player`="+playerID.toString()+" ORDER BY `id_gp` DESC LIMIT 1", function(err, data){
                lastGameId = data[0].id_gp
            });

            setTimeout(function() {
                connection.query("UPDATE `game` SET `number_error`="+mistakes+",`number_hints`="+hints+",`game_finished`="+finishedBool+",`game_table`='"+gameStr+"' WHERE `id_gp`="+lastGameId.toString(), function(err, data){
                    connection.release();
                    cb(err, data);
                });
            }, 1200)


        }



    });


}

function db_get_leaderboard(type, playerID, cb) {
    pool.getConnection(function(err, connection){
        if(err){
            return cb(err);
        }

        if (type == "m") {
            connection.query("SELECT `data`,`number_error`,`number_hints`,`game_finished` FROM `game` WHERE `id_player`="+playerID.toString(), function(err, data){
                connection.release();
                cb(err, data);
            });
        } else if (type == "l") {
            connection.query("SELECT `pleyars`.`Player_nick` AS NICK,COUNT(*) AS GRY ,SUM(`game`.`game_finished`) AS WYGRANE FROM `game` JOIN `pleyars` ON `pleyars`.`id_player`=`game`.`id_player` GROUP BY `pleyars`.`Player_nick` ORDER BY COUNT(*) DESC", function(err, data){
                connection.release();
                cb(err, data);
            });
        }
    });
}
