var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var mongoaddr = ('mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/testeapi');
console.log(mongoaddr);
mongo.connect(mongoaddr);

var taskListSchema = mongo.Schema({
	descricao : { type: String },
	concluido : Boolean,
	updated_at: { type: Date, default: Date.now },
});

var Model = mongo.model('Tasks', taskListSchema);

//POST - Adiciona um registro
app.post("/api/add", function (req, res) {
	var register = new Model({
		'descricao' : req.body.descricao,
		'concluido' : req.body.concluido
	});
	register.save(function (err) {
		if (err) {
			console.log(err);
			res.send(err);
			res.end();
		}
	});
	res.send(register);
	res.end();
});

app.get("/api/all", function (req, res) {
	Model.find(function(err, todos) {
		if (err) {
			res.json(err);
		} else {
			res.json(todos);
		}
	})
});

app.delete("/api/delete/:id", function (req, res) {
 Model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

app.listen(8080, function() {
	console.log('Funcionando');
});