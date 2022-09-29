const { Router } = require('express')
const router = Router()
const { infoPlatforms } = require("../controllers/platforms.js")
const { Platform } = require('../db');

router.get('/', async (req, res, next)=>{
    try {
        let platformsDb= await Platform.findAll();
        if(!platformsDb.length){
            let platformsApi= await infoPlatforms();
            const mapApi= platformsApi.map((e,i)=>({
                id: i+1,
                name: e
            }));
            const results= await Platform.bulkCreate(mapApi);
            console.log("si no esta en la DB busco en la API y cargo a la DB");
            res.send(results.sort((a,b)=> a.id - b.id));
        }
        else{
            const filterDb= platformsDb.map(e=>{
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
