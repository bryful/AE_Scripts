var adjustmentLayerCount2_ = 1;


(function(me){

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
	function sourceSelect()
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
	function inPointToCurrent()
	{
		var lyrs = getLayer();
		if ( (lyrs==null)||(lyrs.length <= 0)){
			alert("レイヤを選択してください。",this.cap);
			return;
		}
		app.beginUndoGroup(this.cap);
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
			alert("レイヤを選択してください。",this.cap);
			return;
		}
		app.beginUndoGroup(this.cap);
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
			alert("レイヤを選択してください。",this.cap);
			return;
		}
		app.beginUndoGroup(this.cap);
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
			alert("レイヤを選択してください。",this.cap);
			return;
		}
		app.beginUndoGroup(this.cap);
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
			alert("レイヤを選択してください。",this.cap);
			return;
		}
		app.beginUndoGroup(this.cap);
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
		app.beginUndoGroup(this.cap);
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
				alert("レイヤが無い",this.cap);
				return;
			}
		}else{
			alert("コンポを選択してください。",this.cap);
			return;
		}
		app.beginUndoGroup(this.cap);
		for ( var i=1; i<=ac.numLayers;i++)
			ac.layer(i).shy = ! ac.layer(i).shy;
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function revLayer()
	{
		var ac = app.project.activeItem;
		if ( (ac instanceof CompItem)==false){
			alert("コンポを選択して下さい。",this.cap);
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
			alert("ソート可能なレイヤが無い。",this.cap);
			return;
		}
		var len = sl.length;
		var cnt = Math.floor(len / 2);
		if (cnt>0){
			app.beginUndoGroup(this.cap);
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
			alert("レイヤを選択してください。",this.cap);
			return;
		}
		for ( var i=0; i<lyrs.length; i++) {
			var p = lyrs[i].property("ADBE Transform Group").property("ADBE Position");
			if ( (p.numKeys>0)&&(p.selectedKeys.length<=0)){
				alert("キーフレームがある場合は選択して下さい。",this.cap);
				return false;
			}
		}
		
		app.beginUndoGroup(this.cap);
		resultLayers = [];
		for ( var i=0; i<lyrs.length; i++) {
			if ( toInt(lyrs[i])==false) break;
		}
		app.endUndoGroup();
		if (resultLayers ==""){
			alert("処理なし",this.cap);
		}else{
			alert(resultLayers + "\n以上のレイヤの位置を整数化しました。",this.cap); 
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
			alert("レイヤを選択してください。",this.cap);
			return;
		}
		for ( var i=0; i<lyrs.length; i++) {
			var p = lyrs[i].property("ADBE Transform Group").property("ADBE Anchor Point");
			if ( (p.numKeys>0)&&(p.selectedKeys.length<=0)){
				alert("キーフレームがある場合は選択して下さい。",this.cap);
				return false;
			}
		}
		app.beginUndoGroup(this.cap);
		for ( var i=0; i<lyrs.length; i++) {
			if ( toInt(lyrs[i])==false) break;
		}
		app.endUndoGroup();
		if (resultLayers ==""){
			alert("処理なし",this.cap);
		}else{
			alert(resultLayers + "\n以上のレイヤのアンカーを整数化しました。",this.cap); 
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
			alert("レイヤを選択してください。",this.cap);
			return;
		}
		for ( var i=0; i<lyrs.length; i++) {
			var a = lyrs[i].property("ADBE Transform Group").property("ADBE Anchor Point");
			var p = lyrs[i].property("ADBE Transform Group").property("ADBE Position");
			if ( (a.numKeys>1)||(p.numKeys>1)){
				alert("キーフレームがある場合は個別にお願いします。",this.cap);
				return false;
			}
		}
		app.beginUndoGroup(this.cap);
		for ( var i=0; i<lyrs.length; i++) {
			if ( toInt(lyrs[i])==false) break;
		}
		app.endUndoGroup();
		if (resultLayers ==""){
			alert("処理なし",this.cap);
		}else{
			alert(resultLayers + "\n以上のレイヤを処理しました。",this.cap); 
		}
	}
	//-------------------------------------------------------------------------
	function combSizeFit()
	{
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください。",this.cap);
			return;
		}
		if ( ac.selectedLayers.length != 1){
			alert("レイヤは1個だけ選択して下さい。",this.cap);
			return;
		}
		var lyr = ac.selectedLayers[0];
		var anc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
		var pos = lyr.property("ADBE Transform Group").property("ADBE Position");
		var scl = lyr.property("ADBE Transform Group").property("ADBE Scale");
		
		if ( (anc.numKeys>1)||(pos.numKeys>1)||(scl.numKeys>1) ){
			alert("キーフレームがあるのでFit出来ません。",this.cap);
			return;
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
		
		app.beginUndoGroup(this.cap);
		if (ac.width != newW) ac.width = newW;
		if (ac.height != newH) ac.height = newH;
		if ( (addX!=0)||(addY!=0)){
			for ( var i=1; i<= ac.numLayers; i++)
			{
				var l = ac.layer(i);
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
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "レイヤ制御", [ 100,  100,  100+200,  100+100]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var btns = [];
	//var execCap = ["調整レイヤ","ガイドレイヤ","ソースを選択"];
	function addBtn(cap,func)
	{
		var w = winObj.bounds[2] - winObj.bounds[0];
		var t = btns.length * 24 + 4;
		btns.push(winObj.add("button", [  4,    t,   w - 4,   t + 22], cap));
		
		btns[btns.length-1].cap = cap;
		btns[btns.length-1].onClick = func;
	}
	addBtn("ソースを選択",sourceSelect);
	addBtn("新規調整シェイプレイヤ",createAdjust);
	addBtn("調整レイヤ：切り替え",adjustChange);
	addBtn("シャイ：反転",reverceShy);
	addBtn("ガイドレイヤ：切り替え",guideChange);
	addBtn("in点を現在の位置へ",inPointToCurrent);
	addBtn("out点を現在の位置へ",outPointToCurrent);
	addBtn("in点を頭へ",inPointToStart);
	addBtn("out点を最後へ",outPointToEnd);
	addBtn("レイヤの複製",dupli);
	addBtn("レイヤの順番を反転",revLayer);
	addBtn("位置アンカーを整数化",posAncToInt);
	addBtn("位置を整数化",posToInt);
	addBtn("アンカーを整数化",ancToInt);
	addBtn("コンポのサイズをレイヤに合わせる",combSizeFit);
	

	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		for ( var i=0; i<btns.length; i++) {
			var bb = btns[i].bounds;
			bb[0] = 4;
			bb[2] = w-4;
			btns[i].bounds = bb;
		}
	}
	resize();
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		var b = winObj.bounds;
		b[3] = b[1] + btns.length * 28 + 8;
		winObj.bounds = b;
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);