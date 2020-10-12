(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
        var scriptName = "コンポのサイズを設定";

    Application.prototype.compSettingDialog = function(cmp)
    {
        //サイズ変更時の位置
        var posIndex = 4;
        var cmpSet = function(cmp,width,height,posI,fr,st,du)
        {
            if ( (cmp instanceof CompItem)==false) return;
            //frameRate
            if(cmp.frameRate!=fr){ cmp.frameRate=fr;}
            //displayStartTime
            if (cmp.displayStartTime != st){cmp.displayStartTime = st;}
            //duration
            if (cmp.duration != du){cmp.duration = du;}
            //size
            if ( (cmp.width==width)&&(cmp.height==height)) return;

            if (cmp.numLayers<=0){
                if(cmp.width!=width) cmp.width=width; 
                if(cmp.height!=height) cmp.height=height; 
            }else{
                var nullPos = null;
                var targetLayers = [];
                for (var i=1; i<=cmp.numLayers;i++)
                {
                    if (cmp.layers[i].parent == null)
                    {
                        targetLayers.push(cmp.layers[i]);
                    }
                }
                nullPos = cmp.layers.addNull();
                var p =[0,0];
                switch (posI){
                    case 0:
                        p = [0,0];
                        break;
                    case 1:
                        p = [cmp.width/2,0];
                        break;
                    case 2:
                        p = [cmp.width,0];
                        break;
                    case 3:
                        p = [0,cmp.height/2];
                        break;
                    case 4:
                        p = [cmp.width/2,cmp.height/2];
                        break;
                    case 5:
                        p = [cmp.width,cmp.height/2];
                        break;
                    case 6:
                        p = [0,cmp.height];
                        break;
                    case 7:
                        p = [cmp.width/2,cmp.height];
                        break;
                    case 8:
                        p = [cmp.width,cmp.height];
                        break;
                };
                nullPos.transform.position.setValue(p);
                for(var i=0; i<targetLayers.length; i++)
                {
                    targetLayers[i].parent = nullPos;
                }
                if(cmp.width!=width) cmp.width=width; 
                if(cmp.height!=height) cmp.height=height; 
                switch (posI){
                    case 0:
                        p = [0,0];
                        break;
                    case 1:
                        p = [cmp.width/2,0];
                        break;
                    case 2:
                        p = [cmp.width,0];
                        break;
                    case 3:
                        p = [0,cmp.height/2];
                        break;
                    case 4:
                        p = [cmp.width/2,cmp.height/2];
                        break;
                    case 5:
                        p = [cmp.width,cmp.height/2];
                        break;
                    case 6:
                        p = [0,cmp.height];
                        break;
                    case 7:
                        p = [cmp.width/2,cmp.height];
                        break;
                    case 8:
                        p = [cmp.width,cmp.height];
                        break;
                };
                nullPos.transform.position.setValue(p);
                for(var i=0; i<targetLayers.length; i++)
                {
                    targetLayers[i].parent = null;
                }
                nullPos.source.remove();
            }

        }
        //-------------------------------------------------------------------------
	    var winObj = new Window("palette", "CompSettings",[ 0,0,340,220]);
        //-------------------------------------------------------------------------
        var plPrm = winObj.add("panel", [  10,   10,   10+ 320,   10+ 150], "パラメータ" );
        var st1 = plPrm.add("statictext", [  34,   13,   34+  40,   13+  23], "width");
        var edWidth = plPrm.add("edittext", [  89,   10,   89+ 100,   10+  21], "1920");
        var st2 = plPrm.add("statictext", [  34,   40,   34+  40,   40+  23], "Height");
        var edHeight = plPrm.add("edittext", [  89,   37,   89+ 100,   37+  21], "1080");

        ///ラジオボタンの作成
        var rbs = [];
        var x = 220;
        var y = 10;
        var w = 18;
        var h = 18;


        for (var j=0; j<3; j++){
            var yy = y + j*h;
            for (var i=0; i<3; i++){
                var xx = x + i*w;
                var rb = plPrm.add("radiobutton", [ xx,yy, xx+w,yy+h], "");
                rb.posIndex = j*3 + i;
                rb.onClick = function()
                {
                    posIndex = this.PosIndex;
                }
                rbs.push(rb);
            }
        }
        rbs[4].value = true;

        var st3 = plPrm.add("statictext", [   7,   76,    7+  68,   76+  23], "FrameRate");
        var edFrameRate = plPrm.add("edittext", [  90,   78,   90+  49,   78+  21], "24");
        var st4 = plPrm.add("statictext", [ 145,   76,  145+  68,   76+  23], "StartFrame");
        var edStratFrame = plPrm.add("edittext", [ 209,   78,  209+  47,   78+  21], "1");
        var st5 = plPrm.add("statictext", [   6,  110,    6+  96,  110+  23], "Duration(Frame)");
        var edDuraion = plPrm.add("edittext", [  91,  106,   91+  81,  106+  21], "144");
        var btnGetComp = plPrm.add("button", [ 203,  106,  203+ 102,  106+  23], "get Comp Size" );
        
        var btnClose = winObj.add("button",      [  10,  180,   10+  80,  180+  30], "Close" );
        var btnApply = winObj.add("button",      [ 120,  170,  120+  80,  170+  40], "Apply" );
        var btnApplyCLose = winObj.add("button", [ 220,  170,  220+  92,  170+  40], "ApplyAndClose" );

        var getCompStatus = function()
        {
            var cmps = app.project.getSelectedComp();
            if(cmps.length>0)
            {
                edWidth.text = cmps[0].width;
                edHeight.text = cmps[0].height;
                edFrameRate.text = cmps[0].frameRate;
                var dr = cmps[0].frameRate;
                var d = cmps[0].displayStartTime;
                edStratFrame.text = d*dr + app.project.displayStartFrame;
                edDuraion.text = cmps[0].duration * dr;

            }

        }
        getCompStatus();
        var toInt = function(str)
        {
            var v = -1;
            try{
                var v = Math.floor(str*1);
                if(isNaN(v)==false)
                {
                    ret = v;
                }
            }catch(e){
                alert(e.toString());
                v=-2;
            }
            return ret;
        }
        var exec = function()
        {
            var cmpList = app.project.getSelectedComp();
            if(cmpList.length<=0)
            {
                alert("no selected CmpItem");
                return;
            }
            var w = toInt(edWidth.text);
            if(w<=0) return;
            var h = toInt(edHeight.text);
            if(h<=0) return;
            var fr = toInt(edFrameRate.text);
            if(fr<=0) return;
            var st = toInt(edStratFrame.text);
            if(st<0) return;
            st -= app.project.displayStartFrame;
            st /= fr;
            var du = toInt(edDuraion.text);
            if(du<=0) return;
            du /= fr;

            app.beginUndoGroup(scriptName);
            for (var i=0; i<cmpList.length;i++)
            {
                cmpSet(cmpList[i],w,h,posIndex,fr,st,du)
            }
            app.endUndoGroup();
        }
        
        
        btnGetComp.onClick=getCompStatus;
    
        btnClose.onClick=function()
        {
            winObj.close();
        }
        btnApply.onClick=function()
        {
           exec();
        }

        btnApplyCLose.onClick=function()
        {
           exec();
            winObj.close();
        }
        winObj.center(); 
        winObj.show();
    }
    //
    app.compSettingDialog();
})(this);