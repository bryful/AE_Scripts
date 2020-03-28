var adjustmentLayerCount2_ = 1;


(function(me){
	var funcIndex = -1;
	var funcList = [];
	var funcListCaptions = [];
	var btnExec = null
	var funcListbox = null;
	//-------------------------------------------------------------------------
	function getLayer()
	{
		var ret = null;
		var ac = app.project.activeItem;
		if (ac instanceof CompItem) {
			ret = ac.selectedLayers;
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function adjustChange()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。");
			return;
		}
		for (var i=0; i<lyrs.length; i++){
			lyrs[i].adjustmentLayer = ! lyrs[i].adjustmentLayer;
		}
	}
	//-------------------------------------------------------------------------
	function guideChange()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。");
			return;
		}
		for (var i=0; i<lyrs.length; i++){
			lyrs[i].guideLayer = ! lyrs[i].guideLayer;
		}
	}
	//-------------------------------------------------------------------------
	function layerSourceSelect()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length != 1)){
			alert("レイヤを1個だけ選択してください。",this.cap);
			return;
		}
		if ( (lyrs[0] instanceof AVLayer)==false){
			alert("ソースなし");
			return;
		}
		var s = lyrs[0].source;
		s.selected = false;
		s.selected = true;
	}
	//-------------------------------------------------------------------------
	function compSourceSelect()
	{
		var ac = app.project.activeItem;
		if (  ( ac instanceof CompItem)==false){
			alert("コンポがnot Actived です。");
			return;
		}
		if ( ac.selected == true) ac.selected = false;
		ac.selected = true;
	}
	//-------------------------------------------------------------------------
	function inPointToCurrent()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		for (var i=0; i<lyrs.length; i++){
			lyrs[i].inPoint = lyrs[i].containingComp.time;
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function outPointToCurrent()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		for (var i=0; i<lyrs.length; i++){
			lyrs[i].outPoint = lyrs[i].containingComp.time;
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function outPointToEnd()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		for (var i=0; i<lyrs.length; i++){
			lyrs[i].outPoint = lyrs[i].containingComp.duration;
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function inPointToStart()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		for (var i=0; i<lyrs.length; i++){
			lyrs[i].inPoint = 0;
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function dupli()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		var ls = [];
		for (var i=0; i<lyrs.length; i++){
			ls.push(lyrs[i].duplicate());
			lyrs[i].selected = false;
		}
		if (ls.length>1){
			for ( var i = ls.length-1; i>0; i--){
				ls[i].moveAfter(ls[0]);
				ls[i].selected = true;
			}
		}
		ls[0].selected = true;
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function createAdjust()
	{
		var ac = app.project.activeItem;
		var targetLayer = null;
		if (ac instanceof CompItem) {
			if ( ac.selectedLayers.length>0){
				targetLayer = ac.selectedLayers[0];
			}
		}else{
			alert("コンポを選択してください。",this.cap);
			return;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		var sl = ac.layers.addShape();
		sl.name = "調整シェイプレイヤ " + adjustmentLayerCount2_;
		adjustmentLayerCount2_++;
		if (adjustmentLayerCount2_ >999) adjustmentLayerCount2_ = 1;
		
		var rct = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
		rct.name = "前面長方形";
		//サイズをあわせるエクスプレッション
		rct.property("ADBE Vector Rect Size").expression = "[thisComp.width*thisComp.pixelAspect,thisComp.height];";
		rct.property("ADBE Vector Rect Position").expression = "[0,0];";
		rct.property("ADBE Vector Rect Roundness").expression = "0;";

		sl.property("ADBE Transform Group").property("ADBE Anchor Point").expression = "[0,0];";
		sl.property("ADBE Transform Group").property("ADBE Position").expression = "[thisComp.width/2, thisComp.height/2];";
		

		var fil = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
		fil.name = "塗り";
		fil.property("ADBE Vector Fill Color").setValue( [1,1,1] );
		sl.adjustmentLayer = true;
		if ( targetLayer != null)
		{
			sl.moveBefore(targetLayer); 
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function reverceShy()
	{
		var ac = app.project.activeItem;
		if (ac instanceof CompItem) {
			if (ac.numLayers<=0){
				alert("レイヤが無い",funcListCaptions[funcIndex]);
				return;
			}
		}else{
			alert("コンポを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		for ( var i=1; i<=ac.numLayers;i++)
			ac.layer(i).shy = ! ac.layer(i).shy;
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function revLayer()
	{
		var ac = app.project.activeItem;
		if ( (ac instanceof CompItem)==false){
			alert("コンポを選択して下さい。",funcListCaptions[funcIndex]);
			return;
		}
		function swapLayer(cnt0,cnt1)
		{
			if (cnt0==cnt1){
				return true;
			} else if (cnt0>cnt1){
				var tmp = cnt0;
				cnt0 = cnt1;
				cnt1 = tmp;
			}
			ac.layers[cnt1].moveAfter(ac.layers[cnt0]);
			ac.layers[cnt0].moveAfter(ac.layers[cnt1]);
		
		}
		var sl = [];
		if ( ac.selectedLayers.length<=0){
			if ( ac.numLayers>0){
				for ( var i=1; i<=ac.numLayers; i++) sl.push(ac.layer(i));
			}
		}else{
			sl = ac.selectedLayers;
		}

		if ( sl.length<=1){
			alert("ソート可能なレイヤが無い。",funcListCaptions[funcIndex]);
			return;
		}
		var len = sl.length;
		var cnt = Math.floor(len / 2);
		if (cnt>0){
			app.beginUndoGroup(funcListCaptions[funcIndex]);
			for (var i = 0 ; i <cnt ; i++) {
				swapLayer( sl[i].index,sl[len-i-1].index);
			}
			app.endUndoGroup();
		}
	
	}
	//-------------------------------------------------------------------------
	function posToInt()
	{
		var resultLayers = "";
		function toInt(lyr)
		{
			var pos = lyr.property("ADBE Transform Group").property("ADBE Position");
			
			if (pos.numKeys>0){
				var kn = pos.selectedKeys;
				var f = false;
				for ( var i=0 ; i<kn.length; i++){
					var posV = pos.keyValue(kn[i]);
					var posB = [].concat(posV);
					posV[0] = Math.floor(posV[0]);
					posV[1] = Math.floor(posV[1]);
					if ( (posV[0] != posB[0])|| (posV[1] != posB[1]) ){
						pos.setValueAtKey(kn[i],posV);
						f = true;
					}
				}
				if ( f == true) resultLayers = lyr.name + " keyあり\n";
			}else{
				var posV = pos.value;
				var posB = [].concat(posV);
				posV[0] = Math.floor(posV[0]);
				posV[1] = Math.floor(posV[1]);
				if ( (posV[0] != posB[0])|| (posV[1] != posB[1]) ){
					pos.setValue(posV);
					resultLayers = lyr.name + " keyなし\n";
				}
			}
			return true;
		}
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		for ( var i=0; i<lyrs.length; i++) {
			var p = lyrs[i].property("ADBE Transform Group").property("ADBE Position");
			if ( (p.numKeys>0)&&(p.selectedKeys.length<=0)){
				alert("キーフレームがある場合は選択して下さい。",funcListCaptions[funcIndex]);
				return false;
			}
		}
		
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		resultLayers = [];
		for ( var i=0; i<lyrs.length; i++) {
			if ( toInt(lyrs[i])==false) break;
		}
		app.endUndoGroup();
		if (resultLayers ==""){
			alert("処理なし",funcListCaptions[funcIndex]);
		}else{
			alert(resultLayers + "\n以上のレイヤの位置を整数化しました。",funcListCaptions[funcIndex]); 
		}
	}
	//-------------------------------------------------------------------------
	function ancToInt()
	{
		var resultLayers = "";
		function toInt(lyr)
		{
			var anc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
			
			if (anc.numKeys>0){
				var kn = anc.selectedKeys;
				var f = false;
				for ( var i=0 ; i<kn.length; i++){
					var ancV = anc.keyValue(kn[i]);
					var ancB = [].concat(ancV);
					ancV[0] = Math.floor(ancV[0]);
					ancV[1] = Math.floor(ancV[1]);
					if ( (ancV[0] != ancB[0])|| (ancV[1] != ancB[1]) ){
						anc.setValueAtKey(kn[i],ancV);
						f = true;
					}
				}
				if ( f == true) resultLayers = lyr.name + " keyあり\n";
			}else{
				var ancV = anc.value;
				var ancB = [].concat(ancV);
				ancV[0] = Math.floor(ancV[0]);
				ancV[1] = Math.floor(ancV[1]);
				if ( (ancV[0] != ancB[0])|| (ancV[1] != ancB[1]) ){
					anc.setValue(ancV);
					resultLayers = lyr.name + " keyなし\n";
				}
			}
			return true;
		}
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		for ( var i=0; i<lyrs.length; i++) {
			var p = lyrs[i].property("ADBE Transform Group").property("ADBE Anchor Point");
			if ( (p.numKeys>0)&&(p.selectedKeys.length<=0)){
				alert("キーフレームがある場合は選択して下さい。",funcListCaptions[funcIndex]);
				return false;
			}
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		for ( var i=0; i<lyrs.length; i++) {
			if ( toInt(lyrs[i])==false) break;
		}
		app.endUndoGroup();
		if (resultLayers ==""){
			alert("処理なし",funcListCaptions[funcIndex]);
		}else{
			alert(resultLayers + "\n以上のレイヤのアンカーを整数化しました。",funcListCaptions[funcIndex]); 
		}
	}
	//-------------------------------------------------------------------------
	function posAncToInt()
	{
		var resultLayers = "";
		function toInt(lyr)
		{
			var anc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
			var pos = lyr.property("ADBE Transform Group").property("ADBE Position");
			var ancV = anc.value;
			var ancB = [].concat(ancV);
			ancV[0] = Math.floor(ancV[0]);
			ancV[1] = Math.floor(ancV[1]);
			var mes = "";
			if ( (ancV[0] != ancB[0])|| (ancV[1] != ancB[1]) ){
				if ( anc.numKeys ==0){
					anc.setValue(ancV);
				}else{
					anc.setValueAtKey(1,ancV);
				}
				mes += "アンカー ";
			}
			var posV = pos.value;
			var posB = [].concat(posV);
			posV[0] = Math.floor(posV[0]);
			posV[1] = Math.floor(posV[1]);
			if ( (posV[0] != posB[0])|| (posV[1] != posB[1]) ){
				if ( pos.numKeys==0){
					pos.setValue(posV);
				}else{
					pos.setValueAtKey(1,posV);
				}
				
				mes += "位置 ";
			}
			if ( mes != ""){
				resultLayers += lyr.name + " " + mes + "を変更\n";
			}
			return true;
		}
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",funcListCaptions[funcIndex]);
			return;
		}
		for ( var i=0; i<lyrs.length; i++) {
			var a = lyrs[i].property("ADBE Transform Group").property("ADBE Anchor Point");
			var p = lyrs[i].property("ADBE Transform Group").property("ADBE Position");
			if ( (a.numKeys>1)||(p.numKeys>1)){
				alert("キーフレームがある場合は個別にお願いします。",funcListCaptions[funcIndex]);
				return false;
			}
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		for ( var i=0; i<lyrs.length; i++) {
			if ( toInt(lyrs[i])==false) break;
		}
		app.endUndoGroup();
		if (resultLayers ==""){
			alert("処理なし",funcListCaptions[funcIndex]);
		}else{
			alert(resultLayers + "\n以上のレイヤを処理しました。",funcListCaptions[funcIndex]); 
		}
	}
	//-------------------------------------------------------------------------
	function combSizeFitSub(cmp,lyr)
	{
		var anc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
		var pos = lyr.property("ADBE Transform Group").property("ADBE Position");
		var scl = lyr.property("ADBE Transform Group").property("ADBE Scale");
		
		if ( (anc.numKeys>1)||(pos.numKeys>1)||(scl.numKeys>1) ){
			alert("キーフレームがあるのでFit出来ません。",funcListCaptions[funcIndex]);
			return false;
		}
		var sclV = scl.value;
		var newW = Math.floor(lyr.width * sclV[0]/100);
		var newH = Math.floor(lyr.height* sclV[1]/100);
		
		var ancV = anc.value;
		var newX = ancV[0] * sclV[0]/100;
		var newY = ancV[1] * sclV[1]/100;
		
		var posV = pos.value;
		var addX = newX - posV[0];
		var addY = newY - posV[1];
		
		if (cmp.width != newW) cmp.width = newW;
		if (cmp.height != newH) cmp.height = newH;
		if ( (addX!=0)||(addY!=0)){
			for ( var i=1; i<= cmp.numLayers; i++)
			{
				var l = cmp.layer(i);
				if ( l.parent != null ) continue;
				var p = l.property("ADBE Transform Group").property("ADBE Position");
				if ( p.numKeys==0){
					var pV = p.value;
					pV[0] += addX;
					pV[1] += addY;
					p.setValue(pV);
				}else{
					for ( var j=1; j<=p.numKeys; j++){
						var pV = p.keyValue(j);
						pV[0] += addX;
						pV[1] += addY;
						p.setValueAtKey(j,pV);
					}
				}
			}
		}
		return true;
	}
	//-------------------------------------------------------------------------
	function combDurationFit()
	{
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください。",funcListCaptions[funcIndex]);
			return;
		}
		var as = null;
		var al = null;
		if ( ac.selectedLayers.length >0){
			for ( var i=0; i<ac.selectedLayers.length; i++){
				if (ac.selectedLayers[i].source == null) continue;
				if (  ac.selectedLayers[i].source instanceof CompItem){
					al =  ac.selectedLayers[i];
					as = ac.selectedLayers[i].source;
					break;
				}else if  (  ac.selectedLayers[i].source instanceof FootageItem){
					if (ac.selectedLayers[i].source.mainSource.isStill ==false){
						al =  ac.selectedLayers[i];
						as = ac.selectedLayers[i].source;
						break;
					}
				}
			}
		}
		if ( as == null){
			alert("有効なレイヤーを選んでください");
			retrun;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		ac.frameRate = as.frameRate;
		ac.duration = as.duration;
		al.startTime = 0;
		al.inPoint = 0;
		al.outPoint = ac.duration;
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function combSizeDurationFit()
	{
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください。",funcListCaptions[funcIndex]);
			return;
		}
		var as = null;
		var al = null;
		if ( ac.selectedLayers.length >0){
			for ( var i=0; i<ac.selectedLayers.length; i++){
				if (ac.selectedLayers[i].source == null) continue;
				if (  ac.selectedLayers[i].source instanceof CompItem){
					al =  ac.selectedLayers[i];
					as = ac.selectedLayers[i].source;
					break;
				}else if  (  ac.selectedLayers[i].source instanceof FootageItem){
					if (ac.selectedLayers[i].source.mainSource.isStill ==false){
						al =  ac.selectedLayers[i];
						as = ac.selectedLayers[i].source;
						break;
					}
				}
			}
		}
		if ( as == null){
			alert("有効なレイヤーを選んでください");
			retrun;
		}
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		ac.frameRate = as.frameRate;
		ac.duration = as.duration;
		al.startTime = 0;
		al.inPoint = 0;
		al.outPoint = ac.duration;
		combSizeFitSub(ac,al);
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function combSizeFit()
	{

		var ret = null;
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください。",funcListCaptions[funcIndex]);
			return ret;
		}
		if ( ac.selectedLayers.length >0){
			for ( var i=0; i<ac.selectedLayers.length; i++){
				if (ac.selectedLayers[i].source == null) continue;
				if (  ac.selectedLayers[i].source instanceof CompItem){
					ret =  ac.selectedLayers[i];
					break;
				}else if  (  ac.selectedLayers[i].source instanceof FootageItem){
					ret =  ac.selectedLayers[i];
					break;
				}
			}
		}
		if ( ret == null){
			alert("有効なレイヤを選択してください。",funcListCaptions[funcIndex]);
		}
		
		app.beginUndoGroup(funcListCaptions[funcIndex]);
		combSizeFitSub(ac,ret);
		app.endUndoGroup();
	}
	//-----------------------------
	function selectionAll_OFF()
	{
		var lyrs = getLayer();
		if( (lyrs != null) && (lyrs.length>0)){
			app.beginUndoGroup(funcListCaptions[funcIndex]);
			for ( var i=0; i<lyrs.length; i++){
				lyrs[i].selected = false;
			}
			app.endUndoGroup();
		}
	}
	//-----------------------------
	function remapStill()
	{
		var lyrs = getLayer();
		if( (lyrs != null) && (lyrs.length>0)){
			
			app.beginUndoGroup(funcListCaptions[funcIndex]);
			for ( var i=0; i<lyrs.length; i++){
				var remap = lyrs[i].property("ADBE Time Remapping");
				if ( (remap != null)&&(remap != undefined)){
					lyrs[i].timeRemapEnabled = true;
					lyrs[i].startTime = 0;
					lyrs[i].inPoint = 0;
					remap.setValueAtTime(0,0);
					if ( remap.numKeys>1){
						for ( var i=remap.numKeys; i>=2;i--) remap.removeKey(i);
					}
					lyrs[i].outPoint = lyrs[i].containingComp.duration;
				}
			}
			app.endUndoGroup();
		}
	}
	//-------------------------------------------------------------------------	var layerSetKoma = function(lyr,koma)	{		if (lyr.canSetTimeRemapEnabled === false) return;				var st = lyr.startTime;				var k = koma / lyr.source.frameRate;		var cnt = Math.floor(lyr.source.duration / k);				lyr.timeRemapEnabled = true;		var remap = lyr.property("ADBE Time Remapping");		if (st>=0)			remap.setValueAtTime(st,0);		if ( remap.numKeys>1) for ( var i = remap.numKeys; i>1;i--) remap.removeKey(i);					for (var i=0; i< cnt; i++){			var v = k * i;			var tm = v + st;			if (tm>=0)				remap.setValueAtTime(tm,v);		}		for (var i=1 ; i<=remap.numKeys ; i++) remap.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);						var op = lyr.startTime + lyr.source.duration;		if ( lyr.outPoint > op) lyr.outPoint = op;
			}	//-------------------------------------------------------------------------	var layerSet2k = function()	{		var ac = app.project.activeItem;		var sel = [];		if (ac instanceof CompItem){			if ( ac.selectedLayers.length>0){				for ( var i=0; i<ac.selectedLayers.length; i++){					if (ac.selectedLayers[i].canSetTimeRemapEnabled === true){						sel.push(ac.selectedLayers[i]);					}				}			}		}else{			alert("no active comp");		}		if (sel.length>0){			app.beginUndoGroup(funcListCaptions[funcIndex]);
			for ( var i=0; i<sel.length; i++){				layerSetKoma(sel[i],2);			}			app.endUndoGroup();
		}else{			alert("no execute!");		}	}
	//-------------------------------------------------------------------------	var layerSet3k = function()	{		var ac = app.project.activeItem;		var sel = [];		if (ac instanceof CompItem){			if ( ac.selectedLayers.length>0){				for ( var i=0; i<ac.selectedLayers.length; i++){					if (ac.selectedLayers[i].canSetTimeRemapEnabled === true){						sel.push(ac.selectedLayers[i]);					}				}			}		}else{			alert("no active comp");		}		if (sel.length>0){			app.beginUndoGroup(funcListCaptions[funcIndex]);
			for ( var i=0; i<sel.length; i++){				layerSetKoma(sel[i],3);			}			app.endUndoGroup();
		}else{			alert("no execute!");		}	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "レイヤ制御", [ 0,  0,  200,  200]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	function addFunc(cap,func)
	{
		funcListCaptions.push(cap);
		funcList.push(func);
	}
	addFunc("レイヤの選択をすべて解除",selectionAll_OFF);
	addFunc("アクティブなコンポを選択",compSourceSelect);
	addFunc("レイヤのソースを選択",layerSourceSelect);
	addFunc("コンポの秒数・サイズをレイヤに合わせる",combSizeDurationFit);
	addFunc("コンポの秒数をレイヤに合わせる",combDurationFit);
	addFunc("コンポのサイズをレイヤに合わせる",combSizeFit);
	addFunc("新規調整シェイプレイヤ",createAdjust);
	addFunc("ガイドレイヤ：切り替え",guideChange);
	addFunc("シャイ：反転",reverceShy);
	addFunc("レイヤの順番を反転",revLayer);
	addFunc("位置アンカーを整数化",posAncToInt);
	addFunc("位置を整数化",posToInt);
	addFunc("アンカーを整数化",ancToInt);
	addFunc("リマップで静止画扱いにする",remapStill);
	addFunc("in点を現在の位置へ",inPointToCurrent);
	addFunc("out点を現在の位置へ",outPointToCurrent);
	addFunc("in点を頭へ",inPointToStart);
	addFunc("out点を最後へ",outPointToEnd);
	addFunc("調整レイヤ：切り替え",adjustChange);
	addFunc("タイムリマップで２コマ打ちに",layerSet2k);
	addFunc("レイヤの複製",dupli);
	addFunc("タイムリマップで3コマ打ちに",layerSet3k);
	

	btnExec = winObj.add("button",[0,0,200,30],"None Selected");
	btnExec.enabled = false;
	funcListbox = winObj.add("listbox",[0,20,200,170],funcListCaptions);


	function execFunc()
	{
		if ( funcListbox.selection == null) {
			funcIndex =-1;
			writeLn("None func");
			return;
		}
		funcIndex = funcListbox.selection.index;
		if ( (funcIndex>=0)&&(funcIndex<funcList.length)){
			writeLn(funcListCaptions[funcIndex]);
			var f = funcList[funcIndex];
			f();
		}
	}

	//funcListbox.addEventListener("click",execFunc);
	funcListbox.onDoubleClick = execFunc;
	funcListbox.onChange = function(){
		var idx = funcListbox.selection.index;
		if ( (idx>=0)&&(idx<funcList.length)){
			funcIndex = idx;
			btnExec.text = funcListCaptions[funcIndex];
			btnExec.enabled = true;
		}else{
			funcIndex = -1;
			btnExec.text = "None";
			btnExec.enabled = false;
		}
	}
	btnExec.onClick = execFunc;
	//-------------------------------------------------------------------------
	var defWidth =-1;
	var defHeight =-1;
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		if (( defWidth != w)||(defHeight != h)) {
			defWidth = w;
			defHeight = h;
			
			var b2 = btnExec.bounds;
			b2[0] = 0;
			b2[1] = 0;
			b2[2] = defWidth;
			b2[3] = 30;
			btnExec.bounds = b2;
			var b3 = funcListbox.bounds;
			b3[0] = 0;
			b3[1] = 30;
			b3[2] = defWidth;
			b3[3] = defHeight;
			funcListbox.bounds = b3;
		}
	}
	resize();
	//winObj.addEventListener("resize",resize);
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	winObj.onResize = resize;
	//-------------------------------------------------------------------------
})(this);