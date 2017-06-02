/**
  * Author: John Politis
  * Date :   31/05/2017
  * Description : Create a ScoreBoard to track individual scores for the players
  */
function ScoreBoard() {
    var players = [];

    /**
      * Author: John Politis
      * Date :   31/05/2017
      * Description : provide an internal searching method
      */
    function searchForPlayer(player) {

        var el;
        for (var key in players) {
            if (players[key].name === player) {
                el = players[key];
                break;
            }
        }
        return el;
    }
    /**
      * Author: John Politis
      * Date :   31/05/2017
      * Description : add a player to the board
      */
    this.addPlayer = function (player,score) {

        players.push({ "name": player , "score": score });
        return this;
    }
    /**
      * Author: John Politis
      * Date :   31/05/2017
      * Description : updates the users score
      */
    this.addScore = function (player,score) {

        searchForPlayer(player).score += score;

        return this;
    }
    /**
      * Author: John Politis
      * Date :   31/05/2017
      * Description : find the player and return the score
      */
    this.getScore = function(player) {

        return searchForPlayer(player).score;
    }
    /**
      * Author: John Politis
      * Date :   02/06/2017
      * Description : Store our scoreboard
      */
    this.persist = function() {
        localStorage.setItem("tictactoe-ScoreBoard", JSON.stringify(players) );
    }
    /**
      * Author: John Politis
      * Date :   02/06/2017
      * Description : Reload our scores from our storage
      */
    this.loadScores = function() {

        loadingScores = JSON.parse(localStorage.getItem('tictactoe-ScoreBoard') );

        for (var i in loadingScores) {
            this.addScore( loadingScores[i].name, loadingScores[i].score );
        }
    }

};
