const { Router } = require('express')
const { Genre } = require('../db')
const router = Router()
const { infoGenres } = require('../controllers/genres')

router.get('/', async (req, res, next)=>{
    try {
        let genresDb= await Genre.findAll();
        if(!genresDb.length){
            let genresApi= await infoGenres();
            const mapApi= genresApi.map(e=>({
                id: e.id,
                name: e.name
            }))
            const results= await Genre.bulkCreate(mapApi);
            console.log("si no esta en la DB busco en la API y cargo en la DB");
            res.send(results);
        }
        else{
            const filterDb= genresDb.map(e=>{
                return{
                    id: e.id,
                    name: e.name
                }
            });
            console.log("si esta en la DB, la traigo de ahí");
            res.send(filterDb);
        }
    } catch (error) {
        next(error)
    }
});

module.exports = router;