let canvas;
(()=>{
	const init = ()=>{
		canvas = document.createElement('canvas');
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		canvas.style.zIndex = '-100';
		canvas.style.top = '0' + 'px';
		canvas.style.left = '0' + 'px';
		canvas.style.position = 'fixed';
		document.body.appendChild(canvas);
		window.addEventListener('resize',()=>{
			canvas.width = innerWidth;
			canvas.height = innerHeight;
		});


	}

	window.addEventListener('load',init);
})()
