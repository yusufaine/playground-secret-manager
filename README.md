# Google Secret Manager Test

## Requirements

1. Ensure that your `gcloud-cli` account has been authorised. This is to allow the terminal to access your GCP projects.
2. Ensure that the project you're testing on has a secret for the following keys:
   1. `PRIVATE_KEY`, and
   2. `PUBLIC_KEY`.
3. Ensure that your dotenv follows the `.env.sample`.
   1. If `GCLOUD_PROJECT` is not specified, it would read from `.env`.

```bash
# For (1)
gcloud auth application-default login
```

## Running

```bash
pnpm src/index.ts
```
