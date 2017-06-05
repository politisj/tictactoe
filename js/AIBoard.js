/**
  * Author: John Politis
  * Date :   01/06/2017
  * Description : Create an AI interface.This feature will be used to play
  *               human against machine.The AI interface will try to matach the
  *               best outcome for the system to win, thereby providing some challenges
  *               to the human player.We will implement the minmax algorith to predict our wins.
  *               The algorith is published in the wiki pages at https://en.wikipedia.org/wiki/Minimax
  */
  function AIBoard() {

      Board.call(this);
      var maxLevels = 7;
      var predictionsMade = [];

    /**
      * Author: John Politis
      * Date :   01/06/2017
      * Description : we will use the well know minmax algorithm to predict and get the
      *               best posible outcome for AI.
      */
    function  minimax(board, depth, maximizingPlayer) {

        var score = evalutate(board);
        var bestVal = score;

        if (depth === 0) { return score;  }

        if (board.isBoardFilled())  return score;

        // If Maximizer has won the game return his/her score
        if (score === 10)  return score;

        // If Minimizer has won the game return his/her score
        if (score === -10)   return score;

        if (maximizingPlayer) {
            bestVal = -1000;

            board.getFreeSlots().forEach(function(e){
                 board.poke(e.row, e.col,'X');
                 score = minimax( board, (depth-1), !maximizingPlayer);
                 bestVal = Math.max( bestVal, score);
                   if(depth == maxLevels ) {
                       predictionsMade.push({ score: bestVal , row : e.row, col: e.col } );
                   }
            });
        }
        else {
            bestVal = 1000;

            board.getFreeSlots().forEach(function(e){
                board.poke(e.row, e.col,'O');
                score = minimax( board, (depth-1 ), !maximizingPlayer);
                bestVal = Math.min( bestVal, score);
                if(depth == maxLevels ) {
                    predictionsMade.push({ score: bestVal , row : e.row, col: e.col } );
                }
            });
        }

        return bestVal;
    }
    /**
      * Author: John Politis
      * Date :   01/06/2017
      * Description : The start of our predictions
      */
    this.predictMove = function( board, depth , player) {

        var winningMove;
        predictionsMade = [];

        var score = minimax( board.copy() , depth , player);

        /* check if we have a win in our current board state */
        if (( winningMove = findBestMoveForWin(score , board.copy() )) !== undefined ) {
            return winningMove;
        }
        /* we now need to see if we can block */
        if (( winningMove = findBestMoveForWin( -10 , board.copy() )) !== undefined ) {
            return winningMove;
        }
        /* looks like its a draw so get the first available */
        winningMove = findBestMoveForWin( 0 , board.copy());


        return winningMove;

    }
    /**
      * Author: John Politis
      * Date :   04/06/2017
      * Description : We need to go through our predictions and select the one that is most
      *               usefull for the current game state for a Win.
      *               If we cannot find a win on our current state we opt for a Block against our opponent.
      *               Otherwise we default to a draw in which we return the first available play.
      */
    function findBestMoveForWin(score , board) {

        var opt = (score === 10 ) ? 'X' : score === -10 ? 'O' : 'D';
        var bestMove;
        var slots;

        /* Lets find a winning move if possible for the current game state */
        if ((bestMove = findBestMoveForWinX(board)) !== undefined) return bestMove;
        /* no winning X move was found therefore see if there exists a winning O move */
        /* and if it does then we need to block it                                    */
        if((bestMove = findBestMoveForWinO(board)) !== undefined) return bestMove;
        /* no valid states have been found therefore we should be able to grab any random */
        /* slot from the game board and play it                                           */
        slots = board.getFreeSlots();
        return slots[ Math.floor(Math.random() * slots.length)];
    }
    /**
      * Author: John Politis
      * Date :   04/06/2017
      * Description : locates a winning move for X player on the current game state.
      *               if no winning move is detected then we return undefined
      */
    function findBestMoveForWinX(board) {
        var bestMove;

        for (var i = 0; i < predictionsMade.length; i++) {
            board.poke(predictionsMade[i].row, predictionsMade[i].col, 'X');
            if (  (predictionsMade[i].score === 10) && board.checkForWinningMove('X') ) {
                board.poke(predictionsMade[i].row, predictionsMade[i].col, 'F');
                bestMove = predictionsMade[i];
                break;
            }
            board.poke(predictionsMade[i].row, predictionsMade[i].col, 'F');
        }

        return bestMove;
    }
    /**
      * Author: John Politis
      * Date :   04/06/2017
      * Description : locates a winning move for O player on the current game state.
      *               if no winning move is detected then we return undefined
      */
    function findBestMoveForWinO(board) {
        var bestMove;
        for (var i = 0; i < predictionsMade.length; i++) {
            board.poke(predictionsMade[i].row, predictionsMade[i].col, 'O');
            if (  (predictionsMade[i].score === -10) && board.checkForWinningMove('O') ) {
                board.poke(predictionsMade[i].row, predictionsMade[i].col, 'F');
                bestMove = predictionsMade[i];
                break;
            }
            board.poke(predictionsMade[i].row, predictionsMade[i].col, 'F');
        }

        return bestMove;
    }
    /**
      * Author: John Politis
      * Date :   03/06/2017
      * Description : we need to check the current state of the board as it stands and
      *               apply some heuristic.
      *               The following will apply,
      *
      *    we will return a positive integer value if the state of the board favours X
      *    return a negative integer value if the state of the board favours O
      *    otherwise we will return a 0 value to indicate a no favour either path is valid
      *
      *   So :
      *        X  => +10
      *        O  => -10
      *        draw = 0
      */
    function evalutate (board) {

        var winX = board.checkForWinningMove('X');
        var winO = board.checkForWinningMove('O');

        return  winX === true ? 10 : winO === true ? -10 : 0 ;
    }
}

AIBoard.prototype = new Board();
