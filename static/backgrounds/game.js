let game = {};
(()=>{
	let canvas;
	let ctx;
	let interval;
	let arrows = [];
	let clouds = [];
	let hearts = [];
	const arrowImage = new Image();
	arrowImage.src = 'static/images/arrow.png';
	const cloudImage = new Image();
	cloudImage.src = 'static/images/clouds.png';
	const heartImage = new Image();
	heartImage.src = 'static/images/heart.png';
	const arrowSize = 20;
	const heartSize = 20;
	class Arrow{
		constructor(){
			this.x = canvas.width + arrowSize;
			this.y = Math.floor(Math.random() * (canvas.height -arrowSize));
			this.width = arrowSize;
			this.height = arrowSize;
			this.speed = -7;//Math.floor(Math.random() * 3) + 5;
		}
		move(){
			if(this.falling) this.y += 9; 
			this.x += this.speed;
		}
	}
	class Heart{
		constructor(){
			this.x = 0-heartSize;
			this.y = Math.floor(Math.random() * (canvas.height - heartSize));
			this.width = heartSize;
			this.height = heartSize;
			this.speed = Math.floor(Math.random() * 3) + 3;
		}
		move(){
			if(this.falling) this.y += 9; 
			this.x += this.speed;
		}
	}
	class Cloud{
		constructor(){
			this.x = canvas.width + 250;
			this.y = Math.floor(Math.random() * (canvas.height-100) );
			this.width = 250;
			this.height = 100;
		}
		move(){
			this.x -= 2;
		}
	}

	const init = ()=>{
		for(let i = 0; i < 1000; i++){
			update();
		}
	}
	collide = (o1,o2)=>{
		return (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y) && o1 !== o2;
	}
	const update = ()=>{
		if(Math.random() * 100 > 90) arrows.push(new Arrow());
		if(Math.random() * 100 > 90) hearts.push(new Heart());
		arrows = arrows.filter(arrow=>{
			arrow.move();
			if(arrow.x + arrow.width < 0) return false;
			if(arrow.y > canvas.height) return false;
			return true;
		});
		clouds = clouds.filter(cloud=>{
			cloud.move();
			if(cloud.x + cloud.width < 0) return false;
			return true;
		});
		hearts = hearts.filter(heart=>{
			heart.move();
			if(heart.x > canvas.width) return false;
			if(heart.y > canvas.height) return false;
			if(heart.falling) return true;
			arrows.forEach(arrow=>{
				if(arrow.falling) return;
				arrow.x += 5;
				arrow.y += 5;
				arrow.width -= 10;
				arrow.height -= 10;

				heart.x += 5;
				heart.y += 5;
				heart.width -= 10;
				heart.height -= 10;
				if(collide(heart,arrow)){
					heart.falling = true;
					arrow.falling = true;
					const newSpeed = arrow.speed + heart.speed;
					heart.speed = newSpeed;
					arrow.speed = newSpeed;
				}
				arrow.x -= 5;
				arrow.y -= 5;
				arrow.width += 10;
				arrow.height += 10;

				heart.x -= 5;
				heart.y -= 5;
				heart.width += 10;
				heart.height += 10;
			});
			return true;
		});
	}
	const render = ()=>{
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.globalAlpha = 1;
		arrows.forEach((arrow)=>{
			ctx.drawImage(arrowImage,arrow.x,arrow.y,arrow.width,arrow.height);
		})
		clouds.forEach((cloud)=>{
			ctx.drawImage(cloudImage,cloud.x,cloud.y,cloud.width,cloud.height);
		})
		hearts.forEach((heart)=>{
			ctx.drawImage(heartImage,heart.x,heart.y,heart.width,heart.height);
		})
	}
	game.start = (c)=>{
		arrows = [];
		clouds = [];
		hearts = [];
		canvas = c;
		ctx = canvas.getContext('2d');
		init();
		interval = setInterval(()=>{
			update();
			render();
		},1000/60);
	}
	game.stop = ()=>{
		arrows = [];
		clouds = [];
		hearts = [];
		clearInterval(interval);
		ctx.clearRect(0,0,canvas.width,canvas.height);
			
	}
})();
