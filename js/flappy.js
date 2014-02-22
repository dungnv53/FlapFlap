var mainLoop = false;
var animeLoop = false;

var tickCount = 0;
var animeCount = 0;
var start = false;

var birdPos = 90;
var birdAcceleration = -6;

var bgscrollSpeed = 1;
var bgstep = 2;
var bgcurrent = 0;
var bgimageWidth = 14;
var bgheaderWidth = 125;	
var bgrestartPosition = -(bgimageWidth - bgheaderWidth);


var numberOfTunnels = 0;

var tunnelPos = 0;

var score = 100;

var gameOver = false;


$(function(){
	
	animeLoop = setInterval(mainAnimations,33);
	
	
	$(window).click(function(){
		clicksAndPresses();
	});

	$(window).keypress(function(e) {
		clicksAndPresses();
	});
	
});



function clicksAndPresses()
{
	if(gameOver == true)
	{
		
		gameOver = false;
	
		$('#high-score').hide();
		$('#start-page').show();
		$('#tunnels').html('').css('left',0);
		$('#bird').attr('style', '');
		$('#score').html('<div class="num n-0"></div>');
		
		
		numberOfTunnels = 0;
		mainLoop = false;
		animeLoop = false;
		tickCount = 0;
		animeCount = 0;
		start = false;
		birdPos = 90;
		birdAcceleration = -6;
		bgscrollSpeed = 1;
		bgstep = 2;
		bgcurrent = 0;
		bgimageWidth = 14;
		bgheaderWidth = 125;	
		bgrestartPosition = -(bgimageWidth - bgheaderWidth);
		tunnelPos = 0;
		score = 0;
		
		createTunnel();
		animeLoop = setInterval(mainAnimations,33);
		
		return false;
	}

	if(mainLoop == false)
	{
		_gaq.push(['_trackEvent', 'Game Start', 'Start']);
		$('#start-page').hide();
		$("#bird").stop(true);
		
		
		mainLoop = setInterval(main,33);
	}
	else
	{
		birdAcceleration = -6;
	}
}

function main()
{
	tickCount = tickCount + 1;
	
	/* MAIN GAME LOOP */
	createTunnel();
	birdPhysics();
	scrollTunnels();
	checkCollisions();
	
	if(tickCount == 15 || tickCount == 1)
		getScore();
	
	
	/* END MAIN GAME LOOP*/
	
	start = true;
	if(tickCount > 30)
		tickCount = 0;
}

function mainAnimations()
{
	animeCount = animeCount + 1;
	
	flapWings(animeCount);
	scrollBg();
	
	if(start == false)
		bounceBird(animeCount);
	

	
	if(animeCount > 30)
		animeCount = 0;
}


function bounceBird(count)
{

	var bird = $('#bird');
	
	if(count == 1)
		$("#bird").animate({top:"95px"}, 500).animate({top:"90px"}, 500);

}

function getScore()
{


	var tunPos = $('#tunnels').position().left;
	
	score = Math.round((((-tunPos-365) / 70)));
	
	if(score < 0)
		score = 0;
		
	
	var scoreObj = $('#score');	
		
	if(score != scoreObj.attr('score'))
	{
		
		var scoreHTML = '';
		
		var sNumber = score.toString();

		for (var i = 0, len = sNumber.length; i < len; i += 1) {
			scoreHTML = scoreHTML +  '<div class="num n-'+sNumber.charAt(i)+'"></div>';
			scoreObj.html(scoreHTML);
		}
	
	
	
	
	}
}

function checkCollisions()
{	
	var bird = $('#bird');
	var obstacles = $('.tunnel-holder').filter(function() {
	
		var thisLeft = $(this).position().left;
		
		if((thisLeft + tunnelPos) > 0 && (thisLeft + tunnelPos) < 125)
			return true;
		else
			return false;
			
	});

	var birdTop = bird.position().top;
	var birdBottom = birdTop + bird.height();
	var birdLeft = bird.position().left;
	var birdRight = birdLeft + bird.width();
	
	if(birdBottom >= 176)
	{
		gameLost();
		return false;
	}
	
	var birdRadTop = birdTop + 6;
	var birdRadLeft = birdLeft + 8;
	
	obstacles.each(function( index ) 
	{

		
		var objLeft = $(this).position().left + tunnelPos;
		var objRight = objLeft + 24;
		var objTop =  $(this).position().top;
		var objUpperInner = objTop + 174;
		var objLowerInner = objUpperInner + 40;


		if(
			(
				birdRadLeft + 3 > objLeft 
				&& 
				birdRadLeft + 3 < objRight
			) 
			&& 
			(
				birdRadTop - 4 < objUpperInner 
				|| 
				birdRadTop + 4   >  objLowerInner
			)
		)
		{
			gameLost();
			return false;
		}
	});
}

function gameLost()
{
	window.clearInterval(mainLoop);
	window.clearInterval(animeLoop);
	
	$('#high-score').show();
	
	// var hs = localStorage.getItem("highscore");
	// if(!hs)
	// 	hs = 0;
	
	// if(score > hs)
	// {
	// 	localStorage.setItem("highscore",score);
	// 	hs = score;
	// }
	
	
	var scoreObj = $('#cur-score');	
	var scoreHTML = '';
	var sNumber = score.toString();
	for (var i = 0, len = sNumber.length; i < len; i += 1) {
		scoreHTML = scoreHTML +  '<div class="num n-'+sNumber.charAt(i)+'"></div>';
		scoreObj.html(scoreHTML);
	}
	
	var scoreObj = $('#max-score');	
	var scoreHTML = '';
	var sNumber = 1991; //hs.toString();
	for (var i = 0, len = sNumber.length; i < len; i += 1) {
		scoreHTML = scoreHTML +  '<div class="num n-'+sNumber.charAt(i)+'"></div>';
		scoreObj.html(scoreHTML);
	}
	
	
	gameOver = true;
	
}

function createTunnel()
{
	tunnels = $('#tunnels');
	tunnelsLeft = -tunnels.position().left;

	
	if( numberOfTunnels < score + 2)
	{
	
		$('#tunnels .tunnel-holder').filter(function() {
		  return $(this).attr("data") < score-1;
		}).remove();
		
		for (var i=0;i< 2;i++)
		{
			var tunnelHolder = $('<div class="tunnel-holder"></div>');
			var tunnelUp = $('<div class="up"></div>');
			var tunnelDown = $('<div class="down"></div>');
			
			
			if(numberOfTunnels > 0)
				var lastChildLeft = $('#tunnels .tunnel-holder:last-child').position().left;
			else
				lastChildLeft = 350;

			
			var max = -55;
			var min = -160;
			
			var up = Math.floor(Math.random()*(max-min+1)+min);


			var space = 40;
			var left = 70 + lastChildLeft;
			
			
			tunnelDown.css('margin-top', space);

			
			tunnelHolder.css('left', left);
			tunnelHolder.css('top', up);
			
			tunnelHolder.attr('data',numberOfTunnels);
			
			tunnelHolder.append(tunnelUp);
			tunnelHolder.append(tunnelDown);
			tunnels.append(tunnelHolder);
			
			numberOfTunnels = numberOfTunnels + 1;
		}
	}
	
/*	for (var i=1;i< 100;i++)
	{
		var tunnelHolder = $('<div class="tunnel-holder"></div>');
		var tunnelUp = $('<div class="up"></div>');
		var tunnelDown = $('<div class="down"></div>');
		
		var max = -55;
		var min = -160;
		
		var up = Math.floor(Math.random()*(max-min+1)+min);

		var pstart = 350;
		
		var space = 40;
		var left = (i * 70) + pstart;
		
		
		tunnelDown.css('margin-top', space);

		
		tunnelHolder.css('left', left);
		tunnelHolder.css('top', up);
		
		tunnelHolder.append(tunnelUp);
		tunnelHolder.append(tunnelDown);
		tunnels.append(tunnelHolder);
	}*/
}

function scrollTunnels()
{
	tunnelPos = tunnelPos - 2;
	$('#tunnels').css('left', tunnelPos) ;
}

function flapWings(count)
{
	count = (count * 1.1);
	if(count < 4)
		$('#bird').attr('class','mid');
	else if(count < 8)
		$('#bird').attr('class','up');
	else if(count < 12)
		$('#bird').attr('class','mid');
	else if(count < 16)
		$('#bird').attr('class','down');	
	else if(count < 20)
		$('#bird').attr('class','mid');
	else if(count < 24)
		$('#bird').attr('class','up');
	else if(count < 28)
		$('#bird').attr('class','mid');
	else if(count < 32)
		$('#bird').attr('class','down');
}

function birdPhysics(){
	var bird = $('#bird');
	

	birdAcceleration = birdAcceleration + .8;
	
	if(birdAcceleration > 10)
		birdAcceleration = 10;
	
	if(birdPos < -17 && birdAcceleration < 0)
		birdAcceleration = 0;
	

	birdPos = birdPos + birdAcceleration;
		
	bird.css('top',birdPos);
	
	var elementToRotate = bird;
	var degreeOfRotation = birdAcceleration * 5;

	if(degreeOfRotation > 90)
		degreeOfRotation = 90;
	
	
	var deg = degreeOfRotation;
	var deg2radians = Math.PI * 2 / 360;
	var rad = deg * deg2radians ;
	var costheta = Math.cos(rad);
	var sintheta = Math.sin(rad);

	var m11 = costheta;
	var m12 = -sintheta;
	var m21 = sintheta;
	var m22 = costheta;
	var matrixValues = 'M11=' + m11 + ', M12='+ m12 +', M21='+ m21 +', M22='+ m22;

	elementToRotate.css('-webkit-transform','rotate('+deg+'deg)')
		.css('-moz-transform','rotate('+deg+'deg)')
		.css('-ms-transform','rotate('+deg+'deg)')
		.css('transform','rotate('+deg+'deg)')
		.css('filter', 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\','+matrixValues+')')
		.css('-ms-filter', 'progid:DXImageTransform.Microsoft.Matrix(SizingMethod=\'auto expand\','+matrixValues+')');
	
}

function scrollBg()
{
	bgcurrent -= bgstep;
	if (bgcurrent == bgrestartPosition){
		bgcurrent = 0;
	}

	$('#floor').css("background-position",bgcurrent+"px 0");
}

