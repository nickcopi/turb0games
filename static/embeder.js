(()=>{
	let embeded = false;
	const toggleEmbed = (e)=>{
		console.log('toggling');
		const iframe = $("#iframe")[0];
		if(!embeded){
			location.hash = 'embed';
			$("#iframe").show();
			iframe.src = iframe.title;
		} else {
			$("#iframe").hide();
			location.hash = '';
			iframe.src='';

		}
		embeded = !embeded;

	}
	window.addEventListener('load',()=>{
		if(location.hash === '#embed') toggleEmbed();
		$("#embed").click(toggleEmbed);
	});
})()
