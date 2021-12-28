
(()=>{
	let animations = {};
	let currentAnimation;
	let animationsEnabled = true;
	const init = ()=>{
		//I genuinely think it's been like 3+ years since I've used jQuery but I guess if it's part of the ecosystem, when in Rome.
		$('.category-btn').each(function(){
			const animation = this.getAttribute('animation');
			if(!animation) return;
			animations[this.innerText] = (new Function(`return ${animation};`))();
		});
		$('.category-btn').click(categoryClick);
		if(!location.hash) 
			currentAnimation = stars;
		else {
			const category = location.hash.substring(1,location.hash.length);
			if(category in animations) {
				currentAnimation = animations[category];
				$('.category-btn').removeClass('btn-primary');
				$('.category-btn').addClass('btn-secondary');
				const selected = $(`.category-btn:contains(${category})`)
				selected.addClass('btn-primary');
				selected.removeClass('btn-secondary');
				filterProjects(category);
			}
			else currentAnimation = stars;
		}
		currentAnimation.start(canvas);
		$('#animationsToggle').click(toggleAnimations);
	}
	const toggleAnimations = ()=>{
		animationsEnabled = !animationsEnabled;
		if(!animationsEnabled){
			if(currentAnimation)
				currentAnimation.stop();
		} else {
			if(currentAnimation)
				currentAnimation.start(canvas);
		}
	}
	const categoryClick = function(e){
		$('.category-btn').removeClass('btn-primary');
		$('.category-btn').addClass('btn-secondary');
		$(this).addClass('btn-primary');
		$(this).removeClass('btn-secondary');
		filterProjects(this.innerText);
		let newAnimation;
		if(this.innerText in animations) newAnimation = animations[this.innerText];
		if(currentAnimation && animationsEnabled)
			currentAnimation.stop();
		currentAnimation = newAnimation;
		if(!animationsEnabled) return;
		if(currentAnimation)
			currentAnimation.start(canvas);

	}
	const filterProjects = category=>{
		[...document.querySelectorAll('.project-card')].forEach(card=>{
			if(card.title.split(',').includes(category) || category === 'All')
				$(card).show();
			else $(card).hide();
		});
	}



	window.addEventListener('load',()=>{
		//createCanvas
		init();
	});
})()
