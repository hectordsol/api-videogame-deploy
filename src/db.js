require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DATABASE_URL,
} = process.env;

const db = new Sequelize(DATABASE_URL ||
  `postgresql://postgres:R9QP0NLfu1I2XSq1w3e4@containers-us-west-66.railway.app:6000/railway`
  , {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialectOptions:{
    ssl:{
      require:true,
      rejectUnauthorized:false
    }
  },
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(db));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(db.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
db.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Videogame, Genre } = db.models;

// relaciones
Videogame.belongsToMany(Genre, { through: 'Videogame_genres' });
Genre.belongsToMany(Videogame, { through: 'Videogame_genres' });

module.exports = {
  ...db.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: db,     // para importart la conexión { conn } = require('./db.js');
};
