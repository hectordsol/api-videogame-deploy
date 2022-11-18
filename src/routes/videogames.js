const { Router } = require('express');
const { infoAll} = require('../controllers/videogames');
const db = require('../db');
const { Videogame, Genre } = require('../db');
const router = Router();

router.get('/', async (req, res, next)=>{
    try {
        const {name} = req.query
        let videoGames= await infoAll(name);
        if(!videoGames){
            //let juegosName= juegos.filter(e=>e.name.toLowerCase().includes(name.toLowerCase())).slice(0,15);
            //if(juegosName.length) res.send(juegosName)
            //else
              res.status(404).send(`The Videogame ${name} does not exist`)
        }else{
            let allGames= videoGames.map(e=>{
                return{
                    id: e.id,
                    name: e.name,
                    rating: e.rating,
                    genres: e.genres,
                    image: e.image,
                    platforms: e.platforms,
                    source: e.source,
                }
            })
            res.send(allGames);
        }
    } catch (error) {
        next(error)
    }
});

router.post('/', async(req, res, next)=>{
    let {name, description, released, rating, genres, platforms,image} = req.body;
    if (!name || !description || !platforms){
        return res.status(404).send('Missing to send mandatory data');
    }
    try {
        let newGame = await Videogame.create({
            name, 
            description, 
            released, 
            rating,
            platforms,
            image
        })

    const addGenres= await Genre.findAll({
        where:{
            name: genres
        }
    })
        newGame.addGenre(addGenres);
        return res.status(201).json(newGame);

    } catch (error) {
        next(error)
    }
});

module.exports = router