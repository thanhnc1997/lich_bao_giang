import {
	create_element,
	render_icon,
	fetch_data,
	API_URL,
	API_END_POINT,
	remove_loader,
	loader,
	format_date
} from '../../helper.js';

export async function render(params) {
	let query_string = '?';
	let {user} = params;
	
	const template = await create_element('section');
	template.classList.add('home-page');
	template.innerHTML = `
	<div class="side-nav overflow-hidden"></div>
	<div class="page-content"></div>
	`;
	
	async function search_box() {
		let div = create_element('div');
		div.classList.add('nav', 'search-form');
		div.innerHTML = `
		<div class="search-box">
			${render_icon.search({stroke: '#999'})}
			<input type="text" name="search" class="input" placeholder="Tìm kiếm lịch báo giảng">
		</div>
		`;
		
		return div;
	}
	
	async function nav_date_filter() {
		let div = create_element('div');
		div.classList.add('nav', 'date-nav');
		div.innerHTML = `
		<div class="date-select align-items-center cursor-pointer">
			<select class="select mr-auto">
				<option value="2023" selected>2023 - 2024</option>
				<option value="2024">2024 - 2025</option>
			</select>
			<span>Tuần</span>
		</div>
		<div class="scrollable-horizontal-list">
			<span class="sticky">Tuần</span>
			<div class="tag-list">
				
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
		let data_status = '';
		
		let div = create_element('div');
		div.classList.add('nav');
		div.innerHTML = `
		<div class="tag-list">
			<span data-status="all" class="tag-item active">Tất cả</span>
			<span data-status="0" class="tag-item">Thiếu</span>
			<span data-status="1" class="tag-item">Chờ duyệt</span>
			<span data-status="2" class="tag-item">Đã duyệt</span>
		</div>
		`;
		
		div.querySelectorAll('.tag-item').forEach(tag => {
			tag.addEventListener('click', async (e) => {
				div.querySelector('.tag-item.active').classList.remove('active');
				e.currentTarget.classList.add('active');
				if (e.currentTarget.getAttribute('data-status') == 'all') {
					data_status = '';
				}
				else {
					data_status = `status=${e.currentTarget.getAttribute('data-status')}`;
				}
				
				query_string += data_status;
				await fetch_data({
					method: 'GET',
					url: API_URL + API_END_POINT.schedules + '/find' + query_string,
					auth: user.access_token,
					async callback(params) {
						loader();
						await load_week_list(params);
						await load_curriculum(params);
					}
				});
			});
		});
		
		return div;
	}
	
	async function list_curriculum() {
		let div = create_element('div');
		div.classList.add('teacher-curriculum-list');
		
		return div;
	}
	
	async function load_curriculum(params) {
		let status = '',
				type = '',
				text_color = '',
				text_btn = '';
		
		template.querySelector('.teacher-curriculum-list').innerHTML = `
		<h3 class="list-heading">Danh sách Lịch báo giảng</h3>
		`;
		
		if (!params) {
			let blank = create_element('div');
			blank.innerHTML = `
			<p class="text-center" style="padding: 16px; margin: 16px; background: #F4F4F4; border-radius: 12px;">
				<b>Không có dữ liệu</b>
			</p>
			`;
			template.querySelector('.teacher-curriculum-list').appendChild(blank);
			return false;
		}
		
		params.map(item => {
			if (item.status == 0) {
				status = 'Thiếu';
				type = 'create';
				text_color = 'text-danger';
				text_btn = 'Nộp';
			}
			
			if (item.status == 1) {
				status = 'Chờ duyệt';
				type = 'update';
				text_color = 'text-warning';
				text_btn = 'Sửa';
			}
			
			if (item.status == 2) {
				status = 'Đã duyệt';
				type = 'complete';
				text_color = 'text-success';
				text_btn = 'Xem';
			}
			
			let div = create_element('div');
			div.classList.add('item');
			div.innerHTML = `
			<p>
				<b class="d-block mb-4">Tuần ${item.week.name}</b>
				<span>${format_date(item.week.start_date)} đến ${format_date(item.week.end_date)}</span>
			</p>
			<div class="mr-auto">
				<span class="d-block mb-4">Trạng thái</span>
				<b class="${text_color}">${status}</b>
			</div>
			<button class="btn btn-primary">${text_btn}</button>
			`;
			
			div.querySelector('.btn').addEventListener('click', async (e) => {
				loader();
				let modal = await import('../detail_page.js');
				document.body.appendChild(await modal.render({
					type: type,
					user: user,
					data: item
				}));
			});
			
			template.querySelector('.teacher-curriculum-list').appendChild(div);
		});
		await remove_loader();
	}
	
	async function load_week_list(params) {
		let status = '',
				type = '';
		
		if (status == 0) type = 'create';
		if (status == 1) type = 'update';
		if (status == 2) type = 'complete';
		
		params.map(item => {
			let div = create_element('span');
			div.classList.add('tag-item', 'square');
			div.innerHTML = item.week.name;
			div.addEventListener('click', async (e) => {
				if (template.querySelector('.date-nav .tag-list .tag-item.active')) {
					template.querySelector('.date-nav .tag-list .tag-item.active').classList.remove('active')
				}
				e.currentTarget.classList.add('active');
				loader();
				let modal = await import('../detail_page.js');
				document.body.appendChild(await modal.render({
					type: type,
					user: user,
					data: item
				}));
			});
			
			template.querySelector('.tag-list').appendChild(div);
		});
	}
	
	template.querySelector('.side-nav').appendChild(await search_box());
	template.querySelector('.side-nav').appendChild(await nav_date_filter());
	template.querySelector('.page-content').appendChild(await nav_status_filter());
	template.querySelector('.page-content').appendChild(await list_curriculum());
	
	await fetch_data({
		method: 'GET',
		url: API_URL + API_END_POINT.schedules,
		auth: user.access_token,
		async callback(params) {
			loader();
			await load_week_list(params);
			await load_curriculum(params);
		}
	});
	
	return template;
}