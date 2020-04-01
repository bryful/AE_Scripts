
(function(me){

	//獲得したテンプレート
	var rsTmp = [];
	var omTmp = [];

	//各種初期値	
	var prefName = "/renderBS7.pref";
	var rqDef = "最良設定_23.976fps";
	var omOffDef = "Qt-avidコーデック(BS7_オフライン)";
	var omOnDef = "Qt-avidコーデック(BS7_オンライン)";
	var dialogPathDef = "//2008-SV03/BS_seisaku/BS7_編集行きデータ";

	var outFps = 23.976;

	//環境設定パラメータ
	var pref = {};
	pref.width = 1280;
	pref.rs = rqDef;
	pref.omOff = omOffDef;
	pref.omOn = omOnDef;
	pref.dialogDef = dialogPathDef;
	pref.offEnabled = true;
	pref.onEnabled = true;
	pref.pathOff = "";
	pref.pathOn = "";
	pref.isReset = true;

	FootageItem.prototype.initInfo = function()
	{
		//---------------------------------------------------------
		function lastNumber(s)
		{
			var r = new Object;
			r.node = ""
			r.frame = "";
			r.start = "";
			r.last = "";
			r.idx = -1;
			if ( s == "") return r;
			var cnt = s.length -1;
			if ( s[cnt] =="]"){
				r.idx = s.lastIndexOf("[");
			}else if ( s[cnt] =="}"){
				r.idx = s.lastIndexOf("{");
			}else{
				r.idx = -1;
			}
			var kFlg = true;
			if ( r.idx<0) {
				kFlg = false;
				r.idx = 0;
				for ( var i=cnt; i>=0;i--){
					var c = s[i];
					if ( (c<"0")||(c>"9") ) {
						r.idx = i+1;
						break;
					}
				}
				if ( r.idx == s.length){
					r.idx = -1;
				}
				
				if ( r.idx == s.length-1){
					if ( s.length>1){
						var c = s[s.length-2].toLowerCase();
						if ( (c=="t")||(c=="a")||(c=="v") ){
							r.idx = -1;
						}
					}
				}
			}
			
			if ( r.idx<0) {
				r.node = s;
			}else if (r.idx==0){
				r.frame = s;
			}else{
				r.frame = s.substring(r.idx);
				r.node = s.substring(0,r.idx);
			}
			if ( r.frame!=""){
				if ( kFlg==true){
					var ss = r.frame.substr(1,r.frame.length-2);
					var sa = ss.split("-");
					r.start = sa[0];
					r.last = sa[1];
				}
			}
			return r;
		}
		//---------------------------------------------------------
		this.node = "";
		this.frameSepa = "";
		this.frame = "";
		this.startFrame = "";
		this.lastFrame = "";
		this.ext = "";
		this.isMovie = false;
		this.isSequence = false;
		this.isSolid = false;
		this.isStill = false;
	
		
	
		//動画の種類を調べる
		if (this.mainSource.color == undefined){
			if (this.hasVideo == true){
				if ( this.mainSource.isStill == false){
					var cf = this.mainSource.conformFrameRate;
					this.mainSource.conformFrameRate = 0;
					if ( this.mainSource.conformFrameRate == 0){
						this.isMovie = true;
					}else{
						this.isSequence = true;
					}
				}else{
					this.isStill = true;
				}
			}
		}else{
			this.isSolid = true;
		}
		var nm = this.name;
		//拡張子
		var idx = nm.lastIndexOf(".");
		if ( idx>=0) {
			this.ext = nm.substr(idx);
			nm = nm.substr(0,idx);
		}
		//フレーム番号
		var r = lastNumber(nm);
		this.node = r.node;
		this.frame = r.frame;
		this.startFrame = r.start;
		this.lastFrame = r.last;
		
		if ( this.node !="" ){
			var c = this.node[this.node.length-1];
			if ( (c=="-")||(c=="_")||(c==" ")) {
				this.frameSepa = c;
				this.node = this.node.substring(0,this.node.length-1);
			}
		}
		return this;
	}
	FootageItem.prototype.initInfoStr = function(){
		var ret = "";
		ret += "node = " + this.node + "\n";
		ret += "frameSepa = " + this.frameSepa  + "\n";
		ret += "frame = " + this.frame + "\n";
		ret += "startFrame = " + this.startFrame + "\n";
		ret += "lastFrame = " + this.lastFrame + "\n";
		ret += "ext = " + this.ext + "\n";
		ret += "isMovie = " + this.isMovie + "\n";
		ret += "isSequence = " + this.isSequence + "\n";
		ret += "isSolid = " + this.isSolid + "\n";
		ret += "isStill = " + this.isStill + "\n";
		return ret;
	}
	//*********************************************************************
	//-------------------------------------------------------------------------
	var prefSave = function()
	{
		var f = new File(Folder.userData.fullName + prefName);
		if (f.open("w")){
			f.write(pref.toSource());
			f.close();
		}	
	}
	//-------------------------------------------------------------------------
	var prefLoad = function()
	{
		var f = new File(Folder.userData.fullName + prefName);
		if (!f.exists) return;
		var str ="";
		if (f.open("r")){
			try{
				str = f.read();
			}catch(e){
				return;
			}finally{
				f.close();
			}
		}
		if ( str == "") return;
		var p = eval(str);
		if (p.width != undefined) pref.width = p.width;
		if (p.rqOn != undefined) pref.rqOn = p.rqOn;
		if (p.rqOff != undefined) pref.rqOff = p.rqOff;
		if (p.omOff != undefined) pref.omOff = p.omOff;
		if (p.omOn != undefined) pref.omOn = p.omOn;
		if (p.dialogDef != undefined) pref.dialogDef = p.dialogDef;
		if (p.offEnabled != undefined) pref.offEnabled = p.offEnabled;
		if (p.onEnabled != undefined) pref.onEnabled = p.onEnabled;
		if (p.pathOff != undefined) pref.pathOff = p.pathOff;
		if (p.pathOn != undefined) pref.pathOn = p.pathOn;
		if (p.isReset != undefined) pref.isReset = p.isReset;
		
	}
	//-------------------------------------------------------------------------
	var makeCompSub = function(ftg,pf)
	{
		if ( ftg.node == undefined) ftg.initInfo();
		var ext = ftg.ext.toLowerCase();
		if ( ext !==".mov") {
			alert(ftg.name +"は、Movファイルじゃない！");
		}

		ftg.mainSource.conformFrameRate = outFps;

		var dstComp = pf.items.addComp(
					ftg.node,
					pref.width,
					Math.floor(pref.width * 9 / 16),
					ftg.pixelAspect,
					ftg.duration,
					outFps);
		dstComp.frameRate = outFps;
		dstComp.duration = ftg.duration;
		dstComp.selected = true;
		
		var mainLayer = dstComp.layers.add(ftg);
		var s = 100 * pref.width / ftg.width;
		mainLayer.property("Scale").setValue([s,s]);

	}
	//-------------------------------------------------------------------------
	var makeComp = function()
	{
		var sel = [];
		var osel = app.project.selection;
		if (osel.length>0) {
			for (var i = 0; i<osel.length; i++) {
				if ( osel[i] instanceof FootageItem) {
					var ftg = osel[i];
					if (ftg.mainSource.color  == undefined) {
						sel.push(ftg);
					}
				}
			}
		}
		if (sel.length<=0) {
			alert("有効なフッテージを選択してください！");
			return;
		}
		app.beginUndoGroup("編集行きレンダリング:Comp");
		for ( var i = 0; i<osel.length; i++) osel[i].selected = false;
		var pf = sel[0].parentFolder.items.addFolder("RenderComps");

		for (var i=0; i<sel.length; i++) {
			makeCompSub(sel[i],pf);
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------------------
	var addOM = function(rq)
	{
		
	}
	//-------------------------------------------------------------------------
	var addRQ = function()
	{
		if ( (pref.onEnabled==false)&&(pref.offEnabled==false)){
			alert("ON_OFFどちらも選ばれていません！");
			return;
		}
		
		var offFld = new Folder(pref.pathOff);
		var onFld = new Folder(pref.pathOn);
		
		if (pref.offEnabled==true){
			if (!offFld.exists) {
				alert("オフライン書き出し先フォルダがありません！");
				return;
			}
			if (pref.rqOff=="") {
				alert("オフライン　レンダリング設定テンプレートが指定されていません！");
				return;
			}
			if (pref.omOff=="") {
				alert("オフライン　出力モジュールテンプレートが指定されていません！");
				return;
			}
		}
		if (pref.onEnabled==true){
			if (!onFld.exists) {
				alert("オンライン書き出し先フォルダがありません！");
				return;
			}
			if (pref.rqOn=="") {
				alert("オンライン　レンダリング設定テンプレートが指定されていません！");
				return;
			}
			if (pref.omOn=="") {
				alert("オンライン　出力モジュールテンプレートが指定されていません！");
				return;
			}
		}
		
		
		var sel = [];
		var osel = app.project.selection;
		if (osel.length>0) {
			for (var i = 0; i<osel.length; i++) {
				if ( osel[i] instanceof CompItem) {
					sel.push(osel[i]);
				}
			}
		}
		if (sel.length<=0) {
			alert("有効なコンポを選択してください！");
			return;
		}
		if (pref.isReset==true) {
			if (app.project.renderQueue.numItems>0){
				for (var i=app.project.renderQueue.numItems; i>=1; i--) {
					app.project.renderQueue.items[i].remove();
				}
			}
		}
		
		for (var i=0; i<sel.length; i++){
			var rq = app.project.renderQueue.items.add(sel[i]);
			rq.applyTemplate(pref.rs);
			var idx = 1;
			if (pref.offEnabled==true) {
				rq.outputModules[idx].applyTemplate(pref.omOff);
				rq.outputModules[idx].file = new File(pref.pathOff + "/" + sel[i].name);
				idx++;
			}
			if (pref.onEnabled==true) {
				if (idx==2) {
					rq.outputModules.add();
				}
				rq.outputModules[idx].applyTemplate(pref.omOn);
				rq.outputModules[idx].file = new File(pref.pathOn + "/" + sel[i].name);
				
			}
			
		}
	}
	//-------------------------------------------------------------------------
	//UIを作成する前に環境せってパラメータを獲得
	prefLoad();
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "編集入れレンダリング", [ 740,  318,  740+ 423,  318+ 497] );
	//-------------------------------------------------------------------------
	var pnlMkComp = winObj.add("panel", [  12,   12,   12+ 397,   12+  94], "Compo" );
	var btnMkComp = pnlMkComp.add("button", [  25,   12,   25+ 357,   12+  36], "コンポ作成" );
	var rb1280 = pnlMkComp.add("radiobutton", [  26,   55,   26+ 104,   55+  24], "1280x720");
	var rb1440 = pnlMkComp.add("radiobutton", [ 125,   54,  125+ 104,   54+  24], "1980x1080");
	var btnGetTemplate = winObj.add("button", [  37,  112,   37+ 158,  112+  23], "テンプレートを読み込む" );
	rb1280.value = (pref.width==1280);
	rb1440.value = (pref.width==1920);
	var cmbRS = winObj.add("dropdownlist", [  36,  141,   36+ 357,  141+  21], [ ]);

	var pnlOff = winObj.add("panel", [  12,  180,   12+ 397,  180+ 114], "オフライン OFF" );
	var cbOFF = pnlOff.add("checkbox", [  24,   13,   24+ 128,   13+  24], "OFF LINEを書き出す");
	cbOFF.value = pref.offEnabled;
	var btnGet_OFF = pnlOff.add("button", [ 158,   13,  158+  92,   13+  23], "設定" );
	var edPath_OFF = pnlOff.add("edittext", [  24,   44,   24+ 358,   44+  21], "");
	edPath_OFF.text = pref.pathOff;
	var cmbOM_OFF = pnlOff.add("dropdownlist", [  25,   71,   25+ 357,   71+  21], [ ]);

	
	var pnlOn = winObj.add("panel", [  13,  300,   13+ 397,  300+ 112], "オンライン ON" );
	var cbON = pnlOn.add("checkbox", [  24,   12,   24+ 128,   12+  24], "ON LINEを書き出す");
	cbON.value = pref.onEnabled;
	var btnGet_ON = pnlOn.add("button", [ 158,   12,  158+  92,   12+  23], "設定" );
	var edPath_ON = pnlOn.add("edittext", [  24,   43,   24+ 358,   43+  21], "");
	edPath_ON.text = pref.pathOn;
	var cmbOM_ON = pnlOn.add("dropdownlist", [  25,   70,   25+ 357,   70+  21], [ ]);
	var btnAddRQ = winObj.add("button", [  38,  418,   38+ 358,  418+  41], "レンダーキューへ登録" );
	var cbIsReset = winObj.add("checkbox", [  38,  465,   38+ 203,  465+  24], "登録時レンダーキューをリセットする");
	cbIsReset.value = pref.isReset;
	


	//-------------------------------------------------------------------------
	var getFolerDialog = function(ed)
	{
		var f = Folder.selectDialog("書き出しフォルダ",pref.dialogDef);
		if ( f != null)
		{
			pref.dialogDef = 
			ed.text = File.decode(f.fullName);
		}		
	}
	//-------------------------------------------------------------------------
	var getTemplateSub = function()
	{
		var _ps = [];
		var _om = [];
		if ( app.project.renderQueue.numItems<=0){
			var tempComp = app.project.items.addComp("_temp_",100,100,1,1,24);
			var rq = app.project.renderQueue.items.add(tempComp);
			_ps = rq.templates;
			_om = rq.outputModules[1].templates;
			tempComp.remove();
		}else{
			var rq = app.project.renderQueue.item(1);
			_ps = rq.templates;
			_om = rq.outputModules[1].templates;
		}
		rsTmp = [];
		omTmp = [];


		for ( var i=0; i<_ps.length; i++)
			if ( _ps[i].indexOf("_HIDDEN")<0) rsTmp.push(_ps[i]);
		for ( var i=0; i<_om.length; i++)
			if ( _om[i].indexOf("_HIDDEN")<0) omTmp.push(_om[i]);
			
	}
	//-------------------------------------------------------------------------
	var getTemplate = function()
	{
		var setComb = function(cmb, lst)
		{
			var n = "";
			if (cmb.selection !== null) {
				n = cmb.items[cmb.selection.index].text;
			}
			if (cmb.items.length>0) cmb.removeAll();
			
			if (lst.length>0) {
				for (var i=0; i<lst.length; i++){
					cmb.add("item",lst[i]);
					if (n!==""){
						if ( lst[i] ===n) cmb.items[i].selected = true;
					}
				}
			}
			
		}
		var setCombDef = function(cmb,s)
		{
			if (cmb.items.length<=0) return;
			for (var i=0; i<cmb.items.length; i++){
				if (cmb.items[i].text == s) {
					cmb.items[i].selected = true;
					break;
				}
			}
		}
		setComb( cmbRS, rsTmp);
		
		setComb( cmbOM_OFF, omTmp);
		setComb( cmbOM_ON, omTmp);
		
		if (cmbRS.selection == null) 
			setCombDef(cmbRS,pref.rs);
		
		if (cmbOM_OFF.selection == null) 
			setCombDef(cmbOM_OFF,pref.omOff);
		if (cmbOM_ON.selection == null) 
			setCombDef(cmbOM_ON,pref.omOn);
	}
	//-------------------------------------------------------------------------
	rb1280.onClick = function() { 
		if (this.value==true) {
			pref.width = 1280;
		}else{
			pref.width = 1440;
		}
	}
	rb1440.onClick = function() {
		if (this.value==true) {
			pref.width = 1440;
		}else{
			pref.width = 1280;
		}
	 }

	btnGetTemplate.onClick = function()
	{
		getTemplateSub();
		getTemplate();
	}
	
	btnGet_OFF.onClick = function()
	{
		getFolerDialog(edPath_OFF);
		pref.pathOff = edPath_OFF.text;
	}
	btnGet_ON.onClick = function()
	{
		getFolerDialog(edPath_ON);
		pref.pathOn = edPath_ON.text;
	}
	cbOFF.onClick = function()
	{
		pref.offEnabled = this.value;
	}
	cbON.onClick = function()
	{
		pref.onEnabled = this.value;
	}
	cbIsReset.onClick = function()
	{
		pref.isReset = this.value;
	}
	cmbRS.onChange = function()
	{
		pref.rs = this.selection.text;
	}
	cmbOM_OFF.onChange = function()
	{
		pref.omOff = this.selection.text;
	}
	cmbOM_ON.onChange = function()
	{
		pref.omOn = this.selection.text;
	}
	edPath_OFF.onChange = function()
	{
		pref.pathOff = this.text;
	}
	edPath_ON.onChange = function()
	{
		pref.pathOn = this.text;
	}
	btnMkComp.onClick = makeComp;
	btnAddRQ.onClick = addRQ;
	winObj.onClose = prefSave;
	//-------------------------------------------------------------------------
	//初期値
	getTemplateSub();
	getTemplate();
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);