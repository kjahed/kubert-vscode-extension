'use strict';

import * as path from 'path';
import * as os from 'os';
import { commands, window, workspace, ExtensionContext, Uri, ProgressLocation } from 'vscode';

export function activate(context: ExtensionContext) {
    let launcher = os.platform() === 'win32' ? 'Kubert.bat' : 'Kubert';
    let script = context.asAbsolutePath(path.join('src', 'kubert', 'bin', launcher));

    context.subscriptions.push(commands.registerCommand("kubert.gen", async () => {
        let activeEditor = window.activeTextEditor;
        if (activeEditor && activeEditor.document && activeEditor.document.languageId === 'rt') {
            let inputFile = activeEditor.document.uri.toString().substring(7);
            
            let outputdir = workspace.getConfiguration("kubert").get("outputdir") != "" 
                ? workspace.getConfiguration("kubert").get("outputdir")
                : path.join(path.dirname(inputFile), path.basename(inputFile) + ".kubert");

            let namespace = workspace.getConfiguration("kubert").get("namespace") != ""
                ? "-n " + workspace.getConfiguration("kubert").get("namespace")
                : "";

            let appname = workspace.getConfiguration("kubert").get("appname") != ""
                ? "-a " + workspace.getConfiguration("kubert").get("appname")
                : "";

            let repo = workspace.getConfiguration("kubert").get("repo") != ""
                ? "-r " + workspace.getConfiguration("kubert").get("repo")
                : "";

            let image = workspace.getConfiguration("kubert").get("image") != ""
                ? "-i " + workspace.getConfiguration("kubert").get("image")
                : "";

            let args = workspace.getConfiguration("kubert").get("args") != "" 
                ? "-- " + workspace.getConfiguration("kubert").get("args")
                : "";
            
            let debug = workspace.getConfiguration("kubert").get("debug") ? " -d" : "";
            
            let codegen = path.join(context.extensionPath, "src", "kubert", "codegen");

            let command = script + debug + " -t" 
                + " -g " + codegen
                + " -o " + outputdir
                + " " + namespace
                + " " + appname
                + " " + repo
                + " " + image
                + " " + inputFile
                + " " + args
                + " && cd " + outputdir

            const terminal = window.createTerminal("KubeRT");
            terminal.sendText(command);
            terminal.show();
        }
    }));
}