const axios = require('axios');
const { Op }= require('sequelize');
const { URL_GAMES } = require('../constants');
const { API_KEY } = process.env;
const { Videogame, Genre } = require ('../db')

const infoApi= async (name)=>{
    let url;
    const games= [];
    let infoSearchApi;
     if (name){
         url= `${URL_GAMES}?search=${name}&key=${API_KEY}`//traigo por name
         console.log(url);
         infoSearchApi = await axios.get(url);
         console.log(infoSearchApi.data.results.length);
         infoSearchApi.data?.results.forEach((game)=>{
            games.push({
                id: game.id,
                name: game.name,
                released: game.released,
                rating: game.rating,
                image: game.background_image,
                platforms: game.platforms?game.platforms.map(p=>p.platform.name):[],
                genres: game.genres.map(g=>g.name),
                source: "api",
            })
        })
     }
     else{
        url= `${URL_GAMES}?key=${API_KEY}`//traigo todo
        console.log(url);
        for (let i = 1; i < 6; i++) { //tomo 5 paginas
            infoSearchApi = await axios.get(url);
            infoSearchApi.data?.results.forEach((game)=>{
                games.push({
                    id: game.id,
                    name: game.name,
                    released: game.released,
                    rating: game.rating,
                    image: game.background_image,
                    platforms: game.platforms.map(p=>p.platform.name),
                    genres: game.genres.map(g=>g.name),
                    source: "api",
                })
            })
            url= infoSearchApi.data.next//cada pagina tiene 20 registros
        }
    }
    console.log("cantidad de registros",games.length)
    return games;//debería devolver hasta 20 si es consulta por name o 100 
}

const infoDb= async(name)=>{
    try{
        let title = '';
        let whereDB = {};
        const includeDB = [{model: Genre}];
        const attributesDB = ['id','name','description','rating','platforms','image'];
        if (name){
            title = name.toLowerCase().replace(/['"]+/g, '');//saca comillas
            whereDB = { name: {[Op.iLike]: `%${title}%`},}; //preparo consulta DB
        }
        let queryDB = {attributes: attributesDB, where: whereDB, include: includeDB}
        const dbVideoGames = await Videogame.findAll(queryDB);
       const videoGames = dbVideoGames.map((game)=>{
           return{
               id: game.id,
               name: game.name,
               description: game.description,
               released: game.released,
               rating: game.rating,
               image: game.image,
               platforms: game.platforms,
               genres: game.Genres? game.Genres.map((genre)=>genre.name):[],
               source: "db",
           }   
       }) 
       return videoGames
    }catch (error){console.log(error)}
}

const infoAll = async (name)=>{
    const api= await infoApi(name);
    const db= await infoDb(name);
    const infoTotal= [...api, ...db];
    return infoTotal;
}

const infoById = async(id)=>{
    let details;
    if(typeof id === 'string' && id.length>8){
        details = await Videogame.findOne({
            where: { id: id,},
            include: [{ model: Genre, attributes: ['id','name']}],  
        })
        if (details){
            let {Genres}=details;
            let genres = Genres?Genres.map((genre)=>genre.name):[];
            details ={
                id:details.id,
                name: details.name,
                image: details.image,
                description: details.description,
                released: details.released,
                rating: details.rating,
                platforms: details.platforms,
                genres: genres,
                source: "db"
            }
        }
    }
    else{
            const apiVideoGame= await axios.get(`${URL_GAMES}/${id}?key=${API_KEY}`)
            const game = apiVideoGame.data
            details= {
                id:game.id,
                name: game.name,
                image: game.background_image,
                description: game.description,
                released: game.released,
                rating: game.rating,
                platforms: game.platforms.map(p=>p.platform.name),
                genres: game.genres.map(genre=>genre.name),
                source: "api"
            }
        }
        return details;

}
module.exports={
    infoApi,
    infoDb,
    infoAll,
    infoById,
}