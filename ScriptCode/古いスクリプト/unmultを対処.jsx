(function (me){
//*************************
	//すべてのCompを獲得	//レイヤのないCombは除外	var getAllComp = function()	{		var ret = [];		if (app.project.numItems>0) {			for (var i=1; i<=app.project.numItems; i++ ){				var cmb = app.project.items[i];				if ( cmb instanceof CompItem) {					if ( cmb.numLayers>0) {						ret.push(cmb);					}				}			}		}		return ret;	}//*************************var getUnmult = function(lyr) {	var ret = [];	var fxg = lyr.property("ADBE Effect Parade");	if (fxg.numProperties>0){		for (var i=1; i<=fxg.numProperties;i++) {			var mn = fxg.property(i).matchName;			if ( (mn==="KNSW Unmult")||(mn==="RG unmult")){				ret.push(fxg.property(i));			}		}	}		return ret;}//*************************var execSub = function(lyr){	var newFX= "F's CreateAlpha";	var ret = 0;	var unmultis = getUnmult(lyr);	if (unmultis.length<=0) {		return ret;	}	for ( var i=0; i<unmultis.length;i++){		var p = unmultis[i];		var idx = p.propertyIndex;		var fxg = p.parentProperty;		if (fxg.canAddProperty(newFX)==true) {			var ca = fxg.addProperty(newFX);			if (ca !=null) {				fxg.property(idx).enabled = false;				ca.moveTo(idx+1);				fxg.property(idx).remove();				ret++;			}		}	}	return ret;}//*************************var exec = function(){	var comps = getAllComp();	if (comps.length<=0) {		alert("コンポがないです！");		return;	}	var cnt = 0;	app.beginUndoGroup("Unmultiに対処");	for (var cc = 0; cc<comps.length; cc++) {		var cmp = comps[cc];		if (cmp.numLayers<=0) continue;				for ( var i=1; i<=cmp.numLayers;i++){			cnt += execSub(cmp.layer(i));		}	}		app.endUndoGroup();	alert(cnt +"箇所を対処");}
//*************************
//MainWindow
var winObj = ( me instanceof Panel) ? me : new Window("palette", "Unmultiを対処", [0,0,0+120,0+45]);

//*************************
//controls
var btnExec = winObj.add("button",[10, 10, 10+100, 10+25],"Unmultiを対処");

//*************************
//button click event
btnExec.onClick = exec;
//*************************

//*************************
//window show
	if ( ( me instanceof Panel) == false){
		winObj.center();
		winObj.show();
	}
})(this);
