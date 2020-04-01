namespace js_AE_RemapExceed
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
            this.stCaption = new bryful_due.Statictext_AE();
            this.btnGetClip = new bryful_due.Button_AE();
            this.lbCells = new bryful_due.Listbox_AE();
            this.btnApply = new bryful_due.Button_AE();
            this.edINfo = new bryful_due.Edittext_AE();
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
            this.ae_window1.AE_size = new System.Drawing.Size(243, 188);
            this.ae_window1.AE_title = "AE_RemapExceed";
            this.ae_window1.AE_windowType = bryful_due.windowType.floatingPalette;
            // 
            // stCaption
            // 
            this.stCaption.AE_bounds = new System.Drawing.Rectangle(12, 20, 219, 17);
            this.stCaption.AE_isLocal = true;
            this.stCaption.AE_multiline = false;
            this.stCaption.AE_objName = "stCaption";
            this.stCaption.AE_scrolling = false;
            this.stCaption.AE_text = "AE_Remap Exceed";
            this.stCaption.AE_textObjName = "";
            this.stCaption.Font = new System.Drawing.Font("Tahoma", 8.25F);
            this.stCaption.Location = new System.Drawing.Point(12, 20);
            this.stCaption.Name = "stCaption";
            this.stCaption.Size = new System.Drawing.Size(219, 17);
            this.stCaption.TabIndex = 0;
            this.stCaption.Text = "AE_Remap Exceed";
            // 
            // btnGetClip
            // 
            this.btnGetClip.AE_bounds = new System.Drawing.Rectangle(15, 40, 74, 23);
            this.btnGetClip.AE_defaultElement = bryful_due.defaultElement.none;
            this.btnGetClip.AE_isLocal = true;
            this.btnGetClip.AE_objName = "btnGetClip";
            this.btnGetClip.AE_text = "獲得";
            this.btnGetClip.AE_textObjName = "";
            this.btnGetClip.Font = new System.Drawing.Font("Tahoma", 8.25F);
            this.btnGetClip.Location = new System.Drawing.Point(15, 40);
            this.btnGetClip.Name = "btnGetClip";
            this.btnGetClip.Size = new System.Drawing.Size(74, 23);
            this.btnGetClip.TabIndex = 1;
            this.btnGetClip.Text = "獲得";
            this.btnGetClip.UseVisualStyleBackColor = true;
            // 
            // lbCells
            // 
            this.lbCells.AE_bounds = new System.Drawing.Rectangle(95, 66, 136, 108);
            this.lbCells.AE_columnTitles = new string[] {
        null};
            this.lbCells.AE_columnWidths = new int[] {
        0};
            this.lbCells.AE_isLocal = true;
            this.lbCells.AE_itemsName = "cellItem";
            this.lbCells.AE_multiselect = false;
            this.lbCells.AE_numberOfColumns = 1;
            this.lbCells.AE_objName = "lbCells";
            this.lbCells.AE_showHeaders = false;
            this.lbCells.Font = new System.Drawing.Font("Tahoma", 8.25F);
            this.lbCells.FormattingEnabled = true;
            this.lbCells.Location = new System.Drawing.Point(95, 66);
            this.lbCells.Name = "lbCells";
            this.lbCells.Size = new System.Drawing.Size(136, 108);
            this.lbCells.TabIndex = 2;
            // 
            // btnApply
            // 
            this.btnApply.AE_bounds = new System.Drawing.Rectangle(15, 69, 74, 23);
            this.btnApply.AE_defaultElement = bryful_due.defaultElement.none;
            this.btnApply.AE_isLocal = true;
            this.btnApply.AE_objName = "btnApply";
            this.btnApply.AE_text = "適応";
            this.btnApply.AE_textObjName = "";
            this.btnApply.Font = new System.Drawing.Font("Tahoma", 8.25F);
            this.btnApply.Location = new System.Drawing.Point(15, 69);
            this.btnApply.Name = "btnApply";
            this.btnApply.Size = new System.Drawing.Size(74, 23);
            this.btnApply.TabIndex = 3;
            this.btnApply.Text = "適応";
            this.btnApply.UseVisualStyleBackColor = true;
            // 
            // edINfo
            // 
            this.edINfo.AE_borderless = false;
            this.edINfo.AE_bounds = new System.Drawing.Rectangle(96, 40, 135, 21);
            this.edINfo.AE_isLocal = true;
            this.edINfo.AE_multiline = false;
            this.edINfo.AE_noecho = false;
            this.edINfo.AE_objName = "edINfo";
            this.edINfo.AE_readonly = true;
            this.edINfo.AE_scrollable = false;
            this.edINfo.AE_text = new string[0];
            this.edINfo.AE_textObjName = "";
            this.edINfo.Font = new System.Drawing.Font("Tahoma", 8.25F);
            this.edINfo.Location = new System.Drawing.Point(96, 40);
            this.edINfo.Name = "edINfo";
            this.edINfo.ReadOnly = true;
            this.edINfo.Size = new System.Drawing.Size(135, 21);
            this.edINfo.TabIndex = 5;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(243, 188);
            this.Controls.Add(this.edINfo);
            this.Controls.Add(this.btnApply);
            this.Controls.Add(this.lbCells);
            this.Controls.Add(this.btnGetClip);
            this.Controls.Add(this.stCaption);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "AE_RemapExceed";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private bryful_due.Ae_window ae_window1;
        private bryful_due.Button_AE btnGetClip;
        private bryful_due.Statictext_AE stCaption;
        private bryful_due.Listbox_AE lbCells;
        private bryful_due.Button_AE btnApply;
        private bryful_due.Edittext_AE edINfo;
    }
}

