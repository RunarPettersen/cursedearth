import { db } from "./constants/api.js"; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const generateSitemap = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        let sitemapEntries = [];

        querySnapshot.forEach((doc) => {
            const destinationId = doc.id;
            const url = `https://thiscursedearth.com/discover/detail.html?id=${destinationId}`;
            sitemapEntries.push(`<url><loc>${url}</loc></url>`);
        });

        // XML structure
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url><loc>https://thiscursedearth.com/</loc></url>
            <url><loc>https://thiscursedearth.com/discover/</loc></url>
            <url><loc>https://thiscursedearth.com/destinations/</loc></url>
            ${sitemapEntries.join("\n")}
        </urlset>`;

        return sitemapContent;

    } catch (error) {
        console.error("❌ Error generating sitemap:", error);
        return null;
    }
};

// ✅ Generate Sitemap on Request
export const serveSitemap = async (req, res) => {
    const sitemap = await generateSitemap();
    if (sitemap) {
        res.setHeader("Content-Type", "application/xml");
        res.send(sitemap);
    } else {
        res.status(500).send("Error generating sitemap.");
    }
};