import type { ChannelStatus } from "../constants";

export type Channel = {
  id: string;
  name: string;
  status: ChannelStatus;
  url: string;
  lastChecked?: number;
};

export type Options = {
  checkIntervalTime: number;
  retryIntervalTime: number;
  onStatusChange: (channels: Channel[]) => void;
  onError: (message: string) => void;
};
export type InitialsOptions = Pick<
  Options,
  "checkIntervalTime" | "retryIntervalTime"
>;
