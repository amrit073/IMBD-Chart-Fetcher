#!/usr/bin/env node
import cheerio from "cheerio"
import fetch from "node-fetch"
const datas = [] //for movie list with urls
const finalData = [] //for movie details
const args = process.argv.slice(2) //get command line arguments except first two

const chart_url = args[0];
const items_count = args[1];

//IIFE async function
(async () => {
	const res = await fetch(chart_url)
	const res_text = await res.text()
	const $ = cheerio.load(res_text)
	const name = $('.lister-list .titleColumn > a')
	$(name).each((i, el) => {
		datas.push(el.children[0].parent.attribs)
	})
	// console.log(datas[0]);	
	await getMovie(datas) 
	console.log(finalData)	 
})();

const getMovie = async (datas) => {
	for (var i = 0; i < items_count; i++) {
		var movieUrl = 'https://www.imdb.com' + datas[i].href
		const res= await fetch(movieUrl).catch(err=>console.log(err))
		const res_text = await res.text().catch(err=>console.log(err))
		const $ = cheerio.load(res_text)
		const title = $('.sc-b73cd867-0').text()
		const movie_release_year = $('.sc-8c396aa2-0 > li:nth-child(1) > span:nth-child(2)').text()
		const imdb_rating = $('.sc-910a7330-12 > div:nth-child(1) > div:nth-child(1) > a:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1)').text()
		const summary = $('.sc-16ede01-0').text()
		const duration = $('.sc-8c396aa2-0 > li:nth-child(3)').text()
		const genre = $('div.ipc-chip-list:nth-child(1)').text()
		const to_add = {
			title, movie_release_year, imdb_rating, summary, duration, genre //es6 object literal
		}
		finalData.push(to_add)
	}
};
