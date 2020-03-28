(function(me){
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));

	var targetComp= null;
	var targetLayer= null;
	var refFlag = false; 
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "エクスプレッションの置換", [  22,   29,   22+ 240,   29+ 326]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	
	//----------------------------------
	var srcStr = "";
	var srcHis = ["\"スライダ\"","\"スライダー\"","\"グループ 1\"" ];
	var dstStr = "";
	var dstHis = ["\"ADBE Slider Control-0001\"","\"グループ 1\""];
	var expStr = "";
	//----------------------------------
	var stSrc = winObj.add("statictext", [   4,    8,    4+  57,    8+  12], "元の文字");
	stSrc.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edSrc = winObj.add("edittext", [   4,   24,    4+ 200,   24+  23], srcStr);
	edSrc.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 13);
	var cmbSrc = winObj.add("dropdownlist", [ 210,   24,  210+  24,   24+  21], srcHis);
	cmbSrc.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stDst = winObj.add("statictext", [   4,   56,    4+  71,   56+  13], "新しい文字");
	stDst.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edDst = winObj.add("edittext", [   4,   72,    4+ 200,   72+  23], dstStr);
	edDst.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 13);
	var cmbDst = winObj.add("dropdownlist", [ 210,   72,  210+  24,   72+  21], dstHis);
	cmbDst.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnExec = winObj.add("button", [ 130,  100,  130+ 100,  100+  24], "置換実行" );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnCode = winObj.add("button", [   4,  110,    4+  50,  110+  24], "getCode" );
	btnCode.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edExp = winObj.add("edittext", [   4,  140,    4+ 230,  140+ 180], expStr, { multiline:true, scrollable:true });
	edExp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	function savePref()
	{
		var p = new Object;

		p.src = edSrc.text.trim();
		p.dst = edDst.text.trim();
		p.exp = edExp.text;
		
		p.srcHis = [].concat(srcHis);
		p.dstHis = [].concat(dstHis);
		
		var str = p.toSource();
		if (prefFile.open("w")){
			try{
				prefFile.write(str);
				prefFile.close();
			}catch(e){
			}
		}
	}
	//-------------------------------------------------------------------------
	function loadPref()
	{
		if ( (prefFile ==null)||(prefFile.exists ==false)) return;
		var str ="";
		if (prefFile.open("r")){
			try{
				str = prefFile.read();
			}catch(e){
				return;
			}finally{
				prefFile.close();
			}
		}
		if ( str == "") return;
		var p = eval(str);
		edSrc.text = p.src;
		edDst.text = p.dst;
		edExp.text = p.exp;
		
		srcHis = [].concat(p.srcHis);
		dstHis = [].concat(p.dstHis);
		refFlag = true;
		cmbSrc.removeAll();
		if ( srcHis.length>0){
			for ( var i=0; i<srcHis.length; i++){
				cmbSrc.add("item",srcHis[i]);
			}
		}
		refFlag = false;
		refFlag = true;
		cmbDst.removeAll();
		if ( dstHis.length>0){
			for ( var i=0; i<dstHis.length; i++){
				cmbDst.add("item",dstHis[i]);
			}
		}
		refFlag = false;
		
	}
	loadPref();
	//-------------------------------------------------------------------------
	function addHis()
	{
		var t = edSrc.text.trim();
		if ( t!=""){
			var a = false;
			if ( srcHis.length<=0) {
				srcHis.push(t);
				a = true;
			}else{
				var b = true;
				for ( var i=0; i<srcHis.length; i++){
					if ( srcHis[i] == t) {
						b = false;
						break;
					}
				}
				if ( b==true) {
					srcHis.push(t);
					a = true;
				}
			}
			if ( a == true){
				if ( srcHis.length>20) srcHis.shift();
				refFlag = true;
				cmbSrc.removeAll();
				for ( var i=0; i<srcHis.length; i++){
					cmbSrc.add("item",srcHis[i]);
				}
				refFlag = false;
			}
		}
		var t = edDst.text.trim();
		if ( t!=""){
			var a = false;
			if ( dstHis.length<=0) {
				dstHis.push(t);
				a = true;
			}else{
				var b = true;
				for ( var i=0; i<dstHis.length; i++){
					if ( dstHis[i] == t) {
						b = false;
						break;
					}
				}
				if ( b==true) {
					dstHis.push(t);
					a = true;
				}
			}
			if ( a == true){
				if ( dstHis.length>20) dstHis.shift();
				refFlag = true;
				cmbDst.removeAll();
				for ( var i=0; i<dstHis.length; i++){
					cmbDst.add("item",dstHis[i]);
				}
				refFlag = false;
			}
		}
		
	}
	//-------------------------------------------------------------------------
	function getProperty()
	{
		targetComp= null;
		targetLayer= null;
		var ret = null;
		if ( ( app.project.activeItem instanceof CompItem) == false) {
			alert("Compをアクティブにして下さい！");
			return ret;
		}
		if ( app.project.activeItem.selectedLayers.length != 1){
			alert("レイヤは1個だけ選択してください。");
			return ret;
		}
		var ps = app.project.activeItem.selectedLayers[0].selectedProperties;
		if ( ps.length<=0) {
			alert("プロパティを選択してください。");
			return ret;
		}
		for ( var i=0; i<ps.length; i++){
			if ( ps[i] instanceof Property){
				ret = ps[i];
				break;
			}
		}
		if ( ret != null){
			targetComp= app.project.activeItem;
			targetLayer= app.project.activeItem.selectedLayers[0];
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function getProperties()
	{
		var ret = [];
		function getPro(p)
		{
			if ( p instanceof Property){
				if ( p.expression != "") {
					ret.push(p);
				}
			}else if (p instanceof PropertyGroup){
				if ( p.numProperties>0){
					for ( var k=1; k<=p.numProperties; k++){
						getPro(p.property(k));
					}
				}
			}
		}
		targetComp= null;
		targetLayer= null;
		if ( ( app.project.activeItem instanceof CompItem) == false) {
			alert("Compをアクティブにして下さい！");
			return ret;
		}
		if ( app.project.activeItem.selectedLayers.length != 1){
			alert("レイヤは1個だけ選択してください。");
			return ret;
		}
		var ps = app.project.activeItem.selectedProperties;
		if (ps.length>0){
			for ( var i=0; i<ps.length; i++){
				getPro(ps[i]);
			}
		}
		if (ret.length<=0){
			alert("プロパティを選択してください");
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function pushSelection()
	{
		var ret = [];
		var ps = targetLayer.selectedProperties;
		if ( ps.length>0){
			for ( var i=0; i<ps.length; i++) ret.push(ps[i]);
			for ( var i=ret.length-1; i>=0; i--) ret[i].selected = false;
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	function popSelection(ary)
	{
		if ( ary.length>0){
			for ( var i=0; i<ary.length; i++) ary[i].selected = true;
		}
	}
	//-------------------------------------------------------------------------
	function getCode()
	{
		var p = getProperty();
		if (p == null) return;
		if ( p.canSetExpression == false){
			edExp.text = "// !エクスプレッションは無効です。" + "\r\n" + edExp.text;
			return;
		}
		app.beginUndoGroup(scriptName);
		if ( p.expression != ""){
			edExp.text = p.expression;
		}else{
			var bak = pushSelection();
			p.selected = true;
			app.executeCommand(2702);
			edExp.text = p.expression;
			app.executeCommand(2702);
			p.selected = false;
			popSelection(bak);
			p.expression = "";
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	function exec()
	{
		var src = edSrc.text.trim();
		var dst = edDst.text.trim();
		if (src == "") {
			alert("元の文字がありません");
			return;
		}
		addHis();
		var p = getProperties();
		if (p.length <= 0) {
			return;
		}
		var mes = "";
		var cnt = 0;
		app.beginUndoGroup(scriptName);
		for ( var i=0; i<p.length; i++){
			var ex = p[i].expression;
			//意図して無効にしているか？
			var en = !((p[i].expressionError == "")&&(p[i].expressionEnabled == false)) ;
			var ex2 = ex.split(src).join(dst);
			if ( ex != ex2) {
				p[i].expression = ex2;
				cnt++;
				mes += "  " + p[i].parentProperty.name + "/" +p[i].name +"\r\n";
				p[i].expressionEnabled = en;
			}
		}
		if ( cnt<=0){
			alert("置換対象がありません。");
		}else{
			mes = "! " + cnt + "ヶ所置換しました\r\n" +mes;
			alert(mes);
		}
		app.endUndoGroup();
		savePref();
	}
	//-------------------------------------------------------------------------
	var b = winObj.bounds; // 何故かこの行がないとBoundsのprototypeにアクセスできない
	Bounds.prototype.getWidth = function(){return this[2] - this[0];}
	Bounds.prototype.setWidth = function(v){this[2] = this[0] + v;}
	Bounds.prototype.getHeight = function(){return this[3] - this[1];}
	Bounds.prototype.setHeight = function(v){this[3] = this[1] + v;}
	Bounds.prototype.setLoc = function(loc){
		var w = this.getWidth();
		var h = this.getHeight();
		this[0] = loc[0];
		this[1] = loc[1];
		this[2] = loc[0] + w;
		this[3] = loc[1] + h;
	}
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b.getWidth();
		if ( w <180) w = 180;
		var h = b.getHeight();
		if ( h <180) h = 180;
		//winObj.text = w.toString() + "," + h.toString();
		
		b = edSrc.bounds;
		b.setWidth( w - 40);
		edSrc.bounds = b;
		
		b = cmbSrc.bounds;
		b.setLoc( [w-30, b[1]]);
		cmbSrc.bounds = b;
		
		b = edDst.bounds;
		b.setWidth( w - 40);
		edDst.bounds = b;
		
		b = cmbDst.bounds;
		b.setLoc( [w-30, b[1]]);
		cmbDst.bounds = b;

		b = btnExec.bounds;
		b.setLoc( [w-120, b[1]]);
		btnExec.bounds = b;

		b = edExp.bounds;
		b.setWidth(w - 8);
		b.setHeight(h - 146);
		edExp.bounds = b;
		
	}
	resize();
	//-------------------------------------------------------------------------
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;


	btnCode.onClick = getCode;
	btnExec.onClick = exec;
	
	cmbSrc.onChange = function()
	{
		if ( refFlag == true) return;
		refFlag = true;
		edSrc.text = cmbSrc.selection;
		if ( cmbSrc.items.length>0)
			for ( var i=0; i<cmbSrc.items.length; i++)
				cmbSrc.items[i].selected = false;
		refFlag = false;
	}
	cmbDst.onChange = function()
	{
		if ( refFlag == true) return;
		refFlag = true;
		edDst.text = cmbDst.selection;
		if ( cmbDst.items.length>0)
			for ( var i=0; i<cmbDst.items.length; i++)
				cmbDst.items[i].selected = false;
		refFlag = false;
	}
	winObj.onClose = function() { savePref();}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);
