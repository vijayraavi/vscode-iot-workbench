// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class ConfigKey {
  // Keys for condifurations in User / Workspace settings
  static readonly workbench = "workbench";
  static readonly devicePath = "DevicePath";
  static readonly functionPath = "FunctionPath";
  static readonly iotHubConnectionString = "iothubConnectionString";
  static readonly iotHubDeviceConnectionString = "iothubDeviceConnectionString";
  static readonly eventHubConnectionString = "eventHubConnectionString";
  static readonly eventHubConnectionPath = "eventHubConnectionPath";
  static readonly functionAppId = "functionAppId";
  static readonly boardId = "BoardId";
  static readonly codeGeneratorVersion = "IoTPnPCodeGenVersion";
  static readonly asaPath = "StreamAnalyticsPath";

  // Keys for configurations in iot workbench project config file
  static readonly projectHostType = "ProjectHostType";
  static readonly workbenchVersion = "version";

  // Keys for configurations in global state
  static readonly hasPopUp = "hasPopUp";
}

export class EventNames {
  static readonly createNewProjectEvent = "IoTWorkbench.NewProject";
  static readonly configProjectEnvironmentEvent =
    "IoTWorkbench.ConfigProjectEnvironment";
  static readonly azureProvisionEvent = "IoTWorkbench.AzureProvision";
  static readonly azureDeployEvent = "IoTWorkbench.AzureDeploy";
  static readonly createAzureFunctionsEvent =
    "IoTWorkbench.CreateAzureFunctions";
  static readonly deviceCompileEvent = "IoTWorkbench.DeviceCompile";
  static readonly deviceUploadEvent = "IoTWorkbench.DeviceUpload";
  static readonly devicePackageEvent = "IoTWorkbench.DevicePackage";
  static readonly configDeviceSettingsEvent =
    "IoTWorkbench.ConfigDeviceSettingsEvent";
  static readonly openExamplePageEvent = "IoTWorkbench.OpenExamplePage";
  static readonly loadExampleEvent = "IoTWorkbench.loadExample";
  static readonly detectBoard = "IoTWorkbench.DetectBoard";
  static readonly generateOtaCrc = "IoTWorkbench.GenerateOtaCrc";
  static readonly nsatsurvery = "IoTWorkbench.NSATSurvey";
  static readonly selectSubscription = "IoTWorkbench.SelectSubscription";
  static readonly openTutorial = "IoTWorkbench.OpenTutorial";
  static readonly projectLoadEvent = "IoTWorkbench.ProjectLoadEvent";
  static readonly scaffoldDeviceStubEvent = "IoTWorkbench.ScaffoldDeviceStub";
  static readonly help = "IoTWorkbench.Help";
  static readonly setProjectDefaultPath = "IoTWorkbench.SetDefaultPath";
}

export class FileNames {
  static readonly templateFileName = "templates.json";
  static readonly boardListFileName = "boardlist.json";
  static readonly platformListFileName = "platformlist.json";
  static readonly resourcesFolderName = "resources";
  static readonly iotWorkbenchProjectFileName = ".iotworkbenchproject";
  static readonly cmakeFileName = "CMakeLists.txt";
  static readonly settingsJsonFileName = "settings.json";
  static readonly codeGenOptionsFileName = "codeGenOptions.json";
  static readonly configDeviceOptionsFileName = "configDeviceOptions.json";
  static readonly devcontainerFolderName = ".devcontainer";
  static readonly vscodeSettingsFolderName = ".vscode";
  static readonly workspaceConfigFilePath = "project.code-workspace";
  static readonly iotworkbenchTempFolder = ".iotworkbenchtemp";
  static readonly workspaceExtensionName = ".code-workspace";
  static readonly cacheFolderName = "cache";
  static readonly outputPathName = "cmake";
  static readonly templatesFolderName = "templates";
  static readonly templateFiles = "templatefiles.json";
  static readonly installPackagesFileName = "install_packages.sh";
}

export enum OperationType {
  Compile = "Device code compilation",
  Upload = "Device code upload"
}

export enum AzureFunctionsLanguage {
  CSharpScript = "C#Script",
  JavaScript = "JavaScript",
  CSharpLibrary = "C#"
}

export enum ScaffoldType {
  Local = "local",
  Workspace = "workspace"
}

export class AzureComponentsStorage {
  static readonly folderName = ".azurecomponent";
  static readonly fileName = "azureconfig.json";
}

export class DependentExtensions {
  static readonly azureFunctions = "ms-azuretools.vscode-azurefunctions";
  static readonly arduino = "vsciot-vscode.vscode-arduino";
  static readonly remote = "ms-vscode-remote.vscode-remote-extensionpack";
}

export enum PlatformType {
  Arduino = "Arduino",
  EmbeddedLinux = "Embedded Linux (Preview)",
  Unknown = "Unknown"
}

export enum DevelopEnvironment {
  RemoteEnv = "in remote environment",
  LocalEnv = "in local environment"
}

export enum TemplateTag {
  General = "general",
  DevelopmentEnvironment = "development_container"
}

export enum OSPlatform {
  WIN32 = "win32",
  LINUX = "linux",
  DARWIN = "darwin"
}
