import { createMinion, configFromEnv } from "@tprei/telegram-minions"
import { initSentry, captureException, flush as flushSentry } from "@tprei/telegram-minions/dist/sentry.js"

const config = configFromEnv()
await initSentry(config.sentry?.dsn)

const minion = createMinion({
  ...config,
  repos: {
    "minions": "https://github.com/tprei/telegram-minions",
  },
})

process.on("SIGTERM", () => { minion.stop(); flushSentry().finally(() => process.exit(0)) })
process.on("SIGINT", () => { minion.stop(); flushSentry().finally(() => process.exit(0)) })

process.on("uncaughtException", (err) => {
  captureException(err, { handler: "uncaughtException" })
  flushSentry().finally(() => process.exit(1))
})

process.on("unhandledRejection", (reason) => {
  captureException(reason, { handler: "unhandledRejection" })
  flushSentry().finally(() => process.exit(1))
})

await minion.start()
