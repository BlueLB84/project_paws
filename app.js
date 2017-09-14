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
    randomDogData: null,
    petfinder_search_url: 'https://api.petfinder.com/',
    method: null,
    breed_method: 'breed.list'
};

window.onpopstate = function(event) {
    let change = false;
    if(document.location.pathname === '/shelter-list' ) {
        STATE.route = 'shelter-list';
        change = true;
    } else if(document.location.pathname === '/project_paws/' || document.location.pathname === '/' || document.location.pathname === '/index.html') {
        STATE.route = 'start';
        change = true;
    } else if(document.location.pathname === `/shelter-list/${STATE.queryShelterAnimals.id}`) {
        STATE.route = 'shelter-animals';
        change = true;
    } else if(document.location.pathname === `/${STATE.randomDogData.petfinder.pet.name.$t}-${STATE.randomDogData.petfinder.pet.id.$t}`) {
        STATE.route = 'single-animal';
        change = true;
    }
    if(change === true) {
        renderProjectPaws(STATE.route, PAGE_VIEWS);
    };
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
    };
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
    });
    return breedsArr;
};

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
        history.pushState({},'shelter-list','shelter-list');
        handleQueryShelterReset();
        $($('html, body')).animate({scrollTop: $('#snap-to-results').offset().top -30 }, 'slow');
    });
};

function handlePetFindSubmit(event) {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        STATE.method = 'pet.find';
        STATE.query.location = $('#search_form--location').val();
        filterPetFindSubmit(event);
        getDataFromAPI(STATE.method, displayPetfinderData);
        $('#search_form--location').val('');
        history.pushState({},'dog-search-results',`/${STATE.query.location.split(', ').splice(0,2).join('-')}-search-results`);
        handleQueryReset();
        $('html, body').animate({scrollTop: $('#snap-to-results').offset().top -30 }, 'slow');
    });
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
        $('html, body').animate({scrollTop: $('#snap-to-results').offset().top -30 }, 'slow');
    });
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
    };
};

function handleQueryShelterReset() {
    STATE.queryShelter = {
        key: 'ba13b6abb4f8162d2d70780f5d2a8d35',
        format: 'json',
        location: null
    };
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
    $('.js-results').html(`${results.join('')} <button class="js-return-home button-return">Return Home</button>`);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
};

function displayRandomDogData(data) {
    STATE.randomDogData = data;
    STATE.route = 'single-animal';
    const results = renderPetResults(data.petfinder.pet);
    history.pushState({},'random-dog',`/${STATE.randomDogData.petfinder.pet.name.$t}-${STATE.randomDogData.petfinder.pet.id.$t}`);
    $('.js-results-single').html(`${results} <button class="js-return-home button-return">Return Home</button>`);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
};

function filterGenderResults(result) {
    if(result.sex.$t === 'F') {
        return 'Female';
    } else if(result.sex.$t === 'M') {
        return 'Male';
    };
};

function filterBreedResults(result) {
    if(Array.isArray(result.breeds.breed)) {
        return `${result.breeds.breed[0].$t} & ${result.breeds.breed[1].$t}`;
    } else {
        return `${result.breeds.breed.$t}`;
    };
};

function filterDescriptionResults(result) {
    if(!('$t' in result.description)) {
        return 'Description not available <i class="fa fa-paw" aria-hidden="true"></i>';
    } else {
        return `${result.description.$t}`;
    };
};

function filterEmailResults(result) {
    if(!result.contact.email || !('$t' in result.contact.email)) {
        return `<span class="noEmail">Email Not Available</span>`;
    } else {
        return `<a href="mailto:${result.contact.email.$t}" class="email">${result.contact.email.$t}</a>`;
    };
};

function filterPhoneResults(result) {
    if(!('$t' in result.contact.phone)) {
        return 'Phone Number Not Available';
    } else {
        return `${result.contact.phone.$t}`;
    };
};

function renderPetResults(result) {
    if (result === undefined) {
        return `<div class="result-dog">
        <h2>Sorry! There are no results <i class="fa fa-paw" aria-hidden="true"></i></h2>
        <figure>
        <img src="https://instagram.fbed1-1.fna.fbcdn.net/t51.2885-15/e35/21042858_888812944628301_793959712944029696_n.jpg" alt="Chief sleeping from Instagram @chiefandzoe" />
        <figcaption>A sleeping Chief. <i class="fa fa-instagram" aria-hidden="true"></i>&nbsp;<a href="https://www.instagram.com/chiefandzoe/" target="_blank" class="instagram"> @chiefandzoe</a></figcaption>
        </figure>
        </div>`
    } else {
        const gender = filterGenderResults(result);
        const breed = filterBreedResults(result);
        const description = filterDescriptionResults(result);
        const email = filterEmailResults(result);
        const phone = filterPhoneResults(result);
        const images = displayImages(result);
        let thumbnailImgs = '';
        let heroImg = images;
        if(Array.isArray(images) && images.length > 1) {
            thumbnailImgs = `<div class="thumbnails">${images.join(' ')}</div>`;
            heroImg = images[0];
        };
        return `
        <div class="result-dog">
            <h3 class="animal-name">${result.name.$t}</h3>
            <p>${gender} ${result.age.$t} ${breed} <i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;${result.contact.city.$t}, 
            ${result.contact.state.$t}<br>
            <i class="fa fa-phone" aria-hidden="true"></i>&nbsp;${phone} <i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;${email}
            </p>
            <div class="js-image-block">
            <div class="hero">
            ${heroImg}
            </div>
            ${thumbnailImgs}
            </div>
            <button class="js-petfinder-id button-petfinder" id="${result.id.$t}">See Me On Petfinder</button>
            <p>${description}</p>
        </div>
        `;
    };
};

function displayImages(result) {
    if(!result.media || !result.media.photos) {
        return `<figure>
        <img src="../images/zoe-no-image.jpg" alt="no image available" />
        <figcaption>Zoe <i class="fa fa-instagram" aria-hidden="true"></i>&nbsp;<a href="https://www.instagram.com/chiefandzoe/" target="_blank" class="instagram">@chiefandzoe </a> </figcaption>
        </figure>`
    } else {
        return result.media.photos.photo.filter(pic => pic['@size'] === 'pn').map((item, index) => {
            return `<a class="thumbnail" href="javascript:void(0);"><img src="${item.$t}" alt=${result.name.$t} index="${index}"/></a>`;
        });
    };
};

function handleThumbnailClicks() {
    $('.js-results, .js-results-shelter-animals, .js-results-single').on('click', '.thumbnail', function(event) {
        const imgSrc = $(event.currentTarget).find('img').attr('src');
        const imgAlt = $(event.currentTarget).find('img').attr('alt');
        $(event.currentTarget).closest('.js-image-block').find('.hero img').attr('src', imgSrc).attr('alt', imgAlt);
    });
};

$('.results-area').on('click', '.js-petfinder-id', event => {
    event.preventDefault();
    let petID = event.target.id;
    console.log(petID);
    window.open(`https://www.petfinder.com/petdetail/${petID}`, '_blank');
});

$('.js-results-single, .js-results').on('click', '.js-return-home', event => {
    STATE.route = 'start';
    history.replaceState({},'home','/project_paws');
    renderProjectPaws(STATE.route, PAGE_VIEWS);
    $('html, body').animate({scrollTop: $('body').offset().top -20 }, 'slow');
});

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
    };
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
    };
    if (!result.email || !('$t' in result.email)) {
        email = `<span class="noEmail">Email Not Available</span>`;
    } else {
        email = `<a href="mailto:${result.email.$t}" class="email">${result.email.$t}</a>`;
    };
    return `
    <div class="result-shelter">
        <h3 id="${result.id.$t}" class="result-shelter-name" tabindex="0">${result.name.$t}</h3>
        <p><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;${result.city.$t}, ${result.state.$t} <i class="fa fa-phone" aria-hidden="true"></i>&nbsp;${phoneNumber} <i class="fa fa-envelope" aria-hidden="true"></i>&nbsp;${email}</p>
    </div>
    `;
};

function handleShelterNameClick(event) {
    let shelterName = $(event.currentTarget).text().split(' ').join('');
    STATE.queryShelterAnimals.id = $(event.currentTarget).attr('id');
    STATE.method = 'shelter.getPets';
    history.pushState({},'shelter-name',`shelter-list/${STATE.queryShelterAnimals.id}`);
    getShelterDataFromAPI(STATE.method, displayShelterData);
    $('html, body').animate({scrollTop: $('#snap-to-results').offset().top -30 }, 'slow');
}
    $('.js-results-shelters').on('click', 'h3', event => {
        handleShelterNameClick(event);
    });


$('.js-results-shelters').on('keydown', 'h3', event => {
    if(event.which == 13) {
        handleShelterNameClick(event);
    }
    if(event.which == 32) {
        handleShelterNameClick(event);
    }
});

$('.js-results-shelters').on('focus','.result-shelter-name', event => {
    $(event.currentTarget).addClass('result-shelter-name-focus');
    $(event.currentTarget).on('blur', event => {
        $(event.currentTarget).removeClass('result-shelter-name-focus');
    })
});

$('.js-results-shelter-animals').on('click', '.js-return-shelter-list', event => {
    STATE.route = 'shelter-list';
    history.back();
    renderProjectPaws(STATE.route, PAGE_VIEWS);
});

$(document).ready(function() {
    getBreedsFromAPI(renderBreedList);
    renderProjectPaws(STATE.route, PAGE_VIEWS);
    handlePetFindSubmit();
    handleFindShelterSubmit();
    handleRandomDogSubmit();
    handleThumbnailClicks();
    handleShelterNameClick();   
});