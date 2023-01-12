import "dotenv/config";
import { SecretManager } from "./secret";

function printSecrets() {
  console.log({
    priv: SecretManager.PRIVATE_KEY,
    pub: SecretManager.PUBLIC_KEY,
  });
}

(async () => {
  printSecrets();
  await SecretManager.init();
  printSecrets();
})();
