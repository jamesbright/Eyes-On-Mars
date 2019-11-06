var tID; //we will use this variable to clear the setInterval()
var posY = 24;
var posX = 12;
const interval = 100; //100 ms of interval for the setInterval()
const diff = 25;     //diff as a variable for position offset
const rowElem = document.querySelector('.row');
let mSol = Math.floor(Math.random() * 1000) + 1;
let api = '';
const apiKey = 'sM9dReXlARhfcp9ctZGxUt8wItACbqJTLMCW3YiI';


// bind the search by camera
const cameras = document.querySelectorAll('[data-camera] a');
cameras.forEach(camera => {
    camera.addEventListener('click', () => {
        event.preventDefault();
        const value = event.target.textContent;
        console.log(value);
        api = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${mSol}&camera=${value}&api_key=${apiKey}`;
        getPhotos(api);
    });
});
// search by sol 
const searchSol = () => {
    event.preventDefault();
    const value = document.querySelector('#search-text').value;
    api = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${value}&api_key=${apiKey}`;
    console.log(value);
    getPhotos(api);
}

const searchByDate = (value) => {
    console.log(value);
    api = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${value}&api_key=${apiKey}`;
    getPhotos(api);
}
//peforms the api call and format of json data for display
const getPhotos = (api) => {

    //remove data-holder elements if it already exists
    $('#contents').empty();
    $('#loading').removeClass('hidden');
    $('#loading').addClass('visible');

    fetch(api)
        .then(response => response.json())
        .then(data => {
            console.log(data.photos.length);
            if (data.photos.length > 0) {
                data.photos.forEach(element => {

                    console.log(element);

                    // create data-holder elements to hold the data
                    const containerElem = document.createElement('div');
                    const photoElem = document.createElement('div');
                    const detailElem = document.createElement('p');

                    containerElem.className = "col-sm-4 col-md-4 col-lg-4 col-xs-offeset-1 mrover-data-container";
                    containerElem.id = "mrover-photo-container";
                    photoElem.className = "mrover-photo-details lazy";
                    photoElem.id = "image";
                    detailElem.textContent = "";
                    photoElem.style.background = "url(images/loading.gif) no-repeat";

                    //bind mouse events
                    if (photoElem.addEventListener) {  // all browsers except IE before version 9
                        photoElem.addEventListener("mouseover", animateScript, false);
                        photoElem.addEventListener("mouseout", stopAnimate, false);

                    } else {
                        if (photoElem.attachEvent) {   // IE before version 9

                            photoElem.addEventListener("mouseover", animateScript);
                            photoElem.addEventListener("mouseout", stopAnimate);
                        }
                    }


                    photoElem.appendChild(detailElem);
                    containerElem.appendChild(photoElem);
                    rowElem.appendChild(containerElem);
                    detailElem.innerText = `Camera: ${element.camera.name} 
                                     Earth Date: ${element.earth_date}
                                     Rover: ${element.rover.name}
                                     Sol:  ${element.sol}`;

                    photoElem.style.background = `url( ${element.img_src} ) no-repeat`;


                    $('#loading').removeClass('visible');
                    $('#loading').addClass('hidden');

                });
            } else {

                $('#loading').src = "images/Error.png"; 
            }
        })
        .catch(error => {
            console.log(error);
        });


} // end getPhotos()

const animateScript = () => {

    // clearInterval(tID);
    let coordinates = [0, 0];
    d3.select(event.target) // Selects the 'html' element
        .on('mousemove', function () {
            coordinates = d3.mouse(this); // Gets the mouse coordinates

            console.log(coordinates);

            posX = Math.round(coordinates[0]);
            posY = Math.round(coordinates[1]);

            const image = event.target;

            image.style.backgroundPosition =
                `-${posX}px -${posY}px`;

            if (posX < 1398 || posY < 934) {

                posX = posX + diff;
                posY = posY + diff;

            }
            //we increment the position each time
            if (posX > 368 || posY == 367) {
                posX = 0;
                posY = 0;
            }


        });
} //end of animateScript()

const stopAnimate = () => {

}

$(document).ready(function () {


    api = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${mSol}&page=2&api_key=${apiKey}`;
    getPhotos(api);

});
