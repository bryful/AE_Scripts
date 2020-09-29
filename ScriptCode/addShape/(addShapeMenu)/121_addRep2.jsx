(function(me){
   var exec = function()
    {
        var lyr = getActiveLayer();
        if(lyr!=null)
        {
            var pp = addShapes(lyr,"ADBE Vector Filter - Repeater");
			pp(1).setValue(2);
			pp(2).setValue(-0.5);
        }
    }
    exec();

})(this);
