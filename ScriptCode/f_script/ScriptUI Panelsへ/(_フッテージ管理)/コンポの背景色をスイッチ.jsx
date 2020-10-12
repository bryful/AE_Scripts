(function(me){
/*
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
*/   
    
    //
    var scriptName = "コンポの背景色をスイッチ";
    var exec = function()
	{
        try{
            var ac = app.project.activeItem;
            if(ac instanceof CompItem)
            {
                var col = ac.bgColor;
                var colV = (col[0] + col[1] + col[2]); 
                if (colV<=1){
                    col[0] = col[1] = col[2] = 0.5;
                }else if (colV<2){
                    col[0] = col[1] = col[2] = 1;
                }else {
                    col[0] = col[1] = col[2] = 0;
                }
                ac.bgColor = col;
            }else{
                writeLn("errr");
            }

        }catch(e){
            alert("error : "+ e.toString());
        }
	}
    exec();
})(this);