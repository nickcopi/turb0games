const fs = require('fs-extra');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
require('dotenv').config();
const config = require('./config.json');

const {newThumbnail} = require('./thumbnailMaker');

const tempDir = './gittemp/';

const arrays = {
	projectcard:[
	],
	category:[]
};

const buildRepoString = repo=>{
	const split = repo.split('https://')
	split[1] = `${process.env.GIT_USER}:${process.env.GITLAB_TOKEN}@${split[1]}`;
	return split.join('https://');
}

const readUntilClose = (line,index)=>{
	let content = '';
	let i = index;
	for(i = index; i < line.length; i++){
		if(line[i] === '}' && line[i+1] === '}')
			break;
		content += line[i];
	}
	return {
		content,
		endIndex:i
	}
}

const readArray = name=>{
	const file = fs.readFileSync('partials/' + name + '.htm').toString();
	let cards = '';
	arrays[name].forEach(options=>{
		cards += file.split('\n').map(line=>{
			return checkLine(line,options);
		}).join('');
	});
	return cards;
}

const checkLine = (line, options)=>{
	while(line.includes('{{')){
		const index = line.indexOf('{{');
		const result = readUntilClose(line, index+2);
		let content;
		switch(result.content[0]){
			case '!':
				content = options[result.content.substring(1,result.content.length)];
				break;
			case '#':
				content = fs.readFileSync('partials/' + result.content.substring(1,result.content.length) + '.htm').toString();
				break;
			case '@':
				content = readArray(result.content.substring(1,result.content.length));
				break;

			default:
				console.error(`Invalid template directive in ${result.content}!`);

		}
		line = line.substring(0,index) + content + line.substring(result.endIndex+2,line.length);
	}
	return line;
}

const buildTarget = target=>{
	console.log(`Building page ${target}.`);
	const page = fs.readFileSync(`./partials/${target}`).toString();
	const lines = page.split('\n');
	const newPage = lines.map(line=>{
		return checkLine(line,config.options);
	}).join('');
	return newPage;
}

const pullRepoConfig = async project=>{
	const repo = project.repo;
	let split = repo.split('.');
	split = split[split.length-2].split('/');
	const name = split[split.length-1];
	const tempPath = tempDir + name;
	const branch = project.branch?project.branch:'master';
	mkdirp.sync(tempPath);
	const git = require('simple-git/promise')(tempPath);
	await git.init(false);
	await git.addRemote('origin', buildRepoString(repo));
	await git.fetch('origin').catch(e=>{
		console.error(e);
		console.error(`Failed to fetch remote, ${repo}.`)
	});
	await git.raw(['checkout',`origin/${branch}`,`--`,'.embed']).catch(e=>{
		console.error(`Failed to pull ${repo} from the repository.`);
	});
	const instructionsPath = tempPath + '/.embed/instructions.md';
	const instructions = {};
	if(fs.existsSync(instructionsPath))
		instructions.instructions = fs.readFileSync(instructionsPath).toString().split('\n').join('<br>');
	try{
		let embedConfig = require(tempPath + '/.embed/config.json');
		embedConfig = {
			...embedConfig,
			...project,
			...instructions
		};
		arrays.projectcard.push(embedConfig);
		const projectPath = './build/games/' + embedConfig.name;
		fs.copySync(tempPath + '/.embed', projectPath);
		if(!fs.existsSync(projectPath + '/thumbnail.png'))
			fs.writeFileSync(projectPath + '/thumbnail.png',newThumbnail(embedConfig.name));
		if(embedConfig.embed){
			embedConfig = {
				...embedConfig.embed,
				...embedConfig
			}
			//const embedPath = projectPath + '/' + name;
			const git = require('simple-git/promise')(projectPath);
			await git.raw(['clone','--depth','1', buildRepoString(repo)]);
			rimraf.sync(projectPath + '/' + name + '/.git/');
			try{
				fs.renameSync(projectPath + '/' + name, projectPath + '/' + embedConfig.name);
			} catch(e){console.error('Embed Clone Error',e)}
		}
		const page = fs.readFileSync('./partials/page.html').toString();
		const newPage = page.split('\n').map(line=>{
			return checkLine(line,{
				repo,
				...config.options,
				...embedConfig,
				embedDisplay: embedConfig.embed?'':'none'

			});
		}).join('');
		fs.writeFileSync(projectPath + '/page.html',newPage);

		//console.log(embedConfig);
	} catch(e){
		console.error(e);
		console.error(`Failed to build for ${repo}.`);
	}
}


const init = async ()=>{
	rimraf.sync('./build');
	mkdirp.sync('./build/games');
	rimraf.sync(tempDir);
	mkdirp.sync(tempDir);
	const projects = config.games;
	await Promise.all(projects.map(async project=>{
		await pullRepoConfig(project);
	}));
	arrays.category = config.categories.map(category=>{
		if(!category.animation) category.animation = '';
		return category;
	});
	arrays.projectcard.sort((a,b)=>b.rating-a.rating);
	rimraf.sync(tempDir);
	const targets = config.targets;
	const pages = targets.map(target=>{
		return {
			target,
			content:buildTarget(target)
		}
	});
	//rimraf build
	//mkdirp build
	pages.forEach(page=>{
		fs.writeFileSync('./build/' + page.target,page.content);
	});
	fs.copySync('./static','./build/static');
	console.log('Finished build at ./build');
}

init();
