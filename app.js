const STATE = {
    data: null,
    query: {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: 'dog',
        location: 'acton,ma',
        output: null,
        format: 'json',
    },
    petfinder_search_url: 'https://api.petfinder.com/',
    method: 'pet.find'
}

function getDataFromAPI(callback) {
    
    let apiURL = STATE.petfinder_search_url + STATE.method + "?callback=?";
    $.getJSON(apiURL, STATE.query, callback);
  };

//   'https://api.petfinder.com/pet.find?format=json&key=ba13b6abb4f8162d2d70780f5d2a8d35&location=acton,ma&callback=?'

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