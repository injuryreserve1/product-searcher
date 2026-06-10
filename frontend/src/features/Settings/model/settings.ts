export interface IUserSettings {
  baseUrl: string;
  modelName: string;
  apiKey: string;
}

export interface Settings {
  settings: IUserSettings;
}
