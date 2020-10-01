(function(me){
	//#include "addShapeMenu.jsxinc" //debug時用のライブラリ

   var exec = function()
    {
        var lyr = getActiveLayer();
        if(lyr!=null)
        {
            addShapes(lyr,"ADBE Vector Shape - Ellipse");
        }
    }
    exec();

})(this);
