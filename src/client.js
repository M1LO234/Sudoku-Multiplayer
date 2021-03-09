var connection = null
var db_sudoku = ""
var inGameUsers = []
var myStats = []

function askForSudoku(random, single) {
    connection.send("get"+random+"get"+single.toString())
}

function joinSudokuRequest() {
    connection.send("join")
}

function getLeaderboard(type) {
    connection.send("leaderboard"+type.toString())
}

function saveGameToDB(type, gameStr, id, mistakes, hints, finished) {
    connection.send("save"+gameStr+"save"+id.toString()+"save"+mistakes.toString()+"save"+hints.toString()+"save"+type.toString()+"save"+finished.toString())
}

function insertToDB(sud_exp, sud_game_exp, level) {
    connection.send("insert"+sud_exp.toString()+"insert"+sud_game_exp.toString()+"insert"+level.toString())
}

function disconnectFromGame() {
    connection.send("leave")
}

function tmpSendMyProgress(progress) {
    connection.send("prog"+progress.toString())
}

function signIN() {
    var name = document.getElementById("nick").value;
    var pass = document.getElementById("pass").value;
    connection.send(name + " " + pass)
}

function signUp() {
    var email = document.getElementById("email").value;
    var name = document.getElementById("nick").value;
    var pass = document.getElementById("pass").value;
    connection.send(email + " " + name + " " + pass)
}

$(function () {
    connection = new WebSocket('ws://127.0.0.1:2137');

    connection.onopen = function () {};

    connection.onerror = function (error) {
        content.html($('<p>', {
          text: 'Sorry, but there\'s some problem with your '
             + 'connection or the server is down.'
        }));
    };
    connection.onmessage = function (message) {
        try {
          var json = JSON.parse(message.data);
        } catch (e) {
          console.log('Invalid JSON: ', message.data);
          return;
        }
        if (json.type === 'message') {
          document.getElementById("status").innerHTML = json.data;
      } else if (json.type === 'denied') {
          document.getElementById("status").innerHTML = json.data;
      } else if (json.type === 'accepted') {
          document.getElementById("status").innerHTML = json.data;
          document.getElementById("LoginRegisterScreen").style.display = "none"
          document.getElementById("Game").style.display = "block"
          document.getElementById("getSudokuBtn").style.display = "block"
          document.getElementById("generateBtn").style.display = "block"
          document.getElementById("labelMulti").style.display = "block"
          document.getElementById("getSudokuBtnSingle").style.display = "block"
          document.getElementById("generateBtnSingle").style.display = "block"
          document.getElementById("labelSingle").style.display = "block"
          document.getElementById("leaderboardBtn").style.display = "block"
      } else if (json.type === 'sudoku') {
          document.getElementById("getSudokuBtn").style.display = "none"
          document.getElementById("generateBtn").style.display = "none"
          document.getElementById("labelMulti").innerHTML = "Solve SUDOKU"
          document.getElementById("getSudokuBtnSingle").style.display = "none"
          document.getElementById("generateBtnSingle").style.display = "none"
          document.getElementById("labelSingle").style.display = "none"
          document.getElementById("leaveGameButton").style.display = "block"
          document.getElementById("progContainer").style.display = "block"
          document.getElementById("generateBtnSingleEasy").style.display = "none"
          document.getElementById("generateBtnSingleMedium").style.display = "none"
          document.getElementById("generateBtnSingleHard").style.display = "none"


          db_sudoku = json.data
      } else if (json.type === 'sudokuSingle') {
          document.getElementById("getSudokuBtn").style.display = "none"
          document.getElementById("generateBtn").style.display = "none"
          document.getElementById("labelMulti").innerHTML = "Solve SUDOKU"
          document.getElementById("getSudokuBtnSingle").style.display = "none"
          document.getElementById("generateBtnSingle").style.display = "none"
          document.getElementById("labelSingle").style.display = "none"
          document.getElementById("saveGameBtn").style.display = "block"
          document.getElementById("generateBtnSingleEasy").style.display = "none"
          document.getElementById("generateBtnSingleMedium").style.display = "none"
          document.getElementById("generateBtnSingleHard").style.display = "none"

          db_sudoku = json.data
      } else if (json.type === 'wait') {
          document.getElementById("getSudokuBtn").style.display = "none"
          document.getElementById("generateBtn").style.display = "none"
          document.getElementById("generateBtnSingle").style.display = "none"
          document.getElementById("readyUpBtn").style.display = "block"
      } else if (json.type === 'onlineUsers') {
          console.log(json.data);

      } else if (json.type === 'myStats') {
          myStats = json.data
      } else if (json.type === 'readyUp') {
          document.getElementById("getSudokuBtn").style.display = "none"
          document.getElementById("generateBtn").style.display = "none"
          document.getElementById("labelMulti").innerHTML = "Solve SUDOKU"
          document.getElementById("getSudokuBtnSingle").style.display = "none"
          document.getElementById("generateBtnSingle").style.display = "none"
          document.getElementById("labelSingle").style.display = "none"
          document.getElementById("readyUpBtn").style.display = "block"
          db_sudoku = json.data
      } else if (json.type === 'joining') {
          inGameUsers = json.data
      } else if (json.type === 'prog') {
          inGameUsers = json.data
      }
      else {
          console.log('Hmm..., I\'ve never seen JSON like this:', json);
        }
    };
});
