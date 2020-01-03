'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

export class WorkbenchExtension {
  // tslint:disable-next-line: no-any
  private static extension: vscode.Extension<any>|undefined;

  static getExtension(context: vscode.ExtensionContext):
      // tslint:disable-next-line: no-any
      vscode.Extension<any>|undefined {
    if (!WorkbenchExtension.extension) {
      const extensionId = WorkbenchExtension.getExtensionId(context);
      WorkbenchExtension.extension =
          vscode.extensions.getExtension(extensionId);
    }
    return WorkbenchExtension.extension;
  }

  private static getExtensionId(context: vscode.ExtensionContext): string {
    // Get extensionId from package.json
    const packageJsonPath = context.asAbsolutePath('./package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const extensionId = packageJson.publisher + '.' + packageJson.name;
    return extensionId;
  }
}