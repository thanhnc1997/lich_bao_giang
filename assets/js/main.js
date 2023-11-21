import {
	create_element,
	common,
	check_expried_token
} from './helper.js';

const pathname = location.pathname;

async function draw(blocks) {
	let app = document.getElementById('app');
	app.innerHTML = '';
	for (const block of blocks) {
		const _block = await block;
		if(_block )app.appendChild(_block);
	}
	await common();
}

const render = {
	async sign_in() {
		let block = await import('./pages/sign_in_page.js');
		await draw([
			block.render(),
		]);
		
		await block.callback();
	},
	async home() {
		await draw([
			(await import('./pages/home_page.js')).render(),
		]);
	},
	async detail() {
		await draw([
			(await import('./pages/detail_page.js')).render(),
		]);
	}
}

const app = {
	page: [
		{
			url: '/',
			async render() {
				await render.home();
			}
		},
		{
			url: '/detail',
			async render() {
				await render.detail();
			}
		}
	],
	async init() {
		if (!localStorage.getItem('user')) {
			await render.sign_in();
			return false;
		}
		
		this.page.map(item => {
			if (pathname.includes(item.url)) item.render();
		});
		check_expried_token(JSON.parse(localStorage.getItem('user')));
	}
}

app.init();