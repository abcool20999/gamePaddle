document.addEventListener('DOMContentLoaded', async function () {//add event listener and then get each elementbyid
  const paddle = document.getElementById('paddle');
  const ball = document.getElementById('ball');
  const background = document.getElementById('game-container');
  const _lives = document.getElementById('lives');
  const _score = document.getElementById('score');

  let paddlePosition = 0; //sets the initial position of the paddle.
  const paddleLength = 100; //constant which defines the length of the paddle.
  var ballSpeedY = 1; // variable ballSpeedY which represents the speed at which the ball moves vertically.
  var ballSpeedX = 1; //Similar to ballSpeedY, this line declares a variable ballSpeedX and assigns it a value of 1. This variable represents the speed at which the ball moves horizontally.
  var started = false; //variable  whether the game has started or not.
  let lives = 3 //variable  number of lives or chances the player has in the game.
  let score = 0 //variable player's score in the game.

  const { //getting properties for the rectangle game container and setting it to variables t, l, b, r.....
    top: t,
    left: l,
    bottom: b,
    right: r
  } = background.getBoundingClientRect();//retrieves the bounding rectangle of the background element.
  console.log(t, l, b, r)

  var vw = window.innerWidth || document.documentElement.clientWidth; // setting a variable for the width of the container
  var vh = window.innerHeight || document.documentElement.clientHeight; // settinh a variable for the height of the container

  function movePaddle() {
    paddle.style.left = paddlePosition + 'px';//moves a paddle element horizontally on the screen by updating its left CSS property.
    //left property moves the element to the right if the value is positive and to the left if the value is negative.
  }

  function pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));//setimout function that pauses the ball for some seconds at the top.
  }

  function restart(){//resets the state of the ball movement
    ballSpeedX = 1; //Sets the horizontal speed of the ball to 1.
    ballSpeedY = 0;//Sets the vertical speed of the ball to 0.

    ball.style.top = 0 + 'px';//Resets the top position of the ball to 0 pixels.
    ball.style.left = (vw/2) + 'px';//Resets the left position of the ball to the middle of the screen horizontally.
  }

  setInterval(10000, ()=>{ //sets up an interval function that runs every 10000 milliseconds (10 seconds)
    ballSpeedY *= 2; //Doubles the vertical speed of the ball.
    ballSpeedX *= 2; //Doubles the horizontal speed of the ball.
  })

  async function moveBall() {// define async function moveball..
    // let ballSpeed = 1;

    let ballPositionX = parseInt(ball.style.left) || 0;//get ball position
    let ballPositionY = parseInt(ball.style.top) || 0;

    // Move ball downwards
    ballPositionX += ballSpeedX;//incrementing the ball position by ball speed
    ballPositionY += ballSpeedY;
    ball.style.top = ballPositionY + 'px';//set the ball position to the new position
    ball.style.left = ballPositionX + 'px';
    // let ballSpeed = 1;

    if(lives<=0){
      var gameover = document.getElementById('gameover');//checks if lives is less than or equal to zero. If this condition is true, it means the player has no remaining lives, and the game is over
      gameover.style.display = 'block'
      return "Game Over"
    }

    // Reverse direction when ball reaches bottom without touching paddle
    if (ballPositionY >= b) {
      // ballSpeed = -ballSpeed;
      // ballSpeedX +=1;
      ballSpeedY -=1;
      var child =_lives.children[_lives.children.length -1]//this if block handles the logic for how the lives are lost once the ball doesnt hit the paddle
      child && _lives.removeChild(child)
      lives--
      restart()
      var restartpause = await pause(3000)
      await moveBall()
    }

    // Reverse direction when ball reaches top
    if (ballPositionY <= 0 && started == true) {
      // ballSpeedX += 1;
      ballSpeedY += 1;//changing direction -1 to go up +1 to go down
      //going up Y axis -1
      //going down Y axis +1
      // going right X axis +1
      // going left Xaxis -1
    }

    // Reverse direction when ball reaches the left wall
    if (ballPositionX <= l && started == true) {
      ballSpeedX += 1;
      // ballSpeedY += 1;
    }

    // Reverse direction when ball reaches the right wall
    if (ballPositionX >= vw && started == true) {
      ballSpeedX -= 1;
      // ballSpeedY += 1;
    }

    // Check for collision with paddle                   b = height of page to the bottom of the paddle and 20 is height of the paddle
    if (ballPositionY >= (b-30) && ballPositionY <= b && //if the ball has gone beyond the level of the paddle
      paddlePosition <= ball.offsetLeft && //ball.offetleft is the horizontal direction
      paddlePosition + paddleLength >= ball.offsetLeft) {
      ballSpeedY = -ballSpeedY;//reverse ball
      score++
      _score.innerHTML = score
      
      if(paddlePosition + (paddleLength/2) >= ball.offsetLeft){// x movement of the ball
        ballSpeedX = -ballSpeedX;
      }
      else{
        ballSpeedX = +ballSpeedX;
      }
    }

    // ballSpeedX*=1.0005
    // ballSpeedY*=1.0005
    started = true;

    requestAnimationFrame(moveBall);//re-render the animation of the ball
  }

  await moveBall();// calling the async function

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      paddlePosition -= 30;
      if (paddlePosition < 0) {
        paddlePosition = 0;
      }
      movePaddle();
    } else if (event.key === 'ArrowRight') {
      paddlePosition += 30;
      if (paddlePosition > b) {
        paddlePosition = b;
      }
      movePaddle();
    }
  });
});
