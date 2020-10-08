// フッテージをプリコンします。
// フッテージを新規にコンポ化して、フッテージが使われているものと入れ替えを行います。
// フッテージを差し替える場合、1個のコンポの確認だけで済むようになります。
(function(me){

    var scriptName = "フッテージをプリコン";

    //フッテージからフレームバングを消す。
    var nameMake = function(str)
    {
        var ret = str;
        var idx = -1;
        //拡張子を削除
        idx = str.lastIndexOf(".");
        if(idx>=1){
            ret = str.substring(0,idx);
        }
        //フレーム番号を削除
        var sidx = ret.lastIndexOf("[");
        var s0 = "";
        var s1 = "";
        if (sidx>=0){
            s0 = ret.substring(0,sidx);
            if(s0.length>=1)
            {
                var c = s0[s0.length-1];
                if ((c=="_")||(c=="-")||(c==".")){
                    s0 = s0.substring(s0,s0.length-1);
                }
            }
        }
        var didx = ret.lastIndexOf("]");
        if (didx>=0){
            s1 = ret.substring(didx+1);
        }
        ret = s0+s1;
        return ret;

    }
    var repLayer = function(cmp,n,ftg)
    {
        if  ( ((cmp instanceof CompItem) == false)||((n instanceof CompItem) == false)) return;
        if(cmp.numLayers<=0) return;
        if (cmp.id == n.id) return;

        // フッテージだけ
        var targetLayers = [];
        for ( var i=1; i<=cmp.numLayers; i++)
        {
            try{
                if(cmp.layers[i].source.file != null)
                {
                    targetLayers.push(cmp.layers[i]);
                }
            }catch(e){

            }

        }
        if(targetLayers.length<=0) return;
        for ( var i=0; i<targetLayers.length; i++)
        {
            if (targetLayers[i].source.id == ftg.id)
            {
                try{
                    var e = targetLayers[i].enabled;
                    var l = targetLayers[i].locked;

                    targetLayers[i].enabled = true;
                    targetLayers[i].locked = false;
                    targetLayers[i].replaceSource(n,false);
                    targetLayers[i].enabled = e;
                    targetLayers[i].locked = l;

                }catch(e){
                    //alert(e.toString() + ":A\r\n" + cmp.name+"\r\n" + u[i].name + "\r\n" + u[i].layers[j].name);
                }
            }
        }

    }
    var execSub = function(ftg)
    {
        // aaa_[0001-0100].tga
        //フッテージじゃなかっらやめる
        if( (ftg instanceof FootageItem)==false) return;
        var cmp = ftg.parentFolder.items.addComp(nameMake(ftg.name), ftg.width, ftg.height, ftg.pixelAspect, ftg.duration, ftg.frameRate);
        cmp.duration = ftg.duration;
        if(ftg.usedIn.length>0)
        {
            var u = ftg.usedIn;
            for (var i=0; i<u.length; i++)
            {
                repLayer(u[i],cmp,ftg);
            }
        }
        cmp.layers.add(ftg);
     

    }
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0,  200,  100]  ,{resizeable:true,maximizeButton:false, minimizeButton:false});
	//-------------------------------------------------------------------------
	var lbCap = winObj.add("statictext", [  15, 10, 15+ 170, 10+25], "選択したフッテージをプリコンします");
	var btnExec = winObj.add("button", [15, 40,   15+ 170,   40+35], "実行" );

    //-------------------------------------------------------------------------
    var exec = function()
    {
        var sel = app.project.selection;
        if (sel.length<=0) {
            alert("何も選択されていません");
            return;
        }
        var ftgs = [];
        for (var i=0; i<sel.length; i++){
            if(sel[i] instanceof FootageItem){
                ftgs.push(sel[i]);
            }
        }
        if(ftgs.length<=0){
            alert("フッテージが選択されていません");
            return;
        }
        app.beginUndoGroup(scriptName);
        for (var i=0; i<ftgs.length; i++){
            execSub(ftgs[i]);
        }
        app.endUndoGroup();
        
    }
	btnExec.onClick = function(){
        exec();
    };

    
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);