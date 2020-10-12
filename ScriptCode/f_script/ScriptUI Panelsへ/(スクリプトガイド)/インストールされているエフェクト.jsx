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
    var getEffectList= function()
    {
        var ret = "";
		
        function toS(tar,nm)
        {
            var ret = "";
            try{
                if (tar[nm].category != undefined){
                    if ( (tar[nm].category =="_Obsolete") || (tar[nm].category =="") ){
                        return ret;
                    }
                    ret += "{" +tar[nm].category + "} - " + tar[nm].displayName + "(" + tar[nm].matchName + ")";
                   if( tar[nm].version != undefined) ret += " v" + tar[nm].version;
                }
            }catch(e){
                ret += e.toString();
            }
            return ret;
        }
        var target = app.effects;
        for (var nm in target)
        {
            var s = toS(target,nm);
            if (s != ""){ 
                ret += s +"\r\n";
            }
        }
        return ret;

    }
    var encTo = function(str)
    {
        var ret = "";
        var tmp = new File(Folder.temp.fsName + '/__effects_dict__.txt');
        tmp.encoding = 'BINARY';
        try{
            tmp.encoding = 'BINARY';
            tmp.open('w');
            tmp.write(str);
        }catch(e){
            ret = "error1";
            return ret;
        }finally{
            tmp.close();
        }
        tmp.encoding = 'sjis';
        try{
            tmp.open('r');
            ret = tmp.read();
        }catch(e){
            ret = "error2";
            return ret;
        }finally{
            tmp.close();
            tmp.remove();
        }
        return ret;

    }
    var exec = function()
    {
        var str = "インストールされているエフェクト \r\n";
        var s = getEffectList();

        if (aftereffects.AfterEffectsVersion!="11.0"){
            s = encTo(s);
        }
        var sa = s.split("\n");
        sa.sort();
        if(sa[0]=="") sa.splice(0, 1);
        str += sa.join("\n");
        CONSOLE.writeLn(str);

    }
    exec();
})(this);