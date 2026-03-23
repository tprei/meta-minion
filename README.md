# meta-minions

Telegram bot that manages the [telegram-minions](https://github.com/tprei/telegram-minions) package repository.

## Setup

### Prerequisites

- [fly.io](https://fly.io) account with billing enabled
- [GitHub CLI](https://cli.github.com) authenticated with `read:packages` scope:
  ```bash
  gh auth refresh -h github.com -s read:packages,write:packages
  ```
- Telegram bot token from [@BotFather](https://t.me/BotFather)
- Telegram group with the bot added

### Deploy

```bash
# Install dependencies
npm install

# Build
npm run build

# Create fly app (first time only)
fly apps create meta-minions --org personal
fly volumes create workspace_data --size 10 -a meta-minions -r iad -y

# Set secrets
fly secrets set \
  TELEGRAM_BOT_TOKEN="your-bot-token" \
  TELEGRAM_CHAT_ID="-100..." \
  ALLOWED_USER_IDS="123456789" \
  GITHUB_TOKEN="$(gh auth token)" \
  -a meta-minions

# Deploy
fly deploy -a meta-minions
```

### Auth Claude

After deployment, authenticate Claude on the machine:

```bash
fly ssh console -a meta-minions
su - minion -c 'HOME=/workspace/home claude'
```

Inside the Claude session:
1. It will prompt you to visit a URL and enter a code
2. Complete the OAuth flow in your browser
3. Type `/exit` to leave Claude

## Creating New Minions

Use the setup wizard to create new minion instances for other repositories:

```bash
./scripts/setup-wizard.sh
```

The wizard will prompt for:
- Minion name
- Target repository URL
- Telegram bot token and chat ID
- GitHub token
- Agent provider (Claude Code subscription or API key)

## Commands

Send these to your Telegram group:

| Command | Description |
|---------|-------------|
| `/task <repo> <prompt>` | Start a new task |
| `/think <repo> <prompt>` | Think through a problem |
| `/plan <repo> <prompt>` | Create an implementation plan |
| `/status` | Show running sessions |
| `/cancel <slug>` | Cancel a session |
| `/help` | Show all commands |
