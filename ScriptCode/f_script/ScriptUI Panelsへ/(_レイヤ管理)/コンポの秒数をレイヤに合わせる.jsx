//コンポの秒数をレイヤに合わせる
(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
    
    var scriptName = "コンポの秒数をレイヤに合わせる";
    //-----------------------------
	var  combDurationFit = function()
	{
        var ac = app.project.getActiveComp();
		if (  ac == false){
			alert("コンポをアクティブにしてください。",scriptName);
			return;
		}
		var as = null;
		var al = null;
		if ( ac.selectedLayers.length >0){
			for ( var i=0; i<ac.selectedLayers.length; i++){
				if (ac.selectedLayers[i].source == null) continue;
				if (  ac.selectedLayers[i].source instanceof CompItem){
					al =  ac.selectedLayers[i];
					as = ac.selectedLayers[i].source;
					break;
				}else if  (  ac.selectedLayers[i].source instanceof FootageItem){
					if (ac.selectedLayers[i].source.mainSource.isStill ==false){
						al =  ac.selectedLayers[i];
						as = ac.selectedLayers[i].source;
						break;
					}
				}
			}
		}
		if ( as == null){
			alert("有効なレイヤーを選んでください");
			retrun;
		}
		app.beginUndoGroup(scriptName);
		ac.frameRate = as.frameRate;
		ac.duration = as.duration;
		al.startTime = 0;
		al.inPoint = 0;
		al.outPoint = ac.duration;
		app.endUndoGroup();
	}
    combDurationFit();
})(this);