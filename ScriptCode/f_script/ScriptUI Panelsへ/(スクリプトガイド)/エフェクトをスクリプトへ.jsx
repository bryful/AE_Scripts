(function(me){
/*
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
*/
    var scriptName = "エフェクトをスクリプトへ";
	
    var isCustom = false;
    var getFX = function(fx)
    {
        var ret = {};
        if( fx.propertyValueType == PropertyValueType.NO_VALUE) return ret;
        ret.isSuport = false;
        ret.name = fx.name;
        ret.matchName = fx.matchName;
        ret.propertyIndex = fx.propertyIndex;
        ret.propertyValueType = fx.propertyValueType;

        ret.canSetExpression = fx.canSetExpression;

        if (ret.canSetExpression)
        {
            ret.expressionEnabled = fx.expressionEnabled;
            ret.expression = fx.expression;
        }
        ret.numKeys = fx.numKeys;
        if (fx.propertyValueType != PropertyValueType.CUSTOM_VALUE) {
            ret.isSuport = true;
 
            if(fx.numKeys==0)
            {
                ret.value = fx.value;
            }else{
                var values = [];
                for (var i=1; i<=fx.numKeys;i++)
                {
                    var v = {};
                    v.time = fx.keyTime(i);
                    v.value = fx.keyValue(i);
                    values.push(v);
                }
                ret.value = values;
            }
        }
        return ret;

    }
    var getFXG = function(fxg)
    {
        var ret = {};
        if ((fxg.numProperties==undefined)||(fxg.numProperties<=0) ) return ret;
        
        if(fxg.isNamed()) ret.name = fxg.name;
        ret.matchName = fxg.matchName;
        ret.numProperties = fxg.numProperties;
        ret.property = [];

        var cnt = 0
        for ( var i=1; i<=fxg.numProperties;i++)
        {
            var p = fxg.property(i);
            if (p.matchName=="ADBE Effect Built In Params") continue;
            var pp = {};
            if (p instanceof Property)
            {
                pp = getFX(p);
                if (pp.matchName != undefined)
                {
                    ret.property.push(pp);
                    cnt++;
                }
            }
        }
        ret.numProperties = cnt;
        return ret;
    
    }

    var geFXRoot = function(lyr)
    {
        var ret = {};
        ret.numProperties = 0;
        ret.property = [];
        ret.name ="";
        ret.matchName ="";
        
        var fxr = null;
        if (lyr.matchName == "ADBE Effect Parade")
        {
            fxr = lyr;
        }else if(lyr instanceof AVLayer){
            fxr = lyr(5);
        }
        if (fxr == null) return ret;
        ret.name = fxr.name;
        ret.matchName = fxr.matchName;
        ret.numProperties = fxr.numProperties;

        if (fxr.numProperties<=0)return ret;

        var cnt = 0;
        for ( var i=1;i<=fxr.numProperties; i++)
        {
            var p = getFXG(fxr.property(i));
            if (p.matchName !=undefined)
            {
                ret.property.push(p);
                cnt++;
            }
        }
         ret.numProperties = cnt;
        return ret;

    } 

    var BR = "\r\n";
    var TAB = "\t";
    var createCodeSub = function(obj,idx)
    {
            var vTo = function(p)
            {
                if (p instanceof Array)
                {
                    return p.toSource();
                }else {
                    return p + "";
                }

            }

        var ret = ""; 
        var fxn = "fx" + idx;

        ret += "if (fxg.canAddProperty(\"$MN\")==true){\t\n".replace("$MN",obj.matchName);
        ret += "\tvar $FXN = fxg.addProperty(\"$MN\");\r\n".replace("$FXN",fxn).replace("$MN",obj.matchName);
        ret += "\t$FXN.name = \"$N\";\r\n".replace("$FXN",fxn).replace("$N",obj.name);
        if(obj.numProperties>0)
        {
            for (var i=0; i<obj.numProperties;i++)
            {
                var p = obj.property[i];
                if (p.propertyValueType == PropertyValueType.NO_VALUE) continue;
                if (p.propertyValueType == PropertyValueType.CUSTOM_VALUE){
                    ret += "\t// " + p.name + "(" + p.matchName + ") 対応していません";
                    continue;
                }
                var pp = p.value;
                var fxnp = fxn + "("+ p.propertyIndex + ")";
                if(p.numKeys<=0)
                {
                    ret += TAB + fxnp+ ".setValue(" + vTo(pp) + ");" +BR;
                }else{
                    for (var i=0; i<p.numKeys;i++)
                    {
                        var ppp = pp[i];
                        ret += TAB + fxnp+ ".setValueAtTime(" + vTo(ppp.time) +","+ vTo( ppp.value) + ");" +BR;

                    }
                }
                if (p.canSetExpression){
                    if(p.expression !="") {
                        ret += TAB + fxnp + ".expression =\"" + p.expression.replaceAll("\"","\\\"") + "\";" +BR;
                        ret += TAB + fxnp + ".expressionEnabled =" + p.expressionEnabled +";"+BR;
                    }
                }
            }
        }
        ret +="}\r\n";

        return ret;
    }
    var createCode = function(obj)
    {
        var ret = "// **** scripts" +BR;
        ret += "// そのままでは使えないので注意です" + BR;
        ret += "var ac = app.project.activeItem;" + BR;
        ret += "var sel = ac.selectedLayers;" + BR;
        ret += "var fxg = sel[0](5);" + BR + BR;
        if (obj.numProperties<=0) return ret;

        for ( var i=0; i<obj.numProperties; i++)
        {
            ret += createCodeSub(obj.property[i],i);
        }

        return ret;
    }

    var exec = function()
    {
        var ac = app.project.getActiveComp();
        if (ac == null){
            alert("コンポをアクティブにしてください");
            return;

        }
        var lyr = app.project.getActiveLayer(ac);
        if(lyr==null) {
            alert("レイヤを１個選んでください");
            return;
        }

        var data = geFXRoot(lyr);
        var s = "";
        if( data.numProperties>0)
        {
            s = createCode(data);
        }
        //CONSOLE.writeLn(data.toSource());

        CONSOLE.writeLn(s);

    }
    exec();
})(this);