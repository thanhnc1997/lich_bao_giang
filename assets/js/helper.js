export const API_URL = 'https://api-schoolportal.eledu.online/api/v1';

export const API_END_POINT = {
	sign_in: '/auth/login',
	schedules: '/schedules',
	classes: '/class',
	subjects: '/subjects',
}

export function day_translate(params) {
	let day = '';
	
	if (params == 'Mon') day = '2';
	if (params == 'Tue') day = '3';
	if (params == 'Wed') day = '4';
	if (params == 'Thu') day = '5';
	if (params == 'Fri') day = '6';
	if (params == 'Sat') day = '7';
	if (params == 'Sun') day = 'CN';
	
	return day;
}

export function create_element(e) {
	return document.createElement(e);
}

export async function common() {
	document.querySelectorAll('.dropdown-toggle').forEach(btn => {
		btn.addEventListener('click', e => {
			let dropdown_menu = e.currentTarget.nextElementSibling;
			if (dropdown_menu.classList.contains('dropdown-menu')) dropdown_menu.classList.toggle('show');
		});
	});
	
	window.addEventListener('mouseup', (e) => {
		document.querySelectorAll('.dropdown-toggle').forEach(item => {
			if (!item.contains(e.target)) {
				if (!item.parentElement.querySelector('.dropdown-menu')) return false;
				item.parentElement.querySelector('.dropdown-menu').classList.remove('show');
			}
		});
	});
}

export const render_icon = {
	arrow_left(params) {
		return `
		<svg width="${params.width || '14'}" height="${params.height || '12'}" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M15 7.5H1M1 7.5L7 13.5M1 7.5L7 1.5" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '2'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
	filter(params) {
		return `
		<svg width="${params.width || '22'}" height="${params.height || '14'}" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M13.3636 10.2727H21M1.36365 10.2727H3.54546M3.54546 10.2727C3.54546 11.779 4.76651 13 6.27274 13C7.77897 13 9.00001 11.779 9.00001 10.2727C9.00001 8.7665 7.77897 7.54545 6.27274 7.54545C4.76651 7.54545 3.54546 8.7665 3.54546 10.2727ZM19.9091 3.72727H21M1.36365 3.72727H9.00001M16.0909 6.45455C14.5847 6.45455 13.3636 5.2335 13.3636 3.72727C13.3636 2.22104 14.5847 1 16.0909 1C17.5971 1 18.8182 2.22104 18.8182 3.72727C18.8182 5.2335 17.5971 6.45455 16.0909 6.45455Z" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
	search(params) {
		return `
		<svg width="${params.width || '20'}" height="${params.height || '20'}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M13 13L19 19M8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15Z" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
	check_circle(params) {
		return `
		<svg width="${params.width || '18'}" height="${params.height || '18'}" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M11.6667 7.22222L8.11111 10.7778L6.33333 9M9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9C17 13.4183 13.4183 17 9 17Z" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
	trash(params) {
		return `
		<svg width="${params.stroke_width || '16'}" height="${params.height || '18'}" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M9.77777 7.22222V13.4444M6.22222 7.22222V13.4444M2.66666 3.66667V14.1556C2.66666 15.1512 2.66666 15.6487 2.86043 16.029C3.03087 16.3635 3.30264 16.636 3.63715 16.8064C4.01706 17 4.51466 17 5.50836 17H10.4916C11.4853 17 11.9822 17 12.3621 16.8064C12.6966 16.636 12.9693 16.3635 13.1398 16.029C13.3333 15.6491 13.3333 15.152 13.3333 14.1583V3.66667M2.66666 3.66667H4.44444M2.66666 3.66667H0.888885M4.44444 3.66667H11.5556M4.44444 3.66667C4.44444 2.83833 4.44444 2.42436 4.57977 2.09766C4.7602 1.66205 5.10606 1.31576 5.54166 1.13533C5.86837 1 6.28277 1 7.11111 1H8.88889C9.71723 1 10.1314 1 10.4581 1.13533C10.8937 1.31576 11.2397 1.66205 11.4201 2.09766C11.5555 2.42436 11.5556 2.83833 11.5556 3.66667M11.5556 3.66667H13.3333M13.3333 3.66667H15.1111" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
	carret_down(params) {
		return `
		<svg width="${params.width || '10'}" height="${params.height || '18'}" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M9 1L5 5L1 1" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
	horizontal_dots(params) {
		return `
		<svg width="${params.width || '12'}" height="${params.height || '4'}" viewBox="0 0 12 4" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M9.57143 2.00005C9.57143 2.39454 9.89123 2.71434 10.2857 2.71434C10.6802 2.71434 11 2.39454 11 2.00005C11 1.60556 10.6802 1.28577 10.2857 1.28577C9.89123 1.28577 9.57143 1.60556 9.57143 2.00005Z" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M5.28571 2.00005C5.28571 2.39454 5.60551 2.71434 6 2.71434C6.39449 2.71434 6.71429 2.39454 6.71429 2.00005C6.71429 1.60556 6.39449 1.28577 6 1.28577C5.60551 1.28577 5.28571 1.60556 5.28571 2.00005Z" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M1 2.00005C1 2.39454 1.3198 2.71434 1.71429 2.71434C2.10877 2.71434 2.42857 2.39454 2.42857 2.00005C2.42857 1.60556 2.10877 1.28577 1.71429 1.28577C1.3198 1.28577 1 1.60556 1 2.00005Z" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
	show(params) {
		return `
		<svg width="${params.width || '22'}" height="${params.height || '14'}" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M2.5868 8.77881C4.36623 10.5478 7.46953 12.9999 11.0002 12.9999C14.5308 12.9999 17.6335 10.5478 19.413 8.77881C19.8823 8.31226 20.1177 8.07819 20.2671 7.62012C20.3738 7.29328 20.3738 6.70674 20.2671 6.3799C20.1177 5.92181 19.8823 5.6877 19.413 5.22111C17.6335 3.45208 14.5308 1 11.0002 1C7.46953 1 4.36623 3.45208 2.5868 5.22111C2.11714 5.68802 1.88229 5.92165 1.7328 6.3799C1.62618 6.70673 1.62618 7.29328 1.7328 7.62012C1.88229 8.07837 2.11714 8.31189 2.5868 8.77881Z" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="M9 7C9 8.10457 9.89543 9 11 9C12.1046 9 13 8.10457 13 7C13 5.89543 12.1046 5 11 5C9.89543 5 9 5.89543 9 7Z" stroke="${params.stroke || '#000'}" stroke-width="${params.stroke_width || '1.5'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
	circle_warning(params) {
		return `
		<svg width="${params.width || '18'}" height="${params.height || '18'}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M10 6.4502V10.4502M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19ZM10.0498 13.4502V13.5502L9.9502 13.5498V13.4502H10.0498Z" stroke="${params.fill || '1'}" stroke-width="${params.stroke_width || '2'}" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		`;
	},
}

export async function parse_jwt(token) {
	let base_64_url = token.split('.')[1];
	let base_64 = base_64_url.replace(/-/g, '+').replace(/_/g, '/');
	let json_payload = decodeURIComponent(window.atob(base_64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));

	return JSON.parse(json_payload);
}

export async function check_expried_token(params) {
	if (!params) return false;
	
	let modal_settings = {
		id: 'reload_modal',
		modal_template: {
			body: {
				html: `
				<div class="d-flex align-items-center justify-content-center" style="transform: translate(0, 12px);">
				${render_icon.circle_warning({
					fill: '#ffa900'
				})}
				<h3 style="margin-left: 12px;">Phiên đăng nhập đã hết hạn, bạn vui lòng tải lại trang nhé</h3>
				</div>
				`
			},
			footer: {
				html: `
				<div class="text-center">
					<button type="button" id="ok" class="btn btn-primary">Tải lại</button>
				</div>
				`
			}
		},
		async okay() {
			await location.reload()
		}
	}
	
	let token_json = await parse_jwt(params.access_token);
	let exp = token_json.exp;
	
	if (!(Math.floor(Date.now() / 1000) <= exp)) {
		let modal = await import('./components/modal.js');
		document.body.appendChild(await modal.default(modal_settings));
		localStorage.removeItem('user');
		return false;
	}
}

export async function fetch_data(params) {
	let {method, url, callback, body, auth} = params;
	
	try {
		const response = await fetch(url, {
			method: method,
			body: JSON.stringify(body),
			headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth
      }
		});
		
		const data = await response.json();
		
		if (callback) await callback(data);
	}
	catch(error) {
		console.log(error);
		// remove_loader();
	}
}