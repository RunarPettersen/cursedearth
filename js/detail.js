import { setupLoader } from './utils/loader.js';
import { fetchDestinationDetails } from './utils/fetchDestination.js';
setupLoader();

// ✅ Run Fetch Function When Page Loads
document.addEventListener('DOMContentLoaded', fetchDestinationDetails);