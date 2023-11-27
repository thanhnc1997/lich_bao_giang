import {
	create_element
} from '../helper.js';

export async function render() {
	const template = await create_element('section');
	template.classList.add('login-page');
	
	async function login_form() {
		let div = create_element('div');
		div.classList.add('form');
		div.innerHTML = `
		<div class="mb-14">
			<label class="label">Tên đăng nhập</label>
			<input class="input" placeholder="Tên đăng nhập">
		</div>
		<div class="mb-28">
			<label class="label">Mật khẩu</label>
			<input class="input" placeholder="Mật khẩu">
		</div>
		<button class="btn btn-primary">Đăng nhập</button>
		`;
		
		return div;
	}
	
	template.appendChild(await login_form());
	
	return template;
}