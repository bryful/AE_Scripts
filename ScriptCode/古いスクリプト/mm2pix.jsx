
(function(me){
	var refFlag = false;


	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "mm2pix", [ 0,  0,  260,  230]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var pnlMM	= winObj.add("panel", 		[  10,   10,   10+ 240,  10+  75], "mm" );
	var edMM	= pnlMM.add("edittext",	 	[   5,   10,    5+  70,  10+  20], "0");
	var stMM	= pnlMM.add("statictext",	[  80,   10,   80+  30,  10+  20], "mm");
	var edFrame	= pnlMM.add("edittext",	 	[ 115,   10,  115+  70,  10+  20], "1");
	var stFrame	= pnlMM.add("statictext", 	[ 190,   10,  190+  50,  10+  20], "frame");
	var stConv	= pnlMM.add("statictext", 	[   5,   35,    5+  60,  35+  20], "convert");
	var edDPI	= pnlMM.add("edittext", 	[  70,   35,   70+  70,  35+  20], "144");
	var stDPI	= pnlMM.add("statictext", 	[ 145,   35,  145+  30,  35+  20], "dpi");

	var pnlPixel= winObj.add("panel",		[  10,  90,    10+ 240,  90+  95], "Pixel" );
	var edPixel	= pnlPixel.add("edittext",	[   5,  10,     5+ 120,  10+  20], "0");
	var stPixel	= pnlPixel.add("statictext",[ 130,  10,   130+  50,  10+  20], "Pixel");
	var edRot	= pnlPixel.add("edittext", 	[   5,  35,     5+  45,  35+  20], "90");
	var stRot	= pnlPixel.add("statictext",[  55,  35,    55+  30,  55+  20], "Rot");
	var stX		= pnlPixel.add("statictext",[ 100,   35,  100+  20,  35+  20], "X");
	var edX		= pnlPixel.add("edittext", 	[ 125,   35,  125+  70,  35+  20], "0");
	var stXP	= pnlPixel.add("statictext",[ 200,   35,  200+  30,  35+  20], "Pixel");
	var stY		= pnlPixel.add("statictext",[ 100,   60,  100+  20,  60+  20], "Y");
	var edY		= pnlPixel.add("edittext",	[ 125,   60,  125+  70,  60+  20], "0");
	var stYP	= pnlPixel.add("statictext",[ 200,   60,  200+  30,  60+  20], "Pixel");

	//-------------------------------------------------------------------------
	var rotLenXY = function(r,len)
	{
		var ret = {};
		ret.x = 0;
		ret.y = 0;
		var r2 = Math.floor(r*10000 + 0.5);
		if (r2<0) r2 += 360* 10000;
		r = r2/10000;
		if (r==0) {
			ret.x = 0;
			ret.y = -1;
		}else if ((r>0)&&(r<90)){
			ret.x = Math.sin((r*Math.PI/180)) *  1;
			ret.y = Math.cos((r*Math.PI/180)) * -1;
		}else if (r==90) {
			ret.x = 1;
			ret.y = 0;
		}else if ((r>90)&&(r<180)){
			ret.x = Math.cos((r-90)*Math.PI/180) * 1;
			ret.y = Math.sin((r-90)*Math.PI/180) * 1;
		}else if (r==180) {
			ret.x = 0;
			ret.y = 1;
		}else if ((r>180)&&(r<270)){
			ret.x = Math.sin((r-180)*Math.PI/180) * -1;
			ret.y = Math.cos((r-180)*Math.PI/180) * 1;
		}else if (r==270) {
			ret.x = -1;
			ret.y = 0;
		}else if ((r>270)&&(r<360)){
			ret.x = Math.cos((r-270)*Math.PI/180) * -1;
			ret.y = Math.sin((r-270)*Math.PI/180) * -1;
		}
		ret.x *= len;
		ret.x = Math.floor(ret.x *10000 + 0.5) /10000;
		
		ret.y *= len;
		ret.y = Math.floor(ret.y *10000 + 0.5) /10000;
		return ret;
	}
	//-------------------------------------------------------------------------
	var changeMM = function()
	{
		if ( refFlag == true) return;
		if ( isNaN(edMM.text) ) {
			alert("ミリ指定がおかしい");
			return;
		}
		if ( isNaN(edFrame.text) ) {
			alert("フレーム指定がおかしい");
			return;
		}
		if ( isNaN(edDPI.text) ) {
			alert("dpi指定がおかしい");
			return;
		}
		if ( isNaN(edRot.text) ) {
			alert("角度指定がおかしい");
			return;
		}
		var mmv = edMM.text *1;
		var frm = edFrame.text *1;
		var dpi = edDPI.text *1;
		var pxv = edPixel.text * 1;
		refFlag = true;
		try{
			if (frm <=0) {
				frm = 1;
				edFrame.text = frm + "";
			}
			if (dpi<=0) {
				dpi = 144;
				edDPI.text = dpi + "";
			}
			var px = (mmv*frm) * dpi / 25.4;
			px = Math.floor(px * 10000+0.5)/10000;
			edPixel.text = px + "";
			
			var r = edRot.text * 1;
			var xy = rotLenXY(r,px);
			edX.text = xy.x +"";
			edY.text = xy.y +"";
		}catch(e){
			alert(e.toSource());
		}finally{
			refFlag = false;
		}
	}
	edMM.onChange = 
	edFrame.onChange = 
	edDPI.onChange = 
	changeMM;
	
	//-------------------------------------------------------------------------
	var changePixel = function()
	{
		if ( refFlag == true) return;
		if ( isNaN(edPixel.text) ) {
			alert("pixel指定がおかしい");
			return;
		}
		if ( isNaN(edRot.text) ) {
			alert("角度指定がおかしい");
			return;
		}
		var frm = edFrame.text *1;
		var dpi = edDPI.text *1;
		var px = edPixel.text * 1;
		refFlag = true;
		try{
			if ((typeof(frm)!="number")||(frm<=0)) {
				frm = 1;
				edFrame.text = frm + "";
			}
			if ((typeof(dpi)!="number")||(dpi<=0)) {
				dpi = 144;
				edDPI.text = dpi + "";
			}
			
			var p = (px * 25.4 / dpi) / frm;
			p = Math.floor(p*10000 +0.5) / 10000;
			edMM.text = p + "";
			var r = edRot.text * 1;
			if ( typeof(r) != "number" ) {
				r = 90;
				edRot.text = "90";
			}
			
			var xy = rotLenXY(r,px);
			edX.text = xy.x +"";
			edY.text = xy.y +"";
		}catch(e){
			alert(e.toString());
		}finally{
			refFlag = false;
		}
	}
	edPixel.onChange = changePixel;
	//-------------------------------------------------------------------------
	var changeRot = function()
	{
		if ( refFlag == true) return;
		if ( isNaN(edPixel.text) ) {
			alert("pixel指定がおかしい");
			return;
		}
		if ( isNaN(edRot.text) ) {
			alert("角度指定がおかしい");
			return;
		}
		refFlag = true;
		try{
			var px = edPixel.text * 1;
			var r = edRot.text * 1;
			if ( typeof(r) != "number" ) {
				r = 90;
				edRot.text = "90";
			}
			
			var xy = rotLenXY(r,px);
			edX.text = xy.x +"";
			edY.text = xy.y +"";
		}catch(e){
			alert(e.toString());
		}finally{
			refFlag = false;
		}
	}
	edRot.onChange = changeRot;
	//-------------------------------------------------------------------------
	var changeXY = function()
	{
		if ( refFlag == true) return;
		if ( isNaN(edX.text) ) {
			alert("X指定がおかしい");
			return;
		}
		if ( isNaN(edY.text) ) {
			alert("Y指定がおかしい");
			return;
		}
		if ( isNaN(edRot.text) ) {
			alert("角度指定がおかしい");
			return;
		}
		refFlag = true;
		try{
			var frm = edFrame.text *1;
			var dpi = edDPI.text *1;

			var x = edX.text * 1;
			var y = edY.text * 1;
			var px = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
			px = Math.floor(px*10000 + 0.5) / 10000;
			var r = 180 - Math.atan2(x,y) * 180 /Math.PI;
			r = (Math.floor(r*10000+0.5) % (360*10000))/10000;
			if (r<0) r += 360;
			edRot.text = r;
			edPixel.text = px + "";
			var p = (px * 25.4 / dpi) / frm;
			p = Math.floor(p*10000 +0.5) / 10000;
			edMM.text = p + "";
			
		}catch(e){
			alert(e.toString());
		}finally{
			refFlag = false;
		}
	}
	edX.onChange = 
	edY.onChange = changeXY;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);