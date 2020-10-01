(function(me){
	//#include "addShapeMenu.jsxinc" //debug時用のライブラリ

	
   var exec = function()
    {
        var lyr = getActiveLayer();
        if(lyr!=null)
        {
            var pp = addShapes(lyr,"ADBE Vector Shape - Star");
			if(pp==null) return;
			pp(2).setValue(2);
			pp(3).setValue(3);
        }
    }
    exec();

})(this);
