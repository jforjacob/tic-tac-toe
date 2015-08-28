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
var gametype;


$('.select-multi').on('click', function(){
	gametype = 'multiplayer';
	$('.prompt-players').remove();
	$('.start').removeClass('start');
	createBoard();
});

$('.select-computer').on('click', function(){
	gametype = 'computer';
	$('.prompt-players').remove();
	$('.start').removeClass('start');
	createBoard();
});

// Make the game board:

function createBoard(e) {
	gamegrid = [ null, null, null, null, null, null, null, null, null ];
	$('#gameboard').empty();
	if(roundNum > 0) {
		switchPlayers();
	} else {
		$('.whose-turn').text("Player X goes first. ");
		$('.change-name').on('click', changeName );
	} 
	roundNum++;
	if (gametype === 'multiplayer') {
		$('.multiplayer').removeClass('hidden'); // for multiplayer game
	} else {
		$('.computer').removeClass('hidden');
		$('.output-o').html("Computer (O) &mdash; <span class='score'>"+players[0].score+"</span>")
	}
	$('.message').text('');
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
	$('.square').on('click', takeTurn );
}

function takeTurn(e) {
	if( $(e.target).hasClass('X') || $(e.target).hasClass('O') ) {
		$('.message').text("That space is already taken!");
		$("#gameboard").velocity("callout.shake");
		setTimeout( function() {
				$('.message').text("");
		}, 2000 );
		
	} else {
		changeArray(e);
		roundOver = checkForEnd();
		console.log(roundOver);
		if(roundOver) {
			$('.square').off('click', takeTurn );
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
	$('.whose-turn').text(players[ currentPlayer ].name+"'s turn. ");
}

function changeName() {
	$('.square').off('click', takeTurn );
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
			$('.square').on('click', takeTurn );
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

}

});