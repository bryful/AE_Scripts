//レイヤのソースを選択
(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
    
    var scriptName = "レイヤのソースを選択";
    //-----------------------------
	var  layerSourceSelect = function()
	{
        var lyrs = app.project.selectedLayers();
		if ( (lyrs==null)||(lyrs.length != 1)){
			alert("レイヤを1個だけ選択してください。",this.cap);
			return;
		}
		if ( (lyrs[0] instanceof AVLayer)==false){
			alert("ソースなし");
			return;
		}
        app.beginUndoGroup(scriptName);
		if (app.project.numItems>0) {
			for (var i=1; i<=app.project.numItems;i++){
				if (app.project.item(i).selected === true) {
					app.project.item(i).selected = false;
				}
			}
		}
		var s = lyrs[0].source;
		s.selected = true;
        app.endUndoGroup();
	}
    layerSourceSelect();
})(this);