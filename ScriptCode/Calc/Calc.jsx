
(function(me){

	//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "Calc", [ 0,  0,  400,  150]  ,{resizeable:true, maximizeButton:true, minimizeButton:true,});
	//-------------------------------------------------------------------------
	var tbLine = winObj.add("edittext", [   5,   5,    5+ 330,   5+  90], "",{multiline:true,scrollable:true});

    var btnUndo = winObj.add("button", [340, 5, 340 + 50, 5 + 30], "Undo");
	var btnEnter = winObj.add("button", [ 340,   40,  340+  50,   40+  30], "Enter" );
	
	
	//-------------------------------------------------------------------------
    var undoList = [];
    var undoIndex  = 0;
	var calcExec = function()
	{
		var line = tbLine.text;
		if (line=="") {
			alert("no");
			return;
		}
		try{
	        undoList.push(line);
	        if (undoList.length > 40) undoList.shift();
	        undoIndex = 0;
			var s = eval(line);
		}catch(e){
			tbLine.text = "errer!";
			return;
		}

		tbLine.text = s +"";
    }
    // ************************************************************************
    var undoExec = function () {
        var len = undoList.length;
        if (len > 0) {

            var idx = len -1- (undoIndex % len);
            if (idx < 0) idx += len;
            undoIndex = (undoIndex + 1) % len;
            tbLine.text = undoList[idx];
        }

    }
    // ************************************************************************
	btnEnter.onClick = calcExec;
    btnUndo.onClick = undoExec;
	{
    }
    var resizeWin = function () {
        var b = winObj.bounds;
        var w = b[2] - b[0];
        var h = b[3] - b[1];

        var b2 = tbLine.bounds;
        b2[0] = 5;
        b2[1] = 5;
        b2[2] = b2[0] + w - 60;
        b2[3] = b2[1] + h - 10;
        tbLine.bounds = b2;

        var b3 = btnUndo.bounds;
        b3[0] = b2[2]+ 5;
        b3[1] = 5;
        b3[2] = b3[0] + 50;
        b3[3] = b3[1] + 30;
        btnUndo.bounds = b3;

        var b4 = btnEnter.bounds;
        b4[0] = b2[2]  + 5;
        b4[1] = 35;
        b4[2] = b4[0] + 50;
        b4[3] = b4[1] + 30;
        btnEnter.bounds = b4;

    }
    resizeWin();
    winObj.onResize = resizeWin;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);