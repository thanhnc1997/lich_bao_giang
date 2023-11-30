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
	let status_query_param = '';
	let year_query_param = '';
	let week_query_param = '';
	
	let {user} = params;
	
	const template = await create_element('section');
	template.classList.add('home-page');
	template.innerHTML = `
	<div class="side-nav overflow-hidden"></div>
	<div class="page-content"></div>
	`;
	loader();
	
	async function search_box() {
		let div = create_element('div');
		div.classList.add('nav', 'search-form');
		div.innerHTML = `
		<div class="search-box">
			${render_icon.search({stroke: '#999'})}
			<input type="text" name="search" class="input" placeholder="Tìm kiếm lịch báo giảng">
		</div>
		`;
		
		div.querySelector('input').addEventListener('keyup', async (e) => {
			let week_value = e.target.value;
			
			if (!week_value || week_value == '') {
				week_query_param = '';
			}
			else {
				week_query_param = 'week=' + week_value.replace(/\D/g, '');
			}
			
			if (/\d/.test(week_value) != true && week_value != '') return false;
			
			setTimeout(async () => {
				loader();
				await fetch_data({
					method: 'GET',
					url: API_URL + API_END_POINT.schedules + '/find?' + week_query_param,
					auth: user.access_token,
					async callback(params) {
						await load_week_list(params);
						await load_curriculum(params);
					}
				});
			}, 400);
		});
		
		return div;
	}
	
	async function nav_date_filter() {
		let div = create_element('div');
		div.classList.add('nav', 'date-nav');
		div.innerHTML = `
		<div class="date-select align-items-center cursor-pointer">
			<select class="select mr-auto" name="years_list">
				
			</select>
			<span>Tuần</span>
		</div>
		<div class="scrollable-horizontal-list">
			<span class="sticky">Tuần</span>
			<div class="tag-list">
				
			</div>
		</div>
		`;
		
		div.querySelector('.select').addEventListener('change', async (e) => {
			year_query_param = 'year=' + e.target.value;
			await fetch_data({
				method: 'GET',
				url: API_URL + API_END_POINT.schedules + '/find?' + status_query_param + '&' + year_query_param,
				auth: user.access_token,
				async callback(params) {
					loader();
					await load_week_list(params);
					await load_curriculum(params);
				}
			});
		});
		
		return div;
	}
	
	async function nav_status_filter() {
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
				if (e.currentTarget.getAttribute('data-status') != 'all') {
					status_query_param = 'status=' + e.currentTarget.getAttribute('data-status');
				}
				else {
					status_query_param = '';
				}
				await fetch_data({
					method: 'GET',
					url: API_URL + API_END_POINT.schedules + '/find?' + status_query_param + '&' + year_query_param,
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
		
		if (!params.length) {
			let blank = create_element('div');
			blank.innerHTML = `
			<p class="text-center" style="padding: 16px; margin: 16px; background: #F4F4F4; border-radius: 12px;">
				<b>Không có dữ liệu</b>
			</p>
			`;
			template.querySelector('.teacher-curriculum-list').appendChild(blank);
			await remove_loader();
			return false;
		}
		
		params.map(item => {
			if (item.status == 0) {
				status = 'Thiếu';
				text_color = 'text-danger';
				text_btn = 'Nộp';
			}
			
			if (item.status == 1) {
				status = 'Chờ duyệt';
				text_color = 'text-warning';
				text_btn = 'Sửa';
			}
			
			if (item.status == 2) {
				status = 'Đã duyệt';
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
				if (item.status == 0 || item.status == 1) type = 'create';
				if (item.status == 2) type = 'complete';
				
				let modal = await import('../detail_page.js');
				document.body.appendChild(await modal.render({
					type: type,
					user: user,
					data: item,
					async _callback() {
						await fetch();
					}
				}));
			});
			
			template.querySelector('.teacher-curriculum-list').appendChild(div);
		});
		await remove_loader();
	}
	
	async function load_year_list(params) {
		let {start_year, end_year} = params;
		
		await fetch_data({
			method: 'GET',
			url: API_URL + API_END_POINT.years,
			auth: user.access_token,
			async callback(params) {
				params.map(item => {
					let option = create_element('option');
					option.setAttribute('value', item.start_year + ',' + item.end_year);
					option.innerHTML = item.start_year + '-' + item.end_year;
					if (item.start_year == start_year && item.end_year == end_year) option.setAttribute('selected', 'selected');
					
					template.querySelector('.select[name="years_list"]').appendChild(option);
				});
			}
		});
	}
	
	async function load_week_list(params) {
		let type = '',
				start_year = '',
				end_year = '';
		
		template.querySelector('.tag-list').innerHTML = '';
		
		if (!params.length) {
			await remove_loader();
			return false;
		}
		
		params.map(item => {
			start_year = item.week.year.start_year;
			end_year = item.week.year.end_year;
			
			let div = create_element('span');
			div.classList.add('tag-item', 'square');
			div.innerHTML = item.week.name;
			div.addEventListener('click', async (e) => {
				if (template.querySelector('.date-nav .tag-list .tag-item.active')) {
					template.querySelector('.date-nav .tag-list .tag-item.active').classList.remove('active')
				}
				e.currentTarget.classList.add('active');
				if (item.status == 0 || item.status == 1) type = 'create';
				if (item.status == 2) type = 'complete';
				
				let modal = await import('../detail_page.js');
				document.body.appendChild(await modal.render({
					type: type,
					user: user,
					data: item,
					async _callback() {
						await fetch();
					}
				}));
			});
			
			template.querySelector('.tag-list').appendChild(div);
		});
		
		await load_year_list({
			start_year: start_year,
			end_year: end_year,
		})
	}
	
	template.querySelector('.side-nav').appendChild(await search_box());
	template.querySelector('.side-nav').appendChild(await nav_date_filter());
	template.querySelector('.page-content').appendChild(await nav_status_filter());
	template.querySelector('.page-content').appendChild(await list_curriculum());
	
	async function fetch() {
		await fetch_data({
			method: 'GET',
			url: API_URL + API_END_POINT.schedules + '/find',
			auth: user.access_token,
			async callback(params) {
				await load_week_list(params);
				await load_curriculum(params);
			}
		});
	}
	await fetch();
	
	return template;
}