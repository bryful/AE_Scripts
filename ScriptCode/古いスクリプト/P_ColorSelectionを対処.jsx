(function (me){
//*************************
	var getComp = function()	{		var ret = [];		if (app.project.selection.length>0) {			for (var i=0; i<app.project.selection.length; i++ ){				if (app.project.selection[i] instanceof CompItem) {					ret.push(app.project.selection[i]);				}			}		}		return ret;	}//*************************
	var getLayers = function()	{		var ret = [];		var ac = app.project.activeItem;				if (ac instanceof CompItem) {			if (ac.selectedLayers.length>0) {				ret = ac.selectedLayers;			}		}		return ret;	}//*************************var getPCS = function(lyr) {	var ret = [];	var fxg = lyr.property("ADBE Effect Parade");	if (fxg.numProperties>0){		for (var i=1; i<=fxg.numProperties;i++) {			if (fxg.property(i).matchName ==="PSOFT COLORSELECTION"){				if (fxg.property(i).enabled === true) {					ret.push(fxg.property(i).propertyIndex);				}			}		}	}		return ret;}//*************************	var getColors = function(p)	{		var  ret = {};		ret.rev = false;		ret.tbl = [];		ret.count = 0;		ret.index = p.propertyIndex;		if ( (p.matchName !=="PSOFT COLORSELECTION")||(p.enabled === false)) return ret;		ret.rev = (p.property(2).value===1);		var view = p.property(1).value;		if (view <= 1) return ret;		//----		if ( (view==3)||(view==4) ){			if ( p.property(6).value ===1){				var sc = p.property(5).value * 4;				for ( var i= 0; i<sc; i++) {					var idx = 7 + i * 3;					if (p.property(idx).value === 1) {						ret.tbl.push(p.property(idx+1).value);					}				}			}		}		//----		if ( (view==3)||(view==5) ){			if ( p.property(59).value ===1){				var sc = p.property(58).value * 4;				for ( var i= 0; i<sc; i++) {					var idx = 60 + i * 3;					if (p.property(idx).value === 1) {						ret.tbl.push(p.property(idx+1).value);					}				}			}		}		ret.count = ret.tbl.length;		return ret;	}
//*************************
	var toFs = function(p)	{		var ret = false;		var idx = p.propertyIndex;		var fxg = p.parentProperty;		var ct = getColors(p);		if (ct.count<=0) return ret;		if (fxg.canAddProperty("F's SelectColor")==true) {			var fssc = fxg.addProperty("F's SelectColor");			if (fssc !=null) {				var rev = fssc.property(17);				rev.setValue(ct.rev);				for ( var i=0; i<ct.count; i++){					if (i>=8) {						alert("色数が8色超えています！");						break;					}					var  e = fssc.property(i*2+1);					e.setValue(true);					var c = fssc.property(i*2+2);					c.setValue(ct.tbl[i]);				}				fxg.property(idx).enabled = false;				fssc.moveTo(idx+1);				ret = true;			}		}				return ret;	}//*************************var execLayer = function(){	var lyrs = getLayers();	if (lyrs.length<=0) {		alert("レイヤが選択されていません！");		return;	}	var cnt = 0;	app.beginUndoGroup("P_対処レイヤー");	for ( var i=0; i<lyrs.length;i++){		var pcs = getPCS(lyrs[i]);		if (pcs.length>0) {			var fxg = lyrs[i].property("ADBE Effect Parade");			for ( var j=pcs.length -1 ; j>=0; j--) {				if (toFs(fxg.property(pcs[j]))) {					cnt++;				}			}		}	}	app.endUndoGroup();	alert(cnt +"箇所を対処");}//*************************var execComp = function(){	var comps = getComp();	if (comps.length<=0) {		alert("コンポが選択されていません！");		return;	}	var cnt = 0;	app.beginUndoGroup("P_対処コンポ");	for (var cc = 0; cc<comps.length; cc++) {		var cmp = comps[cc];		if (cmp.numLayers<=0) continue;				for ( var i=1; i<=cmp.numLayers;i++){			var pcs = getPCS(cmp.layer(i));			if (pcs.length>0) {				var fxg = cmp.layer(i).property("ADBE Effect Parade");				for ( var j=pcs.length -1 ; j>=0; j--) {					if (toFs(fxg.property(pcs[j]))) {						cnt++;					}				}			}		}	}		app.endUndoGroup();	alert(cnt +"箇所を対処");}
//*************************var undoLayerSub = function(lyr){	var ret = false;	var fxg = lyr.property("ADBE Effect Parade");		if ( (fxg==null)||(fxg.numProperties<=1)) return ret;		for ( var i=fxg.numProperties-1; i>=1; i--){		var p1 = fxg.property(i);		var p2 = fxg.property(i+1);		if ( 				(p1.matchName == "PSOFT COLORSELECTION")			&&(p1.enabled == false)			&&(p2.matchName == "F's SelectColor")			&&(p2.enabled == true)) {				p1.enabled = true;				p2.remove();				ret = true;			}	}		return ret;}//*************************var undoLayer = function(){	var lyrs = getLayers();	if (lyrs.length<=0) {		alert("レイヤが選択されていません！");		return;	}	var cnt = 0;	app.beginUndoGroup("P_対処レイヤーアンドー");	for ( var i=0; i<lyrs.length;i++){		if  ( undoLayerSub(lyrs[i])) {			cnt++;		}	}	app.endUndoGroup();	alert(cnt +"箇所を対処");	}//*************************var undoComp = function(){	var comps = getComp();	if (comps.length<=0) {		alert("コンポが選択されていません！");		return;	}	var cnt = 0;	app.beginUndoGroup("P_対処コンポ アンドー");	for (var cc = 0; cc<comps.length; cc++) {		var cmp = comps[cc];		if (cmp.numLayers<=0) continue;				for ( var i=1; i<=cmp.numLayers;i++){			if  ( undoLayerSub(cmp.layer(i))) {				cnt++;			}		}	}		app.endUndoGroup();	alert(cnt +"箇所を対処");}
//*************************
//MainWindow
var winObj = ( me instanceof Panel) ? me : new Window("palette", "P_ColorSelectionが無い時に", [0,0,0+352,0+168],{resizeable:true});

//*************************
//controls
var lbCaption = winObj.add("statictext",[11, 11, 11+295, 11+12],"psoft P_ColorSelectionをF's SelectColorに置き換えます");
var btnLayer = winObj.add("button",[11, 29, 11+295, 29+23],"レイヤーに対処");
var btnUndoLayer = winObj.add("button",[11, 58, 11+295, 58+23],"元に戻す(layer)");
var btnComp = winObj.add("button",[11, 87, 11+295, 87+23],"コンポに対処");
var btnUndoComp = winObj.add("button",[11, 116, 11+295, 116+23],"元に戻す(Comp)");
var lbInfo1 = winObj.add("statictext",[11, 145, 11+330, 145+12],"実行後、P_ColorSelectionは非表示にします。元に戻すで戻せます。");

//*************************
//button click event
btnLayer.onClick = execLayer;
btnComp.onClick = execComp;
btnUndoLayer.onClick = undoLayer;
btnUndoComp.onClick = undoComp;
//*************************
//resize event
winObj.onResize= function(){
	var b = winObj.bounds;
	var bw = b[2]-b[0];
	var lbCaption_b = lbCaption.bounds;
	lbCaption_b[2] = bw - lbCaption_b[0];
	lbCaption.bounds = lbCaption_b;
	var btnLayer_b = btnLayer.bounds;
	btnLayer_b[2] = bw - btnLayer_b[0];
	btnLayer.bounds = btnLayer_b;
	var btnUndoLayer_b = btnUndoLayer.bounds;
	btnUndoLayer_b[2] = bw - btnUndoLayer_b[0];
	btnUndoLayer.bounds = btnUndoLayer_b;
	var btnComp_b = btnComp.bounds;
	btnComp_b[2] = bw - btnComp_b[0];
	btnComp.bounds = btnComp_b;
	var btnUndoComp_b = btnUndoComp.bounds;
	btnUndoComp_b[2] = bw - btnUndoComp_b[0];
	btnUndoComp.bounds = btnUndoComp_b;
}

//*************************
//window show
	if ( ( me instanceof Panel) == false){
		winObj.center();
		winObj.show();
	}
})(this);
