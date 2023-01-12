import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export class SecretManager {
  // Not sure how to init this as a readonly
  private static _PRIVATE_KEY: string;
  private static _PUBLIC_KEY: string;

  private static GCLOUD_PROJECT = process.env.GCLOUD_PROJECT;
  private static client = new SecretManagerServiceClient();

  public static get PRIVATE_KEY(): string {
    return this._PRIVATE_KEY;
  }

  public static get PUBLIC_KEY(): string {
    return this._PUBLIC_KEY;
  }

  public static async init() {
    await Promise.all([
      (this._PRIVATE_KEY = await this.getSecret("PRIVATE_KEY")),
      (this._PUBLIC_KEY = await this.getSecret("PUBLIC_KEY")),
    ]);
  }

  private static async getSecret(key: string) {
    if (!this.GCLOUD_PROJECT) {
      const value = process.env[key];
      if (!value) {
        throw new Error(`Unable to access ${key} via dotenv.`);
      }

      return value;
    }

    const buildSecretName = (secretName: string) => {
      return `projects/${this.GCLOUD_PROJECT}/secrets/${secretName}/versions/latest`;
    };

    try {
      const [secret] = await this.client.accessSecretVersion({
        name: buildSecretName(key),
      });

      const value = secret.payload?.data?.toString();
      if (!value) {
        throw new Error(`Unable to access ${key} via Secret Manager.`);
      }

      return value;
    } catch (error) {
      throw new Error(`'${this.GCLOUD_PROJECT}' cannot be accessed.`);
    }
  }
}
