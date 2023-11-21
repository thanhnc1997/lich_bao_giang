import {
	create_element,
	render_icon
} from '../helper.js';

export async function render() {
	const template = await create_element('div');
	template.classList.add('template-wrapper');
	let user_profile = {},
			block = '';
	
	if (!localStorage.getItem('user')) return template;
	
	user_profile = JSON.parse(localStorage.getItem('user'));
	
	let {role, access_token} = user_profile;
	
	if (role == true) {
		block = await import('./listing/censor_listing.js');
	}
	
	if (role == false) {
		block = await import('./listing/teacher_listing.js');
	}
	
	template.appendChild(await block.render({user: user_profile}));
	
	return template;
}