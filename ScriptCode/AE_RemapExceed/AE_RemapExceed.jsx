// ***************************************************************************
/*
    AE_Remap Exceedをafter Effectsから制御するスクリプト

*/
// ***************************************************************************

//JSON関係
if ( typeof (FsJSON) !== "object"){//デバッグ時はコメントアウトする
	FsJSON = {};
}//デバッグ時はコメントアウトする

(function(me){
    //各種プロトタイプを設定
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
	
    
    //グローバルな変数
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var aeremapPath = File.decode($.fileName.getParent()+"/CallAE_Remap.exe");
	
    //読み込む出るデータ
    var cellData = null;
    //セル指定用のラジオボタン配列
    var rbtns = [];
    //選ばれたラジオボタン
    var selectedIndex = -1;
	//------------------------
	//-------------------------------------------------------------------------
    //json utils 
	function toJSON(obj)
	{
		var ret = "";
		if (typeof(obj) === "boolean"){
			ret = obj.toString();
		}else if (typeof(obj)=== "number"){
			ret = obj.toString();
		}else if (typeof(obj)=== "string"){
			ret = "\""+ obj +"\"";
		}else if ( obj instanceof Array){
			var r = "";
			for ( var i=0; i<obj.length;i++){
				if ( r !== "") r +=",";
				r += toJSON(obj[i]);
			}
			ret = "[" + r + "]";
		}else{
			for ( var a in obj)
			{
				if ( ret !=="") ret +=",";
				ret += "\""+a + "\":" + toJSON(obj[a]);
			}
			ret = "{" + ret + "}";
			
		}
		if ( (ret[0] === "(")&&(ret[ret.length-1]===")"))
		{
			ret = ret.substring(1,ret.length-1);
		}
		return ret;
	}
	if ( typeof(FsJSON.toJSON) !== "function"){
		FsJSON.toJSON = toJSON;
	}
	//------------------------
	function parse(s)
	{
		var ret = null;
		if ( typeof(s) !== "string") return ret;
		//前後の空白を削除
		s = s.replace(/[\r\n]+$|^\s+|\s+$/g, "");
		s = s.split("\r").join("").split("\n").join("");
		if ( s.length<=0) return ret;
		
		var ss = "";
		var idx1 =0;
		var len = s.length;
		while(idx1<len)
		{
			var idx2 = -1;
			if ( s[idx1]==="\""){
				var idx2 = s.indexOf("\"",idx1+1);
				if ((idx2>idx1)&&(idx2<s.length)){
					if ( s[idx2+1] !== ":") idx2 = -1;
				}
			}
			if ( idx2 ==-1) {
				ss += s[idx1];
				idx1++;
			}else{
				ss += s.substring(idx1+1,idx2)+":";
				idx1 = idx2+2;
			}
		}
		if ( ss[0]=="{"){
			ss ="("+ss+")";
		}
		try{
			ret = eval(ss);
		}catch(e){
			ret = null;
		}
		return ret;
	}
	if ( typeof(FsJSON.parse) !== "function"){
		FsJSON.parse = parse;
	}
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
    var getLayer = function(cmp)
	{
		var ret = null;
		if ( (cmp ==null)||(cmp ==undefined)||( (cmp instanceof CompItem)==false)) {
			var ac = getActiveComp();
			if (ac == null) return ret;
			cmp = ac;
		}
		var lyrs = cmp.selectedLayers;
		if(lyrs.length<=0){
            alert("レイヤを選んで")
        }else{
            ret = lyrs;
        }
		return ret;
	}	
    //-------------------------------------------------------------------------
    //AEを起動させる
	var execAE_Reamp = function()
	{
        var ret = false;
		var aeremap = new File(aeremapPath);
		var cmd =  "\"" + aeremap.fsName +"\"";
		if (aeremap.exists==true){
			try{
                
                var r = system.callSystem(cmd + " /exenow");
                r = r.trim().toLowerCase();
                if (r=="false") {
                    system.callSystem(cmd + " /call");
                    ret = true;
                }

			}catch(e){
				alert("execAE_Reamp\r\n" + e.toString());
                ret = false;
			}
		}
        return ret;
    }
    //-------------------------------------------------------------------------
	var execAE_Export = function()
	{
        var ret = false;
		var aeremap = new File(aeremapPath);
		var cmd =  "\"" + aeremap.fsName +"\"";
		if (aeremap.exists==true){
			try{
                var r = system.callSystem(cmd + " /exenow");
                r = r.trim().toLowerCase();
                if (r=="true") {
                    var s = system.callSystem(cmd + " /export");
                    s = s.trim();
                    alert(s);
                    ret = true;
                }else{
                    alert("AE_Remapが起動していません")
                    ret = false;
                }

			}catch(e){
				alert("execAE_Reamp\r\n" + e.toString());
                ret = false;
			}
		}
        return ret;
    }
    
 	//-------------------------------------------------------------------------
 	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "AE_RemapExceed", [ 0,  0,  250,  220]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var px = 10;
    var py = 10;
    var btnW = 90;
    var btnH = 25;
    var stCaption = winObj.add("statictext", [  px, py, px+ 220, py+ 20], "AE_Remap Exceed");
    py =40;
	var btnExec_AERemap = winObj.add("button", [px,py,px+btnW, py+btnH], "AE_Remap起動" );
    py+=30;
	var btnGetClip = winObj.add("button", [px,py,px+btnW, py+btnH], "セル情報獲得" );
    py+=30;
	var btnSave = winObj.add("button", [px,py,px+btnW, py+btnH], "Compへ");
    py+=30;
	var btnSave = winObj.add("button", [px,py,px+btnW, py+btnH], "Compから");
    py+=30;
	var btnClear = winObj.add("button", [px,py,px+btnW, py+btnH], "Clear");
    py+=60;
	var btnApply = winObj.add("button", [px,py,px+btnW, py+btnH], "適応" ); 
    py +=30;
    px = 110;
    py = 40;
	var edInfo = winObj.add("edittext", [  px,   py,   px+ 150,   py+  25], "", { readonly:true });
	py +=30;
    var stSelected = winObj.add("statictext", [  px,   py,   px+ 220,   py+  20], "");
	py +=25;
	var gp = winObj.add("panel", [  px,   py,   px+ 150,   py+ 100],"Cells" );
    //-------------------------------------------------------------------------
    btnExec_AERemap.onClick = execAE_Reamp;
    btnGetClip.onClick = execAE_Export;
	//-------------------------------------------------------------------------
    var clearRbtns = function()
    {
        if (rbtns.length>0){
            for (var i=rbtns.length-1; i>=0;i--){
                rbtns[i].visible = false;
                delete rbtns[i];
                rbtns[i] = null;
                rbtns.pop();
            }
            rbtns = [];
        }
        selectedIndex=-1;
    }
	//-------------------------------------------------------------------------
    btnClear.onClick=function()
    {

        edInfo.text = "";
        stSelected.text = "";
        clearRbtns();
        selectedIndex = -1;
        cellData = null;
    }
	//-------------------------------------------------------------------------
    var makeRbtn = function(ary)
    {
        clearRbtns();
        if (ary.length>0)
        {
            var x = 5;//85;
            var y = 5;//90;
            for (var i=0; i<ary.length;i++)
            {
                var p = gp.add("radiobutton", [  x,   y,   x+ 150,   y+ 20],ary[i] );
                p.idx = i;
                p.onClick=function(){
                    selectedIndex=this.idx;
                    stSelected.text = this.idx + ": " + cellData.caption[this.idx] + "が選ばれた";
                }
               rbtns.push(p);
               y+=23;
            }
        }
    }

    //-------------------------------------------------------------------------
    /*
    var clickflg = false;
    btnGetClip.onClick = function(){
        if (clickflg==true) return;
        clickflg = true;
        try{
            edInfo.text = "";
            stSelected.text = "";
            clearRbtns();
            var code =  fromClipboard().trim();
            if ((code=="")||(code[0]!="{")) {
                alert("textError!");
                return;
            }
            var obj = FsJSON.parse(code);
            if((obj.header =="ardjV2")) {
                edInfo.text = obj.sheetName;
                makeRbtn(obj.caption);
                cellData =  obj;
            }
            }catch(e){
            alert(e.toString);
        }finally{
            clickflg = false;
        }
    };
    */
	//-------------------------------------------------------------------------
    /*
    var applyCells = function()
    {
        var applySub = function(lyr,times,values,maxV)
        {
            if ( lyr.canSetTimeRemapEnabled == false) {
                return;
            }
            try{
                var rp = lyr.property(2);
                if (rp.numKeys>0) for ( var i=rp.numKeys; i>=1;i--) rp.removeKey(i);
                lyr.timeRemapEnabled = true;
 		        if (rp.numKeys>0) for ( var i=rp.numKeys; i>1;i--) rp.removeKey(i);
                lyr.startTime = 0;
                rp.setValuesAtTimes(times,values);
		        for (var i=1 ; i<=rp.numKeys ; i++) {
                    rp.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
                }

                //からセルの処理
                var t = [];
                var v = [];
                for (var i=0; i<values.length;i++){
                    t.push(times[i]);
                    if(values[i]>=maxV){
                        v.push(0);
                    }else{
                        v.push(100);
                    }
                }
                var t2 = [];
                var v2 = [];
                v2.push(v[0]);
                t2.push(t[0]);
                var ff = v[0]
                for (var i=1; i<v.length-1;i++)
                {
                    if (ff != v[i]){
                        v2.push(v[i]);
                        t2.push(t[i]);
                        ff = v[i];
                    }
                }
                var op =  lyr.property(6).property(11);
                op.setValuesAtTimes(t2,v2);
                for (var i=1 ; i<=op.numKeys ; i++) {
                    op.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);
                }
            }catch(e){
                alert(e.toString());
            }
        }
        if (cellData==null) return;
        if(selectedIndex<0){
            alert("セルを選んで");
            return;
        }
        var lyrs = getLayer();
       if (lyrs==null){
            return;
        }
        app.beginUndoGroup("AE_Remap");
        //コンポの長さを設定
        var cmp = lyrs[0].containingComp;
        var ddu = cellData.frameCount / cellData.frameRate;
        if (cmp.duration != ddu) cmp.duration = ddu; 

       for (var i=0; i<lyrs.length;i++)
        {
            var lyr = lyrs[i];

            var times = cellData.cells[selectedIndex][0];
            var values =[];
            var fr = cellData.frameRate;
            var rp = lyrs[i].property(2);
            var maxV = rp.maxValue;
            for (var j=0; j<cellData.cells[selectedIndex][1].length;j++)
            {
                var num = cellData.cells[selectedIndex][1][j];
                if (num<0) num = maxV;
                else if (num>maxV) num = maxV;
                 values.push(num);
            }
            if(times.length==values.length) {
                applySub(lyrs[i],times,values,maxV);
                lyrs[i].inPoint = 0;
                lyrs[i].outPoint = ddu;
            }
        }
        app.endUndoGroup();
    }
    btnApply.onClick = applyCells;
    */
	//-------------------------------------------------------------------------
    var resizeLayout = function()
    {
        //edInfo.visible = false;
        //lbCells.visible = false;
        var winb = winObj.bounds;

        //ウィンドウの大きさを求める
        var w = winb[2] - winb[0];
        var h = winb[3] - winb[1];

        var infob = edInfo.bounds;
        //横方向のみ
        infob[0] = 110;
        infob[1] = 40;
        infob[2] =  winb.width -10;
        infob[3] = 40 + 25;
        edInfo.bounds = infob;

    
        var gpb = gp.bounds;
        gpb[0] = 110;
        gpb[1] = 95;
        gpb[2] = winb.width -10;
        gpb[3] = winb.height -10;
        gp.bounds = gpb;
        //edInfo.visible = true;
        //lbCells.visible = true;
        //winObj.text = winb.toString() +"/" + edInfo.bounds.toString();
        
    }
    resizeLayout();
    winObj.onResize = resizeLayout;
    //-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------

})(this);