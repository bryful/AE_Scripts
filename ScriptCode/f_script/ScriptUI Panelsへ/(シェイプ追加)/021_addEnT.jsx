(function(me){
	//#include "addShapeMenu.jsxinc" //debug時用のライブラリ
   var exec = function()
    {
        var lyr = getActiveLayer();
        if(lyr!=null)
        {
            var gp  = addShapes(lyr,"ADBE Vector Group");
            gp.name = "EnT"
            var outEn = gp.content.addProperty("ADBE Vector Shape - Ellipse");
            outEn.name ="outEn";
            outEn(2).setValue([200,200]);
            var inEn = gp.content.addProperty("ADBE Vector Shape - Ellipse");
            inEn.name ="inEn";
            inEn(2).setValue([170,170]);
            var narge1 = gp.content.addProperty("ADBE Vector Filter - Merge");
            narge1(1).setValue(3);
            var rect = gp.content.addProperty("ADBE Vector Shape - Rect");
            rect.name  = "rect";
            rect(2).setValue([200,40]);
            var narge2 = gp.content.addProperty("ADBE Vector Filter - Merge");
            narge2(1).setValue(3);
            var fill = gp.content.addProperty("ADBE Vector Graphic - Fill");
        }
    }
    exec();

})(this);
