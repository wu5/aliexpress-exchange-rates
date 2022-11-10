const axios = require('axios'); 
const cheerio = require('cheerio'); 
const express = require("express");

const app = express();

async function getData() {
	const scrapedData = [];
	const tableHeaders = ['date', 'bank', 'ali_ru', 'ali_com', 'gearbest', 'geekbuying', 'banggood'];
	const url = "https://helpix.ru/currency/";

	await axios.get(url).then(({ data }) => { 
		const $ = cheerio.load(data); // Initialize cheerio 

	$(".b-tabcurr__tr").each((index, element) => {
		const tds = $(element).find("td");
		const tableRow = {};
		$(tds).each((i, element) => {
		  tableRow[tableHeaders[i]] = $(element).text();
		});
		scrapedData.push(tableRow);
	  });
  
	  for (let key in scrapedData[1]) {
		if (scrapedData[1][key] == '-')
			scrapedData[1][key] = scrapedData[2][key];
		if (key != 'date') 
			scrapedData[1][key] = Number(scrapedData[1][key]);
			//scrapedData[1][key] = Number(Number(scrapedData[1][key]).toFixed(1));
	  }

	});
	console.log(scrapedData[1]);
	return scrapedData[1];
}	

app.get("/", async (req, res) => {
	try {
	  const json = await getData();
	  return res.status(200).json(json);
	} catch (err) {
	  return res.status(500).json({err: err.toString()});
	}
  });
  
  app.listen(8080, () =>
  console.log(`The server is active and running on port 80`)
  );
