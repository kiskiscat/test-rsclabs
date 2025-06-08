import { type Channel, type InitialOptions } from "../types";

export const CHANNEL_MAX_PRIORITY = 100;
export enum ChannelStatus {
  Idle = "IDLE",
  Connected = "CONNECTED",
  Unavailable = "UNAVAILABLE",
}
export const CHANNELS: Channel[] = [
  {
    id: "kakoetoApi1",
    name: "Main API",
    status: ChannelStatus.Idle,
    url: "https://kakoetoApi1.example.com",
    priority: CHANNEL_MAX_PRIORITY,
    errorCount: 0,
  },
  {
    id: "kakoetoApi2",
    name: "Backup API",
    status: ChannelStatus.Idle,
    url: "https://kakoetoApi2.example.com",
    priority: CHANNEL_MAX_PRIORITY,
    errorCount: 0,
  },
  {
    id: "kakoetoApi3",
    name: "WebSocket API",
    status: ChannelStatus.Idle,
    url: "wss://kakoetoApi3.example.com",
    priority: CHANNEL_MAX_PRIORITY,
    errorCount: 0,
  },
  {
    id: "kakoetoApi4",
    name: "JSON Placeholder",
    status: ChannelStatus.Idle,
    url: "https://jsonplaceholder.typicode.com/",
    priority: CHANNEL_MAX_PRIORITY,
    errorCount: 0,
  },
];

export const INITIAL_OPTIONS: InitialOptions = {
  checkIntervalTime: 5000,
  retryIntervalTime: 20000,
};
