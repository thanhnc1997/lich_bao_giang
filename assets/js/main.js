import {
	create_element,
	common
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
		this.page.map(item => {
			if (pathname.includes(item.url)) item.render();
		});
	}
}

app.init();