
(function(me){
    #includepath "./;../"
    #include "bryScriptLib.jsxinc"
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	
    var basePropList = [];
    var basePropListIndex = -1;
    var targetPropList = [];
    var targetPropListIndex = -1;

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
    Property.prototype.path = function()
    {
        return getPropertyPath(this);
    }
    var getPropertyCaption = function(prop)
    {
        var ret = "";
        var ary = [];
        var aryP = [];
        var p = prop;
        do {
            ary.push(p.name);
            aryP.push(p);
            p = p.parentProperty;
        } while( p!=null );

        var cmp = aryP[aryP.length-1].containingComp;
        ary.push(cmp.name);
        ary = ary.reverse();
        ret = ary.join("/");
        return ret;
    }
    Property.prototype.caption = function()
    {
        return getPropertyCaption(this);
    }
	//-------------------------------------------------------------------------
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

	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0,  515,  305]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
// #region matchNames
    var ctrlTbl = [];
    var x = 15;
    var y = 5;
 	var btnGetBase = winObj.add("button", [  x,   y,   x+ 75,   y+  25], "get Base" );
     btnGetBase.widthLock = 75;
     btnGetBase.leftLock = 15;
    ctrlTbl.push(btnGetBase);
	var lstBase = winObj.add("dropdownlist", [  100,   y,   100+ 400, y+  25], [ ]);
     lstBase.widthLock = 0;
     lstBase.leftLock = 100;
    ctrlTbl.push(lstBase);
    y += 30;
	var edBaseUrl = winObj.add("edittext", [  x,   y,   x + 485,   y+  50], "", { readonly:true, multiline:true });
     edBaseUrl.widthLock = 0;
     edBaseUrl.leftLock = 15;
    ctrlTbl.push(edBaseUrl);
    
    y += 55;
	var btnGetTarget = winObj.add("button", [  x,  y,   x+ 75,  y + 25], "get Target" );
     btnGetTarget.widthLock = 75;
     btnGetTarget.leftLock = 15;
    ctrlTbl.push(btnGetTarget);
	var lstTarget = winObj.add("dropdownlist", [ 100,  y,   100+ 400,  y +  25], [ ]);
     lstTarget.widthLock = 0;
     lstTarget.leftLock = 100;
    ctrlTbl.push(lstTarget);
    y += 30;
	var edTargetUrl = winObj.add("edittext", [  x,  y,   x+ 485,  y +  50], "", { readonly:true, multiline:true });
     edTargetUrl.widthLock = 0;
     edTargetUrl.leftLock = 15;
    ctrlTbl.push(edTargetUrl);
    y += 60;
	var lbResult = winObj.add("statictext", [  x,  y,   x+ 485,  y +  25], "Result - RelativePath");
     lbResult.widthLock = 0;
     lbResult.leftLock = 15;
    ctrlTbl.push(lbResult);
    y += 25;
	var edResult = winObj.add("edittext", [  x, y,   x + 485,  y+  50], "", { readonly:true, multiline:true });
     edResult.widthLock = 0;
     edResult.leftLock = 15;
    ctrlTbl.push(edResult);
    y += 65;
	var btnSet = winObj.add("button", [  x,  y,   x+ 120,  y + 30], "set Expression" );
     btnSet.widthLock = 120;
     btnSet.leftLock = 15;
    ctrlTbl.push(btnSet);
	var btnAdd = winObj.add("button", [ 145,  y,  145+ 120,  y +  30], "add Expression" );
     btnAdd.widthLock = 120;
     btnAdd.leftLock = 145;
    ctrlTbl.push(btnAdd);
    y += 35;
    //alert(y)
// #endregion
	lstBase.onChange = function()
    {
        var idx = -1;
        try{
            idx = lstBase.selection.index;

        }catch(e){
            idx = -1;
        }
        if(idx>=0)
        {
            edBaseUrl.text = basePropList[idx].path().join("");
        }
        basePropListIndex = idx;
        createRelative();
    }
    lstTarget.onChange = function()
    {
        var idx = -1;
        try{
            idx = lstTarget.selection.index;

        }catch(e){
            idx = -1;
        }
        if(idx>=0)
        {
            edTargetUrl.text = targetPropList[idx].path().join("");
        }
        targetPropListIndex = idx;
        createRelative();
    }
    var findBaseProp = function(str)
    {
        var ret = -1;
        if(str=="") return ret;
        if (basePropList.length<=0) return ret;
        for(var i=0; i < basePropList.length; i++)
        {
            if (basePropList[i].caption()==str)
            {
                ret = i;
                break;
            }
        }
        return ret;
    }
    var findTargetProp = function(str)
    {
        var ret = -1;
        if(str=="") return ret;
        if (targetPropList.length<=0) return ret;
        for(var i=0; i < targetPropList.length; i++)
        {
            if (targetPropList[i].caption()==str)
            {
                ret = i;
                break;
            }
        }
        return ret;
    }
    //-------------------------------------------------------------------------
    var getBaseProp = function()
    {

        var p = getProperty();
        if(p==null) return;
        var cap = p.caption();
        var idx = findBaseProp(cap);
        if(idx>=0){
            lstBase.items[idx].selected = true;
            basePropListIndex = idx;
        }else{
            lstBase.add("item",cap);
            idx = lstBase.items.length-1;
            lstBase.items[idx].selected = true;
            basePropList.push(p);
            basePropListIndex = idx;
            edBaseUrl.text = basePropList[idx].path().join("");
        }
        createRelative();
    }
    //-------------------------------------------------------------------------
    var getTargetProp = function()
    {
        var p = getProperty();
        if(p==null) return;
        var cap = p.caption();
        var idx = findTargetProp(cap);
        if(idx>=0){
            lstTarget.items[idx].selected = true;
            targetPropListIndex = idx;
        }else{
            lstTarget.add("item",cap);
            idx = lstTarget.items.length-1;
            lstTarget.items[idx].selected = true;
            targetPropList.push(p);
            targetPropListIndex = idx;
            edTargetUrl.text = targetPropList[idx].path().join("");
        }
        createRelative();
    }
    var createRelative = function()
	{
		var ret = [];

        btnSet.enabled = false;
        btnAdd.enabled = false;
		if ((basePropListIndex<0)||(targetPropListIndex<0))
        {
            edResult.text = "";
            return;
        }
        btnSet.enabled = true;
        btnAdd.enabled = true;
        var tarP = targetPropList[targetPropListIndex].path();
        var baseP = basePropList[basePropListIndex].path();
        
		var cnt = baseP.length;
		if (cnt>tarP.length) cnt = tarP.length;
		
		var c = -1;
		for (var i=0; i<cnt; i++)
		{
			if (baseP[i] !== tarP[i]) {
				break;
			}else{
				c++;
			}
		}
		if (c==-1) {
			//違うコンポにある
			edResult.text = baseP.join("");
			return;
		}else if ( (c==baseP.length)&&(c==tarP.length)){
			//同じ
			edResult.text = "value";
		}
		var cc = -1;
		for ( var i=0; i<baseP.length;i++ )
		{
			if ((baseP[i]==".effect")||(baseP[i]==".transform"))
			{
				cc = i;
				break;
			}
		}
		if (cc>=0){
			var tp = [];
			for ( var i=cc; i<baseP.length; i++) tp.push(baseP[i]); 
			edResult.text = tp.join("").substr(1) + ";";
			return;
		}

		var bbp = [];
		for ( var i=c;i<baseP.length;i++)bbp.push(baseP[i]);

		var tp = [];
		for ( var i=c;i<tarP.length;i++)tp.push(tarP[i]);
		
		edResult.text = "thisProperty.propertyGroup(" + (tp.length) + ")" + bbp.join("") + ";";
		
	}
    //-------------------------------------------------------------------------
    var layoutSet = function()
    {
        if (ctrlTbl.length<=0) return;
        var side = 15;
        var b = ctrlTbl[0].bounds;
        var wb = winObj.bounds;
        var w = wb[2] -wb[0];;
        //edResult.text = wb[0] + "/" + wb[1] + "/" + wb[2] + "/"+ wb[3];
        for(var i=0; i<ctrlTbl.length; i++)
        {
            var b = ctrlTbl[i].bounds;
            b[0] = ctrlTbl[i].leftLock;
            if(ctrlTbl[i].widthLock<=0){
                b[2] = w - side; 
            }else{
                b[2] = b[0] + ctrlTbl[i].widthLock; 
            }
            ctrlTbl[i].bounds = b;
        }
    }
    layoutSet();
 	//-------------------------------------------------------------------------
    btnSet.onClick = function(){
    };
    btnGetBase.onClick = function(){
        getBaseProp();
    };
    btnGetTarget.onClick = function(){
        getTargetProp();
    };
    btnSet.onClick = function()
    {
        var ee = edResult.text;
        if(ee=="") return;
        var p = getProperty();
        p.expression = ee; 
    }
    btnAdd.onClick = function()
    {
        var ee = edResult.text;
        if(ee=="") return;
        var p = getProperty();
        var str = p.expression;
        if(str==""){
            p.expression = "value;\r\n//" + ee; 
        }else{
            p.expression = str + "\r\n//" + ee; 
            
        }
    }
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
 	winObj.onResize = layoutSet;

	//-------------------------------------------------------------------------
})(this);