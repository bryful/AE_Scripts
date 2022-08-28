(function (me){
    var targetTxl = null;
    // ************************************************************
    var winObj = (me instanceof Panel)? me : new Window('palette{text:"Test",orientation : "column", properties : {resizeable : true} }');
    var res1 = //,enterKeySignalsOnChange:true
'Group{alignment: ["fill", "fill" ],orientation:"column",\
stTextLayer:StaticText{alignment:["fill","top"],justify:"left",text:"<none>"},\
btnLink:Button{alignment:["fill","top"],text:"テキストレイヤとリンク"},\
pnlText:Panel{alignment:["fill","top"],orientation:"column",text:"Text",\
edText:EditText{alignment:["fill","fill"],preferredSize:[70,60],properties:{multiline:true,scrollable:true,enterKeySignalsOnChange:true}},\
btnSetText:Button{alignment:["fill","top"],text:"set"}},\
pnlSize:Panel{alignment:["fill","top"],orientation:"row",text:"Size",\
edSize:EditText{alignment:["left","top"],justify:"right",preferredSize:[36,25]},\
btnSizeMinus:Button{alignment:["left","top"],maximumSize:[25,25],preferredSize:[25,25],text:"－"},\
sdSize:Slider{alignment:["fill","top"],text:"サイズ"},\
btnSizePluss:Button{alignment:["right","top"],maximumSize:[25,25],preferredSize:[25,25],text:"＋"}},\
pnlVScale:Panel{alignment:["fill","top"],orientation:"row",text:"VerticalScale",\
edVScale:EditText{alignment:["left","top"],justify:"right",preferredSize:[36,25],text:"100"},\
btnVScaleMinus:Button{alignment:["left","top"],maximumSize:[25,25],preferredSize:[25,25],text:"－"},\
sdVScale:Slider{alignment:["fill","top"],value:100,properties:{minvalue:0,maxvalue:200}},\
btnVScalePluss:Button{alignment:["right","top"],maximumSize:[25,25],preferredSize:[25,25],text:"＋"}},\
pnlHScale:Panel{alignment:["fill","top"],orientation:"row",text:"HorizontalScale",\
edHScale:EditText{alignment:["left","top"],justify:"right",preferredSize:[36,25],text:"100"},\
btnHScaleMinus:Button{alignment:["left","top"],maximumSize:[25,25],preferredSize:[25,25],text:"－"},\
sdHScale:Slider{alignment:["fill","top"],value:100,properties:{minvalue:0,maxvalue:200}},\
btnHScalePluss:Button{alignment:["right","top"],maximumSize:[25,25],preferredSize:[25,25],text:"＋"}}\
}';

    // ************************************************************
    winObj.gr = winObj.add(res1 );
    winObj.layout.layout();
    winObj.gr.pnlSize.sdSize.minvalue = 0;
    winObj.gr.pnlSize.sdSize.maxvalue = 300;
    winObj.gr.pnlSize.sdSize.value = 50;
    winObj.gr.pnlVScale.sdVScale.minvalue = 0;
    winObj.gr.pnlVScale.sdVScale.maxvalue = 200;
    winObj.gr.pnlHScale.sdHScale.value = 100;
    winObj.gr.pnlHScale.sdHScale.minvalue = 0;
    winObj.gr.pnlHScale.sdHScale.maxvalue = 200;
    winObj.gr.pnlHScale.sdHScale.value = 100;

    // ************************************************************
    winObj.onResize = function()
    {
        winObj.layout.resize();
    }
    // ************************************************************
    // 選択したテキストレイヤを１個だけ返す
    var getTextLayer = function()
    {
        var ret = null;
        var ac = app.project.activeItem;
        if ((ac instanceof CompItem)==false)
        {
            alert("no active comp");
            return ret;
        }
        var sel = ac.selectedLayers;
        if (sel.length>0){
            for(var i=0; i<sel.length;i++)
           {
                if(sel[i] instanceof TextLayer)
                {
                    ret = sel[i];
                    break;
                }
           }
        }
        if(ret==false){
            alert("no textlayer");
        }
        return ret;
    }
    // ************************************************************
    var chkTargetTxl  =function()
    {
        var ret = false;
        try {
            if(targetTxl==null) return ret;
            ret = true;
        }catch(e){
            ret = false;
        }
        if(ret==false)
        {
            winObj.gr.stTextLayer.text = "";
        }
        return ret;
    }
    // ************************************************************
    var dispInfo = function(txl)
    {
        winObj.gr.stTextLayer.text = "";
        try{
            if (txl==null) return;
            winObj.gr.stTextLayer.text = txl.name + "/" +txl.containingComp.name;
        }catch(e){
            return;
        }
    }
    // ************************************************************
    var setDispText = function(txl)
    {
        if (txl==null) {
            winObj.gr.pnlText.edText.text = "";
            return;
        }
        var s = txl(2)(1).value;
        if (winObj.gr.pnlText.edText.text !=s){
            winObj.gr.pnlText.edText.text = s;
        }
    }
    // ************************************************************
    var setTextToTextLayer = function(s)
    {
        if (chkTargetTxl()==false) return;
        var txl = targetTxl;
        if (txl==null) return;
        if(txl(2)(1).numKeys==0){
            var td = txl(2)(1).value;
            if (td.text != s) {
                td.text = s;
                txl(2)(1).setValue(td);
            }
        }else{
            var tm = txl.containingComp.time;
            var td = txl(2)(1).valueAtTime(tm,true);
            if (tx.text != s) {
                td.text = s;
                txl(2)(1).setValueAtTime(tm,txt);
            }
        }
    }
    // ************************************************************
    var setFontSizeToTextLayer = function(sz)
    {
        if (chkTargetTxl()==false) return;
       var txl = targetTxl;
        if (txl==null) return;
        if(txl(2)(1).numKeys==0){
            var td = txl(2)(1).value;
            if (td.fontSize != sz) {
                td.fontSize = sz;
                txl(2)(1).setValue(td);
            }
        }else{
            var tm = txl.containingComp.time;
            var td = txl(2)(1).valueAtTime(tm,true);
            if (td.fontSize != sz) {
                td.fontSize = sz;
                txl(2)(1).setValueAtTime(tm,td);
            }
        }
    }
    // ************************************************************
    var getFontSizeFromTextLayer = function()
    {
        if (chkTargetTxl()==false) return;
        var ret = 0;
        var txl = targetTxl;
        if (txl==null) return;
        if(txl(2)(1).numKeys==0){
            var td = txl(2)(1).value;
            ret = td.fontSize;
        }else{
            var tm = txl.containingComp.time;
            var td = txl(2)(1).valueAtTime(tm,true);
            ret = td.fontSize;
        }
        return ret;
    }
    // ************************************************************
    var setVerticalScaleToTextLayer = function(sz)
    {
        if (chkTargetTxl()==false) return;
        var txl = targetTxl;
        if (txl==null) return;

        var v = Math.round(sz)/100;
        if(txl(2)(1).numKeys==0){
            var td = txl(2)(1).value;
            if (td.verticalScale != v) {
                td.verticalScale = v;
                txl(2)(1).setValue(td);
            }
        }else{
            var tm = txl.containingComp.time;
            var td = txl(2)(1).valueAtTime(tm,true);
            if (td.verticalScale != v) {
                td.verticalScale = v;
                txl(2)(1).setValueAtTime(tm,td);
            }
        }
    }// ************************************************************
    var getVerticalScaleFromTextLayer = function()
    {
        if (chkTargetTxl()==false) return;
        var ret = 0;
        var txl = targetTxl;
        if (txl==null) return;
        if(txl(2)(1).numKeys==0){
            var td = txl(2)(1).value;
            ret = td.verticalScale;
            ret = Math.round(ret*100);
        }else{
            var tm = txl.containingComp.time;
            var td = txl(2)(1).valueAtTime(tm,true);
            ret = td.verticalScale;
            ret = Math.round(ret*100);
        }
        return ret;
    }
     // ************************************************************
    var setHorizontalScaleToTextLayer = function(sz)
    {
        if (chkTargetTxl()==false) return;
        var txl = targetTxl;
        if (txl==null) return;

        var v = Math.round(sz)/100;
        if(txl(2)(1).numKeys==0){
            var td = txl(2)(1).value;
            if (td.horizontalScale != v) {
                td.horizontalScale = v;
                txl(2)(1).setValue(td);
            }
        }else{
            var tm = txl.containingComp.time;
            var td = txl(2)(1).valueAtTime(tm,true);
            if (td.horizontalScale != v) {
                td.horizontalScale = v;
                txl(2)(1).setValueAtTime(tm,td);
            }
        }
    }// ************************************************************
    var getHorizontalScaleFromTextLayer = function()
    {
        if (chkTargetTxl()==false) return;
        var ret = 0;
        var txl = targetTxl;
        if (txl==null) return;
        if(txl(2)(1).numKeys==0){
            var td = txl(2)(1).value;
            ret = td.horizontalScale;
            ret = Math.round(ret*100);
        }else{
            var tm = txl.containingComp.time;
            var td = txl(2)(1).valueAtTime(tm,true);
            ret = td.horizontalScale;
            ret = Math.round(ret*100);
        }
        return ret;
    }
    // ************************************************************
    winObj.gr.pnlText.btnSetText.onClick = function()
    {
        var txt = winObj.gr.pnlText.edText.text;
        setTextToTextLayer(txt);

    }
    // ************************************************************
    var setSizeValue = function(v)
    {
        var edv =winObj.gr.pnlSize.edSize.text;
        if (edv=="") {
            edv=0;
        }else {
            try{
                edv = edv*1;
            }catch(e){
                edv = 0;
            }
        }
        if (edv != v){
            winObj.gr.pnlSize.edSize.text = v+"";
        }
        var sdv = Math.round(winObj.gr.pnlSize.sdSize.value);
        if ( sdv!=v)
        {
            winObj.gr.pnlSize.sdSize.value = v;
        }
    }
    // ************************************************************
    winObj.gr.pnlSize.sdSize.onChange = function()
    {
        var fs = Math.round(winObj.gr.pnlSize.sdSize.value);
        setSizeValue(fs);
        if (targetTxl == null) return;
        setFontSizeToTextLayer(fs);
    }
    // ************************************************************
    winObj.gr.pnlSize.edSize.onChange = function()
    {
        var edv =winObj.gr.pnlSize.edSize.text;
        if (edv=="") {
            edv=0;
        }else {
            try{
                edv = Math.round(edv*1);
            }catch(e){
                edv = 0;
                return;
            }
        }
        setSizeValue(edv);
        if (targetTxl == null) return;
        setFontSizeToTextLayer(edv);
   }
    // ************************************************************
   winObj.gr.pnlSize.btnSizeMinus.onClick=function()
   {
        var fs = Math.round(winObj.gr.pnlSize.sdSize.value)-1;
        if (fs<0) return;
        setSizeValue(fs);
        if (targetTxl == null) return;
        setFontSizeToTextLayer(fs);

   }
    // ************************************************************
   winObj.gr.pnlSize.btnSizePluss.onClick=function()
   {
        var fs = Math.round(winObj.gr.pnlSize.sdSize.value)+1;
        if (fs>300) return;
        setSizeValue(fs);
        if (targetTxl == null) return;
        setFontSizeToTextLayer(fs);

   }
   // *************************************************************
    // ************************************************************
    var setVScaleValue = function(v)
    {
        var edv =winObj.gr.pnlVScale.edVScale.text;
        if (edv=="") {
            edv=0;
        }else {
            try{
                edv = edv*1;
            }catch(e){
                edv = 0;
            }
        }
        if (edv != v){
            winObj.gr.pnlVScale.edVScale.text = v+"";
        }
        var sdv = Math.round(winObj.gr.pnlVScale.sdVScale.value);
        if ( sdv!=v)
        {
            winObj.gr.pnlVScale.sdVScale.value = v;
        }
    }
// ************************************************************
    winObj.gr.pnlVScale.sdVScale.onChange = function()
    {
        var fs = Math.round(winObj.gr.pnlVScale.sdVScale.value);
        setVScaleValue(fs);
        if (targetTxl == null) return;
        setVerticalScaleToTextLayer(fs);
    }
    // ************************************************************
    winObj.gr.pnlVScale.edVScale.onChange = function()
    {
        var edv =winObj.gr.pnlVScale.edVScale.text;
        if (edv=="") {
            edv=0;
        }else {
            try{
                edv = Math.round(edv*1);
            }catch(e){
                edv = 0;
                return;
            }
        }
        setVScaleValue(edv);
        if (targetTxl == null) return;
        setVerticalScaleToTextLayer(edv);
   }
    // ************************************************************
   winObj.gr.pnlVScale.btnVScaleMinus.onClick=function()
   {
        var fs = Math.round(winObj.gr.pnlVScale.sdVScale.value)-1;
        if (fs<0) return;
        setVScaleValue(fs);
        if (targetTxl == null) return;
        setVerticalScaleFromTextLayer(fs);

   }
    // ************************************************************
   winObj.gr.pnlVScale.btnVScalePluss.onClick=function()
   {
         var fs = Math.round(winObj.gr.pnlVScale.sdVScale.value)+1;
        if (fs<0) return;
        setVScaleValue(fs);
        if (targetTxl == null) return;
        setVerticalScaleFromTextLayer(fs);

   }
   // *************************************************************
    // ************************************************************
    var setHScaleValue = function(v)
    {
        var edv =winObj.gr.pnlHScale.edHScale.text;
        if (edv=="") {
            edv=0;
        }else {
            try{
                edv = edv*1;
            }catch(e){
                edv = 0;
            }
        }
        if (edv != v){
            winObj.gr.pnlHScale.edHScale.text = v+"";
        }
        var sdv = Math.round(winObj.gr.pnlHScale.sdHScale.value);
        if ( sdv!=v)
        {
            winObj.gr.pnlHScale.sdHScale.value = v;
        }
    }
// ************************************************************
    winObj.gr.pnlHScale.sdHScale.onChange = function()
    {
        var fs = Math.round(winObj.gr.pnlHScale.sdHScale.value);
        setHScaleValue(fs);
        if (targetTxl == null) return;
        setHorizontalScaleToTextLayer(fs);
    }
    // ************************************************************
    winObj.gr.pnlHScale.edHScale.onChange = function()
    {
        var edv =winObj.gr.pnlHScale.edHScale.text;
        if (edv=="") {
            edv=0;
        }else {
            try{
                edv = Math.round(edv*1);
            }catch(e){
                edv = 0;
                return;
            }
        }
        setHScaleValue(edv);
        if (targetTxl == null) return;
        setHorizontalScaleToTextLayer(edv);
   }
    // ************************************************************
   winObj.gr.pnlHScale.btnHScaleMinus.onClick=function()
   {
        var fs = Math.round(winObj.gr.pnlHScale.sdHScale.value)-1;
        if (fs<0) return;
        setHScaleValue(fs);
        if (targetTxl == null) return;
        setHorizontalScaleToTextLayer(fs);

   }
    // ************************************************************
   winObj.gr.pnlHScale.btnHScalePluss.onClick=function()
   {
         var fs = Math.round(winObj.gr.pnlHScale.sdHScale.value)+1;
        if (fs<0) return;
        setHScaleValue(fs);
        if (targetTxl == null) return;
        setHorizontalScaleToTextLayer(fs);

   }
    // ************************************************************
    winObj.gr.btnLink.onClick = function()
    {
        chkTargetTxl();
        var txl = getTextLayer();
        targetTxl = txl;
        dispInfo(targetTxl);
        setDispText(targetTxl);
        var sz =getFontSizeFromTextLayer();
        setSizeValue(sz);
        var vs =getVerticalScaleFromTextLayer();
        setVScaleValue(vs);
        var hs =getHorizontalScaleFromTextLayer();
        setHScaleValue(hs);

    }
    // ************************************************************
    if(winObj instanceof Window ) winObj.show();
})(this);
