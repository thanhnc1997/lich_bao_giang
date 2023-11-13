import {
	create_element,
	render_icon
} from '../helper.js';

const arr = [
	{
		name: 'Ngoại ngữ',
		teachers: [
			{name: 'Trần A', status: 'incomplete'},
			{name: 'Nguyễn A', status: 'complete'},
			{name: 'Nguyễn B', status: 'pending'},
			{name: 'Ngô D', status: 'incomplete'},
			{name: 'Lưu C', status: 'incomplete'},
			{name: 'Đặng D', status: 'complete'},
			{name: 'Nguyễn B', status: 'pending'},
			{name: 'Nguyễn T', status: 'pending'}
		]
	},
	{
		name: 'Văn - Sử - CD',
		teachers: [
			{name: 'Trần A', status: 'incomplete'},
			{name: 'Nguyễn A', status: 'complete'},
			{name: 'Nguyễn B', status: 'pending'},
			{name: 'Ngô D', status: 'incomplete'},
			{name: 'Lưu C', status: 'incomplete'},
			{name: 'Đặng D', status: 'complete'},
			{name: 'Nguyễn B', status: 'pending'},
			{name: 'Nguyễn T', status: 'pending'}
		]
	}
]

export async function render() {
	const template = await create_element('section');
	template.classList.add('home-page');
	
	async function page_header() {
		let div = create_element('header');
		div.classList.add('header');
		div.innerHTML = `
		<b class="header-title">Lịch báo giảng</b>
		<div class="ava"></div>
		`;
		
		return div;
	}
	
	async function search_box() {
		let div = create_element('div');
		div.classList.add('nav', 'search-form');
		div.innerHTML = `
		<div class="search-box">
			${render_icon.search({stroke: '#999'})}
			<input type="text" name="search" class="input" placeholder="Tìm kiếm">
		</div>
		<button class="btn" style="padding: 8px; line-height: 0; height: auto;">${render_icon.filter({})}</button>
		`;
		
		return div;
	}
	
	async function nav_action() {
		let div = create_element('div');
		div.classList.add('nav', 'd-flex', 'align-items-center');
		div.innerHTML = `
		<input type="checkbox" id="check_all">
		<label class="mr-auto" for="check_all" style="padding: 0 28px;">Chọn tất cả</label>

		<button class="btn" style="padding: 8px; line-height: 0; height: auto;">${render_icon.check_circle({})}</button>
		`;
		
		return div;
	}
	
	async function nav_date_filter() {
		let div = create_element('div');
		div.style.cssText = `background: #F4F4F4;`;
		div.classList.add('nav', 'd-flex', 'align-items-center');
		div.innerHTML = `
		<div class="d-flex align-items-center cursor-pointer mr-28">
			<b class="mr-6">T.10 - 2023</b>
			${render_icon.carret_down({})}
		</div>
		<div class="d-flex align-items-center">
			<span class="mr-8">Tuần</span>
			<div class="tag-list">
				<span class="tag-item active square">25</span>
				<span class="tag-item square">26</span>
				<span class="tag-item square">27</span>
				<span class="tag-item square">28</span>
			</div>
		</div>
		`;
		
		div.querySelectorAll('.tag-item').forEach(tag => {
			tag.addEventListener('click', e => {
				div.querySelector('.tag-item.active').classList.remove('active');
				e.currentTarget.classList.add('active');
			});
		});
		
		return div;
	}
	
	async function nav_status_filter() {
		let div = create_element('div');
		div.classList.add('nav');
		div.innerHTML = `
		<div class="tag-list">
			<span class="tag-item active">Tất cả</span>
			<span class="tag-item">Đã duyệt</span>
			<span class="tag-item">Chờ duyệt</span>
			<span class="tag-item">Thiếu</span>
		</div>
		`;
		
		div.querySelectorAll('.tag-item').forEach(tag => {
			tag.addEventListener('click', e => {
				div.querySelector('.tag-item.active').classList.remove('active');
				e.currentTarget.classList.add('active');
			});
		});
		
		return div;
	}
	
	async function list_curriculum() {
		let div = create_element('div');
		div.classList.add('curriculum-list');
		
		return div;
	}
	
	async function load_curriculum(params) {
		template.querySelector('.curriculum-list').innerHTML = '';
		
		params.map(async item => {
			let div = create_element('div');
			div.classList.add('item');
			div.innerHTML = `
			<div class="group-name text-center">
				<b class="name">${item.name}</b>
			</div>
			<ul></ul>
			`;
			
			async function load_teacher(params) {
				params.map(teacher => {
					let status = teacher.status;
					let bg_color;

					if (status == 'incomplete') bg_color = '#FFE3E3';
					if (status == 'pending') bg_color = '#FBF0DA';
					if (status == 'complete') bg_color = '#D6F0E0';

					let li = create_element('li');
					li.style.cssText = `background: ${bg_color}`;
					li.innerHTML = `
					${teacher.name} 
					<div class="dropdown">
						<button class="btn dropdown-toggle" style="padding: 8px; line-height: 0; height: auto;">
							${render_icon.horizontal_dots({})}
						</button>

						<div class="dropdown-menu" style="right: 0;">
							<div class="dropdown-item">Xem</div>
							<div class="dropdown-item">Duyệt</div>
						</div>
					</div>
					`;
					
					div.querySelector('ul').appendChild(li);
				});
			}
			
			template.querySelector('.curriculum-list').appendChild(div);
			await load_teacher(item.teachers);
		});
	}
	
	template.appendChild(await page_header());
	template.appendChild(await search_box());
	template.appendChild(await nav_action());
	template.appendChild(await nav_date_filter());
	template.appendChild(await nav_status_filter());
	template.appendChild(await list_curriculum());
	await load_curriculum(arr);
	
	return template;
}