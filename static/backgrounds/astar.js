
let astar = {};
(()=>{
	let canvas;
	let ctx;
	let interval;
	function AstarUnit(x,y){
		this.x = x;
		this.y = y;
		this.h = 0; // h is distance from goal
		this.f = 0; // f is h+g
		this.wall = false;
		if(Math.random() < 0.4) this.wall = true;
		this.neighbors = [];
		this.findNeighbors = (grid)=>{
			let x = this.x;
			let y = this.y;
			if(x > 0) this.neighbors.push(grid[x-1][y]);
			if(y > 0) this.neighbors.push(grid[x][y-1]);
			if(x < col-1) this.neighbors.push(grid[x+1][y]);
			if(y < row-1) this.neighbors.push(grid[x][y+1]);
			if(x < col-1 && y > 0) this.neighbors.push(grid[x+1][y-1]);
			if(x < col-1 && y < row-1) this.neighbors.push(grid[x+1][y+1]);
			if(x > 0 && y > 0) this.neighbors.push(grid[x-1][y-1]);
			if(x > 0 && y < row-1) this.neighbors.push(grid[x-1][y+1]);
		}
	}
	let done = false;
	let col = 50;
	let row = 50;
	let size = 30;
	let grid = new Array(col);
	let start;
	let end;
	let openSet;
	let closedSet = [];
	let nodePath;
	let tick = 0;
	let doneTick;
	const initGrid = ()=>{
		grid = new Array(col);
		for(let i = 0; i < grid.length;i++){
			grid[i] = new Array();
		}
		for(let i = 0; i < grid.length;i++){
			for(let j = 0; j < row;j++){
				grid[i].push(new AstarUnit(i,j));
			}
		}
		for(let i = 0; i < grid.length;i++){
			for(let j = 0; j < row;j++){
				grid[i][j].findNeighbors(grid);
			}
		}
		start = grid[0][0];
		start.wall = false;
		end = grid[col-1][row-1];
		end.wall = false;
		openSet = [start];
		closedSet = [];
		nodePath = null;

	}
	const findGoodGrid = ()=>{
		do{
			initGrid();
		} while(!isSolvable());
		openSet = [start];
		closedSet = [];
	}
	const isSolvable = ()=>{
		let path;
		while(openSet.length && !path){
			path = doAstar();
		}
		return !!path;
	}

	let render = ()=>{
		//console.log('clearing',done < 2,done)
		ctx.fillStyle = '#222222';
		ctx.fillRect(0,0,canvas.width,canvas.height)
		ctx.fillRect(0,0,1,1);


		ctx.fillStyle = '#3A3A3A';
		closedSet.forEach(cl=>{
			ctx.fillRect(cl.x*size,cl.y*size,size,size);
		})
		ctx.fillStyle = '#375a7f';
		if(nodePath){
			done = true;			
			doneTick = tick;
			//console.log(done)
			while(nodePath.parent){
				ctx.fillRect(nodePath.parent.x*size,nodePath.parent.y*size,size,size);
				nodePath.parent = nodePath.parent.parent;
			}
			ctx.fillRect(end.x * size, end.y * size, size, size);
		}
		//ctx.fillStyle = '#1D1D1D';
		ctx.fillStyle = '#111111';
		for(let i = 0; i < grid.length;i++){
			for(let j = 0; j < row;j++){
				if(grid[i][j].wall) ctx.fillRect(grid[i][j].x*size,grid[i][j].y*size,size,size);
			}
		}
	};
	let update = ()=>{
		nodePath = doAstar();
		tick++;
		if(done && tick > doneTick+36){
			astar.stop();
			astar.start(canvas);
		}
		//console.log(nodePath);
	}
	let doAstar = ()=>{
		if(openSet.length !== 0){
			let winner = 0;
			openSet.forEach((open,i)=>{
				if(open.f < openSet[winner].f){
					winner = i;
				}
			});
			let current = openSet[winner];
			if(current === end) 
				return current;
			openSet = openSet.filter(i=>i!=current);
			closedSet.push(current);
			for(let i = 0; i < current.neighbors.length;i++){
				let neighbor = current.neighbors[i];
				if(closedSet.includes(neighbor) || neighbor.wall)
					continue;
				tempG = current.g === undefined?0:current.g + 1;
				if(!openSet.includes(neighbor)){
					openSet.push(neighbor);
				} else {
					if(tempG >= neighbor.g)
						continue;
				}
				neighbor.parent = current;
				neighbor.g = tempG;
				neighbor.f = tempG + dist(neighbor.x,neighbor.y,end.x,end.y);
				//console.log(tempG)
			}
		}
		//	console.log('No path!')


	}
	astar.start = (c)=>{
		canvas = c;
		ctx = canvas.getContext('2d');
		ctx.globalAlpha = 1;
		done = false;
		col = Math.floor(canvas.width/size) -1;
		row = Math.floor(canvas.height/size);
		findGoodGrid();
		interval = setInterval(()=>{
			update();
			if(!done)render();
		},1000/12);
	}
	astar.stop = ()=>{
		grid = [];
		ctx.clearRect(0,0,canvas.width,canvas.height);
		clearInterval(interval);
	}

	let collide = (o1,o2)=>{
		if(o1.x+o1.width>o2.x && o1.x < o2.x+o2.width && o1.y+o1.height>o2.y && o1.y < o2.y+o2.height) return true;
		return false;
	}
	let dist = (x1,y1,x2,y2)=>{
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	}
})();
