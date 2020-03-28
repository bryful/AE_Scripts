//調整シェイプレイヤーのカウンター
var adjustmentLayerCount_ = 1;

//--
(function (me)
{
	if ( app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1){
		var s = "すみません。以下の設定がオフになっています。\r\n\r\n";
		s +=  "「環境設定：一般設定：スクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」\r\n";
		s += "\r\n";
		s += "このスクリプトを使う為にはオンにする必要が有ります。\r\n";
		alert(s);
		return;
	}
	var executePath	= $.fileName;
	//スクリプト名を切り出す。
	//以下のコードはエラーチェックをしていないので注意（この場合はエラーが出る要因が無いので省いているだけ）
	var scriptName = executePath.substring(executePath.lastIndexOf("/")+1);
	scriptName = scriptName.substring(0,scriptName.lastIndexOf("."));	//拡張子を削除。拡張子のないファイル名の時エラーになる
	scriptName = File.decode(scriptName);	//デコード
	//パスを切り出す
	var scriptPath = executePath.substring(0,executePath.lastIndexOf("/"));
	//アイコンファイルのあるフォルダ名
	var iconFolderPath = scriptPath +"/(" + scriptName +")";


	var nameToRoot			= "move to Root";
	var nameToParent		= "move to Parent";
	var nameReduceSolid		= "使っていない平面を収集";
	var nameReduceFootage	= "使っていないフッテージを収集";
	var nameDelEmptyFolder	= "空のフォルダを削除";
	var nameDupSolid		= "平面をまとめる";
	var nameNewAdjShape		= "新規調整シェイプレイヤ";

	var execCount	= 8;

	this.palette		= null;
	
	this.BtnUndo			= null;
	this.BtnToRoot			= null;
	this.BtnToParent		= null;	
	this.BtnReduceSolid		= null;
	this.BtnReduceFootage	= null;
	this.BtnDelEmptyFolder	= null;
	this.BtnDupSolid		= null;
	this.BtnNewAdjShape		= null;

	var btnTop		= 4;
	var btnLeft		= 4;
	
	var btnWidth	= 88;
	var btnHeight	= 20;
	var btnInter	= 0;

	
	
	

	//-----------------------------
	this.toRoot = function()
	{
		var selectedItems = app.project.selection;
		if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
			app.beginUndoGroup(nameToRoot);
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
	this.toParent = function()
	{
		var selectedItems = app.project.selection;
		if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
			app.beginUndoGroup(nameToParent);
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
	this.newSolidFolder = function(str)
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
	this.reduceSolid = function()
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
			app.beginUndoGroup(nameReduceSolid);
			var ff= this.newSolidFolder("使用していない平面");
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
	this.reduceFootage = function()
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
			}
		}
		var countFootage = list.length;
		if (list.length>0) {
			app.beginUndoGroup(nameReduceFootage);
			var ff= this.newSolidFolder("使用していないフッテージ");
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
	this.deleteEmptyFolder = function(f)
	{
		if (f == null) return;
		if (!( f instanceof FolderItem )) return;
		//何かあったら確認
		if (f.numItems>0) {
			var fL = new Array;
			for ( var i=1; i<=f.numItems; i++){
				if (f.item(i) instanceof FolderItem) fL.push(f.item(i));
			}
			if(fL.length>0){
				for ( var i=0; i<fL.length; i++){
					this.deleteEmptyFolder(fL[i]);
				}
			}
		}
		var rootID = app.project.rootFolder.id;
		if (f.numItems<=0){
			if ( f.id != rootID)
				f.remove();
		}
	}
	//-----------------------------
	this.deleteEmptyFolderMain = function()
	{
		var selectedItems = app.project.selection;
		if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
			app.beginUndoGroup(nameDelEmptyFolder);
			for (var i = 0; i < selectedItems.length; i++) {
				if ( selectedItems[i] instanceof FolderItem ) {
					this.deleteEmptyFolder(selectedItems[i]);
				}
			}
			app.endUndoGroup();
		}else{
			app.beginUndoGroup(nameDelEmptyFolder);
			this.deleteEmptyFolder(app.project.rootFolder);
			app.endUndoGroup();
		}
	}
	//-----------------------------
	this.compreSolid = function(l0,l1)
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
	this.dupSolid = function(cmp)
	{
		if (cmp == null) return;
		if (!( cmp instanceof CompItem )) return;
		
		if (cmp.numLayers<=0) return;
		//平面を探す
		var lyrs = new Array;
		var lyrsF = new Array;
		for (var i=1; i<=cmp.numLayers; i++){
			var src = cmp.layer(i).source;
			if ( (src.typeName =="フッテージ")&&(src.file == null)) {
				lyrs.push(cmp.layer(i));
				lyrsF.push(true);
			}
		}
		if (lyrs.length<=1)  return;
		//使えそうな平面を使いまわす。
		var srcs = new Array;
		for (var i=0; i<lyrs.length -1; i++){
			if (lyrsF[i] == true) {
				for(var j=i+1; j<lyrs.length;j++){
					if ( this.compreSolid(lyrs[i],lyrs[j])==true) {
						srcs.push(lyrs[j].source);
						var nm = lyrs[j].name;
						lyrs[j].replaceSource( lyrs[i].source , false);
						lyrs[j].name = nm;
						lyrsF[j] = false;
					}
				}
			}
		}
		//いらない平面を消す。
		if (srcs.length>0) {
			for (var i=srcs.length-1; i>=0; i--){
				if (srcs[i].usedIn.length<=0) srcs[i].remove();
			}
		}
	}
	//-----------------------------
	this.dupSolidMain = function()
	{
		var selectedItems = app.project.selection;
		if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
			app.beginUndoGroup(nameDupSolid);
			for (var i = 0; i < selectedItems.length; i++) {
				if ( selectedItems[i] instanceof CompItem ) {
					this.dupSolid(selectedItems[i]);
				}
			}
			app.endUndoGroup();
		}else{
			alert("アイテムを選択してください。");
		}
	}
	//-----------------------------
	this.newAdjShape = function(cmp)
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
		
		//var vg = sl.addProperty("ADBE Root Vectors Group");
		var rct = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
		rct.name = "rect";
		/*
		var sz = new Array;
		sz.push(cmp.width);
		sz.push(cmp.height);
		rct.property("ADBE Vector Rect Size").setValue(sz);
		*/
		//サイズをあわせるエクスプレッション
		rct.property("ADBE Vector Rect Size").expression = "[thisComp.width,thisComp.height];";
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
	this.newAdjShapeMain = function()
	{
		var actComp = app.project.activeItem;
		if ( actComp instanceof CompItem){
			app.beginUndoGroup(nameNewAdjShape);
			this.newAdjShape(actComp);
			app.endUndoGroup();
		}else{
			alert("コンポを選択してください。");
		}
	}
	//-----------------------------
	this.getBtnBounds = function(idx)
	{

		var x0 = btnLeft ;
		var x1 = x0 + btnWidth;
		var y0 = btnTop + (btnHeight + btnInter ) *idx;
		var y1 = y0 + btnHeight;
		
		return [x0,y0,x1,y1]; 
	}
	//-----------------------------
	this.getDialogBounds = function()
	{

		var x0 = 0 ;
		var x1 = btnLeft + btnWidth + btnLeft;
		var y0 = 0;
		var y1 = btnTop + ( btnHeight + btnInter) * execCount + btnTop;
		
		return [x0,y0,x1,y1]; 
	}
	//-----------------------------
	this.buildMenu = function()
	{
		var icons = new Array;
		icons.push( new File(iconFolderPath + "/undo.png"));
		icons.push( new File(iconFolderPath + "/newAdjShape.png"));
		icons.push( new File(iconFolderPath + "/moveToRoot.png"));
		icons.push (new File(iconFolderPath + "/moveToParent.png"));
		icons.push (new File(iconFolderPath + "/reduceSolid.png"));
		icons.push (new File(iconFolderPath + "/ReduceFootage.png"));
		icons.push (new File(iconFolderPath + "/delEmptyFolder.png"));
		icons.push (new File(iconFolderPath + "/DupSolid.png"));

		this.palette = ( me instanceof Panel) ? me : new Window("palette", scriptName, this.getDialogBounds());


		var idx = 0;
		this.BtnToUndo = this.palette.add("iconbutton",this.getBtnBounds(idx),icons[idx],{ style:"toolbutton" });
		this.BtnToUndo.onClick = function() {app.executeCommand(16);}
		this.BtnToUndo.helpTip = "Undoを実行";
		idx++;

		this.BtnToRoot = this.palette.add("iconbutton",this.getBtnBounds(idx),icons[idx],{ style:"toolbutton" });
		this.BtnToRoot.newAdjShape = this.newAdjShape;
		this.BtnToRoot.onClick = this.newAdjShapeMain;
		this.BtnToRoot.helpTip = "シェイプレイヤで調整レイヤを作成します。";
		idx++;

		this.BtnToRoot = this.palette.add("iconbutton",this.getBtnBounds(idx),icons[idx],{ style:"toolbutton" });
		this.BtnToRoot.onClick = this.toRoot;
		this.BtnToRoot.helpTip = "ターゲットをrootFolderへ移動";
		idx++;

		this.BtnToParent = this.palette.add("iconbutton",this.getBtnBounds(idx),icons[idx],{ style:"toolbutton" });
		this.BtnToParent.onClick = this.toParent;
		this.BtnToParent.helpTip = "ターゲットを一つ上に移動";
		idx++;

		this.BtnReduceSolid = this.palette.add("iconbutton",this.getBtnBounds(idx),icons[idx],{ style:"toolbutton" });
		this.BtnReduceSolid.newSolidFolder = this.newSolidFolder;
		this.BtnReduceSolid.onClick = this.reduceSolid;
		this.BtnReduceSolid.helpTip = "使っていない平面をルートへ移動";
		idx++;

		this.BtnReduceFootage = this.palette.add("iconbutton",this.getBtnBounds(idx),icons[idx],{ style:"toolbutton" });
		this.BtnReduceFootage.newSolidFolder = this.newSolidFolder;
		this.BtnReduceFootage.onClick = this.reduceFootage;
		this.BtnReduceFootage.helpTip = "使っていないフッテージをルートへ移動";
		idx++;

		this.BtnDelEmptyFolder = this.palette.add("iconbutton",this.getBtnBounds(idx),icons[idx],{ style:"toolbutton" });
		this.BtnDelEmptyFolder.deleteEmptyFolder = this.deleteEmptyFolder;
		this.BtnDelEmptyFolder.onClick = this.deleteEmptyFolderMain;
		this.BtnDelEmptyFolder.helpTip = "空のフォルダを削除する";
		idx++;

		this.BtnDupSolid = this.palette.add("iconbutton",this.getBtnBounds(idx),icons[idx],{ style:"toolbutton" });
		this.BtnDupSolid.compreSolid = this.compreSolid;
		this.BtnDupSolid.dupSolid = this.dupSolid;
		this.BtnDupSolid.onClick = this.dupSolidMain;
		this.BtnDupSolid.helpTip = "ターゲットのコンポ内の平面を整理してまとめる";
		idx++;
		
		
		if ( ( me instanceof Panel) == false){
			this.palette.center();
			this.palette.show();
		}

	}
	//-----------------------------
	this.buildMenu();

///-----------------------------------------------------------------------
})(this);
