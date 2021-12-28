const {createCanvas} = require('canvas');
const md5 = require('md5');
const canvas = createCanvas(500,500);
const ctx = canvas.getContext('2d');
const foreground = 'white';
const background = '#222222';

const colors = [
	'#292961', //dark purple
	'#222222', //dark gray
	'#dd6800', //dark pumpkin
	'#004f0d', //forest green
	'#570000', //deep maroon
	'#00254e', //navy blue
	'#897e00', //dark yellow
	'#006f76', //dark teal
]

const getInitials = name=>{
	return name.split(' ').map(word=>word[0].toUpperCase()).join('');
}
const getColor = name=>{
	const hash = md5(name);
	const index = Number('0x' + hash.substring(0,7)) % colors.length;
	return colors[index];
}

const newThumbnail = name=>{
	ctx.fillStyle = getColor(name);
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = foreground;
	ctx.font = '230px sans-serif';
	const initials = getInitials(name);
	const x = canvas.width/2 - ctx.measureText(initials).width/2;
	const y = canvas.height/2 + 75;
	ctx.fillText(initials,x,y);
	const data = canvas.toDataURL().split(',')[1];
	return new Buffer.from(data, 'base64');
}


module.exports ={
	newThumbnail
}
