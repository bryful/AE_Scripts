(function (me){
  var cmdTbl=[
    "プロジェクト",
    "文字",
    "整列",
    "段落",
    "レンダーキュー",
    "エフェクトコントロール: (なし)",
    "エフェクト＆プリセット",
    "ツール",
    "スムーザー",
    "プレビュー",
    "ペイント",
    "ブラシ",
    "情報",
    "CC ライブラリ",
    "Lumetri スコープ",
    "ウィグラー",
    "エッセンシャルグラフィックス",
    "コンテンツに応じた塗りつぶし",
    "トラッカー",
    "マスク補間",
    "メタデータ",
    "メディアブラウザー",
    "モーションスケッチ",
    "学習",
    "進行状況"
    ];
  var btnList = [];
// **************************************************************************
//var winObj = (me instanceof Panel)? me : new Window('palette{text:,orientation : "column", properties : {minimumSize:[250,50],resizeable : true,preferredSize:[250,50]} }');
var winObj = ( me instanceof Panel) ? me : new Window("palette", "ウィンドウ管理", [ 0,  0, 210, 275]  ,{resizeable:true});
winObj.preferredSize = [210, 11*25];
winObj.spacing = [0,0,0,0];
var btnReload = winObj.add("button",[0,0,30,275],"Re");
var scrollbar = winObj.add("scrollbar",[180,25,210,275],0,0,100);//,{stepdelta:50,jumpdelta:40}

scrollbar.stepdelta = 100;
scrollbar.jumpdelta = 70;
btnReload.onClick= rebuild;
////alert(scrollbar.stepdelta+"\r\n"+scrollbar.jumpdelta);
// **************************************************************************
var  addButton = function(cmd,b)
{
  var id = app.findMenuCommandId(cmd);
  if(id==0) return false;

  try{
    var btn = winObj.add("button",b,cmd);
    //btn.bounds=b;
    //btn.alignment =  ["fill", "top" ];
    //btn.justify = "left";
    btn.cmdID  = id;

    btn.onClick = function()
    {
      app.executeCommand(this.cmdID);
      //alert(this.cmdID);
    }
    btnList.push(btn);
  }catch(e){
    alert(e.toString());
  }
  return true;
}
// **************************************************************************
var scrolSet = function()
{
  resize();
}
scrollbar.onChange = scrolSet;
scrollbar.onChanging = scrolSet;

// **************************************************************************
var  buildButton = function()
{

  var b = [30,0,180,25];
  for (var i=0; i<cmdTbl.length;i++)
  {
    if (addButton(cmdTbl[i],b)==true)
    {
      b[0] = 30;
      b[2] = 180;
      b[1] += 25;
      b[3] += 25;
    }
  }
  var sp = new Folder(Folder.startup.fullName+"/Scripts/ScriptUI Panels");
  if (sp.exists==true)
  {
    var fl = sp.getFiles("*.jsx");
    if (fl.length>0)
    {
      for (var i=0; i<fl.length;i++)
      {
        if (addButton(File.decode(fl[i].name),b)==true)
        {
          b[0] = 30;
          b[2] = 180;
          b[1] += 25;
          b[3] += 25;
        }
      }
    }
  }
}
buildButton();
// **************************************************************************
 var resize = function()
{
  try{
    var b = winObj.bounds;
    var w = b[2] - b[0];
    var h = b[3] - b[1];
    var bs = scrollbar.bounds;
    var sb = btnList.length*25 - (bs[3]-bs[1]);
    bs[0] = w-30;
    bs[1] = 0;
    bs[2] = w;
    bs[3] = h;
    scrollbar.bounds = bs;

    if(sb<=0)
    {
      scrollbar.value = 0;
      scrollbar.minvalue = 0;
      scrollbar.maxvalue = 0;
    }else{
      scrollbar.minvalue = 0;
      scrollbar.maxvalue = sb;
    }
    var ll = scrollbar.value;
    var br = btnReload.bounds;
    br[0] = 0;
    br[1] = 0;
    br[2] = 30;
    br[3] = h;
    btnReload.bounds = br;

    for (var i=0; i<btnList.length;i++)
    {
      var bn = btnList[i].bounds;
      bn[1] = -ll + i*25;
      bn[3] = bn[1] + 25;
      bn[0] = 30;
      bn[2] = w-30;
      btnList[i].bounds = bn;
    }

  }catch(e){
    alert(e.toString());
  }

}
resize();
winObj.onResize = resize;
// **************************************************************************
var rebuild = function()
{
  if (winObj.children.length>0)
  {
    for ( var i= winObj.children.length-1 ;i>=0; i--)
    {
      if (winObj.children[i] instanceof Button)
      {
      winObj.remove(i);
      }
    }

  }
  btnList = [];
  buildButton();
  resize();
}
// **************************************************************************
// **************************************************************************
if(winObj instanceof Window ) {
  winObj.center();
  winObj.show();
}
// **************************************************************************
})(this);
