import { type Channel, type InitialsOptions } from "../types";

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
  },
  {
    id: "kakoetoApi2",
    name: "Backup API",
    status: ChannelStatus.Idle,
    url: "https://kakoetoApi2.example.com",
  },
  {
    id: "kakoetoApi3",
    name: "WebSocket",
    status: ChannelStatus.Idle,
    url: "wss://kakoetoApi3.example.com",
  },
];

export const INITIALS_OPTIONS: InitialsOptions = {
  checkIntervalTime: 5000,
  retryIntervalTime: 30000,
};
