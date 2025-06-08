import type { Channel } from "../../types";

export type Props = {
  info: Channel;
};

export const ChannelInfo = ({ info }: Props) => (
  <div>
    <p>
      <span>Имя:</span>
      <span>{info.name}</span>
    </p>
    <p>
      <span>ID:</span>
      <span>{info.id}</span>
    </p>
    <p>
      <span>Последнее время использования:</span>
      <span>{info.status}</span>
    </p>
    <p>
      <span>URL:</span>
      <span>{info.url}</span>
    </p>
    {info.lastChecked && (
      <p>
        <span>Последнее время использования:</span>
        <span>{info.lastChecked}</span>
      </p>
    )}
  </div>
);
