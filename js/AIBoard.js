/**
  * Author: John Politis
  * Date :   01/06/2017
  * Description : Create an AI interface.This feature will be used to play
  *               human against machine.The AI interface will try to matach the
  *              best outcome for the system to win, thereby providing some challenges
  *              to the human player.
  */
  function AIBoard() {

      Board.call(this);

    /**
      * Author: John Politis
      * Date :   01/06/2017
      * Description : The start of our prediction algorithm
      */
    this.predictMove = function( board, depth , player) {

        if (depth === 0 && !this.isBoardFilled()) {
            //implement a random selection for level 0
            var slotsAvailable = this.getFreeSlots();
            var chosenSlot = Math.floor(Math.random() * 10);

            return  slotsAvailable[chosenSlot];
        }
    }
}

AIBoard.prototype = new Board();
