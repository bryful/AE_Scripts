
var DEBUG = {};

(function(me){
	//----------------------------------

	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "DEBUG Console", [ 0,  0,  200,  200]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	var btnClear =  winObj.add("button", [ 5,5,5+50,5+23], "Clear");
	var console = winObj.add("edittext", [ 5,30,5+190,30+165], "", {readonly:true, multiline:true});
	// ********************************************************************************
	btnClear.onClick = function(){
		console.text = "";
	};
	
	// ********************************************************************************
	var reszieSet = function()
	{
		var bw = winObj.bounds;
		var w = bw[2] -bw[0];
		var h = bw[3] -bw[1];
		var bc = console.bounds;
		bc[2]  = bc[0] + (w - 10);
		bc[3]  = bc[1] + (h - 30);
		console.bounds = bc;
	}
	// ********************************************************************************
	var write = function(str)
	{
		console.text += str;
	}
	DEBUG.write = write;
	// ********************************************************************************
	reszieSet();
	winObj.onResize = reszieSet;

	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);