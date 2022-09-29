const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Videogame', {
    id:{
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    }, 
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    released: {
      type: DataTypes.STRING,
      validateReleased(value){
        let valid =  Date.parse(value);
        if (!valid) throw new Error('This is not a valid date format.');
        }
    },
    rating: {
      type: DataTypes.FLOAT, //decimal
      validate:{
        min: 0.0,
        max: 5.0
       }
    },
    platforms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    image:{
      type: DataTypes.TEXT, //URL
    }
  },
    {
      timestamps: false, //Para evitar crear updatedAt y createdAt
  });
};
