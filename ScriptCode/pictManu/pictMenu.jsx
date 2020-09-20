
(function(me){
	var image_AE1_img = new File("001.png");
	var image_AE1_imgr = new File("001_r.png");

    var picts = [];
    picts.push(new File("001.png"));
    picts.push(new File("001_r.png"));
    var btns = [];
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "pictMenu", [ 829,  186,  829+ 160,  186+ 58]  
    ,{resizeable:false,maximizeButton:false, minimizeButton:false});
	//-------------------------------------------------------------------------

    var x = 5;
    var y = 5;
    
	btns.push( winObj.add("iconbutton", [  x,   y,   x+ 150,   y+  24] , picts[0] ));
    y += 24;
	btns.push( winObj.add("iconbutton", [  x,   y,   x+ 150,   y+  24] , picts[1] ));

    btns[0].onClick= function()
    {
        alert("AA");
    }

	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);