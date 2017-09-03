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
    queryShelterAnimals: {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        format: 'json',
        id: null,
        status: 'A',
        output: 'full'
    },
    route: 'start',
    data: null,
    shelterListData: null,
    shelterData: null,
    breed_data: null,
    breeds_arr: [],
    breeds_autocomplete: {list: {match: {enabled: true}}},
    petfinder_search_url: 'https://api.petfinder.com/',
    method: null,
    breed_method: 'breed.list'
};

const PAGE_VIEWS = {
    'start': $('.js-start-modal-container'),
    'dog-results': $('.js-results'),
    'shelter-list': $('.js-results-shelters'),
    'shelter-animals': $('.js-results-shelter-animals'),
    'single-animal': $('.js-results-single')
};

function renderProjectPaws(currentRoute, elements) {
    Object.keys(elements).forEach(function(route) {
        elements[route].hide();
    });
    elements[currentRoute].show();
}
 
$('.js-button--start').click(event => {
    $('.js-start-modal--container').hide();
});

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
    STATE.breeds_arr = buildBreedsArr();
    STATE.breeds_autocomplete.data = STATE.breeds_arr;
    $("#filters__breed--1").easyAutocomplete(STATE.breeds_autocomplete);
    $("#filters__breed--2").easyAutocomplete(STATE.breeds_autocomplete);
};

function buildBreedsArr() {
    const results = STATE.breed_data.petfinder.breeds.breed; 
    const breedsArr = [];
    results.map(function(item){
        return breedsArr.push(item.$t);
    })
    return breedsArr;
}

function getDataFromAPI(method, callback) {
    const breedParams = joinBreeds();
    let apiURL = STATE.petfinder_search_url + method + "?callback=?" + `&${breedParams}&`;
    $.getJSON(apiURL, STATE.query, callback);
  };

function getShelterListFromAPI(method, callback) {
    let apiURL = STATE.petfinder_search_url + method + "?callback=?";
    $.getJSON(apiURL, STATE.queryShelter, callback);
};

function getShelterDataFromAPI(method, callback) {
    let apiURL = STATE.petfinder_search_url + method + "?callback=?";
    $.getJSON(apiURL, STATE.queryShelterAnimals, callback);
};

function joinBreeds() {
	let breedParams = STATE.query.breed.map(function(item){
        return `breed=${item}`;
    })
	return breedParams.join('&');
};

function handleFindShelterSubmit() {
    $('.js-search-form--shelter').submit(event => {
        event.preventDefault();
        STATE.method = 'shelter.find';
        STATE.queryShelter.location = $('#search_form--shelter-location').val();
        getShelterListFromAPI(STATE.method, displayShelterList);
        handleQueryShelterReset();
    })
};

function handlePetFindSubmit(event) {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        STATE.method = 'pet.find';
        STATE.query.location = $('#search_form--location').val();
        filterPetFindSubmit(event);
        getDataFromAPI(STATE.method, displayPetfinderData);
        handleQueryReset();
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
    STATE.route = 'dog-results';
    const results = data.petfinder.pets.pet.map((item, index) => {
        return renderPetResults(item);
    });
    $('.js-results').html(results);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
    console.log(STATE.data);
};

function renderPetResults(result) {
    let gender = '';
    let breed = '';
    let images = displayImages(result);
    if(result.sex.$t === 'F') {
        gender = 'Female';
    }
    if(result.sex.$t === 'M') {
        gender = 'Male';
    }
    if(Array.isArray(result.breeds.breed)) {
        breed = `${result.breeds.breed[0].$t} & ${result.breeds.breed[1].$t}`;
    } else {
        breed = result.breeds.breed.$t;
    }
    
    return `
    <div class="result-dog">
        <h3 id="${result.id.$t}" class="animal-name">${result.name.$t}</h3>
        <div class="img-thumbnails">
        ${images}
        </div>
        <p>${gender} ${breed} <i class="fa fa-paw" aria-hidden="true"></i> ${result.contact.city.$t}, 
        ${result.contact.state.$t}</p>
    </div>
    `;
}

function displayImages(images) {
    if (!images.media.photos) {
        return `<img src="http://via.placeholder.com/350x150" alt="no image available" />`
    };
    let photoSrc = images.media.photos.photo.filter(pic => pic['@size'] === 'fpm').map((item, index) => {
        return `<img src="${item.$t} alt="${images.name.$t}"/>`;
    });
    return photoSrc.join(' ');
}

function displayShelterList(data) {
    STATE.shelterListData = data;
    STATE.route = 'shelter-list';
    const results = data.petfinder.shelters.shelter.map((item, index) => {
        return renderShelterList(item);
    });
    $('.js-results-shelters').html(results);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
};

function displayShelterData(data) {
    STATE.shelterData = data;
    STATE.route = 'shelter-animals';
    const pets = data.petfinder.pets.pet;
    let results = null;
    if (Array.isArray(pets)) {
        results = data.petfinder.pets.pet.map((item, index) => {
            return renderPetResults(item);
        });
    } else {
        results = [renderPetResults(pets)];
    }
    $('.js-results-shelter-animals').html(`${results.join('')} <button class="js-return-shelter-list button-return">Return to Shelter Result List</button>`);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
    // console.log(STATE.shelterData);
};

function renderShelterList(result) {
    return `
    <div class="result-shelter">
        <h3 id="${result.id.$t}" class="result-shelter-name">${result.name.$t}</h3>
        <p>${result.city.$t}, ${result.state.$t} <i class="fa fa-paw" aria-hidden="true"></i> ${result.phone.$t}</p>
    </div>
    `;
};

$('.js-results-shelters').on('click', 'h3', event => {
    let shelterName = $(event.currentTarget).text().split(' ').join('');
    STATE.queryShelterAnimals.id = $(event.currentTarget).attr('id');
    STATE.method = 'shelter.getPets';
    history.pushState({}, "name_of_shelter", `${shelterName}`);
    getShelterDataFromAPI(STATE.method, displayShelterData);
});

$('.js-results-shelter-animals').on('click', '.js-return-shelter-list', event => {
    STATE.route = 'shelter-list';
    history.pushState({}, "home", '/');
    renderProjectPaws(STATE.route, PAGE_VIEWS);
});

$(document).ready(function() {
    getBreedsFromAPI(renderBreedList);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
    handlePetFindSubmit();
    handleFindShelterSubmit();
    handleRandomDogSubmit();
});