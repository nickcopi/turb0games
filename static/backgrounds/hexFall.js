let hexFall = {};
(()=>{

	let hexs = [];
	class Hex{
		constructor(char,x,y){
			this.x = x;
			this.y = y;
			this.char = char;
			this.speed = Math.floor(Math.random()*3) + 1;
		}
	}
	let newHex = (hexs)=>{
		hexs.push(new Hex(randomHexString(1),Math.floor(Math.random()*innerWidth),0));
	}
	let size;
	let canavs;
	let ctx;
	let image = new Image();
	let interval;
	const onResize = ()=>{
		hexs = [];
		fillHex(hexs);
		makeBg();
	}
	hexFall.start = (c)=>{
		canvas = c;
		ctx = canvas.getContext('2d');
		hexs = [];
		size = canvas.width/100 + canvas.height/100;
		makeBg();
		hexs = fillHex(hexs);
		window.addEventListener('resize',onResize);
		interval = setInterval(()=>{
			ctx.font = `${size}px Courier New `;
			ctx.globalAlpha = 0.1;
			//ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
			ctx.fillStyle = 'black';
			//ctx.fillRect(0,0,canvas.width,canvas.height);
			ctx.drawImage(image,0,0);
			ctx.fillStyle = '#CE4646';
			ctx.globalAlpha = 1;
			hexs = hexs.filter(hex=>{
				ctx.fillText(hex.char,hex.x,hex.y);
				//hex.y += SPEED;
				hex.y += hex.speed;
				if(hex.y > canvas.height)
					return false;
				return true;
			});
			newHex(hexs);
			//newHex(hexs);
			//newHex(hexs);
			//newHex(hexs);
		},1000/60);

	}
	hexFall.stop = ()=>{
		clearInterval(interval);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		window.removeEventListener('resize',onResize);
	}
	let makeBg = ()=>{
		let canvas = document.createElement('canvas');
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		let ctx = canvas.getContext('2d');
		//ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = '#CE4646';
		ctx.font = `${size}px Courier New `;
		let opacity = 1;
		let oInterval = 1/(canvas.height/size);
		let y = canvas.height;
		while(opacity > 0){
			ctx.globalAlpha = opacity;
			let str = randomHexString(size*40);
			ctx.fillText(str,0,y);
			y -= size;
			opacity -= oInterval;
		}
		//document.body.style.backgroundAttachment = 'fixed';
		//document.body.style.backgroundImage = `url('${canvas.toDataURL()}')`;
		image.src = canvas.toDataURL();
		canvas.remove();
	}
	let fillHex = (hexs)=>{
		let hexFull = false;
		while(!hexFull){
			newHex(hexs);
			//newHex(hexs);
			hexs = hexs.filter(hex=>{
				hex.y += hex.speed;
				if(hex.y > innerHeight){
					if(hex.speed === 2) hexFull = true;
					return false;
				}
				return true;
			});
		}
		return hexs;
	}
	let randomHexString = (size)=>{
		let str = '';
		let chars = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
		for(let i = 0; i < size; i++){
			str += chars[Math.floor(Math.random()*chars.length)];
		}
		return str;
	}

})();
