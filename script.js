function getOutfit() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherData, handleError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function fetchWeatherData(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = API_KEY;

    const weatherApiUrl = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature&timesteps=current&units=imperial&apikey=${apiKey}`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            const temp = parseTemperature(data);
            const outfit = selectOutfit(temp);
            displayOutfit(outfit);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Unable to retrieve weather data.');
        });
}

function parseTemperature(data) {
    if (
        data.data &&
        data.data.timelines &&
        data.data.timelines[0] &&
        data.data.timelines[0].intervals &&
        data.data.timelines[0].intervals[0] &&
        data.data.timelines[0].intervals[0].values &&
        typeof data.data.timelines[0].intervals[0].values.temperature !== 'undefined'
    ) {
        const temp = data.data.timelines[0].intervals[0].values.temperature;
        return temp;
    } else {
        throw new Error('Temperature data not found in response.');
    }
}

function selectOutfit(temp) {
    if (temp < 60) {
        return {
            description: 'FROCKING CHILLY',
            imageUrl: './images/pexels-frendsmans-21751753.jpg'
        };
    } else if (temp >= 60 && temp <= 75) {
        return {
            description: 'FROCKING MILD',
            imageUrl: './images/pexels-frendsmans-28442036.jpg'
        };
    } else {
        return {
            description: 'FROCKING TOASTY',
            imageUrl: './images/pexels-sergeymakashin-54449978.jpg'
        };
    }
}

function displayOutfit(outfit) {
    const outfitDiv = document.getElementById('outfit');
    const today = new Date().toLocaleDateString();
    const storedDate = localStorage.getItem('outfitDate');
    if (storedDate !== today) {
        localStorage.setItem('outfitDate', today);
        localStorage.setItem('outfit', JSON.stringify(outfit));
    } else {
        outfit = JSON.parse(localStorage.getItem('outfit'));
    }

    outfitDiv.innerHTML = `
        <h2>Today's Suggestion</h2>
        <p>${outfit.description}</p>
        <img src="${outfit.imageUrl}" alt="Outfit Image">
    `;
}

function handleError(error) {
    console.error('Error obtaining location:', error);
    alert('Unable to retrieve your location.');
}
