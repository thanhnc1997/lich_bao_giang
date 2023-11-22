import {
	create_element,
	render_icon,
	fetch_data,
	API_END_POINT,
	API_URL,
	day_translate,
	loader,
	remove_loader,
} from '../../helper.js';

export async function render(params) {
	let {callback, user, detail} = params;
	let date_list = [],
			date_session = 'morning',
			current_day = '',
			empty_period = false,
			morning_p = [],
			afternoon_p = [],
			create_obj = {};
	
	const template = await create_element('div');
	template.classList.add('modal-content');
	
	async function format_period_list(params) {
		params.map(item => {
			date_list.push(item.day.date);
			
			create_obj[item.day.date] = {
				morning: {},
				afternoon: {}
			}
		});
		
		current_day = date_list[0];
		//
		// format day by date
		//
		date_list = [...new Set(date_list)];
		for (let [k, v] of Object.entries(create_obj)) {
			params.map((item, i) => {
				if (item.day.date == k && item.day.session == true) {
					create_obj[k]['morning'][item.timetable_id] = item;
					morning_p.push(item.timetable_id);
				}
				
				if (item.day.date == k && item.day.session == false) {
					create_obj[k]['afternoon'][item.timetable_id] = item;
					afternoon_p.push(item.timetable_id);
				}
			});
		}
		
		date_list.map(async (day, i) => {
			let item = create_element('span');
			item.classList.add('tag-item', 'square');
			item.innerHTML = day_translate(((new Date(day)).toString()).split(' ')[0]);
			item.addEventListener('click', async () => {
				if (template.querySelector('#days .tag-item.active')) {
					template.querySelector('#days .tag-item.active').classList.remove('active');
				}
				item.classList.add('active');
				current_day = day;
				await load_period({day: current_day, date_session: date_session});
				
				if (date_session == 'morning') {
					template.querySelector('.modal .period').appendChild(await load_period_detail(create_obj[current_day][date_session][morning_p[0]]));
				}
				
				if (date_session == 'afternoon') {
					template.querySelector('.modal .period').appendChild(await load_period_detail(create_obj[current_day][date_session][afternoon_p[0]]));
				}
			});
			
			template.querySelector('#days').appendChild(item);
			template.querySelector('#days .tag-item').classList.add('active');
		});
		console.log(create_obj);
	}
	
	async function load_period(params) {
		template.querySelector('#period').innerHTML = '';
		let {day, date_session} = params;
		for (let [k, v] of Object.entries(create_obj[day][date_session])) {
			let span = create_element('span');
			span.classList.add('tag-item', 'square');
			span.innerHTML = k;
			span.addEventListener('click', async () => {
				if (template.querySelector('#period .tag-item.active')) {
					template.querySelector('#period .tag-item.active').classList.remove('active');
				}
				span.classList.add('active');
				template.querySelector('.modal-body .period').appendChild(await load_period_detail(v));
			});

			template.querySelector('#period').appendChild(span);
			template.querySelector('#period .tag-item').classList.add('active');
		}
	}
	
	async function load_period_detail(params) {
		template.querySelector('.modal-body .period').innerHTML = '';
		let div = create_element('div');
		
		if (!params) {
			div.innerHTML = `
			<div class="text-center" style="padding: 16px; margin: 16px; background: #F4F4F4; border-radius: 12px;">
				<b>Không có dữ liệu</b>
			</div>`;
			return div;
		}
		
		let _class = params.class;
		let {day, subject, component_id, empty_period} = params;
		
		div.innerHTML = `
		<h4 style="padding: 16px; background: #EBFAFF;">
			Ngày ${day.date}
		</h4>
		<div style="padding: 16px;">
			<div class="grid grid-3 gap-14 mb-14">
				<div>
					<label class="label required">Tiết PPTC</label>
					<input class="input" name="component_id" value="${component_id}" disabled>
				</div>
				<div>
					<label class="label required">Lớp</label>
					<select class="select" name="classes">
						
					</select>
				</div>
				<div>
					<label class="label required">Môn</label>
					<select class="select" name="subjects">
						
					</select>
				</div>
			</div>
			<div class="mb-14">
				<label class="label required">Tên bài dạy</label>
				<input class="input" placeholder="Điền tên bài dạy">
			</div>
			<div class="mb-14">
				<label class="label required">Chuẩn bị điều chỉnh (TN, hoặc thay tiết dạy)</label>
				<input class="input" placeholder="Nội dung">
			</div>
			<div class="mb-14" id="note" style="display: none;">
				<input class="input" placeholder="Lý do trống tiết" name="note">
			</div>
			<div class="d-flex align-items-center">
				<b class="mr-auto">Tiết trống</b>
				<label class="switch">
					<input type="checkbox" name="empty_period">
					<span class="slider"></span>
				</label>
			</div>
		</div>
		`;
		
		div.querySelector('input[name="empty_period"]').addEventListener('change', e => {
			empty_period = !empty_period;
			
			if (empty_period == true) {
				div.querySelector('#note').style.display = 'block';
			}
			
			if (empty_period == false) {
				div.querySelector('#note').style.display = 'none';
			}
		});
		
		await fetch_data({
			method: 'GET',
			url: API_URL + API_END_POINT.classes,
			auth: user.access_token,
			async callback(params) {
				params.map(item => {
					let option = create_element('option');
					option.innerHTML = item.name;
					if (item.name == _class.name) option.setAttribute('selected', 'selected');
					
					div.querySelector('select[name="classes"]').appendChild(option);
				});
			} 
		});
		
		await fetch_data({
			method: 'GET',
			url: API_URL + API_END_POINT.subjects,
			auth: user.access_token,
			async callback(params) {
				params.map(item => {
					let option = create_element('option');
					option.innerHTML = item.name;
					if (item.name == subject.name) option.setAttribute('selected', 'selected');
					
					div.querySelector('select[name="subjects"]').appendChild(option);
				});
			} 
		});
		
		return div;
	}
	
	async function modal_header() {
		let div = create_element('div');
		div.classList.add('modal-header', 'd-flex', 'align-items-center');
		div.innerHTML = `
		<button class="btn back">${render_icon.arrow_left({})}</button>
		<h3>
			<p class="mb-4">Nộp lịch báo giảng</p>
			<small style="font-weight: normal;">Tuần ${detail.id} - (${detail.week.start_date} - ${detail.week.end_date})</small>
		</h3>
		`;
		
		div.querySelector('.btn').addEventListener('click', async () => {
			await callback();
		});
		
		return div;
	}
	
	async function modal_body() {
		let div = create_element('div');
		div.classList.add('modal-body');
		div.style.cssText = 'padding: 0;';
		div.innerHTML = `
		<div class="schedule-row align-items-center">
			<span>Thứ</span>
			<div id="days" class="tag-list">
				
			</div>
		</div>
		<div class="schedule-row align-items-center">
			<span>Buổi</span>
			<div id="session" class="tag-list">
				<span class="tag-item active" data-session="morning">Sáng</span>
				<span class="tag-item" data-session="afternoon">Chiều</span>
			</div>
		</div>
		<div class="schedule-row align-items-center">
			<span>Tiết</span>
			<div id="period" class="tag-list">
				
			</div>
		</div>
		<div class="period"></div>
		`;
		
		div.querySelectorAll('#session .tag-item').forEach(day => {
			day.addEventListener('click', async (e) => {
				div.querySelector('#session .tag-item.active').classList.remove('active');
				day.classList.add('active');
				date_session = e.currentTarget.getAttribute('data-session');
				
				load_period({day: current_day, date_session: date_session});
				
				if (date_session == 'morning') {
					template.querySelector('.modal-body .period').appendChild(await load_period_detail(create_obj[current_day][date_session][morning_p[0]]));
				}
				
				if (date_session == 'afternoon') {
					template.querySelector('.modal-body .period').appendChild(await load_period_detail(create_obj[current_day][date_session][afternoon_p[0]]));
				}
			});
		});
		
		return div;
	}
	
	async function modal_footer() {
		let div = create_element('div');
		div.classList.add('modal-footer', 'grid', 'grid-2', 'gap-12');
		div.innerHTML = `
		<button class="btn btn-light">Hủy</button>
		<button class="btn btn-primary">Lưu</button>
		`;
		
		div.querySelectorAll('.btn').forEach(btn => {
			btn.addEventListener('click', async () => {
				await callback();
			});
		});
		
		return div;
	}
	
	await fetch_data({
		method: 'GET',
		url: API_URL + API_END_POINT.schedules + '/' + detail.id + '/periods',
		auth: user.access_token,
		async callback(params) {
			template.appendChild(await modal_header());
			template.appendChild(await modal_body());
			template.appendChild(await modal_footer());
			
			await format_period_list(params);
			await load_period({day: current_day, date_session:date_session});
			template.querySelector('.modal-body .period').appendChild(await load_period_detail(create_obj[current_day][date_session][morning_p[0]]));
			await remove_loader();
		}
	});
	
	return template;
}