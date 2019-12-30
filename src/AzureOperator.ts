// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {TelemetryContext} from './telemetry';
import {constructAndLoadIoTProject} from './utils';
import {RemoteExtension} from './Models/RemoteExtension';

export class AzureOperator {
  async provision(
      context: vscode.ExtensionContext, channel: vscode.OutputChannel,
      telemetryContext: TelemetryContext) {
    const iotProject =
        await constructAndLoadIoTProject(context, channel, telemetryContext);
    if (!iotProject) {
      return;
    }
    const status = await iotProject.provision();
    if (status) {
      vscode.window.showInformationMessage('Azure provision succeeded.');
    }
  }

  async deploy(
      context: vscode.ExtensionContext, channel: vscode.OutputChannel,
      telemetryContext: TelemetryContext) {
    // Azure deploy command can be executed only in local environment
    RemoteExtension.ensureLocalBeforeRunCommand(context);

    const iotProject =
        await constructAndLoadIoTProject(context, channel, telemetryContext);
    if (iotProject) {
      await iotProject.deploy();
    }
  }
}
