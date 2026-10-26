# Migrate callers, then delete legacy APIs

When replacing an API, migrate its callers to the supported interface and verify behavior before removing the old API. Search for remaining usages, account for external compatibility where relevant, and delete the legacy path only when it is no longer needed.
