# WizardChess

3rd Week Project: (Group 3) Sumin Han, Eojin Rho, Jaemin Shin>>

* Project Name: Wizard Chess

* Git: https://github.com/EojinRho/WizardChess

* Description: We have implemented the chess game in the Harry Potter using voice recognition. (해리포터에서 등장하는 말로 체스를 할 수 있는 wizard chess를 구현하였습니다.)

* Characteristic: We used keyword voice recognition to move the chess unit. We built Unity 3D chess game first, and exported it to Android Project. Then we implemented keyword voice recognition on Android. Android send messages to the server, and the server analyzes this data (to calculate the valid chess movement) and then it answers to the smartphone. (키워드 음성인식을 이용하여 체스말을 이동시켰습니다. 유니티가 안드로이드 위에서 돌아감에도 불구하고, 안드로이드에서 유니티로 통신이 안되었기 때문에, 안드로이드에서 Speech Recognition을 구현하고 이를 서버에 쏘면 이 data를 분석하여 다시 유니티로 쏴주는 방식을 이용하였습니다.)

* Grammar: Below

```
grammar chessorder;
    
<chess> = <pieces> <alpha> <numbers>;
    
<pieces> = pawn | rook | knight | bishop | king | queen;
    
<alpha> = alpha | bravo | charlie | delta | eco | foxtrot | golf | hotel;
    
<numbers> = one | two | three | four | five | six | seven | eight;

public <chessorder> = <chess>;
```

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
