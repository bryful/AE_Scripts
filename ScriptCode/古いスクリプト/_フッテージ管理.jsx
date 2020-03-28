//調整シェイプレイヤーのカウンター
var adjustmentLayerCount_ = 1;

//--
(function (me)
{
	var funcIndex = -1;
	var funcList = [];
	var funcListCaptions = [];
	var btnExec = null
	var funcListbox = null;

	var defWidth =-1;
	var defHeight =-1;

	//-----------------------------
	function capStr()
	{
		if ( (funcIndex>=0)&&(funcIndex<funcList.length)){
			return funcListCaptions[funcIndex];
		}else{
			return "footageControl";
		}
	}
	
	//-----------------------------
	function toRoot()
	{
		var selectedItems = app.project.selection;
		if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
			app.beginUndoGroup(capStr());
			for (var i = 0; i < selectedItems.length; i++) {
				if ( selectedItems[i]  != null) {
					selectedItems[i].parentFolder = app.project.rootFolder;
				}
			}
			app.endUndoGroup();
		}else{
			alert("アイテムを選択してください。");
		}
	}
	//-----------------------------
	function toParent()
	{
		var selectedItems = app.project.selection;
		if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
			app.beginUndoGroup(capStr());
			for (var i = 0; i < selectedItems.length; i++) {
				if ( selectedItems[i]  != null) {
					selectedItems[i].parentFolder = selectedItems[i].parentFolder.parentFolder;
				}
			}
			app.endUndoGroup();
		}else{
			alert("アイテムを選択してください。");
		}
	}
	//-----------------------------
	function newSolidFolder(str)
	{
		var targetName = str;
		var fld = app.project.rootFolder;
		var cnt = fld.numItems;
		if (cnt >0) {
			for (var i=1; i<=cnt; i++)
			{
				if (fld.item(i).name == targetName ) return fld.item(i);
			}
		}
		return fld.items.addFolder(targetName);
	}
	//-----------------------------
	function reduceSolid()
	{
		
		var cnt = app.project.numItems;
		if (cnt<=0){
			alert("アイテムがありません");
			return;
		}
		var list = new Array;
		for (var i=1; i<=cnt; i++){
			var tar = app.project.item(i);
			if (tar instanceof FootageItem) {
				if ( tar.file == null) {
					if (tar.usedIn.length<=0) {
						list.push(tar);
					}
				}
			}
		}
		if (list.length>0) {
			app.beginUndoGroup(capStr());
			var ff= newSolidFolder("使用していない平面");
			for (var i=0; i<list.length; i++){
				list[i].parentFolder = ff;
			}
			app.endUndoGroup();
			alert(list.length +"個の平面を収集しました。");
		}else{
			alert("未使用の平面はありません。");
		}
	}
	//-----------------------------
	function reduceFootage()
	{
		
		var cnt = app.project.numItems;
		if (cnt<=0){
			alert("アイテムがありません");
			return;
		}
		//使用していないアイテムをリストアップ
		var list = new Array;
		for (var i=1; i<=cnt; i++){
			var tar = app.project.item(i);
			if (tar instanceof FootageItem) {
				if (tar.usedIn.length<=0) {
					list.push(tar);
				}
			}else if  (tar instanceof CompItem) {
				if ((tar.usedIn.length<=0)&&(tar.numLayers<=0 )) {
					list.push(tar);
				}
			}
		}
		var countFootage = list.length;
		if (list.length>0) {
			app.beginUndoGroup(capStr());
			var ff= newSolidFolder("使用していないフッテージ");
			for (var i=0; i<list.length; i++){
				list[i].parentFolder = ff;
			}
			alert(list.length +"個のフッテージを収集しました。");
			app.endUndoGroup();
		}else{
			alert("未使用のフッテージはありません。");
		}
		
	}
	//-----------------------------
	function deleteEmptyFolderMain()
	{
		function listupFolders()
		{
			var ret = [];
			
			if ( app.project.numItems>0){
				for ( var i=1; i<=app.project.numItems;i++){
					if (app.project.items[i] instanceof FolderItem){
						ret.push(app.project.items[i]);
					}
				}
			}
			return ret;
		}
		var lst = listupFolders();
		if ( lst.length<=0) {
			alert("none Folder!");
			return;
		}
		app.beginUndoGroup(capStr());
		
		var flg = true;
		var rcc = 0;
		do
		{
			flg = false;
			var cnt = lst.length;
			for ( var i=cnt-1; i>=0; i--){
				if (lst[i] != null){
					if ( lst[i].numItems <=0){
						lst[i].remove();
						lst[i] = null;
						flg = true;
						rcc++;
					}
				}
			}
		}while(flg);
		app.endUndoGroup();
		if ( rcc>0) alert( "remove:" + rcc);
	}
	//-----------------------------
	function compreSolid(l0,l1)
	{
		var ret = false;
		if ( ( l0.width == l1.width)&&( l0.height == l1.height) ) {
			var c0 = l0.source.mainSource.color;
			var c1 = l1.source.mainSource.color;
			if ( (c0[0]==c1[0])&&(c0[1]==c1[1])&&(c0[2]==c1[2]) ) {
				ret = true;
			}
		}
		return ret;
	}
	//-----------------------------
	function compareColor(c0,c1)
	{
		function vv(s)
		{
			return Math.round ( 255 * s);
		}
		var v0,v1;
		v0 = vv(c0[0]);
		v1 = vv(c1[0]);
		if ( v0 != v1 )  return false;
		v0 = vv(c0[1]);
		v1 = vv(c1[1]);
		if ( v0 != v1 ) return false;
		v0 = vv(c0[2]);
		v1 = vv(c1[2]);
		if ( v0 != v1 ) return false;
		return true;
	}
	//-----------------------------
	function compareSolid(s0,s1)
	{
		if ( s0.width != s1.width) return false;
		if ( s0.height != s1.height) return false;
		if (compareColor(s0.mainSource.color,s1.mainSource.color)==false) return false;
		return true;
	}

	//-----------------------------
	function replaceSolid(ary,target,idx)
	{
		var sc = ary.length;
		if (sc<=0) return false;
		if ( target == idx ) return false ;
		if ( ary[target].usedIn.length<=0) return fasle ;

		try{
			var tid = ary[target].id;
			var lst = ary[target].usedIn;
			for ( var i=0; i<lst.length; i++){
				var cmp = lst[i];
				if ( cmp != null)
				if ( cmp.numLayers > 0) {
					for ( var k=1; k<=cmp.numLayers; k++){
						if ( cmp.layer( k ).source != null) {
							while ((cmp.layer( k ).source.id == tid)&&( cmp.layer( k ).source != null))
								cmp.layer( k ).replaceSource(ary[idx], true);
						}
					}
				}
			}
		}catch(e){
			return false;
		}
		return true;
	}
	//-----------------------------
	function FindSolid(ary,target)
	{
		var idx = -1;
		var cnt = ary.length;
		if ( cnt<=0) return idx;
		if ( target>=cnt) return idx;
		try{
		for ( var i=0; i< target; i++){
			if ( (ary[i].isTarget == true)||(ary[i].isTarget == undefined )){
				if (compareSolid(ary[i],ary[target])==true){
					idx = i;
					break;
				}
			}
		}
		}catch(e){
			alert( "find:" + e.toString());
		}
		return idx;
	}
	//-----------------------------
	function dupSolidMain()
	{
		var solidList = [];
		if ( app.project.numItems>0){
			for ( var i=1; i<=app.project.numItems; i++){
				var f = app.project.items[i];
				if ( f instanceof FootageItem){
					if (f.mainSource.color != undefined){
						solidList.push(f);
					}
				}
			}
		}
		var sc = solidList.length;
		if (sc <=1) return;
		for ( var i=0; i<sc; i++) solidList[i].isTarget = true;
		app.beginUndoGroup(capStr());
		try{
		for ( var i = sc - 1; i>0; i-- ){
			if ( solidList[i].usedIn.length>0) {
				var idx = FindSolid(solidList,i);
				if ( idx<0) idx = FindSolid(solidList,i);
				if (( idx>=0)&&(idx<i)) {
					if ( replaceSolid(solidList, i, idx) == true){
						solidList[i].isTarget = false;
					}
				}
			}else{
				solidList[i].isTarget = false;
			}
		}
		}catch(e){
			alert("main:" + e.toString());
		}
		var nonUsedFolder = newSolidFolder("使用していない平面");
		var solidFolder = newSolidFolder("solid");
		for (var i=0; i<sc; i++){
			if ( solidList[i].usedIn.length <=0) {
				solidList[i].parentFolder = nonUsedFolder;
			}else{
				solidList[i].parentFolder = solidFolder;
			}
		}
		app.endUndoGroup();
	}
	//-----------------------------
	function newAdjShapefunction(cmp)
	{
		var targetLayer = null;
		if ( cmp.selectedLayers.length>0){
			if ( cmp.selectedLayers[0].index >1){
				targetLayer = cmp.selectedLayers[0];
			}
		}
		var sl = cmp.layers.addShape();
		sl.name = "調整シェイプレイヤ " + adjustmentLayerCount_;
		adjustmentLayerCount_++;
		if (adjustmentLayerCount_ >999) adjustmentLayerCount_ = 1;
		
		var rct = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
		rct.name = "rect";
		//サイズをあわせるエクスプレッション
		rct.property("ADBE Vector Rect Size").expression = "[thisComp.width*thisComp.pixelAspect,thisComp.height];";
		rct.property("ADBE Vector Rect Position").expression = "[0,0];";
		rct.property("ADBE Vector Rect Roundness").expression = "0;";

		sl.property("ADBE Transform Group").property("ADBE Anchor Point").expression = "[0,0];";
		sl.property("ADBE Transform Group").property("ADBE Position").expression = "[thisComp.width/2, thisComp.height/2];";
		

		var fil = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
		fil.name = "fill";
		fil.property("ADBE Vector Fill Color").setValue( [1,1,1] );
		sl.adjustmentLayer = true;
		if ( targetLayer != null)
		{
			sl.moveBefore(targetLayer); 
		}
	}
	//-----------------------------
	function newAdjShapeMain()
	{
		var actComp = app.project.activeItem;
		if ( actComp instanceof CompItem){
			app.beginUndoGroup(capStr());
			this.newAdjShape(actComp);
			app.endUndoGroup();
		}else{
			alert("コンポを選択してください。");
		}
	}
	//-----------------------------
	function selectionAll_OFF()
	{
		var cnt = app.project.selection.length;
		
		if ( cnt>0){
			app.beginUndoGroup(capStr());
			var s = [];
			for ( var i=0; i<cnt; i++) s.push(app.project.selection[i]);
			for ( var i=cnt-1; i>=0; i--)s[i].selected = false;
			app.endUndoGroup();
		}
	}
	//-----------------------------
	function checkJap()
	{
		if (confirm("日本語を適当に英語にしますか？（完全ではありません）",false,"英語化") == false) return;
		if ( app.project.numItems>0){
			app.beginUndoGroup(capStr());
			for (var i=1; i<=app.project.numItems; i++){
				var nm = app.project.items[i].name;
				nm = nm.replace("レイヤー","layer");
				nm = nm.replace("レイヤ","layer");
				nm = nm.replace("コンポ","comp");
				nm = nm.replace("名称未設定","untitled");
				nm = nm.replace("平面","solid");
				nm = nm.replace("ヌル","null");
				nm = nm.replace("調整","adjustment");
				nm = nm.replace("ホワイト","white");
				nm = nm.replace("ブラック","black");
				nm = nm.replace("レッド","red");
				nm = nm.replace("イエロー","yellow");
				nm = nm.replace("ブルー","blue");
				nm = nm.replace("青","Blue");
				nm = nm.replace("赤","Red");
				nm = nm.replace("緑","Green");
				nm = nm.replace("グリーン","green");
				nm = nm.replace("マゼンダ","magenta");
				nm = nm.replace("パープル","perple");
				nm = nm.replace("オレンジ","orange");
				nm = nm.replace("グレー","gray");
				nm = nm.replace("ライム","lime");
				nm = nm.replace("ターコイズ ","turquoise");
				nm = nm.replace("シアン ","cyan");
				
				//平面のみ
				var p  = app.project.items[i];
				if ( p instanceof FootageItem){
					if ( p.mainSource.color !=undefined) {
						nm = nm.replace("グレー系","gray_");
						nm = nm.replace("中間色の","middle_");
					}
				}
				if ( app.project.items[i].name != nm)
					app.project.items[i].name = nm;
			
			}
			app.endUndoGroup();
		}
	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "フッテージ制御", [ 0,  0,  200,  200]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	function addFunc(cap,func)
	{
		funcListCaptions.push(cap);
		funcList.push(func);
	}
	//addFunc("レイヤのソースを選択",layerSourceSelect);
	addFunc("プロジェクトの選択を全て解除",selectionAll_OFF);
	addFunc("ルートへ移動",toRoot);
	addFunc("一つ上へ移動",toParent);
	addFunc("使っていない平面を収集",reduceSolid);
	addFunc("使っていないフッテージを収集",reduceFootage);
	addFunc("空のフォルダを削除",deleteEmptyFolderMain);
	addFunc("平面をまとめる",dupSolidMain);
	addFunc("日本語を英語に",checkJap);
	
	//--------------------------------------------------------------
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
	//funcListbox.onDoubleClick = execFunc;
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


///-----------------------------------------------------------------------
})(this);
