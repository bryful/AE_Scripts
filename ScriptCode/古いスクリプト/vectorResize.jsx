(function (me){
	var resizeValue = 2;	var moveValue = 2;	var lbInfo = null;	//-------------------------------------------------------------------------
	//選択されたプロパティグループを獲得	var getVectors = function()	{		var ret = [];		function addP(p)		{			if (p instanceof Property) {				p = p.parentProperty;			}			if ( !(p instanceof PropertyGroup)) return;						if ( p.matchName=="ADBE Vector Group") return; 			if ( p.matchName=="ADBE Vector Shape - Group") return; 			if ( p.matchName.indexOf("ADBE Vector")!=0) return;						if (ret.length >0) {				for ( var j=0; j<ret.length; j++){					if ( (ret[j].propertyIndex == p.propertyIndex)&&(ret[j].propertyDepth == p.propertyDepth)) {						return;					}				}			}			ret.push(p);		}		var ac = app.project.activeItem;		if (!(ac instanceof CompItem)) {			return ret;		}		var ps = ac.selectedProperties;		if (ps.length <=0) return ret;				for ( var i=0; i<ps.length; i++) {			addP(ps[i]);		}		return ret;	}	//-------------------------------------------------------------------------
	var vectorKind = function(p) 	{		var ret = -1;		var kind = p.matchName;		if (kind == "ADBE Vector Shape - Rect") {			ret = 0;		}else if (kind == "ADBE Vector Shape - Ellipse") {			ret = 1;		}else if (kind == "ADBE Vector Shape - Star") {			ret = 2;		}		return ret;	}	//-------------------------------------------------------------------------
	var execResizeRect = function(p,dir,inout)	{		if (p.matchName !="ADBE Vector Shape - Rect") {			lbInfo.text = "resize error!";			return;		}		var szP = p.property("ADBE Vector Rect Size");		var psP = p.property("ADBE Vector Rect Position");		if ( (szP.numKeys>0)||(psP.numKeys>0)) {			lbInfo.text = "resize error keyframe!";			return;		}		var szV = szP.value;		var psV = psP.value;		var v = resizeValue * inout;		switch(dir){		case 0:			szV[1] += v;			psV[1] -= v /2;			break;		case 1:			szV[0] += v;			psV[0] += v /2;			break;		case 2:			szV[1] += v;			psV[1] += v /2;			break;		case 3:			szV[0] += v;			psV[0] -= v /2;			break;		}		if ((szV[0]<=0)||(szV[1]<=0)){			lbInfo.text = "no resize";		}else{			szP.setValue(szV);			psP.setValue(psV);			lbInfo.text = "resize OK";		}	}	//-------------------------------------------------------------------------
	var execResizeEllipse = function(p,dir,inout)	{		if (p.matchName !="ADBE Vector Shape - Ellipse") {			lbInfo.text = "resize error!";			return;		}		var szP = p.property("ADBE Vector Ellipse Size");		var psP = p.property("ADBE Vector Ellipse Position");		if ( (szP.numKeys>0)||(psP.numKeys>0)) {			lbInfo.text = "resize error keyframe!";			return;		}		var szV = szP.value;		var psV = psP.value;		var v = resizeValue * inout;		switch(dir){		case 0:			szV[1] += v;			psV[1] -= v /2;			break;		case 1:			szV[0] += v;			psV[0] += v /2;			break;		case 2:			szV[1] += v;			psV[1] += v /2;			break;		case 3:			szV[0] += v;			psV[0] -= v /2;			break;		}		if ((szV[0]<=0)||(szV[1]<=0)){			lbInfo.text = "no resize";		}else{			szP.setValue(szV);			psP.setValue(psV);			lbInfo.text = "resize OK";		}			}	//-------------------------------------------------------------------------
	var execResize = function(dir,inout)	{		var vs = getVectors();				if (vs.length>0) {			for ( var i=0; i<vs.length; i++){				var p = vs[i];				switch(vectorKind(p)){				case 0:					execResizeRect(p,dir,inout);					break;				case 1:					execResizeEllipse(p,dir,inout);					break;				}			}		}else{			lbInfo.text ="resize. no target!";		}	}	//-------------------------------------------------------------------------
	var execMoveSub = function(p, dir)	{		if ( (p.matchName =="ADBE Vector Shape - Rect")||(p.matchName =="ADBE Vector Shape - Ellipse")||(p.matchName =="ADBE Vector Shape - Star")) {		}else{			lbInfo.text = "move error!";			return;		}		var psP = p.property("Position");		if ( psP.numKeys>0 ) {			lbInfo.text = "move error keyframe!";			return;		}		var psV = psP.value;		var v = moveValue;		switch(dir){		case 0:			psV[1] -= v;			break;		case 1:			psV[0] += v;			break;		case 2:			psV[1] += v;			break;		case 3:			psV[0] -= v;			break;		}		psP.setValue(psV);		lbInfo.text = "move OK";	}	//-------------------------------------------------------------------------
	var execMove = function(dir)	{		var vs = getVectors();		if (vs.length>0) {			for ( var i=0; i<vs.length; i++){				execMoveSub(vs[i],dir);			}		}else{			lbInfo.text ="move. no target!";		}	}
	
	//*************************
	//MainWindow
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "vectorResize", [0,0,0+290,0+490],{resizeable:true});
	lbInfo = winObj.add("statictext",[10, 10, 10+270, 10+14],"Shape Resize and Move");
		var valueTable = [0.5,1,2,3,4,5,6,7,8,9,10,12,15,20,25,30,50,100];	var rbS = [];	var rbM = [];	var btnR = [];
	var btnM = [];
	//*************************
	//controls
	var gbResize = winObj.add("panel",[10, 30, 10+270, 30+190],"Resize");		var x0 = 4;	var y0 = 10;	var w = 40;	var h = 18;	var y = y0;	for ( var i=0; i<18; i++) {		if (i==9) {			y = y0;			x0 += w;		}		rbS.push(null);		rbS[i] = gbResize.add("radiobutton",[x0, y, x0+w, y+h],valueTable[i]+"");		rbS[i].rsValue = valueTable[i];		rbS[i].onClick = function(){ resizeValue = this.rsValue;}		y += h;	}	rbS[2].value = true;	btnR[0] = gbResize.add("button",[157, 10, 157+32, 10+32],"上");
	btnR[1] = gbResize.add("button",[157, 44, 157+32, 44+32],"上");
	btnR[2] = gbResize.add("button",[221, 75, 221+32, 75+32],"右");
	btnR[3] = gbResize.add("button",[189, 75, 189+32, 75+32],"右");
	btnR[4] = gbResize.add("button",[157, 140, 157+32, 140+32],"下");
	btnR[5] = gbResize.add("button",[157, 106, 157+32, 106+32],"下");
	btnR[6] = gbResize.add("button",[93, 75, 93+32, 75+32],"左");
	btnR[7] = gbResize.add("button",[125, 75, 125+32, 75+32],"左");
	btnR[0].onClick = function() {execResize(0,1);}
	btnR[1].onClick = function() {execResize(0,-1);}
	btnR[2].onClick = function() {execResize(1,1);}
	btnR[3].onClick = function() {execResize(1,-1);}
	btnR[4].onClick = function() {execResize(2,1);}
	btnR[5].onClick = function() {execResize(2,-1);}
	btnR[6].onClick = function() {execResize(3,1);}
	btnR[7].onClick = function() {execResize(3,-1);}
		var gbMove = winObj.add("panel",[10, 230, 10+270, 230+180],"Move");
		var x0 = 4;	var y0 = 8;	var w = 40;	var h = 18;	var y = y0;	for ( var i=0; i<18; i++) {		if (i==9) {			y = y0;			x0 += w;		}		rbM.push(null);		rbM[i] = gbMove.add("radiobutton",[x0, y, x0+w, y+h],valueTable[i]+"");		rbM[i].mvValue = valueTable[i];		rbM[i].onClick = function(){ moveValue = this.mvValue;}		y += h;	}	rbM[2].value = true;		btnM[0] = gbMove.add("button",[141, 27, 141+48, 27+32],"上");
	btnM[1] = gbMove.add("button",[189, 73, 189+48, 73+32],"右");
	btnM[2] = gbMove.add("button",[141, 119, 141+48, 119+32],"下");
	btnM[3] = gbMove.add("button",[93, 73, 93+48, 73+32],"左");
		btnM[0].onClick = function() {execMove(0);}		btnM[1].onClick = function() {execMove(1);}		btnM[2].onClick = function() {execMove(2);}		btnM[3].onClick = function() {execMove(3);}		var gbUtils = winObj.add("panel",[10, 420, 10+270, 420+60],"Utils");
	var btnSwapSize = gbUtils.add("button",[10, 10, 10+250, 10+24],"横縦サイズ入れ替え");
	
	//*************************
	btnSwapSize.onClick = function(){
		alert("横縦サイズ入れ替え");
	}
	//*************************
	//window show
	if ( ( me instanceof Panel) == false){
		winObj.center();
		winObj.show();
	}
})(this);
