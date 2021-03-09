function showLogIn() {
    document.getElementById("email").style.display = "none"
    document.getElementById("upButton").style.display = "none"
    document.getElementById("nick").style.display = "block"
    document.getElementById("pass").style.display = "block"
    document.getElementById("inButton").style.display = "block"
    document.getElementById("status").innerHTML = "Login to your account";
}

function showSignUp() {
    document.getElementById("email").style.display = "block"
    document.getElementById("upButton").style.display = "block"
    document.getElementById("nick").style.display = "block"
    document.getElementById("pass").style.display = "block"
    document.getElementById("inButton").style.display = "none"
    document.getElementById("status").innerHTML = "Register your new account";
}

function showSingleOver() {
    document.getElementById("saveGameBtn").style.display = "none"
    document.getElementById("Game").style.display = "block"
    document.getElementById("getSudokuBtn").style.display = "block"
    document.getElementById("labelMulti").innerHTML = "Multiplayer"
    document.getElementById("labelMulti").style.display = "block"
    document.getElementById("generateBtn").style.display = "block"
    document.getElementById("getSudokuBtnSingle").style.display = "block"
    document.getElementById("generateBtnSingle").style.display = "block"
    document.getElementById("labelSingle").style.display = "block"
    document.getElementById("leaveGameButton").style.display = "none"
    document.getElementById("progContainer").style.display = "none"
}

function joinGame() {
    document.getElementById("readyUpBtn").style.display = "none"
    document.getElementById("leaveGameButton").style.display = "block"
    document.getElementById("progContainer").style.display = "block"
    joinSudokuRequest()
}

function leaveGame() {
    document.getElementById("leaveGameButton").style.display = "block"
    document.getElementById("progContainer").style.display = "none"
}

function showLevels() {
    document.getElementById("generateBtnSingleEasy").style.display = "block"
    document.getElementById("generateBtnSingleMedium").style.display = "block"
    document.getElementById("generateBtnSingleHard").style.display = "block"
}

function showLeaderboard(type) {
    if (type == "Leaderboard") {
        document.getElementById("getSudokuBtn").style.display = "none"
        document.getElementById("generateBtn").style.display = "none"
        document.getElementById("labelMulti").innerHTML = "Leaderboard & Statistics"
        document.getElementById("leaderboardLbl").innerHTML = "Play!"
        document.getElementById("getSudokuBtnSingle").style.display = "none"
        document.getElementById("generateBtnSingle").style.display = "none"
        document.getElementById("labelSingle").style.display = "none"
        document.getElementById("generateBtnSingleEasy").style.display = "none"
        document.getElementById("generateBtnSingleMedium").style.display = "none"
        document.getElementById("generateBtnSingleHard").style.display = "none"
        document.getElementById("myStatsBtn").style.display = "block"
        document.getElementById("leaderboardStatsBtn").style.display = "block"
        document.getElementById("statsContainer").style.display = "block"
    } else {
        document.getElementById("LoginRegisterScreen").style.display = "none"
        document.getElementById("Game").style.display = "block"
        document.getElementById("leaderboardLbl").innerHTML = "Leaderboard"
        document.getElementById("labelMulti").innerHTML = "Multiplayer"
        document.getElementById("getSudokuBtn").style.display = "block"
        document.getElementById("generateBtn").style.display = "block"
        document.getElementById("labelMulti").style.display = "block"
        document.getElementById("getSudokuBtnSingle").style.display = "block"
        document.getElementById("generateBtnSingle").style.display = "block"
        document.getElementById("labelSingle").style.display = "block"
        document.getElementById("leaderboardBtn").style.display = "block"
        document.getElementById("myStatsBtn").style.display = "none"
        document.getElementById("leaderboardStatsBtn").style.display = "none"
        document.getElementById("statsContainer").style.display = "none"
    }



}
