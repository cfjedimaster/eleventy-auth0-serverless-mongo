document.addEventListener('DOMContentLoaded', init, false);

function init() {
	console.log('start this up');

	netlifyIdentity.init({
  		container: '#loginBtn' // defaults to document.body,
	});

	document.querySelector('#loginBtn').addEventListener('click', () => {
		netlifyIdentity.open();
	}, false);
	
}