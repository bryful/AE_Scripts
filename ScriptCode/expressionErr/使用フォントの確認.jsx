(function (me){
    var scriptName = "使用フォントの確認";
    //除外フォントのデフォルト
    var defExceptionFonts = [
        "MS-Gothic",
        "MS-Mincho",
        "MS-UIGothic",
        "MS-PGothic",
        "MS-PMincho",
        "MeiryoUI",
        "MeiryoUI-Italic",
        "MeiryoUI-Bold",
        "MeiryoUI-Italic",
        "MeiryoUI-BoldItalic"
    ];
    // 除外フォントテーブル
    var exceptionFonts = [];
    // 獲得したテキストレイヤの配列
    var matchlayerList = [];

    // *************************************************
    var prefSave = function()
    {
        var f = new File(Folder.userData.fullName + "/"+scriptName + ".pref");
        var obj = {};
        exceptionFonts.sort();
        obj.exceptionFonts = exceptionFonts;

        if (f.open("w")==true)
        {
            try{
                f.write(obj.toSource());
            }catch(e){
            }finally{
                f.close();
            }
        }

    }
       // *************************************************
    var prefLoad = function()
    {
        exceptionFonts = [];

        var f = new File(Folder.userData.fullName + "/"+scriptName + ".pref");
        if (f.open("r")==true)
        {
            try{
                var s = f.read();
                var obj = eval(s);
                if (obj.exceptionFonts != undefined)
                {
                    exceptionFonts = obj.exceptionFonts;
                    exceptionFonts.sort();

                }



            }catch(e){
            }finally{
                f.close();
            }
        }
        if((exceptionFonts==null)||(exceptionFonts==undefined)||(exceptionFonts.length<=0))
        {
            exceptionFonts = defExceptionFonts;
        }
        exceptionFonts.sort();

    }
    prefLoad();
    // *************************************************
    var getFontNameFromLayer = function(lyr)
    {
        var ret = "";
        if (lyr instanceof TextLayer)
        {
            var td = lyr.property("ADBE Text Properties").property("ADBE Text Document").value;
            ret = td.font;
        }
        return ret;
    }
    // *************************************************
    var isMathEceptionFont = function(fn)
    {
        var ret = false;
        for (var i=0; i<exceptionFonts.length;i++)
        {
            if (fn==exceptionFonts[i]){
                ret = true;
                break;
            }
        }
        return ret;
    }
    // *************************************************
    var chkLayerFromComp = function(cmp)
    {
        if (cmp.numLayers<=0) return;
        for (var i=1; i<=cmp.numLayers; i++)
        {
            if (cmp.layers[i] instanceof TextLayer)
            {
                var fn = getFontNameFromLayer(cmp.layer(i));
                if (isMathEceptionFont(fn)==false)
                {
                    matchlayerList.push(cmp.layer(i));
                }

            }
        }
    }
    // *************************************************
    var compPath = function(cmp)
    {
        var ret = "";

        var layerName = "";
        if (cmp instanceof TextLayer)
        {
            layerName = cmp.name;
            cmp = cmp.containingComp;
        }

        var p = cmp;
        var ary = [];
        if (layerName!="") ary.push(layerName);
        var pid = app.project.rootFolder.id;
        while(p!=null)
        {
            ary.push(p.name);
            p = p.parentFolder;
            if( (p==null)||(p==undefined)) break;
            if (p.id == pid)break;
        }
        ary.reverse();
        ret = ary.join("/");
        return ret;
    }
    var compPathTest = function()
    {
        var ac = app.project.activeItem;
        alert(compPath(ac));
    }

    // *************************************************
    var winObj = (me instanceof Panel)? me : new Window('palette{text:"使用フォントの確認",orientation : "column", properties : {resizeable : true} }');
    // *************************************************
    var res1 =
 'Group{alignment:["fill","fill"],orientation:"column",preferredSize:[500,300],\
gr1:Group{alignment:["fill","top"],orientation:"row",\
btnExec:Button{alignment:["left","top"],text:"Exec"},\
st1:StaticText{alignment:["right","center"],text:"除外フォント"},\
btnInit:Button{alignment:["left","center"],maximumSize:[40,30],text:"Init"},\
btnAdd:Button{alignment:["right","center"],maximumSize:[60,30],text:"Add",properties:{}},\
btnDel:Button{alignment:["left","center"],maximumSize:[60,30],text:"Del"}},\
gr2:Group{alignment:["fill","fill"],orientation:"row",\
lstFont:ListBox{alignment:["fill","fill"]},\
lstException:ListBox{alignment:["right","fill"],maximumSize:[500,65536],minimumSize:[150,0]}}\
}';
    // *************************************************
    winObj.gr = winObj.add(res1);
    winObj.layout.layout();
    winObj.gr.gr1.btnAdd.enabled = false;
    winObj.gr.gr1.btnDel.enabled = false;
    //winObj.gr.gr1.btnExec.onClick = compPathTest;
    // *************************************************
    winObj.onResize = function()
    {
    winObj.layout.resize();
    }
    // *************************************************
    var makeLstException = function()
    {
        winObj.gr.gr2.lstException.removeAll();
        if (exceptionFonts.length>0)
        {
            exceptionFonts.sort();
            winObj.gr.gr2.lstException.removeAll();
            for(var i=0;i<exceptionFonts.length;i++ )
            {
                winObj.gr.gr2.lstException.add("item",exceptionFonts[i]);
            }
        }

    }
    makeLstException();
    // *************************************************
    winObj.gr.gr2.lstException.onChange = function()
    {
        var b = false;
        if (winObj.gr.gr2.lstException.items.length>0)
        {
            var idx = winObj.gr.gr2.lstException.selection.index;
            b = (idx>=0);
        }
        winObj.gr.gr1.btnDel.enabled = b;
    }
    // *************************************************
    winObj.gr.gr1.btnDel.onClick = function()
    {
        if (winObj.gr.gr2.lstException.selection==null) return;
        var idx = winObj.gr.gr2.lstException.selection.index;
        if (idx>=0)
        {
            exceptionFonts.splice(idx,1);
            //makeLstException();
            winObj.gr.gr2.lstException.remove(idx);


            var imax = winObj.gr.gr2.lstException.items.length;
            if(imax>0)
            {
                if (idx>imax-1) idx = imax-1;
                winObj.gr.gr2.lstException.items[idx].selected = true;
            }
            fontChk();
            prefSave();
        }

    }
    // *************************************************
    var fontChk = function()
    {
        matchlayerList =[];
        winObj.gr.gr2.lstFont.removeAll();
        var cnt = app.project.numItems;
        if (cnt<=0)
        {
            alert("なにもない");
            return;
        }
        for ( var i=1; i<=cnt; i++)
        {
            if (app.project.items[i] instanceof CompItem)
            {
                chkLayerFromComp(app.project.items[i]);
            }
        }
        if (matchlayerList.length>0)
        {
            winObj.gr.gr2.lstFont.visible = false;
            for (var i=0; i<matchlayerList.length;i++)
            {
                var info = "";
                info += getFontNameFromLayer(matchlayerList[i]);
                info += ", (" +compPath(matchlayerList[i]) + ")";
                winObj.gr.gr2.lstFont.add("item",info);
            }
            winObj.gr.gr2.lstFont.visible = true;
        }else{
            alert("ローカリティなフォントはありません");
        }
    }
    winObj.gr.gr1.btnExec.onClick = fontChk;
    // *************************************************
    winObj.gr.gr2.lstFont.onChange = function()
    {
        var b = false;
        if (winObj.gr.gr2.lstFont.items.length>0)
        {
            var idx = winObj.gr.gr2.lstFont.selection.index;
            b = (idx>=0);
        }
        winObj.gr.gr1.btnAdd.enabled = b;
    }
     // *************************************************
    winObj.gr.gr1.btnAdd.onClick = function()
    {
        if (winObj.gr.gr2.lstFont.selection==null) return;
        var idx = winObj.gr.gr2.lstFont.selection.index;
        if (idx>=0)
        {
            var fn = winObj.gr.gr2.lstFont.selection.toString();
            fn = fn.split(",")[0];
            if (exceptionFonts.length>0)
            {
                for (var i=0; i<exceptionFonts.length;i++)
                {
                    if (exceptionFonts[i]==fn){
                        return;
                    }
                }
            }
            exceptionFonts.push(fn);
            makeLstException();
            fontChk();
            prefSave();
        }

    }
     // *************************************************
    winObj.gr.gr1.btnInit.onClick = function()
    {
        matchlayerList = defExceptionFonts;
        makeLstException();
        fontChk();
        prefSave();

    }
    // ****************************************************************************************************
    winObj.gr.gr2.lstFont.onDoubleClick =function()
    {
        if (winObj.gr.gr2.lstFont.selection ==null) return;
        var idx = winObj.gr.gr2.lstFont.selection.index;
        if (idx>=0)
        {
            var lyr = matchlayerList[idx];
            var cmp =  lyr.containingComp;
            if (app.project.numItems>0) {
                for (var i=1; i<=app.project.numItems;i++){
                    if (app.project.items[i].selected === true) {
                        app.project.items[i].selected = false;
                    }
                }
            }

            if (cmp.numLayers>0) {
                for (var i=1; i<=cmp.numLayers;i++){
                    if (cmp.layers[i].selected === true) {
                        cmp.layers[i].selected = false;
                    }
                }
            }
            cmp.selected = true;
            lyr.selected = true;
            cmp.openInViewer();
        }
    }
    // *************************************************
    winObj.onClose=function()
    {
        prefSave();
    }

    if(winObj instanceof Window ) {
        winObj.center();
        winObj.show();
    }
})(this);
