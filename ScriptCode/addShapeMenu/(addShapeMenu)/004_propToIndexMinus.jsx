(function(me){

    var scriptName = "propToIndexMinus";
    var exec = function()
    {
        var ac = app.project.activeItem;
        if ((ac instanceof CompItem)==false) {
            alert ("no actived CompItem");
            return;
        }
        var sp = ac.selectedProperties;
       var props = [];
        var depsMax = 0;
        //配列から対象のプロパティを獲得
        //propertyDepthの最大値を記憶しておく
        if(sp.length>0)
        {
            for(var i=0; i<sp.length;i++)
            {
                var mn = sp[i].matchName;
                if( (mn.indexOf("ADBE Vector Group")==0)
                ||(mn.indexOf("ADBE Vector Shape")==0)
                ||(mn.indexOf("ADBE Vector Graphic")==0)
                ||(mn.indexOf("ADBE Vector Filter")==0))
                {
                    props.push(sp[i]);
                    if(depsMax<sp[i].propertyDepth){
                        depsMax=sp[i].propertyDepth;
                    }
                }
            }
        }else{
            alert("no selected");
            return;
        }
        //ｐpropertyDepthの最大値のみ残して削除
        if (props.length>0)
        {
            for ( var i= props.length-1;i>=0;i--)
            {
                if(props[i].propertyDepth!=depsMax){
                    props.splice(i, 1);
                }
            }
        }else{
            alert("I'm pooh!");
            return;
        }
        if (props.length>0)
        {
            var indexAt = props[0].propertyIndex -1;
            if(indexAt<1){
                writeLn("Top!");
                return;
            }
            //moveToを使うと参照がきえるので
            var pp = props[0].parentProperty;

            var names = [];
            for (var i=0; i<props.length;i++)
            {
                names.push(props[i].name);
            }
            app.beginUndoGroup(scriptName);
            for ( var i=names.length-1; i>=0; i--)
            {
                var p = pp(names[i]);
                p.moveTo(indexAt);
            }
            for ( var i=0; i<names.length; i++)
            {
                var p = pp(names[i]);
                p.selected = true;
            }
            app.endUndoGroup();
        }else{
            alert("I'm tiger!");
            return;

        }
    }
    exec();

})(this);