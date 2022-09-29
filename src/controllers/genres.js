const axios = require('axios');
const { API_KEY } = process.env;
const { URL_GENRES } = require('../constants');

const infoGenres= async()=>{
    let url= `${URL_GENRES}?key=${API_KEY}`
    
    const picar= await axios.get(url);
    const data= picar.data.results;
    return data.sort((a,b)=> a.id - b.id);
}

module.exports={
    infoGenres,
}