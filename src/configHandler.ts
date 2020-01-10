// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as vscode from "vscode";

export class ConfigHandler {
  static async update(
    key: string,
    value: {},
    target = vscode.ConfigurationTarget.Workspace
  ): Promise<void> {
    if (!key) {
      throw new Error("Key is empty.");
    }

    return await vscode.workspace
      .getConfiguration("IoTWorkbench")
      .update(key, value, target);
  }

  static get<T>(key: string): T | undefined {
    if (!key) {
      throw new Error("Key is empty.");
    }

    return vscode.workspace.getConfiguration("IoTWorkbench").get<T>(key);
  }
}
