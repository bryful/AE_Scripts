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
    var scriptName = "プロパティの値をコードへ";
	

    var exec = function()
    {
        var BR ="\r\n";
        var props = app.project.selectedProperty();
        if(props.length>=0)
        {
            var s = "";
            for (var i=0; i<props.length;i++)
            {
                var p = props[i];
                var nm = p.parentProperty.name +"/" + p.name;
                switch(p.propertyValueType){
                    case PropertyValueType.CUSTOM_VALUE	://	レベルエフェクトのヒストグラムのような特殊なプロパティ値。
                        s += "// no support property :" + nm + BR;
                        break;
                    case PropertyValueType.NO_VALUE	://データを格納していない。
                        s += "// no value :" + nm + BR;
                        break;
                    case PropertyValueType.ThreeD_SPATIAL	://	位置情報を示す3つの浮動小数点の配列。(位置、アンカーポイントなど) [x,y,z]
                    case PropertyValueType.ThreeD	://	量を示す3つの浮動小数点の配列。(スケールなど) [x,y,z]
                    case PropertyValueType.TwoD_SPATIAL	://	位置情報を示す2つの浮動小数点の配列。[x,y]
                    case PropertyValueType.TwoD	://	量を示す2つの浮動小数点の配列。[x,y]
                        s += p.value.toSource() + "// " + nm;
                        break;                    
                    case PropertyValueType.COLOR ://	色情報を示す[0.0?1.0]の4つの浮動小数点数値。[r,g,b,a]
                        var col = p.value;
                        var ss = "[$R/255, $G/255, $B/255, $A/255] // $NAME \r\n";
                        ss = ss.replace("$R", col[0]*255);
                        ss = ss.replace("$G", col[1]*255);
                        ss = ss.replace("$B", col[2]*255);
                        ss = ss.replace("$A", col[3]*255);
                        ss = ss.replace("$NAME", nm);
                        s +=  ss;
                        break;                    
                    case PropertyValueType.LAYER_INDEX://	レイヤーインデックスを示す整数値。レイヤーが存在していない場合は0。
                    case PropertyValueType.MASK_INDEX ://	マスクインデックスを示す整数値。マスクが存在していない場合は0。
                    case PropertyValueType.OneD	://	浮動小数点数値。
                        s += p.value + "// " + nm;
                        break;                    
                    case PropertyValueType.TEXT_DOCUMENT ://	TextDocument object
                        var td  = p.value;
                        var str = "";
                        str += "var td = new TextDocument(\"$TEXT\");".replace("$TEXT",td.text)+BR;
                        str += "td.resetCharStyle(); "+BR;
                        str += ""+BR;
                        str += "td.fontSize = $FS;".replace("$FS",td.fontSize)+BR;
                        try{
                            if(td.fillColor !=undefined) str += "td.fillColor = $FC;".replace("$FC",td.fillColor)+BR;
                        }catch(e){

                        }
                        try{
                            if(td.strokeColor !=undefined) str += "td.strokeColor = $SC;".replace("$SC",td.strokeColor.toSource())+BR;
                        }catch(e){

                        }
                        try{
                            if(td.strokeWidth !=undefined) str += "td.strokeWidth = $SW;".replace("$SW",td.strokeWidth)+BR;
                        }catch(e){

                        }
                        str += "td.font = \"$FONT\";".replace("$FONT",td.font)+BR;
                        str += "td.strokeOverFill = $B;".replace("$B",td.strokeOverFill)+BR;
                        str += "td.applyStroke = $B;".replace("$B",td.applyStroke)+BR;
                        str += "td.applyFill = $B;".replace("$B",td.applyFill)+BR;
                        str += "td.text = \"$TEXT\";".replace("$TEXT",td.text)+BR;
                        str += "td.justification = $B;".replace("$B",td.justification)+BR;
                        str += "td.tracking = $V;".replace("$V",td.tracking)+BR;
                        s += str;

                    case PropertyValueType.MARKER ://	MarkerValue object
                        break; 
                    case PropertyValueType.SHAPE ://	Shape object
                        var sp  = p.value;
                        var str = "";
                        str += "var sp = new Shape();"+BR;
                        str += "sp.vertices = $V;".replace("$V",sp.vertices.toSource())+BR;
                        str += "sp.inTangents = $V;".replace("$V",sp.inTangents.toSource())+BR;
                        str += "sp.outTangents = $V;".replace("$V",sp.outTangents.toSource())+BR;
                        str += "sp.closed = $B;".replace("$B",sp.closed)+BR;
                        s += str;
                        break; 
                }                   

            }

            CONSOLE.writeLn(s);
        }
    }
    exec();
})(this);