var path = require('path');

// Postgres DATABASE_URL = postgres://user:password@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  dialect,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,    // solo SQLite
    omitNull: true        // solo Postgres
  }
);

// Importar la definición de la tabla Quiz definida en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar la definición de la tabla Comment definida en comment.js
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// Relaciones
Comment.belongsTo(Quiz, {foreignKey: 'quiz_fk'});
Quiz.hasMany(Comment);

// Exportar definición de tablas
exports.Quiz = Quiz;
exports.Comment = Comment;

// sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().done(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().done(function (count){
    if(count === 0) {  // la tabla se inicializa solo si esta vacia
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma',
                    tema: 'Otro'
                 });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa',
                    tema: 'Otro'
                 })
      .done(function(){console.log('Base de datos inicializada')});
    };
  });
});


