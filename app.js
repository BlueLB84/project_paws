const STATE = {
    data: null,
    query: {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        animal: 'dog',
        location: 'action, ma',
        // breed1: null,
        // breed2: null,
        // sex1: null,
        // sex2: null,
        // size: null,
        // age: null,
        // id: null,
        output: 'basic',
        format: 'json',
    },
    petfinder_search_url: 'http://api.petfinder.com/',
    method: 'pet.find'
}

function getDataFromAPI(method, callback) {
    STATE.method = method;
    let apiURL = STATE.petfinder_search_url + `${STATE.method}`;
    $.getJSON(apiURL, STATE.query, callback);
}

console.log(getDataFromAPI('pet.find', displayPetfinderData));

function displayPetfinderData(data) {
    STATE.data = data;
    const results = data.pet.map((item, index) => {
        return renderDataResults(item);
    })
    console.log(results);
}

function renderDataResults(result) {
    return `${result.name}`
}