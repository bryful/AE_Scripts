(function(me){
//#include "public.jsxinc"
    
    var scriptName ="選択したアイテムを一つ上へ移動";
    var toParent = function()
	{
        try{
            var selectedItems = app.project.selection;
            if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
                app.beginUndoGroup(scriptName);
                for (var i = 0; i < selectedItems.length; i++) {
                    if ( selectedItems[i]  != null) {
                        selectedItems[i].parentFolder = selectedItems[i].parentFolder.parentFolder;
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
    toParent();
})(this);
 