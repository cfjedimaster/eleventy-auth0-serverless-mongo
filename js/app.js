document.addEventListener('DOMContentLoaded', init, false);

let user = null;

function init() {
	let loginBtn = document.querySelector('#loginBtn');
	let logoutBtn = document.querySelector('#logoutBtn');


	netlifyIdentity.init({
  		container: '#loginBtn' 
	});

	user = netlifyIdentity.currentUser();

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
		let acButton = document.querySelector('#addCommentButton');
		if(acButton) acButton.classList.remove('disabled');
	});

	netlifyIdentity.on('logout', () => {
		console.log('Logged out')
		logoutBtn.classList.add('d-none');
		loginBtn.classList.remove('d-none');
	});

	// Logic for film pages
	if(window.filmId) {
		// enable addComment
		if(user) {
			let acButton = document.querySelector('#addCommentButton');
			acButton.classList.remove('disabled');

			acButton.addEventListener('click', addComment, false);
		}

		// load comments
		loadComments();
	}
}

async function addComment(e) {
	e.preventDefault();
	//in theory not needed but lets be careful
	if(!user) return;
	let comment = document.querySelector('#comments');
	let text = comment.value.trim();
	if(text === '') { alert('Please enter a comment first.'); return; }

	let commentOb = {
		text:text,
		film:window.filmId
	}

	let resp = await fetch('/.netlify/functions/postComment', {
		method:'post',
		headers: {
			'Authorization':'Bearer ' + user.token.access_token
		},
		body: JSON.stringify(commentOb)
	});

	comment.value = '';
	loadComments();
}

async function loadComments() {
	let resp = await fetch('/.netlify/functions/getComments?film='+window.filmId);
	let data = await resp.json();
	console.log(data);
	let s = '';
	data.forEach(c => {
		date = dateFormat(c.posted);
		s += `
<p>
<b>Comment posted by ${c.user.name} on ${date}</b><br/>
${c.text}
</p>
		`;
	});
	document.querySelector('#commentList').innerHTML = s;
}

function dateFormat(s) {
	if(!window.Intl) return s;

	// convert to date
	if(!(s instanceof Date)) {
		let orig = s;
		s = new Date(s);
		if(s == 'Invalid Date') return orig;
	}

	options = {
		year: 'numeric', month: 'numeric', day: 'numeric',
		hour: 'numeric', minute: 'numeric', second: 'numeric',
		hour12: false 
	};

	return new Intl.DateTimeFormat('en-US',options).format(s);	
}