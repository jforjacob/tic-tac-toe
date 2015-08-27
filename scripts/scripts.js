$(function(){

var gamegrid = [ null, null, null, null, null, null, null, null, null ];

var winningLines = [ [0,1,2], [0,4,8],
										 [0,3,6], [1,4,7],
										 [2,4,6], [2,5,8],
										 [3,4,5], [6,7,8] ];

var players = [ { 'mark': 'O',
									'name': 'O',
									'score': 0 },
								{ 'mark': 'X',
									'name': 'X',
									'score': 0 } ];

var currentPlayer = 0;
var roundNum = 0;
var turns = 0;
var roundOver = false;

// $.Velocity
//     .RegisterEffect("transition.flipXIn", {
//         defaultDuration: 700,
//         calls: [
//             [ { opacity: 1, rotateY: [ 0, -55 ] } ]
//         ]
//     });

$('.turn').text("It is "+players[ currentPlayer ].name+"'s turn.");


// Make the game board:

createBoard();

function createBoard() {
	gamegrid = [ null, null, null, null, null, null, null, null, null ];
	$('#gameboard').empty();
	switchPlayers();
	var sq = 0;
	roundNum++;
	$('.message').text("Round "+roundNum+" || Player "+players[0].name+": "+players[0].score+" || Player "+players[1].name+": "+players[1].score);

	for( var i=0; i<3; i++ ) {
		var row = $('<div>').addClass('row clearfix');
		row.appendTo( $('#gameboard') );

		for( var j=0; j<3; j++ ) {
			var square = $('<div>')
			square.addClass('square');
			var idName = 'sq'+sq;
			square.attr('id', idName );
			sq++;
			square.appendTo( row );
			// square.on('load', function() {
			// 	square.velocity("transition.flipXin");
			// });
		}
	}
	$('.square').on('click', takeTurn );
}

function takeTurn(e) {
	if( $(e.target).hasClass('X') || $(e.target).hasClass('O') ) {
		$('.message').text("That space is already taken!");
		$("div").velocity("callout.shake");
		setTimeout( function() {
				$('.message').text("Round "+roundNum+" || Player "+players[0].name+": "+players[0].score+" || Player "+players[1].name+": "+players[1].score);
		}, 2000 );
		
	} else {
		changeArray(e);
		roundOver = checkForEnd();
		console.log(roundOver);
		if(roundOver) { 
			changeTheBoard(e);
			setTimeout( function(){
				roundOver = false;
				createBoard();
			}, 2000);
		} else {
			changeTheBoard(e);
			switchPlayers();
		}
	}
}

function changeArray(e) {
	var position = $(e.target).attr('id').charAt(2);
	gamegrid.splice( position, 1, currentPlayer );
}

function checkForEnd(){
	var end = false;
	for( var i=0; i<winningLines.length; i++ ) {
		var line = winningLines[i];
		// if all criteria match one of the winning circumstances in array winningLines
		if( gamegrid[ line[0] ] === gamegrid[ line[1] ] && gamegrid[ line[1] ] === gamegrid[ line[2] ] &&
			( gamegrid[ line[0] ] === 1 || gamegrid[ line[0] ] === 0 ) ) {
			$('.message').text( players[ gamegrid[ line[0] ] ].name + " wins!");
			players[ gamegrid[ line[0] ] ].score++;
			end = true;
			break;
		}
	}
	if( !end && gamegrid.indexOf( null ) === -1 ) {
		$('.message').text( "Draw!" );
		end = true;
	}
	return end;
}

function changeTheBoard(e) {
	var playerMark = players[ currentPlayer ].mark;
	$(e.target).addClass( playerMark );
	$(e.target).text( playerMark );
}

function switchPlayers() {
	if( currentPlayer === 0 ) {
		currentPlayer = 1;
	} else {
		currentPlayer = 0;
	}
	$('.turn').text("It is "+players[ currentPlayer ].name+"'s turn.");
}

});