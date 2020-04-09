/*
プロパティーをExpressionでリンクさせると通常、絶対パスで指定されますが、
thisProperty.popertYGroup(*)を使って相対パス指定をさせたい時があります。

これは、Expressionで相対パス指定を作成するスクリプトです。

#includepath "./;../"
#include "bryScriptLib.jsxinc"


*/

(function(me){
	//UIの配列
	var cntrlTbl = [];
	//ターゲット
	var targetPath = [];
	var basePath = [];

	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var aeclipPath = File.decode($.fileName.getParent()+"/aeclip.exe");

	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "ShapeExpression", [ 0,  0,  490,  480]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	// ********************************************************************************
	var ctrl_xx = 10;
	var ctrl_yy = 10;
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
	var stRelative = winObj.add("statictext", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+25], "Result - Relative Path" );
	ctrl_yy += 25;
	var edRelative = winObj.add("edittext", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+50], "", { readonly:true, multiline:true, scrollable:true });
	ctrl_yy += 60;
	var btnToExp = winObj.add("button", [ctrl_xx ,ctrl_yy,ctrl_xx + 470 ,ctrl_yy+25], "to Expression" );
	ctrl_yy += 30;

	// ********************************************************************************


	// ********************************************************************************
	cntrlTbl.push(btnGetTargetProperty);
	cntrlTbl.push(edTargetPropery);

	cntrlTbl.push(btnGetBaseProperty);
	cntrlTbl.push(edBaseProperty);

	cntrlTbl.push(stRelative);
	cntrlTbl.push(edRelative);
	cntrlTbl.push(btnToExp);

	
		var isFx  = false;
	// ********************************************************************************
	var getPropertyPath = function(prop)
	{
		var ary = [];
		isFx  = false;
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
				if (pr.matchName === "ADBE Effect Parade") {
					ary.unshift(".effect");
					isFx  = true;

				}else if (pr.matchName === "ADBE Transform Group") {
					ary.unshift(".transform");
					return ret;
				} else if ( 
					(pr.propertyType ===  PropertyType.INDEXED_GROUP) 
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
		var ac = BRY.getActiveComp();
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
	var targetCaption = "";
	// ********************************************************************************
	var getCaption = function(p)
	{
		var ret = "";
		var p2 = p;
		if (p2==null) return ret;
		if (p2 instanceof Property){
			ret = p2.name;
			p2 = p2.parentProperty;
			if (p2.matchName =="ADBE Vectors Group"){
				p2 = p2.parentProperty;
			}
			if(p2!=null){
				ret = p2.name +":" + ret;
			}
		}
		return ret;
	}
	// ********************************************************************************
	var getTargetPath = function()
	{
		targetPath = [];
		var p = getProperty();
		if (p==null) return ret;
		isFx = false;
		targetKind = false;
		targetIndex = -1;
		targetPath = getPropertyPath(p);
		targetKind = isFx;
		var v = getCaption(p);
		targetCaption = v;
		edTargetPropery.text = targetPath.join("") + "; /*" + v + "*/";
		if (edBaseProperty.text!=""){
			createRelative();
		}else{
			edRelative.text ="";
		}
	}
// ********************************************************************************
	var getBasePath = function()
	{
		basePath = [];
		var p = getProperty();
		if (p==null) return ret;
		
		basePath = getPropertyPath(p);
		var v = getCaption(p);
		edBaseProperty.text = basePath.join("") + "; /*" + v + "*/";
		if (edTargetPropery.text!=""){
			createRelative();
		}else{
			edRelative.text ="";
		}
	}

	// ********************************************************************************
	var createRelative = function()
	{
		var ret = [];

		if ( (targetPath==null)||(targetPath.length<=0)||(basePath==null)||(basePath.length<=0))
		{
			alert("選択してください");
			return;
		}
		var cnt = targetPath.length;
		if (cnt>basePath.length) cnt = basePath.length;
		
		var c = -1;
		for (var i=0; i<cnt; i++)
		{
			if (targetPath[i] !== basePath[i]) {
				break;
			}else{
				c++;
			}
		}
		if (c==-1) {
			//違うコンポにある
			edRelative.text = targetPath.join("") + " /*" + targetCaption + "*/";
			return;
		}else if ( (c==targetPath.length)&&(c==basePath.length)){
			//同じ
			edRelative.text = "value";
		}
		var cc = -1;
		for ( var i=0; i<targetPath.length;i++ )
		{
			if ((targetPath[i]==".effect")||(targetPath[i]==".transform"))
			{
				cc = i;
				break;
			}
		}
		if (cc>=0){
			var tp = [];
			for ( var i=cc; i<targetPath.length; i++) tp.push(targetPath[i]); 
			edRelative.text = tp.join("").substr(1) + "; /*" + targetCaption + "*/";
			return;
		}

		var tp = [];
		for ( var i=c;i<targetPath.length;i++)tp.push(targetPath[i]);

		var bp = [];
		for ( var i=c;i<basePath.length;i++)bp.push(basePath[i]);
		
		edRelative.text = "thisProperty.propertyGroup(" + (bp.length) + ")" + tp.join("") + "; /*" + targetCaption + "*/";
		
	}
	// ********************************************************************************
	var toExpression = function()
	{

		if (edRelative.text=="") return;
		var p = getProperty();
		if (p==null) return;

		p.expression = edRelative.text;
	}
	// ********************************************************************************
	btnGetTargetProperty.onClick = getTargetPath;
	btnGetBaseProperty.onClick = getBasePath;
	btnToExp.onClick = toExpression;
	
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
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);