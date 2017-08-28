const STATE = {
    data: null,
    query: {
        api_key: 'DEMO_KEY',
        // animal: 'dog',
        // location: 'acton, ma',
        // callback: '?',
        // output: 'basic',
        // format: 'json',
    },
    petfinder_search_url: 'https://api.nasa.gov/planetary/apod?',
    // method: 'pet.find'
}

function getDataFromAPI(callback) {
    // let apiURL = STATE.petfinder_search_url + STATE.query.api_key;
    // $.getJSON('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', callback);
    $.getJSON('https://api.petfinder.com/pet.find?format=json&key=ba13b6abb4f8162d2d70780f5d2a8d35&location=acton,ma&callback=?', callback);
  };

function displayPetfinderData(data) {
    STATE.data = data;
    console.log(data);
    // const results = `<div><p>${STATE.data.explanation}</p><img src="${STATE.data.hdurl}" /></div>`;
    // $('.js-results').html(results);
}


function testAPI() {
    getDataFromAPI(displayPetfinderData);
}

$(document).ready(testAPI);