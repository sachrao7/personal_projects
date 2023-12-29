// app.js
function fetchAnimeInfo() {
    const animeInput = document.getElementById('animeInput').value;

    if (!animeInput) {
        alert('Please enter an anime title.');
        return;
    }
    currentIndex = 0;
    const apiUrl = `https://api.jikan.moe/v4/anime?q=${animeInput}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
                console.log(data['data'][currentIndex])
                displayAnimeInfo(data['data'][currentIndex]);
                nextButton.style.display = 'block'

        })
        .catch(error => {
            console.error('Error fetching anime information:', error);
        });
}

let currentIndex = 0;
function getNextAnime() {
    currentIndex++;

    const animeInput = document.getElementById('animeInput').value;

    if (!animeInput) {
        alert('Please enter an anime title.');
        return;
    }

    const apiUrl = `https://api.jikan.moe/v4/anime?q=${animeInput}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data['data'][currentIndex]) {
                console.log(data['data'][currentIndex])
                displayAnimeInfo(data['data'][currentIndex]);
            }
            else {
                // If no more drinks, go back to the first one
                currentIndex = 0;
                displayAnimeInfo(data['data'][currentIndex]);
            }
        })
        .catch(error => {
            console.error('Error fetching anime information:', error);
        });
}


function displayAnimeInfo(anime) {
    const animeInfoDiv = document.getElementById('anime-info');
    const animeImage = anime.images.jpg.image_url || 'placeholder-image.png'; // Use a placeholder image if not available
    const youtubeTrailerId = anime.trailer.embed_url ? getYouTubeVideoId(anime.trailer.embed_url) : null;

    animeInfoDiv.innerHTML = `
        <h2>${anime.title}</h2>
        <img id="anime-image" src="${animeImage}" alt="${anime.title}">
        <p>Rating: ${anime.score || 'N/A'}</p>
        <p>Rank: ${anime.rank || 'N/A'}</p>
        <p>Popularity: ${anime.members || 'N/A'}</p>
        <p>Synopsis: ${anime.synopsis || 'N/A'}</p>
        
        <h3> Trailer </h3>
        ${youtubeTrailerId ? `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${youtubeTrailerId}" frameborder="0" allowfullscreen></iframe>` : ''}        

    `;

    animeInfoDiv.style.display = 'block';
}

function getYouTubeVideoId(url) {
    // Extracts the video ID from a YouTube URL
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
