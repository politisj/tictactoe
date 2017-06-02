/**
  * Author: John Politis
  * Date :   29/05/2017
  * Description : Tic-Tac-Toe
  */
$(document).ready(function(){

var app = {};
app.ui = {};
app.controller = {};
app.view = {};
app.version = '1.0.0';

/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : renders when a reset is requested
  */
app.view.reset = function() {
    this.clearWinner();
    this.clearGrid();
    this.clearGameOver();
    this.showPlayer ('O');

};
/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : clear the grid
  */
app.view.clearGrid = function() {
    $(".cell").text("");
};
/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : clear the Game Over text
  */
app.view.clearGameOver = function(){
    $('#gameOver').text('');
}
/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : clears the winners text controll
  */
app.view.clearWinner = function() {
    $('#winner').text("");
}
/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : renders when player clicks a square
  */
app.view.renderCell = function($playersCell,player){

    $playersCell.append(
            (player === 'X') ? $('<img>').attr("src","img/ex.gif")
                             : $('<img>').attr("src","img/oh.gif")
    );
};
/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : called to render when a winner is detected
  */
app.view.winner = function(player){
    $('#winner').text("Winner is :  " + player);
    app.view.gameOver();
};
/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : define the view interface
  */
app.view.badMove = function(){
};
/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : Show the player
  */
app.view.showPlayer = function(player){
    $('#next-players-turn').text('Next Players Turn : ' + player);
};
/**
  * Author: John Politis
  * Date :   30/05/2017
  * Description : Game Over
  */
app.view.gameOver = function(){
    $('#gameOver').text('*** GAME OVER ***');
    $('#playerSelection').attr('disabled', false);
};
/**
  * Author: John Politis
  * Date :   31/05/2017
  * Description : Show the scores on the UI
  */
app.view.showScore = function(scoreBoard){

    $('#score-playerO').text(('Player O   : ' + scoreBoard.getScore('O')));
    $('#score-playerX').text(('Player X   : ' + scoreBoard.getScore('X')));

};
/**
  * Author: John Politis
  * Date :   01/06/2017
  * Description : Get the chosen playes selection
  */
app.view.getPlayersSelection = function(){
     return $("#playerSelection option:selected").text();
}

/**
  * Author: John Politis
  * Date :   29/05/2017
  * Description : bind the eventHandlers to the controller
  */
app.ui.eventHandlers = {
    $playersCell: undefined,

    init: function() {

        $(".cell").on("click", function(){
            if (!app.controller.gameOver) {

                $playersCell = $(this);
                var row = $playersCell.attr("row");
                var col = $playersCell.attr("col");

                $('#playerSelection').attr('disabled', true);

                app.controller.playerMakesMove( row, col );
            }
        });

        $("#btnReset").on("click",function() {
            app.board.reset();
            app.view.reset();
            app.controller.gameOver = false;
            $('#playerSelection').attr('disabled', false)
        });

        $("#playerSelection").change(function() {
            app.controller._multiPlayer  = app.view.getPlayersSelection();
        });

        $("#btnSaveScore").on('click',function() {
            app.scoreBoard.persist();
        });

    }
};
/**
  * Author: John Politis
  * Date :   29/05/2017
  * Description : sets up the controller that will interface between the UI components
  *               and the model ( Board ).
  */
app.controller = {

    player : 0,                                 //keeps track of the current player
    gameOver: false,
    _multiPlayer: 'Multi Player',

    init: function() {

        /**
          * Author: John Politis
          * Date :   29/05/2017
          * Description :  create the actual game board
          */
        app.board = new AIBoard();
        /**
          * Author: John Politis
          * Date :   31/05/2017
          * Description :  create the ScoreBoard for tracking the players scores
          *                we setup two initial players and assign the score to 0
          *                by default.
          */
        app.scoreBoard = new ScoreBoard();
        app.scoreBoard.addPlayer('X',0)
                      .addPlayer('O',0);

        app.scoreBoard.loadScores();        //Reload our scores from storage
        app.view.showScore(app.scoreBoard);

        /**
          * Author: John Politis
          * Date :   29/05/2017
          * Description :  Register the Winner event and pass it to our view for rendering
          */
        app.board.on("Winner",function(p){
            var pl = app.controller.player  === 0 ? 'O' : 'X' ;

            app.controller.gameOver = true;
            app.scoreBoard.addScore(pl,1);
            app.view.winner(pl);
            app.view.showScore(app.scoreBoard);

        });
        /**
          * Author: John Politis
          * Date :   29/05/2017
          * Description :  Register the invalidMove event and pass it to our view for rendering
          */
        app.board.on("InvalidMove",function(p){
            app.view.badMove();
        });
        /**
          * Author: John Politis
          * Date :   29/05/2017
          * Description :  Register the invalidMove event and pass it to our view for rendering
          */
        app.board.on("GAMEOVER",function(p){
            app.controller.gameOver = true;
            app.view.gameOver();
            app.view.showScore(app.scoreBoard);
        });
        /**
          * Author: John Politis
          * Date :   29/05/2017
          * Description :  Wire up all our UI events
          */
        app.ui.eventHandlers.init();
        /**
          * Author: John Politis
          * Date :   02/06/2017
          * Description :  get the default players selection
          */
        app.controller._multiPlayer  = app.view.getPlayersSelection();

    },
    /**
      * Author: John Politis
      * Date :   29/05/2017
      * Description : when a move is made we update the board and toggle
      *               to the next player
      */
      playerMakesMove: function(row,col) {

         var playerToString = (app.controller.player=== 0 ? 'O' : 'X' ) ;
         var freeSlot;

         if ( app.controller._multiPlayer === 'Multi Player') {

             app.view.showPlayer(playerToString);
             app.board.playerMove( playerToString ,row,col);
             app.view.renderCell( $playersCell, app.controller.player  === 0 ? 'O' : 'X' );

             this.player = ~this.player;
             playerToString = (this.player === 0 ? 'O' : 'X' ) ;
             app.view.showPlayer(playerToString);
        }
        else {

             app.view.showPlayer(playerToString);
             app.board.playerMove( playerToString ,row,col);
             app.view.renderCell( $playersCell, 'O' );

             //AI's turn
             app.controller.player = ~app.controller.player;
             freeSlot = app.board.predictMove( app.board, 0 , true);
             $i = $('[col="' + freeSlot.col + '"][row="' + freeSlot.row + '"]');
             app.board.playerMove( 'X' ,freeSlot.row,freeSlot.col);
             app.view.renderCell( $i, 'X' );
             app.controller.player = ~app.controller.player;
             app.view.showPlayer('O');
        }

      }


}

/****************** lets start the app ******/
app.controller.init();

});
