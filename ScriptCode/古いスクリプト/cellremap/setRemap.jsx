({
	duration: $duration,
	inPoint:$inPoint,
	outPoint:$outPoint,
	remap:$remap,
	err:"",
	errCell:false,
	setRemap:function(lyr)
	{
		if ( lyr.canSetTimeRemapEnabled == false) return false;
		if (this.remap.length<=0) return false;
		var rp = lyr.property("ADBE Time Remapping");
		if (rp.numKeys>0) for ( var i=rp.numKeys; i>=1;i--) rp.removeKey(i);
		var du = rp.maxValue;
		lyr.timeRemapEnabled = true;
		if (rp.numKeys>0) for ( var i=rp.numKeys; i>1;i--) rp.removeKey(i);
		for (var i=0; i<this.remap.length;i++){
			var t = this.remap[i][0];
			var v = this.remap[i][1];
			if ( v<du) {
				if (v<0) v = du;
				rp.setValueAtTime(t,v);
			}else{
				this.errCell = true;
			}
		}
		for (var i=1 ; i<=rp.numKeys ; i++) rp.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);

		var bd = lyr.property("ADBE Effect Parade").property("ADBE Block Dissolve");
		if ( bd == null)bd = lyr.property("ADBE Effect Parade").addProperty("ADBE Block Dissolve");
		bdp = bd.property("ADBE Block Dissolve-0001");
		if (bdp.numKeys>0) for ( var i=bdp.numKeys; i>=1;i--) bdp.removeKey(i);
		var v2 = 0;
		for (var i=0; i<this.remap.length;i++){
			var t = this.remap[i][0];
			var v = this.remap[i][1];
			if (v<0) v = 100;else v=0;
			if ( i==0){
				bdp.setValueAtTime(t,v);
			}else if ( v2 != v ){
				bdp.setValueAtTime(t,v);
			}
			v2 = v;
		}
		for (var i=1 ; i<=bdp.numKeys ; i++) bdp.setInterpolationTypeAtKey(i,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);

		if (this.inPoint != null) lyr.inPoint = this.inPoint;
		if (this.outPoint != null) lyr.outPoint = this.outPoint;

		return true;
	},
	exec:function()
	{
		var cnt = 0;
		if (app.project.activeItem instanceof CompItem){
			if ( app.project.activeItem.selectedLayers.length>0){
				if (this.duration != null) if ( app.project.activeItem.duration != this.duration)  app.project.activeItem.duration = this.duration;
				for ( var i=0; i<app.project.activeItem.selectedLayers.length;i++){
					if (this.setRemap(app.project.activeItem.selectedLayers[i]) ==false){
						this.err += "! " + app.project.activeItem.selectedLayers[i].name +" is not remaped!\r\n";
					}else{
						cnt++;
					}
				}
			}else{
				this.err += "no selected Layer!\r\n";
			}
		}else{
			this.err += "no actived CompItem!\r\n";
		}
		if ( (this.err =="")&&(cnt==0) ) this.err = "no Target!\r\n";
		if ( this.errCell === true) this.err = "miss!\r\n";
		if (this.err !=""){
			alert(this.err);
		}
	}
}).exec();
