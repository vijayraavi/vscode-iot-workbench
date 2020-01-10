// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as iothub from 'azure-iothub';
import { Guid } from 'guid-typescript';
import * as vscode from 'vscode';

import { ConfigHandler } from '../configHandler';
import { ConfigKey, ScaffoldType } from '../constants';

import { getExtension } from './Apis';
import { ComponentInfo, DependencyConfig } from './AzureComponentConfig';
import { ExtensionName } from './Interfaces/Api';
import { Component, ComponentType } from './Interfaces/Component';
import { Provisionable } from './Interfaces/Provisionable';

async function getDeviceNumber(iotHubConnectionString: string): Promise<number> {
  return new Promise(
    (resolve: (value: number) => void, reject: (error: Error) => void) => {
      const registry: iothub.Registry =
            iothub.Registry.fromConnectionString(iotHubConnectionString);
      registry.list((err, list) => {
        if (err) {
          return reject(err);
        }
        if (!list) {
          return resolve(0);
        } else {
          return resolve(list.length);
        }
      });
    });
}

async function getProvisionIothubDeviceSelection(iotHubConnectionString: string): Promise<vscode.QuickPickItem[]> {
  let provisionIothubDeviceSelection: vscode.QuickPickItem[];

  const deviceNumber = await getDeviceNumber(iotHubConnectionString);
  if (deviceNumber > 0) {
    provisionIothubDeviceSelection = [
      {
        label: 'Select an existing IoT Hub device',
        description: 'Select an existing IoT Hub device',
        detail: 'select'
      },
      {
        label: 'Create a new IoT Hub device',
        description: 'Create a new IoT Hub device',
        detail: 'create'
      }
    ];
  } else {
    provisionIothubDeviceSelection = [{
      label: 'Create a new IoT Hub device',
      description: 'Create a new IoT Hub device',
      detail: 'create'
    }];
  }
  return provisionIothubDeviceSelection;
}

export class IoTHubDevice implements Component, Provisionable {
  private componentType: ComponentType;
  private channel: vscode.OutputChannel;
  private componentId: string;
  get id(): string {
    return this.componentId;
  }

  dependencies: DependencyConfig[] = [];

  constructor(channel: vscode.OutputChannel) {
    this.componentType = ComponentType.IoTHubDevice;
    this.channel = channel;
    this.componentId = Guid.create().toString();
  }

  name = 'IoT Hub Device';

  getComponentType(): ComponentType {
    return this.componentType;
  }

  async checkPrerequisites(): Promise<boolean> {
    return true;
  }

  async load(): Promise<boolean> {
    return true;
  }

  async create(): Promise<void> {
    // Do nothing.
  }

  async provision(): Promise<boolean> {
    const iotHubConnectionString =
        ConfigHandler.get<string>(ConfigKey.iotHubConnectionString);
    if (!iotHubConnectionString) {
      throw new Error(
        'Unable to find IoT Hub connection in the project. Please retry Azure Provision.');
    }

    const selection = await vscode.window.showQuickPick(
      getProvisionIothubDeviceSelection(iotHubConnectionString),
      { ignoreFocusOut: true, placeHolder: 'Provision IoTHub Device' });

    if (!selection) {
      return false;
    }

    const toolkit = getExtension(ExtensionName.Toolkit);
    if (!toolkit) {
      throw new Error(
        'Azure IoT Hub Toolkit is not installed. Please install it from Marketplace.');
    }

    let device = null;
    switch (selection.detail) {
    case 'select':
      device = await toolkit.azureIoTExplorer.getDevice(
        null, iotHubConnectionString, this.channel);
      if (!device) {
        return false;
      } else {
        await ConfigHandler.update(
          ConfigKey.iotHubDeviceConnectionString, device.connectionString);
      }
      break;

    case 'create':
      device = await toolkit.azureIoTExplorer.createDevice(
        false, iotHubConnectionString, this.channel);
      if (!device) {
        return false;
      } else {
        await ConfigHandler.update(
          ConfigKey.iotHubDeviceConnectionString, device.connectionString);
      }
      break;
    default:
      break;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateConfigSettings(_type: ScaffoldType, _componentInfo?: ComponentInfo): void {
    // Do nothing.
  }
}
