import {
	create_element,
	render_icon
} from '../../helper.js';

export async function render(params) {
	let {callback} = params;
	let create_obj = {};
	
	const template = await create_element('div');
	template.classList.add('modal-content');
	
	async function modal_header() {
		let div = create_element('div');
		div.classList.add('modal-header', 'd-flex', 'align-items-center');
		div.innerHTML = `
		<button class="btn back">${render_icon.arrow_left({})}</button>
		<h3>
			<p class="mb-4">Nộp lịch báo giảng</p>
			<small style="font-weight: normal;">Tuần 1 - (13/11/2023 - 18/11/2023)</small>
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
			<div class="tag-list">
				<span class="tag-item square active">2</span>
				<span class="tag-item square">3</span>
				<span class="tag-item square">4</span>
				<span class="tag-item square">5</span>
				<span class="tag-item square">6</span>
				<span class="tag-item square">7</span>
			</div>
		</div>
		<div class="schedule-row align-items-center">
			<span>Buổi</span>
			<div class="tag-list">
				<span class="tag-item active">Sáng</span>
				<span class="tag-item">Chiều</span>
			</div>
		</div>
		<div class="schedule-row align-items-center">
			<span>Tiết</span>
			<div class="tag-list">
				<span class="tag-item square active">1</span>
				<span class="tag-item square">2</span>
				<span class="tag-item square">3</span>
				<span class="tag-item square">4</span>
				<span class="tag-item square">5</span>
			</div>
		</div>
		<h4 style="padding: 16px; background: #EBFAFF;">
			Ngày 16/11/2023
		</h4>
		<div style="padding: 16px;">
			<div class="grid grid-3 gap-14 mb-14">
				<div>
					<label class="label required">Tiết PPTC</label>
					<select class="select">
						<option value="102" selected>102</option>
					</select>
				</div>
				<div>
					<label class="label required">Lớp</label>
					<select class="select">
						<option value="9A12" selected>9A12</option>
					</select>
				</div>
				<div>
					<label class="label required">Môn</label>
					<select class="select">
						<option value="Tieng-Anh" selected>Tiếng Anh</option>
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
			<div class="d-flex align-items-center">
				<b class="mr-auto">Tiết trống</b>
				<label class="switch">
					<input type="checkbox">
					<span class="slider"></span>
				</label>
			</div>
		</div>
		`;
		
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
	
	template.appendChild(await modal_header());
	template.appendChild(await modal_body());
	template.appendChild(await modal_footer());
	
	return template;
}