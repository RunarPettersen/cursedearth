import { setupLoader } from './utils/loader.js';

setupLoader();

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query') ? urlParams.get('query').toLowerCase() : '';

    // Display the query in the search input field
    document.getElementById('searchInput').value = query;

    if (query) {
        await fetchAndDisplayResults(query);
    }
});

const fetchAndDisplayResults = async (query) => {
    try {
        const response = await fetch('json/places.json'); // Update the path if necessary
        if (!response.ok) {
            throw new Error('Failed to fetch places data.');
        }
        const places = await response.json();
        displaySearchResults(places, query);
    } catch (error) {
        console.error('Error fetching search results:', error);
        displayMessage('An error occurred while fetching search results. Please try again later.', 'error');
    }
};

const displaySearchResults = (places, query) => {
    const resultsSection = document.getElementById('searchResults');
    resultsSection.innerHTML = ''; // Clear previous results

    // Filter places based on the query
    const filteredPlaces = places.filter(place => 
        place.title.toLowerCase().includes(query) || 
        place.description.toLowerCase().includes(query)
    );

    if (filteredPlaces.length > 0) {
        filteredPlaces.forEach(place => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <h3><a href="discover/detail.html?id=${place.id}">${place.title}</a></h3>
                <p>${place.introduction}</p>
                <a href="discover/detail.html?id=${place.id}" class="view-details-link">View Details</a>
            `;
            resultsSection.appendChild(resultItem);
        });
    } else {
        resultsSection.innerHTML = '<p>No results found for your search query.</p>';
    }
};
