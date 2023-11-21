import {
	create_element,
	render_icon,
	fetch_data,
	API_URL,
	API_END_POINT
} from '../../helper.js';

export async function render(params) {
	let {user} = params;
	
	const template = await create_element('section');
	template.classList.add('home-page');
	template.innerHTML = `
	<div class="side-nav rounded-8 overflow-hidden"></div>
	<div class="page-content"></div>
	`;
	
	async function search_box() {
		let div = create_element('div');
		div.classList.add('nav', 'search-form');
		div.innerHTML = `
		<div class="search-box">
			${render_icon.search({stroke: '#999'})}
			<input type="text" name="search" class="input" placeholder="Tìm kiếm">
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
				<option value="2023" selected>Năm 2023</option>
				<option value="2024">Năm 2024</option>
			</select>
			<span>Tuần</span>
		</div>
		<div class="scrollable-horizontal-list">
			<span class="sticky">Tuần</span>
			<div class="tag-list">
				<span class="tag-item square">1</span>
				<span class="tag-item square">2</span>
				<span class="tag-item square active">3</span>
				<span class="tag-item square">4</span>
				<span class="tag-item square">5</span>
				<span class="tag-item square">6</span>
				<span class="tag-item square">7</span>
				<span class="tag-item square">8</span>
				<span class="tag-item square">9</span>
				<span class="tag-item square">10</span>
				<span class="tag-item square">11</span>
				<span class="tag-item square">12</span>
				<span class="tag-item square">13</span>
				<span class="tag-item square">14</span>
				<span class="tag-item square">15</span>
				<span class="tag-item square">16</span>
				<span class="tag-item square">17</span>
				<span class="tag-item square">18</span>
				<span class="tag-item square">19</span>
				<span class="tag-item square">21</span>
				<span class="tag-item square">22</span>
				<span class="tag-item square">23</span>
				<span class="tag-item square">24</span>
				<span class="tag-item square">25</span>
				<span class="tag-item square">26</span>
				<span class="tag-item square">27</span>
				<span class="tag-item square">28</span>
				<span class="tag-item square">29</span>
				<span class="tag-item square">30</span>
				<span class="tag-item square">31</span>
				<span class="tag-item square">32</span>
				<span class="tag-item square">33</span>
				<span class="tag-item square">34</span>
				<span class="tag-item square">35</span>
				<span class="tag-item square">36</span>
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
		div.classList.add('nav', 'rounded-8');
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
		div.classList.add('teacher-curriculum-list');
		div.innerHTML = `
		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 3</b>
			</p>
			<span class="text-danger mr-auto">Thiếu</span>
			<button class="btn btn-primary">Nộp</button>
		</div>
		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 2</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-success mr-auto">Đã duyệt</span>
			<button class="btn btn-primary">Xem</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>

		<div class="item">
			<p>
				<b class="d-block mb-4">Tuần 1</b>
				<span class="text-secondary">Ngày tạo 14/11/2023</span>
			</p>
			<span class="text-warning mr-auto">Chờ duyệt</span>
			<button class="btn btn-primary">Sửa</button>
		</div>
		`;
		
		div.querySelectorAll('.btn').forEach(btn => {
			btn.addEventListener('click', async (e) => {
				let modal = await import('../detail_page.js');
				document.body.appendChild(await modal.render({
					type: 'create'
				}));
			});
		});
		
		return div;
	}
	
	async function load_curriculum(params) {
		console.log(params)
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
			await load_curriculum(params);
		}
	});
	
	return template;
}