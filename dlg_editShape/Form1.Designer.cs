namespace dlg_editShape
{
	partial class Form1
	{
		/// <summary>
		/// 必要なデザイナー変数です。
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// 使用中のリソースをすべてクリーンアップします。
		/// </summary>
		/// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows フォーム デザイナーで生成されたコード

		/// <summary>
		/// デザイナー サポートに必要なメソッドです。このメソッドの内容を
		/// コード エディターで変更しないでください。
		/// </summary>
		private void InitializeComponent()
		{
			this.components = new System.ComponentModel.Container();
			this.ae_window1 = new bryful_due.Ae_window();
			this.button_AE1 = new bryful_due.Button_AE();
			this.button_AE2 = new bryful_due.Button_AE();
			this.gp = new bryful_due.Group_AE();
			this.edOutPoint1 = new bryful_due.Edittext_AE();
			this.edInPoint1 = new bryful_due.Edittext_AE();
			this.edPoint1 = new bryful_due.Edittext_AE();
			this.radiobutton_AE1 = new bryful_due.Radiobutton_AE();
			this.scrolV = new bryful_due.ScrollbarV_AE();
			this.edittext_AE2 = new bryful_due.Edittext_AE();
			this.button_AE3 = new bryful_due.Button_AE();
			this.btnDelCurve = new bryful_due.Button_AE();
			this.button_AE5 = new bryful_due.Button_AE();
			this.btnAddPoint = new bryful_due.Button_AE();
			this.btnRemove = new bryful_due.Button_AE();
			this.btnCloseShape = new bryful_due.Button_AE();
			this.button_AE4 = new bryful_due.Button_AE();
			this.edittext_AE1 = new bryful_due.Edittext_AE();
			this.btnClear = new bryful_due.Button_AE();
			this.gp.SuspendLayout();
			this.SuspendLayout();
			// 
			// ae_window1
			// 
			this.ae_window1.AE_Form = this;
			this.ae_window1.AE_funcName = "myDialog";
			this.ae_window1.AE_isCenter = true;
			this.ae_window1.AE_isExportPict = true;
			this.ae_window1.AE_isInFunc = true;
			this.ae_window1.AE_isLocal = true;
			this.ae_window1.AE_maximizeButton = true;
			this.ae_window1.AE_minimizeButton = true;
			this.ae_window1.AE_objName = "winObj";
			this.ae_window1.AE_resizeable = true;
			this.ae_window1.AE_size = new System.Drawing.Size(474, 453);
			this.ae_window1.AE_title = "Shape Edit";
			this.ae_window1.AE_windowType = bryful_due.windowType.floatingPalette;
			// 
			// button_AE1
			// 
			this.button_AE1.AE_bounds = new System.Drawing.Rectangle(13, 13, 449, 30);
			this.button_AE1.AE_defaultElement = bryful_due.defaultElement.none;
			this.button_AE1.AE_isLocal = true;
			this.button_AE1.AE_objName = "btnGetShape";
			this.button_AE1.AE_text = "get Shape";
			this.button_AE1.AE_textObjName = "";
			this.button_AE1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.button_AE1.Location = new System.Drawing.Point(13, 13);
			this.button_AE1.Name = "button_AE1";
			this.button_AE1.Size = new System.Drawing.Size(449, 30);
			this.button_AE1.TabIndex = 0;
			this.button_AE1.Text = "get Shape";
			this.button_AE1.UseVisualStyleBackColor = true;
			// 
			// button_AE2
			// 
			this.button_AE2.AE_bounds = new System.Drawing.Rectangle(16, 119, 197, 30);
			this.button_AE2.AE_defaultElement = bryful_due.defaultElement.none;
			this.button_AE2.AE_isLocal = true;
			this.button_AE2.AE_objName = "btnApllyhape";
			this.button_AE2.AE_text = "Apply Shape";
			this.button_AE2.AE_textObjName = "";
			this.button_AE2.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.button_AE2.Location = new System.Drawing.Point(16, 119);
			this.button_AE2.Name = "button_AE2";
			this.button_AE2.Size = new System.Drawing.Size(197, 30);
			this.button_AE2.TabIndex = 9;
			this.button_AE2.Text = "Apply Shape";
			this.button_AE2.UseVisualStyleBackColor = true;
			// 
			// gp
			// 
			this.gp.AE_bounds = new System.Drawing.Rectangle(16, 155, 449, 286);
			this.gp.AE_isLocal = true;
			this.gp.AE_objName = "gp";
			this.gp.Controls.Add(this.edOutPoint1);
			this.gp.Controls.Add(this.edInPoint1);
			this.gp.Controls.Add(this.edPoint1);
			this.gp.Controls.Add(this.radiobutton_AE1);
			this.gp.Controls.Add(this.scrolV);
			this.gp.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.gp.Location = new System.Drawing.Point(16, 155);
			this.gp.Name = "gp";
			this.gp.Size = new System.Drawing.Size(449, 286);
			this.gp.TabIndex = 12;
			// 
			// edOutPoint1
			// 
			this.edOutPoint1.AE_borderless = false;
			this.edOutPoint1.AE_bounds = new System.Drawing.Rectangle(309, 6, 120, 21);
			this.edOutPoint1.AE_isLocal = true;
			this.edOutPoint1.AE_multiline = false;
			this.edOutPoint1.AE_noecho = false;
			this.edOutPoint1.AE_objName = "edOutPoint1";
			this.edOutPoint1.AE_readonly = false;
			this.edOutPoint1.AE_scrollable = false;
			this.edOutPoint1.AE_text = new string[] {
        "[000.000]"};
			this.edOutPoint1.AE_textObjName = "";
			this.edOutPoint1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edOutPoint1.Location = new System.Drawing.Point(309, 6);
			this.edOutPoint1.Name = "edOutPoint1";
			this.edOutPoint1.Size = new System.Drawing.Size(120, 21);
			this.edOutPoint1.TabIndex = 4;
			this.edOutPoint1.Text = "[000.000]";
			// 
			// edInPoint1
			// 
			this.edInPoint1.AE_borderless = false;
			this.edInPoint1.AE_bounds = new System.Drawing.Rectangle(187, 6, 120, 21);
			this.edInPoint1.AE_isLocal = true;
			this.edInPoint1.AE_multiline = false;
			this.edInPoint1.AE_noecho = false;
			this.edInPoint1.AE_objName = "edInPoint1";
			this.edInPoint1.AE_readonly = false;
			this.edInPoint1.AE_scrollable = false;
			this.edInPoint1.AE_text = new string[] {
        "[000.000]"};
			this.edInPoint1.AE_textObjName = "";
			this.edInPoint1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edInPoint1.Location = new System.Drawing.Point(187, 6);
			this.edInPoint1.Name = "edInPoint1";
			this.edInPoint1.Size = new System.Drawing.Size(120, 21);
			this.edInPoint1.TabIndex = 3;
			this.edInPoint1.Text = "[000.000]";
			// 
			// edPoint1
			// 
			this.edPoint1.AE_borderless = false;
			this.edPoint1.AE_bounds = new System.Drawing.Rectangle(61, 6, 120, 21);
			this.edPoint1.AE_isLocal = true;
			this.edPoint1.AE_multiline = false;
			this.edPoint1.AE_noecho = false;
			this.edPoint1.AE_objName = "edPoint1";
			this.edPoint1.AE_readonly = false;
			this.edPoint1.AE_scrollable = false;
			this.edPoint1.AE_text = new string[] {
        "[000.000]"};
			this.edPoint1.AE_textObjName = "";
			this.edPoint1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edPoint1.Location = new System.Drawing.Point(61, 6);
			this.edPoint1.Name = "edPoint1";
			this.edPoint1.Size = new System.Drawing.Size(120, 21);
			this.edPoint1.TabIndex = 2;
			this.edPoint1.Text = "[000.000]";
			// 
			// radiobutton_AE1
			// 
			this.radiobutton_AE1.AE_bounds = new System.Drawing.Rectangle(9, 6, 52, 24);
			this.radiobutton_AE1.AE_isLocal = true;
			this.radiobutton_AE1.AE_objName = "rb";
			this.radiobutton_AE1.AE_text = "01";
			this.radiobutton_AE1.AE_textObjName = "";
			this.radiobutton_AE1.AE_value = false;
			this.radiobutton_AE1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.radiobutton_AE1.Location = new System.Drawing.Point(9, 6);
			this.radiobutton_AE1.Name = "radiobutton_AE1";
			this.radiobutton_AE1.Size = new System.Drawing.Size(52, 24);
			this.radiobutton_AE1.TabIndex = 1;
			this.radiobutton_AE1.TabStop = true;
			this.radiobutton_AE1.Text = "01";
			this.radiobutton_AE1.UseVisualStyleBackColor = true;
			// 
			// scrolV
			// 
			this.scrolV.AE_bounds = new System.Drawing.Rectangle(435, 0, 17, 275);
			this.scrolV.AE_isLocal = true;
			this.scrolV.AE_maxvalue = 100;
			this.scrolV.AE_minvalue = 0;
			this.scrolV.AE_objName = "scrolV";
			this.scrolV.AE_value = 0;
			this.scrolV.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.scrolV.Location = new System.Drawing.Point(435, 0);
			this.scrolV.Name = "scrolV";
			this.scrolV.Size = new System.Drawing.Size(17, 275);
			this.scrolV.TabIndex = 0;
			// 
			// edittext_AE2
			// 
			this.edittext_AE2.AE_borderless = false;
			this.edittext_AE2.AE_bounds = new System.Drawing.Rectangle(22, 52, 73, 21);
			this.edittext_AE2.AE_isLocal = true;
			this.edittext_AE2.AE_multiline = false;
			this.edittext_AE2.AE_noecho = false;
			this.edittext_AE2.AE_objName = "edAdd";
			this.edittext_AE2.AE_readonly = false;
			this.edittext_AE2.AE_scrollable = false;
			this.edittext_AE2.AE_text = new string[] {
        "[0,0]"};
			this.edittext_AE2.AE_textObjName = "";
			this.edittext_AE2.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edittext_AE2.Location = new System.Drawing.Point(22, 52);
			this.edittext_AE2.Name = "edittext_AE2";
			this.edittext_AE2.Size = new System.Drawing.Size(73, 21);
			this.edittext_AE2.TabIndex = 1;
			this.edittext_AE2.Text = "[0,0]";
			// 
			// button_AE3
			// 
			this.button_AE3.AE_bounds = new System.Drawing.Rectangle(101, 52, 75, 23);
			this.button_AE3.AE_defaultElement = bryful_due.defaultElement.none;
			this.button_AE3.AE_isLocal = true;
			this.button_AE3.AE_objName = "btnSetAdd";
			this.button_AE3.AE_text = "PosAdd";
			this.button_AE3.AE_textObjName = "";
			this.button_AE3.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.button_AE3.Location = new System.Drawing.Point(101, 52);
			this.button_AE3.Name = "button_AE3";
			this.button_AE3.Size = new System.Drawing.Size(75, 23);
			this.button_AE3.TabIndex = 2;
			this.button_AE3.Text = "PosAdd";
			this.button_AE3.UseVisualStyleBackColor = true;
			// 
			// btnDelCurve
			// 
			this.btnDelCurve.AE_bounds = new System.Drawing.Rectangle(16, 81, 90, 23);
			this.btnDelCurve.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnDelCurve.AE_isLocal = true;
			this.btnDelCurve.AE_objName = "btnDelCurve";
			this.btnDelCurve.AE_text = "カーブの削除";
			this.btnDelCurve.AE_textObjName = "";
			this.btnDelCurve.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnDelCurve.Location = new System.Drawing.Point(16, 81);
			this.btnDelCurve.Name = "btnDelCurve";
			this.btnDelCurve.Size = new System.Drawing.Size(90, 23);
			this.btnDelCurve.TabIndex = 5;
			this.btnDelCurve.Text = "カーブの削除";
			this.btnDelCurve.UseVisualStyleBackColor = true;
			// 
			// button_AE5
			// 
			this.button_AE5.AE_bounds = new System.Drawing.Rectangle(262, 119, 85, 30);
			this.button_AE5.AE_defaultElement = bryful_due.defaultElement.none;
			this.button_AE5.AE_isLocal = true;
			this.button_AE5.AE_objName = "btnUndo";
			this.button_AE5.AE_text = "復帰";
			this.button_AE5.AE_textObjName = "";
			this.button_AE5.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.button_AE5.Location = new System.Drawing.Point(262, 119);
			this.button_AE5.Name = "button_AE5";
			this.button_AE5.Size = new System.Drawing.Size(85, 30);
			this.button_AE5.TabIndex = 10;
			this.button_AE5.Text = "復帰";
			this.button_AE5.UseVisualStyleBackColor = true;
			// 
			// btnAddPoint
			// 
			this.btnAddPoint.AE_bounds = new System.Drawing.Rectangle(112, 81, 90, 23);
			this.btnAddPoint.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnAddPoint.AE_isLocal = true;
			this.btnAddPoint.AE_objName = "btnAddPoint";
			this.btnAddPoint.AE_text = "ポイントの追加";
			this.btnAddPoint.AE_textObjName = "";
			this.btnAddPoint.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnAddPoint.Location = new System.Drawing.Point(112, 81);
			this.btnAddPoint.Name = "btnAddPoint";
			this.btnAddPoint.Size = new System.Drawing.Size(90, 23);
			this.btnAddPoint.TabIndex = 6;
			this.btnAddPoint.Text = "ポイントの追加";
			this.btnAddPoint.UseVisualStyleBackColor = true;
			// 
			// btnRemove
			// 
			this.btnRemove.AE_bounds = new System.Drawing.Rectangle(208, 81, 90, 23);
			this.btnRemove.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnRemove.AE_isLocal = true;
			this.btnRemove.AE_objName = "btnPointRemove";
			this.btnRemove.AE_text = "ポイントの削除";
			this.btnRemove.AE_textObjName = "";
			this.btnRemove.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnRemove.Location = new System.Drawing.Point(208, 81);
			this.btnRemove.Name = "btnRemove";
			this.btnRemove.Size = new System.Drawing.Size(90, 23);
			this.btnRemove.TabIndex = 7;
			this.btnRemove.Text = "ポイントの削除";
			this.btnRemove.UseVisualStyleBackColor = true;
			// 
			// btnCloseShape
			// 
			this.btnCloseShape.AE_bounds = new System.Drawing.Rectangle(367, 81, 90, 23);
			this.btnCloseShape.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnCloseShape.AE_isLocal = true;
			this.btnCloseShape.AE_objName = "btnCloseShape";
			this.btnCloseShape.AE_text = "close設定";
			this.btnCloseShape.AE_textObjName = "";
			this.btnCloseShape.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnCloseShape.Location = new System.Drawing.Point(367, 81);
			this.btnCloseShape.Name = "btnCloseShape";
			this.btnCloseShape.Size = new System.Drawing.Size(90, 23);
			this.btnCloseShape.TabIndex = 8;
			this.btnCloseShape.Text = "close設定";
			this.btnCloseShape.UseVisualStyleBackColor = true;
			// 
			// button_AE4
			// 
			this.button_AE4.AE_bounds = new System.Drawing.Rectangle(272, 52, 75, 23);
			this.button_AE4.AE_defaultElement = bryful_due.defaultElement.none;
			this.button_AE4.AE_isLocal = true;
			this.button_AE4.AE_objName = "btnSetScale";
			this.button_AE4.AE_text = "PosScale";
			this.button_AE4.AE_textObjName = "";
			this.button_AE4.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.button_AE4.Location = new System.Drawing.Point(272, 52);
			this.button_AE4.Name = "button_AE4";
			this.button_AE4.Size = new System.Drawing.Size(75, 23);
			this.button_AE4.TabIndex = 4;
			this.button_AE4.Text = "PosScale";
			this.button_AE4.UseVisualStyleBackColor = true;
			// 
			// edittext_AE1
			// 
			this.edittext_AE1.AE_borderless = false;
			this.edittext_AE1.AE_bounds = new System.Drawing.Rectangle(193, 52, 73, 21);
			this.edittext_AE1.AE_isLocal = true;
			this.edittext_AE1.AE_multiline = false;
			this.edittext_AE1.AE_noecho = false;
			this.edittext_AE1.AE_objName = "edScale";
			this.edittext_AE1.AE_readonly = false;
			this.edittext_AE1.AE_scrollable = false;
			this.edittext_AE1.AE_text = new string[] {
        "[1,1]"};
			this.edittext_AE1.AE_textObjName = "";
			this.edittext_AE1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edittext_AE1.Location = new System.Drawing.Point(193, 52);
			this.edittext_AE1.Name = "edittext_AE1";
			this.edittext_AE1.Size = new System.Drawing.Size(73, 21);
			this.edittext_AE1.TabIndex = 3;
			this.edittext_AE1.Text = "[1,1]";
			// 
			// btnClear
			// 
			this.btnClear.AE_bounds = new System.Drawing.Rectangle(360, 119, 85, 30);
			this.btnClear.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnClear.AE_isLocal = true;
			this.btnClear.AE_objName = "btnClear";
			this.btnClear.AE_text = "Clear";
			this.btnClear.AE_textObjName = "";
			this.btnClear.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnClear.Location = new System.Drawing.Point(360, 119);
			this.btnClear.Name = "btnClear";
			this.btnClear.Size = new System.Drawing.Size(85, 30);
			this.btnClear.TabIndex = 11;
			this.btnClear.Text = "Clear";
			this.btnClear.UseVisualStyleBackColor = true;
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(474, 453);
			this.Controls.Add(this.btnClear);
			this.Controls.Add(this.button_AE4);
			this.Controls.Add(this.edittext_AE1);
			this.Controls.Add(this.btnCloseShape);
			this.Controls.Add(this.btnRemove);
			this.Controls.Add(this.btnAddPoint);
			this.Controls.Add(this.button_AE5);
			this.Controls.Add(this.btnDelCurve);
			this.Controls.Add(this.button_AE3);
			this.Controls.Add(this.edittext_AE2);
			this.Controls.Add(this.gp);
			this.Controls.Add(this.button_AE2);
			this.Controls.Add(this.button_AE1);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
			this.Name = "Form1";
			this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
			this.Text = "Shape Edit";
			this.gp.ResumeLayout(false);
			this.gp.PerformLayout();
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private bryful_due.Ae_window ae_window1;
		private bryful_due.Button_AE btnRemove;
		private bryful_due.Button_AE btnAddPoint;
		private bryful_due.Button_AE button_AE5;
		private bryful_due.Button_AE btnDelCurve;
		private bryful_due.Button_AE button_AE3;
		private bryful_due.Edittext_AE edittext_AE2;
		private bryful_due.Group_AE gp;
		private bryful_due.Edittext_AE edOutPoint1;
		private bryful_due.Edittext_AE edInPoint1;
		private bryful_due.Edittext_AE edPoint1;
		private bryful_due.Radiobutton_AE radiobutton_AE1;
		private bryful_due.ScrollbarV_AE scrolV;
		private bryful_due.Button_AE button_AE2;
		private bryful_due.Button_AE button_AE1;
		private bryful_due.Button_AE btnCloseShape;
		private bryful_due.Button_AE button_AE4;
		private bryful_due.Edittext_AE edittext_AE1;
		private bryful_due.Button_AE btnClear;
	}
}

