const { Router } = require('express');
const { infoById } = require("../controllers/videogames.js");
const { Op }= require('sequelize');
const { Videogame, Genre } = require('../db');
const router = Router();

router.get('/:id', async (req, res, next)=>{
    const {id} = req.params;
    try {
        const videoFound= await infoById(id)
        if (videoFound)
            return res.send(videoFound)
        else
            res.status(404).send('Videogame not found by id:');
   } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req, res, next)=>{
    const {id} = req.params
    const {name, description, rating, released, platform, image} = req.body
    try {
        let updateVideoGame= await Videogame.findOne({
            where:{
                id: id,
            },
            include:{
                model: Genre,
                attributes: ['name'],
                through: {
                    attributes:[]
                }}
        });
        await updateVideoGame.update({
            name,
            description,
            rating,
            released,
            platform,
            image
        });
        let genreDb= await Genre.findAll({
            where:{
                name:{
                    [Op.in]: req.body.genres,
                },
            },
        });
        await updateVideoGame.setGenres(genreDb);
        res.send(updateVideoGame);
    } catch (error) {
        next(error)
    }    
});

router.delete('/:id', async (req,res,next)=>{
    const {id} = req.params
    try {
    const videoDelete= await Videogame.findByPk(id,{
        include:{
            model: Genre,
            attributes: ['name'],
            through: {
                attributes:[]
            }}
    })
    if(videoDelete){
        await videoDelete.destroy();
        return res.send('Videogame deleted!')
    }
    res.status(404).send('Videogame not found');
   } catch (error) {
       next(error)
   }
});

module.exports = router;