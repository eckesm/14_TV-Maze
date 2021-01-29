/********************************************************************
------------------------------ SETTINGS -----------------------------
****************************************************************** */
const defaultImage = 'https://tinyurl.com/tv-missing';

/********************************************************************
--------------------------- searchShows() ---------------------------
*********************************************************************

 * DESCRIPTION:
 * given a search criteria, creates an array of show objects based on API responses.     */

async function searchShows(q) {
	// send GET request with show seach parameters to API and await show data in response
	const res = await axios.get('https://api.tvmaze.com/search/shows', { params: { q } });

	// reduce results of API request to an array of objects containing show data.
	return res.data.reduce(function(showsArr, nextShow) {
		let imageUrl;
		nextShow.show.image === null ? (imageUrl = defaultImage) : (imageUrl = nextShow.show.image.original);

		showsArr.push({
			id      : nextShow.show.id,
			name    : nextShow.show.name,
			summary : nextShow.show.summary,
			image   : imageUrl
		});
		return showsArr;
	}, []);
}

/********************************************************************
------------------------- populateShows() ---------------------------
*********************************************************************

 * DESCRIPTION:
 * given an array of show objects from searchShows(), populates the DOM with a card for each show object.     */

function populateShows(shows) {
	// clear any existing content in shows list div
	const $showsList = $('#shows-list');
	$showsList.empty();

	// create new show card for each show object of the array passed from seachShows()
	for (let show of shows) {
		const $item = $(
			`<div class="col-md-6 col-lg-3 mb-5 show" data-show-id="${show.id}" data-show-name="${show.name}">
         <div class="card" data-show-id="${show.id}" data-show-name="${show.name}">
           <img class="card-img-top" src="${show.image}">
					 <button class="btn btn-outline-dark episodebutton">Episode List</button>
					 <div class="card-body border">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
					 
				 </div>
       </div>
      `
		);

		// add new show card to shows list div
		$showsList.append($item);
	}
}

/*******************************************************************
 -------------------------- getEpisodes() ---------------------------
 ********************************************************************

 * DESCRIPTION:
 * given a show id, returns an array of episodes of that show.     */

async function getEpisodes(showId, showName) {
	// send GET request with show id parameters to API and await episode data in response
	const res = await axios.get(`https://api.tvmaze.com/shows/${showId}/episodes`);

	// reduce results of API request to an array of objects containing episode data and pass array to populateEpisodes()
	populateEpisodes(
		res.data.reduce(function(episodesArr, nextEpisode) {
			let imageUrl;
			nextEpisode.image === null ? (imageUrl = defaultImage) : (imageUrl = nextEpisode.image.original);

			episodesArr.push({
				id          : nextEpisode.id,
				name        : nextEpisode.name,
				show        : showName,
				summary     : nextEpisode.summary,
				season      : nextEpisode.season,
				number      : nextEpisode.number,
				episodesUrl : nextEpisode.url,
				image       : imageUrl
			});
			return episodesArr;
		}, [])
	);
}

/********************************************************************
 ------------------------- populateEpisodes() -----------------------
 ********************************************************************

 * DESCRIPTION:
 * --> creates a list of episode information from an array of episode objects.     */

function populateEpisodes(episodes) {
	// show episodes area
	const $episodesArea = $('#episodes-area');
	$episodesArea.show();

	// empty episodes list of any existing information
	const $episodesList = $('#episodes-list');
	$episodesList.empty();

	// modal
	const $episodesModalList = $('#episodesModalList');
	$episodesModalList.empty();

	let $episodesModalTitle = $('#episodesModalTitle');
	$episodesModalTitle.text(episodes[0].show);

	// create a new li for each show object in array
	for (let episode of episodes) {
		let itemHtml = `<b class="display-5">${episode.name}</b><br>`;

		// build li content based on what information is available in episode object
		if (episode.season !== null || episode.number !== null) itemHtml += '<p class="fst-italic">';
		if (episode.season !== null) itemHtml += `season ${episode.season}`;
		if (episode.season !== null && episode.number !== null) itemHtml += ', ';
		if (episode.number !== null) itemHtml += `episode ${episode.number}`;
		if (episode.season !== null || episode.number !== null) itemHtml += '</p>';
		if (episode.image !== defaultImage)
			itemHtml += `<img src="${episode.image}" 
		class="img-thumbnail" style="height: 200px"></img>`;
		if (episode.summary !== null) itemHtml += `${episode.summary}`;
		if (episode!== episodes[episodes.length-1]) itemHtml+='<hr>'

		const $item = `<li class="episode">${itemHtml}</li>`;

		// append new li to episodes list
		$episodesList.append($item);

		// append new li to episodes modal
		$episodesModalList.append($item);
	}
}

/********************************************************************
---------------------------- When DOM Loads -------------------------
********************************************************************/

/* ADD EVENT LISTENERS TO BUTTONS
 * hide episodes area, get list of matching shows and show in shows list.     */
$('#search-form').on('submit', function(evt) {
	evt.preventDefault();
	searchInput('search-query');
});

$('#navbarForm').on('submit', function(evt) {
	evt.preventDefault();
	searchInput('navbarSearchQuery');
});

async function searchInput(inputId) {
	let query = $(`#${inputId}`).val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);
	populateShows(shows);

	// adds event listener to all buttons created at the bottom of show cards
	$('.episodebutton').click(function(evt) {
		const showId = evt.target.parentElement.getAttribute('data-show-id');
		const showName = evt.target.parentElement.getAttribute('data-show-name');
		getEpisodes(showId, showName);

		// show episodes modal
		$('#episodesModal').modal('show');
	});
}

/* RANDOM STARTING SHOW IN SEARCH
 * enter a different show on reload.     */
const randomShows = [
	'CSI',
	"Queen's Gambit",
	'Criminal',
	'Game of Thrones',
	'Downton Abbey',
	'Mad Men',
	'Rick and Morty',
	"Bob's Burgers",
	'Haunting of Hill House',
	'Forensic Files',
	'Law & Order',
	'Bones',
	'Bodyguard',
	'The Crown',
	'Pokémon',
	'X-Files',
	'Battlestar Galactica',
	'Evil',
	'Real Housewives',
	'Attack on Titan',
	'Golden Girls',
	'Rachel Maddow',
	'Big Little Lies'
];
function getRandomShow(shows) {
	randomNum = Math.floor(Math.random() * shows.length);
	return shows[randomNum];
}
// $('#search-query').val(getRandomShow(randomShows));
$('#navbarSearchQuery').val(getRandomShow(randomShows));
