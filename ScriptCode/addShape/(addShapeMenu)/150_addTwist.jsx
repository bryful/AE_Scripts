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
		"ADBE Vector Filter - Merge",//11
		"ADBE Vector Filter - Offset",//12
		"ADBE Vector Filter - PB",//13
		"ADBE Vector Filter - Repeater",//14
		"ADBE Vector Filter - RC",//15
		"ADBE Vector Filter - Trim",//16
		"ADBE Vector Filter - Twist",//17
		"ADBE Vector Filter - Roughen",//18
		"ADBE Vector Filter - Wiggler",//19
		"ADBE Vector Filter - Zigzag"//20
	];
   var exec = function()
    {
        var lyr = getActiveLayer();
        if(lyr!=null)
        {
            addShapes(lyr,"ADBE Vector Filter - Twist");
        }
    }
    exec();

})(this);
