(function(me){
//#include "public.jsxinc"
    
    //
    var scriptName = "選択したアイテムをルートに移動";
    var toRoot = function()
	{
        try{
            var selectedItems = app.project.selection;
            if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
                app.beginUndoGroup(scriptName);
                for (var i = 0; i < selectedItems.length; i++) {
                    if ( selectedItems[i]  != null) {
                        selectedItems[i].parentFolder = app.project.rootFolder;
                    }
                }
                app.endUndoGroup();
            }else{
                alert("アイテムを選択してください。");
            }
        }catch(e){
            alert("error : "+ e.toString());
        }
	}
    toRoot();
})(this);