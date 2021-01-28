/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/* ******************************************************************
--------------------------- searchShows() ---------------------------
****************************************************************** */
/* DESCRIPTION:
--> given a search criteria, creates an array of show objects based on API responses.     */

async function searchShows(q) {
	const res = await axios.get('http://api.tvmaze.com/search/shows', { params: { q } });
	populateShows(
		res.data.reduce(function(showsArr, nextShow) {
      
      let imageUrl
      nextShow.show.image === null ? (imageUrl = 'https://tinyurl.com/tv-missing') : (imageUrl = nextShow.show.image.original);

			showsArr.push({
				id      : nextShow.show.id,
				name    : nextShow.show.name,
				summary : nextShow.show.summary,
				image   : imageUrl
			});
			return showsArr;
		}, [])
	);
}

/* ******************************************************************
------------------------- populateShows() ---------------------------
****************************************************************** */

/* DESCRIPTION:
--> given an array of show objects from searchShows(), populates the DOM with a card for each show object.     */

function populateShows(shows) {

  // clear any existing content in shows list div
	const $showsList = $('#shows-list');
	$showsList.empty();

  // create new show card for each show object of the array passed from seachShows()
	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
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

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
}
