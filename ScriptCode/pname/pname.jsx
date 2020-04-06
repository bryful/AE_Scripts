(function(me){
	Property.prototype.getTree =
	PropertyBase.prototype.getTree = 
	PropertyGroup.prototype.getTree = function()
	{
		var ret = [];
		var a = this;
		do
		{
			ret.push(a.name);
			a = a.parentProperty;
		}while(a!=null);
		ret = ret.reverse();
		
		return ret;
	}

	Property.prototype.getTreeM =
	PropertyBase.prototype.getTreeM =
	PropertyGroup.prototype.getTreeM = function()
	{
		var ret = [];
		var a = this;
		do
		{
			ret.push(a.matchName);
			a = a.parentProperty;
		}while(a!=null);
		ret = ret.reverse();
		
		return ret;
	}

	Property.prototype.rootLayer =
	PropertyBase.prototype.rootLayer =
	PropertyGroup.prototype.rootLayer = function(){return this.propertyGroup(this.propertyDepth);}

	Property.prototype.findContent =
	PropertyBase.prototype.findContent =
	PropertyGroup.prototype.findContent = function(){
		var ret = null;
		var pp =this;
		do{
			if ((pp.matchName=="ADBE Root Vectors Group")||(pp.matchName=="ADBE Vector Group")){
				ret = pp;
				break;
			}
			pp = pp.parentProperty;
		}while(pp!=null);
			
		return ret;	
	}

	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	String.prototype.getParent = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
		return r;
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
		if(i>=0){return this.substring(0,i)+s;}else{return this; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var targetFolder = new Folder ( $.fileName.getParent() + "/(" +$.fileName.getName().changeExt("")+ ")");
		// ********************************************************************************
	/*
		アクティブなコンポジションを獲得
	*/
	// ********************************************************************************
	var getActiveComp = function()
	{
		var ret = null;
		ret = app.project.activeItem;
		
		if ( (ret instanceof CompItem)===false)
		{
			ret = null;
			alert("コンポをアクティブにしてください！");
		}
		return ret;
	}
	BRY.getActiveComp=getActiveComp;
	// ********************************************************************************
	// ********************************************************************************
	var getActiveLayer = function(cmp)
	{
		var ret = null;
		if ( (cmp ==null)||(cmp ==undefined)||( (cmp instanceof CompItem)==false)) {
			var ac = getActiveComp();
			if (ac == null) return ret;
			cmp = ac;
		}
		var lyrs = cmp.selectedLayers;
		if(lyrs.length<1){
			alert("レイヤを1個だけ選んでください");
			return ret;
		}
		ret = lyrs[0];
		return ret;
	}
	BRY.getActiveLayer=getActiveLayer;
	// ********************************************************************************
	var getPropertyBase = function(lyr)
	{
		var ret = null;
		if ( (lyr ==null)||(lyr ==undefined)||( (lyr instanceof AVLayer)==false)){
			var ac = getActiveComp();
			if (ac==null) return ret;
			var a = getActiveLayer(ac);
			if (a==null) return ret;
			lyr = a;
		}
		var props = lyr.selectedProperties;
		var pg = null;
		if(props.length<=0){
			pg = lyr.property("ADBE Root Vectors Group");
        }else{
			for ( var i=0; i<props.length; i++){
				if ( props[i] instanceof PropertyGroup){
					pg = props[i];
					break;
				}
			}
		}
		if(pg==null){
			alert("グループかコンテンツを選んでください");
		}else{
			ret = pg;
		}
		return ret;
	}
	BRY.getPropertyBase=getPropertyBase;

	// ********************************************************************************
	var getPropertyGroup = function(lyr)
	{
		var ret = null;
		if ( (lyr ==null)||(lyr ==undefined)||( (lyr instanceof AVLayer)==false)){
			var ac = getActiveComp();
			if (ac==null) return ret;
			var a = getActiveLayer(ac);
			if (a==null) return ret;
			lyr = a;
		}
		var props = lyr.selectedProperties;
		var pg = null;
		if((props==null)||(props.length<=0)){
			pg = lyr.property("ADBE Root Vectors Group");
        }else{
			for ( var i=0; i<props.length; i++){
				var a = props[i].findContent();
				if (a !=null){
					pg = a;
					break;
				}
			}
		}
		if(pg==null){
			alert("グループかコンテンツを選んでください");
		}else{
			ret = pg;
		}
		return ret;
	}
	BRY.getPropertyGroup = getPropertyGroup;
	// ********************************************************************************
	var getProperty = function(lyr)
	{
		var ret = null;
		if ( (lyr ==null)||(lyr ==undefined)||( (lyr instanceof AVLayer)==false)){
			var ac = getActiveComp();
			if (ac==null) return ret;
			var a = getActiveLayer(ac);
			if (a==null) return ret;
			lyr = a;
		}
		var props = lyr.selectedProperties;
		var pg = null;
		if((props==null)||(props.length<=0)){
			alert("プロパティを選んでください");
			return ret;
        }else{
			for ( var i=0; i<props.length; i++){
				if ( props[i] instanceof Property){
					pg = props[i];
					break;
				}
			}
		}
		if(pg==null){
			alert("グループかコンテンツを選んでください");
		}else{
			ret = pg;
		}
		return ret;
	}
	// ********************************************************************************
	var getP = function(p)
	{
		var ret = {};
		if (p instanceof PropertyGroup) {
			return getPG(p);
		}
		if ( (p instanceof Property) == false) return ret;
		try{
			ret.isProperty= true;
			ret.name = p.name;
			ret.matchName = p.matchName;
			ret.propertyIndex = p.propertyIndex;
			ret.expression = p.expression;
			ret.expressionEnabled = p.expressionEnabled;
		}catch(e){
			alert(e.toString());
		}
		return ret;
	}
	var getPG = function(pg)
	{
		var ret = {};
		try{
			if (pg instanceof Property) {
				return getP(pg);
			}
			if ((pg instanceof PropertyGroup)==false) return ret;
			ret.isProperty= false;
			ret.name = pg.name;
			ret.matchName = pg.matchName;
			ret.propertyIndex = pg.propertyIndex;
			ret.enabled = pg.enabled;
			ret.property = [];

			ret.numProperties = pg.numProperties;
			for (var i=1; i<=pg.numProperties;i++)
			{
				var p = pg.property(i);
				if (p instanceof PropertyGroup) {
					ret.property.push(getPG(p));
				}else{
					var pp = getP(p);
					ret.property.push(pp);
				}
			}
		}catch(e){
			alert(e.toString());
			return ret;
		}
		return ret;
	}
	var setPG = function(pg, obj)
	{
		if (pg.matchName != obj.matchName) return;
		if (obj.isProperty==true) {
			if (obj.expression!="")
			{
				try{
					pg.expression = obj.expression;
					pg.expressionEnabled = obj.expressionEnabled;
				}catch(e){

				}
				
			}
			return;
		}
		try{
			pg.name = obj.name;
		}catch(e){
		}
		if (obj.numProperties>0)
		{
			for ( var i=0; i<obj.numProperties; i++){
				var p = obj.property[i];
				setPG(pg.property(p.propertyIndex),p);
			}
		}
	}
	// ********************************************************************************
	/*
		ウィンドウの作成
	*/
	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0, 345,  360]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	var btnExport = winObj.add("button", [  5,   5,   5 +  40,   5 + 25 ] , "Export");
	var btnApply = winObj.add("button", [  5,  35,   5 +  40,  35 + 25 ] , "Apply");
	
	// ********************************************************************************
	btnExport.onClick = function()
	{
		var pg = getPropertyGroup();
		var obj = getPG(pg);
		var ff = File.saveDialog("Filename...","*.json");
		if (ff.open("w"))
		{
			ff.write(obj.toSource());
		}
		ff.close();

	}
	btnApply.onClick = function()
	{
		var pg = getPropertyGroup();
		if(pg==null) return;
		var ff = File.openDialog("Select","*.json");
		if (ff == null) return;
		var js ="";
		if (ff.open("r"))
		{
			js = ff.read();
		}
		ff.close();
		var obj = eval(js);
		setPG(pg,obj);

	}
	// ********************************************************************************
	/*
		画像アイコンボタンを再配置
	*/
	// ********************************************************************************
	var resizeWin = function()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		
		var b2 = btnExport.bounds;
		b2[0] = 5;
		b2[2] = b2[0] + w -10;
		btnExport.bounds = b2;

		var b3 = btnApply.bounds;
		b3[0] = 5;
		b3[2] = b3[0] + w -10;
		btnApply.bounds = b3;
	}
	resizeWin();
	winObj.onResize = resizeWin;
	// ********************************************************************************
	/*
		実行
	*/
	// ********************************************************************************
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);