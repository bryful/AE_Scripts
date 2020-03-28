
(function(me){

	//-------------------------------------------------------------------------
//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "Calc", [ 0,  0,  400,  150]  ,{maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	winObj.graphics.font = "Arial-Bold:30";
	var tbLine = winObj.add("edittext", [   5,   5,    5+ 330,   5+  90], "",{multiline:true,scrollable:true});
	tbLine.graphics.font = "Arial-Bold:30";
	var btnUndo = winObj.add("button", [ 340,   5,  340+  50,   5+  30], "Undo" );
	var btnEnter = winObj.add("button", [ 340,   40,  340+  50,   40+  30], "Enter" );



	
	
	//-------------------------------------------------------------------------
	var undoList = [];
	var calcExec = function()
	{
		function myEval(expr) {
 			 Function( expr)();
		}
		var line = tbLine.text;
		if (line=="") {
			alert("no");
			return;
		}
		try{
			var s = eval(line);
		}catch(e){
			tbLine.text = "errer!";
			return;
		}
		undoList.push(line);
		
		tbLine.text = s +"";
	}
	btnEnter.onClick = calcExec;
	btnUndo.onClick = function()
	{
		if (undoList.length>0) {
			tbLine.text = undoList.pop();
		}
	}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);