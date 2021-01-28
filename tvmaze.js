/********************************************************************
--------------------------- searchShows() ---------------------------
*********************************************************************

 * DESCRIPTION:
 * given a search criteria, creates an array of show objects based on API responses.     */

async function searchShows(q) {
	// send GET request with show seach parameters to API and await show data in response
	const res = await axios.get('http://api.tvmaze.com/search/shows', { params: { q } });

	// reduce results of API request to an array of objects containing show data.
	return res.data.reduce(function(showsArr, nextShow) {
		let imageUrl;
		nextShow.show.image === null
			? (imageUrl = 'https://tinyurl.com/tv-missing')
			: (imageUrl = nextShow.show.image.original);

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
			`<div class="col-md-6 col-lg-3 mb-5 show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
         <button class="btn btn-info episodebutton">Episode Info</button>
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

async function getEpisodes(id) {
	// send GET request with show id parameters to API and await episode data in response
	const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

	// reduce results of API request to an array of objects containing episode data and pass array to populateEpisodes()
	populateEpisodes(
		res.data.reduce(function(episodesArr, nextEpisode) {
			episodesArr.push({
				id          : nextEpisode.id,
				name        : nextEpisode.name,
				summary     : nextEpisode.summary,
				season      : nextEpisode.season,
				number      : nextEpisode.number,
				episodesUrl : nextEpisode.url
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

	// create a new li for each show object in array
	for (let episode of episodes) {
		let itemHtml = `<b>${episode.name}</b>`;

		// build li content based on what information is available in episode object
		if (episode.season !== null || episode.number !== null) itemHtml += ' (';
		if (episode.season !== null) itemHtml += `season ${episode.season}`;
		if (episode.season !== null && episode.number !== null) itemHtml += ', ';
		if (episode.number !== null) itemHtml += `episode ${episode.number}`;
		if (episode.season !== null || episode.number !== null) itemHtml += ')';
		if (episode.summary !== null) itemHtml += `: ${episode.summary}`;
		const $item = `<li class="episode">${itemHtml}</li>`;

		// append new li to episodes list
		$episodesList.append($item);
	}
}

/********************************************************************
---------------------------- When DOM Loads -------------------------
********************************************************************/

/* ADD EVENT LISTENERS TO BUTTONS
 * hide episodes area, get list of matching shows and show in shows list.     */
$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);
	populateShows(shows);

	// adds event listener to all buttons created at the bottom of show cards
	$('.episodebutton').click(function(evt) {
		const showId = evt.target.parentElement.getAttribute('data-show-id');
		getEpisodes(showId);
	});
});

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
	'Battlestar Galactica'
];
function getRandomShow(shows) {
	randomNum = Math.floor(Math.random() * shows.length);
	return shows[randomNum];
}
$('#search-query').val(getRandomShow(randomShows));
