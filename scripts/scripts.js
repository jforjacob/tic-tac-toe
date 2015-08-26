$(function(){

var gamegrid = [ null, null, null,
				 null, null, null,
				 null, null, null ];

var winningLines = [ [0,1,2], [0,4,8], [0,3,6], [1,4,7],
					 [2,4,6], [2,5,8], [3,4,5], [6,7,8] ];

var players = [ 'O', 'X' ];

var currentPlayer = 1;

$('.turn').text("It is "+players[ currentPlayer ]+"'s turn.");


// Make the game board:

createBoard();

function createBoard() {
	var n = 0;

	for( var i=0; i<3; i++ ) {
		var row = $('<div>').addClass('row clearfix');
		row.appendTo( $('#gameboard') );

		for( var j=0; j<3; j++ ) {
			var square = $('<div>').addClass('square');
			var idName = 'sq'+n;
			square.attr('id', idName );
			n++;
			square.appendTo( row );
		}
	}
}

$('.square').on('click', takeTurn );

function takeTurn(e) {
	changeTheGrid(e);
	checkForWin();
	switchPlayers();
}

function changeTheGrid( e ) {
	var position = $(e.currentTarget).attr('id').charAt(2);
	gamegrid.splice( position, 1, currentPlayer );
	$(e.currentTarget).text( players[ currentPlayer ] );
	console.log( gamegrid );
}

function checkForWin(){
	winningLines.forEach( function( line ) {
		// if all criteria match one of the winning circumstances
		if( gamegrid[ line[0] ] == gamegrid[ line[1] ] && gamegrid[ line[1] ] == gamegrid[ line[2] ] ) {
			if( gamegrid[ line[0] ] === 1 || gamegrid[ line[0] ] === 0 ) {
				console.log( players[ gamegrid[ line[0] ] ] + " wins!");
			}
		}
	});
}

function switchPlayers() {
	if( currentPlayer === 0 ) {
		currentPlayer = 1;
	} else {
		currentPlayer = 0;
	}
	$('.turn').text("It is "+players[ currentPlayer ]+"'s turn.");
}

});