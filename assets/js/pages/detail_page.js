import {
	create_element,
	loader,
	remove_loader
} from '../helper.js';

export async function render(params) {
	let {type, user, data, _callback} = params;
	let modal_template = '';
	
	document.body.classList.add('overflow-hidden');
	const template = await create_element('div');
	template.classList.add('modal', 'modal-scroll', 'detail-page');
	template.innerHTML = `
	<div class="overlay"></div>
	<div class="modal-dialog">
		
	</div>
	`;
	loader();
	if (!params || !type || !user || !data) remove_loader();
	
	template.querySelector('.overlay').addEventListener('click', () => {
		remove_template();
	})
	
	async function remove_template() {
		template.remove();
		document.body.classList.remove('overflow-hidden');
	}
	
	template.querySelector('.overlay').addEventListener('click', () => {
		remove_template();
	});
	
	if (type == 'create') {
		modal_template = await import('./detail_page/create_page.js');
		template.querySelector('.modal-dialog').appendChild(await modal_template.render({
			user: user,
			detail: data,
			async callback() {
				await remove_template();
			},
			async load_list() {
				await _callback();
			}
		}));
	}
	
	return template;
}