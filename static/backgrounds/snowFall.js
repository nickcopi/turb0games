let snowFall = {};
(()=>{
	let snow = [];
	let canvas;
	let ctx;
	let interval;
	const size = 2;
	class Snow{
		constructor(){
			this.x = Math.floor((Math.random() * canvas.width));
			this.y = -size;
			this.size = size;
		}
		move(){
			this.x += (Math.floor((Math.random() * 6) + .5)-3);
			this.y += (Math.floor((Math.random() * 2) + 1));
		}
	}
	const initSnow = ()=>{
		for(let i = 0; i < canvas.height;i++){
			update()
		}
	}

	let update = ()=>{
		for(let i = 0;i < 3;i++){
			snow.push(new Snow());
		}
		snow = snow.filter(snow=>{
			snow.move();
			if(snow.y > canvas.height)
				return false;
			return true;
		});
	}
	let render = ()=>{
		ctx.globalAlpha = 1;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle='white';
		snow.forEach(snow=>{
			ctx.fillRect(snow.x,snow.y,snow.size,snow.size);
		});
	}
	snowFall.start = (c)=>{
		canvas = c;
		ctx = canvas.getContext('2d');
		initSnow();
		interval = setInterval(()=>{
			update();
			render();
		},1000/60);
	}
	snowFall.stop = ()=>{
		ctx.clearRect(0,0,canvas.width,canvas.height);
		clearInterval(interval);
		snow = [];
	}
})();
