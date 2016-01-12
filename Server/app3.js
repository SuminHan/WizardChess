var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(express.static(__dirname));

var httpServer = http.createServer(app).listen(8080, '0.0.0.0', function(req,res){
        console.log('Socket IO server has been started');
});

var io = require('socket.io').listen(httpServer);

var players = [];

var cli = {};
var curr_move = {};
var curr_piece = ""
, curr_alpha = ""
, curr_number = ""
, curr_response = "";
var Chess;
var chess;
var what_move;
var where_move;
var kill_message;
var if_checkmate = false;
var p_hash = {};
p_hash["first"] = 0;
p_hash["second"] = 1;
p_hash["third"] = 2;
p_hash["fourth"] = 3;
p_hash["fifth"] = 4;
p_hash["sixth"] = 5;
p_hash["seventh"] = 6;
p_hash["eighth"] = 7;

var a_hash = {};
a_hash["alpha"] = 0;
a_hash["bravo"] = 1;
a_hash["charlie"] = 2;
a_hash["delta"] = 3;
a_hash["eco"] = 4;
a_hash["foxtrot"] = 5;
a_hash["golf"] = 6;
a_hash["hotel"] = 7;

var n_hash = {};
n_hash["one"] = 0;
n_hash["two"] = 1;
n_hash["three"] = 2;
n_hash["four"] = 3;
n_hash["five"] = 4;
n_hash["six"] = 5;
n_hash["seven"] = 6;
n_hash["eight"] = 7;

var m_hash = {};
m_hash["knight"] = 'n';
m_hash["pawn"] = 'p';
m_hash["rook"] = 'r';
m_hash["bishop"] = 'b';
m_hash["queen"] = 'q';
m_hash["king"] = 'k';

var loc = {};
loc['wp0'] = 'a2';
loc['wp1'] = 'b2';
loc['wp2'] = 'c2';
loc['wp3'] = 'd2';
loc['wp4'] = 'e2';
loc['wp5'] = 'f2';
loc['wp6'] = 'g2';
loc['wp7'] = 'h2';
loc['wr0'] = 'a1';
loc['wn0'] = 'b1';
loc['wb0'] = 'c1';
loc['wq0'] = 'd1';
loc['wk0'] = 'e1';
loc['wb1'] = 'f1';
loc['wn1'] = 'g1';
loc['wr1'] = 'h1';
loc['bp0'] = 'a7';
loc['bp1'] = 'b7';
loc['bp2'] = 'c7';
loc['bp3'] = 'd7';
loc['bp4'] = 'e7';
loc['bp5'] = 'f7';
loc['bp6'] = 'g7';
loc['bp7'] = 'h7';
loc['br0'] = 'a8';
loc['bn0'] = 'b8';
loc['bb0'] = 'c8';
loc['bq0'] = 'd8';
loc['bk0'] = 'e8';
loc['bb1'] = 'f8';
loc['bn1'] = 'g8';
loc['br1'] = 'h8';

var color_hash = {};
color_hash["Black"] = 'B';
color_hash["White"] = 'W';

io.on('connection', function (socket) {
	cli[socket.id] = socket;

    var currentClient;
    socket.emit('connection', {msg: 'Connected to server' });
    console.log('new client added');

    socket.on('fromclient', function (data) {
    	socket.broadcast.emit('toclient',{msg: data.msg});
    	console.log('Message from client : '+data.msg);
    });

    socket.on('login', function(data){
        if (players.length == 0){
	        console.log('client login success : '+data.user);
	        socket.emit('loginconfirm', {user:data.user, msg:'Success', socketid:socket.id, color:data.color});
	        var player = new Object();
        	player.user = data.user;
        	player.socketid = socket.id;
        	player.color = data.color;
        	players.push(player);
	    }
	    else if (players.length == 1){
	    	if (players[0].color == data.color){
	    		socket.emit('loginconfirm', {user:data.user, msg:'Fail'});
	    	}
	    	else {
	    		console.log('client login success : '+data.user);
	        	socket.emit('loginconfirm', {user:data.user, msg:'Success', socketid:socket.id, color:data.color});
	        	var player = new Object();
        		player.user = data.user;
        		player.socketid = socket.id;
        		player.color = data.color;
        		players.push(player);
            loc['wp0'] = 'a2';
            loc['wp1'] = 'b2';
            loc['wp2'] = 'c2';
            loc['wp3'] = 'd2';
            loc['wp4'] = 'e2';
            loc['wp5'] = 'f2';
            loc['wp6'] = 'g2';
            loc['wp7'] = 'h2';
            loc['wr0'] = 'a1';
            loc['wn0'] = 'b1';
            loc['wb0'] = 'c1';
            loc['wq0'] = 'd1';
            loc['wk0'] = 'e1';
            loc['wb1'] = 'f1';
            loc['wn1'] = 'g1';
            loc['wr1'] = 'h1';
            loc['bp0'] = 'a7';
            loc['bp1'] = 'b7';
            loc['bp2'] = 'c7';
            loc['bp3'] = 'd7';
            loc['bp4'] = 'e7';
            loc['bp5'] = 'f7';
            loc['bp6'] = 'g7';
            loc['bp7'] = 'h7';
            loc['br0'] = 'a8';
            loc['bn0'] = 'b8';
            loc['bb0'] = 'c8';
            loc['bq0'] = 'd8';
            loc['bk0'] = 'e8';
            loc['bb1'] = 'f8';
            loc['bn1'] = 'g8';
            loc['br1'] = 'h8';
            Chess = require('./chess.js-master/chess').Chess;
            chess = new Chess();
	    	}
	    }
	    else {
	    	socket.emit('loginconfirm', {user:data.user, msg:'Fail'});
	    }
    });

    socket.on('disconnect', function() {
      	console.log('Got disconnect!');
      	for(var i = 0; i < players.length; ++i) {
    		if(players[i].socketid === socket.id) {
       			players.splice(i, 1);
       			console.log("players count : "+players.length);
       		}
       	}
   	});
});

function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function findcolorfromsocketid(sid){
  for(var k in players){
    console.log(players[k].color);
    if(players[k].socketid == sid){
      if(players[k].color == "black"){
        return "B";
      }
      else if(players[k].color == "white"){
        return "W";
      }
      else{
        return undefined;
      }
    }
  }
  return undefined;
}

app.post('/abc', function(req, res) {
	console.log(req.body);
  curr_move = req.body.msg.split(" ");
  var not_invalid = true;
  if(curr_move.length == 4){
    if(curr_move[1] == "king" || curr_move[1] == "queen"){
      not_invalid = false;
    }
    if(curr_move[0] == "third" || curr_move[0] == "fourth" || curr_move[0] == "fifth" || curr_move[0] == "sixth" || curr_move[0] == "seventh" || curr_move[0] == "eighth"){
      if(curr_move[1] == "bishop" || curr_move[1] == "rook" || curr_move[2] == "knight"){
        not_invalid = false;
      }
    }
    if(p_hash[curr_move[0]] === undefined || findcolorfromsocketid(req.body.sid) === undefined || a_hash[curr_move[2]] === undefined || n_hash[curr_move[3]] === undefined){
      not_invalid = false;
    }
    curr_piece = capitalizeFirstLetter(curr_move[1]) + p_hash[curr_move[0]] + findcolorfromsocketid(req.body.sid);
    curr_alpha = a_hash[curr_move[2]];
    curr_number = n_hash[curr_move[3]];
    curr_response = curr_piece+" "+curr_alpha+" "+curr_number;
    what_move = findcolorfromsocketid(req.body.sid).toLowerCase()+m_hash[curr_move[1]]+p_hash[curr_move[0]];
    where_move = curr_move[2].charAt(0)+(n_hash[curr_move[3]]+1);
  }
  else if(curr_move.length ==3){
    if(curr_move[0] == "pawn" || curr_move[0] == "bishop" || curr_move[0] == "rook" || curr_move[0] == "knight"){
      not_invalid = false;
    }
    if(findcolorfromsocketid(req.body.sid) === undefined || a_hash[curr_move[1]] === undefined || n_hash[curr_move[2]] === undefined){
      not_invalid = false;
    }
    curr_piece = capitalizeFirstLetter(curr_move[0])+'0' + findcolorfromsocketid(req.body.sid);
    curr_alpha = a_hash[curr_move[1]];
    curr_number = n_hash[curr_move[2]];
    curr_response = curr_piece+" "+curr_alpha+" "+curr_number;
    what_move = findcolorfromsocketid(req.body.sid).toLowerCase()+m_hash[curr_move[0]]+'0';
    where_move = curr_move[1].charAt(0)+(n_hash[curr_move[2]]+1);
  }
  else{
    not_invalid = false;
  }
  console.log('what_move: '+what_move+' where_move: '+where_move+' loc[what_move]: '+loc[what_move]);
  var move = chess.move({from: loc[what_move], to: where_move})
  if(move === null){
    not_invalid = false;
    console.log('invalid move');
  }
  else{
    loc[what_move] = where_move;
    console.log(chess.ascii());
    if(chess.game_over()){
      if_checkmate = true;
    }
    if(move.flags == 'c'){
      kill_message = 1;
    }
  }
  if(curr_response==""){
    not_invalid = false;
  }


  if(if_checkmate){
    if(move.flags == 'c'){
      res.send({msg: "checkmate", kill:1, move: curr_response});
    }else{
      res.send({msg: "checkmate", move: curr_response});
    }
    for(var k in cli){
      cli[k].emit('toclient', {msg:curr_response});
      console.log("Chess " + k);
    }
  }
  else if(not_invalid){
    console.log(curr_response);
    for(var k in cli){
      cli[k].emit('toclient', {msg: curr_response});
      console.log("Chess " + k);
    }
    if(move.flags == 'c'){
      res.send({msg: "roger that", kill:1, move: curr_response});
    }else{
      res.send({msg: "roger that", move: curr_response});
    }
    kill_message = ""
  }else{
    res.send({msg: "invalid move"})
  }

	res.end();
});
