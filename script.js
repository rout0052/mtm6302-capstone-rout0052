// This section was written in part-3 of the project. It sets up the input for the date to only allow values before today and update that date dynamically.

// Set up elements for the date input form 
const $dateInput = document.getElementById('date');
const $dateSubmit = document.getElementById('dateSubmit');

// Gets todays date to use to set the default and maximum value for the date submitted.
let $todaysDate = new Date();
// Formats today's date into the YYYY-MM-DD format
let $todayFormatted = $todaysDate.getFullYear() + "-" + ($todaysDate.getMonth() + 1) + "-" + $todaysDate.getDate();
// Sets the maximum value of the input to today's formatted date 
$dateInput.setAttribute('max', $todayFormatted);
// Sets the default value of the input to today's formatted date
$dateInput.setAttribute('value', $todayFormatted);


// *IMPORTANT - This variable will be used throughout to access the current APOD object globally
let displayedAPOD;


//
// DEFINITIONS OF VARIABLES STORING HTML ELEMENT
//

// Container that holds the displayed APOD.
const $displayAPODContainer = document.getElementById('displayAPODContainer');

// The image that is displayed
const $displayImg = document.getElementById('displayImg');

// The favourite symbol inside of the favourite button - this is used to change the symbol depending on the favouriting status 
const $favouriteSymbol = document.querySelector('div#imgActions button i#favourite-star');

// The link inside of the download button. This is used to add the HD image link to be able to download the image
const $downloadLink = document.querySelector('div#imgActions button a.downloadBtn')

// Displayed APOD title element
const $imgTitle = document.getElementById('imgTitle');
// Displayed APOD date element
const $imgDate = document.getElementById('imgDate');
// Displayed APOD credit element
const $imgCredit = document.getElementById('imgCredit');
// Displayed APOD explanation element
const $imgExplanation = document.getElementById('imgExplanation');

// The gallery of favourites that dynamically adds the favourite cards
const $gallery = document.getElementById('favourites-container');

// The modal to display the images in HD
const $modal = document.getElementById('modal')

//
// FAVOURITES SETUP
//

// The favourites array has to use let, instead of const as the localStorage needs to overwrite the blank array.
let favourites = [];

// Updates the favourites array to pull from local storage, and displays them in the gallery
updateFavourites();


// Event listener for submitting the date form. This fetches the image from the API.
$dateSubmit.addEventListener('click', async function (e) {
    // Prevent refeshing on submission
    e.preventDefault();

    // Fetches the APOD for the date submited in the $dateInput part of the form.
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${$dateInput.value}&api_key=IsIAYzeOKox4LhMS3qiJ8N7IRwrnf8SD1Tfp8RAC`);

    // Assigns the parsed reponse from the API to displayedAPOD, our global variable for the currently displayed APOD
    displayedAPOD = await response.json();

    // The following lines displays the information gathered from the API

    // Sets the src of the image as the url from the APOD
    $displayImg.setAttribute('src', displayedAPOD.url);

    // Adds a data attribute of data-hd-url to the image to keep the url of the HD image. This is used later for the modal.
    $displayImg.dataset.hdUrl = displayedAPOD.hdurl;

    // Add the hd url as the link for the download button. Currently, the download functions in this site do not download it onto the user's computer, as the download attribute in a link only works when it is a local file. I know that you have to use blobs to do this, however I ran out of time before submission to learn how to do this. I kept in the download button since it was a part of my original plans.
    $downloadLink.href = displayedAPOD.hdurl;

    // Adds the title of the image as text content
    $imgTitle.textContent = displayedAPOD.title;

    // Adds the date content to the display, but replaces the dashes with a slash with spaces on each side.
    $imgDate.textContent = displayedAPOD.date.replaceAll("-", " / ");

    // During testing, I found that some of the dates in the APOD did not have the copyright information in the API (for example, 2025-10-27 did not have one, despite NASA's APOD website having that information. This if statement catches that issue, and provides alternative textContent if it is not found.)
    if (displayedAPOD.copyright) {
        $imgCredit.textContent = displayedAPOD.copyright;
    } else {
        $imgCredit.textContent = 'No copyright information was found.';
    }

    // Adds the explanation of the image as text content
    $imgExplanation.textContent = displayedAPOD.explanation;

    // This checks if the displayed APOD is in local storage's favourites, and changes the star symbol accordiingly. It does this by turning the local storage's favourites into a string, and searches for the currently displayed APOD's date in that string. Since this is just for a cosmetic change to the favourites symbol and you don't need to gather any actual information from it (such as the index), this is a quick way to capture whether its in the favourites or not. 
    if (JSON.stringify(localStorage.getItem('favourites')).includes(displayedAPOD.date)) {
        // If the current displayed APOD IS in the favourites, have the star be filled
        $favouriteSymbol.className = 'bi bi-star-fill favouriteBtn';
    } else {
        // If the current displayed APOD IS NOT in the favourites, have the star not be filled
        $favouriteSymbol.className = 'bi bi-star favouriteBtn';
    }


    // Hides the text that tells the user they have not selected a date
    document.querySelector('div.displayContainer div:first-child').classList.add('visually-hidden');
    // Removes the visually-hidden tag from the APOD display, to display the retrieved APOD
    document.querySelector('div.displayContainer div:last-child').classList.remove('visually-hidden');

})

// Use event delegation to manage the 3 actions in the APOD container: favourite, download, and open modal. 
$displayAPODContainer.addEventListener('click', function (e) {
    // If the target is the favourite button. I used a class added to each part of the button (the button, the symbol), so that no matter where on the button the user clicked, it would still execute the if. 
    if (e.target.classList.contains('favouriteBtn')) {
        // Using the same condition as in the $dateSubmit event listener, this tests whether the current displayed APOD's date is in local storage favourites. This statement is if the date is NOT in the favourites.  
        if (!JSON.stringify(localStorage.getItem('favourites')).includes(displayedAPOD.date)) {
            // Updates the favourites array by pulling from the stored favourites, and updates the favourites display 
            updateFavourites();

            // Pushes the current displayed APOD into the favourites array
            favourites.push(displayedAPOD);

            // Replaces the favourites set in localStorage
            localStorage.setItem('favourites', JSON.stringify(favourites));

            // Updates the favourites array and display again for redundancy
            updateFavourites();

            // Changes the favourites icon to filled
            $favouriteSymbol.className = 'bi bi-star-fill favouriteBtn';
        } else {
            // Updates the favourites array by pulling from the stored favourites, and updates the favourites display 
            updateFavourites();

            // Uses the removeFavourite function by getting the index with the getFavouritesIndex function            
            removeFavourite(getFavouritesIndex(displayedAPOD));

            // Updates the favourites array and display again for redundancy
            updateFavourites();

            // Changes the favourites icon to the normal star
            $favouriteSymbol.className = 'bi bi-star favouriteBtn';
        }
        // If the target is the download button.
    } else if (e.target.classList.contains('downloadBtn')) {
        // When adding download functionality at a later date, this will execute that action. 
        // If the target is the displayImg
    } else if (e.target.id === 'displayImg') {
        // Opens the modal with the HD url data attribute added on display
        openModal(e.target.dataset.hdUrl);
    }
})

// Use event delegation on the favourites gallery
$gallery.addEventListener('click', function (e) {
    // If the target is the view button for one of the favourites
    if (e.target.classList.contains('viewBtn')) {
        // Opens the modal with the HD url link added to the data attribute
        openModal(e.target.dataset.hdUrl);
        // If the target is the unfavourite button for one of the favourites
    } else if (e.target.classList.contains('unFavouriteBtn')) {
        // Removes the favourite, using the index saved as a data attribute to the button
        removeFavourite(e.target.dataset.favIndex);
    }
})


// Event listener added to the modal to click out
$modal.addEventListener('click', function () {
    // Removes the class "show" from the modal to remove it from the screen 
    $modal.classList.remove('show');
})

// Removes an item from the favourites, taking in the parameter of the associated index in the favourites array
function removeFavourite(index) {
    // Makes sure the favourites array is updated
    updateFavourites();
    // Removes the favourite at the index
    favourites.splice(index, 1);
    // Replaces the favourites in localStorage with the updated favourites array
    localStorage.setItem('favourites', JSON.stringify(favourites));
    // Updates the favourites display and array
    updateFavourites();
}

// Retrieves the index of a given APOD object
function getFavouritesIndex(apodObj) {
    // Returns the index, which is found by: retrieving the 'favourites' item from local storage, parsing it into a usable array. then, use map() to turn each of objects in the array into a string. Finally, use the indexOf() method to search through the array. The indexOf() method uses strict equality, so I couldn't use just the normal apodObj. So, by turning all of the items into strings, and stringifying the apodObj, it would work even with strict equality, as the strings will be equal.
    return JSON.parse(localStorage.getItem('favourites')).map(stringMap).indexOf(JSON.stringify(apodObj));
}

// Stringifies the objects sent as a parameter, used with map in getFavouritesIndex
function stringMap(obj) {
    return JSON.stringify(obj);
}

// Updates the favourites array and invokes displayFavourites() to keep up with any changes to the information
function updateFavourites() {
    // This tests for if there is an entry in the localStorage under the key 'favourites'. Only if there is an entry (or, if the item 'favourites' is NOT equal to null), it executes the code
    if (localStorage.getItem('favourites') !== null) {
        // Updates the favourites array by pulling from the localStorage
        favourites = JSON.parse(localStorage.getItem('favourites'));
    }

    // Updates the display of the favourites to catch any changes made 
    displayFavourites();
}


function displayFavourites() {
    // Executes if the favourites array is not empty
    if (favourites.length > 0) {
        // Array to hold the templates for the cards
        const templates = [];

        // For each favourite in the array, create and push the filled in card template to the template array
        favourites.forEach(favourite => templates.push(`<div class="card shadow-sm">
        <img src="${favourite.url}"
            alt="See Explanation."
        class="card-img-top">
        
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${favourite.title}</h5>
            <p class="card-text">${favourite.explanation}</p>
            <div class="d-flex justify-content-between">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary viewBtn" data-hd-url="${favourite.hdurl}">View</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary unFavouriteBtn" data-fav-index="${getFavouritesIndex(favourite)}">Unfavourite</button>
                </div>
                
                <small class="text-body-secondary">${favourite.date.replaceAll("-", " / ")}</small>
            </div>
            </div>
    </div>`))
        // ^ Explanation of the card. For the images and text, they are added just like they were for displayedAPOD. The HD url is added to the view button so that it can be used to open the modal on click. The index is added so that can be used to remove it from the favourites. Finally, the date is reformatted to be more readable for the small text.

        // Joins the templates array into a single string, and adds it to the gallery
        $gallery.innerHTML = templates.join('');

        // Makes visible after rendered all the items.
        document.querySelector('div#gallery > div.container > div').classList.add('visually-hidden');
        document.querySelector('div#gallery > div.container > div:last-child').classList.remove('visually-hidden');
    } else {
        // This else statement catches if the user has one favourite that they remove from the favourites, leaving an empty array. It removes anything from the gallery, and adds back the text telling the user to add favourites
        document.querySelector('div#gallery > div.container > div').classList.remove('visually-hidden');
        $gallery.innerHTML = '';
    }
}

// Opens the modal for the passed image URL
function openModal(url) {
    // Adds the HD image to the modal, as well as a download button.
    $modal.innerHTML = `<img src="${url}"><a class="btn btn-primary btn-lg" href="${url}">Download <i class="bi bi-download"></i></a>`;
    // Adds the "show" class to the modal, which makes it visible.
    $modal.classList.add('show');
}