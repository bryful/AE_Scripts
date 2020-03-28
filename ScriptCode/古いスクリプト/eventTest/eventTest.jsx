//----------------------------------------------------------------
function dispEvent(e,cap)
{
	var ret = "";
	if ((e == null)||(e ==undefined)) return ret;
	var isK = (e instanceof KeyboardEvent);
	var isM = (e instanceof MouseEvent);
	if ( (isK==false)&&(isM==false)){
		return ret;
	}
	if ((cap != null)&&(cap!="")) ret += "[" + cap + "] "
	if ( isK==true) ret += "Keyboad Event\n";
	else ret += "Mouse Event\n";
	ret += "type : " + e.type +"\n";
	ret += "(target : " + e.target.toString() +")";
	ret += "/(view : " + e.view.toString() +")";
	ret += "/(eventPhase : " + e.eventPhase+")\n";
	ret += "(bubbles : " + e.bubbles +")";
	ret += "/(cancelable : " +e.cancelable +")";
	ret += "/(currentTarget : " + e.currentTarget.toString() +")\n";
	
	
	ret += "timeStamp : " + e.timeStamp.getMilliseconds() +"ms\n";
	ret += "(altKey : " + e.altKey +")";
	ret += "/(ctrlKey : " + e.ctrlKey +")";
	ret += "/(metaKey : " + e.metaKey +")";
	ret += "/(shiftKey : " + e.shiftKey +")\n";

	if (isK==true)
	{
		ret += "keyIdentifier : [" + e.keyIdentifier +"] ";
		ret += "/ keyName : [" + e.keyName + "]\n";
		ret += "keyLocation : ";
		ret += e.keyLocation +"\n";
	}
	if ( isM == true){
		ret += "(button : " + e.button + ")";
		ret += "/(detail : " + e.detail +")\n";
		ret += "(clientX / x:" + e.clientX + "y:" +e.clientY + "),";
		ret += "(screenX / x:" + e.screenX + "y:" +e.screenY + ")\n";
		//ret += "relatedTarget : " + e.relatedTarget.toString() +"\n";
		
	}
	return ret;
}
//----------------------------------------------------------------

var eventTestWin	= new Window("palette","event Test",[0,0,300,300]);

var pnl		= eventTestWin.add("panel",[10,10,280,100],"Test");
var ed1		= pnl.add("edittext",[10,10,250,35],"ed1");
var btn1	= pnl.add("button",  [10,45,250,70],"btn1");

var btn2	= eventTestWin.add("button",  [20,105,260,130],"btn2");
var ed2		= eventTestWin.add("edittext",[20,135,260,160],"ed2");

function eventchkW(e){debugConsole.disp(dispEvent(e,"eventTestWin"));}
function eventchkP(e){debugConsole.disp(dispEvent(e,"pnl"));}
function eventchkE1(e){debugConsole.disp(dispEvent(e,"ed1"));}
function eventchkE2(e){debugConsole.disp(dispEvent(e,"ed2"));}
function eventchkB1(e){debugConsole.disp(dispEvent(e,"btn1"));}
function eventchkB2(e){debugConsole.disp(dispEvent(e,"btn2"));}


eventTestWin.addEventListener("keydown",eventchkW);
pnl.addEventListener("keydown",eventchkP);
ed1.addEventListener("keydown",eventchkE1);
ed2.addEventListener("keydown",eventchkE2);
btn1.addEventListener("keydown",eventchkB1);
btn2.addEventListener("keydown",eventchkB2);

eventTestWin.addEventListener("mousedown",eventchkW);
pnl.addEventListener("mousedown",eventchkP);
ed1.addEventListener("mousedown",eventchkE1);
ed2.addEventListener("mousedown",eventchkE2);
btn1.addEventListener("mousedown",eventchkB1);
btn2.addEventListener("mousedown",eventchkB2);


eventTestWin.center();
eventTestWin.show();
