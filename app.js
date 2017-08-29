const STATE = {
    data: null,
    query: {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: 'dog',
        output: 'basic',
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
    petfinder_search_url: 'https://api.petfinder.com/',
    method: null
};
 
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

function displayPetfinderData(data) {
    STATE.data = data;
    console.log(STATE.data);
    // const results = `<div><p>${STATE.data.explanation}</p><img src="${STATE.data.hdurl}" /></div>`;
    // $('.js-results').html(results);
};

function handlePetFindSubmit(event) {
    $('.js-search-form').on('click','.js-button--dogs',event => {
        event.preventDefault();
        const queryLocation = $(event.currentTarget).parent().find('.js-search-location');
        const locationVal = queryLocation.val();
        if (locationVal === '') {
            alert('Please enter a location.');
            $('.js-search-location').focus();
        } else {
            const currentEvent = event;
            filterPetFindSubmit(currentEvent);
            STATE.query.location = locationVal;
            getDataFromAPI(STATE.method, displayPetfinderData);
        }
    })
};

function filterPetFindSubmit(event) {
    STATE.method = 'pet.find';
    const queryBreed1 = $(event.currentTarget).parent().find('#filters__breed--1');
    const queryBreed1Val = queryBreed1.val();
    STATE.query.breed[0] = queryBreed1Val;
    const queryBreed2 = $(event.currentTarget).parent().find('#filters__breed--2');
    const queryBreed2Val = queryBreed2.val();
    STATE.query.breed[1] = queryBreed2Val;
    const querySize = $(event.currentTarget).parent().find('#filters__sexAgeSize--size :selected');
    const querySizeVal = querySize.text();
    filterSizeOptions(querySizeVal);
    const queryAge = $(event.currentTarget).parent().find('#filters__sexAgeSize--age :selected');
    const queryAgeVal = queryAge.text();
    STATE.query.age = queryAgeVal;
    const querySex = $(event.currentTarget).parent().find('#filters__sexAgeSize--sex :selected');
    const querySexVal = querySex.text();
    filterSexOptions(querySexVal);
};

function filterSizeOptions(size) {
    switch(size) {
        case (''):
        STATE.query.size = null;
        break;
        case ('Small'):
        STATE.query.size = 'S';
        break;
        case ('Medium'):
        STATE.query.size = 'M';
        break;
        case ('Large'):
        STATE.query.size = "L";
        break;
        case('Extra-large'):
        STATE.query.size = "XL"
        break;
        default:
        STATE.query.size = null;
        break;
    }
};

function filterSexOptions(sex) {
    switch(sex) {
        case(''):
        STATE.query.sex = null;
        break;
        case ('Male'):
        STATE.query.sex = 'M';
        break;
        case ('Female'):
        STATE.query.sex = 'F';
        break;
        default:
        STATE.query.sex = null;
        break;
    }
};

function handleFindShelterSubmit() {
    $('.js-search-form').on('click','.js-button--shelters', event => {
        event.preventDefault();
        const queryLocation = $(event.currentTarget).parent().find('.js-search-location');
        const locationVal = queryLocation.val();
        STATE.method = 'shelter.find';
        const method = STATE.method;
        if (locationVal === '') {
            alert('Please enter a location.');
            $('.js-search-location').focus();
        } else {
            STATE.queryShelter.location = locationVal;
            queryLocation.val('');
            getShelterDataFromAPI(method, displayPetfinderData);
        }
    })
};

function handleRandomDogSubmit() {
    $('.js-search-form').on('click', '.js-button--random', event => {
        event.preventDefault();
        console.log(STATE.query.location);
        STATE.method = 'pet.getRandom';
        const method = STATE.method;
        // getDataFromAPI(method, displayPetfinderData);
    })
};

function submitFunctionHandlers() {
    handlePetFindSubmit();
    handleFindShelterSubmit();
    handleRandomDogSubmit();
};

function testAPI() {
    submitFunctionHandlers();
};

$(document).ready(testAPI);