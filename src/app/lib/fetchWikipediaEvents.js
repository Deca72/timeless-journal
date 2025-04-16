const fetch = require("node-fetch");

/**
 * Fetches historical events from Wikipedia's "On This Day" API for a given date and location.
 * @param {string} date - The date in format "YYYY-MM-DD"
 * @param {string} location - The location related to the photo (e.g., "New York, USA")
 * @returns {Promise<string[]>} - A list of relevant historical events related to the date and location
 */
export async function fetchHistoricalEvents(date, location) {
    try {
        console.log("📅 Function called with date:", date, "and location:", location);

        // Extract month and day
        const [year, month, day] = date.split("-");
        console.log("📆 Extracted month & day:", month, day);

        // Wikipedia API URL
        const WIKI_API_URL = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
        console.log("🔗 Fetching from:", WIKI_API_URL);

        // Fetch data from Wikipedia API
        const response = await fetch(WIKI_API_URL);
        console.log("📡 API Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📜 Full API Response:", JSON.stringify(data, null, 2));

        if (!data.events || data.events.length === 0) {
            console.log("❌ No major historical events recorded.");
            return ["No major historical events recorded for this date."];
        }

        // Extract events that match the location, if possible
        let relevantEvents = data.events
            .filter(event => event.text.includes(location) || event.pages.some(page => page.title.includes(location)));

        // If no location-based events, return general events
        if (relevantEvents.length === 0) {
            console.log("🔎 No direct match for location. Returning general historical events.");
            relevantEvents = data.events.slice(0, 3);
        }

        // Format the events
        const formattedEvents = relevantEvents.map(event => {
            return `${event.year}: ${event.text}`;
        });

        console.log("✅ Wikipedia Historical Events:", formattedEvents);
        return formattedEvents;
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        return ["Error retrieving historical events."];
    }
}

// Example Usage (This should be replaced with actual photo metadata)
fetchHistoricalEvents("2024-08-01", "New York, USA")
    .then(result => console.log("✨ Final Output:", result))
    .catch(error => console.error("🚨 Uncaught Error:", error));
