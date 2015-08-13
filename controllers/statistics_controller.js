var models = require('../models/models.js');
var Sequelize = require('sequelize');

var statData = [];

// GET /quizes/statistics
exports.show = function(req, res, next) {

  Sequelize.Promise.all([
    models.Quiz.count(),
    models.Comment.count(),
    models.Quiz.count({distinct: true, include: [{ model: models.Comment, required: true}]})
  ]).then(function(conta) {
      statData = [];
      statData[0] = {texto: "Número de preguntas", valor: conta[0]};
      statData[1] = {texto: "Número de comentarios", valor: conta[1]};
      statData[2] = {texto: "Número medio de comentarios por pregunta", valor: conta[0]?(conta[1] / conta[0]).toFixed(1):0 };
      statData[3] = {texto: "Número de preguntas sin comentarios", valor: conta[0]-conta[2]};
      statData[4] = {texto: "Número de preguntas con comentarios", valor: conta[2]};
      res.render('statistics/show.ejs', {datos: statData, errors: []});
    }
  ).catch(function(error) { next(error); });

};

