(function(me){
//#include "lib.jsxinc"
    var scriptName = "コンポのサイズを設定";
	

    var getPropertyPath = function()
    {
        var props = app.project.selectedProperty();
        if(props.length>0)
        {
            var s = "";
            for (var i=0; i<props.length;i++)
            {
                s += "**********************\r\n"
                s += props[i].getPathString()+"\r\n";
                s += props[i].getPathStrIndex()+"\r\n";
            }

            CONSOLE.writeLn(s);
        }
    }
    getPropertyPath();
})(this);