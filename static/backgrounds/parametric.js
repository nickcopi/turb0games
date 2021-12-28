let parametric = {};
(()=>{
	let canvas;
	let ctx;
	let tracers = [];
	let interval;
	class Tracer{
		constructor(x,y,color){
			this.x = x;
			this.y = y;
			this.red = Math.floor(Math.random() * redMax);
			this.blue = Math.floor(Math.random() * blueMax);
			this.green = Math.floor(Math.random() * greenMax);
			this.t = 0;
		}
		getX(){
			return this.x + (innerWidth/2)*func1(this.t);
		}
		getY(){
			return this.y - (innerHeight/2)*func2(this.t);
		}
		move(){
			this.t+=0.002;
			this.red += (Math.random() > 0.5)?1:-1;
			this.blue += (Math.random() > 0.5)?1:-1;
			this.green += (Math.random() > 0.5)?1:-1;
		}
	}
	const redMax = 0;
	const greenMax = 0;
	const blueMax = 255;
	let func1 = t=>Math.sin(6*t)*Math.cos(t);
	let func2 = t=>Math.sin(6*t)*Math.sin(t);
	//let func1 = n=>{
	//	return Math.cos(n) *2 +Math.sin(2*n) * Math.cos(60*n);
	//}
	//let func2 = n=>{
	//	return Math.sin(2*n) + Math.sin(1*n)
	//}
	let inInit = false;

	const init = ()=>{
		inInit = true;
		for(let i = 0; i < 3000; i++){
			update();
		}
		inInit = false;
	}

	const update = ()=>{
		if(Math.random() > 0.59 && inInit)
			tracers.push(new Tracer(canvas.width/2,canvas.height/2));
		tracers.forEach(tracer=>{
			tracer.move();
		});
	}
	const render = ()=>{
		ctx.globalAlpha = 0.07;
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 1;
		tracers.forEach(t=>{
			ctx.fillStyle = `rgb(${t.red},${t.green},${t.blue})`;
			ctx.fillRect(t.getX(),t.getY(),2,2);
		});

	}


	parametric.start = (c)=>{
		canvas = c;
		tracers = [];
		init();
		ctx = canvas.getContext('2d');
		interval = setInterval(()=>{
			update();
			render();
		},1000/60);
	}
	parametric.stop = ()=>{
		tracers = [];
		clearInterval(interval);
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}

})();
