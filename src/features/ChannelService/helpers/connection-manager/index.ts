import { TestChannels } from "../test-channels";
import { type Channel, type Options } from "../../types";
import { ChannelStatus } from "../../constants";
import type { Intervals } from "./types";

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
    } else if (this.intervals?.retryInterval) {
      clearInterval(this.intervals.retryInterval);
    }

    this.intervals = null;
  }

  private async checkChannel(channel: Channel): Promise<void> {
    try {
      const isAlive = await this.testChannels.test(channel);
      const newStatus = isAlive
        ? ChannelStatus.Connected
        : ChannelStatus.Unavailable;
      const isCurrentConnectionAlive =
        channel.id === this.currentChannel!.id && !isAlive;

      this.updateChannelStatus(channel.id, newStatus);

      if (isCurrentConnectionAlive) {
        this.switchChannel();
      }
    } catch {
      this.updateChannelStatus(channel.id, ChannelStatus.Unavailable);

      if (channel.id === this.currentChannel!.id) {
        this.switchChannel();
      }
    }
  }

  private switchChannel(): void {
    const availableChannel = this.channels.find(
      (channel) => channel.status === ChannelStatus.Idle,
    );

    if (availableChannel) {
      this.currentChannel = availableChannel;
      this.updateChannelStatus(availableChannel.id, ChannelStatus.Connected);
    } else {
      this.currentChannel = null;
      this.options.onError("All communication channels are unavailable");
    }
  }

  private async retryUnavailableChannels(): Promise<void> {
    const unavailableChannels = this.channels.filter(
      (item) => item.status === ChannelStatus.Unavailable,
    );

    const checkedChannels = unavailableChannels.map(async (item) => {
      const isAlive = await this.testChannels.test(item);

      if (isAlive) {
        return this.updateChannelStatus(item.id, ChannelStatus.Idle);
      }
    });

    await Promise.all(checkedChannels);
  }

  private updateChannelStatus(
    channelId: Channel["id"],
    status: ChannelStatus,
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
