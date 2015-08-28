$(function(){

var gamegrid = [ null, null, null, null, null, null, null, null, null ];

var winningLines = [ [0,1,2], [0,4,8],
										 [0,3,6], [1,4,7],
										 [2,4,6], [2,5,8],
										 [3,4,5], [6,7,8] ];

var players = [ { 'mark': 'O',
									'name': 'Player O',
									'score': 0 },
								{ 'mark': 'X',
									'name': 'Player X',
									'score': 0 } ];

var currentPlayer = 1;
var roundNum = 0;
var roundOver = false;
var gametype = '';
var message = $('<p>').addClass('message');


$('.select-multi').on('click', function(){
	gametype = 'multiplayer';
	$('.prompt-players').remove();
	$('.start').removeClass('hidden');
	$('.start').removeClass('start');
	$('.whose-turn').text("Player X goes first.");
	$('.change-name').on('click', changeName );
	createBoard();
});

$('.select-computer').on('click', function(){
	gametype = 'computer';
	$('.prompt-players').remove();
	$('.start').removeClass('hidden');
	$('.start').removeClass('start');
	$('.whose-turn').text("You first, Player X.");
	players[0].name = "Abacus";
	$('.change-name').on('click', changeName );
	createBoard();
});

// Make the game board:

function createBoard(e) {
	gamegrid = [ null, null, null, null, null, null, null, null, null ];
	$('#gameboard').empty();
	roundNum++;
	message.remove();
	var sq = 0;
	$('.output-round').text("Round "+roundNum);
	updateScorecard();

	for( var i=0; i<3; i++ ) {
		var row = $('<div>').addClass('row clearfix');
		row.appendTo( $('#gameboard') );

		for( var j=0; j<3; j++ ) {
			var square = $('<div>');
			square.addClass('square');
			var idName = 'sq'+sq;
			square.attr('id', idName );
			sq++;
			square.appendTo( row );
		}
	}

	if( gametype === "computer" && currentPlayer === 0 ) {
		computerTurn();
	} else {
		$('.change-name').html('[change&nbsp;name]');
		$('.square').on('click', humanTurn );
	}
}

function humanTurn(e) {
	// validation for taken spaces:
	if( $(e.target).hasClass('X') || $(e.target).hasClass('O') ) {
		message.text("That space is already taken!").appendTo( $('.small-corner') );
		$("#gameboard").velocity("callout.shake");
		setTimeout( function() {
				message.remove();
		}, 2000 );
		
	// normal turn taken by player:
	} else {
		changeArray(e);
		changeTheBoard(e);
		roundOver = checkForEnd();
		switchPlayers();
		if(roundOver) {
			$('.change-name').text('');
			$('.whose-turn').text('');
			$('.square').off('click', humanTurn );
			setTimeout( function(){
				roundOver = false;
				createBoard();
				$('.whose-turn').text(players[ currentPlayer ].name+"'s turn.")
			}, 2000);
		} else if( gametype === 'computer' ) {
			computerTurn();
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
			message.text( players[ gamegrid[ line[0] ] ].name + " wins!").appendTo($('.small-corner'));
			players[ gamegrid[ line[0] ] ].score++;
			end = true;
			break;
		}
	}
	if( !end && gamegrid.indexOf( null ) === -1 ) {
		message.text( "Draw!" ).appendTo($('.small-corner'));
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
	$('.whose-turn').text(players[ currentPlayer ].name+"'s turn. ");
}

function changeName() {
	$('.square').off('click', humanTurn );
	$('.change-name').off('click', changeName );
	$('.whose-turn').addClass('hidden');
	$('.change-name').text('[okay]');
	$('.input-name').val( players[ currentPlayer ].name ).removeClass('hidden').focus();
	$('.change-name').on('click', changedName );
	$('.input-name').on('keypress', changedName );

	function changedName(e){
		if(e.which === 13 || e.which === 1) {
			$('.change-name').off('click', changedName );
			$('.input-name').off('keypress', changedName );
			players[ currentPlayer ].name = $('.input-name').val();
			$('.input-name').addClass('hidden');
			$('.change-name').html('[change&nbsp;name]');
			$('.whose-turn').text(players[ currentPlayer ].name+"'s turn. ").removeClass('hidden');
			updateScorecard();
			$('.square').on('click', humanTurn );
			$('.change-name').on('click', changeName );
		}
	}
}

function updateScorecard(){
	$('.output-x').html(players[1].name);
	if( players[1].name !== "Player X" ) {
		$('.output-x').append(" (X)");
	}
	$('.output-x').append(" &mdash; <span class='score'>"+players[1].score+"</span>");
	$('.output-o').html(players[0].name);
	if( players[0].name !== "Player O" ) {
		$('.output-o').append(" (O)");
	}
	$('.output-o').append(" &mdash; <span class='score'>"+players[0].score+"</span>");
}

function computerTurn() {
	$('.square').off('click', humanTurn );
	$('.change-name').addClass('hidden');
	setTimeout ( function(){
		var chosenPosition = choosePosition();
		console.log( chosenPosition );
		var targetId = "#sq"+chosenPosition;
		console.log( targetId );
		var playerMark = players[ currentPlayer ].mark;
		$( targetId ).addClass( playerMark );
		$( targetId ).text( playerMark );
		gamegrid.splice( chosenPosition, 1, currentPlayer );
		$('.change-name').removeClass('hidden');
		roundOver = checkForEnd();
		switchPlayers();
		if(roundOver) {
			setTimeout( function(){
				roundOver = false;
				createBoard();
			}, 2000);
		} else {
			$('.square').on('click', humanTurn );
			$('.change-name').html('[change&nbsp;name]');
		}
	}, 1500);
}

function choosePosition() {
	var rankedMoves = [[9, 0]];
	var chosenPosition, moveScore;
	for( var i=0; i<winningLines.length; i++ ) {
		var line = winningLines[i];
		var seq = line.map( function(e) {
			return gamegrid[e];
		});
		console.log( seq );
		var countX =  countInArray( seq, 1);
		var countO =  countInArray( seq, 0);
		var countNull = countInArray( seq, null);
		if( countNull === 0 ) {
			moveScore = 0;
		} else if( countO === 2 ) {
			moveScore = 7;
		} else if( countX === 2 ) {
			moveScore = 4;
			// if( ) to find perpendicular lines and moveScore += 2 or 1 if found
		} else if( countO === 1 ) {
			moveScore = 2;
			// if( ) to find perpendicular lines and moveScore += 1 if found
		} else if( countX === 1 ) {
			moveScore = 1;
		} else {
			moveScore = 0;
		}
		rankedMoves = placeInOrderedArray( [ line[ seq.indexOf(null) ], moveScore ], rankedMoves );
	}
	console.log( rankedMoves );
	chosenPosition = rankedMoves[0][0];
	return chosenPosition;
}

function countInArray( arr, e ) {
	var count = 0;
	for( var j=0; j<arr.length; j++ ) {
		if( arr[j] === e ) {
			count++;
		}
	}
	return count;
}

function placeInOrderedArray( e, arr ) {
	for( var k=0; k<arr.length; k++ ) {
		if( e[1] >= arr[k][1] ) {
			arr.splice( k, 0, e );
			return arr;
		}
	}
}






});