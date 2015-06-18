var path = require('path');

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
                      {dialect: "sqlite", storage: "quiz.sqlite"}
                    );

// Importar la definición de la tabla Quiz definida en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Exportar definición de la tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().done(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().done(function (count){
    if(count === 0) {  // la tabla se inicializa solo si esta vacia
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                 })
      .done(function(){console.log('Base de datos inicializada')});
    };
  });
});


