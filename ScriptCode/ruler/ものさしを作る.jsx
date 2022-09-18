(function(me){
    String.prototype.getParent = function(){
        var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
        return r;
    }
 	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	Application.prototype.getScriptName = function(){
		return File.decode($.fileName.getName());
	}

	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
    var ffxFile = new File(File.decode($.fileName.getParent())+"/ものさし.ffx");

   // *****************************************************
    var createLayer = function(cmp)
    {
        var ret = null;
        var  lyr = null;
        if (cmp.selectedLayers.length>0)
        {
            lyr = cmp.selectedLayers[0];
        }
        var sl = cmp.layers.addShape();
        if (sl !== null ){
            if (lyr !== null)
            {
                sl.moveBefore(lyr);
            }
            ret = sl;
        }
        return ret;
    }
    // *****************************************************
    var main = function()
    {
        var cmp = app.project.activeItem;
        if((cmp instanceof CompItem)==false)
        {
            alert("コンポを選んで");
            return;
        }
        app.beginUndoGroup(scriptName);

        // レイヤーを作る
        var lyr = createLayer(cmp);
        if(lyr==null){
            alert("miss create Shape Layer");
            app.endUndoGroup();
            return;
        }
        lyr.name = "ものさし";
        lyr.guideLayer = true;
        lyr.applyPreset(ffxFile);
        app.endUndoGroup();

    }
    //実行
    main();



})(this);