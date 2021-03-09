var matrix = []
var sudokuDB = []
var globalGuestGame = []
var globalGuestSolu = []
var globalSingleGame = []
var globalSingleSolu = []
var globalMultiGame = []
var globalMultiSolu = []

var sudokuAppGuest = new Vue({

    el: '#app-sudoku-guest',

    data: {
        mistakes: [],
        hints: [],
        curr_row: 10,
        curr_col: 10,
        selected: false,
        sudokuMatrix: [],
        initializeGameText: "Get Sudoku",
        evaluateGameText: "Verify!",
        answerImage: "",
        complete: false,
        isGameStarted: false,
        showAnswer: false
    },

    methods: {

        onRefresh(){
            var mate = this.initializeGuestGame()
            this.sudokuMatrix = mate
            this.initializeGameText = "Ready!";
            this.isGameStarted = true;
            this.mistakes = []
        },

        initializeGuestGame() {
            var sudokuMat = []
            var mat = []
            var gameMat = []
            console.log("Generowanie Sudoku");
            [mat, gameMat] = generate(3)
            globalGuestGame = gameMat
            globalGuestSolu = mat

            console.log(mat);
            var row = []
            for (var i = 0; i < mat.length; i++) {
                row = []
                for (var j = 0; j < mat.length; j++) {
                    row.push({num: gameMat[i][j], st:1})
                }
                sudokuMat.push(row)
            }

            for (var i = 0; i < sudokuMat.length; i++) {
                for (var j = 0; j < sudokuMat.length; j++) {
                    if (sudokuMat[i][j].num == 0) {
                        sudokuMat[i][j].num = ""
                        sudokuMat[i][j].st = 0
                    }
                }
            }

            return sudokuMat


        },

        sendXY(row, col, num) {

            if (num == globalGuestSolu[row][col]) {
                this.sudokuMatrix[row][col].num = num
                this.sudokuMatrix[row][col].st = 2
                if (this.checkComplete()) {
                    this.gameoverSuccess()
                }
            }
            else if (num == '' && this.hints.length < 3) {
                this.getHint(row, col)
                if (this.checkComplete()) {
                    this.gameoverSuccess()
                }
            }
            else if (num != globalGuestSolu[row][col]) {
                this.mistakes.push("1");
            }

            if (this.mistakes.length >= 3) {
                this.answerImage = "wrong.png";
                this.showAnswer = true;
                this.isGameStarted = false;
                this.mistakes = []
                this.hints = []
                this.curr_row = 10
                this.curr_col = 10
                this.selected = false

                setTimeout(() => {
                    var mate = this.initializeGuestGame()
                    this.sudokuMatrix = mate

                    this.showAnswer = false;
                    this.isGameStarted = true;
                }, 1700);
            }

        },

        gameoverSuccess() {
            this.answerImage = "ok.png";
            this.showAnswer = true;
            this.isGameStarted = false;
            this.mistakes = []
            this.hints = []
            this.curr_row = 10
            this.curr_col = 10
            this.selected = false

            setTimeout(() => {
                var mate = this.initializeGuestGame()
                this.sudokuMatrix = mate

                this.showAnswer = false;
                this.isGameStarted = true;
            }, 1700);
        },

        checkComplete() {
            for (var i = 0; i < this.sudokuMatrix.length; i++) {
                for (var j = 0; j < this.sudokuMatrix.length; j++) {
                    if (this.sudokuMatrix[i][j].num == 0 || this.sudokuMatrix[i][j].num != globalGuestSolu[i][j]) {
                        return false
                    }
                }
            }
            return true
        },

        getHint(row, col) {
            this.sudokuMatrix[row][col].num = globalGuestSolu[row][col]
            this.sudokuMatrix[row][col].st = 3
            this.hints.push("1")
        }


    }

})

var sudokuApp = new Vue({

    el: '#app-sudoku',

    data: {

        mistakes: [],
        hints: [],
        playersList: [],
        myStatsApp: [],
        statsType: "",
        maxMistakes: 3,
        single: false,
        currentProgress: 0,
        entered: 0,
        numberOfZeros: 0,
        maxHints: 3,
        curr_row: 10,
        curr_col: 10,
        selected: false,
        gameIdDB: -1,
        sudokuMatrix: [],
        initializeGameText: "Get Sudoku",
        evaluateGameText: "Verify!",
        answerImage: "",
        complete: false,
        isGameStarted: false,
        showAnswer: false

    },

    methods: {

        sendProgress(row, col, val) {
            tmpSendMyProgress()
        },

        getStats(type) {
            getLeaderboard(type)
            sudokuApp.myStatsApp = []
            setTimeout(function() {
                  if (myStats != []) {
                      sudokuApp.myStatsApp = myStats
                      if (type == "m") {

                          sudokuApp.statsType = type
                          for (var i = 0; i < myStats.length; i++) {
                              if (myStats[i].game_finished == 0) {
                                  sudokuApp.myStatsApp[i].game_finished = "Not finished"
                              } else {
                                  sudokuApp.myStatsApp[i].game_finished = "Finished"
                              }
                          }
                      }
                      sudokuApp.statsType = type
                      console.log(sudokuApp.myStatsApp);
                  }
                  else {
                      console.log("Error");
                  }


            }, 2500);
        },

        joinGame() {
            this.sudokuMatrix = matrix
            console.log(matrix);
            this.isGameStarted = true;
        },

        updatePlayers() {
            setTimeout(function() {
                    sudokuApp.playersList = []
                    for (var i = 0; i < inGameUsers.length; i++) {
                        sudokuApp.playersList.push([inGameUsers[i][0], inGameUsers[i][1]])
                    }
                sudokuApp.updatePlayers()
            }, 1200)

        },

        saveSingleGame(type) {
            var savedGameStr = ""
            var finished = true
            for (var i = 0; i < this.sudokuMatrix.length; i++) {
                for (var j = 0; j < this.sudokuMatrix.length; j++) {
                    if (this.sudokuMatrix[i][j].num == "") {
                        savedGameStr = savedGameStr + "0"
                        if (finished) {
                            finished = false
                        }
                    } else {
                        savedGameStr = savedGameStr + this.sudokuMatrix[i][j].num
                    }
                }
            }

            saveGameToDB(type, savedGameStr, this.gameIdDB, this.maxMistakes-this.mistakes.length, this.maxHints-this.hints.length, finished)

            if (type == "u") {
                setTimeout(() => {
                    this.isGameStarted = false;
                    this.showAnswer = false
                    this.mistakes = []
                    this.hints = []
                    this.curr_row = 10
                    this.curr_col = 10
                    this.selected = false
                    this.entered = 0
                    this.currentProgress = 0

                    showSingleOver()
                    console.log("Welcome back!");
                }, 1700);
            }


        },

        prepareGame(flag) {
            var mySudokuMatrix = []

            if (flag == "false") {
                this.single = false
            } else if (flag == "true") {
                this.single = true
            }

            sudoku_array = db_sudoku[0][0].Sud_game_ex
            this.gameIdDB = db_sudoku[0][0].idSud_game_exp
            sudoku_solution = db_sudoku[1][0].sud_source_full

            var row = []
            globalSingleSolu = []
            for (var i = 0; i < sudoku_solution.length + 1; i++) {
                if (i % 9 == 0 && i != 0) {
                    globalSingleSolu.push(row)
                    row = []
                }
                row.push(parseInt(sudoku_solution[i]))
            }

            console.log(globalSingleSolu);

            var row = []
            for (var i = 0; i < sudoku_array.length + 1; i++) {

                if (i % 9 == 0 && i != 0) {
                    mySudokuMatrix.push(row)
                    row = []
                }
                row.push({num: sudoku_array[i], st:1})
            }

            var zeros = 0
            for (var i = 0; i < mySudokuMatrix.length; ++i) {
                for (var j = 0; j < mySudokuMatrix[0].length; j++) {
                    if (mySudokuMatrix[i][j].num == 0) {
                        mySudokuMatrix[i][j].num = ""
                        mySudokuMatrix[i][j].st = 0
                        zeros = zeros + 1
                    }
                }
            }

            this.numberOfZeros = zeros
            sudokuApp.updatePlayers()

            matrix = mySudokuMatrix
            this.sudokuMatrix = mySudokuMatrix
            this.isGameStarted = true;
        },

        initializeMyGame(isSingle) {

            if (isSingle == "false") {
                disconnectFromGame()
            }

            askForSudoku("true", isSingle)

            setTimeout(function() {
                  if (db_sudoku != "") {

                      this.maxMistakes = 3
                      this.maxHints = 3
                      if (isSingle == "true") {
                          sudokuApp.prepareGame('true')
                          sudokuApp.single = true
                          sudokuApp.saveSingleGame("i")
                      } else {
                          sudokuApp.prepareGame('false')
                          sudokuApp.single = false
                      }
                  }
                  else {
                      console.log("Error");
                  }


            }, 2500);
        },

        generateToDB(isSingle, lvl) {
            var sudokuMatMulti = []
            var matMulti = []
            var gameMatMulti = []
            var matMultiToDB = ""
            var gameMatMultiToDB = ""
            console.log("Generowanie");
            [matMulti, gameMatMulti] = generate(lvl*2)
            globalMultiGame = gameMatMulti
            globalMultiSolu = matMulti

            for (var i = 0; i < matMulti.length; i++) {
                for (var j = 0; j < matMulti.length; j++) {
                    matMultiToDB = matMultiToDB + matMulti[i][j].toString()
                    gameMatMultiToDB = gameMatMultiToDB + gameMatMulti[i][j].toString()
                }
            }

            if (isSingle == "true") {
                insertToDB(matMultiToDB, gameMatMultiToDB, lvl)
                switch (lvl) {
                    case 3:
                        this.maxMistakes = 2
                        this.maxHints = 2
                        break;
                    case 2:
                        break;
                    case 1:
                        this.maxMistakes = 4
                        this.maxHints = 4
                        break;
                    default:
                }
            } else {
                disconnectFromGame()
                insertToDB(matMultiToDB, gameMatMultiToDB, 2)
                this.maxMistakes = 3
                this.maxHints = 3
            }


            setTimeout(function() {askForSudoku("false", isSingle)}, 2500);



            setTimeout(function() {
                  if (db_sudoku != "") {
                      sudokuApp.prepareGame(true)
                      if (isSingle == "true") {
                          sudokuApp.single = true
                          sudokuApp.saveSingleGame("i")
                      } else {
                          sudokuApp.single = false
                      }
                  }
                  else {
                      console.log("Error");
                  }
            }, 5000);

        },

        sendXY(row, col, num) {

            if (num == globalSingleSolu[row][col]) {
                this.sudokuMatrix[row][col].num = num
                this.sudokuMatrix[row][col].st = 2
                this.entered = this.entered + 1
                this.currentProgress = (this.entered/this.numberOfZeros) * 100
                if (this.single == false) {
                    tmpSendMyProgress(this.currentProgress)
                }
                if (this.checkComplete()) {
                    this.gameoverSuccess(this.single)
                }
            }
            else if (num == '' && this.hints.length < this.maxHints) {
                this.getHint(row, col)
                this.entered = this.entered + 1
                this.currentProgress = (this.entered/this.numberOfZeros) * 100
                if (this.single == false) {
                    tmpSendMyProgress(this.currentProgress)
                }
                if (this.checkComplete()) {
                    this.gameoverSuccess(this.single)
                }
            }
            else if (num != globalSingleSolu[row][col]) {
                this.mistakes.push("1");
            }

            if (this.mistakes.length >= this.maxMistakes) {
                this.answerImage = "wrong.png";
                this.showAnswer = true;
                this.isGameStarted = false;
                this.mistakes = []
                this.hints = []
                this.curr_row = 10
                this.curr_col = 10
                this.selected = false

                setTimeout(() => {

                    this.showAnswer = false;
                }, 1700);
            }

        },

        gameoverSuccess(isSingle) {
            if (isSingle) {
                document.getElementById("saveGameBtn").style.display = "none"
                this.answerImage = "ok.png";
                this.showAnswer = true;
                sudokuApp.saveSingleGame("u")
            } else if (isSingle == false) {
                this.answerImage = "ok.png";
                this.showAnswer = true;
                setTimeout(function() {
                    sudokuApp.clearGame()
                }, 1700)

            }
        },

        clearGame() {
            this.isGameStarted = false;
            this.mistakes = []
            this.hints = []
            this.showAnswer = false;
            this.playersList = []
            this.curr_row = 10
            this.curr_col = 10
            this.selected = false
            this.single = false

            this.entered = 0
            this.currentProgress = 0

            showSingleOver()
        },

        checkComplete() {
            for (var i = 0; i < this.sudokuMatrix.length; i++) {
                for (var j = 0; j < this.sudokuMatrix.length; j++) {
                    if (this.sudokuMatrix[i][j].num == 0 || this.sudokuMatrix[i][j].num != globalSingleSolu[i][j]) {
                        return false
                    }
                }
            }
            return true
        },

        getHint(row, col) {
            this.sudokuMatrix[row][col].num = globalSingleSolu[row][col]
            this.sudokuMatrix[row][col].st = 3
            this.hints.push("1")
        }

    }
});
