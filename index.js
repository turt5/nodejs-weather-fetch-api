const axios = require('axios');
const cheerio = require('cheerio');
const http = require('http');

async function scrape() {
    const url = 'https://weather.tomorrow.io/'; 
    try {
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        location ="";
        temperature = "";

        $('.PFnzkD').each((index, element) => {
            location=$(element).text().trim();
        });

        $('span._3fQrr5').each((index, element) => {
            temperature=$(element).text().trim();
        });

        return {
            'location': location.replace("Weather in ", ""),
            'temperature': temperature
        };
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        throw error;
    }
}


const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'GET' && req.url === '/weather') {
        try {
            const data = await scrape();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});


const PORT = 3000; 

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
