import {
	create_element
} from '../helper.js';

export async function render() {
	const template = await create_element('section');
	template.innerHTML = '2';
	
	return template;
}