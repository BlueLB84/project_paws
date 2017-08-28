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
        breed1: null,
        breed2: null  
    },
    petfinder_search_url: 'https://api.petfinder.com/',
    method: null
}
 
function getDataFromAPI(method, callback) {
    let apiURL = STATE.petfinder_search_url + method + "?callback=?";
    $.getJSON(apiURL, STATE.query, callback);
  };

function displayPetfinderData(data) {
    STATE.data = data;
    console.log(data);
    // const results = `<div><p>${STATE.data.explanation}</p><img src="${STATE.data.hdurl}" /></div>`;
    // $('.js-results').html(results);
}



function handlePetFindSubmit(event) {
    $('.js-search-form').on('click','.js-button--dogs',event => {
        event.preventDefault();
        const queryLocation = $(event.currentTarget).parent().find('.js-search-location');
        const locationVal = queryLocation.val();
        // STATE.method = 'pet.find';
        // const method = STATE.method;
        if (locationVal === '') {
            alert('Please enter a location.');
            $('.js-search-location').focus();
        } else {
            const currentEvent = event;
            filterPetFindSubmit(currentEvent,locationVal);
            // STATE.query.location = locationVal;
            queryLocation.val('');
            getDataFromAPI(STATE.method, displayPetfinderData);
        }
    })
}

function filterPetFindSubmit(event, location) {
    STATE.query.location = location;
    STATE.method = 'pet.find';
    const queryBreed1 = $(event.currentTarget).parent().find('#filters__breed--1');
    const queryBreed1Val = queryBreed1.val();
    STATE.query.breed1 = queryBreed1Val;
    const queryBreed2 = $(event.currentTarget).parent().find('#filters__breed--2');
    const queryBreed2Val = queryBreed2.val();
    STATE.query.breed2 = queryBreed2Val;
    const querySize = $(event.currentTarget).parent().find('#filters__sexAgeSize--size');
    const querySizeVal = querySize.val();
    STATE.query.size = querySizeVal;
    const queryAge = $(event.currentTarget).parent().find('#filters__sexAgeSize--age');
    const queryAgeVal = queryAge.val();
    STATE.query.age = queryAgeVal;
    const querySex = $(event.currentTarget).parent().find('#filters__sexAgeSize--sex');
    const querySexVal = querySex.val();
    STATE.query.sex = querySexVal;
}

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
            STATE.query.location = locationVal;
            queryLocation.val('');
            getDataFromAPI(method, displayPetfinderData);
        }
    })
}

function handleRandomDogSubmit() {
    $('.js-search-form').on('click', '.js-button--random', event => {
        event.preventDefault();
        console.log(STATE.query.location);
        STATE.method = 'pet.getRandom';
        const method = STATE.method;
        getDataFromAPI(method, displayPetfinderData);
    })
}

function submitFunctionHandlers() {
    handlePetFindSubmit();
    handleFindShelterSubmit();
    handleRandomDogSubmit();
}

function testAPI() {
    submitFunctionHandlers();
}

$(document).ready(testAPI);