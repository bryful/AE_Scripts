//ガイドレイヤ：切り替え
(function(me){
    //prototypeUno.jsxのロードが必要。
    var scriptName = "ガイドレイヤ：切り替え";
    var guideChange = function()
    {
        var sel = app.project.selectedLayers();
        if(sel.length>0){
            app.beginUndoGroup(scriptName);
            for(var i=0; i<sel.length; i++)
            {
                sel[i].guideLayer = ! sel[i].guideLayer;
            }
            app.endUndoGroup();
        }
    }
    guideChange();
})(this);