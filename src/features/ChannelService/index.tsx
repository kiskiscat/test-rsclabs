import { ChannelInfo } from "./components/ChannelInfo";
import { CHANNELS } from "./constants";
import { useConnectionManager } from "./helpers";

export const ChannelService = () => {
  const { channels, currentChannel, errorMessage } =
    useConnectionManager(CHANNELS);

  if (errorMessage) {
    return <div>Произошла ошибка: {errorMessage}</div>;
  }

  return (
    <article role="main">
      <h1>Полезная информация</h1>
      <section aria-labelledby="all-channels-heading">
        <h2 id="all-channels-heading">Информация о всех каналах</h2>
        <ul>
          {channels.map((item) => (
            <li key={item.id}>
              <ChannelInfo info={item} />
            </li>
          ))}
        </ul>
      </section>
      {currentChannel && (
        <section aria-labelledby="current-channels-heading">
          <h2 id="current-channels-heading">Информация о текущем канале</h2>
          <ChannelInfo info={currentChannel} />
        </section>
      )}
    </article>
  );
};
