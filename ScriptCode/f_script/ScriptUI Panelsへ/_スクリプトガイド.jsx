
var CONSOLE = {};

(function(me){
//必要なライブラリの読み込み
#includepath "./(lib);./"

#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"

	if ( app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1){
		var s = "すみません。以下の設定がオフになっています。\r\n\r\n";
		s +=  "「環境設定：一般設定：スクリプトによるファイルへの書き込みとネットワークへのアクセスを許可」\r\n";
		s += "\r\n";
		s += "このスクリプトを使う為にはオンにする必要が有ります。\r\n";
		alert(s);
		return;
	}

	// ********************************************************************************
	// 読み込むスクリプトの配列
	var scriptsList = [];

	//----------------------------------
	// このスクリプトの名前
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	// このスクリプトのカレントフォルダ
	var scriptCurrent = new Folder($.fileName.getParent());
	// 読み込むスクリプトのフォルダ
	var targetFolder = new Folder(scriptCurrent.fullName + "/(スクリプトガイド)");
	// 環境設定ファイル
	var prefFile = new File(Folder.userData.fullName+"/"+scriptName +".pref");
	// 環境がCS6かどうか
	var IsNotCS6 = (app.version.substring(0,2) != "11");

	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0,  460,  400]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	var lstScripts =  winObj.add("dropdownlist", [ 5,5,5+430,5+23], []);
	var btnClear =  winObj.add("button", [ 5,30,5+50,30+23], "Clear");
	var cbIsClear =  winObj.add("checkbox", [ 65,30,65+100,30+23], "実行時にclear");
	cbIsClear.value = true;
	var btnExec =  winObj.add("button", [ 170,30,170+270,30+23], "Exec");
	var console = winObj.add("edittext", [ 5,60,5+190,60+340], "", {readonly:false, multiline:true});
	if (IsNotCS6 == false) console.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 14);
	var btnEval =  winObj.add("button", [ 5,400,5+70,400+23], "eval Exec");

	// ********************************************************************************
	//ターゲットのプロパティ情報を作成
	// propertyList_***.jsx使用
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
	// targetForlderのjsxファイルを読み込む
	var listupScripts = function()
	{
		lstScripts.removeAll();
		scriptsList = [];
		var fld = new Folder(targetFolder.fullName);
		if (fld.exists==false) return;
		var fl = fld.getFiles("*.jsx");

		// dropdownlistの構築
		for (var i=0; i<fl.length;i++)
		{
			scriptsList.push(fl[i]);
			lstScripts.add("item",File.decode(fl[i].name.getName()));
		}
		// 最初の１個を選択しておく
		if(lstScripts.items.length>0)
		{
			lstScripts.items[0].selected = true;
		}
	}
	listupScripts();
	// ********************************************************************************
	var clear = function()
	{
		console.text = "";
	}
	btnClear.onClick = clear;
	// ********************************************************************************
	// スクリプトの実行
	var exec = function()
	{
		if (lstScripts.items.length<=0) return;
		var idx = lstScripts.selection.index;
		if(idx<0) return;
		if (scriptsList[idx].open("r")){
			try{
				//カレントを移動
				var bak = Folder.curent;
				Folder.current = targetFolder;
				var s = scriptsList[idx].read();
				eval(s);
				// カレントを戻す
				Folder.current = bak;
				//ここで環境設定ファイルを保存。
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
	var evalExec = function()
	{
		var s = console.text;

		if (s == "") {
			console.text = console.text + "\r\n/* no code*/\r\n";
			return;
		}
		try{
			var obj = eval(s);
			if ((obj !=null)&&(obj instanceof Object))
			{
				clear();
				console.text = obj.toSource();
			}

		}catch(e){
			console.text = console.text + "\r\n /*\r\n eval error\r\n " + e.toString() + "\r\n*/";
			return;
		}
	}
	btnEval.onClick = evalExec;
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
		bc[3]  = bc[1] + (h - 90);
		console.bounds = bc;

		var be = btnEval.bounds;
		be[1]  = (h - 30);
		be[3]  = be[1] + 24;
		btnEval.bounds = be
	}
	reszieSet();
	winObj.onResize = reszieSet;
	// ********************************************************************************
	var wrt = function(str)
	{
		if(cbIsClear.value==true){
			console.text = "";
		}
		console.text += str;
	}
	CONSOLE.write = wrt;
	// ********************************************************************************
	var wrtLn = function(str)
	{
		if(cbIsClear.value==true){
			console.text = "";
		}
		console.text += str +"\r\n";
	}
	var log = wrtLn;
	CONSOLE.writeLn = wrtLn;
	CONSOLE.log = wrtLn;
	// ********************************************************************************
	CONSOLE.show = function()
	{
		winObj.show();
	}
	CONSOLE.clear = clear;
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
	winObj.onClose = savePref;
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