describe('searchShows() tests', () => {
	it('should return an array of shows with id', async function() {
		let res = await searchShows('Game of Thrones');
		expect(res[0].id).toEqual(82);
	});
	it('should return an array of shows with name', async function() {
		let res = await searchShows('Downton Abbey');
		expect(res[0].name).toEqual('Downton Abbey');
	});
	it('should return an array of shows with summary', async function() {
		let res = await searchShows('Golden Girls');
		expect(res[0].summary).toEqual(
			'<p><b>The Golden Girls</b> follows four South Florida seniors sharing a house, their dreams, and a whole lot of cheesecake. Bright, promiscuous, clueless, and hilarious, these lovely mismatched ladies form the perfect circle of friends.</p>'
		);
	});
	it('should return an array of shows with image url', async function() {
		let res = await searchShows('Rick and Morty');
		expect(res[0].image).toEqual('http://static.tvmaze.com/uploads/images/original_untouched/1/3603.jpg');
	});
});

describe('populateShows() tests', () => {
	const showsArray = [
		{
			id      : 1,
			image   : 'link',
			name    : 'Name 1',
			summary : 'Summary 1'
		},
		{
			id      : 2,
			image   : 'https://tinyurl.com/tv-missing',
			name    : 'Name 2',
			summary : 'Summary 2'
		},
		{
			id      : 3,
			image   : 'link',
			name    : 'Name 3',
			summary : 'Summary 3'
		}
	];

	beforeAll(() => {
		populateShows(showsArray);
	});

	it('should make a card with data-show-id', function() {
		expect(document.querySelector('.show').getAttribute('data-show-id')).toEqual('1');
	});
	it('should make a card with an image', function() {
		expect(document.querySelectorAll('.card-img-top')[1].src).toEqual('https://tinyurl.com/tv-missing');
	});

	afterAll(function() {
		$('#shows-list').empty();
	});
});

describe('ShowShows() and populateShows() default image test', () => {
	it('should ultimately create a card with default image url if no image is provided', async function() {
		let res = await searchShows('Game of Thrones');
		populateShows(res);
		expect(res[1].image).toEqual('https://tinyurl.com/tv-missing');
	});
	afterAll(function() {
		$('#shows-list').empty();
	});
});
