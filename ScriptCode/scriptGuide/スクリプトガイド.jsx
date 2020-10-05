
var CONSOLE = {};

(function(me){
#include "./(スクリプトガイド)/lib.jsxinc"

	if ( app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1){
		var s = "すみません。以下の設定がオフになっています。\r\n\r\n";
		s +=  "「環境設定：一般設定：スクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」\r\n";
		s += "\r\n";
		s += "このスクリプトを使う為にはオンにする必要が有ります。\r\n";
		alert(s);
		return;
	}
	// **************************************************************
    // 各種プロトタイプ関数の設定
    // **************************************************************
	var scriptsList = [];
  
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var scriptCurrent = new Folder($.fileName.getParent());
	var targetFolder = new Folder(scriptCurrent.fullName + "/(" + scriptName +")");
	var prefFile = new File(Folder.userData.fullName+"/"+scriptName +".pref");

	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0,  440,  400]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	var lstScripts =  winObj.add("dropdownlist", [ 5,5,5+430,5+23], []);
	var btnClear =  winObj.add("button", [ 5,30,5+50,30+23], "Clear");
	var cbIsClear =  winObj.add("checkbox", [ 65,30,65+100,30+23], "実行時にclear");
	cbIsClear.value = true;
	var btnExec =  winObj.add("button", [ 170,30,170+270,30+23], "Exec");
	var console = winObj.add("edittext", [ 5,60,5+190,60+340], "", {readonly:true, multiline:true});
	console.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 18);	
	// ********************************************************************************
	//ターゲットのプロパティ情報を作成
	var getPropertyList= function(target)
    {
        var ret = "";
		if (target.typeName!=undefined)
		{
			ret += "typeName = " + target.typeName + "\r\n";
		}
        function toS(tar,nm)
        {
            var ret = "\"" + nm + "\" = ";
            try{
                if(tar[nm]==null){
                    ret += "null";    
                }else if (tar[nm] instanceof Function){
                    ret += "function";
                }else{
                    ret += tar[nm].toString();
                }
            }catch(e){
                ret += e.toString();
            }
            return ret;
        }
        for (var nm in target)
        {
            ret += toS(target,nm)+"\r\n";
        }
        return ret;

    }
	// ********************************************************************************
	var listupScripts = function()
	{
		lstScripts.removeAll();
		scriptsList = [];
		var fld = new Folder(targetFolder.fullName);
		if (fld.exists==false) return;
		var fl = fld.getFiles("*.jsx");
		for (var i=0; i<fl.length;i++)
		{
			scriptsList.push(fl[i]);
			lstScripts.add("item",File.decode(fl[i].name.getName()));
		}
		if(lstScripts.items.length>0)
		{
			lstScripts.items[0].selected = true;
		}
	}
	listupScripts();
	// ********************************************************************************
	btnClear.onClick = function(){
		console.text = "";
	};
	// ********************************************************************************
	var exec = function()
	{
		if (lstScripts.items.length<=0) return;
		var idx = lstScripts.selection.index;
		if(idx<0) return;
		if (scriptsList[idx].open("r")){
			try{
				var bak = Folder.curent;
				Folder.current = targetFolder;
				var s = scriptsList[idx].read();
				eval(s);
				Folder.current = bak;
				savePref();
			}catch(e){
				alert("なんかスクリプト実行でエラー！\n\n"+e.toString());
			}finally{
				scriptsList[idx].close();
			}
		}
	}
	btnExec.onClick = exec;
	// ********************************************************************************
	var reszieSet = function()
	{
		var bw = winObj.bounds;
		var w = bw[2] -bw[0];
		var h = bw[3] -bw[1];

		var b1 = lstScripts.bounds;
		b1[2] = w-5;
		lstScripts.bounds = b1;

		var b2 = btnExec.bounds;
		b2[2] = (w-5);
		btnExec.bounds = b2;


		var bc = console.bounds;
		bc[2]  = bc[0] + (w - 10);
		bc[3]  = bc[1] + (h - 60);
		console.bounds = bc;

		
	}
	// ********************************************************************************
	var write = function(str)
	{
		if(cbIsClear.value==true){
			console.text = "";
		}
		console.text += str;
	}
	CONSOLE.write = write;
	// ********************************************************************************
	var writeLn = function(str)
	{
		if(cbIsClear.value==true){
			console.text = "";
		}
		console.text += str +"\r\n";
	}
	CONSOLE.writeLn = writeLn;
	// ********************************************************************************
	reszieSet();
	winObj.onResize = reszieSet;
	CONSOLE.show = function()
	{
		winObj.show();
	}
	CONSOLE.clear = function()
	{
		console.text = "";
	}
	// ********************************************************************************
	var savePref = function()
	{
		try{
			var pref = {};
			var str = lstScripts.selection.text;
			prefFile.open("w");
			prefFile.write(str);
		}finally{
			prefFile.close();
		}
	
	}
	winObj.onClose = function()
	{
		savePref();
	}
	// ********************************************************************************
	var loadPref = function()
	{
		if (prefFile.exists == false) return;
		try{
			prefFile.open("r");
			var s = prefFile.readln();
			var idx = -1;
			if (lstScripts.items.length>0){
				for (var i=0; i<lstScripts.items.length;i++)
				{
					if(lstScripts.items[i].text == s)
					{
						idx = i;
						break;
					}
				}
			}
			if(idx>=0){
				lstScripts.items[idx].selected = true;
			}
		}catch(e){
			alert(e.toString());
		}finally{
			prefFile.close();
		}
	}
	loadPref();
	// ********************************************************************************
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	// ********************************************************************************
	
	//===============================================================================
	
})(this);