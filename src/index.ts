import { createMinion, configFromEnv } from "@tprei/telegram-minions"

const minion = createMinion({
  ...configFromEnv(),
  repos: {
    "minions": "https://github.com/tprei/telegram-minions",
    "ui": "https://github.com/tprei/minions-ui",
  },
})

process.on("SIGTERM", () => { minion.stop(); process.exit(0) })
process.on("SIGINT", () => { minion.stop(); process.exit(0) })

process.on("uncaughtException", (err) => {
  process.stderr.write(`uncaught exception: ${err}\n`)
  process.exit(1)
})

process.on("unhandledRejection", (reason) => {
  process.stderr.write(`unhandled rejection: ${reason}\n`)
  process.exit(1)
})

await minion.start()
