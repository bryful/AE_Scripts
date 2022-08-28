(function (me){
// **************************************************************************
var winObj = (me instanceof Panel)? me : new Window('palette{text:"プロジェクト管理",orientation : "column", properties : {resizeable : true} }');
var res1 =
'Group{alignment: ["fill", "fill" ],orientation:"column",\
btnShowProject:Button{alignment:["fill","top"],text:"Projectパネル"},\
pnlBpc:Panel{alignChildren:["left","top"],alignment:["fill","top"],orientation:"row",text:"BPC",\
btn8bit:Button{preferredSize:[25,25],text:"8"},\
btn16bit:Button{preferredSize:[25,25],text:"16"},\
btn32bit:Button{preferredSize:[25,25],text:"32"}},\
btnTimeDisp:Button{alignment:["fill","top"],text:"時間表示をアニメ標準に"},\
btnPurge:Button{alignment:["fill","top"],text:"キャッシュを全て消す"},\
pnlExp:Panel{alignment:["fill","top"],orientation:"row",text:"ExpressionEngine",\
btnExpEtd:Button{alignment:["fill","top"],text:"以前の"},\
btnExpJava:Button{alignment:["fill","top"],text:"JavaScript"}},\
pnlComp:Panel{alignment:["fill","top"],orientation:"column",text:"Compo",\
btnBGColor:Button{alignment:["fill","top"],text:"BGColorトグル"},\
btnStartFrameOne:Button{alignment:["fill","top"],text:"コンポの開始フレームを最初に"},\
btnWorkAeaInit:Button{alignment:["fill","top"],text:"ワークエリア初期化"},\
pnlRes:Panel{alignment:["fill","top"],orientation:"row",text:"解像度",\
btnFull:Button{preferredSize:[25,25],text:"F"},\
btn1_2:Button{preferredSize:[25,25],text:"1/2"},\
btn1_3:Button{preferredSize:[25,25],text:"1/3"},\
btn1_4:Button{preferredSize:[25,25],text:"1/4"}}}\
}';

winObj.gr = winObj.add(res1 );
winObj.layout.layout();
// **************************************************************************
winObj.onResize = function()
{
  winObj.layout.resize();
}
// **************************************************************************
winObj.gr.btnShowProject.onClick = function()
{
    app.executeCommand(-524320);
}
// **************************************************************************
winObj.gr.pnlBpc.btn8bit.onClick = function(){app.project.bitsPerChannel = 8;};
winObj.gr.pnlBpc.btn16bit.onClick = function(){app.project.bitsPerChannel = 16;};
winObj.gr.pnlBpc.btn32bit.onClick = function(){app.project.bitsPerChannel = 32;};
// **************************************************************************
winObj.gr.btnTimeDisp.onClick = function()
{
    try{
        app.project.timeDisplayType = TimeDisplayType.FRAMES;
        app.project.framesUseFeetFrames = false;
        app.project.framesCountType = FramesCountType.FC_START_1;
        var flg = app.preferences.havePref(
            "Import Options Preference Section",
            "Import Options Default Sequence FPS",
            PREFType.PREF_Type_MACHINE_INDEPENDENT);

        if (flg==true)
        {
            app.preferences.savePrefAsLong(
            "Import Options Preference Section",
            "Import Options Default Sequence FPS",
            24,
            PREFType.PREF_Type_MACHINE_INDEPENDENT);
        }
        alert("フレーム表示、1スタート、読み込みフレームレート24fpsに設定")
    }catch(e){
        alert(e.toString());
    }

}
// **************************************************************************
winObj.gr.pnlComp.btnBGColor.onClick = function()
{
    var ac = app.project.activeItem;
    if (ac instanceof CompItem)
    {

        var col = ac.bgColor;
        col[0] = Math.floor(col[0]*10)/10;
        col[1] = Math.floor(col[1]*10)/10;
        col[2] = Math.floor(col[2]*10)/10;
        var ncol = [0,0,0];

        if ((col[0]==0)&&(col[1]==0)&&(col[2]==0))
        {
            ncol=[0.5,0.5,0.5];
        }else if ((col[0]==0.5)&&(col[1]==0.5)&&(col[2]==0.5))
        {
            ncol=[1,1,1];
        }else{
            ncol=[0,0,0];
        }
        ac.bgColor = ncol;
        //alert(ac.bgColor[0]+","+ac.bgColor[1]+","+ac.bgColor[2]);
    }else{
        alert("not actived");
    }
}
// **************************************************************************
winObj.gr.pnlComp.btnStartFrameOne.onClick = function()
{
    var ac = app.project.activeItem;
    if (ac instanceof CompItem)
    {
       ac.displayStartTime = 0;
    }else{
        alert("not actived");
    }
}
// **************************************************************************
winObj.gr.btnPurge.onClick = function()
{
    app.purge(PurgeTarget.ALL_CACHES);
}
// **************************************************************************
winObj.gr.pnlComp.btnWorkAeaInit.onClick = function()
{
    var ac = app.project.activeItem;
    if (ac instanceof CompItem)
    {
       if ((ac.workAreaStart != 0)||(ac.workAreaDuration != ac.duration))
       {
            ac.workAreaStart = 0;
            ac.workAreaDuration = ac.duration;
       }else{
            alert("変更なし");
       }
    }else{
        alert("not actived");
    }
}
// **************************************************************************
winObj.gr.pnlComp.pnlRes.btnFull.scale = 1;
winObj.gr.pnlComp.pnlRes.btn1_2.scale = 2;
winObj.gr.pnlComp.pnlRes.btn1_3.scale = 3;
winObj.gr.pnlComp.pnlRes.btn1_4.scale = 4;
winObj.gr.pnlComp.pnlRes.btnFull.onClick =
winObj.gr.pnlComp.pnlRes.btn1_2.onClick =
winObj.gr.pnlComp.pnlRes.btn1_3.onClick =
winObj.gr.pnlComp.pnlRes.btn1_4.onClick = function()
{
    var ac = app.project.activeItem;
    if (ac instanceof CompItem)
    {
        var scale = this.scale;
        ac.resolutionFactor = [scale,scale];
    }else{
        alert("not actived");
    }

}
// **************************************************************************
winObj.gr.pnlExp.btnExpEtd.onClick = function()
{
    if (app.project.expressionEngine!="extendscript")
    {
        app.project.expressionEngine="extendscript";
        alert("以前のExtebdScriptへ変更");
    }
}
winObj.gr.pnlExp.btnExpJava.onClick = function()
{
    if (app.project.expressionEngine!="javascript-1.0")
    {
        app.project.expressionEngine="javascript-1.0";
        alert("JavaScriptへ変更");
    }
}
// **************************************************************************
if(winObj instanceof Window ) winObj.show();
})(this);

