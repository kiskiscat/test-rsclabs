import type { Channel } from "../../types";
import { ProtocolPrefix } from "./constants";

export class TestChannels {
  public async test(channel: Channel): Promise<boolean> {
    if (channel.url.startsWith(ProtocolPrefix.Http)) {
      return this.testHttpPrefixChannel(channel);
    } else if (channel.url.startsWith(ProtocolPrefix.Ws)) {
      return this.testWsPrefixChannel(channel);
    }

    return false;
  }

  private async testHttpPrefixChannel(channel: Channel): Promise<boolean> {
    try {
      const response = await fetch(channel.url, { method: "HEAD" });

      return response.ok;
    } catch {
      return false;
    }
  }

  private async testWsPrefixChannel(channel: Channel): Promise<boolean> {
    return new Promise((resolve) => {
      const ws = new WebSocket(channel.url);

      const timeout = setTimeout(() => {
        ws.close();

        resolve(false);
      }, 2000);

      ws.onopen = () => {
        clearTimeout(timeout);
        ws.close();

        resolve(true);
      };

      ws.onerror = () => {
        clearTimeout(timeout);
      };
    });
  }
}
