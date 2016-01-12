# WizardChess

<<.3주차 프로젝트: 3조 한수민 노어진 신재민>>

* 프로젝트 명: Wizard Chess

* Git 주소 : https://github.com/EojinRho/WizardChess

* 설명: 해리포터에서 등장하는 말로 체스를 할 수 있는 wizard chess를 구현하였습니다.

* 특징: 키워드 음성인식을 이용하여 체스말을 이동시켰습니다. 유니티가 안드로이드 위에서 돌아감에도 불구하고, 안드로이드에서 유니티로 통신이 안되었기 때문에, 안드로이드에서 Speech Recognition을 구현하고 이를 서버에 쏘면 이 data를 분석하여 다시 유니티로 쏴주는 방식을 이용하였습니다.

* 문법: 아래



    grammar chessorder;
    
    <chess> = <pieces> <alpha> <numbers>;
    
    <pieces> = pawn | rook | knight | bishop | king | queen;
    
    <alpha> = alpha | bravo | charlie | delta | eco | foxtrot | golf | hotel;
    
    <numbers> = one | two | three | four | five | six | seven | eight;

public <chessorder> = <chess>;


### Test script

1.

W: Oh mighty wizard, fifth pawn eco four.

B: Oh mighty wizard, fifth pawn eco five.

W: Oh mighty wizard, queen hotel five.

B: Oh mighty wizard, king eco seven.

W: Oh mighty wizard, queen eco five.

check mate

2.

W: Oh mighty wizard, fifth pawn eco four.

B: Oh mighty wizard, fifth pawn eco five.

W: Oh mighty wizard, second bishop charlie four.

B: Oh mighty wizard, first knight charlie six.

W: Oh mighty wizard, queen foxtrot three.

B: Oh mighty wizard, fourth pawn delta six.

W: Oh mighty wizard, queen foxtrot seven.

check mate
