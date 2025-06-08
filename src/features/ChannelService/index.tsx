import { ChannelInfo } from "./components/ChannelInfo";
import { CHANNELS } from "./constants";
import { useConnectionManager } from "./helpers";

export const ChannelService = () => {
  const { channels, currentChannel, error } = useConnectionManager(CHANNELS);

  if (error) {
    return <div>Произошла ошибка: {error}</div>;
  }

  return (
    <div>
      <h1>Полезная информация</h1>
      <section>
        <h2>Информация о всех каналах</h2>
        <ul>
          {channels.map((item) => (
            <li key={item.id}>
              <ChannelInfo info={item} />
            </li>
          ))}
        </ul>
      </section>
      {currentChannel && (
        <section>
          <h2>Информация о текущем канале</h2>
          <ChannelInfo info={currentChannel} />
        </section>
      )}
    </div>
  );
};
