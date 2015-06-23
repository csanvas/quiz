// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Pregunta"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Respuesta"}}
      },
      tema: {
        type: DataTypes.STRING,
        validate: { isIn: {
          args: [['Ciencia', 'Humanidades', 'Ocio', 'Tecnología', 'Otro']],
          msg: "-> Solo: Ciencia, Humanidades, Ocio, Tecnología u Otro"}}
      }
    }
  );
}

