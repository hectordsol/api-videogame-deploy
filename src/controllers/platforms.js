const axios = require('axios');
const { API_KEY } = process.env;
const { URL_GAMES } = require('../constants');

const infoPlatforms= async ()=>{
    let url;
    const games= []
        url= `${URL_GAMES}?key=${API_KEY}`//traigo 
        for (let i = 1; i < 22; i++) { //tomo solo 22 paginas
            let pages = await axios.get(url);
            pages.data?.results.forEach((game)=>{
                games.push({
                    id: game.id,
                    platforms: game.platforms.map(p=>p.platform.name),
                })
            })
            url= pages.data.next//cada pagina tiene 20 registros
        // }
    }//luego armo array de platforms por cada juego y elimino repetidos con Set
    let platforms = [... new Set(games.map((game)=> game.platforms).flat())];
    return platforms.sort();//devolver platforms ordenado
}
module.exports={
    infoPlatforms,
}