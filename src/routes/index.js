const { Router } = require('express');
const router = Router();
// traemos los archivos de las rutas.
// Importando todos los routers;
const videogameRoute  = require('./videogame');
const videogamesRoute = require('./videogames');
const genresRoute     = require('./genres');
const platformsRoute  = require('./platforms');

// Configurar los routers
router.use('/videogame' , videogameRoute);
router.use('/videogames', videogamesRoute);
router.use('/genres'    , genresRoute);
router.use('/platforms' , platformsRoute);

module.exports = router;
