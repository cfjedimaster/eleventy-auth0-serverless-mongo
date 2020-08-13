document.addEventListener('DOMContentLoaded', init, false);

function init() {
	let loginBtn = document.querySelector('#loginBtn');
	let logoutBtn = document.querySelector('#logoutBtn');

	console.log('start this up');

	netlifyIdentity.init({
  		container: '#loginBtn' // defaults to document.body,
	});

	const user = netlifyIdentity.currentUser();

	if(user) {
		loginBtn.classList.add('d-none');
		logoutBtn.classList.remove('d-none');
	}
	
	console.log('user = '+JSON.stringify(user));

	loginBtn.addEventListener('click', () => {
		netlifyIdentity.open();
	}, false);

	logoutBtn.addEventListener('click', () => {
		netlifyIdentity.logout();
	}, false);

	netlifyIdentity.on('login', user => {
		console.log('login', user);
		loginBtn.classList.add('d-none');
		logoutBtn.classList.remove('d-none');
	});

	netlifyIdentity.on('logout', () => {
		console.log('Logged out')
		logoutBtn.classList.add('d-none');
		loginBtn.classList.remove('d-none');
	});
}