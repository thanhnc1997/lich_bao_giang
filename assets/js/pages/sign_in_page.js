import {
	create_element,
	fetch_data,
	API_URL,
	API_END_POINT,
	render_icon
} from '../helper.js';

let user_sign_in = {
	username: '',
	password: ''
}

export async function render() {
	const template = await create_element('section');
	template.classList.add('sign-in-page');
	
	async function handle_sign_in(params) {
		console.log(params)
		localStorage.setItem('user', JSON.stringify({
			role: params.user.role,
			access_token: params.accessToken,
			full_name: params.user.fullname
		}));
		location.reload();
	}
	
	async function login_form() {
		let div = create_element('div');
		div.classList.add('form');
		div.innerHTML = `
		<div class="mb-14">
			<label class="label">Tên đăng nhập</label>
			<input class="input" placeholder="Tên đăng nhập" name="user_name">
		</div>
		<div class="d-flex mb-28" style="align-items: flex-end;">
			<div class="mr-12" style="flex-grow: 1">
				<label class="label">Mật khẩu</label>
				<input class="input" type="password" placeholder="Mật khẩu" name="password">
			</div>
			<button class="btn" style="background: #E1E1E1;">${render_icon.show({})}</button>
		</div>
		<button class="btn btn-primary">Đăng nhập</button>
		`;
		
		div.querySelector('.btn').addEventListener('click', (e) => {
			let input_password = div.querySelector('input[name="password"]');
			if (input_password.getAttribute('type') == 'password') {
				input_password.setAttribute('type', 'text');
				e.currentTarget.innerHTML = render_icon.hide({});
				return;
			}
			
			if (input_password.getAttribute('type') == 'text') {
				input_password.setAttribute('type', 'password');
				e.currentTarget.innerHTML = render_icon.show({});
				return;
			}
		});
		
		div.querySelector('.btn.btn-primary').addEventListener('click',async (e) => {
			user_sign_in.username = div.querySelector('input[name="user_name"]').value;
			user_sign_in.password = div.querySelector('input[name="password"]').value;
			
			await fetch_data({
				method: 'POST',
				body: user_sign_in,
				url: API_URL + API_END_POINT.sign_in,
				callback(params) {
					handle_sign_in(params);
				}
			});
		});
		
		return div;
	}
	
	template.appendChild(await login_form());
	
	return template;
}

export async function callback() {
	window.addEventListener('keyup', (e) => {
		if (e.keyCode == 13) {
			document.querySelector('.sign-in-page .btn.btn-primary').click();
		}
	});
}