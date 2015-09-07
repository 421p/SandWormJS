var
//const
GAME_SPEED = 450,
fps = 5,
COLS = 16,
ROWS = 16,
EMPTY = 0,
WORM = 1,
VICTIM = 2,
LEFT  = 0,
UP    = 1,
RIGHT = 2,
DOWN  = 3,
KEY_LEFT  = 87, //87
KEY_UP    = 65, //65
KEY_RIGHT = 83,//83
KEY_DOWN  = 68, //68

keystate, timerId, score, frames;

desertField = {
	width: null,
	height: null,
	_field: null,
	init: function(d, c, r) {
		this.width = c;
		this.height = r;
		this._field = [];
		for (var x=0; x < c; x++) {
			this._field.push([]);
			for (var y=0; y < r; y++) {
				this._field[x].push(d);
			}
		}
	},

	set: function(val, x, y) {
		this._field[x][y] = val;
	},

	get: function(x, y) {
		return this._field[x][y];
	}
};

SandWorm = {
	direction: null,
	last: null,

	_queue: null,
	init: function(d, x, y) {
		this.direction = d;
		this._queue = [];
		this.insert(x-1, y);
		this.insert(x-2, y);
		this.insert(x, y);
	},

	insert: function(x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},

	remove: function() {
		return this._queue.pop();
	}
};

function setVictim() {
	var empty = [];
	for (var x=0; x < desertField.width; x++) {
		for (var y=0; y < desertField.height; y++) {
			if (desertField.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
	var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
	desertField.set(VICTIM, randpos.x, randpos.y);
}

function main() {
	keystate = {};
	// keeps track of the keybourd input
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});

	init();
	loop();
}

function init() {
	score = 0;
	GAME_SPEED = 450;
	fps = 10;
	desertField.init(EMPTY, COLS, ROWS);
	var sp = {x:Math.floor(COLS/2), y:ROWS-1};
	SandWorm.init(LEFT, sp.x, sp.y);
	desertField.set(WORM, sp.x, sp.y);
	setVictim();
}

function loop() {
	(function step() {
		setTimeout(function() {
			requestAnimationFrame(step);  //THE NEW WAY
			update();
			draw();
		}, 1000 / fps);
	})();

	/*(function repeat(){  OLD WAY
		/* some code*/
		/*timerId = setTimeout(repeat, GAME_SPEED);
	})();*/
}

function update() {
	// changing direction of the SandWorm depending on which keys
	// that are pressed
	if (keystate[KEY_LEFT] && SandWorm.direction !== RIGHT) {
		SandWorm.direction = LEFT;
	}
	if (keystate[KEY_UP] && SandWorm.direction !== DOWN) {
		SandWorm.direction = UP;
	}
	if (keystate[KEY_RIGHT] && SandWorm.direction !== LEFT) {
		SandWorm.direction = RIGHT;
	}
	if (keystate[KEY_DOWN] && SandWorm.direction !== UP) {
		SandWorm.direction = DOWN;
	}
		// pop the last element from the SandWorm queue i.e. the
		// head
		var nx = SandWorm.last.x;
		var ny = SandWorm.last.y;
		// updates the position depending on the SandWorm direction
		switch (SandWorm.direction) {
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}
		// checks all gameover conditions

		/*if(nx < 0 || nx > desertField.width-1){nx = 5, ny = 5;}
		if(ny < 0 || ny > desertField.height-1){nx = 5, ny = 5;}

		if(nx < 0 || ny < 0){nx = 5, ny = 5;}
		if(nx > desertField.width-1 || ny > desertField.height-1){nx = 5, ny = 5;}*/

		nx<0?nx=desertField.width-1:ny<0?ny=desertField.height-1:nx>desertField.width-1?nx=0:ny>desertField.height-1?ny=0:{};


		if(desertField.get(nx,ny)===WORM){alert('Потрачено. Вы набрали ' + score + ' points.');return init();}

	// check wheter the new position are on the victim item

		if (desertField.get(nx, ny) === VICTIM) {
			// increment the score and sets a new victim position
			score ++;
			GAME_SPEED -= 10;
			fps+=0.5;
			setVictim();
		} else {
			var tail = SandWorm.remove();
			desertField.set(EMPTY, tail.x, tail.y);
		}
		// add a SandWorm id at the new position and append it to
		// the SandWorm queue*/
		desertField.set(WORM, nx, ny);
		SandWorm.insert(nx, ny);
		scoreDraw();
}

function draw() {
    if(document.querySelector('.field') != null) {
		document.body.removeChild(document.querySelector('.container'));
	}
    
    var container = document.body.appendChild(document.createElement('div'));
        container.className = 'container';
	var field = container.appendChild(document.createElement('div'));
	field.className = 'field';

	for (var x=0; x < desertField.width; x++) {
         var row = field.appendChild(document.createElement('div'));
            row.className = 'row';
		for (var y=0; y < desertField.height; y++) {
			// sets the fillstyle depending on the id of
			// each cell
			switch (desertField.get(x, y)) {
				case EMPTY:
					var cell = row.appendChild(document.createElement('div'));
                    cell.className = 'cell';
					break;
				case WORM:
					var cell = row.appendChild(document.createElement('div'));
                    cell.className = 'cell';
					cell.id = 'WORM';
					break;
				case VICTIM:
					var cell = row.appendChild(document.createElement('div'));
                    cell.className = 'cell';
					cell.id = 'VICTIM';
					break;
			}
		}
	}
    
}

function scoreDraw(){
	document.querySelector('#score').innerHTML = score;
}
//run the game
main();

       

    

    
    
