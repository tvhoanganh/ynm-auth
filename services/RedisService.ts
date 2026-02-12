import { createClient, type RedisClientType } from "redis";
import { injectable } from "tsyringe";

@injectable()
export class RedisService {
  private client: RedisClientType;
  private connecting?: Promise<RedisClientType>;

  constructor() {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error("REDIS_URL is not configured");
    }

    this.client = createClient({ url });
    this.client.on("error", (error) => {
      console.error("Redis error:", error);
    });
  }

  private async ensureConnected(): Promise<void> {
    if (this.client.isOpen) {
      return;
    }

    if (!this.connecting) {
      this.connecting = this.client.connect();
    }

    await this.connecting;
  }

  async get(key: string): Promise<string | null> {
    await this.ensureConnected();
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    await this.ensureConnected();

    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, { EX: ttlSeconds });
      return;
    }

    await this.client.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.ensureConnected();
    await this.client.del(key);
  }
}
