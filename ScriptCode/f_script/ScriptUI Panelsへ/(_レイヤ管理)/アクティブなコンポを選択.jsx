(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
    //prototypeUno.jsxのロードが必要。
    
    var scriptName = "アクティブなコンポを選択";
    //-----------------------------
	var  compSourceSelect = function()
	{
        var ac = app.project.getActiveComp();
       if (  ac == null){
			alert("コンポがnot Actived です。");
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
		ac.selected = true;
        app.endUndoGroup();
	}
    compSourceSelect();
})(this);