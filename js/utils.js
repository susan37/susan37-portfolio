/**
 * Shared utility functions for the portfolio extension
 */

const Utils = {
    /**
     * Fetch JSON data from a URL
     */
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Could not fetch data:", error);
            return null;
        }
    },

    /**
     * Calculate reading time for a piece of text
     */
    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
        const wordCount = text.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min read`;
    },

    /**
     * Get URL parameters
     */
    getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split("&");
        for (const pair of pairs) {
            if (pair === "") continue;
            const [key, value] = pair.split("=");
            params[decodeURIComponent(key)] = decodeURIComponent(value || "");
        }
        return params;
    },

    /**
     * Format date string
     */
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
};

window.Utils = Utils;
