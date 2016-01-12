var Chess = require('./chess.js-master/chess').Chess;
var chess = new Chess();
chess.move({from: 'e2', to: 'e4'});
chess.move({from: 'f7', to: 'f5'});
chess.move({from: 'e4', to: 'f5'});
/*
chess.move('e5');
chess.move('f4');
chess.move('exf4');
chess.move('a4');
chess.move('f3');
chess.move('b4');
chess.move('fxg2');
chess.move('Bc4');
chess.move('Bc5');
chess.move('b4');
chess.move('Bxb4');
chess.move('c3');
chess.move('Ba5');
chess.move('d4');
chess.move('exd4');
chess.move('d3');
*/
console.log(chess.ascii());
