(function(me){
	var matchNames = [
		"ADBE Vector Group",//00
		"ADBE Vector Shape - Rect",//01
		"ADBE Vector Shape - Ellipse",//02
		"ADBE Vector Shape - Star",//03
		"ADBE Vector Shape - Group",//04
		"ADBE Vector Graphic - Fill",//05
		"ADBE Vector Graphic - Stroke",//06
		"ADBE Vector Graphic - G-Fill",//07
		"ADBE Vector Graphic - G-Stroke",//8
		"ADBE Vector Filter - Merge",//09
		"ADBE Vector Filter - Offset",//10
		"ADBE Vector Filter - PB",//11
		"ADBE Vector Filter - Repeater",//12
		"ADBE Vector Filter - RC",//13
		"ADBE Vector Filter - Trim",//14
		"ADBE Vector Filter - Twist",//15
		"ADBE Vector Filter - Roughen",//16
		"ADBE Vector Filter - Wiggler",//17
		"ADBE Vector Filter - Zigzag"//28
	];
   var exec = function()
    {
        var lyr = getActiveLayer();
        if(lyr!=null)
        {
            addShapes(lyr,"ADBE Vector Group");
        }
    }
    exec();

})(this);
