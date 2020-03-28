using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Windows.Forms;

namespace aeclip
{
    class Program
    {
        enum CLIP
        {
            NONE = 0,
            COPY,
            PASTE,
            OUTPUT,
            HELP

        }
        static void Usage()
        {
            string mes = "aeclip.exe \r\n"
                + "\t aeclip [/c] filename (copy to clipboard.)\r\n"
                + "\t aeclip [/p] (from clipboard to STD default)\r\n"
                + "\t aeclip [/o] filename (from clipboard to file)\r\n"
                + "\t aeclip  /h or /? (help)\r\n";

            Console.Write(mes);
        }
        static CLIP OptionArgs(string[] args)
        {
            CLIP ret = CLIP.NONE;
            if (args.Length <= 0) return CLIP.PASTE;
            //option
            foreach (string c in args)
            {
                string s = c.Trim();
                if (s.Length >= 2) {
                    if ((s[0] == '/') || (s[0] == '-'))
                    {
                        s = s.ToLower();
                        switch (s[1])
                        {
                            case 'c':
                                ret = CLIP.COPY;
                                break;
                            case 'p':
                                ret = CLIP.PASTE;
                                break;
                            case 'o':
                                ret = CLIP.OUTPUT;
                                break;
                            case '?':
                            case 'h':
                                ret = CLIP.HELP;
                                break;
                        }
                    }
                }
                if (ret != CLIP.NONE) break;
             }


            return ret;
        }
        static string FileArgs(string[] args,CLIP mode)
        {
            string ret = "";
            if (args.Length <= 0) return ret;
            //file
            foreach (string c in args)
            {
                if ((mode == CLIP.COPY)|| (mode == CLIP.NONE))
                {
                    if (File.Exists(c) == true)
                    {
                        ret = c;
                        break;
                    }
                }else
                {
                    if ((c[0]!='/') && (c[0] != '-'))
                    {
                        ret = c;
                        break;
                    }
                }
            }
            return ret;
        }
        [STAThread]
        static void Main(string[] args)
        {
            //Console.WriteLine("Hello World!");
            CLIP mode = OptionArgs(args);
            string p = FileArgs(args,mode);
            if ((mode == CLIP.NONE) && (p != ""))
            {
                mode = CLIP.COPY;
            }else if ((mode == CLIP.COPY) && (p == ""))
            {
                mode = CLIP.HELP;
            }
            else if ((mode == CLIP.OUTPUT) && (p == ""))
            {
                mode = CLIP.HELP;
            }
            switch (mode)
            {
                case CLIP.NONE:
                case CLIP.HELP:
                    Usage();
                    break;
                case CLIP.COPY:
                    string str = File.ReadAllText(p, Encoding.GetEncoding("utf-8"));
                    Clipboard.SetText(str);
                    break;
                case CLIP.PASTE:
                    if (Clipboard.ContainsText() == true)
                    {
                        string s = Clipboard.GetText();
                        Console.WriteLine(s);

                    }
                    break;
                case CLIP.OUTPUT:
                    if (Clipboard.ContainsText() == true)
                    {
                        string s = Clipboard.GetText();
                        File.WriteAllText(p, s, Encoding.GetEncoding("utf-8"));
                    }
                    break;
            }
            
        }
    }
}

