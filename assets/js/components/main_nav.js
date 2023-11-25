import {
	create_element,
	render_icon
} from '../helper.js';

export default async function main_nav(params) {
	let {user} = params;
	let template = create_element('nav');
	template.classList.add('main-nav');
	template.innerHTML = `
	<div class="profile">
		<span class="ava cursor-pointer">
			<span class="text">${user.full_name.charAt(0).toUpperCase()}</span>
		</span>
		<p>
			<span class="d-block mb-4">Giáo viên</span>
			<b class="d-block">${user.full_name}</b>
		</p>
	</div>
	<ul>
		<li><a class="nav-item active" href="/">Quản lý lịch báo giảng</a></li>
	</ul>
	`;
	
	return template;
}