(function (me)
{
	var isEditMode		= false;
	var targetComp		= null;
	var targetLayer		= null;
	var targetProperty	= null;
	
	var isPanel = ( me instanceof Panel);
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	//だらだらと定数の記述
	///////////////////////////////////////////////////////////////////////////////////////////////
	var eleListIndex	= -1;	//doropdownlistで選ばれた項目のインデックス
	var eleListMode		= 0;	//0:none 1: Doc 2: Layers 3: Comps
	var eleList = new Array(
		"グローバルオブジェクト",
		"Time Conversion",
		"Vector Math",
		"Random Numbers",
		"Interpolation",
		"Color Conversion",
		"その他の演算メソッド",
		"Comp",
		"Footage",
		"Layer サブオブジェクト",
		"Layer General",
		"Layer Properties",
		"Layer 3D",
		"Layer Space Transforms",
		"Camera",
		"Effect",
		"Mask",
		"Key",
		"Property",
		"MarkerKey"
	);
	var eleSubList = new Array;
	//グローバルオブジェクト
	eleSubList.push(new Array(
		"comp(name)",
		"footage(name)",
		"thisComp",
		"thisLayer",
		"thisProperty",
		"time",
		"colorDepth",
		"posterizeTime(framesPerSecond)",
		"value"
	));
	//Time Conversion
	eleSubList.push(new Array(
		"timeToFrames(t = time + thisComp.displayStartTime, fps = 1.0 / thisComp.frameDuration, isDuration = false)",
		"framesToTime(frames, fps = 1.0 / thisComp.frameDuration)",
		"timeToTimecode(t = time + thisComp.displayStartTime, timecodeBase = 30, isDuration = false)",
		"timeToNTSCTimecode(t = time + thisComp.displayStartTime, ntscDropFrame = false, isDuration = false)",
		"timeToFeetAndFrames(t = time + thisComp.displayStartTime, fps = 1.0 / thisComp.frameDuration, framesPerFoot = 16, isDuration = false)",
		"timeToCurrentFormat(t = time + thisComp.displayStartTime, fps = 1.0 / thisComp.frameDuration, isDuration = false)"
	));
	//Vector Math
	eleSubList.push(new Array(
		"add(vec1, vec2)",
		"sub(vec1, vec2)",
		"mul(vec, amount)",
		"div(vec, amount)",
		"clamp(value, limit1, limit2)",
		"dot(vec1, vec2)",
		"cross(vec1, vec2)",
		"normalize(vec)",
		"length(vec)",
		"length(point1, point2)",
		"lookAt(fromPoint, atPoint)"
	));
	//Random Numbers
	eleSubList.push(new Array(
		"seedRandom(offset, timeless=false)",
		"random()",
		"random(maxValOrArray)",
		"random(minValOrArray, maxValOrArray)",
		"gaussRandom()",
		"gaussRandom(maxValOrArray)",
		"gaussRandom(minValOrArray, maxValOrArray)",
		"noise(valOrArray)"
	));
	//Interpolation
	eleSubList.push(new Array(
		"linear(t, tMin, tMax, value1, value2)",
		"linear(t, value1, value2)",
		"ease(t, value1, value2)",
		"ease(t, tMin, tMax, value1, value2)",
		"easeIn(t, value1, value2)",
		"easeOut(t, value1, value2)",
	"easeOut(t, tMin, tMax, value1, value2)"
	));
	//Color Conversion
	eleSubList.push(new Array(
		"rgbToHsl(rgbaArray)",
		"hslToRgb(hslaArray)"
	));
	//その他の演算メソッド
	eleSubList.push(new Array(
		"degreesToRadians(degrees)",
		"radiansToDegrees(radians)"
	));
	//Comp
	eleSubList.push(new Array(
		"layer(index)",
		"layer(name)",
		"layer(otherLayer, relIndex)",
		"marker",
		"marker.key(index)",
		"marker.key(name)",
		"marker.nearestKey(t)",
		"marker.numKeys",
		"numLayers",
		"activeCamera",
		"width",
		"height",
		"duration",
		"displayStartTime",
		"frameDuration",
		"shutterAngle",
		"shutterPhase",
		"bgColor",
		"pixelAspect",
		"name"
	));
	//Footage
	eleSubList.push(new Array(
		"width",
		"height",
		"duration",
		"frameDuration",
		"pixelAspect",
		"name"
	));
	//Layer サブオブジェクト
	eleSubList.push(new Array(
		"effect(name)",
		"effect(index)",
		"mask(name)",
		"mask(index)"
	));
	//Layer General
	eleSubList.push(new Array(
		"anchorPoint",
		"position",
		"scale",
		"rotation",
		"opacity",
		"audioLevels",
		"timeRemap",
		"marker.key(index)",
		"marker.key(name)",
		"marker.nearestKey(t)",
		"marker.numKeys",
		"name"
	));
	//Layer Properties
	eleSubList.push(new Array(
		"orientation",
		"rotationX",
		"rotationY",
		"rotationZ",
		"lightTransmission",
		"castsShadows",
		"acceptsShadows",
		"acceptsLights",
		"ambient",
		"diffuse",
		"specular",
		"shininess",
		"metal",
	));
	//Layer 3D
	eleSubList.push(new Array(
		"toComp(point, t=time)",
		"fromComp(point, t=time)",
		"toWorld(point, t=time)",
		"fromWorld(point, t=time)",
		"toCompVec(vec, t=time)",
		"fromCompVec(vec, t=time)",
		"toWorldVec(vec, t=time)",
		"fromWorldVec(vec, t=time)",
		"fromCompToSurface(point, t=time)"
	));
	//Layer Space Transforms
	eleSubList.push(new Array(
		"pointOfInterest",
		"zoom",
		"depthOfField",
		"focusDistance",
		"aperture",
		"blurLevel",
		"active"
	));
	//Camera
	eleSubList.push(new Array(
		"pointOfInterest",
		"intensity",
		"color",
		"coneAngle",
		"coneFeather",
		"shadowDarkness",
		"shadowDiffusion"
	));
	//Effect
	eleSubList.push(new Array(
		"active",
		"param(name)",
		"param(index)"
	));
	//Mask
	eleSubList.push(new Array(
		"MaskOpacity",
		"MaskFeather",
		"maskExpansion",
		"invert"
	));
	//Key
	eleSubList.push(new Array(
		"value",
		"valueAtTime(t)",
		"velocity",
		"velocityAtTime(t)",
		"speed",
		"speedAtTime(t)",
		"wiggle(freq, amp, octaves=1, amp_mult=.5, t=time)",
		"temporalWiggle(freq, amp, octaves=1, amp_mult=.5, t=time)",
		"smooth(width=.2, samples=5, t=time)",
		"loopIn(type=\"cycle\", numKeyframes=0)",
		"loopOut(type=\"cycle\", numKeyframes=0)",
		"loopInDuration(type=\"cycle\", duration=0)",
		"loopOutDuration(type=\"cycle\", duration=0)",
		"key(index)",
		"key(markerName)",
		"nearestKey(t)",
		"numKeys",
		"propertyGroup(countUp = 1)",
		"propertyIndex",
		"name"
	));
	//Property
	eleSubList.push(new Array(
		"value",
		"time",
		"index"
	));
	//MarkerKey
	eleSubList.push(new Array(
		"duration",
		"comment",
		"chapter",
		"url",
		"eventCuePoint",
		"cuePointName",
		"parameters"
	));

//-------
	///////////////////////////////////////////////////////////////////////////////////////////////
	//プロパティのアクセス配列を得る
	function proPath(p)
	{
		var ret = [];
		if ( ( p== null)||(p==undefined)) return ret;
		if (  (p instanceof Property )||(p instanceof PropertyGroup )||(p instanceof MaskPropertyGroup )) {
			var pp = p;
			while ( pp != null){
				ret.push(pp);
				pp = pp.parentProperty;	//このメソッドがキモ
			}
			//配列をひっくり返す
			if ( ret.length>1) ret = ret.reverse();
		}
		//返されるObjectは、Layerからになる
		return ret;
	} 
	///////////////////////////////////////////////////////////////////////////////////////////////
	function textLayerToString(ary)
	{
		if ( ary[0].matchName != "ADBE Text Layer") return "";
		var ret = "";
		if ( ary[1].matchName == "ADBE Material Options Group") {
			switch(ary[2].matchName){
				case "ADBE Light Transmission" : ret += "materialOption.lightTransmission"; break;
				case "ADBE Ambient Coefficient" : ret += "materialOption.ambient"; break;
				case "ADBE Diffuse Coefficient" : ret += "materialOption.diffuse"; break;
				case "ADBE Specular Coefficient" : ret += "materialOption.specular"; break;
				case "ADBE Shininess Coefficient" : ret += "materialOption.shininess"; break;
				case "ADBE Metal Coefficient" : ret += "materialOption.metal"; break;
			}
			return ret;
		}
		if ( ary[1].matchName != "ADBE Text Properties") return ret;
		ret = "text.";
		for ( var i= 2; i<ary.length; i++){
			switch(ary[i].matchName){
				//-----------------------------
				case "ADBE Text Document": ret += "sourceText";break;
				case "ADBE Text More Options": ret += "moreOption.";break;
				case "ADBE Text Anchor Point Align": ret += "groupingAlignment.";break;
				case "ADBE Text Animators": ret += "";break;
				case "ADBE Text Animator": ret += "animator(\""+ ary[i].name +"\").";break;
				case "ADBE Text Selectors": ret += "";break;
				case "ADBE Text Selector": ret += "selector(\""+ ary[i].name +"\").";break;
				case "ADBE Text Percent Start": ret += "start";break;
				case "ADBE Text Percent End": ret += "end";break;
				case "ADBE Text Animator Properties": ret += "property.";break;
				case "ADBE Text Anchor Point 3D": ret += "anchorPoint";break;
				case "ADBE Text Position 3D": ret += "position";break;
				case "ADBE Text Fill Opacity": ret += "fillOpacity";break;
				case "ADBE Text Stroke Opacity": ret += "strokeOpacity";break;
				case "ADBE Text Fill Hue": ret += "fillHue";break;
				case "ADBE Text Stroke Hue": ret += "strokeHue";break;
				case "ADBE Text Fill Saturation": ret += "fillSaturation";break;
				case "ADBE Text Stroke Saturation": ret += "strokeSaturation";break;
				case "ADBE Text Fill Brightness": ret += "fillBrightness";break;
				case "ADBE Text Stroke Width": ret += "strokeWidth";break;
				case "ADBE Text Line Anchor": ret += "lineAnchor";break;
				case "ADBE Text Percent Start": ret += "start";break;
				case "ADBE Text Percent End": ret += "end";break;
				case "ADBE Text Percent Offset": ret += "offset";break;
				case "ADBE Text Range Advanced": ret += "advanced.";break;
				case "ADBE Text Selector Mode": ret += "mode";break;
				case "ADBE Text Selector Max Amount": ret += "amount";break;
				case "ADBE Text Selector Smoothness": ret += "smoothness";break;
				case "ADBE Text Levels Max Ease": ret += "easeHigh";break;
				case "ADBE Text Levels Min Ease": ret += "easeLow";break;
				case "ADBE Text Expressible Selector": ret += "selector(\""+ ary[i].name +"\").";break;
				case "ADBE Text Expressible Amount": ret += "amount";break;
				case "ADBE Text Track Type": ret += "trackingType";break;
				case "ADBE Text Tracking Amount": ret += "trackingAmount";break;
				case "ADBE Text Character Replace": ret += "characterValue";break;
				case "ADBE Text Character Offset": ret += "characterOffset";break;
				case "ADBE Text Blur": ret += "blur";break;
			}
		}
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	function vectorToString(ary)
	{
		if (( ary[0].matchName != "ADBE Vector Layer")||( ary[1].matchName != "ADBE Root Vectors Group")) return "";
		var ret = "";
		
		for ( var i= 2; i<ary.length; i++){
			switch(ary[i].matchName){
				//-----------------------------
				case "ADBE Vector Shape - Rect": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Rect Size": ret += "size";break;
				case "ADBE Vector Rect Position": ret += "position";break;
				case "ADBE Vector Rect Roundness": ret += "roundness";break;
				//-----------------------------
				case "ADBE Vector Shape - Ellipse": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Ellipse Size": ret += "size";break;
				case "ADBE Vector Ellipse Position": ret += "position";break;
				//-----------------------------
				case "ADBE Vector Shape - Star": ret += "content(\"" + ary[i].name + "\").";break; 
				case "ADBE Vector Star Points": ret += "points";break;
				case "ADBE Vector Star Position": ret += "position";break;
				case "ADBE Vector Star Rotation": ret += "rotation";break;
				case "ADBE Vector Star Inner Radius": ret += "innerRadius";break;
				case "ADBE Vector Star Outer Radius": ret += "outerRadius";break;
				case "ADBE Vector Star Inner Roundess": ret += "innerRoundness";break;
				case "ADBE Vector Star Outer Roundess": ret += "outerRoundness";break;
				//-----------------------------
				case "ADBE Vector Shape - Group": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Shape": ret += "path";break;
				//-----------------------------
				case "ADBE Vector Group": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Transform Group": ret += "transform.";break;
				case "ADBE Vector Anchor": ret += "anchorPoint";break;
				case "ADBE Vector Position": ret += "position";break;
				case "ADBE Vector Scale": ret += "scale";break;
				case "ADBE Vector Skew": ret += "skew";break;
				case "ADBE Vector Skew Axis": ret += "skewAxis";break;
				case "ADBE Vector Rotation": ret += "rotation";break;
				case "ADBE Vector Group Opacity": ret += "opacity";break;
				//-----------------------------
				case "ADBE Vector Filter - Offset": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Offset Amount": ret += "amount";break;
				case "ADBE Vector Offset Miter Limit": ret += "miterLimit";break;
				//-----------------------------
				case "ADBE Vector Filter - PBt": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Filter - RC": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector PuckerBloat Amount": ret += "amount";break;
				case "ADBE Vector RoundCorner Radius": ret += "radius";break;
				//-----------------------------
				case "ADBE Vector Filter - Trim": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Trim Start": ret += "start";break;
				case "ADBE Vector Trim End": ret += "end";break;
				case "ADBE Vector Trim Offset": ret += "offset";break;
				//-----------------------------
				case "ADBE Vector Filter - Twist": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Twist Angle": ret += "angle";break;
				//-----------------------------
				case "ADBE Vector Filter - Roughen": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Roughen Size": ret += "size";break;
				case "ADBE Vector Roughen Detail": ret += "detail";break;
				case "ADBE Vector Roughen Points": ret += "points";break;
				case "ADBE Vector Temporal Freq": ret += "wigglesSecond";break;
				case "ADBE Vector Correlation": ret += "correlation";break;
				case "ADBE Vector Temporal Phase": ret += "temporalPhase";break;
				case "ADBE Vector Spatial Phase": ret += "spatialPhase";break;
				case "ADBE Vector Random Seed": ret += "randomSeed";break;
				//-----------------------------
				case "ADBE Vector Filter - Wiggler": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Xform Temporal Freq": ret += "wigglesSecond";break;
				
				case "ADBE Vector Wiggler Transform": ret += "transform.";break;
				case "ADBE Vector Wiggler Anchor": ret += "anchorPoint";break;
				case "ADBE Vector Wiggler Position": ret += "position";break;
				case "ADBE Vector Wiggler Rotation": ret += "rotation";break;
				//-----------------------------
				case "ADBE Vector Filter - Zigzag": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Zigzag Size": ret += "size";break;
				case "ADBE Vector Zigzag Detail": ret += "ridgesPerSegment";break;
				case "ADBE Vector Zigzag Points": ret += "points";break;
				//-----------------------------
				case "ADBE Vector Graphic - G-Stroke": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Grad Start Pt": ret += "startPoint";break;
				case "ADBE Vector Grad End Pt": ret += "endPoint";break;
				case "ADBE Vector Stroke Opacity": ret += "opacity";break;
				case "ADBE Vector Stroke Width": ret += "strokeWidth";break;
				case "ADBE Vector Stroke Miter Limit": ret += "miterLimit";break;
				case "ADBE Vector Stroke Dashes": ret += "dash.";break;
				case "ADBE Vector Stroke Dash 1": ret += "dash";break;
				case "ADBE Vector Stroke Dash 2": ret += "dash";break;
				case "ADBE Vector Stroke Dash 3": ret += "dash";break;
				case "ADBE Vector Stroke Gap 1": ret += "gap";break;
				case "ADBE Vector Stroke Gap 2": ret += "gap";break;
				case "ADBE Vector Stroke Gap 3": ret += "gap";break;
				case "ADBE Vector Stroke Offset": ret += "offset";break;
				//-----------------------------
				case "ADBE Vector Graphic - G-Fill": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Fill Color": ret += "color";break;
				case "ADBE Vector Fill Opacity": ret += "opacity";break;
				//-----------------------------
				case "ADBE Vector Filter - Repeater": ret += "content(\"" + ary[i].name + "\").";break;
				case "ADBE Vector Repeater Copies": ret += "copies";break;
				case "ADBE Vector Repeater Offset": ret += "offset";break;
				case "ADBE Vector Repeater Transform": ret += "transform.";break;
				case "ADBE Vector Repeater Anchor": ret += "anchorPoint";break;
				case "ADBE Vector Repeater Position": ret += "position";break;
				case "ADBE Vector Repeater Scale": ret += "scale";break;
				case "ADBE Vector Repeater Rotation": ret += "rotation";break;
				case "ADBE Vector Repeater Opacity 1": ret += "startOpacity";break;
				case "ADBE Vector Repeater Opacity 2": ret += "endOpacity";break;
			}
		}
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	//Javascriptのコードに変換。
	/*
		aryはproPath()の返り値。
		o = new Object
		o.comp はターゲットのCompItem
		o.layerはターゲットのAVLayer
		o.propertyはターゲットのプロパティ
	*/
	function proPathToString(ary,o,op)
	{
		if ( !(ary instanceof Array) ) return "";
		if ( ary.length <=2) return "";
		
		var ret = "";
		var info = "";
		if (( o.comp.name == targetComp.name) && (o.layer.name == targetLayer.name) ){
			//ターゲットと同じならcomp/layerは省略
			ret = "";
		}else if ( o.comp.name == targetComp.name){
			//ターゲットとcompが同じならthisCompに
			ret = "thisComp.";
			//Layer名
			ret += "layer(\"" + ary[0].name +"\").";
		}else{
			if ( ( targetLayer.source instanceof CompItem)&&(targetLayer.name == o.comp.name) ) {
				//レイヤのソースがコンポでターゲットのコンポと同じ名前
				ret = "comp(name).";
			}else{
				ret = "comp(\"" + o.comp.name + "\").";
			}
			//Layer名
			ret += "layer(\"" + ary[0].name +"\").";
		}
		
		if ( (op!=null)&&(op==true)){
			info = "comp(\"" + o.comp.name + "\").layer(\"" + ary[0].name +"\"/*" +ary[0].matchName+ " index:" +ary[0].index+ "*/)."
		}
		var ret2 = "";
		if ( ary[1].matchName == "ADBE Transform Group") {
			switch(ary[2].matchName)
			{
				case "ADBE Anchor Point" :
					if ( ( ary[0] instanceof LightLayer)||( ary[0] instanceof CameraLayer)) {
						ret2 += "transform.pointOfInterest";
					}else{
						ret2 += "transform.anchorPoint";
					}
					break;
				case "ADBE Orientation" : ret2 += "transform.orientation";  break;
				case "ADBE Position" :
				case "ADBE Position_0" : 
				case "ADBE Position_1" :
				case "ADBE Position_2" : ret2 += "transform.position";  break;
				case "ADBE Scale" : ret2 += "transform.scale"; break;
				case "ADBE Rotate X" :
					if (( ary[0] instanceof LightLayer)||( ary[0] instanceof CameraLayer)||( ary[0].threeDLayer == true)){
						ret2 += "transform.xRotation";
					}else{
						ret2 += "transform.rotation";
					}
					break;
				case "ADBE Rotate Y" :
					if (( ary[0] instanceof LightLayer)||( ary[0] instanceof CameraLayer)||( ary[0].threeDLayer == true)){
						ret2 += "transform.yRotation";
					}else{
						ret2 += "transform.rotation";
					}
					break;
				case "ADBE Rotate Z" :
					if (( ary[0] instanceof LightLayer)||( ary[0] instanceof CameraLayer)||( ary[0].threeDLayer == true)){
						ret2 += "transform.zRotation";
					}else{
						ret2 += "transform.rotation";
					}
					break;
				case "ADBE Opacity" : ret2 += "transform.opacity";break;
			}
		}else if ( ary[1].matchName == "ADBE Effect Parade") {
			ret2 += "effect";
			for ( var i=2; i<ary.length; i++){
				if (( ary[i] instanceof PropertyGroup)||( ary[i] instanceof MaskPropertyGroup)){
					
					var canNameChange = (ary[i].propertyType == PropertyType.NAMED_GROUP);
					
					if (canNameChange ==true){
						ret2 += "(\"" + ary[i].name +"\")";
					}else{
						ret2 += "(\"" + ary[i].matchName +"\")";
					}
					
				}else if ( ary[i] instanceof Property){
					ret2 += "(\"" + ary[i].matchName +"\")";
				}
			}
		}else if ( ary[0].matchName == "ADBE Camera Layer") {
			switch(ary[2].matchName)
			{
				case "ADBE Camera Zoom": ret2 += "cameraOption.zoom";break;
				case "ADBE Camera Focus Distance": ret2 += "cameraOption.focusDistance";break;
				case "ADBE Camera Aperture": ret2 += "cameraOption.aperture";break;
				case "ADBE Camera Blur Level": ret2 += "cameraOption.blurLevel";break;
			}
		}else if ( ary[0].matchName == "ADBE Light Layer") {
			switch(ary[2].matchName)
			{
				case "ADBE Light Color": ret2 += "lightOption.color";break;
				case "ADBE Light Cone Angle": ret2 += "lightOption.coneFeather";break;
				case "ADBE Light Cone Feather 2": ret2 += "lightOption.coneFeather";break;
				case "ADBE Light Intensity": ret2 += "lightOption.intensity";break;
				case "ADBE Light Shadow Darkness": ret2 += "lightOption.shadowDarkness";break;
				case "ADBE Light Shadow Diffusion": ret2 += "lightOption.shadowDiffusion";break;
			}
		}else if ( ary[0].matchName == "ADBE Vector Layer") {
			ret2 += vectorToString(ary);
		}else if ( ary[0].matchName == "ADBE Text Layer") {
			ret2 += textLayerToString(ary);
		}
		ret += ret2 + ";";
		if ( (op!=null)&&(op==true)){
			ret +="\r\n " + info + ret2 + " /* \"" + ary[ary.length-1].name +"\"*/\r\n";
		}
		return ret;

	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	function getTarget()
	{
		var ret = new Object;
		ret.comp = null;
		ret.layer = null;
		ret.property = null;
		if ( (app.project.activeItem instanceof CompItem)==false) return ret;
		ret.comp = app.project.activeItem;
		
		if ( ret.comp.selectedLayers.length<=0) return ret;
		ret.layer = ret.comp.selectedLayers[0];
		
		
		if ( ret.layer.selectedProperties.length>0){
			for ( var i=0; i<ret.layer.selectedProperties.length; i++){
				if ( ret.layer.selectedProperties[i] instanceof Property){
					ret.property = ret.layer.selectedProperties[i];
					var p = proPath(ret.property);
					break;
				}
			}
		}
		
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "Expressionの編集　curry_eggsさんのエディタが完成するまで暫定版", [ 176,  232,  176+ 910,  232+ 489]);
	
	
	var statictext_AE1 = winObj.add("statictext", [  13,   16,   13+ 325,   16+  15], "プロパティボタンで選択した項目のアクセスコードを獲得");
	var statictext_AE2 = winObj.add("statictext", [ 653,   15,  653+ 244,   15+  15], "curry_eggsさんのエディタが完成するまで暫定版");
	var btnGetProperty = winObj.add("button", [   9,   33,    9+  74,   33+  38], "プロパティ");
	var edTargetProperty = winObj.add("edittext", [  91,   33,   91+ 806,   33+  38], "", {readonly:false, multiline:true});
	var lstLayer = winObj.add("dropdownlist", [   9,   82,    9+ 148,   82+  20], [ ]);
	var btnRef = winObj.add("button", [ 163,   80,  163+  45,   80+  23], "Re");
	var lstProp = winObj.add("listbox", [  10,  114,   10+ 199,  114+ 232], [ ]);
	var edProp = winObj.add("edittext", [ 215,   83,  215+ 682,   83+  19], "", {readonly:false, multiline:false});
	var stGetExp = winObj.add("statictext", [ 215,  118,  215+ 467,  118+  17], "statictext_AE1");
	var statictext_AE4 = winObj.add("statictext", [ 723,  118,  723+ 174,  118+  17], "改行は、Ctrl+Returnになります。");
	var edExp = winObj.add("edittext", [ 215,  138,  215+ 682,  138+ 294], "", {readonly:false, multiline:true});
	var edInfo = winObj.add("edittext", [  10,  352,   10+ 199,  352+ 126], "", {readonly:false, multiline:true});
	var btnDelExp = winObj.add("button", [ 217,  443,  217+ 132,  443+  33], "エクスプレッションを削除");
	var statictext_AE3 = winObj.add("statictext", [ 438,  443,  438+ 241,  443+  12], "ターゲットのエクスプレッションを獲得。まずここを押す");
	var btnGetExp = winObj.add("button", [ 440,  458,  440+ 239,  458+  23], "獲得");
	var btnOK = winObj.add("button", [ 720,  443,  720+  75,  443+  33], "適用");
	
	var btnCancelCap = "初期化";
	if ( isPanel == false ) {
		btnCancelCap = "閉じる";
	}
	var btnCancel = winObj.add("button", [ 801,  443,  801+  75,  443+  33], btnCancelCap);
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	var alertFntName = edInfo.graphics.font.name;
	var alertFntSize = edInfo.graphics.font.size;
	//フォントを大きく
	var fnt = edExp.graphics.font;
	edExp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.REGULAR, fnt.size * 1.3);

	stGetExp.text = "";
	btnOK.enabled = false;
	btnRef.enabled = false;
	statictext_AE4.enabled = statictext_AE4.visible = true;
	///////////////////////////////////////////////////////////////////////////////////////////////
	function alertMes(s,op)
	{
		edInfo.text = "";
		if ( (op==null)||(op==false)){
			edInfo.graphics.font = ScriptUI.newFont (alertFntName, ScriptUI.FontStyle.REGULAR, alertFntSize);
		}else{
			edInfo.graphics.font = ScriptUI.newFont (alertFntName, ScriptUI.FontStyle.BOLD, alertFntSize*1.5);
		}
		edInfo.text = s;
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	function selectedIndex(ctrl)
	{
		var ret = -1;
		if ( ctrl == null) return ret;
		if ( ctrl.items.length<=0)  return ret;
		for ( var i=0; i<ctrl.items.length; i++){
			if (ctrl.items[i].selected == true) {
				ret = i;
				break;
			}
		}
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	function buildLstLayer(cmp)
	{
		lstLayer.removeAll();
		lstLayer.add("item","listup Layers");
		lstLayer.add("item","listup CompItems");
		lstLayer.add("separator");
		for ( var i=0; i<eleList.length; i++){
			lstLayer.add("item",eleList[i]);
		}
	}
	buildLstLayer();
	///////////////////////////////////////////////////////////////////////////////////////////////
	function listupLayers()
	{
		eleListMode = 2;
		var t = getTarget();
		if ( t.comp == null) return;
		if ( t.comp.numLayers>0){
			for ( var i=1; i<=t.comp.numLayers; i++){
				var s = "layer(\"" + t.comp.layer(i).name + "\")";
				lstProp.add("item",s);
			}
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	function listupComps()
	{
		eleListMode = 3;
		if ( app.project.numItems>0) {
			for ( var i=1; i<=app.project.numItems; i++){
				if ( app.project.item(i) instanceof CompItem){
					var s = "comp(\"" + app.project.item(i).name + "\")";
					lstProp.add("item",s);
				}else if ( app.project.item(i) instanceof FootageItem){
					var s = "footage(\"" + app.project.item(i).name + "\")";
					lstProp.add("item",s);
				}
			}
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	lstLayer.onChange = function()
	{
		eleListIndex = -1;
		eleListMode = 0;
		var i = selectedIndex(lstLayer);
		lstProp.removeAll();
		var idx = i - 3;
		if ((idx>=0)&&(idx < eleSubList.length)){
			var lst = eleSubList[idx];
			eleListIndex = idx;
			if ( lst.length>0) {
				for ( var k=0; k<lst.length; k++){
					lstProp.add("item",lst[k]);
				}
			}
			eleListMode = 1;
			btnRef.enabled = false;
		} else if ( i==0) {
			eleListMode = 2;
			listupLayers();
			btnRef.enabled = true;
		} else if ( i==1) {
			eleListMode = 3;
			listupComps();
			btnRef.enabled = true;
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	btnRef.onClick = function()
	{
		switch(eleListMode)
		{
			case 2:lstProp.removeAll();listupLayers();break;
			case 3:lstProp.removeAll();listupComps();break;
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	lstProp.onChange = function()
	{
		edProp.text = "";
		var i = selectedIndex(lstProp);
		if (i>=0) {
			switch(eleListMode){
				case 1: if ( eleListIndex>=0) edProp.text = eleSubList[eleListIndex][i];break;
				case 2:
				case 3: edProp.text = lstProp.items[i]; break;
				case 0:
					break;
			}
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	function setMode(o)
	{
		if ((o ==null)||( o.property == null)||(o.property == undefined)){
			targetComp		= null;
			targetLayer		= null;
			targetProperty	= null;
			stGetExp.text	= "";
			btnOK.enabled	= false;
			btnGetProperty.enabled	= false;
			edTargetProperty.text = "";
			edExp.text = "";
			edExp.enabled = false;
			edInfo.text = "";
			edTargetProperty.text = "";
			edTargetProperty.enabled = false;
		}else{
			targetComp		= o.comp;
			targetLayer		= o.layer;
			targetProperty	= o.property;
			var s = "";
			s += o.comp.name;
			s += "/" + o.layer.name;
			s += "/" + o.property.name;
			stGetExp.text = s; 
			btnOK.enabled	= true;
			btnGetProperty.enabled	= true;
			edTargetProperty.text = "";
			edExp.enabled = true;
			edTargetProperty.enabled = true;
		}
	}
	setMode(null);
	///////////////////////////////////////////////////////////////////////////////////////////////
	btnGetExp.onClick = function()
	{
		setMode(null);
		var t = getTarget();
		if ( t.property != null){
			if ( t.property.canSetExpression == true) {
				setMode(t);
				if (targetProperty.expression == ""){
					var s = proPathToString(proPath(t.property),t,false);
					edExp.text = s;
				}else{
					edExp.text = targetProperty.expression;
				}
			}else{
				alertMes("なんかエクスプレッションにできないっす。",true);
			}
		}else{
			alertMes("なんかプロパティを選んでちょ！",true);
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	btnGetProperty.onClick = function()
	{
		var t = getTarget();
		if ( t.property != null){
			var s = proPathToString(proPath(t.property),t,true);
			edTargetProperty.text = s;
		}else{
			edTargetProperty.text = "";
			alertMes("なんかプロパティを選んでちょ！",true);
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	btnOK.onClick = function()
	{
		edInfo.text = "";
		var s = edExp.text;
		if ( s == "" ) return;
		if (targetProperty == null) return;
		var bak =  targetProperty.expression;
		var bakE = targetProperty.expressionEnabled;
		try{
			app.beginUndoGroup("エクスプレッションの編集");
			app.beginSuppressDialogs();
			targetProperty.expression = s;
			targetProperty.expressionEnabled = true;
			targetProperty.selected = true;
			setMode(null);
		}catch(e){
			var ss = targetProperty.expressionError;
			targetProperty.expression = bak;
			targetProperty.expressionEnabled = bakE;
			
			if ( ss != "") 
				alertMes(ss,false);
		}finally{
			app.endSuppressDialogs(false);
			app.endUndoGroup();
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	btnDelExp.onClick = function()
	{
		var t = getTarget();
		if ( t.property != null){
			if (t.property.expression != ""){
				app.beginUndoGroup("エクスプレッションの削除");
				t.property.expression = "";
				app.endUndoGroup();
			}
		}else{
			alertMes("なんかプロパティを選んでちょ！",true);
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	if ( isPanel == false){
		btnCancel.onClick = function() { winObj.close();}
		winObj.center();
		winObj.show();
	}else{
		btnCancel.onClick = function() { setMode(null);}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
})(this);
