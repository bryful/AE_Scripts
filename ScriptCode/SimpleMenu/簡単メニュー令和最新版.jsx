/*
    簡単メニュー令和最新版.jsx
    昔の奴よりもっと簡単にしました。

    サブフォルダの扱いを変えてフォルダの移動が出来るようになりました。
    当初はスクリプト名を変えての複数メニューを考えていましたが、使ってる人みるとそんなことしていないで、
    数十個のスクリプトを入れてたので変えました。
    それに伴って前にあったスクリプト名の先頭に数字を入れてソートする機能は廃止しました。

    0）
    スクリプト名に"()"を加えたフォルダ内のファイルを読み込みます。
    例えば"fff.jsx"とスクリプト名を変えると"(fff)"フォルダの中のファイルを読み込みます。

    1）
    上記のフォルダ内にフォルダがあるとリストに"<フォルダ名>"と表示されダブルクリックでその中のファイルが表示されます。
    上のフォルダに移行は"<Parent>"ボタンで出来ます。

    2)
    対応ファイルがjsx/jsxbin/ffx/bat/exeファイルと増えています。
    batchファイルはオマケでつけました。

    3)
    横のボタンはサブフォルダーへのクイックアクセスボタンです。
    元フォルダの第1層のみで、サブフォルダのサブフォルダは対応していません。


*/

(function (me){
	//----------------------------------

    /// ターゲットフォルダを求める関数
    var getTargetPath = function()
    {
        function IndexOfLast(str)
        {
            var ret = -1;
            ret = fp.lastIndexOf("/");
            if( ret < 0) ret = fp.lastIndexOf("\\");
            return ret;
        }

        var fp = File.decode($.fileName);
        var idx = IndexOfLast(fp);
        var pp = "";
        var pn = "";
        if(idx>=0)
        {
            pp = fp.substring(0,idx);
            pn = fp.substring(idx+1);
        }else{
            pn = fp;
        }
        var eidx = pn.lastIndexOf(".");
        if(eidx>=0)
        {
            pn = pn.substr(0,eidx);
        }
        return pp +"/(" +pn+")";
    }

    var getParentPath = function(str)
    {
        var ret = str;
        if(ret=="") return ret;
        var i = ret.lastIndexOf("/");
        if (i<0) i= ret.lastIndexOf("\\");
        if(i>=0)
            ret = ret.substring(0,i);
		return ret;

    }
    var getName = function(str)
    {
        var ret = str;
        if(ret=="") return ret;
        var i = ret.lastIndexOf("/");
        if (i<0) i= ret.lastIndexOf("\\");
        if(i>=0)
            ret = ret.substring(i+1);
		return ret;

    }
	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
     var changeExt = function(str,ext)
    {
		var i=str.lastIndexOf(".");
		if(i>=0)
        {
            return str.substring(0,i)+ext;
        }else{
            return str;
        }

    }
	//----------------------------------
    // スクリプト名を得る
	var scriptName = changeExt(getName(File.decode($.fileName)),"");

    // ******************************************
    // 環境設定ファイルのFileオブジェクトを得る。
    var getPrefFile = function()
    {
        var pff = new Folder(Folder.userData.fullName+"/bry-ful");
        if(pff.exists==false)
        {
            pff.create();
        }
        var pff2 = new Folder(pff.fullName+"/" + scriptName);
        if (pff2.exists==false)
        {
            pff2.create();
        }
        var pf = new File(pff2.fullName + "/" + scriptName + ".pref");
        return pf;

    }


	//----------------------------------
    var prefData = {};
    prefData.left = 100;
    prefData.top = 100;
    prefData.width = 200;
    prefData.height = 200;
    prefData.rect = function()
    {
        var ret =[];
        ret.push(this.left);
        ret.push(this.top);
        ret.push(this.left + this.width);
        ret.push(this.top + this.height);
        return ret;

    }

    var loadPref = function()
    {
        var prefFile = getPrefFile();
        if(prefFile.exists)
        {
            var s = "";
		    if (prefFile.open("r"))
            {
                try{
                    s = prefFile.read();
                    var obj = eval(s);
                    var v = obj.left;
                    if((v!=undefined)&&(typeof(v)=="number")){prefData.left = v; v=null;}
                    v = obj.top;
                    if((v!=undefined)&&(typeof(v)=="number")){ prefData.top = v; v=null;}
                    v = obj.width;
                    if((v!=undefined)&&(typeof(v)=="number")){ prefData.width = v; v=null;}
                    v = obj.height;
                    if((v!=undefined)&&(typeof(v)=="number")){ prefData.height = v; v=null;}


                }catch(e){
                }finally{
                    prefFile.close();
                }
    		}
        }
    }
    loadPref();
    var savePref = function()
    {
        var prefFile = getPrefFile();
        if (prefFile.open("w")){
			try{
                var b = winObj.bounds;
                prefData.left = b[0];
                prefData.top = b[1];
                prefData.width = b[2] - b[0];
                prefData.height = b[3] - b[1];
				prefFile.write(prefData.toSource());
				ret = true;
			}catch(e){
            }finally{
                prefFile.close();
            }
		}
    }
	//----------------------------------


	var targetFolder = new Folder ( getTargetPath());
 	//----------------------------------

    // ***********************************************************
    var btnRoot = null;
    var btnParent = null;
    var btnExec = null;
    var listFiles = null;

	var fileItems = [];
	var folderButtons = [];
	//-------------------------------------------------------------------------
	var listupSub = function(fld)
	{
        btnParent.enabled = false;
        if ( (fld == null)||( (fld instanceof Folder)==false )||(fld.exists == false)) return;
        if(fld.fullName.indexOf(targetFolder.fullName)!=0) return;

        fileItems = [];
        folderItems = [];
        btnParent.folder = null;
        if (fld.fullName!=targetFolder.fullName)
        {
            var pf = fld.parent;
            pf.isFFX = false;
		    pf.isJSX = false;
			pf.isBAT = false;
            pf.isPARENT = true;
            pf.isFLD = false;

            fileItems.push(pf);
            btnParent.enabled = true;
            btnParent.folder = pf;
        }

		var files = fld.getFiles();

		if (files.length<=0) return;
		var dl =[];
		var fl =[];
		for ( var i=0; i<files.length; i++)
		{
            files[i].isFFX = false;
		    files[i].isJSX = false;
			files[i].isEXE = false;
            files[i].isPARENT = false;
            files[i].isFLD = false;
			if( files[i] instanceof Folder)
			{
                files[i].isFLD = true;
				dl.push(files[i]);

			}else{
				var n = files[i].name.getExt().toLowerCase();
				if ( n == ".ffx") {
					files[i].isFFX = true;
					fl.push(files[i]);

				}else if (( n == ".jsx")||( n == ".jsxbin")) {
					files[i].isJSX = true;
					fl.push(files[i]);
				}else if (( n == ".bat")||( n == ".exe")) {
					files[i].isEXE = true;
					fl.push(files[i]);
				}
			}
		}
		if ( dl.length>0)
        {
            for(var i =0; i<dl.length;i++)
            {
                 fileItems.push(dl[i]);
            }
		}
		if ( fl.length>0){
            for(var i =0; i<fl.length;i++)
            {
                 fileItems.push(fl[i]);
            }
		}
	}
    // ***********************************************************
    var listup = function(dir)
    {
        btnParent.folder = null;

		if ( (dir != null)&&(dir.exists == true)){
			listupSub(dir);
		}
        listFiles.removeAll();

		if ( fileItems.length>0){
            listFiles.visible = false;
            for ( var i=0; i<fileItems.length;i++)
            {
                var cap = File.decode(fileItems[i].name);
                if (fileItems[i].isPARENT)
                {
                    cap = "< Parent >";
                }else if (fileItems[i].isFLD){
                    cap = "< " +cap +" >";
                }

                listFiles.add("item",cap);
            }
            listFiles.visible = true;
		}
        listFiles.active = true;
		btnExec.enabled = false;
        btnExec.text = "Exec";
        prefData.openFolder = dir.fsName;
    }
    // ***********************************************************
    var rootListup = function(pp)
    {


        if ((targetFolder ==null)||(targetFolder.exists==false))
        {
            var pp = getTargetPath();
	        targetFolder = new Folder (pp);
        }
        btnParent.onClick=function()
        {
            if(this.folder!=null)
            {
                listup(this.folder);
            }
        }

        if(folderButtons.length>0)
        {
            for ( var i=0; i<folderButtons.length;i++)
            {
                winObj.remove(folderButtons[i]);
            }

        }
        folderButtons = [];
        if(targetFolder.exists==true)
        {
            listup(targetFolder);

            if (fileItems.length>0)
            {
                var didx =0;
                for ( var i=0; i<fileItems.length;i++)
                {
                    if (fileItems[i].isFLD)
                    {
                        var cap = File.decode(fileItems[i].name).substr(0,5);
                        var y = 55+didx*25;
                        var btn = winObj.add("button",[5,y,35+5,y+20],cap);
                        btn.folder = fileItems[i];
                        btn.onClick = function()
                        {
                            listup(this.folder);
                        }
                        folderButtons.push(btn);
                        didx++;
                    }
                }
            }

        }
        if(pp!=null)
        {
            var nf = new Folder(pp);
            if(nf.exists){
                listup(nf);
            }
        }
    }
    // ***********************************************************
    var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName,prefData.rect()  ,{resizeable:true});
    winObj.onClose= savePref;
    var createControl = function()
    {
        var x =5;
        var y =5;
        btnRoot = winObj.add("button", [x,y, x + 35, y + 20], "Root");
        //x+= 40;
        y+= 25;
        btnParent = winObj.add("button", [x, y, x + 35, y + 20], "Parent");
        x+= 40;
        y = 5;
        btnExec = winObj.add("button", [x, y, x + 265, y + 20], "Exec");
        x = 45;
        y += 20;
        listFiles = winObj.add("listbox", [x, y, x + 65, y + 200]);

    }
    createControl();
    // ***********************************************************
    listFiles.onChange = function()
	{
        if(listFiles.selection==null) return;
        var idx = listFiles.selection.index;
		btnExec.enabled = (idx>=0);
        if (idx>=0)
        {
            btnExec.text = File.decode(fileItems[idx].name);
        }else{
            btnExec.text="Exec";
        }
	}
    // ***********************************************************
    btnRoot.onClick = rootListup;
    // ***********************************************************
    var chekSizeControl = function()
    {
        var rect = winObj.bounds;
        var w = rect[2] - rect[0];
        var h = rect[3] - rect[1];
        var bn = btnExec.bounds;
        bn[2] = w -5;
        btnExec.bounds = bn;
        var ln = listFiles.bounds;
        ln[2] = w -5;
        ln[3] = h -5;

    }
    chekSizeControl();

    // ***********************************************************
    winObj.onResize = function()
    {
        chekSizeControl();
    }
	//-------------------------------------------------------------------------
	var exec = function()
	{
		var idx =-1;
		if ( listFiles.selection !=null)
			idx = listFiles.selection.index;
		if ( idx>=0){
			if (fileItems[idx].exists == false){
				alert(fileItems[idx].fullName +"がない");
				return;
			}
			if (fileItems[idx].isJSX==true)
			{
				if (fileItems[idx].open("r")){
					try{
						var s = fileItems[idx].read();
						fileItems[idx].close();
						eval(s);
					}catch(e){
						alert("なんかスクリプト実行でエラー！\n\n"+e.toString());
					}
				}
			}
            else if (fileItems[idx].isFFX==true)
            {
				var sl = [];
				var ac = app.project.activeItem;
				if ( ac instanceof CompItem){
					if (ac.selectedLayers.length>0){
						sl = ac.selectedLayers;
					}
				}
				if ( sl.length>0){
					app.beginUndoGroup(File.decode(fileItems[idx].name));
					for ( var i=0; i<ac.selectedLayers.length; i++)
					{
						ac.selectedLayers[i].applyPreset(fileItems[idx]);
					}
					app.endUndoGroup();
				}else{
					alert("レイヤを選択して下さい。");
				}
			}else if ((fileItems[idx].isFLD==true)||(fileItems[idx].isPARENT==true))
            {
                listup(fileItems[idx]);
            }else if (fileItems[idx].isEXE==true)
            {
                fileItems[idx].execute();
            }
            listFiles.active = true;
		}
        //btnExec.text ="Exec";
	}
	btnExec.onClick = exec;
	listFiles.onDoubleClick = exec;
    // ***********************************************************
    rootListup();
    // ***********************************************************
    if(winObj instanceof Window )
    {
        winObj.show();
    }
    // ***********************************************************
})(this);
