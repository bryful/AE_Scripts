﻿
(function(me){
	var resizeVale = 2;	//-------------------------------------------------------------------------
	var getVR = function()	{		var ret = [];			var addPB = function(pb)			{				if (ret.length<=0) {					ret.push(pb);				}else{					var b = true;					for (var i = ret.length-1; i>=0; i--) {						if ( (ret[i].name == pb.name)&&(ret[i].propertyDepth == pb.propertyDepth)&&(ret[i].propertyIndex == pb.propertyIndex)){							b = false;							break;						}					}					if (b) ret.push(pb);				}			}		var ac = app.project.activeItem;		if ( !( ac instanceof CompItem) ) return ret;		var sel = ac.selectedProperties;		if (sel.length<=0) return ret;		var info = "";		for (var i=0; i<sel.length; i++) {			var p = sel[i];			if ( p instanceof Property) p = p.parentProperty;			if ( p.matchName === "ADBE Vector Shape - Rect") addPB(p);		}		return ret;	}
	//-------------------------------------------------------------------------	var resizeRect = function(pb,dir,ad)	{
		if (pb.matchName !== "ADBE Vector Shape - Rect") return;		var psz = pb.property("ADBE Vector Rect Size");		var pps = pb.property("ADBE Vector Rect Position");
		if (ad>=0) ad = 1; else ad = -1;		var resize = resizeVale * ad;		var move = resize/2;		var vsz = psz.value;		var vps = pps.value;		switch (dir)		{			case 0: 				vsz[1] += resize;				vps[1] -= move;				break;			case 1: 				vsz[0] += resize;				vps[0] += move;				break;			case 2: 				vsz[1] += resize;				vps[1] += move;				break;			case 3: 				vsz[0] += resize;				vps[0] -= move;				break;		}		psz.setValue(vsz);		pps.setValue(vps);	}
	//-------------------------------------------------------------------------	var execResize = function(dir,ad)	{		var sel = getVR();		if (sel.length<=0) return;		for (var i = 0; i < sel.length; i++ )		{			resizeRect(sel[i],dir,ad);		}	}
	//-------------------------------------------------------------------------	var moveRect = function(pb,dir,v)	{
		if (v<=0) return;
		if (pb.matchName !== "ADBE Vector Shape - Rect") return;		var pps = pb.property("ADBE Vector Rect Position");
		var move = v;		var vps = pps.value;		switch (dir)		{			case 0: 				vps[1] -= move;				break;			case 1: 				vps[0] += move;				break;			case 2: 				vps[1] += move;				break;			case 3: 				vps[0] -= move;				break;		}		pps.setValue(vps);	}
	//-------------------------------------------------------------------------	var execMove = function(dir,v)	{		var sel = getVR();		if (sel.length<=0) return;		for (var i = 0; i < sel.length; i++ )		{			moveRect(sel[i],dir,v);		}	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "vector Rect Resize", [ 821,  279,  821+ 262,  279+ 443]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var stInfo = winObj.add("statictext", [  14,    5,   14+ 239,    5+  20], "キーフレームには対応していません");
	var pnl1 = winObj.add("panel", [  12,   24,   12+ 238,   24+ 261], "Resize" );
	var btnTopInc = pnl1.add("button", [  88,    6,   88+  50,    6+  40], "top Inc" );
	var btnTopDec = pnl1.add("button", [  88,   48,   88+  50,   48+  40], "top Dec" );
	var btnRightInc = pnl1.add("button", [ 185,   64,  185+  40,   64+  50], "right Inc" );
	var btnRightDec = pnl1.add("button", [ 142,   64,  142+  40,   64+  50], "right Dec" );
	var btnBtmInc = pnl1.add("button", [  88,  133,   88+  50,  133+  40], "btn Inc" );
	var btnBtmDec = pnl1.add("button", [  88,   92,   88+  50,   92+  40], "btm Dec" );
	var btnLeftInc = pnl1.add("button", [   5,   64,    5+  40,   64+  50], "left Inc" );
	var btnLeftDec = pnl1.add("button", [  46,   64,   46+  40,   64+  50], "left Dec" );
	var rbS1 = pnl1.add("radiobutton", [  32,  199,   32+  30,  199+  20], "1");
	var rbS2 = pnl1.add("radiobutton", [  72,  199,   72+  30,  199+  20], "2");
	rbS2.value = true;
	var rbS3 = pnl1.add("radiobutton", [ 108,  199,  108+  30,  199+  20], "3");
	var rbS4 = pnl1.add("radiobutton", [ 144,  199,  144+  30,  199+  20], "4");
	var rbS5 = pnl1.add("radiobutton", [ 177,  199,  177+  30,  199+  20], "5");
	var rbS6 = pnl1.add("radiobutton", [  32,  225,   32+  30,  225+  20], "6");
	var rbS7 = pnl1.add("radiobutton", [  72,  225,   72+  30,  225+  20], "7");
	var rbS8 = pnl1.add("radiobutton", [ 108,  225,  108+  30,  225+  20], "8");
	var rbS9 = pnl1.add("radiobutton", [ 144,  225,  144+  30,  225+  20], "9");
	var rbS10 = pnl1.add("radiobutton", [ 177,  225,  177+  45,  225+  20], "10");
	var pnl2 = winObj.add("panel", [  13,  292,   13+ 240,  292+ 145], "move" );
	var btnUp = pnl2.add("button", [  87,   12,   87+  60,   12+  40], "up" );
	var btnRight = pnl2.add("button", [ 150,   28,  150+  40,   28+  60], "right" );
	var btnDown = pnl2.add("button", [  87,   63,   87+  60,   63+  40], "down" );
	var btnLeft = pnl2.add("button", [  45,   28,   45+  40,   28+  60], "left" );
	var edMoveValue = pnl2.add("edittext", [  45,  109,   45+ 145,  109+  21], "10");
	rbS1.sz = 1;	rbS2.sz = 2;	rbS3.sz = 3;	rbS4.sz = 4;	rbS5.sz = 5;	rbS6.sz = 6;	rbS7.sz = 7;	rbS8.sz = 8;	rbS9.sz = 9;	rbS10.sz = 10;		//-------------------------------------------------------------------------
	var getMoveValue = function()
	{
		var s = edMoveValue.text;
		if ((isNaN(s)==true)||(s=="")) {
			s = 
			edMoveValue.text = "10";
		}
		var v = eval(s);
		if ( v == 0) {
			v = 10;
			edMoveValue.text = "10";
		}
		return v;
	}
	//-------------------------------------------------------------------------
	var clickFunc1 = function(){resizeVale = this.sz;}	rbS1.onClick = clickFunc1;
	rbS2.onClick = clickFunc1;
	rbS3.onClick = clickFunc1;
	rbS4.onClick = clickFunc1;
	rbS5.onClick = clickFunc1;
	rbS6.onClick = clickFunc1;
	rbS7.onClick = clickFunc1;
	rbS8.onClick = clickFunc1;
	rbS9.onClick = clickFunc1;
	rbS10.onClick = clickFunc1;
	
		btnTopInc.onClick = function() {execResize(0,1);}
	btnTopDec.onClick = function() {execResize(0,-1);}
	btnRightInc.onClick = function() {execResize(1,1);}
	btnRightDec.onClick = function() {execResize(1,-1);}
	btnBtmInc.onClick = function() {execResize(2,1);}
	btnBtmDec.onClick = function() {execResize(2,-1);}
	btnLeftInc.onClick = function() {execResize(3,1);}	btnLeftDec.onClick = function() {execResize(3,-1);}
	btnUp.onClick = function() { execMove(0,getMoveValue());}	btnRight.onClick = function() { execMove(1,getMoveValue());}	btnDown.onClick = function() { execMove(2,getMoveValue());}	btnLeft.onClick = function() { execMove(3,getMoveValue());}	
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);