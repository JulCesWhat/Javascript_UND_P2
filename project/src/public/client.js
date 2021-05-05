let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: [],
    selectedRover: ''
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    let { rovers, photos, selectedRover } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <div class="container-fluid">
                    <h3>Select the rover you want to see the pictures from.</h3>
                    <div class="row">
                        ${Rovers(rovers, selectedRover)}
                    </div>
                    <div class="row galery">
                        ${RoverPhotoGalery(photos, selectedRover)}
                    </div>
                </div>
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    if (!apod) {
        return '';
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

const RoverPhotoGalery = (photos, selectedRover) => {
    if (!photos.length) {
        getMarsRoverPhotos(store);
    }

    if (!selectedRover) {
        return '<p>No rover has been selected...</p>';
    }

    return photos.filter((photo) => (photo.rover.name === selectedRover))
        .map((photo) => {
            return (`
                <div class="col-lg-3 col-md-4 col-sm-6 pb-2 rover">
                    <p class="name">Date: ${photo.earth_date}</p>
                    <p class="status">Status: ${photo.rover.status}</p>
                    <img src="${photo.img_src}" />
                    <p class="land">Landing Date: ${photo.rover.landing_date}</p>
                    <p class="launch">Launch Date: ${photo.rover.launch_date}</p>
                </div>
            `);
        }).join('');
};

const Rovers = (rovers, selectedRover) => {
    if (!rovers.length) {
        return '';
    }

    return rovers.map((rover) => {
        return (`<div class="col-4${rover === selectedRover ? ' selected' : ''} rover-btn pb-3" onclick="selectRover('${rover}')">${rover}</div>`);
    }).join('');
};

const selectRover = (selectedRover) => {
    updateStore(store, { selectedRover })
}


// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state;

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }));

    return '';
}

const getMarsRoverPhotos = (state) => {
    let { photos } = state;

    fetch(`http://localhost:3000/marsRoverPhotos`)
        .then(res => res.json())
        .then(photos => updateStore(store, { photos }));
}