import type { ChannelStatus } from "../constants";

export type Channel = {
  id: string;
  name: string;
  status: ChannelStatus;
  url: string;
  lastChecked?: number;
  priority: number;
  errorCount: number;
};

export type Options = {
  checkIntervalTime: number;
  retryIntervalTime: number;
  onStatusChange: (channels: Channel[]) => void;
  onError: (message: string) => void;
};
export type InitialOptions = Pick<
  Options,
  "checkIntervalTime" | "retryIntervalTime"
>;
