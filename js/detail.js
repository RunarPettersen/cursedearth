import { setupLoader } from './utils/loader.js';
import { fetchDestinationDetails } from './utils/fetchDestination.js';
setupLoader();

document.addEventListener('DOMContentLoaded', fetchDestinationDetails);