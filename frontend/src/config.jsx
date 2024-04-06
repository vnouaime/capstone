// Stores important data to access througout website.

// Data for external API use. 
const EXTERNAL_BASE_URL = "https://wayfair.p.rapidapi.com"
const headers = {
    'X-RapidAPI-Key': '4ddacbf8b3msh2a63817e695f614p1e4272jsncbe4bbb37ff9',
    'X-RapidAPI-Host': 'wayfair.p.rapidapi.com'
};

const caid = "214970" // According to API docs, this category id retrieves all categories.

// Data for internal API use. 
const BASE_URL = "http://localhost:3001";

export {
    BASE_URL,
    EXTERNAL_BASE_URL, 
    headers, 
    caid
};