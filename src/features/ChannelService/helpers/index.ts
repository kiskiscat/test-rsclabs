import { useEffect, useState } from "react";
import { type Channel } from "../types";
import { ConnectionManager } from "./connection-manager";
import { ChannelStatus, INITIALS_OPTIONS } from "../constants";

export const useConnectionManager = (initialChannels: Channel[]) => {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onStatusChange = (updatedChannels: Channel[]): void => {
    const newCurrentChannel = updatedChannels.find(
      (item) => item.status === ChannelStatus.Connected
    );
    const updatedCurrentChannel = newCurrentChannel ?? null;

    setChannels(updatedChannels);
    setCurrentChannel(updatedCurrentChannel);
  };

  const onError = (message: string): void => {
    setError(message);
  };

  useEffect(() => {
    const manager = new ConnectionManager(initialChannels, {
      ...INITIALS_OPTIONS,
      onStatusChange,
      onError,
    });

    manager.start();

    return () => {
      manager.stop();
    };
  }, [initialChannels]);

  return { channels, currentChannel, error };
};
