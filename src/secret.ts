import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export class SecretManager {
  // Not sure how to init this as a readonly
  public static PRIVATE_KEY: string;
  public static PUBLIC_KEY: string;

  private static GCLOUD_PROJECT = process.env.GCLOUD_PROJECT;
  private static client = new SecretManagerServiceClient();

  public static async init() {
    await Promise.all([
      (this.PRIVATE_KEY = await this.getSecret("PRIVATE_KEY")),
      (this.PUBLIC_KEY = await this.getSecret("PUBLIC_KEY")),
    ]);
  }

  private static async getSecret(key: string) {
    if (this.GCLOUD_PROJECT) {
      const buildSecretName = (secretName: string) => {
        return `projects/${this.GCLOUD_PROJECT}/secrets/${secretName}/versions/latest`;
      };

      const [secret] = await this.client.accessSecretVersion({
        name: buildSecretName(key),
      });

      const value = secret.payload?.data?.toString();
      if (!value) {
        throw new Error(`Unable to access ${key} via Secret Manager.`);
      }
      return value;
    } else {
      const value = process.env[key];
      if (!value) {
        throw new Error(`Unable to access ${key} via dotenv.`);
      }

      return value;
    }
  }
}
