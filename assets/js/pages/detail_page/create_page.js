import {
	create_element,
	render_icon,
	fetch_data,
	API_END_POINT,
	API_URL,
	day_translate,
	loader,
	remove_loader,
	format_date,
	toast
} from '../../helper.js';

export async function render(params) {
	let {callback, user, detail, load_list} = params;
	let date_list = [],
			classes_list = [],
			subjects_list = [],
			date_session = 'morning',
			current_day = '',
			create_obj = {};
	
	let period_update = {}
	
	const template = await create_element('div');
	template.classList.add('modal-content');
	template.style.cssText = 'height: 100%';
	
	async function format_period_list(params) {
		params.map(item => {
			date_list.push(item.day.date);
			date_list.sort();
			
			create_obj[item.day.date] = {
				morning: {},
				afternoon: {}
			}
			
			let updated_key = item.day.date + '-' + item.day.session + '-' + item.timetable_id;
			period_update[updated_key] = {
				day_id: item.day.id,
				schedule_id: item.schedule.id,
				component_id: item.component.id,
				class_id: item.class.id,
				subject_id: item.subject.id,
				timetable_id: item.timetable_id,
				name: item.component.name,
				adjustment: '',
				note: '',
				empty_period: false
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
				}
				
				if (item.day.date == k && item.day.session == false) {
					create_obj[k]['afternoon'][item.timetable_id] = item;
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
				await load_session({day: current_day});
			});
			
			template.querySelector('#days').appendChild(item);
			template.querySelector('#days .tag-item').classList.add('active');
		});
		
		await load_session({day: current_day});
		// console.log(create_obj)
		// console.log(period_update)
	}
	
	async function load_session(params) {
		let {day} = params;
		template.querySelector('#session').innerHTML = `
		<span class="tag-item" data-session="morning">Sáng</span>
		<span class="tag-item" data-session="afternoon">Chiều</span>
		`;
		
		if (Object.keys(create_obj[day]['morning']).length) {
			date_session = 'morning';
			template.querySelector('#session [data-session="morning"]').classList.add('active');
		}
		
		if (!Object.keys(create_obj[day]['morning']).length && Object.keys(create_obj[day]['afternoon']).length) {
			date_session = 'afternoon';
			template.querySelector('#session [data-session="afternoon"]').classList.add('active');
		}
		
		await load_period({day: day, date_session: date_session});
		
		template.querySelectorAll('#session .tag-item').forEach(item => {
			item.addEventListener('click', async (e) => {
				template.querySelector('#period').innerHTML = '';
				template.querySelector('#session .tag-item.active').classList.remove('active');
				item.classList.add('active');
				date_session = e.currentTarget.getAttribute('data-session');
				let k = Object.keys(create_obj[day][date_session])[0];
				await load_period({day: day, date_session: date_session});
				
				template.querySelector('.modal-body .period').appendChild(await load_period_detail(create_obj[day][date_session][k]));
			});
		});
	}
	
	async function load_period(params) {
		template.querySelector('#period').innerHTML = '';
		let {day, date_session} = params;
		let first_key = Object.keys(create_obj[day][date_session])[0];
		template.querySelector('.modal-body .period').appendChild(await load_period_detail(create_obj[day][date_session][first_key]));
		
		for (let [k, v] of Object.entries(create_obj[day][date_session])) {
			let span = create_element('span');
			span.classList.add('tag-item', 'square');
			span.setAttribute('data-period', v.day.date + '-' + v.day.session + '-' + v.timetable_id);
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
		let {day, subject, component, empty_period} = params;
		let key = day.date + '-' + day.session + '-' + params.timetable_id;
		
		div.innerHTML = `
		<h4 class="d-flex align-items-center" style="padding: 12px 16px; background: #EBFAFF;">
			<span class="mr-auto">Ngày ${format_date(day.date)}</span>
			<button id="add-period" class="btn btn-primary btn-icon">
				${render_icon.plus({stroke: '#03177E'})}
				<span>Bù tiết</span>
			</button>
		</h4>
		<div style="padding: 16px;">
			<div class="grid grid-3 gap-14 mb-12">
				<div>
					<label class="label required">Tiết PPTC</label>
					<input class="input" name="component_id" value="${period_update[key]['component_id']}" disabled>
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
			<div class="mb-12">
				<label class="label required">Tên bài dạy</label>
				<input class="input" placeholder="Điền tên bài dạy" name="name" value="${period_update[key]['name']}">
			</div>
			<div class="mb-12">
				<label class="label required">Chuẩn bị điều chỉnh (TN, hoặc thay tiết dạy)</label>
				<input class="input" placeholder="Nội dung" name="adjustment" value="${period_update[key]['adjustment']}">
			</div>
			<div class="d-flex align-items-center mb-12">
				<b class="mr-auto">Tiết trống</b>
				<label class="switch">
					<input type="checkbox" name="empty_period" ${empty_period == true ? 'checked' : ''}>
					<span class="slider"></span>
				</label>
			</div>
			<div id="note" style="display: ${empty_period == true ? 'block' : 'none'};">
				<input class="input" placeholder="Lý do trống tiết" name="note">
			</div>
		</div>
		`;
		
		async function update_period(params) {
			let {delay, id} = params;
			
			if (!delay) delay = 0;
			
			setTimeout(async () => {
				await fetch_data({
					method: 'PUT',
					url: API_URL + API_END_POINT.periods + '/' + id,
					body: period_update[key],
					auth: user.access_token
				});
			}, delay);
		}
		
		div.querySelector('input[name="empty_period"]').addEventListener('change', async (e) => {
			period_update[key]['empty_period'] = !period_update[key]['empty_period'];
			
			if (period_update[key]['empty_period'] == true) {
				div.querySelector('#note').style.display = 'block';
			}
			
			if (period_update[key]['empty_period'] == false) {
				div.querySelector('#note').style.display = 'none';
			}
			
			await update_period({id: params.id});
		});
		
		div.querySelector('input[name="adjustment"]').addEventListener('keyup', async (e) => {
			period_update[key]['adjustment'] = e.target.value;
			create_obj[day.date][date_session][params.timetable_id]['adjustment'] = e.target.value;
			
			await update_period({delay: 250, id: params.id});
		});
		
		div.querySelector('input[name="name"]').addEventListener('keyup', async (e) => {
			period_update[key]['name'] = e.target.value;
			create_obj[day.date][date_session][params.timetable_id]['name'] = e.target.value;
			
			await update_period({delay: 250, id: params.id});
		});
		
		div.querySelector('input[name="note"]').addEventListener('change', async (e) => {
			period_update[key]['note'] = e.target.value;
			create_obj[day.date][date_session][params.timetable_id]['note'] = e.target.value;
			
			await update_period({delay: 250, id: params.id});
		});
		
		div.querySelector('select[name="classes"]').addEventListener('change', async (e) => {
			period_update[key]['class_id'] = e.target.value;
			create_obj[day.date][date_session][params.timetable_id]['class']['id'] = e.target.value;
			
			await update_period({id: params.id});
		});
		
		div.querySelector('select[name="classes"]').addEventListener('change', async (e) => {
			period_update[key]['class_id'] = e.target.value;
			create_obj[day.date][date_session][params.timetable_id]['subject']['id'] = e.target.value;
			
			await update_period({id: params.id});
		});
		//
		// load all classes and subjects
		//
		classes_list.map(item => {
			let option = create_element('option');
			option.innerHTML = item.name;
			if (item.id == period_update[key]['class_id']) option.setAttribute('selected', 'selected');

			div.querySelector('select[name="classes"]').appendChild(option);
		});
		
		subjects_list.map(item => {
			let option = create_element('option');
			option.innerHTML = item.name;
			if (item.name == period_update[key]['subject_id']) option.setAttribute('selected', 'selected');

			div.querySelector('select[name="subjects"]').appendChild(option);
		});
		//
		// add period
		//
		div.querySelector('#add-period').addEventListener('click', async (e) => {
			await fetch_data({
				method: 'GET',
				url: API_URL + API_END_POINT.periods + '/find?week_id=' + detail.week.id + '&class_id=' + params.class.id,
				auth: user.access_token,
				async callback(params) {
					document.body.appendChild(await available_period(params));
				}
			});
		});
		
		return div;
	}
	
	async function available_period(params) {
		console.log(params);
		let div = create_element('div');
		div.classList.add('modal');
		div.innerHTML = `
		<div class="overlay"></div>
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header d-flex align-items-center">
					<button class="btn back">${render_icon.arrow_left({})}</button>
					<h3 style="flex-grow: 1;">
						Danh sách tiết trống
					</h3>
				</div>
				<div class="modal-body"></div>
				<div class="modal-footer grid grid-2 gap-12">
					<button class="btn btn-light">Hủy</button>
					<button class="btn btn-primary">Chọn</button>
				</div>
			</div>
		</div>
		`;
		
		async function remove_modal(trigger) {
			div.querySelector(trigger).addEventListener('click', (e) => {
				div.remove();
			});
		}
		
		remove_modal('.overlay');
		remove_modal('.modal-header .back');
		remove_modal('.modal-footer .btn-light');
		remove_modal('.modal-footer .btn-primary');
		
		return div;
	}
	
	async function modal_header() {
		let status = '',
				text_color = '';
		
		if (detail.status == 0) {
			status = 'Thiếu';
			text_color = 'text-danger';
		}

		if (detail.status == 1) {
			status = 'Chờ duyệt';
			text_color = 'text-warning';
		}

		if (detail.status == 2) {
			status = 'Đã duyệt';
			text_color = 'text-success';
		}
		
		let div = create_element('div');
		div.classList.add('modal-header', 'd-flex', 'align-items-center');
		div.innerHTML = `
		<button class="btn back">${render_icon.arrow_left({})}</button>
		<h3 style="flex-grow: 1;">
			<p class="mb-4">
				Tuần ${detail.id} (${format_date(detail.week.start_date)} - ${format_date(detail.week.end_date)})
			</p>
			<small style="font-weight: normal;">
				Trạng thái  <b class="${text_color}">${status}</b>
			</small>
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
			<b>Thứ</b>
			<div id="days" class="tag-list">
				
			</div>
		</div>
		<div class="grid grid-md-2">
			<div class="schedule-row align-items-center">
				<b>Buổi</b>
				<div id="session" class="tag-list">
					
				</div>
			</div>
			
			<div class="schedule-row align-items-center">
				<b>Tiết</b>
				<div id="period" class="tag-list">

				</div>
			</div>
		</div>
		<div class="period"></div>
		`;
		
		return div;
	}
	
	async function modal_footer() {
		let div = create_element('div');
		div.classList.add('modal-footer', 'grid', 'grid-2', 'gap-12');
		div.innerHTML = `
		<button class="btn btn-light">Hủy</button>
		<button class="btn btn-primary">${detail.status == 0 ? 'Nộp LBG' : 'Cập nhật LBG'}</button>
		`;
		
		div.querySelectorAll('.btn').forEach(btn => {
			btn.addEventListener('click', async () => {
				await callback();
			});
		});
		
		div.querySelector('.btn.btn-primary').addEventListener('click', async () => {
			if (params.detail.status == 0) {
				await fetch_data({
					method: 'PUT',
					url: API_URL + API_END_POINT.schedules + '/' + detail.id + '/status',
					body: {
						status: 1
					},
					auth: user.access_token
				});
			}
			
			await load_list();
		});
		
		return div;
	}
	
	template.appendChild(await modal_header());
	template.appendChild(await modal_body());
	template.appendChild(await modal_footer());
	
	await fetch_data({
		method: 'GET',
		url: API_URL + API_END_POINT.classes,
		auth: user.access_token,
		async callback(params) {
			classes_list = [...params];
		} 
	});

	await fetch_data({
		method: 'GET',
		url: API_URL + API_END_POINT.subjects,
		auth: user.access_token,
		async callback(params) {
			subjects_list = [...params];
		} 
	});
	
	await fetch_data({
		method: 'GET',
		url: API_URL + API_END_POINT.schedules + '/' + detail.id + '/periods',
		auth: user.access_token,
		async callback(params) {
			await format_period_list(params);
			await remove_loader();
		}
	});
	
	return template;
}