/**
  * Author: John Politis
  * Date :   29/05/2017
  * Description : Create the board and provide the necessary behaviour
  */
function Board(){

    var _winnerCB;                 //usr Callback handler
    var _InvalidMoveCB;            //usr Callback handler win an invalid move has been detected
    var _cbGameOver;
    var _limitReachedCount = 0;    //keep a count of the number of plays,

    var _matrix =[ ['F','F','F'],
                   ['F','F','F'],
                   ['F','F','F']
                 ];

    /**
      * Author: John Politis
      * Date :   01/06/2017
      * Description : Cycles through the matrix and builds an array of free slot objects
      */
    this.getFreeSlots = function() {
        var freeSlots = [];

        for (var i = 0; i < _matrix.length; i++) {
            for (var j = 0; j < _matrix[i].length; j++) {
                if (_matrix[i][j] === 'F' )  freeSlots.push({"row": i , "col" : j });
            }
        }
        return freeSlots;
    }
    /**
      * Author: John Politis
      * Date :   01/06/2017
      * Description : return the first available slot
      */
    this.getNextFreeSlot = function() {
        return this.getFreeSlots()[0];
    }

    /**
      * Author: John Politis
      * Date :   01/06/2017
      * Description : returns true if there is available slots on the board
      */
    this.isBoardFilled = function() {
        return _limitReachedCount === 8 ?  true : false;
    }
     /**
       * Author: John Politis
       * Date :   29/05/2017
       * Description : check if the Cell is available
       */
     function isCellAvailable(row,col) {
         return _matrix[row][col].toUpperCase() === 'F' ? true : false ;
     }
     /**
       * Author: John Politis
       * Date :   29/05/2017
       * Description : Check if there is a diagonal winning move
       */
    function checkWiningDiagonalMove(p) {
        //0,4,8  2,4,6
        var d1 = _matrix[0][0] + _matrix[1][1] + _matrix[2][2];
        var d2 = _matrix[0][2] + _matrix[1][1] + _matrix[2][0];

        if (d1 === p.repeat(3) || d2 === p.repeat(3)) return true

        return false;
    }
    /**
      * Author: John Politis
      * Date :   29/05/2017
      * Description : Check if there is a win on any columns
      */
    function checkWiningColumnMove(p) {
        //0,3,6   1,4,7   2,5,8
        var c1 = _matrix[0][0] + _matrix[1][0] + _matrix[2][0];
        var c2 = _matrix[0][1] + _matrix[1][1] + _matrix[2][1];
        var c3 = _matrix[0][2] + _matrix[1][2] + _matrix[2][2];

        if (c1 === p.repeat(3) || c2 === p.repeat(3) || c3 === p.repeat(3) ) return true;

        return false;
    }
    /**
      * Author: John Politis
      * Date :   29/05/2017
      * Description :
      */
    function checkWiningRowMove(p) {
        //0,1,2  3,4,5  6,7,8
        var r1 = _matrix[0][0] + _matrix[0][1] + _matrix[0][2];
        var r2 = _matrix[1][0] + _matrix[1][1] + _matrix[1][2];
        var r3 = _matrix[2][0] + _matrix[2][1] + _matrix[2][2];

        if (r1 === p.repeat(3) || r2 === p.repeat(3) || r3 === p.repeat(3) ) return true;

        return false;
    }

    /**
      * Author: John Politis
      * Date :   29/05/2017
      * Description : Check for all posible winning moves
      */
    function checkForWinningMove(p) {

        return checkWiningDiagonalMove(p)  ? true
               : checkWiningColumnMove(p)  ? true
               : checkWiningRowMove(p)     ? true
               : false;
    }
    /**
      * Author: John Politis
      * Date :   29/05/2017
      * Description : Mark all Cells as Free
      */
    this.reset = function() {
        _matrix[0][0] = 'F';
        _matrix[0][1] = 'F';
        _matrix[0][2] = 'F';
        _matrix[1][0] = 'F';
        _matrix[1][1] = 'F';
        _matrix[1][2] = 'F';
        _matrix[2][0] = 'F';
        _matrix[2][1] = 'F';
        _matrix[2][2] = 'F';
        _limitReachedCount = 0;
    }
    /**
      * Author: John Politis
      * Date :   29/05/2017
      * Description : dumps th board for debugging
      */
    this.dump = function (){
        console.log(_matrix);
    }
    /**
      * Author: John Politis
      * Date :   29/05/2017
      * Description : Player makes a move
      */
    this.playerMove = function(player,row,col,cb) {

        /* check if we have hit our max plays as by now the */
        /* entire grid will be filled up. therefore there is no more room on the board */
        if (_limitReachedCount >= 9 ) {
            this.dump();    //TODO
            if ( _cbGameOver !== undefined) _cbGameOver();
            return;
        }

        if( isCellAvailable(row,col) ) {
            if ( _InvalidMoveCB !== undefined)  _InvalidMoveCB(player);
        }

        _matrix[row][col] = player;
        _limitReachedCount++;

        if (checkForWinningMove(player)) {
            this.dump();        //TODO
            if (_winnerCB !== undefined)   _winnerCB(player);
        }
    }
    /**
      * Author: John Politis
      * Date :   29/05/2017
      * Description : Provide a way to register the Winner and InvalidMove callbacks
      */
    this.on = function(ev,cb) {
        if (ev.toUpperCase() === "WINNER" ) {
            if (cb !== undefined) {
                _winnerCB = cb;
            }
        }
        else if (ev.toUpperCase() === "INVALIDMOVE" ){
            if (cb !== undefined) {
                _InvalidMoveCB = cb;
            }
        }
        else if ( ev.toUpperCase() === "GAMEOVER") {
            _cbGameOver = cb;
        }
    }

}
