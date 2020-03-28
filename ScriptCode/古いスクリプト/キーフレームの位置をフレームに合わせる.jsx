
(function(me){
	//----------------------------------
	//prototype登録
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	//拡張子のみを取り出す。
	String.prototype.getExt = function(){
		var r="";var i=this.lastIndexOf(".");if (i>=0) r=this.substring(i);
		return r;
	}
	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));

	var frameRate = 24.0;
	
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "キーフレームをフレームにピッタリに合わせる", [ 0,  0,  230,   120]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var pnlTarget = winObj.add("panel", [   5,    5,    5+ 220,    5+  75], "Target" );
	var rbProp = pnlTarget.add("radiobutton",  [  10,    5,   10+ 200,   5 + 20], "プロパティ");
	var rbLayer = pnlTarget.add("radiobutton", [  10,  25,   10+ 200,  25+  20], "レイヤー");
	var rbComp = pnlTarget.add("radiobutton", [  10,  45,   10+ 200,  45+  20], "コンポジション");
	rbLayer.value = true;
	var btnExec = winObj.add("button", [   5,   85,    5+ 220,   85+  30], "実行" );
	//-------------------------------------------------------------------------
	function getMode()
	{
		var ret = 0;
		if (rbProp.value == true) ret =0;
		else if (rbLayer.value == true) ret =1;
		else if (rbComp.value == true) ret =2;
		return ret;
	}
	//-------------------------------------------------------------------------
	function setMode(m)
	{
		rbProp.value = rbLayer.value = rbComp.value = false;
		switch(m)
		{
			case 2: rbComp.value = true; break;
			case 1: rbLayer.value = true; break;
			case 0: 
			default:
				rbProp.value = true; break;
		}
	}
	//-------------------------------------------------------------------------
	function getLayerFromProp(p)
	{
		var pp = p;
		if (p.propertyDepth>0){
			for (var i=0; i<p.propertyDepth;i++){
				pp = pp.parentProperty;
			}
		}
		if ( pp.matchName.indexOf("Layer">=0)){
			return pp;
		}else{
			return null;
		}
	}
	//-------------------------------------------------------------------------
	function getKey(prop,idx)
	{
		var k = new Object;
		try{
			k.time = prop.keyTime(idx);
			k.value = prop.keyValue(idx);
						/*			//keyInInterpolationType()			//keyInSpatialTangent()			//keyInTemporalEase()			//keyOutInterpolationType()			//keyOutSpatialTangent()			//keyOutTemporalEase()			//keyRoving()			//keySelected()			//keySpatialAutoBezier()			//keySpatialContinuous()			//keyTemporalAutoBezier()			//keyTemporalContinuous()			*/
			k.keyInInterpolationType = prop.keyInInterpolationType(idx);
			k.keyOutInterpolationType = prop.keyOutInterpolationType(idx);
			
			k.keyInTemporalEase = prop.keyInTemporalEase(idx);
			k.keyOutTemporalEase = prop.keyOutTemporalEase(idx);
	
			k.keyTemporalAutoBezier = prop.keyTemporalAutoBezier(idx);
			k.keyTemporalContinuous = prop.keyTemporalContinuous(idx);
	
			var vt = prop.propertyValueType;			if ( (vt == PropertyValueType.TwoD_SPATIAL)||(vt == PropertyValueType.ThreeD_SPATIAL)){
				k.keyRoving = prop.keyRoving(idx);
			}
			k.isSpatial = prop.isSpatial;
			if ( prop.isSpatial == true)
			{
				k.keyInSpatialTangent = prop.keyInSpatialTangent(idx);
				k.keyOutSpatialTangent = prop.keyOutSpatialTangent(idx);
	
				
				k.keySpatialAutoBezier = prop.keySpatialAutoBezier(idx);
				k.keySpatialContinuous = prop.keySpatialContinuous(idx);
			}
			k.selected = prop.keySelected(idx);
			return k;
		}catch(e){
			alert("getKey error! \n"+ prop.matchName +"\n" + vt +"\n" + e.toString());
		}
	}
	//-------------------------------------------------------------------------
	function setKey(prop,idx,k)
	{
		try{
			prop.setValueAtTime(k.time,k.value);
			var i = idx;
			prop.setTemporalEaseAtKey(i,k.keyInTemporalEase,k.keyOutTemporalEase);
			
			
			prop.setTemporalAutoBezierAtKey(i, k.keyTemporalAutoBezier);
			prop.setTemporalContinuousAtKey(i, k.keyTemporalContinuous);
	
			prop.setInterpolationTypeAtKey(i,k.keyInInterpolationType,k.keyOutInterpolationType);
						var vt = prop.propertyValueType;			if ( (vt == PropertyValueType.TwoD_SPATIAL)||(vt == PropertyValueType.ThreeD_SPATIAL)){				if (k.keyRoving != undefined)
					prop.setRovingAtKey(i,k.keyRoving);			}
			if ( k.isSpatial == true)
			{
				prop.setSpatialTangentsAtKey(i,k.keyInSpatialTangent, k.keyOutSpatialTangent);
				prop.setSpatialAutoBezierAtKey(i, k.keySpatialAutoBezier);
				prop.setSpatialContinuousAtKey(i, k.keySpatialContinuous);
			}
			prop.setSelectedAtKey(i,k.selected);
		}catch(e){
			alert("setKey error! \n"+ prop.matchName +"\n" + vt +"\n" + e.toString());
		}
	}
	//-------------------------------------------------------------------------
	function chkProcKeyTime(prop)
	{
		try{
			for ( var i=1; i<=prop.numKeys; i++){
				var t = prop.keyTime(i) * frameRate;
				if ( t != Math.round(t) ) return false;
			}
		}catch(e){
			alert("chkProcKeyTime error! \n"+ e.toString());
		}	}
	//-------------------------------------------------------------------------
	function propExec(prop)
	{
		if ( prop instanceof Property){
			if ( prop.numKeys<=0) return;
			if ( chkProcKeyTime(prop)==true) return;
			//プロパティがタイプリマップのときはふれーむ０にキーを打っておく
			var isRemap = (prop.matchName == "ADBE Time Remapping");
			if (isRemap == true ){
				if ( prop.keyTime(1) >0){
					prop.setValueAtTime(0,prop.valueAtTime(0,false));
				}
			}
			var keys = [];
			for ( var i=1; i<=prop.numKeys; i++) keys.push(getKey(prop,i));
			
			//いったん全てのキーを削除。タイムリマップは先頭の1個は消さない
			if (isRemap == true ){
				for ( var i=prop.numKeys; i>1; i--) prop.removeKey(i);
			}else{
				for ( var i=prop.numKeys; i>=1; i--) prop.removeKey(i);
			}
			for ( var i=0; i<keys.length; i++) {
				keys[i].time = Math.round(keys[i].time * frameRate) / frameRate;
				setKey(prop,i+1,keys[i]);
			};
			for ( var i=0; i<keys.length; i++) {
				prop.setSelectedAtKey(i+1,keys[i].selected);
			}
						
		}else if ( prop instanceof PropertyGroup){
			if ( prop.numProperties>0){
				for ( var i=1; i<=prop.numProperties; i++){
					propExec( prop.property(i));
				}
			}
		}
	}
	//-------------------------------------------------------------------------
	function layerExec(lyr)
	{
		if ( lyr.numProperties>0)
		{
			for ( var i=1; i<=lyr.numProperties; i++) propExec(lyr.property(i));
		}		//layr.startTime = Math.round(lyr.startTime * frameRate) / frameRate;		lyr.inPoint = Math.round(lyr.inPoint * frameRate) / frameRate;		lyr.outPoint = Math.round(lyr.outPoint * frameRate) / frameRate;		
	}
	//-------------------------------------------------------------------------
	function compExec(cmp)
	{
		if ( cmp.numLayers>0)
		{
			for ( var i=1; i<=cmp.numLayers; i++) layerExec(cmp.layer(i));
		}
	}
	//-------------------------------------------------------------------------
	function exec()
	{
		var ac = app.project.activeItem;
		if ( (ac instanceof CompItem)==false) {
			alert("コンポジションをアクティブにしてね");
			return;
		}
		
		var mode = getMode();
		frameRate = ac.frameRate;
		if ( mode ==0){
		
			if ( ac.selectedProperties.length<=0){
				alert("プロパティを選んでください");
				return;
			}
			app.beginUndoGroup(scriptName);
			var ps = [];
			for ( var i=0; i<ac.selectedProperties.length; i++){
				ps.push(ac.selectedProperties[i]);
			}
			for (var i=0; i<ps.length;i++){
				propExec(ps[i]);
			}
			app.endUndoGroup();
		}else if ( mode ==1){
			if ( ac.selectedLayers.length<=0){
				alert("レイヤを選んでくだぽい");
				return;
			}
			app.beginUndoGroup(scriptName);
			for ( var i=0; i<ac.selectedLayers.length; i++){
				layerExec(ac.selectedLayers[i]);
			}
			app.endUndoGroup();
		}else if ( mode ==2){
			if ( ac.numLayers<=0){
				alert("レイヤがない");
				return;
			}
			app.beginUndoGroup(scriptName);
			compExec(ac);
			app.endUndoGroup();
		}
		
	}
	btnExec.onClick = exec;
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		
		var b = pnlTarget.bounds;
		b[0] = 5;
		b[2] = w -5;
		pnlTarget.bounds = b;
		
		var b = btnExec.bounds;
		b[0] = 5;
		b[2] = w -5;
		btnExec.bounds = b;
		
	}
	resize();
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;


	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);