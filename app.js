const STATE = {
    query: {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: 'dog',
        output: 'full',
        format: 'json',
        location: null,
        sex: null,
        size: null,
        age: null,
        breed: [null,null] 
    },
    queryShelter: {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        format: 'json',
        location: null
    },
    data: null,
    breed_data: null,
    breeds_arr: [],
    breeds_autocomplete: {list: {match: {enabled: true}}},
    petfinder_search_url: 'https://api.petfinder.com/',
    method: null,
    breed_method: 'breed.list'
};
 
function getBreedsFromAPI(callback) {
    const query = {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: 'dog',
        format: 'json' 
    }
    const apiURL = STATE.petfinder_search_url + STATE.breed_method + "?callback=?";
    $.getJSON(apiURL, query, callback);
};

function renderBreedList(data) {
    STATE.breed_data = data;
    const results = buildBreedsArr();
    STATE.breeds_arr = results;
    STATE.breeds_autocomplete.data = STATE.breeds_arr;
    $("#filters__breed--1").easyAutocomplete(STATE.breeds_autocomplete);
    $("#filters__breed--2").easyAutocomplete(STATE.breeds_autocomplete);
};

function buildBreedsArr() {
    const results = STATE.breed_data.petfinder.breeds.breed; 
    const breedsArr = [];
    let breedsArrMaker = results.map(function(item){
        return breedsArr.push(item.$t);
    })
    return breedsArr;
}

function getDataFromAPI(method, callback) {
    const breedParams = joinBreeds();
    let apiURL = STATE.petfinder_search_url + method + "?callback=?" + `&${breedParams}&`;
    $.getJSON(apiURL, STATE.query, callback);
  };

function getShelterDataFromAPI(method, callback) {
    let apiURL = STATE.petfinder_search_url + method + "?callback=?";
    $.getJSON(apiURL, STATE.queryShelter, callback);
};

function joinBreeds() {
	let breedParams = STATE.query.breed.map(function(item){
        return `breed=${item}`;
    })
	return breedParams.join('&');
};

function handlePetFindSubmit(event) {
    $('.js-search-form').on('click','.js-button--dogs',event => {
        event.preventDefault();
        STATE.method = 'pet.find';
        const queryLocation = $(event.currentTarget).parent().find('.js-search-location');
        const locationVal = queryLocation.val();
        if (locationVal === '') {
            alert('Please enter a location.');
            $('.js-search-location').focus();
        } else {
            STATE.query.location = locationVal;
            const currentEvent = event;
            filterPetFindSubmit(currentEvent);
            getDataFromAPI(STATE.method, displayPetfinderData);
        }
        handleQueryReset();
    })
};

function handleFindShelterSubmit() {
    $('.js-search-form').on('click','.js-button--shelters', event => {
        event.preventDefault();
        STATE.method = 'shelter.find';
        const queryLocation = $(event.currentTarget).parent().find('.js-search-location');
        const locationVal = queryLocation.val();
        const method = STATE.method;
        if (locationVal === '') {
            alert('Please enter a location.');
            $('.js-search-location').focus();
        } else {
            STATE.queryShelter.location = locationVal;
            getShelterDataFromAPI(method, displayPetfinderData);
        }
        handleQueryShelterReset();
    })
};

function handleRandomDogSubmit() {
    $('.js-search-form').on('click', '.js-button--random', event => {
        event.preventDefault();
        STATE.method = 'pet.getRandom';
        const currentEvent = event;
        const queryLocation = $(event.currentTarget).parent().find('.js-search-location');
        const locationVal = queryLocation.val();
        if (locationVal === '') {
            STATE.query.location = null;
            filterPetFindSubmit(currentEvent);
            STATE.query.age = null;
            getDataFromAPI(STATE.method, displayPetfinderData);
        } else {
            STATE.query.location = locationVal;
            filterPetFindSubmit(currentEvent);
            STATE.query.age = null;
            getDataFromAPI(STATE.method, displayPetfinderData);
        }
        handleQueryReset();
    })
};

$('.js-search-form').on('click', '.js-button--reset', event => {
    handleQueryReset();
    handleQueryShelterReset();
});

function handleQueryReset() {
    STATE.query = {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: 'dog',
        output: 'full',
        format: 'json',
        location: null,
        sex: null,
        size: null,
        age: null,
        breed: [null,null] 
    }
};

function handleQueryShelterReset() {
    STATE.queryShelter = {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        format: 'json',
        location: null
    }
};

function filterPetFindSubmit(event) {
    STATE.query.breed[0] = $('#filters__breed--1').val();
    STATE.query.breed[1] = $('#filters__breed--2').val();
    const querySizeVal = $('#filters__sexAgeSize--size').val();
    STATE.query.size = querySizeVal;
    const queryAgeVal = $('#filters__sexAgeSize--age').val();
    STATE.query.age = queryAgeVal;
    const querySexVal = $('#filters__sexAgeSize--sex').val();
    STATE.query.sex = querySexVal;
};

function displayPetfinderData(data) {
    STATE.data = data;
    console.log(STATE.data);
};

function functionHandlers() {
    getBreedsFromAPI(renderBreedList);
    handlePetFindSubmit();
    handleFindShelterSubmit();
    handleRandomDogSubmit();
};

function testAPI() {
    functionHandlers();
};

$(document).ready(testAPI);