(function(me){
	//#include "addShapeMenu.jsxinc" //debug時用のライブラリ
   var exec = function()
    {
        var lyr = getActiveLayer();
        if(lyr!=null)
        {
            var gp  = addShapes(lyr,"ADBE Vector Group");
            gp.name = "Kagi"
            var rct1 = null;
            var rct2 = null;
            rct1 = gp(2).addProperty("ADBE Vector Shape - Rect");
            rct1.name = "rct1";
            var rct2 = gp(2).addProperty("ADBE Vector Shape - Rect");
            rct2.name = "rct2";
            //何故か変数がnullになる
            rct1 = gp(2)("rct1");
            rct2 = gp(2)("rct2");
            rct1(2).setValue([100,20]);
            rct1(3).expression =    "p = thisProperty.propertyGroup(2)(\"rct1\")(2).value;\r\n"+
                                    "p2 = thisProperty.propertyGroup(3)(2)(\"rct2\")(2).value;\r\n"+
                                    "[p[0]/-2,p[1]/2 - p2[1]];";
            rct2(2).setValue([20,100]);
            rct2(3).expression =    "p = thisProperty.propertyGroup(2)(\"rct2\")(2).value;\r\n"+
                                    "p2 = thisProperty.propertyGroup(3)(2)(\"rct1\")(2).value;\r\n"+
                                    "[p[0]/2 - p2[0],p[1]/-2];";
            var narge1 = gp.content.addProperty("ADBE Vector Filter - Merge");
            narge1(1).setValue(2);
        }
    }
    exec();

})(this);
