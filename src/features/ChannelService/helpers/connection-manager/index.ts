import { TestChannels } from "../test-channels";
import { type Channel, type Options } from "../../types";
import { CHANNEL_MAX_PRIORITY, ChannelStatus } from "../../constants";
import type { Intervals, UpdateInfo } from "./types";

export class ConnectionManager {
  private channels: Channel[];
  private readonly options: Options;

  private currentChannel: Channel | null = null;
  private intervals: Intervals | null = null;
  private readonly testChannels = new TestChannels();

  constructor(channels: Channel[], options: Options) {
    this.channels = channels;
    this.options = options;
  }

  public start(): void {
    if (!this.currentChannel) {
      this.switchChannel();
    }

    const checkInterval = setInterval(() => {
      if (this.currentChannel) {
        this.checkChannel(this.currentChannel);
      }
    }, this.options.checkIntervalTime);

    const retryInterval = setInterval(() => {
      this.retryUnavailableChannels();
    }, this.options.retryIntervalTime);

    this.intervals = { checkInterval, retryInterval };
  }

  public stop(): void {
    if (this.intervals?.checkInterval) {
      clearInterval(this.intervals.checkInterval);
    }
    if (this.intervals?.retryInterval) {
      clearInterval(this.intervals.retryInterval);
    }

    this.intervals = null;
  }

  private async checkChannel(channel: Channel): Promise<void> {
    try {
      const isAlive = await this.testChannels.test(channel);
      const status = isAlive
        ? ChannelStatus.Connected
        : ChannelStatus.Unavailable;
      const errorCount = isAlive ? 0 : channel.errorCount + 1;

      const info: UpdateInfo = {
        status,
        errorCount,
      };

      this.updateChannel(channel.id, info);

      const isCurrentConnectionAlive =
        channel.id === this.currentChannel!.id && !isAlive;

      if (isCurrentConnectionAlive) {
        this.switchChannel();
      }
    } catch {
      const info: UpdateInfo = {
        status: ChannelStatus.Unavailable,
        errorCount: channel.errorCount + 1,
      };

      this.updateChannel(channel.id, info);

      if (channel.id === this.currentChannel!.id) {
        this.switchChannel();
      }
    }
  }

  private calculatePriority(
    errorCount: Channel["errorCount"],
  ): Channel["priority"] {
    return Math.max(0, CHANNEL_MAX_PRIORITY - errorCount * 10);
  }

  private getAvailableChannel = (): Channel | null => {
    const filteredChannels = this.channels.filter(
      (item) => item.status === ChannelStatus.Idle,
    );
    const updatedChannels = filteredChannels.map((item): Channel => {
      const priority = this.calculatePriority(item.errorCount);

      return {
        ...item,
        priority,
      };
    });

    updatedChannels.sort((a, b) => b.priority - a.priority);

    const availableChannels = updatedChannels.filter(
      (item) => item.priority !== 0,
    );
    const topPriorityChannel = availableChannels.at(0);
    const result = topPriorityChannel ?? null;

    return result;
  };

  private switchChannel(): void {
    const availableChannel = this.getAvailableChannel();

    if (availableChannel) {
      this.currentChannel = availableChannel;
      this.updateChannelStatus(availableChannel.id, ChannelStatus.Connected);
    } else {
      this.currentChannel = null;
      this.options.onError("No available channels");
    }
  }

  private async retryUnavailableChannels(): Promise<void> {
    const unavailableChannels = this.channels.filter(
      (item) => item.status === ChannelStatus.Unavailable,
    );

    const checkedChannels = unavailableChannels.map(async (item) => {
      const isAlive = await this.testChannels.test(item);

      if (isAlive) {
        const info: UpdateInfo = {
          status: ChannelStatus.Idle,
          errorCount: 0,
        };

        this.updateChannel(item.id, info);
      }
    });

    await Promise.all(checkedChannels);
  }

  private updateChannel(channelId: Channel["id"], info: UpdateInfo): void {
    const updatedChannels = this.channels.map((item) => {
      if (item.id === channelId) {
        const lastChecked = Date.now();

        return { ...item, ...info, lastChecked };
      }

      return item;
    });

    this.channels = updatedChannels;
    this.options.onStatusChange(this.channels);
  }

  private updateChannelStatus(
    channelId: Channel["id"],
    status: Channel["status"],
  ): void {
    const updatedChannels = this.channels.map((item): Channel => {
      if (item.id === channelId) {
        const lastChecked = Date.now();

        return { ...item, status, lastChecked };
      }

      return item;
    });

    this.channels = updatedChannels;
    this.options.onStatusChange(this.channels);
  }
}
