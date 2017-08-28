const STATE = {
    data: null,
    query: {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: 'dog',
        location: 'acton, ma',
        callback: '?',
        output: 'basic',
        format: 'json',
    },
    petfinder_search_url: 'https://api.petfinder.com/',
    method: 'pet.find'
}

function getDataFromAPI(callback) {
    let apiURL = STATE.petfinder_search_url + `${STATE.method}`;
    $.getJSON(apiURL, STATE.query, callback).done(function(petApiData) {alert('Data retrieved!')});
  };

function displayPetfinderData(data) {
    STATE.data = data;
    const results = data.pets.map((item, index) => {
        return renderDataResults(item);
    })
    console.log(results);
}

function renderDataResults(result) {
    return `${result.name}`
}

$(getDataFromAPI);