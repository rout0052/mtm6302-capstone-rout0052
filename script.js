// Set up elements for the date input form 
const $dateInput = document.getElementById('date');
const $dateSubmit = document.getElementById('dateSubmit');

// This variable will be used later to save the current APOD being displayed date to access information about it globally 
let displayedDate;

// This variable will be used later to access the APOD object currently be shown to be used globally
let displayedAPOD;

// Gets todays date to use to set the default and maximum value for the date submitted.
let $todaysDate = new Date();
// Formats today's date into the YYYY-MM-DD format
let $todayFormatted = $todaysDate.getFullYear() + "-" + ($todaysDate.getMonth() + 1) + "-" + $todaysDate.getDate();
// Sets the maximum value of the input to today's formatted date 
$dateInput.setAttribute('max', $todayFormatted);
// Sets the default value of the input to today's formatted date
$dateInput.setAttribute('value', $todayFormatted);


// Variables storing elements of the image display section
const $displayImgContainer = document.querySelector('div.displayImgContainer');
const $displayImg = document.getElementById('displayImg');
const $favouriteSymbol = document.querySelector('div.displayImgContainer button i#favourite');
const $imgTitle = document.getElementById('imgTitle');
const $imgDate = document.getElementById('imgDate');
const $imgCredit = document.getElementById('imgCredit');
const $imgExplanation = document.getElementById('imgExplanation');


// Favourites Setup

// The favourites array has to be let, instead of const as the localStorage needs to overwrite the blank array.
let favourites = [];

// If there is items in the localStorage under the key 'favourites' (the logic is the stored item is NOT null aka empty)
if(localStorage.getItem('favourites') !== null) {
    favourites = JSON.parse(localStorage.getItem('favourites'));
}

const $gallery = document.getElementById('favourites-container');

displayFavourites();

// Event listener for submitting the date form
$dateSubmit.addEventListener('click', async function (e) {
    // Prevent refeshing on submission
    e.preventDefault();

    // Fetches the 
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${$dateInput.value}&api_key=IsIAYzeOKox4LhMS3qiJ8N7IRwrnf8SD1Tfp8RAC`);

    displayedAPOD = await response.json();


    // displayedAPOD.favourite = true;
    $displayImg.setAttribute('src', displayedAPOD.url);
    $displayImg.dataset.hdUrl = displayedAPOD.hdurl;
    $imgTitle.textContent = displayedAPOD.title;

    // Adds the date content to the display, but replaces the dashes with a slash with spaces on each side.
    $imgDate.textContent = displayedAPOD.date.replaceAll("-", " / ");


    // During testing, I found that some of the dates in the APOD did not have the copyright information in the API (for example, 2025-10-27 did not have one, despite NASA's APOD website having that information. This if statement catches that issue, and provides alternative textContent if it is not found.)
    if (displayedAPOD.copyright) {
        $imgCredit.textContent = displayedAPOD.copyright;
    } else {
        $imgCredit.textContent = 'No copyright information was found.';
    }

    $imgExplanation.textContent = displayedAPOD.explanation;

    document.querySelector('div.displayContainer div:first-child').classList.add('visually-hidden');
    document.querySelector('div.displayContainer div:last-child').classList.remove('visually-hidden');

    // See if I can make it so that if its already a favourited picture, the button will be favourited.
})

// // Use event delegation to manage the 3 actions in this part of the site. 
$displayImgContainer.addEventListener('click', function (e) {
    if (e.target.id === 'favourite') {
        if (!favourites.includes(displayedAPOD)) {
            $favouriteSymbol.className = 'bi bi-star-fill';
            favourites.push(displayedAPOD);
            localStorage.setItem('favourites', JSON.stringify(favourites));
            displayFavourites();
        } else {
            $favouriteSymbol.className = 'bi bi-star';
            favourites.splice(favourites.indexOf(displayedAPOD), 1);
            localStorage.setItem('favourites', JSON.stringify(favourites));
        }

    } else if (e.target.id === 'download') {
        console.log("This is the download");
    } else if (e.target.id === 'displayImg') {
        console.log("This is the image");
    }



})

function updateFavourites() {
    favourites = JSON.parse(localStorage.getItem('favourites'));
    displayFavourites();
}

function displayFavourites() {
    if(favourites.length > 0) {

        const templates = [];

        favourites.forEach(favourite => templates.push(`<div class="card shadow-sm">
        <img src="${favourite.url}"
            alt="See Explanation."
        class="card-img-top">
        
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${favourite.title}</h5>
            <p class="card-text">${favourite.explanation}</p>
            <div class="d-flex justify-content-between">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary">Unfavourite</button>
                </div>
                
                <small class="text-body-secondary">${favourite.date.replaceAll("-", " / ")}</small>
            </div>
            </div>
    </div>`))

        $gallery.innerHTML = templates.join('');

        // Makes visible after rendered all the items.
        document.querySelector('div#gallery > div.container > div').classList.add('visually-hidden');
        document.querySelector('div#gallery > div.container > div:last-child').classList.remove('visually-hidden');
    }
}

