//レイヤの順番を反転
(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
    
    var scriptName = "レイヤの順番を反転";
    //-----------------------------
	var  exec = function()
	{
        var ac = app.project.getActiveComp();
		if ( ac ==false){
			alert("コンポを選択して下さい。",scriptName);
			return;
		}
		var  swapLayer = function(cnt0,cnt1)
		{
			if (cnt0==cnt1){
				return true;
			} else if (cnt0>cnt1){
				var tmp = cnt0;
				cnt0 = cnt1;
				cnt1 = tmp;
			}
			ac.layers[cnt1].moveAfter(ac.layers[cnt0]);
			ac.layers[cnt0].moveAfter(ac.layers[cnt1]);
		
		}
		var sl = [];
		if ( ac.selectedLayers.length<=0){
			if ( ac.numLayers>0){
				for ( var i=1; i<=ac.numLayers; i++) sl.push(ac.layer(i));
			}
		}else{
			sl = ac.selectedLayers;
		}

		if ( sl.length<=1){
			alert("ソート可能なレイヤが無い。",scriptName);
			return;
		}
		var len = sl.length;
		var cnt = Math.floor(len / 2);
		if (cnt>0){
			app.beginUndoGroup(scriptName);
			for (var i = 0 ; i <cnt ; i++) {
				swapLayer( sl[i].index,sl[len-i-1].index);
			}
			app.endUndoGroup();
		}
	}
    exec();
})(this);