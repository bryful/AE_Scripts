(function(me){
	//#include "addShapeMenu.jsxinc" //debug時用のライブラリ

   var exec = function()
    {
        var lyr = getActiveLayer();
        if(lyr!=null)
        {
            var pp = addShapes(lyr,"ADBE Vector Shape - Group");
			if(pp==null) return;
			var myShape = new Shape();
			myShape.vertices = [[0,-100], [-100,-100], [-100,0]]; 
			myShape.closed = false;
			pp(2).setValue(myShape);       
		}
    }
    exec();

})(this);
