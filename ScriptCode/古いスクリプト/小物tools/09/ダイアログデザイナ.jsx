/*
	ダイアログデザイナ
	
*/
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
	function getFileNameWithoutExt(s)
	{
		var ret = s;
		var idx = ret.lastIndexOf(".");
		if ( idx>=0){
			ret = ret.substring(0,idx);
		}
		return ret;
	}
	function getScriptName()
	{
		var ary = $.fileName.split("/");
		return File.decode( getFileNameWithoutExt(ary[ary.length-1]));
	}
	function getScriptPath()
	{
		var s = $.fileName;
		return s.substring(0,s.lastIndexOf("/"));
	}

	var	scriptName	= File.decode(getScriptName());
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	//とりあえず細かい関数
	function eq4(v){ return vv = (Math.floor(v/4))*4;}		//４の倍数に切り下げる
	function pluss4(v){ return vv = (Math.floor(v/4)+1)*4;}	//４足して４の倍数に切り下げる
	function minus4(v){ return vv = (Math.floor(v/4)-1)*4;}	//４引いて４の倍数に切り下げる
	//-----------------
	function trim(s){
		if ( s == "" ) return "";
		return s.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	//指定したコントロール(Listbox/Dorpdownlist)の選択されたitemのインデックスを返す
	function selectedIndex(ctrl)
	{
		var ret = -1;
		if ( ctrl == null) return ret;
		if ( ctrl.items.length<=0)  return ret;
		for ( var i=0; i<ctrl.items.length; i++){
			if (ctrl.items[i].selected == true) {
				ret = i;
				break;
			}
		}
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	//コントロールの一覧
	var crtlStr = new Array(
		"window",		//0*
		"button",		//1
		"checkbox",		//2
		"dropdownlist",	//3
		"edittext",		//4
		"group",		//5*
		"iconbutton",	//6
		"image",		//7
		"listbox",		//8
		"panel",		//9*
		"progressbar",	//10
		"radiobutton",	//11
		"scrollbar",	//12
		"slider",		//13
		"statictext"	//14
		);
	var parentNum = new Array(0,5,9);
	///////////////////////////////////////////////////////////////////////////////////////////////
	//コントロール管理のObject
	function ctrlItem()
	{
		this.ctrl	= null;
		this.kind	= 0;
		this.parentIndex	= 0;	//親コントロールのindex。０でメインウィンドウ
		this.name	= "";
		this.text	= "";
		this.left	= 0;
		this.top	= 0;
		this.width	= 0;
		this.height	= 0;
		//------------------------
		this.init = function()
		{
			this.ctrl			= null;
			this.kind			= 0;
			this.parentIndex	= 0;
			this.name			= "";
			this.text			= "";
			this.left			= 0;
			this.top			= 0;
			this.width			= 0;
			this.height		= 0;
		}
		this.init();	//念のため初期化
		//------------------------
		this.toText = function()
		{
			var ret = "";
			ret += this.kind + "\t";
			ret += this.parentIndex + "\t";
			ret += this.name + "\t";
			ret += this.text + "\t";
			ret += this.left + "\t";
			ret += this.top + "\t";
			ret += this.width + "\t";
			ret += this.height + "";
			return ret;
		}
		//------------------------
		this.fromText = function(s)
		{
			this.init();
			var ss = trim(s);
			if (ss == "") return false;
			var sa  = ss.split("\t");
			if ( sa.length<8) return false;
			if ( isNaN(sa[0])==true) return false;
			this.kind = sa[0] * 1;
			if ( isNaN(sa[1])==true) return false;
			this.parentIndex = sa[1] * 1;
			this.name = trim(sa[2]);
			if ( this.name == "") return false;
			this.text = trim(sa[3]);
			if ( isNaN(sa[4])==true) return false;
			this.left = sa[4] * 1;
			if ( isNaN(sa[5])==true) return false;
			this.top = sa[5] * 1;
			if ( isNaN(sa[6])==true) return false;
			this.width = sa[6] * 1;
			if ( isNaN(sa[7])==true) return false;
			this.height = sa[7] * 1;
			return true;
		}
		//------------------------
		this.setBounds = function(b)
		{
			this.left = b[0];
			this.top = b[1];
			this.width = b[2]-b[0];
			this.height = b[3]-b[1];
		}
		//------------------------
		this.getBounds = function()
		{
			var b = new Array;
			b.push(this.left);
			b.push(this.top);
			b.push(this.width + this.left);
			b.push(this.height + this.top);
			return b;
		}
		//------------------------
		this.getBoundsStr = function()
		{
			function sp3(v)
			{
				var vv = v;
				var minus = 1;
				if ( vv<0) {
					minus = -1;
					vv *= -1;
				}
				var ret = "";
				if (vv<=0) ret = "   0";
				else if (vv<10 ) ret = "   " + vv;
				else if (vv<100) ret = "  " + vv;
				else if (vv<1000) ret = " " + vv;
				else ret = "" + vv;
				if ( minus>=0) ret = " "+ret;
				else ret = "-"+ret;
				return ret;
			}
			var b = this.ctrl.bounds;
			return "[" + sp3(b[0]) +"," + sp3(b[1]) +"," + sp3(b[2]) +"," + sp3(b[3]) +"]"; 
		}
		//------------------------
		this.setPos = function(l,t,w,h)
		{
			this.left = l;
			this.top = t;
			this.width = w;
			this.height = h;
			if ( this.ctrl != null) {
				this.ctrl.bounds = new Array( l,t, l+w,t+h);
				this.ctrl.location = new Array( l,t);
			}
		}
		//------------------------
		//this.ctrlからパラメータへ反映させる
		this.ctrlToParams = function()
		{
			if ( this.ctrl != null) {
				var b = this.ctrl.bounds;
				this.left = b[0];
				this.top = b[1];
				this.width = b[2] - b[0];
				this.height = b[3] - b[1];
			}else{
				this.left = 0;
				this.top = 0;
				this.width = 0;
				this.height = 0;
			}
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	var ctrlList = new Array; //ctrlItemの配列
	//------------------------------------------------
	var ctrlIndex = -1;	//lstCtrlで選ばれているコントロールのインデックス
	var kindIndex = -1;
	var parentIndex = -1;

	var dummyPict = new File("(dbIcons)/dummyPict.png");

	var backupFile	= new File(scriptName + ".bakup");

	var ctrlFlag = false;
	var kindFlag = false;
	var parentFlag = false;
	/////////////////////////////////////////////////////////////////////
	//nameの重複をチェック
	function chkName(s)
	{
		var ret = false;
		if ( s == "") return ret;
		var ss = s.toLowerCase();
		if ( ctrlList.length>0){
			for ( var i=0; i<ctrlList.length; i++)
			{
				if (ss == ctrlList[i].name.toLowerCase()) return ret;
			}
		}
		ret = true;
		return ret;
	}
	/////////////////////////////////////////////////////////////////////
	//nameの重複をチェック。ただし自分自身は除く
	function chkNameSet(s,idx)
	{
		var ret = false;
		if ( s == "") return ret;
		var ss = s.toLowerCase();
		if ( ctrlList.length>0){
			for ( var i=0; i<ctrlList.length; i++)
			{
				if (ss == ctrlList[i].name.toLowerCase()) {
					if ( idx != i) return ret;
				}
			}
		}
		ret = true;
		return ret;
	}
	/////////////////////////////////////////////////////////////////////
	function ctrlListToText()
	{
		var ret = "";
		if (ctrlList.length<=0) return ret;
		var idx = 0;
		for ( var i=0; i<ctrlList.length; i++){
			if ( ctrlList[i].ctrl != null) {
				ret += ctrlList[i].toText();
				ret += "\r\n";
				idx++;
			}
		}
		return ret;
	}
	/////////////////////////////////////////////////////////////////////
	function textToCtrlList(s)
	{
		if ( s=="") return;
		var lines = s.split("\n");
		if ( lines.length<=0) return;

		//crtlListがあったらウィンドウを消す
		if ( ctrlList.length>0) ctrlList[0].close();
		ctrlList = new Array;

		for ( var i=0; i<lines.length; i++){
			var o = new ctrlItem();
			if ( o.fromText(lines[i]) == true){
				ctrlList.push(o);
			}
		}
	}
	/////////////////////////////////////////////////////////////////////
	function swapList(idx0,idx1)
	{
		var cnt = ctrlList.length;
		if ( ( idx0<=0)||(idx0>=cnt)||( idx1<=0)||(idx1>=cnt) ) return;
		
		var tmp = ctrlList[idx0];
		ctrlList[idx0] = ctrlList[idx1];
		ctrlList[idx1] = tmp;

		//parentIndexを補正
		for ( var i=1; i<cnt; i++){
			if ( ctrlList[i].parentIndex == idx0) {
				ctrlList[i].parentIndex = idx1;
			} else if ( ctrlList[i].parentIndex == idx1) {
				ctrlList[i].parentIndex = idx0;
			}
		}
	}
	/////////////////////////////////////////////////////////////////////
	function listUp(idx)
	{
		var cnt = ctrlList.length;
		if ( (idx<=1)||(idx>=cnt) ) return false;
		if ( (idx-1) <= ctrlList[idx].parentIndex ) return false;

		swapList(idx-1,idx);
		return true;
	}
	/////////////////////////////////////////////////////////////////////
	function listDown(idx)
	{
		var cnt = ctrlList.length;
		if ( (idx<1)||(idx>=cnt-1) ) return false;
		if ( (ctrlList[idx].kind == parentNum[0])||(ctrlList[idx].kind == parentNum[1])||(ctrlList[idx].kind == parentNum[2]) ){
			if ( ctrlList[idx+1].parentIndex == idx) return false;
		}

		swapList(idx,idx+1);
		return true;
	}
	/////////////////////////////////////////////////////////////////////
	//アイコンファイルのパスを作成
	var p = getScriptPath() + "/(" + getScriptName() + ")/";
	/*
		lstKind にcrtlStrを登録すること
	*/
	var toolWin = ( me instanceof Panel) ? me : new Window("palette", scriptName, [  88,  116,   88+ 358,  116+ 426]);
	
	
	var btnSave = toolWin.add("button", [   9,   12,    9+  72,   12+  23], "保存");
	var btnLoad = toolWin.add("button", [  87,   12,   87+  72,   12+  23], "読み込み");
	var btnShowCode = toolWin.add("button", [ 265,   12,  265+  72,   12+  23], "コード");
	var stCtrlList = toolWin.add("statictext", [  15,   41,   15+  91,   41+  13], "コントロールリスト");
	var lstCtrl = toolWin.add("listbox", [  12,   59,   12+ 139,   59+ 328], []);
	var btnUp = toolWin.add("button", [  16,  393,   16+  42,  393+  23], "上へ");
	var btnDown = toolWin.add("button", [  64,  393,   64+  42,  393+  23], "下へ");
	var btnRemove = toolWin.add("button", [ 109,  394,  109+  42,  394+  23], "消す");
	var pnlParams = toolWin.add("panel", [ 157,   42,  157+ 189,   42+ 175], "params");
	var stKind = pnlParams.add("statictext", [   6,   14,    6+  40,   14+  13], "種類");
	var lstKind = pnlParams.add("dropdownlist", [  10,   30,   10+ 121,   30+  20], crtlStr);
	var btnKind = pnlParams.add("button", [ 134,   30,  134+  48,   30+  20], "変更");
	var stParent = pnlParams.add("statictext", [   4,   51,    4+  40,   51+  13], "parent");
	var lstParent = pnlParams.add("dropdownlist", [  10,   67,   10+ 121,   67+  20], [ ]);
	var btnParent = pnlParams.add("button", [ 134,   67,  134+  48,   67+  20], "変更");
	var stName = pnlParams.add("statictext", [   8,   88,    8+  40,   88+  13], "name");
	var edName = pnlParams.add("edittext", [  10,  103,   10+ 121,  103+  19], "", {readonly:false, multiline:false});
	var btnName = pnlParams.add("button", [ 134,  102,  134+  48,  102+  20], "変更");
	var stText = pnlParams.add("statictext", [  10,  125,   10+  40,  125+  13], "text");
	var edText = pnlParams.add("edittext", [  10,  140,   10+ 121,  140+  19], "", {readonly:false, multiline:false});
	var btnText = pnlParams.add("button", [ 134,  139,  134+  48,  139+  20], "変更");
	var pnlPos = toolWin.add("panel", [ 157,  223,  157+ 189,  223+ 161], "position");
	var stLeft = pnlPos.add("statictext", [  24,   17,   24+  24,   17+  13], "left");
	var edLeft = pnlPos.add("edittext", [  52,   14,   52+  47,   14+  19], "", {readonly:false, multiline:false});
	var stTop = pnlPos.add("statictext", [ 102,   17,  102+  24,   17+  13], "top");
	var edTop = pnlPos.add("edittext", [ 128,   14,  128+  47,   14+  19], "", {readonly:false, multiline:false});
	var stWidth = pnlPos.add("statictext", [  13,   42,   13+  35,   42+  13], "width");
	var edWidth = pnlPos.add("edittext", [  52,   39,   52+  68,   39+  19], "", {readonly:false, multiline:false});
	var stHeight = pnlPos.add("statictext", [  10,   66,   10+  38,   66+  13], "height");
	var edHeight = pnlPos.add("edittext", [  52,   64,   52+  68,   64+  19], "", {readonly:false, multiline:false});
	var btnSize = pnlPos.add("button", [ 132,   62,  132+  48,   62+  21], "変更");
	var btnMoveTop = pnlPos.add("iconbutton", [  44,   90,   44+  24,   90+  24],new File(p+"moveTop.png") );
	var btnMoveLeft = pnlPos.add("iconbutton", [  17,  104,   17+  24,  104+  24],new File(p+"moveleft.png") );
	var btnMoveRight = pnlPos.add("iconbutton", [  70,  104,   70+  24,  104+  24],new File(p+"moveRight.png") );
	var btnMoveBottom = pnlPos.add("iconbutton", [  44,  119,   44+  24,  119+  24],new File(p+"moveBottom.png") );
	var btnHeightUp = pnlPos.add("iconbutton", [ 156,   91,  156+  24,   91+  24],new File(p+"heightUp.png") );
	var btnHeightDown = pnlPos.add("iconbutton", [ 156,  119,  156+  24,  119+  24],new File(p+"heightDown.png") );
	var btnWidthUp = pnlPos.add("iconbutton", [  97,  119,   97+  24,  119+  24],new File(p+"widthUp.png") );
	var btnWidthDown = pnlPos.add("iconbutton", [ 126,  119,  126+  24,  119+  24],new File(p+"widthDown.png") );
	var btnNew = toolWin.add("button", [ 274,  390,  274+  72,  390+  31], "追加");



	/////////////////////////////////////////////////////////////////////
	function fontSet(idx,b)
	{
		if ( (idx<0)||(idx>=ctrlList.length) ) return;
		//フォントを大きく
		var fnt = ctrlList[idx].ctrl.graphics.font;
		var fb;
		if ((b==false)||(b==null)||(b=undefined)){
			fb = ScriptUI.FontStyle.REGULAR;
		}else{
			fb = ScriptUI.FontStyle.BOLD;
		}
		ctrlList[idx].ctrl.graphics.font = ScriptUI.newFont (fnt.name, fb, fnt.size);
		
	
	}
	function fontSetAll(b)
	{
		if ( ctrlList.length<=0) return;
		for ( var i=0; i<ctrlList.length; i++) fontSet(i,b);
	}
	/////////////////////////////////////////////////////////////////////
	//UIの初期化
	function uiInit()
	{
		//lstCtrl.removeAll();
		//lstKind.items[0].selected = true;
		lstParent.removeAll();
		lstKind.enabled = true;
		lstParent.enabled = true;
		btnUp.enabled = false;
		btnDown.enabled = false;
		btnRemove.enabled = false;
		btnKind.enabled = false;
		btnParent.enabled = false;
		btnName.enabled = false;
		btnText.enabled = false;
		btnSize.enabled = false;
		
		btnNew.enabled = true;

		btnMoveTop.enabled = false;
		btnMoveRight.enabled = false;
		btnMoveBottom.enabled = false;
		btnMoveLeft.enabled = false;
		btnWidthUp.enabled = false;
		btnWidthDown.enabled = false;
		btnHeightUp.enabled = false;
		btnHeightDown.enabled = false;
		
		edName.text = "";
		edText.text = "";
		edTop.text = "";
		edLeft.text = "";
		edWidth.text = "";
		edHeight.text = "";
	}
	function uiDef()
	{
		uiInit();
		edName.text = "dlg";
		edText.text = "myDialog";
		edTop.text = "0";
		edLeft.text = "0";
		edWidth.text = "400";
		edHeight.text = "300";

		btnMoveTop.helpTip =
		btnMoveRight.helpTip =
		btnMoveBottom.helpTip =
		btnMoveLeft.helpTip = "位置の移動";
		
		btnWidthUp.helpTip = 
		btnWidthDown.helpTip = "横幅の変更";
		btnHeightUp.helpTip =
		btnHeightDown.helpTip = "縦幅の変更";
	}
	uiDef();
	/////////////////////////////////////////////////////////////////////
	function toListbox()
	{
		lstCtrl.removeAll();
		if (ctrlList.length<=0) return;
		for ( var i=0; i<ctrlList.length; i++){
			lstCtrl.add("item",ctrlList[i].name);
		}
	}
	/////////////////////////////////////////////////////////////////////
	function getParams()
	{
		var ret = new ctrlItem();
		ret.ctrl = null;
		ret.kind = selectedIndex(lstKind);
		ret.parentIndex = selectedIndex(lstParent);
		ret.name = trim(edName.text);
		ret.text = trim(edText.text);
		
		ret.left = 0;
		ret.top = 0;
		ret.width = 0;
		ret.height = 0;
		if ( isNaN(edLeft.text)==false) ret.left = edLeft.text *1;
		if ( isNaN(edTop.text)==false) ret.top = edTop.text *1;
		if ( isNaN(edWidth.text)==false) ret.width = edWidth.text *1;
		if ( isNaN(edHeight.text)==false) ret.height = edHeight.text *1;
		
		return ret;
	}
	/////////////////////////////////////////////////////////////////////
	function closeAll()
	{
		uiDef();
		lstCtrl.removeAll();
		if ( ctrlList.length >0 ) {
			ctrlList[0].ctrl.close();
			ctrlList = new Array;
		}
	}
	
	/////////////////////////////////////////////////////////////////////
	function ctrlListToParams(idx)
	{
		edLeft.text = ctrlList[idx].left +"";
		edTop.text = ctrlList[idx].top +"";
		edWidth.text = ctrlList[idx].width +"";
		edHeight.text = ctrlList[idx].height +"";
	}
	/////////////////////////////////////////////////////////////////////
	function sizeChange()
	{
		if ((ctrlList.length<=0)||( ctrlIndex !=0 )) return;
		ctrlList[0].ctrlToParams();
		ctrlListToParams(0);
	}
	/////////////////////////////////////////////////////////////////////
	function setEditLoc()
	{
		if ( ctrlList[0].ctrl != null){
			var b = toolWin.bounds;
			var n = new Array(0,0,0,0);
			n[0] = b[2] + 20;
			n[1] = b[1];
			n[2] = n[0] + prm.width;
			n[3] = n[1] + prm.height;
			
			ctrlList[0].ctrl.bounds = n;
			ctrlList[0].ctrl.location = new Array(n[0],n[1]);
		}
	}
	/////////////////////////////////////////////////////////////////////
	function rebuild()
	{
		if (ctrlList.length<=1) return;
		var idx = ctrlList.length-2;
		//コントロールを削除
		for ( var i=ctrlList.length-1; i>=1; i--)
		{
			if (ctrlList[i].ctrl != null){
				ctrlList[i].ctrl.parent.remove(ctrlList[i].ctrl);
				ctrlList[i].ctrl = null;
			}
		}
		for ( var i=1; i<ctrlList.length; i++){
			var b = new Array;
			b.push(ctrlList[i].left);
			b.push(ctrlList[i].top);
			b.push(ctrlList[i].left + ctrlList[i].width);
			b.push(ctrlList[i].top + ctrlList[i].height);
			switch(ctrlList[i].kind){
				case 1: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("button",b,ctrlList[i].text);break;
				case 2: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("checkbox",b,ctrlList[i].text);break;
				case 3: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("dropdownlist",b,new Array(ctrlList[i].text));break;
				case 4: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("edittext",b,ctrlList[i].text);break;
				case 5: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("group",b); break;
				case 6: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("iconbutton",b,dummyPict); break;
				case 7: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("image",b,dummyPict);break;
				case 8: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("listbox",b,new Array(ctrlList[i].text));break;
				case 9: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("panel",b,ctrlList[i].text);break;
				case 10: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("progressbar",b); break;
				case 11: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("radiobutton",b,ctrlList[i].text);break;
				case 12: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("scrollbar",b); break;
				case 13: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("slider",b);break;
				case 14: ctrlList[i].ctrl = ctrlList[ctrlList[i].parentIndex].ctrl.add("statictext",b,ctrlList[i].text);break;
			}
			
		}
		
	}
	/////////////////////////////////////////////////////////////////////
	function newDialog(prm)
	{
		if ( ctrlList.length>0) closeAll();

		if (prm.name =="") { alert("nameが無い");return;}
		if ((prm.width<40)||(prm.height<40)) { alert("width/heightが変");return;}
		prm.kind = 0;
		prm.parentIndex = 0;
		prm.ctrl = new Window("palette", prm.text, prm.getBounds(),{resizeable:true,closeButton:false});
		
		if (prm.ctrl == null) {alert("error");}
		prm.ctrl.onMove =
		prm.ctrl.onMoving =
		prm.ctrl.onResize =
		prm.ctrl.onResizing = sizeChange;
		ctrlList.push(prm);
		toListbox();

		var b = toolWin.bounds;
		var n = new Array(0,0,0,0);
		n[0] = b[2] + 20;
		n[1] = b[1];
		n[2] = n[0] + prm.width;
		n[3] = n[1] + prm.height;
		
		prm.ctrl.bounds = n;
		prm.ctrl.location = new Array(n[0],n[1]);
		
		prm.ctrl.show();
		lstCtrl.items[0].selected = true;
		sizeChange();
	}
	/////////////////////////////////////////////////////////////////////
	function newCntrol(prm)
	{
		if ( prm.kind<=0) {
			alert("windowは追加できません。");
			return;
		}else if ( prm.kind>14){
			alert("kindの値がおかしい。");
			return;
		}
		if (prm.parentIndex<0) prm.parentIndex = 0;
		if ( (ctrlList[prm.parentIndex].kind != parentNum[0])
			&&(ctrlList[prm.parentIndex].kind != parentNum[1])
			&&(ctrlList[prm.parentIndex].kind != parentNum[2]) ){
			alert(ctrlList[prm.parentIndex].name + "はparentに設定できません");
			return;
		}
		if (prm.name =="") { alert("nameが無い");return;}
		if ( chkName(prm.name)==false) { alert("nameが重複している");return;}
		if ((prm.left<0)||(prm.top<0)) { alert("left/topが変");return;}
		if ((prm.width<4)||(prm.height<4)) { alert("width/heightが変");return;}
		var b = ctrlList[prm.parentIndex].ctrl.bounds;
		
		if ( (prm.left>=(b[2]-prm.width))||(prm.top>=(b[3]-prm.height))){ alert("left/topが変2");return;}
		if ( (prm.width>=(b[2]-b[0]))||(prm.height>=(b[3]-b[1]))){ alert("width/heightが変2");return;}


		var b = new Array;
		b.push(prm.left);
		b.push(prm.top);
		b.push(prm.left + prm.width);
		b.push(prm.top + prm.height);
		switch(prm.kind){
			case 1: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("button",b,prm.text);break;
			case 2: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("checkbox",b,prm.text);break;
			case 3: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("dropdownlist",b,new Array(prm.text));break;
			case 4: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("edittext",b,prm.text);break;
			case 5: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("group",b); break;
			case 6: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("iconbutton",b,dummyPict); break;
			case 7: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("image",b,dummyPict);break;
			case 8: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("listbox",b,new Array(prm.text));break;
			case 9: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("panel",b,prm.text);break;
			case 10: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("progressbar",b); break;
			case 11: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("radiobutton",b,prm.text);break;
			case 12: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("scrollbar",b); break;
			case 13: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("slider",b);break;
			case 14: prm.ctrl = ctrlList[prm.parentIndex].ctrl.add("statictext",b,prm.text);break;
		}
		if ( ctrlIndex<=0){
			ctrlList.push(prm);
			toListbox();
			lstCtrl.items[lstCtrl.items.length-1].selected = true;
		}else{
			var prm2 = ctrlList[ctrlIndex];
			ctrlList.splice(ctrlIndex,1,prm,prm2);
			var ci = ctrlIndex;
			rebuild();
			toListbox();
			lstCtrl.items[ci].selected = true;
		}

	}
	/////////////////////////////////////////////////////////////////////
	function setParams()
	{
		if ( ctrlIndex<0) return;
		var prm = getParams();
		if ( ctrlIndex==0) {
			if ( prm.kind != 0 ) { alert("windowは変更できません。"); return;}
			if ( prm.parentIndex != 0 ) { alert("parentはまだ、変更できません。"); return;}
			if ( (prm.width<16)||(prm.height<16) ){ alert("width/heightが変"); return;}
		}else{
		}
		if (prm.name == "")  { alert("nameがない"); return;}
		if (chkNameSet(prm.name,ctrlIndex)==false) { alert("nameが重複"); return;}
		
		
		ctrlList[ctrlIndex].name = prm.name;
		ctrlList[ctrlIndex].text = prm.text;
		ctrlList[ctrlIndex].ctrl.text = prm.text;
		
		var b = new Array(0,0,0,0);
		ctrlList[ctrlIndex].left = prm.left;
		ctrlList[ctrlIndex].top = prm.top;
		ctrlList[ctrlIndex].width = prm.width;
		ctrlList[ctrlIndex].height = prm.height;
		b[0] = prm.left;
		b[1] = prm.top;
		b[2] = b[0] + prm.width;
		b[3] = b[1] + prm.height;
		ctrlList[ctrlIndex].ctrl.bounds = b;
		ctrlList[ctrlIndex].ctrl.location = new Array(prm.left,prm.top);
		
		var ci = ctrlIndex;
		toListbox();
		lstCtrl.items[ci].selected = true;
	}
	/////////////////////////////////////////////////////////////////////
	function changeParentIndex(idx,p)
	{
		if ( (idx<0)||(idx>=ctrlList.length)) return;
		if (ctrlList[idx].parentIndex == p) return;
	}
	/////////////////////////////////////////////////////////////////////
	function save(f)
	{
		if ( f == null) return false;
		var ret = scriptName +"\r\n";
		ret += "; １行目は「ダイアログデザイナ」で固定。\r\n"
		ret += "; ; or # で始まる行はコメント。\r\n";
		ret += "; Tab切りのUTF-8エンコードのテキストファイル。項目は以下の8項目\r\n";
		ret += "; (コントロールの種類)(親コントロールのインデックス)(コントロールの名称)(テキスト)(left)(top)(width)(height)\r\n";
		ret += "; コントロールの種類は以下の通り\r\n";
		ret += "; 0:window 1:button 2:checkbox 3:dropdownlist 4:edittext 5:group 6:iconbutton 7:image 8:listbox 9:panel 10:progressbar 11:radiobutton 12:scrollbar 13:slider 14:statictext\r\n";

		ret +="\r\n";
		if ( ctrlList.length>0){
			for ( var i=0; i<ctrlList.length; i++){
				ret += ctrlList[i].toText() +"\r\n";
			}
		}
		ret +="\r\n";
		var flag = f.open("w");
		if (flag == true)
		{
			try{
				f.encoding = "utf-8";
				f.write(ret);
				f.close();
				return true;
			}catch(e){
				return false;
			}
		}	
		
	}
	/////////////////////////////////////////////////////////////////////
	function load(f)
	{
		if (( f == null)||(f.exists == false)) return false;
		var flag = f.open("r");
		if (flag == true)
		{
			try
			{
				var lines = new Array;
				f.encoding = "utf-8";
				while(f.eof==false){
					var line = trim(f.readln());
					if ( line != "")
						if ((line[0] !=";")&&(line[0] !="#"))
							lines.push(line);
				}
				f.close();
				if ( lines.length<=1) {
					return false;
				}
				if ( lines[0] != scriptName){
					return false;
				}
				closeAll();
				for ( var i=1; i<lines.length; i++){
					var obj = new ctrlItem;
					if (obj.fromText(lines[i])== true){
						if ( i==1){
							newDialog(obj);
						}else{
							ctrlList.push(obj);
						}
					}
				}
				if ( ctrlList.length>1){
					rebuild();
					toListbox();

				}else{
				}
				return true;
			}catch(e){
				alert(e.toString());
				return false;
			}
		}
		
	}
	/////////////////////////////////////////////////////////////////////
	function saveWithDialog()
	{
		var sv = File.saveDialog("ダイアログの保存","*.dlg");
		if ( sv != null) {
			if (save(sv)== false){
				alert("save error!");
			}
		} 
	}
	/////////////////////////////////////////////////////////////////////
	function loadWithDialog()
	{
		var ld = File.openDialog("ダイアログの読み込み","*.dlg");
		if ( ld != null) {
			if (load(ld)== false){
				alert("load error!");
			}
		} 
	}
	btnSave.onClick = saveWithDialog;
	btnLoad.onClick = loadWithDialog;
	/////////////////////////////////////////////////////////////////////
	btnNew.onClick = function()
	{
		if (ctrlList.length<=0) {
			newDialog(getParams());
		}else{
			ctrlIndex = selectedIndex(lstCtrl);
			newCntrol(getParams());
		}
	}
	/////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////
	function getCtrlToPrm()
	{
		lstParent.removeAll();
		if ( ctrlIndex>=0){
			lstKind.items[ctrlList[ctrlIndex].kind].selected = true;
			
			if ( ctrlIndex == 0){
				lstParent.add("item",ctrlList[0].name);
			}else{
				for ( var i= 0; i<ctrlIndex; i++){
					lstParent.add("item",ctrlList[i].name);
				}
			}
			lstParent.items[ctrlList[ctrlIndex].parentIndex].selected = true;
			edName.text = ctrlList[ctrlIndex].name;
			edText.text = ctrlList[ctrlIndex].text;
			
			ctrlListToParams(ctrlIndex);
		}
	}
	/////////////////////////////////////////////////////////////////////
	function ctrlSize(w,p)
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if (ctrlIndex <0) return;
		var b = ctrlList[ctrlIndex].ctrl.bounds;
		b[0] = eq4(b[0]);
		b[1] = eq4(b[1]);
		b[2] = eq4(b[2]);
		b[3] = eq4(b[3]);
		
		if ( w == true) {
			//横幅
			if ( p==true) {
				b[2] += 4;
			}else{
				if ( (b[2]-b[0])>8) b[2] -= 4;
			}
		}else{
			//縦
			if ( p==true) {
				b[3] += 4;
			}else{
				if ( (b[3]-b[1])>8) b[3] -= 4;
			}
		}
		ctrlList[ctrlIndex].left = b[0];
		ctrlList[ctrlIndex].top = b[1];
		ctrlList[ctrlIndex].width = b[2] - b[0];
		ctrlList[ctrlIndex].height = b[3] - b[1];
		ctrlList[ctrlIndex].ctrl.bounds = b;
		ctrlList[ctrlIndex].ctrl.location = new Array(b[0],b[1]);
		
		edLeft.text = ctrlList[ctrlIndex].left;
		edTop.text = ctrlList[ctrlIndex].top;
		edWidth.text = ctrlList[ctrlIndex].width;
		edHeight.text = ctrlList[ctrlIndex].height;
	}
	/////////////////////////////////////////////////////////////////////
	function ctrlMove(dir)
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if (ctrlIndex <0) return;
		var b = ctrlList[ctrlIndex].ctrl.bounds;
		switch(dir)
		{
			case 0: 
				b[1] = minus4(b[1]); b[3] = minus4(b[3]); 
				b[0] = eq4(b[0]); b[2] = eq4(b[2]); 
				break;
			case 1: 
				b[0] = pluss4(b[0]); b[2] = pluss4(b[2]); 
				b[1] = eq4(b[1]); b[3] = eq4(b[3]);
				break;
			case 2: 
				b[1] = pluss4(b[1]); b[3] = pluss4(b[3]);
				b[0] = eq4(b[0]); b[2] = eq4(b[2]); 
				 break;
			case 3: 
				b[0] = minus4(b[0]); b[2] = minus4(b[2]);
				b[1] = eq4(b[1]); b[3] = eq4(b[3]);
				break;
		}
		ctrlList[ctrlIndex].left = b[0];
		ctrlList[ctrlIndex].top = b[1];
		ctrlList[ctrlIndex].width = b[2] - b[0];
		ctrlList[ctrlIndex].height = b[3] - b[1];
		ctrlList[ctrlIndex].ctrl.bounds = b;
		ctrlList[ctrlIndex].ctrl.location = new Array(b[0],b[1]);
		
		edLeft.text = ctrlList[ctrlIndex].left;
		edTop.text = ctrlList[ctrlIndex].top;
		edWidth.text = ctrlList[ctrlIndex].width;
		edHeight.text = ctrlList[ctrlIndex].height;
		
	}
	btnMoveTop.onClick = function(){ ctrlMove(0);}
	btnMoveRight.onClick = function(){ ctrlMove(1);}
	btnMoveBottom.onClick = function(){ ctrlMove(2);}
	btnMoveLeft.onClick = function(){ ctrlMove(3);}
	btnWidthUp.onClick = function(){ ctrlSize(true,true);}
	btnWidthDown.onClick = function(){ ctrlSize(true,false);}
	btnHeightUp.onClick = function(){ ctrlSize(false,true);}
	btnHeightDown.onClick = function(){ ctrlSize(false,false);}
	/////////////////////////////////////////////////////////////////////
	btnUp.onClick = function()
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if (listUp(ctrlIndex) == true){
			toListbox();
			ctrlIndex--;
			lstCtrl.items[ctrlIndex].selected = true;
			rebuild();
		}
	}
	/////////////////////////////////////////////////////////////////////
	btnDown.onClick = function()
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if (listDown(ctrlIndex) == true){
			toListbox();
			ctrlIndex++;
			lstCtrl.items[ctrlIndex].selected = true;
			rebuild();
		}
	}
	/////////////////////////////////////////////////////////////////////
	/*
		表示関係
	*/
	/////////////////////////////////////////////////////////////////////
	function showCode(s)
	{
		//ダイアログを作成して表示。
		//カット＆ペーストしやすいようにedittextに表示
		var winObj = new Window("dialog", "ダイアログデザイナ", [0, 0, 1024, 400],{resizeable:true});
		var gb1 = winObj.add("panel", [12, 12, 12+1000, 12+350], "javascript code" );
		var tbProp = gb1.add("edittext", [10, 20, 10+980, 20+320], s,{multiline: true,readonly:true } );
		var btnOK = winObj.add("button", [850, 365, 850+98, 365+23], "OK", {name:'ok'});
		//フォントを大きく
		var fnt = tbProp.graphics.font;
		tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.5);
		//コントロールを配置する
		function sizeSet()
		{
			var btnW = 100;
			var btnH = 23;
			var b = winObj.bounds;
			
			var bb = new Array;
			bb[0] = 12;
			bb[1] = 12;
			bb[2] = bb[0] + (b[2]-b[0]) - (bb[0]*2);
			bb[3] = bb[1] + (b[3]-b[1]) - (bb[1]*2) - (btnH +4);
			
			gb1.bounds = bb;
			var bb2 = new Array;
			bb2[0] = 10;
			bb2[1] = 10;
			bb2[2] = bb2[0] + (bb[2]-bb[0]) - (bb2[0]*2);
			bb2[3] = bb2[1] + (bb[3]-bb[1]) - (bb2[1]*2);
			tbProp.bounds = bb2;
			
			var bb3 = new Array;
			bb3[0] = (b[2] -b[0]) - (btnW +24);
			bb3[1] = bb[3] + 4;
			bb3[2] = bb3[0] + btnW;
			bb3[3] = bb3[1] + btnH;
			btnOK.bounds = bb3;
		}
		sizeSet();
		winObj.onResize = sizeSet;
		
		winObj.center();
		winObj.show();
	}
	/////////////////////////////////////////////////////////////////////
	function makeCode()
	{
		if ( ctrlList.length<=0) return;
		var ret = "";
		
		ret = "var " + ctrlList[0].name + " =  new Window(\"dialog\",\"" + ctrlList[0].text +"\", "+ ctrlList[0].getBoundsStr()+");\r\n";
		if ( ctrlList.length>1){
			for ( var i=1; i<ctrlList.length; i++){
				var pName = ctrlList[ctrlList[i].parentIndex].name;
				switch(ctrlList[i].kind){
					case 1: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"button\"," + ctrlList[i].getBoundsStr() + ",\"" + ctrlList[i].text +"\");\r\n";break;
					case 2: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"checkbox\"," + ctrlList[i].getBoundsStr() + ",\"" + ctrlList[i].text +"\");\r\n";break;
					case 3: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"dropdownlist\"," + ctrlList[i].getBoundsStr() + ",[\"" + ctrlList[i].text +"\]);\r\n";break;
					case 4: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"edittext\"," + ctrlList[i].getBoundsStr() + ",\"" + ctrlList[i].text +"\");\r\n";break;
					case 5: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"group\"," + ctrlList[i].getBoundsStr() + ");\r\n";break;
					case 6: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"iconbutton\"," + ctrlList[i].getBoundsStr() + ", new File (\"dummmyPict.png\") );\r\n";break;
					case 7: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"image\"," + ctrlList[i].getBoundsStr() + ", new File (\"dummmyPict.png\") );\r\n";break;
					case 8: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"listbox\"," + ctrlList[i].getBoundsStr() + ",[\"" + ctrlList[i].text +"\"]);\r\n";break;
					case 9: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"panel\"," + ctrlList[i].getBoundsStr() + ",\"" + ctrlList[i].text +"\");\r\n";break;
					case 10: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"progressbar\"," + ctrlList[i].getBoundsStr() +");\r\n";break;
					case 11: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"radiobutton\"," + ctrlList[i].getBoundsStr() + ",\"" + ctrlList[i].text +"\");\r\n";break;
					case 12: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"scrollbar\"," + ctrlList[i].getBoundsStr() +");\r\n";break;
					case 13: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"slider\"," + ctrlList[i].getBoundsStr() +");\r\n";break;
					case 14: ret += "var " + ctrlList[i].name + " =  " + pName  + ".add(\"statictext\"," + ctrlList[i].getBoundsStr() + ",\"" + ctrlList[i].text +"\");\r\n";break;
				}
			}
		}
		ret += ctrlList[0].name +".center();\r\n";
		ret += ctrlList[0].name +".show();\r\n";
		showCode(ret);
	}
	
	btnShowCode.onClick = makeCode;
	/////////////////////////////////////////////////////////////////////
	function removeCtrl()
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if (ctrlIndex<0) return;
		//ターゲットの種類を獲得
		var targetKind = ctrlList[ctrlIndex].kind;
		if ((targetKind == parentNum[0])||(ctrlIndex ==0)) {
			if ( confirm("ウィンドウを消去すると全てが削除されます。いいですか？")== true){
				closeAll();
			}
			return;
		}
		//Panel Groupなら子を調べる
		if ((targetKind == parentNum[1])||(targetKind == parentNum[2])) {
			var pb = ctrlList[ctrlIndex].ctrl.bounds;
			for (var i=1; i<ctrlList.length; i++){
				if ( i != ctrlIndex){
					//子コントロールか？
					if (ctrlList[i].parentIndex == ctrlIndex ){
						var b = ctrlList[i].ctrl.bounds;
						//親をダイアログへ
						ctrlList[i].parentIndex = 0;
						//位置の補正
						ctrlList[i].left = b[0] + pb[0];
						ctrlList[i].top = b[1] + pb[1];
						//コントロールは削除
						ctrlList[i].ctrl.parent.remove(ctrlList[i].ctrl);
						ctrlList[i].ctrl = null;
					}
				}
			}
		}
		//ターゲットを削除
		ctrlList[ctrlIndex].ctrl.parent.remove(ctrlList[ctrlIndex].ctrl);
		ctrlList.splice(ctrlIndex,1);
		ctrlIndex = -1;
		//作り直す
		rebuild();
		toListbox();
	}
	btnRemove.onClick = removeCtrl;

	/////////////////////////////////////////////////////////////////////
	lstCtrl.onChange = function()
	{
		var cnt = ctrlList.length;
		ctrlIndex = selectedIndex(lstCtrl);
		fontSetAll(false);
		if ( (ctrlIndex>=0)&&(ctrlIndex < cnt)){
			fontSet(ctrlIndex,true);
			
			getCtrlToPrm();
			
			if (ctrlIndex == 0) {
				btnUp.enabled = false; 
				btnDown.enabled = false;
				btnKind.enabled = false;
				btnParent.enabled = false;
			}else{
				btnUp.enabled = ( ctrlIndex>=2); 
				btnDown.enabled = ( ctrlIndex<cnt-1);
				btnKind.enabled = true;
				//btnParent.enabled = true;
			}
			btnRemove.enabled = true;
			btnName.enabled = true;
			btnText.enabled = true;
			btnSize.enabled = true;
			
			btnMoveTop.enabled = true;
			btnMoveRight.enabled = true;
			btnMoveBottom.enabled = true;
			btnMoveLeft.enabled = true;
			btnWidthUp.enabled = true;
			btnWidthDown.enabled = true;
			btnHeightUp.enabled = true;
			btnHeightDown.enabled = true;
		}else{
			uiInit();
			lstKind.items[0].selected = true;
			if ( cnt>0){
				for ( var i=0; i<cnt; i++){
					lstParent.add("item",ctrlList[i].name);
				}
				lstParent.items[0].selected = true;
			}
		}
	}
	/////////////////////////////////////////////////////////////////////
	lstKind.onChange = function()
	{
		if ( kindFlag==true) return;
		kindIndex = -1;
		ctrlIndex = selectedIndex(lstCtrl);
		if ((ctrlList.length<=0)||(ctrlIndex <0)) return;
		var b = kindFlag;
		kindFlag = true;
		kindIndex = selectedIndex(lstKind);
		var orgKind = ctrlList[ctrlIndex].kind;
		if ( (kindIndex == parentNum[1])||(kindIndex == parentNum[2])){
			if ((orgKind != parentNum[1])&&(orgKind != parentNum[2]))
			{
				kindIndex = orgKind;
				lstKind.items[kindIndex].selected =true;
			}
		}else{
			if ((orgKind == parentNum[1])||(orgKind == parentNum[2]))
			{
				kindIndex = orgKind;
				lstKind.items[kindIndex].selected =true;
			}
		}
		btnKind.enabled = (kindIndex != orgKind);

		kindFlag = b;
	}
	/////////////////////////////////////////////////////////////////////
	lstParent.onChange = function()
	{
		if ( parentFlag == true) return;
		btnParent.enabled = false;
		var b = parentFlag;
		parentFlag = true;
		ctrlIndex = selectedIndex(lstCtrl);
		
		if (( ctrlList.length<=0)||( lstParent.items.length<=0)){
			parentFlag = b;
			return;
		}
		ctrlIndex = selectedIndex(lstCtrl);
		var parentIndex = selectedIndex(lstParent);
		if ((parentIndex<0)||(ctrlIndex<0)){
			parentFlag = b;
			return;
		}
		
		var kind = ctrlList[parentIndex].kind;
		if ( (kind==parentNum[0])||(kind==parentNum[1])||(kind==parentNum[2]) ){
			btnParent.enabled = ( parentIndex != ctrlList[ctrlIndex].parentIndex);
		}else{
			alert(ctrlList[parentIndex].name +"はparentに設定できません。");
			lstParent.items[ctrlList[ctrlIndex].parentIndex].selected = true;
		}
		
		parentFlag = b;
		
	}
	/////////////////////////////////////////////////////////////////////
	btnName.onClick = function()
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if ( ctrlIndex>=0){
			var s = trim(edName.text);
			if ( s=="") return;
			if ( chkName(s)==true){
				ctrlList[ctrlIndex].name = s;
				toListbox();
				lstCtrl.items[ctrlIndex].selected = true;
			}
		}
	}
	/////////////////////////////////////////////////////////////////////
	btnText.onClick = function()
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if ( ctrlIndex>=0){
			var s = trim(edText.text);
			if ( s=="") return;
			if ( chkName(s)==true){
				ctrlList[ctrlIndex].text = s;
				ctrlList[ctrlIndex].ctrl.text = s;
				toListbox();
				lstCtrl.items[ctrlIndex].selected = true;
			}
		}
	}
	/////////////////////////////////////////////////////////////////////
	btnSize.onClick = function()
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if ( ctrlIndex>=0) {
			var l = 0;
			var t = 0;
			var w = 0;
			var h = 0;

			if ( isNaN(edLeft.text)==true){
				alert("leftが異常です。");
				return;
			}
			l = edLeft.text *1;
			if ( isNaN(edTop.text)==true){
				alert("topが異常です。");
				return;
			}
			 t = edTop.text *1;
			if ( isNaN(edWidth.text)==true){
				alert("widthが異常です。");
				return;
			}
			 w = edWidth.text *1;
			if ( isNaN(edHeight.text)==true){
				alert("heightが異常です。");
				return;
			}
			 h = edHeight.text *1;
			if ( (l<=0)||(t<=0)||(w<16)||(h<16)) {
				alert("サイズが異常です。");
				return;
			}
		}
		
		ctrlList[ctrlIndex].left = l;
		ctrlList[ctrlIndex].top = t;
		ctrlList[ctrlIndex].width = w;
		ctrlList[ctrlIndex].height = h;
		ctrlList[ctrlIndex].ctrl.bounds = new Array(l,t,l+w,t+h);
		ctrlList[ctrlIndex].ctrl.location = new Array(l,t);
		
		var ci = ctrlIndex;
		toListbox();
		lstCtrl.items[ci].selected = true;

	}
	/////////////////////////////////////////////////////////////////////
	btnKind.onClick = function()
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if (ctrlIndex<=0) return;
		kindIndex = selectedIndex(lstKind);
		if (kindIndex <= 0){
			alert("ダイアログへは変更不可です");
			return;
		} 
		var orgKind = ctrlList[ctrlIndex].kind;
		if (kindIndex == orgKind) return;
		if ( (kindIndex == parentNum[1])||(kindIndex == parentNum[2]) ){
			if ((orgKind !=parentNum[1])&&( orgKind !=parentNum[2])){
				alert("変更不可");
				return;
			}
		}else{
			if ((orgKind ==parentNum[1])||( orgKind ==parentNum[2])){
				alert("変更不可");
				return;
			}
		}
		ctrlList[ctrlIndex].kind = kindIndex;
		rebuild();
		toListbox();
		
	}
	/////////////////////////////////////////////////////////////////////
	btnParent.onClick = function()
	{
		ctrlIndex = selectedIndex(lstCtrl);
		if (ctrlIndex<=0) return;
		parentIndex = selectedIndex(lstParent);
		if (parentIndex<0) return;
		
		var newKind = ctrlList[parentIndex].kind;
		if ( (newKind != parentNum[0])&&(newKind != parentNum[1])&&(newKind != parentNum[2]) )
		{
			alert(ctrlList[parentIndex].name +"は親に設定できません");
			return;
		}
		var orgParent = ctrlList[ctrlIndex].parentIndex;
		var orgKind = ctrlList[orgParent].kind;
		if ( parentIndex == orgParent) return;
		
		if ((newKind == parentNum[1])||(newKind == parentNum[2])){
			if ( orgKind == parentNum[0]){
				var b = ctrlList[ctrlIndex].ctrl.bounds;
				var bp = ctrlList[parentIndex].ctrl.bounds;
				ctrlList[ctrlIndex].left = b[0] - bp[0];
				ctrlList[ctrlIndex].top = b[1] - bp[1];
			}
		}else{
			if ((orgKind == parentNum[1])||(orgKind == parentNum[2])){
				var b = ctrlList[ctrlIndex].ctrl.bounds;
				var bp = ctrlList[orgParent].ctrl.bounds;
				ctrlList[ctrlIndex].left = b[0] + bp[0];
				ctrlList[ctrlIndex].top = b[1] + bp[1];
			}
		}
		ctrlList[ctrlIndex].parentIndex = parentIndex;
		rebuild();
		toListbox();
	}
	/////////////////////////////////////////////////////////////////////
	toolWin.onClose = function()
	{
		save(backupFile);
		closeAll();
	}
	/////////////////////////////////////////////////////////////////////
	if ( ( me instanceof Panel) == false){
		toolWin.center(); 
		toolWin.show();
	}
	load(backupFile);


	////////////////////////////////////////////

})(this);
