﻿/*
プロパティーをExpressionでリンクさせると通常、絶対パスで指定されますが、
thisProperty.popertYGroup(*)を使って相対パス指定をさせたい時があります。

これは、Expressionで相対パス指定を作成するスクリプトです。



*/

(function(me){
	//UIの配列
	var cntrlTbl = [];
	//ターゲット
	var targetPath = [];
	var basePath = [];
	// ********************************************************************************
	//prototype登録
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
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));	var aeclipPath = File.decode($.fileName.getParent()+"/aeclip.exe");
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
	// ********************************************************************************
	var createShapeLayer = function()
	{
		var ret = false;
		
		var ac = getActiveComp();
		if (ac==null) return ret;

		var  lyr = null;
		
		if (ac.selectedLayers.length>0)
		{
			lyr = ac.selectedLayers[0];
		}

		
		app.beginUndoGroup("createShapeLayer");
		var sl = ac.layers.addShape();
		if (sl === null ){
			alert("errer!");
			return ret;
		}
		if (lyr !== null)
		{
			sl.moveBefore(lyr);
		}
		app.endUndoGroup();
	}

		// ********************************************************************************
	/*
	*/
	// ********************************************************************************
	var expressionOn = function()
	{
		var p = getProperty();
		if (p==null) return;
		
		if (p.canSetExpression==true){
			if (p.expression =="")
			{
				p.expression = "value";
			}
		}
	}
	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "ShapeExpression", [ 0,  0,  500,  480]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	// ********************************************************************************
	var ctrl_xx = 15;
	var ctrl_yy = 15;
	var btnCreateShape = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+ 25], "create ShapeLayer" );
	ctrl_yy += 35;
	var btnExpressin = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+ 25], "Expression value" );
	ctrl_yy += 35;
	var stCaption = winObj.add("statictext",     [ctrl_xx, ctrl_yy, ctrl_xx + 519,   ctrl_yy +  25], "Expressionを相対パスで指定するスクリプト");
	ctrl_yy += 30;
	var btnGetTargetProperty = winObj.add("button", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+25], "get TargetProperty" );
	ctrl_yy += 25;
	var edTargetPropery = winObj.add("edittext", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+50], "", { readonly:true, multiline:true, scrollable:true });
	ctrl_yy += 60;
	var btnGetBaseProperty = winObj.add("button", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+25], "get BaseProperty" );
	ctrl_yy += 25;
	var edBaseProperty = winObj.add("edittext", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+50], "", { readonly:true, multiline:true, scrollable:true });
	ctrl_yy += 60;
	var btnCreateRelative = winObj.add("button", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+25], "create Relative Path" );
	
	ctrl_yy += 25;
	var edRelative = winObj.add("edittext", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+50], "", { readonly:true, multiline:true, scrollable:true });
	ctrl_yy += 60;
	var btnCopy = winObj.add("button", [ctrl_xx ,ctrl_yy,ctrl_xx + 470 ,ctrl_yy+25], "copy" );
	ctrl_yy += 30;

	// ********************************************************************************


	// ********************************************************************************
	cntrlTbl.push(btnCreateShape);
	cntrlTbl.push(btnExpressin);
	
	cntrlTbl.push(btnGetTargetProperty);
	cntrlTbl.push(edTargetPropery);

	cntrlTbl.push(btnGetBaseProperty);
	cntrlTbl.push(edBaseProperty);

	cntrlTbl.push(btnCreateRelative);
	cntrlTbl.push(edRelative);
	cntrlTbl.push(btnCopy);

	
	// ********************************************************************************
	var getPropertyPath = function(prop)
	{
		var ary = [];
		// ************************************
		var pstr = function(pr)
		{
			var ret = true;
			if (pr instanceof Property){ //
				ary.unshift("(" + pr.propertyIndex + ")");
			}else if ((pr instanceof AVLayer)||(pr instanceof Layer)||(pr instanceof CameraLayer)
			||(pr instanceof ShapeLayer)||(pr instanceof TextLayer)||(pr instanceof LightLayer)){
				var cmp = pr.containingComp;
				ary.unshift(".layer(\"" + pr.name + "\")");
				ary.unshift("comp(\"" + cmp.name+ "\")");
				ret = false;
			}else if ( (pr instanceof PropertyBase)||(pr instanceof PropertyGroup)){
			 if ( 
			 	(pr.propertyType ===  PropertyType.INDEXED_GROUP) //"
				||(pr.matchName === "ADBE Transform Group")
				||(pr.matchName === "ADBE Effect Parade") 
				||(pr.matchName === "ADBE Camera Options Group") 
				||(pr.matchName === "ADBE Light Options Group") 
				||(pr.matchName === "ADBE Mask Parade")
				||(pr.matchName === "ADBE Material Options Group")
				||(pr.matchName === "ADBE Root Vectors Group")
				||(pr.matchName === "ADBE Vector Transform Group")
				||(pr.matchName === "ADBE Vector Repeater Transform")
				||(pr.matchName === "ADBE Vector Wiggler Transform")
			){
					ary.unshift("(" + pr.propertyIndex + ")");
				}else {
					ary.unshift("(\"" + pr.name + "\")");
				}
			}
			return ret;
		}
		// ************************************
		var flg = true;
		var p = prop;
		str = "";
		do {
			flg = pstr(p);
			if (flg === true)
			{
				p = p.parentProperty;
				if (p == null) { flg = false; }
			}
		 } while( flg );
		
		return ary;
	}
	// ********************************************************************************
	var getProperty = function()
	{
		var ret = null;
		var ac = getActiveComp();
		if (ac==null) return ret;
		
		var sel = ac.selectedProperties;
		var selc = sel.length;
		if (selc>0)
		{
			for ( var i = selc-1; i>=0; i--)
			{
				if ( (sel[i] instanceof Property) === false) {
					sel.splice(i,1);
				}
 			}
		}
		selc = sel.length;
		if (selc!==1) {
		
			alert("プロパティを1個だけ選んでください");
			return ret;
		}
		ret = sel[0];
		
		return ret;
	}
	// ********************************************************************************
	var getTargetPath = function()
	{
		targetPath = [];
		var p = getProperty();
		if (p==null) return ret;
		
		targetPath = getPropertyPath(p);
		
		edTargetPropery.text = targetPath.join("");
	}
// ********************************************************************************
	var getBasePath = function()
	{
		basePath = [];
		var p = getProperty();
		if (p==null) return ret;
		
		basePath = getPropertyPath(p);
		edBaseProperty.text = basePath.join("");
	}

	// ********************************************************************************
	var createRelative = function()
	{
		if ( (targetPath==null)||(targetPath.length<=0)||(basePath==null)||(basePath.length<=0))
		{
			alert("選択してください");
			return;
		}
		
		var cnt = targetPath.length;
		if (cnt>basePath.length) cnt = basePath.length;
		
		var c = 0;
		for (var i=0; i<cnt; i++)
		{
			if (targetPath[i] !== basePath[i]) {
				break;
			}else{
				c++;
			}
		}
		var rel = [];
		
		if ( (c==targetPath.length)&&(c==basePath.length))
		{
			rel.push("value");
		}else if (c <=0) {
			rel = targetPath;
		}else if (c<=2) {
			rel.push("thisComp");
			for ( var i=1; i<=targetPath; i++)
			{
				rel.push(targetPath[i]);
			}
		}else{
			rel.push("thisProperty");
			rel.push(".propertyGroup(" + (basePath.length - c ) + ")");
			for ( var i=c; i<targetPath.length; i++)
			{
				rel.push(targetPath[i]);
			}
		}
		
		edRelative.text = rel.join("");
		
	}
	// ********************************************************************************
	btnCreateShape.onClick = createShapeLayer;
	btnExpressin.onClick = expressionOn;
	btnGetTargetProperty.onClick = getTargetPath;
	btnGetBaseProperty.onClick = getBasePath;
	btnCreateRelative.onClick = createRelative;
	
	// ********************************************************************************
	var resizeWin = function()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		var cnt = cntrlTbl.length;
		for ( var i=0; i<cnt; i++)
		{
			var c = cntrlTbl[i];
			var bs = c.bounds;
			bs[0] = ctrl_xx;
			bs[2] = bs[0] + w - ctrl_xx*2;
			c.bounds = bs;
		}
	}
	resizeWin();
	winObj.onResize = resizeWin;
	//-------------------------------------------------------------------------
	var toClipbord = function(str)
	{
		var ob = Folder.temp.fullName;
		var pa =  ob + "/tmp.txt";
		var ff = new File(pa);
		ff.encoding = "utf-8";
		if (ff.open("w")){
			try{
				ff.write(str);
			}finally{
				ff.close();
			}
		}		var fclip = new File(aeclipPath);		var cmd =  "\"" + fclip.fsName +"\"" + " /c \"" + ff.fsName + "\"";
		if (ff.exists==true){
			try{
				var er = system.callSystem(cmd);
			}catch(e){
				alert("ca" + e.toString());
			}
		}

	}
	//-------------------------------------------------------------------------
	btnCopy.onClick = function()
	{
		toClipbord(edRelative.text);
	}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);