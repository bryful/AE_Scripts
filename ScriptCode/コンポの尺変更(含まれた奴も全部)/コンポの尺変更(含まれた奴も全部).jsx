(function (me){
	if ( app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1){
		var s = "すみません。以下の設定がオフになっています。\r\n\r\n";
		s +=  "「環境設定：一般設定：スクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」\r\n";
		s += "\r\n";
		s += "このスクリプトを使う為にはオンにする必要が有ります。\r\n";
		alert(s);
		return;
	}
    // ******************************************************************
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
	var scriptName = getScriptName();

    // ******************************************************************
    //MainWindow
    var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [0,0,0+300,0+330]  ,{resizeable:true, maximizeButton:false, minimizeButton:false});

    // ******************************************************************
    //controls
    var ctrlTbl=[];
    var yp = 10;
    var lbCaption = winObj.add("statictext",[10, yp, 10+480, yp+20],"コンポの尺を変更します（含まれているコンポも）");
    yp+=30;
    var btnGet = winObj.add("button",[10, yp, 10+230, yp+30],"選択したコンポの秒数を獲得");
    ctrlTbl.push(btnGet);
    yp+=35;

    var cpW = 70;
    var xp =10;
    var rbFrame = winObj.add("radiobutton",[xp, yp, xp+cpW, yp+20],"Frame");
    rbFrame.value = false;
    rbFrame.onClick = function(){
           rbFrame.value = true; 
           rbSec.value = false; 
           enabledChk();
    };
    
    xp+= cpW;
    var edFrame = winObj.add("edittext",[xp, yp, xp+160, yp+20],"0");
    edFrame.enabled = false;
    yp+=30;
    xp = 10;
    var rbSec = winObj.add("radiobutton",[xp, yp, xp+cpW, yp+20],"秒+コマ");
    rbSec.enabled = true;
    rbSec.value = true;
    rbSec.onClick = function(){
           rbFrame.value = false; 
           rbSec.value = true; 
           enabledChk();
    };
    xp+= cpW;
    var edSec = winObj.add("edittext",[xp, yp, xp+50, yp+20],"0");
    edSec.enabled = true;
    xp += 50;
    var lbPlus = winObj.add("statictext",[xp, yp, xp+20, yp+20],"+");
    xp+=20;
    var edKoma = winObj.add("edittext",[xp, yp, xp+50, yp+20],"0");
    edKoma.enabled = true;
    xp =80;
    yp+=30;
    var edFps = winObj.add("edittext",[xp, yp, xp+50, yp+20],"24");
    xp +=50;
    var lbFps = winObj.add("statictext",[xp, yp, xp+20, yp+20],"fps");
    yp+=30;
    var btnExec = winObj.add("button",[10, yp, 10+230, yp+30],"実行");
    ctrlTbl.push(btnExec);
    yp+=35;
    var edInfo = winObj.add("edittext",[10, yp, 10+230, yp+120],"", {readonly:true, multiline:true});
    ctrlTbl.push(edInfo);
    yp+=120;
    // ******************************************************************
    var enabledChk = function()
    {
        btnExec.enabled = true;
        rbFrame.enabled = true;
        rbSec.enabled = true;
        edFps.enabled = true;
        var b = (rbFrame.value==true);
        edFrame.enabled = b;
        edSec.enabled = edKoma.enabled = ! b;

    }
    enabledChk();
    // ******************************************************************
    var resize = function()
    {
        var wb = winObj.bounds;
        var ww = wb[2] - wb[0];
        var wh = wb[3] - wb[1];

        var b = btnGet.bounds;
        b[2] = ww - 10;
        btnGet.bounds = b;

        var b = btnExec.bounds;
        b[2] = ww - 10;
        btnExec.bounds = b;
        
        var b = edInfo.bounds;
        b[2] = ww - 10;
        b[3] = wh - 10;
        edInfo.bounds = b;


    }
    resize();
    winObj.onResize = resize;
    // ******************************************************************
    var clearBtn =function()
    {
        edInfo.txet = "";
    }
    clearBtn();
    // ******************************************************************
    var getEDT = function(edt,cap)
    {
        var ret = -1;
        ret = edt.text *1;
        if( isNaN(ret)==true) {
            alert(cap +"の値がおかしい");
            ret = -1;
        }
        return ret;
    }
    // ******************************************************************
    var changeSecKoma = function()
    {
        if (rbSec.value == false) return;
        var frameRate = getEDT(edFps,"fps");
        if (frameRate<12) return;
        var sec = getEDT(edSec,"秒");
        if (sec<0) return;
        var koma = getEDT(edKoma,"コマ");
        if (koma<0) return;

        var frame = sec*frameRate + koma;
        edFrame.text = frame + "";

    }
    edSec.onChange = changeSecKoma;
    edKoma.onChange = changeSecKoma;
    // ******************************************************************
    var changeFrame = function()
    {
        if (rbFrame.value == false) return;
        var frameRate = getEDT(edFps,"fps");
        if (frameRate<12) return;
        var frame = getEDT(edFrame,"Frame");
        if (frame<0) return;

        var sec = Math.floor(frame / frameRate);
        var koma = Math.floor(frame % frameRate);
        edSec.text = sec + "";
        edKoma.text = koma + "";

    }
    edFrame.onChange = changeFrame;
    
    // ******************************************************************
    var getCompDuration =function()
    {
        var sel = app.project.selection;
        if (sel.length<=0){
            edInfo.text = "何も選択されていません";
            return;
        }
        var ac = null;
        for (var i=0; i<sel.length; i++ )
        {
            if (sel[i] instanceof CompItem)
            {
                ac = sel[i];
                break;
            }
        }
        if(ac==null){
             edInfo.text = "コンポを選択してください";
            return;
        }

        var fr = ac.frameRate;
        var frm = Math.floor(ac.duration*fr);
        var sec = Math.floor(frm/fr);
        var koma = Math.floor(frm%fr);
        edFrame.text = frm + "";
        edSec.text = sec + "";
        edKoma.text = koma + "";
        edFps.text = fr + "";
    }
    btnGet.onClick = getCompDuration;
    
    // ******************************************************************
    var infoStr = "";
    var errStr = "";
    
    var durationSet =function(cmp,du)
    {
        if (cmp.duration==du) return;

        var ll = [];
        if(cmp.numLayers>0){
            for (var i=1; i<=cmp.numLayers;i++)
            {
                var lyr = cmp.layers[i];
                if((lyr.outPoint>=cmp.duration)&&(cmp.duration<du)){
                    ll.push(lyr);
                    if ( (lyr.source != null) && (lyr.source != undefined)){
                        if( lyr.source instanceof CompItem)
                        {
                            if( lyr(2).numKeys<=0) //timeremap
                            {
                                var tcmp = lyr.source;
                                var op = lyr.startTime + tcmp.duration
                                if (op<du)
                                {
                                    var du2 = du - lyr.startTime;
                                    durationSet(tcmp,du2);
                                }
                            }
                        }
                    }
                }
            }
        }
        cmp.duration = du;
        infoStr += "cmp : " + cmp.name +" / " + (du*cmp.frameRate) +  "frame\r\n";
        if(ll.length>0)
        {
            for(var i= 0; i<ll.length; i++)
            {
                var lyr = ll[i];
                if(lyr.outPoint<du){
                   var bb =true;
                   if ( (lyr.source != null) && (lyr.source != undefined)){
                       if (lyr.source instanceof FootageItem)
                       {
                           if((lyr.source.mainSource.isStill==false)&&( lyr(2).numKeys<=0)){ 
                                var op = lyr.startTime + lyr.source.duration;
                                if (op <du){
                                    wrt("B3");
                                    lyr.outPoint = op;
                                    bb = false;
                                    var ee = "        !layer! : " + lyr.name + " /   out点を伸ばしきれませんでした\r\n";
                                    infoStr += ee;
                                    errStr += ee;
                                }
                           }
                       }
                   }
                   if(bb=true){
                        lyr.outPoint = du;
                        infoStr += "    layer : " + lyr.name +" / out点を伸ばしました。\r\n";
                   }
                }
            }
        }
    }
    // ******************************************************************
    var wrt = function(str)
    {
        edInfo.text = edInfo.text + str + "\r\n";
    }
    // ******************************************************************
    var exec = function()
    {
        var frame = 0;
        var frameRate = 24;
        try{
            frameRate = edFps.text *1;
            if( isNaN(frameRate)==true) {
                alert("fpsの値がおかしい");
                return;
            }
            if(rbFrame.value==true){
                frame = edFrame.text *1;
                if( isNaN(frame)==true) {
                    alert("frameの値がおかしい");
                    return;
                }
            }else{
                var sec  = edSec.text * 1;
                if( isNaN(sec)==true) {
                    alert("秒の値がおかしい");
                    return;
                }
                var koma  = edKoma.text * 1;
                if( isNaN(koma)==true) {
                    alert("コマの値がおかしい");
                    return;
                }
                frame = sec * frameRate + koma;
            }
        }catch(e){
            alert("e1: " + e.toString());
            return;
        }
        if(frame<=6){
            alert("短すぎます");
            return
        }
        var du = frame / frameRate;

       var sel = app.project.selection;
        if (sel.length<=0){
            edInfo.text = "何も選択されていません";
            return;
        }
        var targets = [];
        for (var i=0; i<sel.length; i++ )
        {
            if (sel[i] instanceof CompItem)
            {
                targets.push(sel[i]);
            }
        }
        if(targets.length<=0){
             edInfo.text = "コンポを選択してください";
            return;
        }


        
        infoStr = "";
        errStr = "";
        app.beginUndoGroup(scriptName);
        for ( var i=0; i<targets.length;i++)
        {
            if (targets[i].duration!=du)
            {
                if (targets[i].frameRate == frameRate) {
                    durationSet(targets[i],du);
                }else{
                    infoStr += "!err!  " + targets[i].name + " : フレームレートが違います。\r\n"
                }
            }else{
                infoStr += "!err!  " + targets[i].name + " : 同じ尺です。\r\n"
            }
        }
        app.endUndoGroup();
        wrt("5");

        if(infoStr!="")
        {
            infoStr = "以下のコンポを変更しました\r\n" + infoStr;
            edInfo.text = infoStr;
        }
        if(errStr!="")
        {
            alert(errStr);
        }

    }

    btnExec.onClick = exec;
    // ******************************************************************



    //window show
        if ( ( me instanceof Panel) == false){
            winObj.center(); 
            winObj.show();
        }


})(this);
