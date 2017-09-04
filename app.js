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
    'start': $('.js-start'),
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
 

// GOOGLE MAPS AUTOCOMPLETE 
function autocompleteLocations() {
    let input = document.getElementById('search_form--shelter-location');
    let input2 = document.getElementById('search_form--location');
    let opts = {
        types: ['(cities)']
      };
    let autocomplete = new google.maps.places.Autocomplete(input, opts);
    let autocomplete2 = new google.maps.places.Autocomplete(input2, opts);
    autocomplete.setComponentRestrictions(
        {'country': 'us'});
    autocomplete2.setComponentRestrictions(
        {'country': 'us'});
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
        $('#search_form--shelter-location').val('');
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
        $('#search_form--location').val('');
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
            getDataFromAPI(STATE.method, displayRandomDogData);
        } else {
            STATE.query.location = locationVal;
            filterPetFindSubmit(currentEvent);
            STATE.query.age = null;
            getDataFromAPI(STATE.method, displayRandomDogData);
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
};

function displayRandomDogData(data) {
    STATE.data = data;
    STATE.route = 'single-animal';
    const results = renderPetResults(data.petfinder.pet);
    $('.js-results-single').html(results);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
};

function renderPetResults(result) {
    if (result === undefined) {
        return `<div class="result-dog">
        <h2>Sorry! There are no results <i class="fa fa-paw" aria-hidden="true"></i></h2>
        <figure>
        <img src="images/chief_sleeping.jpg" alt="Chief sleeping from Instagram @chiefandzoe" />
        <figcaption>A sleeping Chief. <i class="fa fa-instagram" aria-hidden="true"></i> <a href="https://www.instagram.com/chiefandzoe/" target="_blank" class="instagram"> @chiefandzoe</a></figcaption>
        </figure>
        </div>`
    }
    let gender = '';
    let breed = '';
    const images = displayImages(result);
    const thumbnailImgs = images.join(' ');
    let heroImg = images[0];
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
    if (!('$t' in result.contact.phone)) {
        phoneNumber = 'Phone Number Not Available';
    } else {
        phoneNumber = result.contact.phone.$t;
    }
    if (!result.contact.email || !('$t' in result.contact.email)) {
        email = 'Email Not Available';
    } else {
        email = result.contact.email.$t
    }
    
    return `
    <div class="result-dog">
        <h3 id="${result.id.$t}" class="animal-name">${result.name.$t}</h3>
        <p>${gender} ${result.age.$t} ${breed} <i class="fa fa-map-marker" aria-hidden="true"></i> ${result.contact.city.$t}, 
        ${result.contact.state.$t}<br>
        <i class="fa fa-phone" aria-hidden="true"></i> ${phoneNumber}  <i class="fa fa-envelope" aria-hidden="true"></i> ${email}
        </p>
        <div class="js-image-block">
        <div class="hero">
        ${heroImg}
        </div>
        <div class="thumbnails">
        ${thumbnailImgs}
        </div>
        </div>
        <p>${result.description.$t}</p>
    </div>
    `;
}

function displayImages(images) {
    if(!images || !images.media.photos) {
        return `<figure>
        <img src="images/zoe_no_image.jpg" alt="no image available" />
        <figcaption>Zoe <i class="fa fa-instagram" aria-hidden="true"></i> <a href="https://www.instagram.com/chiefandzoe/" target="_blank">@chiefandzoe class="instagram"</a> </figcaption>
        </figure>`
    };
    let photoSrc = images.media.photos.photo.filter(pic => pic['@size'] === 'pn').map((item, index) => {
        return `<a class="thumbnail" href="javascript:void(0);"><img src="${item.$t} alt="${images.name.$t}" index="${index}"/></a>`;
    });
    return photoSrc;
}

function handleThumbnailClicks() {
    $('.js-results, .js-results-shelter-animals, .js-results-single').on('click', '.thumbnail', function(event) {
        const imgSrc = $(event.currentTarget).find('img').attr('src');
        const imgAlt = $(event.currentTarget).find('img').attr('alt');
        $(event.currentTarget).closest('.js-image-block').find('.hero img').attr('src', imgSrc).attr('alt', imgAlt);
    });
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
};

function renderShelterList(result) {
    let phoneNumber = null;
    let email = null;
    if (!('$t' in result.phone)) {
        phoneNumber = 'Phone Number Not Available';
    } else {
        phoneNumber = result.phone.$t;
    }
    if (!result.email || !('$t' in result.email)) {
        email = 'Email Not Available';
    } else {
        email = result.email.$t
    }
    return `
    <div class="result-shelter">
        <h3 id="${result.id.$t}" class="result-shelter-name">${result.name.$t}</h3>
        <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${result.city.$t}, ${result.state.$t} <i class="fa fa-phone" aria-hidden="true"></i> ${phoneNumber} <i class="fa fa-envelope" aria-hidden="true"></i> ${email}</p>
    </div>
    `;
};

$('.js-results-shelters').on('click', 'h3', event => {
    let shelterName = $(event.currentTarget).text().split(' ').join('');
    STATE.queryShelterAnimals.id = $(event.currentTarget).attr('id');
    STATE.method = 'shelter.getPets';
    getShelterDataFromAPI(STATE.method, displayShelterData);
});

$('.js-results-shelter-animals').on('click', '.js-return-shelter-list', event => {
    STATE.route = 'shelter-list';
    renderProjectPaws(STATE.route, PAGE_VIEWS);
});

$(document).ready(function() {
    getBreedsFromAPI(renderBreedList);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
    handlePetFindSubmit();
    handleFindShelterSubmit();
    handleRandomDogSubmit();
    handleThumbnailClicks();
});