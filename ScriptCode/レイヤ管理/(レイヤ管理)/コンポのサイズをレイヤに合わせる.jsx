//コンポのサイズをレイヤに合わせる
(function(me){
    //prototypeUno.jsxのロードが必要。
    
    var scriptName = "コンポの秒数をレイヤに合わせる";
    //-------------------------------------------------------------------------
	var combSizeFitSub = function (cmp,lyr)
	{
        if(cmp.numLayers<=0)
        {
            return;
        }
        //レイアのサイズを求める
		var anc = lyr.property(6).property(1).value;
		var pos = lyr.property(6).property(2).value;
		var scl = lyr.property(6).property(6).value;
		var newW = Math.floor(lyr.width * scl[0]/100);
		var newH = Math.floor(lyr.height* scl[1]/100);

        //レイヤの中心を求める
        var nPos = [2];
        nPos[0] = pos[0] - (anc[0] * scl[0] / 100) + newW/2;
        nPos[1] = pos[1] - (anc[1] * scl[1] / 100) + newH/2;
        
        //nullレイヤーを作成し、レイヤの中心に設定
		var nullLayer = cmp.layers.addNull();
        nullLayer.transform.pos.setValue(nPos);

        var lyrs = [];
        //nullとリンクする
        for(var i=1; i<=cmp.numLayers;i++)
        {
            if(cmp.layers[i].parent == null)
            {
                cmp.layers[i].parent = nullLayer;
                lyrs.push(cmp.layers[i]);
            }
        }

        //コンポサイズを変更
        cmp.width = newW;
        cmp.height = newH;
        //nullを中心へ
        nullLayer.transform.pos.setValue([newW/2,newH/2]);
        //nullとのリンクを外す
        for(var i=0; i<lyrs.length;i++) lyrs[i].parent = null;
        //
        nullLayer.source.remove();

	}
    //-----------------------------
	var  combSizeFit = function()
	{
        var ret = null;
		var ac = app.project.getActiveComp();
		if (  ac  == false){
			alert("コンポをアクティブにしてください。",scriptName);
			return ret;
		}
		if ( ac.selectedLayers.length >0){
			for ( var i=0; i<ac.selectedLayers.length; i++){
				if (ac.selectedLayers[i].source == null) continue;
				if (  ac.selectedLayers[i].source instanceof CompItem){
					ret =  ac.selectedLayers[i];
					break;
				}else if  (  ac.selectedLayers[i].source instanceof FootageItem){
					ret =  ac.selectedLayers[i];
					break;
				}
			}
		}
		if ( ret == null){
			alert("有効なレイヤを選択してください。",scriptName);
		}
		
		app.beginUndoGroup(scriptName);
		combSizeFitSub(ac,ret);
		app.endUndoGroup();
    }
    combSizeFit();
})(this);