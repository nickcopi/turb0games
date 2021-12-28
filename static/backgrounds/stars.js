let stars = {};
(()=>{
	let canvas;
	let ctx;
	let interval;
	let blinkingStars = [];
	let shootingStars = [];
	const size = 30;
	const image = new Image();
	image.src = 'static/images/star.png';

	class BlinkingStar{
		constructor(){
			this.x = Math.floor(Math.random()*canvas.width);
			this.y = Math.floor(Math.random()*canvas.height);
			this.size = 2;
			this.speed = 0.1 * (Math.floor(Math.random()*3) +1);
			this.brightness = Math.random()*Math.PI*2;
		}
		getSize(){
			return this.size + 2*Math.sin(this.brightness);
		}
		flash(){
			this.brightness += 0.05;	
			
		}
	}
	class ShootingStar{
		constructor(){
			this.x = Math.floor(Math.random()*canvas.width);
			this.y = Math.floor(Math.random()*canvas.height);
			this.width = size;
			this.height = size;
			this.displayRotation = 0;
			this.angle = Math.random()*(Math.PI*2);
			this.speed = Math.floor(Math.random()*2) + 3;
			this.direction = {};
			this.setDirection(this.angle);
		}
		setDirection(theta){
			this.direction.x = Math.cos(theta);
			this.direction.y = Math.sin(theta);
			this.angle = theta;
		}
		move(){
			this.x += this.speed * this.direction.x;
			this.y += this.speed * this.direction.y;
			this.displayRotation += this.speed * (Math.PI/256);
		}

	}
	const update = ()=>{
		shootingStars.forEach(shootingStar=>{
			shootingStar.move();
			if(shootingStar.x > canvas.width) shootingStar.x = 0; 
			if(shootingStar.x + shootingStar.width < 0) shootingStar.x = canvas.width; 
			if(shootingStar.y > canvas.height) shootingStar.y = 0; 
			if(shootingStar.y + shootingStar.width < 0) shootingStar.y = canvas.height; 
		});
		blinkingStars.forEach(star=>{
			star.flash();
		});
	}
	const render = ()=>{
		ctx.globalAlpha = 0.25;
		ctx.fillStyle = 'black';
		//ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		shootingStars.forEach(star=>{
			ctx.save();
			ctx.translate(star.x + (star.width/2), star.y + (star.height/2));
			ctx.rotate(star.displayRotation);
			ctx.drawImage(image,star.width/-2,star.height/-2,star.width,star.height);
			ctx.restore();
		});
		ctx.fillStyle = 'white';
		blinkingStars.forEach(star=>{
			ctx.fillRect(star.x-star.getSize()/2,star.y-star.getSize()/2,star.getSize(),star.getSize());
		});
	}
	stars.start = (c)=>{
		canvas = c;
		ctx = canvas.getContext('2d');
		blinkingStars = [];
		shootingStars = [];
		for(let i = 0; i < 10; i++){
			shootingStars.push(new ShootingStar());
		}
		for(let i = 0; i < 250; i++){
			blinkingStars.push(new BlinkingStar());
		}
		interval = setInterval(()=>{
			update();
			render();
		},1000/60);
	}
	stars.stop = ()=>{
		blinkingStars = [];
		shootingStars = [];
		ctx.clearRect(0,0,canvas.width,canvas.height);
		clearInterval(interval);
	}

})();
