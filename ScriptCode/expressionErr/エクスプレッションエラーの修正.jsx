(function (me){
    var scriptName ="エクスプレッションエラーに対処";

    var scanList = [];
    var scanCount = 0;
    var projCount = 0;
    var err=0;
    // ******************************************************************************
    var propPath = function(cmp,layer,prop)
    {
        var ret ="";
        var a =[];
        a.push(prop.name);
        var p = prop.parentProperty;
        while(p!=null)
        {
            a.push(p.name);
            p = p.parentProperty;
            if(p==null) break;

        }
        if(a.length>0)
        {
            ret = cmp.name + ":" + layer.name+ ":"+a.join(":");
        }
        return ret;
    }
    // ******************************************************************************
    var scanProp = function(cmp,layer,prop)
    {
        if (prop instanceof Property)
        {
            if (prop.canSetExpression==true)
            {
                if(prop.expressionError!="")
                {
                    var obj={};
                    obj.cmp = cmp;
                    obj.layer = layer;
                    obj.prop = prop;
                    obj.expression = prop.expression;
                    obj.expressionError = prop.expressionError;
                    obj.path = propPath(cmp,layer,prop);
                    scanList.push(obj);
                }
            }
            scanCount++;
            return;
        }
        if(prop.numProperties>0){
            for (var i=1; i<= prop.numProperties;i++)
            {
                scanProp(cmp,layer,prop.property(i));
            }
        }
    }
    // ******************************************************************************
    var scanLayer = function(cmp,layer)
    {
       if(layer.numProperties<=0)
        {
            return;
        }
       for(var i=1; i<=layer.numProperties; i++)
       {
            scanProp(cmp,layer,layer.property(i));
       }
    }
    // ******************************************************************************
    var scanComp = function(cmp)
    {
        if(cmp.numLayers<=0) return;
        for (var i=1; i<= cmp.numLayers;i++)
        {
            cmp.layers[i].selected = true;
            scanLayer(cmp,cmp.layers[i]);
            cmp.layers[i].selected = false;
        }

    }
    // ******************************************************************************
    var scanAll = function()
    {
        scanList = [];
        sanCount = 0;
        clearOutput();
        projCount =0;
        for (var i=1; i<= app.project.numItems;i++)
        {
            app.project.items[i].selected = false;
        }
        for (var i=1; i<= app.project.numItems;i++)
        {
            if(app.project.items[i] instanceof CompItem)
            {
                app.project.items[i].selected = true;
                scanComp(app.project.items[i]);
                app.project.items[i].selected = false;
            }
            projCount++;
        }
        projCount = app.project.numItems;
    }
    // ******************************************************************************
    var winObj = (me instanceof Panel)? me : new Window('palette{text:"エクスプレッションエラーに対処",orientation : "column", properties : {resizeable : true} }');
    var res1 =
'Group{alignment: ["fill", "fill" ],orientation:"row",preferredSize:[300,100],\
leftP:Group{alignment:["fill","fill"],orientation:"column",\
stInfo:StaticText{alignment:["fill","top"],justify:"left",preferredSize:[150,25],text:"1回のScanだけだと取りこぼすことがあります"},\
btnScan:Button{alignment:["fill","top"],preferredSize:[150,25],text:"Scan"},\
lstResult:ListBox{alignment:["fill","fill"],preferredSize:[150,600]}},\
rightP:Group{alignment:["fill","fill"],orientation:"column",\
etErrMes:EditText{alignment:["fill","top"],preferredSize:[300,100],properties:{multiline:true,readonly:true}},\
pnlB:Panel{alignment:["fill","top"],orientation:"row",text:"name",\
btnWrite:Button{alignment:["left","top"],text:"write"},\
btnClear:Button{alignment:["left","top"],text:"clear"}},\
etExp:EditText{alignment:["fill","fill"],preferredSize:[300,500],properties:{multiline:true}}}\
}';
    // ******************************************************************************
    winObj.gr = winObj.add(res1);
    winObj.layout.layout();
    // ******************************************************************************
    winObj.onResize = function()
    {
        if(winObj==null) return;
        try{
        winObj.layout.resize();
        }catch(e){

        }
    }
    // ******************************************************************************
    winObj.gr.leftP.btnScan.onClick = function()
    {
        scanList=[];
        winObj.gr.leftP.lstResult.removeAll();
        scanAll();
        if(scanList.length<=0)
        {
            alert(scanCount+"個検索してエラーは0でした");
            return;
        }
        var lst = [];
        winObj.gr.leftP.lstResult.visible = false;
        for (var i=0; i<scanList.length;i++)
        {
            var info = scanList[i].path;
            winObj.gr.leftP.lstResult.add("item",info);
        }
         winObj.gr.leftP.lstResult.visible = true;

    }
    winObj.gr.leftP.lstResult.onChange = function()
    {
        var idx = -1;
        if(projCount<=0) {
            alert(projCount);
            return;
        }
        if(projCount != app.project.numItems)
        {
            alert("構成が変更されています。再スキャンしてください");
            return;
        }
        if (winObj.gr.leftP.lstResult.selection!=null)
        {
            idx = winObj.gr.leftP.lstResult.selection.index;

            winObj.gr.rightP.etErrMes.text = scanList[idx].expressionError;
            winObj.gr.rightP.etExp.text = scanList[idx].expression;
        }
    }
    winObj.gr.leftP.lstResult.onDoubleClick = function()
    {
        if(projCount<=0) return;
        if(projCount != app.project.numItems)
        {
            alert("構成が変更されています。再スキャンしてください");
            return;
        }
        var idx = -1;
        if (winObj.gr.leftP.lstResult.selection!=null)
        {
            idx = winObj.gr.leftP.lstResult.selection.index;
            if(scanList[idx].prop!=null)
            {
                /*
                for (var i=1; i<= app.project.numItems;i++)
                {
                    app.project.items[i].selected = false;
                }

                */
                for (var i=1; i<= scanList[idx].cmp.numLayers;i++)
                {
                    scanList[idx].cmp.layers[i].selected = false;
                }
                scanList[idx].cmp.selected = true;
                scanList[idx].layer.selected = true;
                scanList[idx].prop.selected = true;
                scanList[idx].cmp.openInViewer();
            }
        }
    }
    winObj.gr.rightP.pnlB.btnWrite.onClick = function()
    {
        if(projCount<=0) return;
        if(projCount != app.project.numItems)
        {
            alert("構成が変更されています。再スキャンしてください");
            return;
        }
        if (confirm("修正したエクスプレッションを書き込みますか")==false)
        {
            return;
        }
        try
        {
            if (winObj.gr.leftP.lstResult.selection!=null)
            {
                idx = winObj.gr.leftP.lstResult.selection.index;
                if (scanList[idx].prop!=null)
                {
                    scanList[idx].expression =
                    scanList[idx].prop.expression = winObj.gr.rightP.etExp.text;
                    scanList[idx].expressionError = scanList[idx].prop.expressionError;
                    winObj.gr.rightP.etErrMes.text =scanList[idx].expressionError;
                    if(scanList[idx].prop.expressionError =="")
                    {
                        winObj.gr.rightP.etExp.text = "";
                        winObj.gr.rightP.etErrMes.text = "";
                        winObj.gr.leftP.lstResult.remove(winObj.gr.leftP.lstResult.selection);
                        scanList.splice(idx,1);
                    }else{
                        alert("まだerr!");
                    }
                }
            }

        }catch(e){
            alert(e.toString());
        }
    }
    winObj.gr.rightP.pnlB.btnClear.onClick = function()
    {
        if(projCount<=0) return;
        if(projCount != app.project.numItems)
        {
            alert("構成が変更されています。再スキャンしてください");
            return;
        }
        if (confirm("エクスプレッションを削除しますか")==false)
        {
            return;
        }
        try
        {
            if (winObj.gr.leftP.lstResult.selection!=null)
            {
                idx = winObj.gr.leftP.lstResult.selection.index;
                if (scanList[idx].prop!=null)
                {
                    scanList[idx].prop.expression ="";
                    if(scanList[idx].prop.expressionError=="")
                    {
                        winObj.gr.rightP.etExp.text = "";
                        winObj.gr.rightP.etErrMes.text = "";
                        winObj.gr.leftP.lstResult.remove(winObj.gr.leftP.lstResult.selection);
                        scanList.splice(idx,1);
                    }else{
                        winObj.gr.rightP.etExp.text = scanList[idx].prop.expression;
                        alert("失敗");
                    }
                }
            }

        }catch(e){
            alert(e.toString());
        }
    }
    // ******************************************************************************
    if(winObj instanceof Window )
    {
        winObj.center();
        winObj.show();
    }
    // ******************************************************************************
})(this);
