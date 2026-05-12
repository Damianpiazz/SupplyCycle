# Configuracion agentes backend mobile whatsapp

**Session ID:** ses_1e1980c41ffes3Fh9dr5D8SOM1
**Created:** 12/5/2026, 19:56:29
**Updated:** 12/5/2026, 20:42:02

---

## User

Quiero configurar multiples agentes especializados, uno para backend, otro para mobile, y otro para whatsapp-bot. cada uno con sus skills y sus reglas. que deberia hace paso a paso ? ademas como seria la estructura de carpetas que deberia seguir ? 

---

## Assistant (Plan · Big Pickle · 4.6s)

_Thinking:_

The user wants to configure multiple specialized agents (backend, mobile, whatsapp-bot) with their own skills and rules. They're asking for a step-by-step plan and folder structure. Let me first explore the current codebase structure to understand what they're working with, and check if there's any existing agent configuration (like Cline/OpenCode configuration files).

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle</path>
<type>directory</type>
<entries>
.git/
.gitignore
.husky/
backend/
commitlint.config.mjs
docker-compose.dev.yml
mobile/
package-lock.json
package.json
README.md
whatsapp-bot/

(11 entries)
</entries>
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/.opencode*"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/.clinerules*"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/AGENTS.md"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/.cursorrules"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/.github/copilot-instructions.md"
}
```

**Output:**
```
No files found
```

---

## Assistant (Plan · Big Pickle · 3.1s)

_Thinking:_

Let me explore the structure of each sub-project to understand what kind of projects they are (TypeScript, Python, etc.)

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend</path>
<type>directory</type>
<entries>
.dockerignore
.env.example
.gitignore
.prettierignore
.prettierrc.json
assets/
Dockerfile.dev
dump.sh
dump.txt
eslint.config.js
generated/
node_modules/
package-lock.json
package.json
prisma.config.ts
prisma/
README.md
scripts/
src/
tsconfig.json

(20 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile</path>
<type>directory</type>
<entries>
.env.example
.expo/
.gitignore
.vscode/
app.json
app/
assets/
components/
constants/
eslint.config.js
expo-env.d.ts
features/
hooks/
node_modules/
package-lock.json
package.json
README.md
scripts/
tsconfig.json

(19 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot</path>
<type>directory</type>
<entries>


(0 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\package.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\package.json</path>
<type>file</type>
<content>
1: {
2:   "devDependencies": {
3:     "@commitlint/cli": "^20.5.0",
4:     "@commitlint/config-conventional": "^20.5.0",
5:     "husky": "^9.1.7",
6:     "type": "module"
7:   },
8:   "scripts": {
9:     "prepare": "husky"
10:   }
11: }

(End of file - total 11 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 3.7s)

_Thinking:_

Let me explore the backend package.json and tsconfig to understand the tech stack, and also the mobile package.json. Let me also check if there's a `.opencode` or similar config already.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\package.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\package.json</path>
<type>file</type>
<content>
1: {
2:   "name": "backend",
3:   "version": "1.0.0",
4:   "description": "",
5:   "main": "index.js",
6:   "scripts": {
7:     "dev": "tsx watch src/server.ts",
8:     "build": "tsc",
9:     "start": "node dist/server.js"
10:   },
11:   "keywords": [],
12:   "author": "",
13:   "license": "ISC",
14:   "type": "module",
15:   "dependencies": {
16:     "@prisma/adapter-pg": "^7.7.0",
17:     "@prisma/client": "^7.7.0",
18:     "bcrypt": "^6.0.0",
19:     "cors": "^2.8.6",
20:     "dotenv": "^17.4.2",
21:     "express": "^5.2.1",
22:     "helmet": "^8.1.0",
23:     "jsonwebtoken": "^9.0.3",
24:     "morgan": "^1.10.1",
25:     "pino": "^10.3.1",
26:     "zod": "^4.3.6"
27:   },
28:   "devDependencies": {
29:     "@types/bcrypt": "^6.0.0",
30:     "@types/cors": "^2.8.19",
31:     "@types/express": "^5.0.6",
32:     "@types/jsonwebtoken": "^9.0.10",
33:     "@types/morgan": "^1.9.10",
34:     "@types/node": "^25.6.0",
35:     "prisma": "^7.7.0",
36:     "tsx": "^4.21.0",
37:     "typescript": "^6.0.3"
38:   }
39: }

(End of file - total 39 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\package.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\package.json</path>
<type>file</type>
<content>
1: {
2:   "name": "mobile",
3:   "main": "expo-router/entry",
4:   "version": "1.0.0",
5:   "scripts": {
6:     "start": "expo start",
7:     "reset-project": "node ./scripts/reset-project.js",
8:     "android": "expo start --android",
9:     "ios": "expo start --ios",
10:     "web": "expo start --web",
11:     "lint": "expo lint"
12:   },
13:   "dependencies": {
14:     "@expo/vector-icons": "^15.0.3",
15:     "@react-navigation/bottom-tabs": "^7.4.0",
16:     "@react-navigation/elements": "^2.6.3",
17:     "@react-navigation/native": "^7.1.8",
18:     "expo": "~54.0.33",
19:     "expo-constants": "~18.0.13",
20:     "expo-font": "~14.0.11",
21:     "expo-haptics": "~15.0.8",
22:     "expo-image": "~3.0.11",
23:     "expo-linking": "~8.0.11",
24:     "expo-router": "~6.0.23",
25:     "expo-splash-screen": "~31.0.13",
26:     "expo-status-bar": "~3.0.9",
27:     "expo-symbols": "~1.0.8",
28:     "expo-system-ui": "~6.0.9",
29:     "expo-web-browser": "~15.0.10",
30:     "react": "19.1.0",
31:     "react-dom": "19.1.0",
32:     "react-native": "0.81.5",
33:     "react-native-gesture-handler": "~2.28.0",
34:     "react-native-worklets": "0.5.1",
35:     "react-native-reanimated": "~4.1.1",
36:     "react-native-safe-area-context": "~5.6.0",
37:     "react-native-screens": "~4.16.0",
38:     "react-native-web": "~0.21.0"
39:   },
40:   "devDependencies": {
41:     "@types/react": "~19.1.0",
42:     "typescript": "~5.9.2",
43:     "eslint": "^9.25.0",
44:     "eslint-config-expo": "~10.0.0"
45:   },
46:   "private": true
47: }

(End of file - total 47 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\src</path>
<type>directory</type>
<entries>
app.ts
config/
constants/
features/
lib/
middleware/
server.ts
utils/

(8 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\app"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\app</path>
<type>directory</type>
<entries>
_layout.tsx
(tabs)/
modal.tsx

(3 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\.gitignore"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\.gitignore</path>
<type>file</type>
<content>
1: # dependencies
2: node_modules/

(End of file - total 2 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 4.9s)

_Thinking:_

Now I have a good understanding of the project structure. Let me also check what OpenCode supports for configurations, since they're using what appears to be Cursor-like tooling (OpenCode).

Based on my exploration:
- **backend**: Express + TypeScript + Prisma + PostgreSQL (Node.js backend)
- **mobile**: Expo/React Native with Expo Router (TypeScript)
- **whatsapp-bot**: Empty directory (to be set up)

The user wants to configure specialized agents for each sub-project. Since they're using OpenCode, I should look into what OpenCode supports for:
1. `.opencode` directory for skills/rules
2. `AGENTS.md` or `.clinerules` files
3. Per-project agent configuration

Let me check if there's a way to use OpenCode with monorepo-style agent configurations. Let me fetch the OpenCode docs.

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai"
}
```

**Output:**
```
OpenCode | The open source AI coding agent

[![OpenCode](data:image/svg+xml,%3csvg%20width='234'%20height='42'%20viewBox='0%200%20234%2042'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M18%2030H6V18H18V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M18%2012H6V30H18V12ZM24%2036H0V6H24V36Z'%20fill='%23656363'/%3e%3cpath%20d='M48%2030H36V18H48V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M36%2030H48V12H36V30ZM54%2036H36V42H30V6H54V36Z'%20fill='%23656363'/%3e%3cpath%20d='M84%2024V30H66V24H84Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M84%2024H66V30H84V36H60V6H84V24ZM66%2018H78V12H66V18Z'%20fill='%23656363'/%3e%3cpath%20d='M108%2036H96V18H108V36Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M108%2012H96V36H90V6H108V12ZM114%2036H108V12H114V36Z'%20fill='%23656363'/%3e%3cpath%20d='M144%2030H126V18H144V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M144%2012H126V30H144V36H120V6H144V12Z'%20fill='%23211E1E'/%3e%3cpath%20d='M168%2030H156V18H168V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M168%2012H156V30H168V12ZM174%2036H150V6H174V36Z'%20fill='%23211E1E'/%3e%3cpath%20d='M198%2030H186V18H198V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M198%2012H186V30H198V12ZM204%2036H180V6H198V0H204V36Z'%20fill='%23211E1E'/%3e%3cpath%20d='M234%2024V30H216V24H234Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M216%2012V18H228V12H216ZM234%2024H216V30H234V36H210V6H234V24Z'%20fill='%23211E1E'/%3e%3c/svg%3e)![OpenCode](data:image/svg+xml,%3csvg%20width='234'%20height='42'%20viewBox='0%200%20234%2042'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M18%2030H6V18H18V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M18%2012H6V30H18V12ZM24%2036H0V6H24V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M48%2030H36V18H48V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M36%2030H48V12H36V30ZM54%2036H36V42H30V6H54V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M84%2024V30H66V24H84Z'%20fill='%234B4646'/%3e%3cpath%20d='M84%2024H66V30H84V36H60V6H84V24ZM66%2018H78V12H66V18Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M108%2036H96V18H108V36Z'%20fill='%234B4646'/%3e%3cpath%20d='M108%2012H96V36H90V6H108V12ZM114%2036H108V12H114V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M144%2030H126V18H144V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M144%2012H126V30H144V36H120V6H144V12Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M168%2030H156V18H168V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M168%2012H156V30H168V12ZM174%2036H150V6H174V36Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M198%2030H186V18H198V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M198%2012H186V30H198V12ZM204%2036H180V6H198V0H204V36Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M234%2024V30H216V24H234Z'%20fill='%234B4646'/%3e%3cpath%20d='M216%2012V18H228V12H216ZM234%2024H216V30H234V36H210V6H234V24Z'%20fill='%23F1ECEC'/%3e%3c/svg%3e)](/)

-   [GitHub \[159K\]](https://github.com/anomalyco/opencode)
-   [Docs](/docs)
-   [Zen](/zen)
-   [Go](/go)
-   [Enterprise](/enterprise)
-   [Download](/download)

Open menu

New

Desktop app available in beta on macOS, Windows, and Linux.[Download now](/download)[Download the desktop beta now](/download)

# The open source AI coding agent

Free models included or connect any model from any provider, including Claude, GPT, Gemini and more.

curlnpmbunbrewparu

curl -fsSL https://opencode.ai/install | bash

Your browser does not support the video tag.

### What is OpenCode?

OpenCode is an open source agent that helps you write code in your terminal, IDE, or desktop.

-   \[\*\]
    
    **LSP enabled** Automatically loads the right LSPs for the LLM
    
-   \[\*\]
    
    **Multi-session** Start multiple agents in parallel on the same project
    
-   \[\*\]
    
    **Share links** Share a link to any session for reference or to debug
    
-   \[\*\]
    
    **GitHub Copilot** Log in with GitHub to use your Copilot account
    
-   \[\*\]
    
    **ChatGPT Plus/Pro** Log in with OpenAI to use your ChatGPT Plus or Pro account
    
-   \[\*\]
    
    **Any model** 75+ LLM providers through Models.dev, including local models
    
-   \[\*\]
    
    **Any editor** Available as a terminal interface, desktop app, and IDE extension
    

[Read docs](/docs)

### The open source AI coding agent

\[\*\]

With over **150,000** GitHub stars, **850** contributors, and over **11,000** commits, OpenCode is used and trusted by over **6.5M** developers every month.

Fig 1.

**150K** GitHub Stars

Fig 2.

**850** Contributors

Fig 3.

**6.5M** Monthly Devs

### Built for privacy first

\[\*\]

OpenCode does not store any of your code or context data, so that it can operate in privacy sensitive environments. Learn more about [privacy](/docs/enterprise/).

### FAQ

-   What is OpenCode?
    
-   How do I use OpenCode?
    
-   Do I need extra AI subscriptions to use OpenCode?
    
-   Can I use my existing AI subscriptions with OpenCode?
    
-   Can I only use OpenCode in the terminal?
    
-   How much does OpenCode cost?
    
-   What about data and privacy?
    
-   Is OpenCode open source?
    

**Access reliable optimized models for coding agents**

Zen gives you access to a handpicked set of AI models that OpenCode has tested and benchmarked specifically for coding agents. No need to worry about inconsistent performance and quality across providers, use validated models that work.

[Learn about Zen](/zen)

### Be the first to know when we release new products

Join the waitlist for early access.

Subscribe

[GitHub \[159K\]](https://github.com/anomalyco/opencode)

[Docs](/docs)

[Changelog](/changelog)

[Discord](/discord)

[X](https://x.com/opencode)

©2026 [Anomaly](https://anoma.ly)[Brand](/brand)[Privacy](/legal/privacy-policy)[Terms](/legal/terms-of-service)

English
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs"
}
```

**Output:**
```
Intro | AI coding agent built for the terminalIntro | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/docs/)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](/docs/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Zen](/docs/zen/)
    -   [Share](/docs/share/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Install](#install)
-   [Configure](#configure)
-   [Initialize](#initialize)
-   [Usage](#usage)
    -   [Ask questions](#ask-questions)
    -   [Add features](#add-features)
    -   [Make changes](#make-changes)
    -   [Undo changes](#undo-changes)
-   [Share](#share)
-   [Customize](#customize)

## On this page

-   [Overview](#_top)
-   [Install](#install)
-   [Configure](#configure)
-   [Initialize](#initialize)
-   [Usage](#usage)
    -   [Ask questions](#ask-questions)
    -   [Add features](#add-features)
    -   [Make changes](#make-changes)
    -   [Undo changes](#undo-changes)
-   [Share](#share)
-   [Customize](#customize)

# Intro

Get started with OpenCode.

[**OpenCode**](/) is an open source AI coding agent. It’s available as a terminal-based interface, desktop app, or IDE extension.

![OpenCode TUI with the opencode theme](/docs/_astro/screenshot.CQjBbRyJ_1dLadc.webp)

Let’s get started.

---

#### [Prerequisites](#prerequisites)

To use OpenCode in your terminal, you’ll need:

1.  A modern terminal emulator like:
    
    -   [WezTerm](https://wezterm.org), cross-platform
    -   [Alacritty](https://alacritty.org), cross-platform
    -   [Ghostty](https://ghostty.org), Linux and macOS
    -   [Kitty](https://sw.kovidgoyal.net/kitty/), Linux and macOS
2.  API keys for the LLM providers you want to use.
    

---

## [Install](#install)

The easiest way to install OpenCode is through the install script.

Terminal window

```
curl -fsSL https://opencode.ai/install | bash
```

You can also install it with the following commands:

-   **Using Node.js**
    
    -   [npm](#tab-panel-0)
    -   [Bun](#tab-panel-1)
    -   [pnpm](#tab-panel-2)
    -   [Yarn](#tab-panel-3)
    
    Terminal window
    
    ```
    npm install -g opencode-ai
    ```
    
    Terminal window
    
    ```
    bun install -g opencode-ai
    ```
    
    Terminal window
    
    ```
    pnpm install -g opencode-ai
    ```
    
    Terminal window
    
    ```
    yarn global add opencode-ai
    ```
    
-   **Using Homebrew on macOS and Linux**
    
    Terminal window
    
    ```
    brew install anomalyco/tap/opencode
    ```
    
    > We recommend using the OpenCode tap for the most up to date releases. The official `brew install opencode` formula is maintained by the Homebrew team and is updated less frequently.
    
-   **Installing on Arch Linux**
    
    Terminal window
    
    ```
    sudo pacman -S opencode           # Arch Linux (Stable)paru -S opencode-bin              # Arch Linux (Latest from AUR)
    ```
    

#### [Windows](#windows)

Recommended: Use WSL

For the best experience on Windows, we recommend using [Windows Subsystem for Linux (WSL)](/docs/windows-wsl). It provides better performance and full compatibility with OpenCode’s features.

-   **Using Chocolatey**
    
    Terminal window
    
    ```
    choco install opencode
    ```
    
-   **Using Scoop**
    
    Terminal window
    
    ```
    scoop install opencode
    ```
    
-   **Using NPM**
    
    Terminal window
    
    ```
    npm install -g opencode-ai
    ```
    
-   **Using Mise**
    
    Terminal window
    
    ```
    mise use -g github:anomalyco/opencode
    ```
    
-   **Using Docker**
    
    Terminal window
    
    ```
    docker run -it --rm ghcr.io/anomalyco/opencode
    ```
    

Support for installing OpenCode on Windows using Bun is currently in progress.

You can also grab the binary from the [Releases](https://github.com/anomalyco/opencode/releases).

---

## [Configure](#configure)

With OpenCode you can use any LLM provider by configuring their API keys.

If you are new to using LLM providers, we recommend using [OpenCode Zen](/docs/zen). It’s a curated list of models that have been tested and verified by the OpenCode team.

1.  Run the `/connect` command in the TUI, select opencode, and head to [opencode.ai/auth](https://opencode.ai/auth).
    
    ```
    /connect
    ```
    
2.  Sign in, add your billing details, and copy your API key.
    
3.  Paste your API key.
    
    ```
    ┌ API key││└ enter
    ```
    

Alternatively, you can select one of the other providers. [Learn more](/docs/providers#directory).

---

## [Initialize](#initialize)

Now that you’ve configured a provider, you can navigate to a project that you want to work on.

Terminal window

```
cd /path/to/project
```

And run OpenCode.

Terminal window

```
opencode
```

Next, initialize OpenCode for the project by running the following command.

```
/init
```

This will get OpenCode to analyze your project and create an `AGENTS.md` file in the project root.

Tip

You should commit your project’s `AGENTS.md` file to Git.

This helps OpenCode understand the project structure and the coding patterns used.

---

## [Usage](#usage)

You are now ready to use OpenCode to work on your project. Feel free to ask it anything!

If you are new to using an AI coding agent, here are some examples that might help.

---

### [Ask questions](#ask-questions)

You can ask OpenCode to explain the codebase to you.

Tip

Use the `@` key to fuzzy search for files in the project.

```
How is authentication handled in @packages/functions/src/api/index.ts
```

This is helpful if there’s a part of the codebase that you didn’t work on.

---

### [Add features](#add-features)

You can ask OpenCode to add new features to your project. Though we first recommend asking it to create a plan.

1.  **Create a plan**
    
    OpenCode has a *Plan mode* that disables its ability to make changes and instead suggest *how* it’ll implement the feature.
    
    Switch to it using the **Tab** key. You’ll see an indicator for this in the lower right corner.
    
    ```
    <TAB>
    ```
    
    Now let’s describe what we want it to do.
    
    ```
    When a user deletes a note, we'd like to flag it as deleted in the database.Then create a screen that shows all the recently deleted notes.From this screen, the user can undelete a note or permanently delete it.
    ```
    
    You want to give OpenCode enough details to understand what you want. It helps to talk to it like you are talking to a junior developer on your team.
    
    Tip
    
    Give OpenCode plenty of context and examples to help it understand what you want.
    
2.  **Iterate on the plan**
    
    Once it gives you a plan, you can give it feedback or add more details.
    
    ```
    We'd like to design this new screen using a design I've used before.[Image #1] Take a look at this image and use it as a reference.
    ```
    
    Tip
    
    Drag and drop images into the terminal to add them to the prompt.
    
    OpenCode can scan any images you give it and add them to the prompt. You can do this by dragging and dropping an image into the terminal.
    
3.  **Build the feature**
    
    Once you feel comfortable with the plan, switch back to *Build mode* by hitting the **Tab** key again.
    
    ```
    <TAB>
    ```
    
    And asking it to make the changes.
    
    ```
    Sounds good! Go ahead and make the changes.
    ```
    

---

### [Make changes](#make-changes)

For more straightforward changes, you can ask OpenCode to directly build it without having to review the plan first.

```
We need to add authentication to the /settings route. Take a look at how this ishandled in the /notes route in @packages/functions/src/notes.ts and implementthe same logic in @packages/functions/src/settings.ts
```

You want to make sure you provide a good amount of detail so OpenCode makes the right changes.

---

### [Undo changes](#undo-changes)

Let’s say you ask OpenCode to make some changes.

```
Can you refactor the function in @packages/functions/src/api/index.ts?
```

But you realize that it is not what you wanted. You **can undo** the changes using the `/undo` command.

```
/undo
```

OpenCode will now revert the changes you made and show your original message again.

```
Can you refactor the function in @packages/functions/src/api/index.ts?
```

From here you can tweak the prompt and ask OpenCode to try again.

Tip

You can run `/undo` multiple times to undo multiple changes.

Or you **can redo** the changes using the `/redo` command.

```
/redo
```

---

## [Share](#share)

The conversations that you have with OpenCode can be [shared with your team](/docs/share).

```
/share
```

This will create a link to the current conversation and copy it to your clipboard.

Note

Conversations are not shared by default.

Here’s an [example conversation](https://opencode.ai/s/4XP1fce5) with OpenCode.

---

## [Customize](#customize)

And that’s it! You are now a pro at using OpenCode.

To make it your own, we recommend [picking a theme](/docs/themes), [customizing the keybinds](/docs/keybinds), [configuring code formatters](/docs/formatters), [creating custom commands](/docs/commands), or playing around with the [OpenCode config](/docs/config).

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/index.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: May 12, 2026
```

---

## Assistant (Plan · Big Pickle · 3.1s)

_Thinking:_

Now I need to read the specific docs pages about Agents, Rules, and Skills to understand how OpenCode supports multi-agent configurations.

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/agents/"
}
```

**Output:**
```
Agents | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/docs/)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](/docs/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Zen](/docs/zen/)
    -   [Share](/docs/share/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Types](#types)
    -   [Primary agents](#primary-agents)
    -   [Subagents](#subagents)
-   [Built-in](#built-in)
    -   [Use build](#use-build)
    -   [Use plan](#use-plan)
    -   [Use general](#use-general)
    -   [Use explore](#use-explore)
    -   [Use scout](#use-scout)
    -   [Use compaction](#use-compaction)
    -   [Use title](#use-title)
    -   [Use summary](#use-summary)
-   [Usage](#usage)
-   [Configure](#configure)
    -   [JSON](#json)
    -   [Markdown](#markdown)
-   [Options](#options)
    -   [Description](#description)
    -   [Temperature](#temperature)
    -   [Max steps](#max-steps)
    -   [Disable](#disable)
    -   [Prompt](#prompt)
    -   [Model](#model)
    -   [Tools (deprecated)](#tools-deprecated)
    -   [Permissions](#permissions)
    -   [Mode](#mode)
    -   [Hidden](#hidden)
    -   [Task permissions](#task-permissions)
    -   [Color](#color)
    -   [Top P](#top-p)
    -   [Additional](#additional)
-   [Create agents](#create-agents)
-   [Use cases](#use-cases)
-   [Examples](#examples)
    -   [Documentation agent](#documentation-agent)
    -   [Security auditor](#security-auditor)

## On this page

-   [Overview](#_top)
-   [Types](#types)
    -   [Primary agents](#primary-agents)
    -   [Subagents](#subagents)
-   [Built-in](#built-in)
    -   [Use build](#use-build)
    -   [Use plan](#use-plan)
    -   [Use general](#use-general)
    -   [Use explore](#use-explore)
    -   [Use scout](#use-scout)
    -   [Use compaction](#use-compaction)
    -   [Use title](#use-title)
    -   [Use summary](#use-summary)
-   [Usage](#usage)
-   [Configure](#configure)
    -   [JSON](#json)
    -   [Markdown](#markdown)
-   [Options](#options)
    -   [Description](#description)
    -   [Temperature](#temperature)
    -   [Max steps](#max-steps)
    -   [Disable](#disable)
    -   [Prompt](#prompt)
    -   [Model](#model)
    -   [Tools (deprecated)](#tools-deprecated)
    -   [Permissions](#permissions)
    -   [Mode](#mode)
    -   [Hidden](#hidden)
    -   [Task permissions](#task-permissions)
    -   [Color](#color)
    -   [Top P](#top-p)
    -   [Additional](#additional)
-   [Create agents](#create-agents)
-   [Use cases](#use-cases)
-   [Examples](#examples)
    -   [Documentation agent](#documentation-agent)
    -   [Security auditor](#security-auditor)

# Agents

Configure and use specialized agents.

Agents are specialized AI assistants that can be configured for specific tasks and workflows. They allow you to create focused tools with custom prompts, models, and tool access.

Tip

Use the plan agent to analyze code and review suggestions without making any code changes.

You can switch between agents during a session or invoke them with the `@` mention.

---

## [Types](#types)

There are two types of agents in OpenCode; primary agents and subagents.

---

### [Primary agents](#primary-agents)

Primary agents are the main assistants you interact with directly. You can cycle through them using the **Tab** key, or your configured `switch_agent` keybind. These agents handle your main conversation. Tool access is configured via permissions — for example, Build has all tools enabled while Plan is restricted.

Tip

You can use the **Tab** key to switch between primary agents during a session.

OpenCode comes with two built-in primary agents, **Build** and **Plan**. We’ll look at these below.

---

### [Subagents](#subagents)

Subagents are specialized assistants that primary agents can invoke for specific tasks. You can also manually invoke them by **@ mentioning** them in your messages.

OpenCode comes with three built-in subagents, **General**, **Explore**, and **Scout**. We’ll look at this below.

---

## [Built-in](#built-in)

OpenCode comes with two built-in primary agents and three built-in subagents.

---

### [Use build](#use-build)

*Mode*: `primary`

Build is the **default** primary agent with all tools enabled. This is the standard agent for development work where you need full access to file operations and system commands.

---

### [Use plan](#use-plan)

*Mode*: `primary`

A restricted agent designed for planning and analysis. We use a permission system to give you more control and prevent unintended changes. By default, all of the following are set to `ask`:

-   `file edits`: All writes, patches, and edits
-   `bash`: All bash commands

This agent is useful when you want the LLM to analyze code, suggest changes, or create plans without making any actual modifications to your codebase.

---

### [Use general](#use-general)

*Mode*: `subagent`

A general-purpose agent for researching complex questions and executing multi-step tasks. Has full tool access (except todo), so it can make file changes when needed. Use this to run multiple units of work in parallel.

---

### [Use explore](#use-explore)

*Mode*: `subagent`

A fast, read-only agent for exploring codebases. Cannot modify files. Use this when you need to quickly find files by patterns, search code for keywords, or answer questions about the codebase.

---

### [Use scout](#use-scout)

*Mode*: `subagent`

A read-only agent for external docs and dependency research. Use this when you need to clone a dependency repository into OpenCode’s managed cache, inspect library source, or cross-reference local code against upstream implementations without modifying your workspace.

---

### [Use compaction](#use-compaction)

*Mode*: `primary`

Hidden system agent that compacts long context into a smaller summary. It runs automatically when needed and is not selectable in the UI.

---

### [Use title](#use-title)

*Mode*: `primary`

Hidden system agent that generates short session titles. It runs automatically and is not selectable in the UI.

---

### [Use summary](#use-summary)

*Mode*: `primary`

Hidden system agent that creates session summaries. It runs automatically and is not selectable in the UI.

---

## [Usage](#usage)

1.  For primary agents, use the **Tab** key to cycle through them during a session. You can also use your configured `switch_agent` keybind.
    
2.  Subagents can be invoked:
    
    -   **Automatically** by primary agents for specialized tasks based on their descriptions.
        
    -   Manually by **@ mentioning** a subagent in your message. For example.
        
        ```
        @general help me search for this function
        ```
        
3.  **Navigation between sessions**: When subagents create child sessions, use `session_child_first` (default: **<Leader>+Down**) to enter the first child session from the parent.
    
4.  Once you are in a child session, use:
    
    -   `session_child_cycle` (default: **Right**) to cycle to the next child session
    -   `session_child_cycle_reverse` (default: **Left**) to cycle to the previous child session
    -   `session_parent` (default: **Up**) to return to the parent session
    
    This lets you switch between the main conversation and specialized subagent work.
    

---

## [Configure](#configure)

You can customize the built-in agents or create your own through configuration. Agents can be configured in two ways:

---

### [JSON](#json)

Configure agents in your `opencode.json` config file:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "agent": {    "build": {      "mode": "primary",      "model": "anthropic/claude-sonnet-4-20250514",      "prompt": "{file:./prompts/build.txt}",      "permission": {        "edit": "allow",        "bash": "allow"      }    },    "plan": {      "mode": "primary",      "model": "anthropic/claude-haiku-4-20250514",      "permission": {        "edit": "deny",        "bash": "deny"      }    },    "code-reviewer": {      "description": "Reviews code for best practices and potential issues",      "mode": "subagent",      "model": "anthropic/claude-sonnet-4-20250514",      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",      "permission": {        "edit": "deny"      }    }  }}
```

---

### [Markdown](#markdown)

You can also define agents using markdown files. Place them in:

-   Global: `~/.config/opencode/agents/`
-   Per-project: `.opencode/agents/`

~/.config/opencode/agents/review.md

```
---description: Reviews code for quality and best practicesmode: subagentmodel: anthropic/claude-sonnet-4-20250514temperature: 0.1permission:  edit: deny  bash: deny---
You are in code review mode. Focus on:
- Code quality and best practices- Potential bugs and edge cases- Performance implications- Security considerations
Provide constructive feedback without making direct changes.
```

The markdown file name becomes the agent name. For example, `review.md` creates a `review` agent.

---

## [Options](#options)

Let’s look at these configuration options in detail.

---

### [Description](#description)

Use the `description` option to provide a brief description of what the agent does and when to use it.

opencode.json

```
{  "agent": {    "review": {      "description": "Reviews code for best practices and potential issues"    }  }}
```

This is a **required** config option.

---

### [Temperature](#temperature)

Control the randomness and creativity of the LLM’s responses with the `temperature` config.

Lower values make responses more focused and deterministic, while higher values increase creativity and variability.

opencode.json

```
{  "agent": {    "plan": {      "temperature": 0.1    },    "creative": {      "temperature": 0.8    }  }}
```

Temperature values typically range from 0.0 to 1.0:

-   **0.0-0.2**: Very focused and deterministic responses, ideal for code analysis and planning
-   **0.3-0.5**: Balanced responses with some creativity, good for general development tasks
-   **0.6-1.0**: More creative and varied responses, useful for brainstorming and exploration

opencode.json

```
{  "agent": {    "analyze": {      "temperature": 0.1,      "prompt": "{file:./prompts/analysis.txt}"    },    "build": {      "temperature": 0.3    },    "brainstorm": {      "temperature": 0.7,      "prompt": "{file:./prompts/creative.txt}"    }  }}
```

If no temperature is specified, OpenCode uses model-specific defaults; typically 0 for most models, 0.55 for Qwen models.

---

### [Max steps](#max-steps)

Control the maximum number of agentic iterations an agent can perform before being forced to respond with text only. This allows users who wish to control costs to set a limit on agentic actions.

If this is not set, the agent will continue to iterate until the model chooses to stop or the user interrupts the session.

opencode.json

```
{  "agent": {    "quick-thinker": {      "description": "Fast reasoning with limited iterations",      "prompt": "You are a quick thinker. Solve problems with minimal steps.",      "steps": 5    }  }}
```

When the limit is reached, the agent receives a special system prompt instructing it to respond with a summarization of its work and recommended remaining tasks.

Caution

The legacy `maxSteps` field is deprecated. Use `steps` instead.

---

### [Disable](#disable)

Set to `true` to disable the agent.

opencode.json

```
{  "agent": {    "review": {      "disable": true    }  }}
```

---

### [Prompt](#prompt)

Specify a custom system prompt file for this agent with the `prompt` config. The prompt file should contain instructions specific to the agent’s purpose.

opencode.json

```
{  "agent": {    "review": {      "prompt": "{file:./prompts/code-review.txt}"    }  }}
```

This path is relative to where the config file is located. So this works for both the global OpenCode config and the project specific config.

---

### [Model](#model)

Use the `model` config to override the model for this agent. Useful for using different models optimized for different tasks. For example, a faster model for planning, a more capable model for implementation.

Tip

If you don’t specify a model, primary agents use the [model globally configured](/docs/config#models) while subagents will use the model of the primary agent that invoked the subagent.

opencode.json

```
{  "agent": {    "plan": {      "model": "anthropic/claude-haiku-4-20250514"    }  }}
```

The model ID in your OpenCode config uses the format `provider/model-id`. For example, if you’re using [OpenCode Zen](/docs/zen), you would use `opencode/gpt-5.1-codex` for GPT 5.1 Codex.

---

### [Tools (deprecated)](#tools-deprecated)

`tools` is **deprecated**. Prefer the agent’s [`permission`](#permissions) field for new configs, updates and more fine-grained control.

Allows you to control which tools are available in this agent. You can enable or disable specific tools by setting them to `true` or `false`. In an agent’s `tools` config, `true` is equivalent to `{"*": "allow"}` permission and `false` is equivalent to `{"*": "deny"}` permission.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "tools": {    "write": true,    "bash": true  },  "agent": {    "plan": {      "tools": {        "write": false,        "bash": false      }    }  }}
```

Note

The agent-specific config overrides the global config.

You can also use wildcards in legacy `tools` entries to control multiple tools at once. For example, to disable all tools from an MCP server:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "agent": {    "readonly": {      "tools": {        "mymcp_*": false,        "write": false,        "edit": false      }    }  }}
```

[Learn more about tools](/docs/tools).

---

### [Permissions](#permissions)

You can configure permissions to manage what actions an agent can take. Each permission key can be set to:

-   `"ask"` — Prompt for approval before running the tool
-   `"allow"` — Allow all operations without approval
-   `"deny"` — Disable the tool

The available permission keys are:

Key

Tools it gates

`read`

`read`

`edit`

`write`, `edit`, `apply_patch`

`glob`

`glob`

`grep`

`grep`

`list`

`list`

`bash`

`bash`

`task`

`task`

`external_directory`

Any tool that reads or writes files outside the project worktree

`todowrite`

`todowrite`, `todoread`

`webfetch`

`webfetch`

`websearch`

`websearch`

`lsp`

`lsp`

`skill`

`skill`

`question`

`question`

`doom_loop`

Recovery prompts when an agent appears stuck

`read`, `edit`, `glob`, `grep`, `list`, `bash`, `task`, `external_directory`, `lsp`, and `skill` accept either a shorthand action (`"allow" | "ask" | "deny"`) or an object of glob/pattern → action for fine-grained control. The remaining keys accept the shorthand action only.

Note

Permission keys are matched as wildcard patterns against the underlying tool name, so the same syntax works for built-ins, custom tools, and MCP tools — for example `"mymcp_*": "deny"` denies every tool from an MCP server, and `"mymcp_search": "ask"` targets a single one.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "permission": {    "edit": "deny"  }}
```

You can override these permissions per agent.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "permission": {    "edit": "deny"  },  "agent": {    "build": {      "permission": {        "edit": "ask"      }    }  }}
```

You can also set permissions in Markdown agents.

~/.config/opencode/agents/review.md

```
---description: Code review without editsmode: subagentpermission:  edit: deny  bash:    "*": ask    "git diff": allow    "git log*": allow    "grep *": allow  webfetch: deny---
Only analyze code and suggest changes.
```

You can set permissions for specific bash commands.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "agent": {    "build": {      "permission": {        "bash": {          "git push": "ask",          "grep *": "allow"        }      }    }  }}
```

This can take a glob pattern.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "agent": {    "build": {      "permission": {        "bash": {          "git *": "ask"        }      }    }  }}
```

And you can also use the `*` wildcard to manage permissions for all commands. Since the last matching rule takes precedence, put the `*` wildcard first and specific rules after.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "agent": {    "build": {      "permission": {        "bash": {          "*": "ask",          "git status *": "allow"        }      }    }  }}
```

[Learn more about permissions](/docs/permissions).

---

### [Mode](#mode)

Control the agent’s mode with the `mode` config. The `mode` option is used to determine how the agent can be used.

opencode.json

```
{  "agent": {    "review": {      "mode": "subagent"    }  }}
```

The `mode` option can be set to `primary`, `subagent`, or `all`. If no `mode` is specified, it defaults to `all`.

---

### [Hidden](#hidden)

Hide a subagent from the `@` autocomplete menu with `hidden: true`. Useful for internal subagents that should only be invoked programmatically by other agents via the Task tool.

opencode.json

```
{  "agent": {    "internal-helper": {      "mode": "subagent",      "hidden": true    }  }}
```

This only affects user visibility in the autocomplete menu. Hidden agents can still be invoked by the model via the Task tool if permissions allow.

Note

Only applies to `mode: subagent` agents.

---

### [Task permissions](#task-permissions)

Control which subagents an agent can invoke via the Task tool with `permission.task`. Uses glob patterns for flexible matching.

opencode.json

```
{  "agent": {    "orchestrator": {      "mode": "primary",      "permission": {        "task": {          "*": "deny",          "orchestrator-*": "allow",          "code-reviewer": "ask"        }      }    }  }}
```

When set to `deny`, the subagent is removed from the Task tool description entirely, so the model won’t attempt to invoke it.

Tip

Rules are evaluated in order, and the **last matching rule wins**. In the example above, `orchestrator-planner` matches both `*` (deny) and `orchestrator-*` (allow), but since `orchestrator-*` comes after `*`, the result is `allow`.

Tip

Users can always invoke any subagent directly via the `@` autocomplete menu, even if the agent’s task permissions would deny it.

---

### [Color](#color)

Customize the agent’s visual appearance in the UI with the `color` option. This affects how the agent appears in the interface.

Use a valid hex color (e.g., `#FF5733`) or theme color: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`.

opencode.json

```
{  "agent": {    "creative": {      "color": "#ff6b6b"    },    "code-reviewer": {      "color": "accent"    }  }}
```

---

### [Top P](#top-p)

Control response diversity with the `top_p` option. Alternative to temperature for controlling randomness.

opencode.json

```
{  "agent": {    "brainstorm": {      "top_p": 0.9    }  }}
```

Values range from 0.0 to 1.0. Lower values are more focused, higher values more diverse.

---

### [Additional](#additional)

Any other options you specify in your agent configuration will be **passed through directly** to the provider as model options. This allows you to use provider-specific features and parameters.

For example, with OpenAI’s reasoning models, you can control the reasoning effort:

opencode.json

```
{  "agent": {    "deep-thinker": {      "description": "Agent that uses high reasoning effort for complex problems",      "model": "openai/gpt-5",      "reasoningEffort": "high",      "textVerbosity": "low"    }  }}
```

These additional options are model and provider-specific. Check your provider’s documentation for available parameters.

Tip

Run `opencode models` to see a list of the available models.

---

## [Create agents](#create-agents)

You can create new agents using the following command:

Terminal window

```
opencode agent create
```

This interactive command will:

1.  Ask where to save the agent; global or project-specific.
2.  Description of what the agent should do.
3.  Generate an appropriate system prompt and identifier.
4.  Let you select which permissions the agent should be allowed (anything you don’t select is denied).
5.  Finally, create a markdown file with the agent configuration.

---

## [Use cases](#use-cases)

Here are some common use cases for different agents.

-   **Build agent**: Full development work with all tools enabled
-   **Plan agent**: Analysis and planning without making changes
-   **Review agent**: Code review with read-only access plus documentation tools
-   **Debug agent**: Focused on investigation with bash and read tools enabled
-   **Docs agent**: Documentation writing with file operations but no system commands

---

## [Examples](#examples)

Here are some example agents you might find useful.

Tip

Do you have an agent you’d like to share? [Submit a PR](https://github.com/anomalyco/opencode).

---

### [Documentation agent](#documentation-agent)

~/.config/opencode/agents/docs-writer.md

```
---description: Writes and maintains project documentationmode: subagentpermission:  bash: deny---
You are a technical writer. Create clear, comprehensive documentation.
Focus on:
- Clear explanations- Proper structure- Code examples- User-friendly language
```

---

### [Security auditor](#security-auditor)

~/.config/opencode/agents/security-auditor.md

```
---description: Performs security audits and identifies vulnerabilitiesmode: subagentpermission:  edit: deny---
You are a security expert. Focus on identifying potential security issues.
Look for:
- Input validation vulnerabilities- Authentication and authorization flaws- Data exposure risks- Dependency vulnerabilities- Configuration security issues
```

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/agents.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: May 12, 2026
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/rules/"
}
```

**Output:**
```
Rules | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/docs/)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](/docs/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Zen](/docs/zen/)
    -   [Share](/docs/share/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Initialize](#initialize)
-   [Example](#example)
-   [Types](#types)
    -   [Project](#project)
    -   [Global](#global)
    -   [Claude Code Compatibility](#claude-code-compatibility)
-   [Precedence](#precedence)
-   [Custom Instructions](#custom-instructions)
-   [Referencing External Files](#referencing-external-files)
    -   [Using opencode.json](#using-opencodejson)
    -   [Manual Instructions in AGENTS.md](#manual-instructions-in-agentsmd)

## On this page

-   [Overview](#_top)
-   [Initialize](#initialize)
-   [Example](#example)
-   [Types](#types)
    -   [Project](#project)
    -   [Global](#global)
    -   [Claude Code Compatibility](#claude-code-compatibility)
-   [Precedence](#precedence)
-   [Custom Instructions](#custom-instructions)
-   [Referencing External Files](#referencing-external-files)
    -   [Using opencode.json](#using-opencodejson)
    -   [Manual Instructions in AGENTS.md](#manual-instructions-in-agentsmd)

# Rules

Set custom instructions for opencode.

You can provide custom instructions to opencode by creating an `AGENTS.md` file. This is similar to Cursor’s rules. It contains instructions that will be included in the LLM’s context to customize its behavior for your specific project.

---

## [Initialize](#initialize)

To create a new `AGENTS.md` file, you can run the `/init` command in opencode.

Tip

You should commit your project’s `AGENTS.md` file to Git.

`/init` scans the important files in your repo, may ask a couple of targeted questions when the codebase cannot answer them, and then creates or updates `AGENTS.md` with concise project-specific guidance.

It focuses on the things future agent sessions are most likely to need:

-   build, lint, and test commands
-   command order and focused verification steps when they matter
-   architecture and repo structure that are not obvious from filenames alone
-   project-specific conventions, setup quirks, and operational gotchas
-   references to existing instruction sources like Cursor or Copilot rules

If you already have an `AGENTS.md`, `/init` will improve it in place instead of blindly replacing it.

---

## [Example](#example)

You can also just create this file manually. Here’s an example of some things you can put into an `AGENTS.md` file.

AGENTS.md

```
# SST v3 Monorepo Project
This is an SST v3 monorepo with TypeScript. The project uses bun workspaces for package management.
## Project Structure
- `packages/` - Contains all workspace packages (functions, core, web, etc.)- `infra/` - Infrastructure definitions split by service (storage.ts, api.ts, web.ts)- `sst.config.ts` - Main SST configuration with dynamic imports
## Code Standards
- Use TypeScript with strict mode enabled- Shared code goes in `packages/core/` with proper exports configuration- Functions go in `packages/functions/`- Infrastructure should be split into logical files in `infra/`
## Monorepo Conventions
- Import shared modules using workspace names: `@my-app/core/example`
```

We are adding project-specific instructions here and this will be shared across your team.

---

## [Types](#types)

opencode also supports reading the `AGENTS.md` file from multiple locations. And this serves different purposes.

### [Project](#project)

Place an `AGENTS.md` in your project root for project-specific rules. These only apply when you are working in this directory or its sub-directories.

### [Global](#global)

You can also have global rules in a `~/.config/opencode/AGENTS.md` file. This gets applied across all opencode sessions.

Since this isn’t committed to Git or shared with your team, we recommend using this to specify any personal rules that the LLM should follow.

### [Claude Code Compatibility](#claude-code-compatibility)

For users migrating from Claude Code, OpenCode supports Claude Code’s file conventions as fallbacks:

-   **Project rules**: `CLAUDE.md` in your project directory (used if no `AGENTS.md` exists)
-   **Global rules**: `~/.claude/CLAUDE.md` (used if no `~/.config/opencode/AGENTS.md` exists)
-   **Skills**: `~/.claude/skills/` — see [Agent Skills](/docs/skills/) for details

To disable Claude Code compatibility, set one of these environment variables:

Terminal window

```
export OPENCODE_DISABLE_CLAUDE_CODE=1        # Disable all .claude supportexport OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1 # Disable only ~/.claude/CLAUDE.mdexport OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1 # Disable only .claude/skills
```

---

## [Precedence](#precedence)

When opencode starts, it looks for rule files in this order:

1.  **Local files** by traversing up from the current directory (`AGENTS.md`, `CLAUDE.md`)
2.  **Global file** at `~/.config/opencode/AGENTS.md`
3.  **Claude Code file** at `~/.claude/CLAUDE.md` (unless disabled)

The first matching file wins in each category. For example, if you have both `AGENTS.md` and `CLAUDE.md`, only `AGENTS.md` is used. Similarly, `~/.config/opencode/AGENTS.md` takes precedence over `~/.claude/CLAUDE.md`.

---

## [Custom Instructions](#custom-instructions)

You can specify custom instruction files in your `opencode.json` or the global `~/.config/opencode/opencode.json`. This allows you and your team to reuse existing rules rather than having to duplicate them to AGENTS.md.

Example:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]}
```

You can also use remote URLs to load instructions from the web.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "instructions": ["https://raw.githubusercontent.com/my-org/shared-rules/main/style.md"]}
```

Remote instructions are fetched with a 5 second timeout.

All instruction files are combined with your `AGENTS.md` files.

---

## [Referencing External Files](#referencing-external-files)

While opencode doesn’t automatically parse file references in `AGENTS.md`, you can achieve similar functionality in two ways:

### [Using opencode.json](#using-opencodejson)

The recommended approach is to use the `instructions` field in `opencode.json`:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "instructions": ["docs/development-standards.md", "test/testing-guidelines.md", "packages/*/AGENTS.md"]}
```

### [Manual Instructions in AGENTS.md](#manual-instructions-in-agentsmd)

You can teach opencode to read external files by providing explicit instructions in your `AGENTS.md`. Here’s a practical example:

AGENTS.md

```
# TypeScript Project Rules
## External File Loading
CRITICAL: When you encounter a file reference (e.g., @rules/general.md), use your Read tool to load it on a need-to-know basis. They're relevant to the SPECIFIC task at hand.
Instructions:
- Do NOT preemptively load all references - use lazy loading based on actual need- When loaded, treat content as mandatory instructions that override defaults- Follow references recursively when needed
## Development Guidelines
For TypeScript code style and best practices: @docs/typescript-guidelines.mdFor React component architecture and hooks patterns: @docs/react-patterns.mdFor REST API design and error handling: @docs/api-standards.mdFor testing strategies and coverage requirements: @test/testing-guidelines.md
## General Guidelines
Read the following file immediately as it's relevant to all workflows: @rules/general-guidelines.md.
```

This approach allows you to:

-   Create modular, reusable rule files
-   Share rules across projects via symlinks or git submodules
-   Keep AGENTS.md concise while referencing detailed guidelines
-   Ensure opencode loads files only when needed for the specific task

Tip

For monorepos or projects with shared standards, using `opencode.json` with glob patterns (like `packages/*/AGENTS.md`) is more maintainable than manual instructions.

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/rules.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: May 12, 2026
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/skills/"
}
```

**Output:**
```
Agent Skills | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/docs/)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](/docs/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Zen](/docs/zen/)
    -   [Share](/docs/share/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Place files](#place-files)
-   [Understand discovery](#understand-discovery)
-   [Write frontmatter](#write-frontmatter)
-   [Validate names](#validate-names)
-   [Follow length rules](#follow-length-rules)
-   [Use an example](#use-an-example)
-   [Recognize tool description](#recognize-tool-description)
-   [Configure permissions](#configure-permissions)
-   [Override per agent](#override-per-agent)
-   [Disable the skill tool](#disable-the-skill-tool)
-   [Troubleshoot loading](#troubleshoot-loading)

## On this page

-   [Overview](#_top)
-   [Place files](#place-files)
-   [Understand discovery](#understand-discovery)
-   [Write frontmatter](#write-frontmatter)
-   [Validate names](#validate-names)
-   [Follow length rules](#follow-length-rules)
-   [Use an example](#use-an-example)
-   [Recognize tool description](#recognize-tool-description)
-   [Configure permissions](#configure-permissions)
-   [Override per agent](#override-per-agent)
-   [Disable the skill tool](#disable-the-skill-tool)
-   [Troubleshoot loading](#troubleshoot-loading)

# Agent Skills

Define reusable behavior via SKILL.md definitions

Agent skills let OpenCode discover reusable instructions from your repo or home directory. Skills are loaded on-demand via the native `skill` tool—agents see available skills and can load the full content when needed.

---

## [Place files](#place-files)

Create one folder per skill name and put a `SKILL.md` inside it. OpenCode searches these locations:

-   Project config: `.opencode/skills/<name>/SKILL.md`
-   Global config: `~/.config/opencode/skills/<name>/SKILL.md`
-   Project Claude-compatible: `.claude/skills/<name>/SKILL.md`
-   Global Claude-compatible: `~/.claude/skills/<name>/SKILL.md`
-   Project agent-compatible: `.agents/skills/<name>/SKILL.md`
-   Global agent-compatible: `~/.agents/skills/<name>/SKILL.md`

---

## [Understand discovery](#understand-discovery)

For project-local paths, OpenCode walks up from your current working directory until it reaches the git worktree. It loads any matching `skills/*/SKILL.md` in `.opencode/` and any matching `.claude/skills/*/SKILL.md` or `.agents/skills/*/SKILL.md` along the way.

Global definitions are also loaded from `~/.config/opencode/skills/*/SKILL.md`, `~/.claude/skills/*/SKILL.md`, and `~/.agents/skills/*/SKILL.md`.

---

## [Write frontmatter](#write-frontmatter)

Each `SKILL.md` must start with YAML frontmatter. Only these fields are recognized:

-   `name` (required)
-   `description` (required)
-   `license` (optional)
-   `compatibility` (optional)
-   `metadata` (optional, string-to-string map)

Unknown frontmatter fields are ignored.

---

## [Validate names](#validate-names)

`name` must:

-   Be 1–64 characters
-   Be lowercase alphanumeric with single hyphen separators
-   Not start or end with `-`
-   Not contain consecutive `--`
-   Match the directory name that contains `SKILL.md`

Equivalent regex:

```
^[a-z0-9]+(-[a-z0-9]+)*$
```

---

## [Follow length rules](#follow-length-rules)

`description` must be 1-1024 characters. Keep it specific enough for the agent to choose correctly.

---

## [Use an example](#use-an-example)

Create `.opencode/skills/git-release/SKILL.md` like this:

```
---name: git-releasedescription: Create consistent releases and changelogslicense: MITcompatibility: opencodemetadata:  audience: maintainers  workflow: github---
## What I do
- Draft release notes from merged PRs- Propose a version bump- Provide a copy-pasteable `gh release create` command
## When to use me
Use this when you are preparing a tagged release.Ask clarifying questions if the target versioning scheme is unclear.
```

---

## [Recognize tool description](#recognize-tool-description)

OpenCode lists available skills in the `skill` tool description. Each entry includes the skill name and description:

```
<available_skills>  <skill>    <name>git-release</name>    <description>Create consistent releases and changelogs</description>  </skill></available_skills>
```

The agent loads a skill by calling the tool:

```
skill({ name: "git-release" })
```

---

## [Configure permissions](#configure-permissions)

Control which skills agents can access using pattern-based permissions in `opencode.json`:

```
{  "permission": {    "skill": {      "*": "allow",      "pr-review": "allow",      "internal-*": "deny",      "experimental-*": "ask"    }  }}
```

Permission

Behavior

`allow`

Skill loads immediately

`deny`

Skill hidden from agent, access rejected

`ask`

User prompted for approval before loading

Patterns support wildcards: `internal-*` matches `internal-docs`, `internal-tools`, etc.

---

## [Override per agent](#override-per-agent)

Give specific agents different permissions than the global defaults.

**For custom agents** (in agent frontmatter):

```
---permission:  skill:    "documents-*": "allow"---
```

**For built-in agents** (in `opencode.json`):

```
{  "agent": {    "plan": {      "permission": {        "skill": {          "internal-*": "allow"        }      }    }  }}
```

---

## [Disable the skill tool](#disable-the-skill-tool)

Completely disable skills for agents that shouldn’t use them:

**For custom agents**:

```
---tools:  skill: false---
```

**For built-in agents**:

```
{  "agent": {    "plan": {      "tools": {        "skill": false      }    }  }}
```

When disabled, the `<available_skills>` section is omitted entirely.

---

## [Troubleshoot loading](#troubleshoot-loading)

If a skill does not show up:

1.  Verify `SKILL.md` is spelled in all caps
2.  Check that frontmatter includes `name` and `description`
3.  Ensure skill names are unique across all locations
4.  Check permissions—skills with `deny` are hidden from agents

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/skills.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: May 12, 2026
```

---

## Assistant (Plan · Big Pickle · 3.1s)

_Thinking:_

Now I have a comprehensive understanding of the OpenCode configuration system. Let me also check the config doc to understand the opencode.json schema more fully.

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/config/"
}
```

**Output:**
```
Config | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/docs/)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](/docs/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Zen](/docs/zen/)
    -   [Share](/docs/share/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Format](#format)
-   [Locations](#locations)
    -   [Precedence order](#precedence-order)
    -   [Remote](#remote)
    -   [Global](#global)
    -   [Per project](#per-project)
    -   [Custom path](#custom-path)
    -   [Custom directory](#custom-directory)
    -   [Managed settings](#managed-settings)
-   [Schema](#schema)
    -   [TUI](#tui)
    -   [Server](#server)
    -   [Shell](#shell)
    -   [Tools](#tools)
    -   [Models](#models)
    -   [Themes](#themes)
    -   [Agents](#agents)
    -   [Default agent](#default-agent)
    -   [Sharing](#sharing)
    -   [Commands](#commands)
    -   [Keybinds](#keybinds)
    -   [Snapshot](#snapshot)
    -   [Autoupdate](#autoupdate)
    -   [Formatters](#formatters)
    -   [LSP Servers](#lsp-servers)
    -   [Permissions](#permissions)
    -   [Compaction](#compaction)
    -   [Watcher](#watcher)
    -   [MCP servers](#mcp-servers)
    -   [Plugins](#plugins)
    -   [Instructions](#instructions)
    -   [Disabled providers](#disabled-providers)
    -   [Enabled providers](#enabled-providers)
    -   [Experimental](#experimental)
-   [Variables](#variables)
    -   [Env vars](#env-vars)
    -   [Files](#files)

## On this page

-   [Overview](#_top)
-   [Format](#format)
-   [Locations](#locations)
    -   [Precedence order](#precedence-order)
    -   [Remote](#remote)
    -   [Global](#global)
    -   [Per project](#per-project)
    -   [Custom path](#custom-path)
    -   [Custom directory](#custom-directory)
    -   [Managed settings](#managed-settings)
-   [Schema](#schema)
    -   [TUI](#tui)
    -   [Server](#server)
    -   [Shell](#shell)
    -   [Tools](#tools)
    -   [Models](#models)
    -   [Themes](#themes)
    -   [Agents](#agents)
    -   [Default agent](#default-agent)
    -   [Sharing](#sharing)
    -   [Commands](#commands)
    -   [Keybinds](#keybinds)
    -   [Snapshot](#snapshot)
    -   [Autoupdate](#autoupdate)
    -   [Formatters](#formatters)
    -   [LSP Servers](#lsp-servers)
    -   [Permissions](#permissions)
    -   [Compaction](#compaction)
    -   [Watcher](#watcher)
    -   [MCP servers](#mcp-servers)
    -   [Plugins](#plugins)
    -   [Instructions](#instructions)
    -   [Disabled providers](#disabled-providers)
    -   [Enabled providers](#enabled-providers)
    -   [Experimental](#experimental)
-   [Variables](#variables)
    -   [Env vars](#env-vars)
    -   [Files](#files)

# Config

Using the OpenCode JSON config.

You can configure OpenCode using a JSON config file.

---

## [Format](#format)

OpenCode supports both **JSON** and **JSONC** (JSON with Comments) formats.

opencode.jsonc

```
{  "$schema": "https://opencode.ai/config.json",  "model": "anthropic/claude-sonnet-4-5",  "autoupdate": true,  "server": {    "port": 4096,  },}
```

---

## [Locations](#locations)

You can place your config in a couple of different locations and they have a different order of precedence.

Note

Configuration files are **merged together**, not replaced.

Configuration files are merged together, not replaced. Settings from the following config locations are combined. Later configs override earlier ones only for conflicting keys. Non-conflicting settings from all configs are preserved.

For example, if your global config sets `autoupdate: true` and your project config sets `model: "anthropic/claude-sonnet-4-5"`, the final configuration will include both settings.

---

### [Precedence order](#precedence-order)

Config sources are loaded in this order (later sources override earlier ones):

1.  **Remote config** (from `.well-known/opencode`) - organizational defaults
2.  **Global config** (`~/.config/opencode/opencode.json`) - user preferences
3.  **Custom config** (`OPENCODE_CONFIG` env var) - custom overrides
4.  **Project config** (`opencode.json` in project) - project-specific settings
5.  **`.opencode` directories** - agents, commands, plugins
6.  **Inline config** (`OPENCODE_CONFIG_CONTENT` env var) - runtime overrides
7.  **Managed config files** (`/Library/Application Support/opencode/` on macOS) - admin-controlled
8.  **macOS managed preferences** (`.mobileconfig` via MDM) - highest priority, not user-overridable

This means project configs can override global defaults, and global configs can override remote organizational defaults. Managed settings override everything.

Note

The `.opencode` and `~/.config/opencode` directories use **plural names** for subdirectories: `agents/`, `commands/`, `modes/`, `plugins/`, `skills/`, `tools/`, and `themes/`. Singular names (e.g., `agent/`) are also supported for backwards compatibility.

---

### [Remote](#remote)

Organizations can provide default configuration via the `.well-known/opencode` endpoint. This is fetched automatically when you authenticate with a provider that supports it.

Remote config is loaded first, serving as the base layer. All other config sources (global, project) can override these defaults.

For example, if your organization provides MCP servers that are disabled by default:

Remote config from .well-known/opencode

```
{  "mcp": {    "jira": {      "type": "remote",      "url": "https://jira.example.com/mcp",      "enabled": false    }  }}
```

You can enable specific servers in your local config:

opencode.json

```
{  "mcp": {    "jira": {      "type": "remote",      "url": "https://jira.example.com/mcp",      "enabled": true    }  }}
```

---

### [Global](#global)

Place your global OpenCode config in `~/.config/opencode/opencode.json`. Use global config for user-wide server/runtime preferences like providers, models, and permissions.

For TUI-specific settings, use `~/.config/opencode/tui.json`.

Global config overrides remote organizational defaults.

---

### [Per project](#per-project)

Add `opencode.json` in your project root. Project config has the highest precedence among standard config files - it overrides both global and remote configs.

For project-specific TUI settings, add `tui.json` alongside it.

Tip

Place project specific config in the root of your project.

When OpenCode starts up, it looks for a config file in the current directory or traverse up to the nearest Git directory.

This is also safe to be checked into Git and uses the same schema as the global one.

---

### [Custom path](#custom-path)

Specify a custom config file path using the `OPENCODE_CONFIG` environment variable.

Terminal window

```
export OPENCODE_CONFIG=/path/to/my/custom-config.jsonopencode run "Hello world"
```

Custom config is loaded between global and project configs in the precedence order.

---

### [Custom directory](#custom-directory)

Specify a custom config directory using the `OPENCODE_CONFIG_DIR` environment variable. This directory will be searched for agents, commands, modes, and plugins just like the standard `.opencode` directory, and should follow the same structure.

Terminal window

```
export OPENCODE_CONFIG_DIR=/path/to/my/config-directoryopencode run "Hello world"
```

The custom directory is loaded after the global config and `.opencode` directories, so it **can override** their settings.

---

### [Managed settings](#managed-settings)

Organizations can enforce configuration that users cannot override. Managed settings are loaded at the highest priority tier.

#### [File-based](#file-based)

Drop an `opencode.json` or `opencode.jsonc` file in the system managed config directory:

Platform

Path

macOS

`/Library/Application Support/opencode/`

Linux

`/etc/opencode/`

Windows

`%ProgramData%\opencode`

These directories require admin/root access to write, so users cannot modify them.

#### [macOS managed preferences](#macos-managed-preferences)

On macOS, OpenCode reads managed preferences from the `ai.opencode.managed` preference domain. Deploy a `.mobileconfig` via MDM (Jamf, Kandji, FleetDM) and the settings are enforced automatically.

OpenCode checks these paths:

1.  `/Library/Managed Preferences/<user>/ai.opencode.managed.plist`
2.  `/Library/Managed Preferences/ai.opencode.managed.plist`

The plist keys map directly to `opencode.json` fields. MDM metadata keys (`PayloadUUID`, `PayloadType`, etc.) are stripped automatically.

**Creating a `.mobileconfig`**

Use the `ai.opencode.managed` PayloadType. The OpenCode config keys go directly in the payload dict:

```
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"  "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict>  <key>PayloadContent</key>  <array>    <dict>      <key>PayloadType</key>      <string>ai.opencode.managed</string>      <key>PayloadIdentifier</key>      <string>com.example.opencode.config</string>      <key>PayloadUUID</key>      <string>GENERATE-YOUR-OWN-UUID</string>      <key>PayloadVersion</key>      <integer>1</integer>      <key>share</key>      <string>disabled</string>      <key>server</key>      <dict>        <key>hostname</key>        <string>127.0.0.1</string>      </dict>      <key>permission</key>      <dict>        <key>*</key>        <string>ask</string>        <key>bash</key>        <dict>          <key>*</key>          <string>ask</string>          <key>rm -rf *</key>          <string>deny</string>        </dict>      </dict>    </dict>  </array>  <key>PayloadType</key>  <string>Configuration</string>  <key>PayloadIdentifier</key>  <string>com.example.opencode</string>  <key>PayloadUUID</key>  <string>GENERATE-YOUR-OWN-UUID</string>  <key>PayloadVersion</key>  <integer>1</integer></dict></plist>
```

Generate unique UUIDs with `uuidgen`. Customize the settings to match your organization’s requirements.

**Deploying via MDM**

-   **Jamf Pro:** Computers > Configuration Profiles > Upload > scope to target devices or smart groups
-   **FleetDM:** Add the `.mobileconfig` to your gitops repo under `mdm.macos_settings.custom_settings` and run `fleetctl apply`

**Verifying on a device**

Double-click the `.mobileconfig` to install locally for testing (shows in System Settings > Privacy & Security > Profiles), then run:

Terminal window

```
opencode debug config
```

All managed preference keys appear in the resolved config and cannot be overridden by user or project configuration.

---

## [Schema](#schema)

The server/runtime config schema is defined in [**`opencode.ai/config.json`**](https://opencode.ai/config.json).

TUI config uses [**`opencode.ai/tui.json`**](https://opencode.ai/tui.json).

Your editor should be able to validate and autocomplete based on the schema.

---

### [TUI](#tui)

Use a dedicated `tui.json` (or `tui.jsonc`) file for TUI-specific settings.

tui.json

```
{  "$schema": "https://opencode.ai/tui.json",  "scroll_speed": 3,  "scroll_acceleration": {    "enabled": true  },  "diff_style": "auto",  "mouse": true}
```

Use `OPENCODE_TUI_CONFIG` to point to a custom TUI config file.

Legacy `theme`, `keybinds`, and `tui` keys in `opencode.json` are deprecated and automatically migrated when possible.

---

### [Server](#server)

You can configure server settings for the `opencode serve` and `opencode web` commands through the `server` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "server": {    "port": 4096,    "hostname": "0.0.0.0",    "mdns": true,    "mdnsDomain": "myproject.local",    "cors": ["http://localhost:5173"]  }}
```

Available options:

-   `port` - Port to listen on.
-   `hostname` - Hostname to listen on. When `mdns` is enabled and no hostname is set, defaults to `0.0.0.0`.
-   `mdns` - Enable mDNS service discovery. This allows other devices on the network to discover your OpenCode server.
-   `mdnsDomain` - Custom domain name for mDNS service. Defaults to `opencode.local`. Useful for running multiple instances on the same network.
-   `cors` - Additional origins to allow for CORS when using the HTTP server from a browser-based client. Values must be full origins (scheme + host + optional port), eg `https://app.example.com`.

[Learn more about the server here](/docs/server).

---

### [Shell](#shell)

You can configure the shell used for the interactive terminal using the `shell` option. Compatible shells are also used for agent tool calls.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "shell": "pwsh"}
```

If not specified, OpenCode will automatically discover and use a sensible default based on your operating system (e.g. `pwsh` or `cmd.exe` on Windows, `/bin/zsh` or `/bin/bash` on macOS/Linux). You can provide an absolute path or a short name.

---

### [Tools](#tools)

You can manage the tools an LLM can use through the `tools` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "tools": {    "write": false,    "bash": false  }}
```

[Learn more about tools here](/docs/tools).

---

### [Models](#models)

You can configure the providers and models you want to use in your OpenCode config through the `provider`, `model` and `small_model` options.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "provider": {},  "model": "anthropic/claude-sonnet-4-5",  "small_model": "anthropic/claude-haiku-4-5"}
```

The `small_model` option configures a separate model for lightweight tasks like title generation. By default, OpenCode tries to use a cheaper model if one is available from your provider, otherwise it falls back to your main model.

Provider options can include `timeout`, `chunkTimeout`, and `setCacheKey`:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "provider": {    "anthropic": {      "options": {        "timeout": 600000,        "chunkTimeout": 30000,        "setCacheKey": true      }    }  }}
```

-   `timeout` - Request timeout in milliseconds (default: 300000). Set to `false` to disable.
-   `chunkTimeout` - Timeout in milliseconds between streamed response chunks. If no chunk arrives in time, the request is aborted.
-   `setCacheKey` - Ensure a cache key is always set for designated provider.

You can also configure [local models](/docs/models#local). [Learn more](/docs/models).

---

#### [Provider-Specific Options](#provider-specific-options)

Some providers support additional configuration options beyond the generic `timeout` and `apiKey` settings.

##### [Amazon Bedrock](#amazon-bedrock)

Amazon Bedrock supports AWS-specific configuration:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "provider": {    "amazon-bedrock": {      "options": {        "region": "us-east-1",        "profile": "my-aws-profile",        "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"      }    }  }}
```

-   `region` - AWS region for Bedrock (defaults to `AWS_REGION` env var or `us-east-1`)
-   `profile` - AWS named profile from `~/.aws/credentials` (defaults to `AWS_PROFILE` env var)
-   `endpoint` - Custom endpoint URL for VPC endpoints. This is an alias for the generic `baseURL` option using AWS-specific terminology. If both are specified, `endpoint` takes precedence.

Note

Bearer tokens (`AWS_BEARER_TOKEN_BEDROCK` or `/connect`) take precedence over profile-based authentication. See [authentication precedence](/docs/providers#authentication-precedence) for details.

[Learn more about Amazon Bedrock configuration](/docs/providers#amazon-bedrock).

---

### [Themes](#themes)

Set your UI theme in `tui.json`.

tui.json

```
{  "$schema": "https://opencode.ai/tui.json",  "theme": "tokyonight"}
```

[Learn more here](/docs/themes).

---

### [Agents](#agents)

You can configure specialized agents for specific tasks through the `agent` option.

opencode.jsonc

```
{  "$schema": "https://opencode.ai/config.json",  "agent": {    "code-reviewer": {      "description": "Reviews code for best practices and potential issues",      "model": "anthropic/claude-sonnet-4-5",      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",      "tools": {        // Disable file modification tools for review-only agent        "write": false,        "edit": false,      },    },  },}
```

You can also define agents using markdown files in `~/.config/opencode/agents/` or `.opencode/agents/`. [Learn more here](/docs/agents).

---

### [Default agent](#default-agent)

You can set the default agent using the `default_agent` option. This determines which agent is used when none is explicitly specified.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "default_agent": "plan"}
```

The default agent must be a primary agent (not a subagent). This can be a built-in agent like `"build"` or `"plan"`, or a [custom agent](/docs/agents) you’ve defined. If the specified agent doesn’t exist or is a subagent, OpenCode will fall back to `"build"` with a warning.

This setting applies across all interfaces: TUI, CLI (`opencode run`), desktop app, and GitHub Action.

---

### [Sharing](#sharing)

You can configure the [share](/docs/share) feature through the `share` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "share": "manual"}
```

This takes:

-   `"manual"` - Allow manual sharing via commands (default)
-   `"auto"` - Automatically share new conversations
-   `"disabled"` - Disable sharing entirely

By default, sharing is set to manual mode where you need to explicitly share conversations using the `/share` command.

---

### [Commands](#commands)

You can configure custom commands for repetitive tasks through the `command` option.

opencode.jsonc

```
{  "$schema": "https://opencode.ai/config.json",  "command": {    "test": {      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",      "description": "Run tests with coverage",      "agent": "build",      "model": "anthropic/claude-haiku-4-5",    },    "component": {      "template": "Create a new React component named $ARGUMENTS with TypeScript support.\nInclude proper typing and basic structure.",      "description": "Create a new component",    },  },}
```

You can also define commands using markdown files in `~/.config/opencode/commands/` or `.opencode/commands/`. [Learn more here](/docs/commands).

---

### [Keybinds](#keybinds)

Customize TUI keyboard shortcuts in `tui.json` with `keybinds`.

tui.json

```
{  "$schema": "https://opencode.ai/tui.json",  "keybinds": {    "command_list": "ctrl+p"  }}
```

`keybinds` is merged with built-in defaults, so you only need to configure the shortcuts you want to change.

[Learn more here](/docs/keybinds).

---

### [Snapshot](#snapshot)

OpenCode uses snapshots to track file changes during agent operations, enabling you to undo and revert changes within a session. Snapshots are enabled by default.

For large repositories or projects with many submodules, the snapshot system can cause slow indexing and significant disk usage as it tracks all changes using an internal git repository. You can disable snapshots using the `snapshot` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "snapshot": false}
```

Note that disabling snapshots means changes made by the agent cannot be rolled back through the UI.

---

### [Autoupdate](#autoupdate)

OpenCode will automatically download any new updates when it starts up. You can disable this with the `autoupdate` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "autoupdate": false}
```

If you don’t want updates but want to be notified when a new version is available, set `autoupdate` to `"notify"`. Notice that this only works if it was not installed using a package manager such as Homebrew.

---

### [Formatters](#formatters)

You can enable and configure code formatters through the `formatter` option. Omit it to keep formatters disabled.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "formatter": true}
```

Use an object to keep built-ins enabled while configuring overrides or custom formatters.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "formatter": {    "prettier": {      "disabled": true    },    "custom-prettier": {      "command": ["npx", "prettier", "--write", "$FILE"],      "environment": {        "NODE_ENV": "development"      },      "extensions": [".js", ".ts", ".jsx", ".tsx"]    }  }}
```

[Learn more about formatters here](/docs/formatters).

---

### [LSP Servers](#lsp-servers)

You can enable and configure LSP servers through the `lsp` option. Omit it to keep LSP disabled.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "lsp": true}
```

Use an object to keep built-ins enabled while configuring overrides or custom LSP servers.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "lsp": {    "typescript": {      "disabled": true    }  }}
```

[Learn more about LSP servers here](/docs/lsp).

---

### [Permissions](#permissions)

By default, opencode **allows all operations** without requiring explicit approval. You can change this using the `permission` option.

For example, to ensure that the `edit` and `bash` tools require user approval:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "permission": {    "edit": "ask",    "bash": "ask"  }}
```

[Learn more about permissions here](/docs/permissions).

---

### [Compaction](#compaction)

You can control context compaction behavior through the `compaction` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "compaction": {    "auto": true,    "prune": true,    "reserved": 10000  }}
```

-   `auto` - Automatically compact the session when context is full (default: `true`).
-   `prune` - Remove old tool outputs to save tokens (default: `true`).
-   `reserved` - Token buffer for compaction. Leaves enough window to avoid overflow during compaction

---

### [Watcher](#watcher)

You can configure file watcher ignore patterns through the `watcher` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "watcher": {    "ignore": ["node_modules/**", "dist/**", ".git/**"]  }}
```

Patterns follow glob syntax. Use this to exclude noisy directories from file watching.

---

### [MCP servers](#mcp-servers)

You can configure MCP servers you want to use through the `mcp` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "mcp": {}}
```

[Learn more here](/docs/mcp-servers).

---

### [Plugins](#plugins)

[Plugins](/docs/plugins) extend OpenCode with custom tools, hooks, and integrations.

Place plugin files in `.opencode/plugins/` or `~/.config/opencode/plugins/`. You can also load plugins from npm through the `plugin` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]}
```

[Learn more here](/docs/plugins).

---

### [Instructions](#instructions)

You can configure the instructions for the model you’re using through the `instructions` option.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]}
```

This takes an array of paths and glob patterns to instruction files. [Learn more about rules here](/docs/rules).

---

### [Disabled providers](#disabled-providers)

You can disable providers that are loaded automatically through the `disabled_providers` option. This is useful when you want to prevent certain providers from being loaded even if their credentials are available.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "disabled_providers": ["openai", "gemini"]}
```

Note

The `disabled_providers` takes priority over `enabled_providers`.

The `disabled_providers` option accepts an array of provider IDs. When a provider is disabled:

-   It won’t be loaded even if environment variables are set.
-   It won’t be loaded even if API keys are configured through the `/connect` command.
-   The provider’s models won’t appear in the model selection list.

---

### [Enabled providers](#enabled-providers)

You can specify an allowlist of providers through the `enabled_providers` option. When set, only the specified providers will be enabled and all others will be ignored.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "enabled_providers": ["anthropic", "openai"]}
```

This is useful when you want to restrict OpenCode to only use specific providers rather than disabling them one by one.

Note

The `disabled_providers` takes priority over `enabled_providers`.

If a provider appears in both `enabled_providers` and `disabled_providers`, the `disabled_providers` takes priority for backwards compatibility.

---

### [Experimental](#experimental)

The `experimental` key contains options that are under active development.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "experimental": {}}
```

Caution

Experimental options are not stable. They may change or be removed without notice.

---

## [Variables](#variables)

You can use variable substitution in your config files to reference environment variables and file contents.

---

### [Env vars](#env-vars)

Use `{env:VARIABLE_NAME}` to substitute environment variables:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "model": "{env:OPENCODE_MODEL}",  "provider": {    "anthropic": {      "models": {},      "options": {        "apiKey": "{env:ANTHROPIC_API_KEY}"      }    }  }}
```

If the environment variable is not set, it will be replaced with an empty string.

---

### [Files](#files)

Use `{file:path/to/file}` to substitute the contents of a file:

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "instructions": ["./custom-instructions.md"],  "provider": {    "openai": {      "options": {        "apiKey": "{file:~/.secrets/openai-key}"      }    }  }}
```

File paths can be:

-   Relative to the config file directory
-   Or absolute paths starting with `/` or `~`

These are useful for:

-   Keeping sensitive data like API keys in separate files.
-   Including large instruction files without cluttering your config.
-   Sharing common configuration snippets across multiple config files.

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/config.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: May 12, 2026
```

---

## Assistant (Plan · Big Pickle · 28.4s)

_Thinking:_

Now I have a comprehensive understanding of how OpenCode works with agents, rules, and skills. Let me put together a plan for the user.

The project is:
- Monorepo at `E:\Repo\SupplyCycle`
- `backend/` - Express + TypeScript + Prisma + PostgreSQL
- `mobile/` - Expo/React Native with Expo Router
- `whatsapp-bot/` - Empty (to be set up)
- Root `package.json` - just husky + commitlint

Key OpenCode concepts:
1. **AGENTS.md** - Project rules file (created via `/init`)
2. **`.opencode/agents/`** - Directory for defining custom agents as markdown files
3. **`.opencode/skills/`** - Directory for reusable skill definitions
4. **`opencode.json`** - Config file in project root

The plan should cover:

1. Create `opencode.json` in root - with agent configs for backend, mobile, whatsapp-bot
2. Create `.opencode/agents/` directory with markdown agent definitions
3. Create `.opencode/skills/` directory with skill definitions
4. Create `AGENTS.md` for project-wide rules
5. Optional: per-project `AGENTS.md` in each sub-project folder
6. Use `instructions` in opencode.json with glob patterns to load rules from sub-projects

Let me structure this properly.

For the folder structure:
```
SupplyCycle/
├── .opencode/
│   ├── agents/
│   │   ├── backend.md
│   │   ├── mobile.md
│   │   └── whatsapp.md
│   └── skills/
│       ├── backend/
│       │   └── SKILL.md
│       ├── mobile/
│       │   └── SKILL.md
│       └── whatsapp/
│           └── SKILL.md
├── opencode.json
├── AGENTS.md
├── backend/
│   └── ... (optional AGENTS.md per project)
├── mobile/
│   └── ... (optional AGENTS.md per project)
└── whatsapp-bot/
    └── ... (optional AGENTS.md per project)
```

For opencode.json, the key part is:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "backend": {
      "description": "Backend specialist - Express, Prisma, TypeScript",
      "mode": "primary",
      "prompt": "{file:.opencode/agents/backend.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd backend && *": "allow",
          "npx prisma *": "allow"
        }
      }
    },
    "mobile": {
      "description": "Mobile specialist - React Native, Expo",
      "mode": "primary",
      "prompt": "{file:.opencode/agents/mobile.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd mobile && *": "allow"
        }
      }
    },
    "whatsapp": {
      "description": "WhatsApp Bot specialist",
      "mode": "primary",
      "prompt": "{file:.opencode/agents/whatsapp.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd whatsapp-bot && *": "allow"
        }
      }
    }
  },
  "instructions": [
    "AGENTS.md",
    "backend/AGENTS.md",
    "mobile/AGENTS.md",
    "whatsapp-bot/AGENTS.md"
  ]
}
```

Wait, I need to think about this more carefully. The user wants to use the agents via OpenCode's agent system. Let me think about the best approach.

Option 1: Define all agents in `opencode.json` (JSON approach)
Option 2: Define agents as markdown files in `.opencode/agents/` (Markdown approach)
Option 3: Hybrid - use `opencode.json` for the general structure, reference prompt files

For flexibility and maintainability, I'd recommend:
- Use `.opencode/agents/` for agent definitions (markdown files are cleaner)
- Use `opencode.json` for configuration like `instructions` and global permissions
- Use `.opencode/skills/` for reusable skills

Actually, looking at the docs more carefully:

1. Agents markdown files in `.opencode/agents/` define the agent completely with frontmatter
2. You can also define agents in `opencode.json` with `agent` key
3. Skills go in `.opencode/skills/<name>/SKILL.md`

The markdown approach per agent is cleaner. Let me suggest that.

For each agent, they'd have a file like `.opencode/agents/backend.md`:
```markdown
---
description: Backend specialist for Express, Prisma, and TypeScript
mode: primary
model: anthropic/claude-sonnet-4-20250514
permission:
  edit: ask
  bash:
    "*": ask
    "cd backend && *": allow
    "npx prisma *": allow
---

You are a backend specialist for the SupplyCycle project...
```

But wait - there's a question: can you use `{file:...}` in markdown agent files? The docs say the prompt is the body of the markdown file. For JSON-defined agents, you can use `prompt: "{file:...}"`.

Let me structure this more carefully. I think the best approach is:

1. **`opencode.json`** - Main config with agents and instructions
2. **`.opencode/agents/backend.md`** - Custom prompt for backend agent
3. **`.opencode/agents/mobile.md`** - Custom prompt for mobile agent  
4. **`.opencode/agents/whatsapp.md`** - Custom prompt for whatsapp agent
5. **`AGENTS.md`** - Project-wide rules
6. **`backend/AGENTS.md`** - Backend-specific rules
7. **`mobile/AGENTS.md`** - Mobile-specific rules
8. **`whatsapp-bot/AGENTS.md`** - WhatsApp-bot-specific rules

Actually, looking at the docs more carefully:

The markdown approach: markdown files in `.opencode/agents/` define agents with frontmatter. The file name becomes the agent name.

So `.opencode/agents/backend.md` with frontmatter will create a `backend` agent.

But for the prompt/prompt file approach in JSON, you do:
```json
"agent": {
  "backend": {
    "prompt": "{file:prompts/backend.txt}"
  }
}
```

For the markdown approach, the body IS the prompt:
```markdown
---
description: ...
mode: primary
---
You are a backend specialist...
```

I think the cleanest approach for this project is:

1. Use `opencode.json` to define the agents, with a `prompt` referencing external files
2. Keep the agent prompts in `.opencode/prompts/` directory
3. Use `instructions` field to load AGENTS.md from root and sub-projects
4. Optionally create skills

Let me present a clear plan to the user.

Actually wait, I'm overthinking this. Let me re-read what the documentation says about the options.

From the docs:
- You can define agents in `opencode.json` (JSON)
- Or as markdown files in `.opencode/agents/` (Markdown)

For JSON approach:
```json
{
  "agent": {
    "backend": {
      "description": "...",
      "mode": "primary",
      "prompt": "{file:.opencode/prompts/backend.md}",
      "permission": {...}
    }
  }
}
```

For Markdown approach:
File `.opencode/agents/backend.md`:
```
---
description: ...
mode: primary
permission: ...
---
You are a backend specialist...
```

I think both are valid. The markdown approach is cleaner for complex prompts. Let me suggest the markdown approach for simplicity.

Wait, but there's a benefit to using `opencode.json` - you can have a single config file. Let me think about what's cleaner for the user...

I think the best approach is:
1. `opencode.json` for project-level configuration (instructions, etc.)
2. `.opencode/agents/` for agent definitions (markdown files with full frontmatter)

This separates concerns nicely.

Let me write the plan now.

Perfecto, ya tengo claro cómo funciona OpenCode y la estructura de tu proyecto. Aquí está el plan:

---

## Paso a Paso

### 1. Crear `opencode.json` en la raíz

Define los agentes como primary agents, y usa `instructions` para cargar reglas desde los subproyectos.

### 2. Crear `.opencode/agents/` con un archivo por agente

Cada agente se define como un archivo Markdown con frontmatter YAML. El nombre del archivo = nombre del agente.

```
.opencode/agents/
├── backend.md
├── mobile.md
└── whatsapp.md
```

Cada archivo incluye: `description`, `mode: primary`, `permission` (para restringir/permisos por directorio), y el cuerpo del prompt con las reglas específicas del agente.

### 3. Crear `AGENTS.md` en la raíz

Reglas globales del proyecto (workspace, stack común, convenciones generales).

### 4. Crear `AGENTS.md` opcional en cada subproyecto

- `backend/AGENTS.md` — stack: Express + Prisma + Zod + PostgreSQL, estructura de `src/`, comandos de dev/build/prisma
- `mobile/AGENTS.md` — stack: Expo SDK 54 + React Native 0.81 + Expo Router, comandos de lint/expo
- `whatsapp-bot/AGENTS.md` — (lo defines cuando crees el bot)

### 5. (Opcional) Skills reutilizables en `.opencode/skills/`

Por ejemplo, un skill de "prisma migration" o "expo build" que cualquier agente pueda invocar.

---

## Estructura de Carpetas Resultante

```
SupplyCycle/
├── opencode.json                    # Config principal: agents + instructions
├── AGENTS.md                        # Reglas globales del monorepo
├── .opencode/
│   ├── agents/
│   │   ├── backend.md               # Agente backend
│   │   ├── mobile.md                # Agente mobile
│   │   └── whatsapp.md              # Agente whatsapp-bot
│   └── skills/
│       ├── prisma-migrate/
│       │   └── SKILL.md
│       └── expo-build/
│           └── SKILL.md
├── backend/
│   ├── AGENTS.md                    # Reglas específicas del backend
│   ├── src/
│   ├── package.json
│   └── ...
├── mobile/
│   ├── AGENTS.md                    # Reglas específicas de mobile
│   ├── app/
│   ├── package.json
│   └── ...
└── whatsapp-bot/
    ├── AGENTS.md                    # Reglas específicas del bot
    ├── package.json
    └── ...
```

---

## Contenido de Referencia

**`opencode.json`** (en la raíz):
```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "backend": { "description": "Backend specialist", "mode": "primary" },
    "mobile": { "description": "Mobile specialist", "mode": "primary" },
    "whatsapp": { "description": "WhatsApp Bot specialist", "mode": "primary" }
  },
  "instructions": [
    "AGENTS.md",
    "backend/AGENTS.md",
    "mobile/AGENTS.md",
    "whatsapp-bot/AGENTS.md"
  ]
}
```

**`.opencode/agents/backend.md`** (agente de ejemplo):
```markdown
---
description: Backend specialist for Express, Prisma, TypeScript
mode: primary
color: success
permission:
  bash:
    "*": ask
    "cd backend && *": allow
    "npx prisma *": allow
---
Eres un especialista en backend. Stack: Express 5, TypeScript 6, Prisma 7, PostgreSQL, Zod.
Siempre trabajas dentro del directorio `backend/`.
```

---

## Cómo se Usa

- Abrís OpenCode en la raíz del proyecto y usás **Tab** para ciclar entre los 3 agentes primarios (build, plan, backend, mobile, whatsapp)
- O los invocás con `@backend`, `@mobile`, `@whatsapp` como subagentes
- Cada agente conoce solo su stack y restringe permisos a su directorio

---

¿Querés que proceda a implementar esta estructura? Si te parece bien, antes de arrancar necesito preguntarte: ¿qué modelo querés usar para cada agente? (ej: `anthropic/claude-sonnet-4-20250514` para todos, o uno más barato como `haiku` para tareas simples).

---

## User

{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "AGENTS.md",
    "my-app/AGENTS.md",
    "my-app/rules/*.md",
    "my-backend/AGENTS.md",
    "my-backend/rules/*.md"
  ],
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git status*": "allow",
      "git diff*": "allow"
    }
  },
  "agent": {
    "rn-dev": {
      "mode": "primary",
      "description": "Desarrolla en my-app (React Native / Expo)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#61DAFB",
      "prompt": "{file:.opencode/agents/rn-dev.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "npm test*": "allow",
          "npm run lint": "allow",
          "npx expo*": "allow"
        },
        "skill": {
          "react-native-*": "allow",
          "git-release": "allow"
        }
      }
    },
    "backend-dev": {
      "mode": "primary",
      "description": "Desarrolla en my-backend (Express + SQLite)",
      "model": "anthropic/claude-haiku-4-20250514",
      "color": "#68A063",
      "prompt": "{file:.opencode/agents/backend-dev.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "npm run dev": "allow",
          "npm run build": "allow",
          "npx tsx*": "allow"
        },
        "skill": {
          "express-*": "allow",
          "sqlite-*": "allow",
          "git-release": "allow"
        }
      }
    },
    "plan": {
      "mode": "primary",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  }
} Podes darme algo asi para mi repo actual, de git no quiero que haga nada por ahora. me gusta que para editar algo pregunte 

---

## Assistant (Plan · Big Pickle · 7.9s)

_Thinking:_

The user wants me to create a configuration similar to the example they provided, but adapted to their actual project structure. Let me re-read the requirements:

1. They want the same structure but for their actual repos: `backend/`, `mobile/`, `whatsapp-bot/`
2. They don't want git commands for now (remove git permissions)
3. They want `edit: ask` globally (ask before editing)
4. They want each agent focused on its own directory

Let me first explore the actual project structure more to understand the tech stack better, so I can write accurate prompts and commands for each agent.

I already know:
- `backend/` - Express + TypeScript + Prisma + PostgreSQL
- `mobile/` - Expo/React Native with Expo Router (SDK 54, RN 0.81)
- `whatsapp-bot/` - Empty directory

Let me look at the backend more closely to understand the scripts and structure, and also the mobile structure.

Since I'm in plan mode, I can only read files. Let me gather more info about the project to give accurate recommendations.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\features"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\src\features</path>
<type>directory</type>
<entries>
.gitkeep

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\config"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\src\config</path>
<type>directory</type>
<entries>
.gitkeep

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\lib"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\src\lib</path>
<type>directory</type>
<entries>
.gitkeep

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\prisma"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\prisma</path>
<type>directory</type>
<entries>
prisma.ts
schema.prisma

(2 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\features"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\features</path>
<type>directory</type>
<entries>
.gitkeep

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\components"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\components</path>
<type>directory</type>
<entries>
external-link.tsx
haptic-tab.tsx
hello-wave.tsx
parallax-scroll-view.tsx
themed-text.tsx
themed-view.tsx
ui/

(7 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\constants"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\constants</path>
<type>directory</type>
<entries>
theme.ts

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\app\\\\(tabs)"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\app\(tabs)</path>
<type>directory</type>
<entries>
_layout.tsx
explore.tsx
index.tsx

(3 entries)
</entries>
```

---

## Assistant (Plan · Big Pickle · 4.1s)

_Thinking:_

Let me also check the backend source files and some config files for more context.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\app.ts"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\src\app.ts</path>
<type>file</type>
<content>
1: import express from "express";
2: 
3: const app = express();
4: 
5: app.use(express.json());
6: 
7: app.get("/", (_req, res) => {
8:   res.status(200).json({
9:     message: "SupplyCycle backend is running",
10:   });
11: });
12: 
13: app.get("/health", (_req, res) => {
14:   res.status(200).json({
15:     status: "ok",
16:   });
17: });
18: 
19: export default app;

(End of file - total 19 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\server.ts"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\src\server.ts</path>
<type>file</type>
<content>
1: import dotenv from "dotenv";
2: import app from "./app.js";
3: 
4: dotenv.config();
5: 
6: const PORT = process.env.PORT || 3000;
7: 
8: app.listen(PORT, "0.0.0.0", () => {
9:   console.log(`Server running on http://localhost:${PORT}`);
10: });

(End of file - total 10 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\prisma\\schema.prisma"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\prisma\schema.prisma</path>
<type>file</type>
<content>
1: // This is your Prisma schema file,
2: // learn more about it in the docs: https://pris.ly/d/prisma-schema
3: 
4: // Get a free hosted Postgres database in seconds: `npx create-db`
5: 
6: generator client {
7:   provider = "prisma-client"
8:   output   = "../generated/prisma"
9: }
10: 
11: datasource db {
12:   provider = "postgresql"
13: }
14: 
15: /*
16: 
17: model User {
18:   id        Int      @id @default(autoincrement()) // serial
19:   email     String   @unique                       // único
20:   name      String                                 // requerido
21:   password  String                                 // requerido
22:   createdAt DateTime @default(now())               // timestamp automático
23:   updatedAt DateTime @updatedAt                    // auto update
24: }
25: 
26: Campos:
27: - id → serial (autoincrement)
28: - email → único
29: - name → string required
30: - password → string required
31: - createdAt → timestamp automático
32: - updatedAt → timestamp automático (se actualiza solo)
33: Otros tipos comunes:
34: model Product {
35:   id          Int     @id @default(autoincrement())
36:   sku         String  @unique
37:   name        String
38:   price       Decimal @db.Decimal(10, 2)
39:   stock       Int     @default(0)
40:   isActive    Boolean @default(true)
41:   createdAt   DateTime @default(now())
42: }
43: Para aplicar este modelo a la DB, una vez definido ejecutás:
44: npx prisma migrate dev --name init
45: 
46: 
47: */

(End of file - total 47 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\prisma\\prisma.ts"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\prisma\prisma.ts</path>
<type>file</type>
<content>
1: import "dotenv/config";
2: import { PrismaPg } from "@prisma/adapter-pg";
3: import { PrismaClient } from "../generated/prisma/client";
4: 
5: const connectionString = `${process.env.DATABASE_URL}`;
6: 
7: const adapter = new PrismaPg({ connectionString });
8: const prisma = new PrismaClient({ adapter });
9: 
10: export { prisma };

(End of file - total 10 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\tsconfig.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\tsconfig.json</path>
<type>file</type>
<content>
1: {
2:   "compilerOptions": {
3:     "target": "ES2022",
4:     "module": "NodeNext",
5:     "moduleResolution": "NodeNext",
6:     "moduleDetection": "force",
7:     "verbatimModuleSyntax": true,
8:     "rootDir": "./src",
9:     "outDir": "./dist",
10:     "strict": true,
11:     "esModuleInterop": true,
12:     "resolveJsonModule": true,
13:     "skipLibCheck": true,
14:     "forceConsistentCasingInFileNames": true,
15:     "noUncheckedIndexedAccess": true
16:   },
17:   "include": ["src"],
18:   "exclude": ["node_modules", "dist", "coverage", "__tests__"]
19: }

(End of file - total 19 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\app\\_layout.tsx"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\app\_layout.tsx</path>
<type>file</type>
<content>
1: import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
2: import { Stack } from 'expo-router';
3: import { StatusBar } from 'expo-status-bar';
4: import 'react-native-reanimated';
5: 
6: import { useColorScheme } from '@/hooks/use-color-scheme';
7: 
8: export const unstable_settings = {
9:   anchor: '(tabs)',
10: };
11: 
12: export default function RootLayout() {
13:   const colorScheme = useColorScheme();
14: 
15:   return (
16:     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
17:       <Stack>
18:         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
19:         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
20:       </Stack>
21:       <StatusBar style="auto" />
22:     </ThemeProvider>
23:   );
24: }

(End of file - total 24 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\tsconfig.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\tsconfig.json</path>
<type>file</type>
<content>
1: {
2:   "extends": "expo/tsconfig.base",
3:   "compilerOptions": {
4:     "strict": true,
5:     "paths": {
6:       "@/*": [
7:         "./*"
8:       ]
9:     }
10:   },
11:   "include": [
12:     "**/*.ts",
13:     "**/*.tsx",
14:     ".expo/types/**/*.ts",
15:     "expo-env.d.ts"
16:   ]
17: }

(End of file - total 17 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 34.0s)

_Thinking:_

Now I have a thorough understanding of the project. Let me also check if there's any middleware or utils folder.

Actually, I have enough info now. Let me present the plan to the user with the exact configuration adapted to their project.

Based on what they showed:
- They want a `rn-dev` agent (mobile)
- They want a `backend-dev` agent (backend)
- They also need a `whatsapp-dev` agent (whatsapp-bot)
- No git permissions (they don't want git commands for now)
- Global `edit: ask` (ask before editing)
- The example they gave uses `prompt: "{file:.opencode/agents/...}"` approach, which means agent files are in `.opencode/agents/` but they're NOT full markdown agent definitions - they're just prompt files referenced from opencode.json

Wait, let me re-read. The example has:
```json
"agent": {
  "rn-dev": {
    "mode": "primary",
    "description": "...",
    "model": "...",
    "color": "#61DAFB",
    "prompt": "{file:.opencode/agents/rn-dev.md}",
    "permission": {...}
  }
}
```

So the `prompt` references `.opencode/agents/rn-dev.md` which is just a plain markdown file containing the system prompt for that agent. The agent definition itself is in `opencode.json`.

This is the JSON approach to defining agents, where the prompt content is loaded from an external file.

Let me present the exact files needed.

For the file structure:
```
SupplyCycle/
├── opencode.json
├── AGENTS.md
├── .opencode/
│   ├── agents/
│   │   ├── rn-dev.md            # Prompt file for mobile agent
│   │   ├── backend-dev.md       # Prompt file for backend agent
│   │   └── whatsapp-dev.md      # Prompt file for whatsapp agent
│   └── skills/
│       └── ... 
├── backend/
│   └── AGENTS.md (optional)
├── mobile/
│   └── AGENTS.md (optional)
└── whatsapp-bot/
    └── AGENTS.md (optional)
```

Wait, in the example, the `instructions` references `my-app/AGENTS.md` and `my-backend/AGENTS.md` etc. The user wants the same for their repo. So I should also create AGENTS.md files in each subdirectory.

But hold on - the user also said `"instructions": ["AGENTS.md", "my-app/AGENTS.md", ...]`. In their case, this should be:
- `AGENTS.md` (root)
- `mobile/AGENTS.md`
- `backend/AGENTS.md`
- `whatsapp-bot/AGENTS.md`

And they may want rule files too: `backend/rules/*.md`, `mobile/rules/*.md`.

Let me think about what the user would want. The example has:
- `"my-app/AGENTS.md"` and `"my-app/rules/*.md"`
- `"my-backend/AGENTS.md"` and `"my-backend/rules/*.md"`

For them it would be:
- `"mobile/AGENTS.md"` and `"mobile/rules/*.md"`
- `"backend/AGENTS.md"` and `"backend/rules/*.md"`
- `"whatsapp-bot/AGENTS.md"` and `"whatsapp-bot/rules/*.md"`

But `rules/*.md` directories don't exist yet. We'll create them optionally.

Now the key difference from their example:
- They said "de git no quiero que haga nada por ahora" (no git stuff for now)
- They want `edit: ask` globally (ask before editing)
- They want each agent focused on their directory

Let me also check what scripts are available:
- Backend: `npm run dev` (tsx watch), `npm run build` (tsc), `npm run start` (node dist)
- Mobile: `npm start` (expo start), `npm run android`, `npm run ios`, `npm run web`, `npm run lint` (expo lint)
- Root: `npm run prepare` (husky)

OK, let me draft the complete plan.

For the user's exact requirements:
1. Same structure as their example adapted to their project
2. No git commands
3. `edit: ask` globally
4. `bash: ask` globally with specific allowlists per agent

Let me present this as a plan.

Claro, acá tenés la configuración exacta adaptada a tu repo actual. Primero te muestro el resumen, y luego los archivos uno por uno.

---

## Estructura que voy a crear

```
SupplyCycle/
├── opencode.json                    # Config principal
├── AGENTS.md                        # Reglas globales del monorepo
├── .opencode/
│   └── agents/
│       ├── rn-dev.md                # Prompt para mobile
│       ├── backend-dev.md           # Prompt para backend
│       └── whatsapp-dev.md          # Prompt para whatsapp-bot
├── backend/
│   ├── AGENTS.md                    # Reglas específicas del backend
│   └── rules/
├── mobile/
│   ├── AGENTS.md                    # Reglas específicas de mobile
│   └── rules/
└── whatsapp-bot/
    ├── AGENTS.md                    # Reglas específicas del bot
    └── rules/
```

---

## `opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "AGENTS.md",
    "backend/AGENTS.md",
    "backend/rules/*.md",
    "mobile/AGENTS.md",
    "mobile/rules/*.md",
    "whatsapp-bot/AGENTS.md",
    "whatsapp-bot/rules/*.md"
  ],
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "cd *": "ask"
    }
  },
  "agent": {
    "rn-dev": {
      "mode": "primary",
      "description": "Desarrolla en mobile (React Native / Expo)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#61DAFB",
      "prompt": "{file:.opencode/agents/rn-dev.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd mobile && *": "allow",
          "npm run lint": "allow",
          "npx expo*": "allow"
        }
      }
    },
    "backend-dev": {
      "mode": "primary",
      "description": "Desarrolla en backend (Express + Prisma + PostgreSQL)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#68A063",
      "prompt": "{file:.opencode/agents/backend-dev.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd backend && *": "allow",
          "npm run dev": "allow",
          "npm run build": "allow",
          "npx tsx*": "allow",
          "npx prisma*": "allow"
        }
      }
    },
    "whatsapp-dev": {
      "mode": "primary",
      "description": "Desarrolla en whatsapp-bot",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#25D366",
      "prompt": "{file:.opencode/agents/whatsapp-dev.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd whatsapp-bot && *": "allow"
        }
      }
    },
    "plan": {
      "mode": "primary",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  }
}
```

**Puntos clave:**
- `edit: ask` global → siempre pregunta antes de editar
- Sin permisos de `git *` en ningún lado → no toca git
- Cada agente tiene `edit: allow` para no preguntar两次 (porque ya preguntá global), pero podés cambiarlo a `ask` si querés que pregunte incluso dentro del agente
- `cd <directorio> && *` permite al agente operar libremente dentro de su carpeta sin preguntar

---

## `.opencode/agents/backend-dev.md`

```markdown
Eres un especialista en backend. Trabajas exclusivamente dentro de `backend/`.

## Stack
- **Runtime:** Node.js (TypeScript 6, ESModules)
- **Framework:** Express 5
- **ORM:** Prisma 7 + PostgreSQL
- **Validación:** Zod 4
- **Auth:** bcrypt + jsonwebtoken
- **Logging:** pino + morgan
- **Seguridad:** helmet + cors

## Scripts
- `npm run dev` → `tsx watch src/server.ts` (desarrollo)
- `npm run build` → `tsc` (compilar)
- `npx prisma migrate dev --name <name>` → migraciones
- `npx prisma studio` → UI de Prisma

## Estructura
```
src/
├── app.ts              # App Express
├── server.ts           # Entry point (dotenv + listen)
├── config/             # Configuraciones
├── features/           # Módulos por feature
├── lib/                # Utilidades compartidas
├── middleware/          # Middlewares Express
└── utils/              # Helpers
prisma/
├── schema.prisma       # Schema DB
└── prisma.ts           # Cliente Prisma singleton
```

## Convenciones
- Usar `verbatimModuleSyntax` → imports tipo `import type`
- Preferir `import` ESM con extensión `.js` en imports locales
- Errores con Zod + tipos estrictos (`noUncheckedIndexedAccess`)
- Prisma adapter: `@prisma/adapter-pg` con connection string
```

---

## `.opencode/agents/rn-dev.md`

```markdown
Eres un especialista en mobile. Trabajas exclusivamente dentro de `mobile/`.

## Stack
- **Framework:** React Native 0.81 + Expo SDK 54
- **Router:** Expo Router 6 (file-based routing)
- **UI:** @react-navigation (bottom-tabs + stack)
- **Animaciones:** react-native-reanimated
- **Gestos:** react-native-gesture-handler + react-native-safe-area-context

## Scripts
- `npm start` → `expo start`
- `npm run android` → build para Android
- `npm run ios` → build para iOS
- `npm run lint` → `expo lint`

## Estructura
```
mobile/
├── app/                 # Expo Router (file-based routes)
│   ├── _layout.tsx      # Layout raíz (Stack navigator)
│   ├── (tabs)/          # Bottom tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── explore.tsx
│   └── modal.tsx
├── components/          # Componentes reutilizables
├── constants/           # Temas, colores
├── features/            # Módulos por feature
└── hooks/               # Custom hooks
```

## Convenciones
- Path alias `@/` mapea a `mobile/` raíz
- Usar `useColorScheme()` de `@/hooks/use-color-scheme` para theme
- Componentes en `components/` + `components/ui/`
- Temas y constantes en `constants/theme.ts`
```

---

## `.opencode/agents/whatsapp-dev.md`

```markdown
Eres un especialista en bots de WhatsApp. Trabajas exclusivamente dentro de `whatsapp-bot/`.

## Stack (por definir)
Actualmente `whatsapp-bot/` está vacío. Vas a definir el stack ideal.
Sugerencias: whatshisname/whatsapp-web.js, Baileys, o Twilio WhatsApp API.

## Scripts
A definir cuando se configure el proyecto.

## Convenciones
- TypeScript siempre que sea posible
- Usar el mismo estilo que el backend (mismo lint, mismo tsconfig base)
```

---

## `AGENTS.md` (raíz)

```markdown
# SupplyCycle Monorepo

Monorepo con 3 proyectos independientes:
- `backend/` — API Express + Prisma + PostgreSQL
- `mobile/` — App React Native + Expo
- `whatsapp-bot/` — Bot de WhatsApp

## Reglas generales
- Usar `@rn-dev` para cambios en mobile
- Usar `@backend-dev` para cambios en backend
- Usar `@whatsapp-dev` para cambios en whatsapp-bot
- NO hacer cambios de configuración de git ni commits
- Preguntar antes de editar archivos externos al directorio del agente
```

---

## `backend/AGENTS.md`

```markdown
# Backend — Express + Prisma + PostgreSQL

## Stack
- Node.js, TypeScript 6 (ESModules, NodeNext)
- Express 5, cors, helmet, morgan, pino
- Prisma 7 + PostgreSQL (@prisma/adapter-pg)
- Zod 4, bcrypt, jsonwebtoken

## Comandos importantes
- Dev: `npm run dev`
- Build: `npm run build`
- Prisma migrate: `npx prisma migrate dev --name <name>`
- Prisma generate: `npx prisma generate`

## Convenciones
- imports ESM con extensión .js
- type imports con `verbatimModuleSyntax`
- Prisma client en `prisma/prisma.ts` (singleton con adapter-pg)
- Schema en `prisma/schema.prisma` (provider: postgresql)
```

---

## `mobile/AGENTS.md`

```markdown
# Mobile — React Native + Expo SDK 54

## Stack
- Expo SDK 54, React Native 0.81
- Expo Router 6 (file-based routing en `app/`)
- @react-navigation/bottom-tabs + native-stack
- react-native-reanimated
- react-native-gesture-handler
- TypeScript ~5.9

## Comandos importantes
- Start: `npm start`
- Android: `npm run android`
- iOS: `npm run ios`
- Lint: `npm run lint`

## Convenciones
- Path alias `@/` → raíz de mobile
- Componentes UI en `components/ui/`
- Temas en `constants/theme.ts`
- Hooks en `hooks/`
- Pantallas/rutas en `app/` (Expo Router)
```

---

## `whatsapp-bot/AGENTS.md`

```markdown
# WhatsApp Bot

Proyecto nuevo — pendiente de configuración inicial.
```

---

¿Te parece bien este plan? Si querés ajustar algo (colores, modelos, comandos permitidos, o contenido de los prompts) decime antes de que lo implemente.

---

## User

Dame devuelta todo pero con los nombres de los agentes backend.md mobile.md y whatsapp-bot.md porfavor. ahora whatsapp-bot tiene contenido

---

## Assistant (Plan · Big Pickle · 4.8s)

_Thinking:_

The user wants me to:
1. Change agent names from `rn-dev`, `backend-dev`, `whatsapp-dev` to `backend`, `mobile`, `whatsapp-bot`
2. Update the whatsapp-bot since it now has content (it was empty before)
3. Stay in plan mode (read-only)

Let me check what's in whatsapp-bot now since the user says it has content.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot</path>
<type>directory</type>
<entries>
.dockerignore
.gitignore
AGENTS.md
assets/
Dockerfile
eslint.config.js
nodemon.json
package.json
README.md
rollup.config.js
rules/
src/
tsconfig.json

(13 entries)
</entries>
```

---

## Assistant (Plan · Big Pickle · 4.5s)

_Thinking:_

Let me explore whatsapp-bot more to understand its stack.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\package.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\package.json</path>
<type>file</type>
<content>
1: {
2:   "name": "whatsapp-bot",
3:   "version": "1.0.0",
4:   "description": "",
5:   "main": "dist/app.js",
6:   "type": "module",
7:   "scripts": {
8:     "start": "node ./dist/app.js",
9:     "lint": "eslint . --no-ignore",
10:     "dev": "npm run lint && nodemon --signal SIGKILL  ./src/app.ts",
11:     "build": "npx rollup -c"
12:   },
13:   "keywords": [],
14:   "dependencies": {
15:     "@builderbot/bot": "1.4.1",
16:     "@builderbot/provider-meta": "1.4.1",
17:     "@builderbot/database-postgres": "1.4.1"
18:   },
19:   "devDependencies": {
20:     "@types/node": "^25.0.0",
21:     "typescript-eslint": "^8.0.0",
22:     "eslint": "^9.0.0",
23:     "eslint-plugin-builderbot": "latest",
24:     "rollup": "^4.10.0",
25:     "nodemon": "^3.1.11",
26:     "rollup-plugin-typescript2": "^0.36.0",
27:     "tsx": "^4.7.1",
28:     "typescript": "^5.4.3"
29:   },
30:   "author": "",
31:   "license": "ISC"
32: }

(End of file - total 32 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\tsconfig.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\tsconfig.json</path>
<type>file</type>
<content>
1: {
2:   "compilerOptions": {
3:     "target": "ES2022",
4:     "module": "ES2022",
5:     "declaration": false,
6:     "declarationMap": false,
7:     "moduleResolution": "node",
8:     "removeComments": true,
9:     "emitDecoratorMetadata": true,
10:     "experimentalDecorators": true,
11:     "allowSyntheticDefaultImports": true,
12:     "sourceMap": false,
13:     "outDir": "./dist",
14:     "baseUrl": "./",
15:     "rootDir": "./",
16:     "incremental": true,
17:     "skipLibCheck": true,
18:     "paths": {
19:       "~/*": ["./src/*"]
20:     }
21:   },
22:   "include": [
23:     "**/*.js",
24:     "**/*.ts"
25:   ],
26:   "exclude": [
27:     "node_modules",
28:     "dist",
29:     "**/*.test.ts",
30:     "**/*.spec.ts",
31:     "**e2e**",
32:     "**mock**"
33:   ]
34: }

(End of file - total 34 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\src"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\src</path>
<type>directory</type>
<entries>
app.ts

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\AGENTS.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\AGENTS.md</path>
<type>file</type>
<content>


(End of file - total 0 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\eslint.config.js"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\eslint.config.js</path>
<type>file</type>
<content>
1: import tseslint from 'typescript-eslint'
2: import builderbot from 'eslint-plugin-builderbot'
3: 
4: export default [
5:     {
6:         ignores: ['dist/**', 'node_modules/**', 'rollup.config.js'],
7:     },
8:     ...tseslint.configs.recommended,
9:     {
10:         plugins: {
11:             builderbot,
12:         },
13:         languageOptions: {
14:             ecmaVersion: 'latest',
15:             sourceType: 'module',
16:         },
17:         rules: {
18:             ...builderbot.configs.recommended.rules,
19:             '@typescript-eslint/no-explicit-any': 'off',
20:             '@typescript-eslint/no-unused-vars': 'off',
21:             '@typescript-eslint/ban-ts-comment': 'off',
22:             'no-unsafe-optional-chaining': 'off',
23:         },
24:     },
25: ]

(End of file - total 25 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\nodemon.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\nodemon.json</path>
<type>file</type>
<content>
1: {
2:     "watch": ["src"],
3:     "ext": "ts",
4:     "ignore": [
5:       "**/*.test.ts",
6:       "**/*.spec.ts"
7:   ],
8:     "delay": "3",
9:     "execMap": {
10:       "ts": "tsx"
11:     }
12:   }

(End of file - total 12 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\rollup.config.js"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\rollup.config.js</path>
<type>file</type>
<content>
1: import typescript from 'rollup-plugin-typescript2'
2: 
3: export default {
4:     input: 'src/app.ts',
5:     output: {
6:         file: 'dist/app.js',
7:         format: 'esm',
8:     },
9:     onwarn: (warning) => {
10:         if (warning.code === 'UNRESOLVED_IMPORT') return
11:     },
12:     plugins: [typescript()],
13: }

(End of file - total 13 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\README.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\README.md</path>
<type>file</type>
<content>
1: <p align="center">
2:   <a href="https://builderbot.app/">
3:     <picture>
4:       <img src="https://builderbot.app/assets/thumbnail-vector.png" height="80">
5:     </picture>
6:     <h2 align="center">BuilderBot</h2>
7:   </a>
8: </p>
9: 
10: 
11: 
12: <p align="center">
13:   <a aria-label="NPM version" href="https://www.npmjs.com/package/@builderbot/bot">
14:     <img alt="" src="https://img.shields.io/npm/v/@builderbot/bot?color=%2300c200&label=%40bot-whatsapp">
15:   </a>
16:   <a aria-label="Join the community on GitHub" href="https://link.codigoencasa.com/DISCORD">
17:     <img alt="" src="https://img.shields.io/discord/915193197645402142?logo=discord">
18:   </a>
19: </p>
20: 
21: 
22: ## Getting Started
23: 
24: With this library, you can build automated conversation flows agnostic to the WhatsApp provider, set up automated responses for frequently asked questions, receive and respond to messages automatically, and track interactions with customers. Additionally, you can easily set up triggers to expand functionalities limitlessly.
25: 
26: ```
27: npm create builderbot@latest
28: ```
29: 
30: 
31: ## Documentation
32: 
33: Visit [builderbot](https://builderbot.app/) to view the full documentation.
34: 
35: 
36: ## Official Course
37: 
38: If you want to discover all the functions and features offered by the library you can take the course.
39: [View Course](https://app.codigoencasa.com/courses/builderbot?refCode=LEIFER)
40: 
41: 
42: ## Contact Us
43: - [💻 Discord](https://link.codigoencasa.com/DISCORD)
44: - [👌 𝕏 (Twitter)](https://twitter.com/leifermendez)

(End of file - total 44 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 4.3s)

_Thinking:_

Now let me also check the src/app.ts of whatsapp-bot and the assets folder, and also the backend's middleware and utils directories.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\src\\app.ts"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\src\app.ts</path>
<type>file</type>
<content>
1: import { join } from 'path'
2: import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
3: import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
4: import { MetaProvider as Provider } from '@builderbot/provider-meta'
5: 
6: const PORT = process.env.PORT ?? 3008
7: 
8: const discordFlow = addKeyword<Provider, Database>('doc').addAnswer(
9:     ['You can see the documentation here', '📄 https://builderbot.app/docs \n', 'Do you want to continue? *yes*'].join(
10:         '\n'
11:     ),
12:     { capture: true },
13:     async (ctx, { gotoFlow, flowDynamic }) => {
14:         if (ctx.body.toLocaleLowerCase().includes('yes')) {
15:             return gotoFlow(registerFlow)
16:         }
17:         await flowDynamic('Thanks!')
18:         return
19:     }
20: )
21: 
22: const welcomeFlow = addKeyword<Provider, Database>(['hi', 'hello', 'hola'])
23:     .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
24:     .addAnswer(
25:         [
26:             'I share with you the following links of interest about the project',
27:             '👉 *doc* to view the documentation',
28:         ].join('\n'),
29:         { delay: 800, capture: true },
30:         async (ctx, { fallBack }) => {
31:             if (!ctx.body.toLocaleLowerCase().includes('doc')) {
32:                 return fallBack('You should type *doc*')
33:             }
34:             return
35:         },
36:         [discordFlow]
37:     )
38: 
39: const registerFlow = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
40:     .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
41:         await state.update({ name: ctx.body })
42:     })
43:     .addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
44:         await state.update({ age: ctx.body })
45:     })
46:     .addAction(async (_, { flowDynamic, state }) => {
47:         await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
48:     })
49: 
50: const fullSamplesFlow = addKeyword<Provider, Database>(['samples', utils.setEvent('SAMPLES')])
51:     .addAnswer(`💪 I'll send you a lot files...`)
52:     .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
53:     .addAnswer(`Send video from URL`, {
54:         media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
55:     })
56:     .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
57:     .addAnswer(`Send file from URL`, {
58:         media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
59:     })
60: 
61: const main = async () => {
62:     const adapterFlow = createFlow([welcomeFlow, registerFlow, fullSamplesFlow])
63:     const adapterProvider = createProvider(Provider, {
64:         jwtToken: 'jwtToken',
65:         numberId: 'numberId',
66:         verifyToken: 'verifyToken',
67:         version: 'v18.0'
68:     })
69:     const adapterDB = new Database({
70:        host: process.env.POSTGRES_DB_HOST,
71:        user: process.env.POSTGRES_DB_USER,
72:        database: process.env.POSTGRES_DB_NAME,
73:        password: process.env.POSTGRES_DB_PASSWORD,
74:        port: +process.env.POSTGRES_DB_PORT
75:    })
76: 
77:     const { handleCtx, httpServer } = await createBot({
78:         flow: adapterFlow,
79:         provider: adapterProvider,
80:         database: adapterDB,
81:     })
82: 
83:     adapterProvider.server.post(
84:         '/v1/messages',
85:         handleCtx(async (bot, req, res) => {
86:             const { number, message, urlMedia } = req.body
87:             await bot.sendMessage(number, message, { media: urlMedia ?? null })
88:             return res.end('sended')
89:         })
90:     )
91: 
92:     adapterProvider.server.post(
93:         '/v1/register',
94:         handleCtx(async (bot, req, res) => {
95:             const { number, name } = req.body
96:             await bot.dispatch('REGISTER_FLOW', { from: number, name })
97:             return res.end('trigger')
98:         })
99:     )
100: 
101:     adapterProvider.server.post(
102:         '/v1/samples',
103:         handleCtx(async (bot, req, res) => {
104:             const { number, name } = req.body
105:             await bot.dispatch('SAMPLES', { from: number, name })
106:             return res.end('trigger')
107:         })
108:     )
109: 
110:     adapterProvider.server.post(
111:         '/v1/blacklist',
112:         handleCtx(async (bot, req, res) => {
113:             const { number, intent } = req.body
114:             if (intent === 'remove') bot.blacklist.remove(number)
115:             if (intent === 'add') bot.blacklist.add(number)
116: 
117:             res.writeHead(200, { 'Content-Type': 'application/json' })
118:             return res.end(JSON.stringify({ status: 'ok', number, intent }))
119:         })
120:     )
121: 
122:     adapterProvider.server.get(
123:         '/v1/blacklist/list',
124:         handleCtx(async (bot, req, res) => {
125:             const blacklist = bot.blacklist.getList()
126:             res.writeHead(200, { 'Content-Type': 'application/json' })
127:             return res.end(JSON.stringify({ status: 'ok', blacklist }))
128:         })
129:     )
130: 
131:     httpServer(+PORT)
132: }
133: 
134: main()

(End of file - total 134 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\assets"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\assets</path>
<type>directory</type>
<entries>
sample.png

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\middeware"
}
```

**Error:**
```
File not found: E:\Repo\SupplyCycle\backend\src\middeware
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\utils"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\src\utils</path>
<type>directory</type>
<entries>
.gitkeep

(1 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\hooks"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\hooks</path>
<type>directory</type>
<entries>
use-color-scheme.ts
use-color-scheme.web.ts
use-theme-color.ts

(3 entries)
</entries>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\middeware"
}
```

**Error:**
```
File not found: E:\Repo\SupplyCycle\backend\src\middeware
```

---

## Assistant (Plan · Big Pickle · 3.6s)

_Thinking:_

Now I have a full picture:

- `whatsapp-bot/` uses **BuilderBot** (1.4.1) + Meta Provider (WhatsApp API) + PostgreSQL, TypeScript, built with Rollup, run with nodemon/tsx
- `backend/` uses Express + Prisma + PostgreSQL, already well known
- `mobile/` uses Expo + React Native, already well known

Let me also check if the middleware folder has a different spelling.

**Tool: glob**

**Input:**
```json
{
  "pattern": "backend/src/*ddle*"
}
```

**Output:**
```
No files found
```

---

## Assistant (Plan · Big Pickle · 3.2s)

_Thinking:_

OK so the middleware directory doesn't exist yet (or was misspelled in my earlier read). The original backend listing showed `middleware/` in the directory, let me re-check.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\src\\middleware"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\src\middleware</path>
<type>directory</type>
<entries>
.gitkeep

(1 entries)
</entries>
```

---

## Assistant (Plan · Big Pickle · 24.1s)

_Thinking:_

OK, it was just my earlier typo when looking for "middeware" instead of "middleware". Good, now I have all the info.

Now let me present the revised plan with the new agent names (`backend`, `mobile`, `whatsapp-bot`) and updated whatsapp-bot content.

Let me compile everything.

Listo, ahora con los nombres `backend`, `mobile`, `whatsapp-bot` y la info actualizada del bot (BuilderBot + Meta Provider).

---

## Estructura final

```
SupplyCycle/
├── opencode.json
├── AGENTS.md
├── .opencode/
│   └── agents/
│       ├── backend.md
│       ├── mobile.md
│       └── whatsapp-bot.md
├── backend/
│   ├── AGENTS.md
│   └── rules/
├── mobile/
│   ├── AGENTS.md
│   └── rules/
└── whatsapp-bot/
    ├── AGENTS.md
    └── rules/
```

---

## `opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "AGENTS.md",
    "backend/AGENTS.md",
    "backend/rules/*.md",
    "mobile/AGENTS.md",
    "mobile/rules/*.md",
    "whatsapp-bot/AGENTS.md",
    "whatsapp-bot/rules/*.md"
  ],
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask"
    }
  },
  "agent": {
    "backend": {
      "mode": "primary",
      "description": "Desarrolla en backend (Express + Prisma + PostgreSQL)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#68A063",
      "prompt": "{file:.opencode/agents/backend.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd backend && *": "allow",
          "npm run dev": "allow",
          "npm run build": "allow",
          "npx tsx*": "allow",
          "npx prisma*": "allow"
        }
      }
    },
    "mobile": {
      "mode": "primary",
      "description": "Desarrolla en mobile (React Native / Expo)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#61DAFB",
      "prompt": "{file:.opencode/agents/mobile.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd mobile && *": "allow",
          "npm run lint": "allow",
          "npx expo*": "allow"
        }
      }
    },
    "whatsapp-bot": {
      "mode": "primary",
      "description": "Desarrolla en whatsapp-bot (BuilderBot + Meta API)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#25D366",
      "prompt": "{file:.opencode/agents/whatsapp-bot.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd whatsapp-bot && *": "allow",
          "npm run dev": "allow",
          "npm run build": "allow",
          "npm run lint": "allow"
        }
      }
    },
    "plan": {
      "mode": "primary",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  }
}
```

---

## `.opencode/agents/backend.md`

```markdown
Eres un especialista en backend. Trabajas exclusivamente dentro de `backend/`.

## Stack
- **Runtime:** Node.js, TypeScript 6, ESModules (NodeNext)
- **Framework:** Express 5
- **ORM:** Prisma 7 + PostgreSQL via @prisma/adapter-pg
- **Validación:** Zod 4
- **Auth:** bcrypt + jsonwebtoken
- **Logging:** pino + morgan
- **Seguridad:** helmet + cors

## Scripts
- `npm run dev` → `tsx watch src/server.ts`
- `npm run build` → `tsc`
- `npm run start` → `node dist/server.js`
- `npx prisma migrate dev --name <name>` → migraciones
- `npx prisma studio` → UI

## Estructura
```
src/
├── app.ts         # App Express
├── server.ts      # Entry point (dotenv + listen en 0.0.0.0)
├── config/
├── constants/
├── features/
├── lib/
├── middleware/
└── utils/
prisma/
├── schema.prisma  # provider: postgresql
└── prisma.ts      # Cliente singleton con adapter-pg
```

## Convenciones
- `verbatimModuleSyntax` → usar `import type` en lugar de `import` para tipos
- imports ESM con extensión `.js` en rutas locales
- `noUncheckedIndexedAccess` activo → siempre checkear optional chaining
- Prisma client generado en `generated/prisma/`
```

---

## `.opencode/agents/mobile.md`

```markdown
Eres un especialista en mobile. Trabajas exclusivamente dentro de `mobile/`.

## Stack
- **Framework:** React Native 0.81 + Expo SDK 54
- **Router:** Expo Router 6 (file-based routing en app/)
- **Navegación:** @react-navigation (bottom-tabs + native-stack)
- **Animaciones:** react-native-reanimated
- **Gestos:** react-native-gesture-handler + react-native-safe-area-context

## Scripts
- `npm start` → `expo start`
- `npm run android` → build APK
- `npm run ios` → build IPA
- `npm run web` → web version
- `npm run lint` → `expo lint`

## Estructura
```
app/             # Expo Router (file-based)
├── _layout.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── explore.tsx
└── modal.tsx
components/      # Reutilizables (themed-text, ui/, etc.)
constants/       # theme.ts (colores, estilos)
features/        # Módulos por feature
hooks/           # use-color-scheme, use-theme-color
```

## Convenciones
- Path alias `@/` → raíz de `mobile/`
- Usar `useColorScheme()` de `@/hooks/use-color-scheme` para dark/light mode
- Componentes de UI atómicos en `components/ui/`
- Temas en `constants/theme.ts`
```

---

## `.opencode/agents/whatsapp-bot.md`

```markdown
Eres un especialista en chatbots de WhatsApp. Trabajas exclusivamente dentro de `whatsapp-bot/`.

## Stack
- **Framework:** BuilderBot 1.4.1 (@builderbot/bot)
- **Provider:** Meta WhatsApp API (@builderbot/provider-meta)
- **DB:** PostgreSQL (@builderbot/database-postgres)
- **Build:** Rollup + rollup-plugin-typescript2
- **Runtime:** TypeScript 5.4, ES2022 modules
- **Dev:** nodemon + tsx

## Scripts
- `npm run dev` → lint + nodemon con tsx (src/app.ts)
- `npm run build` → `npx rollup -c` → dist/app.js
- `npm run start` → `node ./dist/app.js`
- `npm run lint` → eslint + typescript-eslint

## Estructura
```
src/
└── app.ts              # Bot entry point
assets/
└── sample.png          # Media de ejemplo
```

## Arquitectura
El bot usa **flows** (conversaciones modulares):
- `welcomeFlow` → saludo + keywords (hi/hello/hola)
- `discordFlow` → subflow anidado con captura de input
- `registerFlow` → captura nombre/edad con state
- `fullSamplesFlow` → envía media (image, video, audio, file)

Endpoints HTTP expuestos por el provider:
- POST `/v1/messages` → enviar mensajes
- POST `/v1/register` → disparar REGISTER_FLOW
- POST `/v1/samples` → disparar SAMPLES
- POST `/v1/blacklist` → add/remove de blacklist
- GET `/v1/blacklist/list` → listar blacklist

Provider config: jwtToken, numberId, verifyToken, version v18.0

## Convenciones
- ESLint con plugin builderbot + typescript-eslint
- `@typescript-eslint/no-explicit-any: off` (permitido por el framework)
- Path alias `~/` → `src/`
- Variables de entorno para DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, etc.
```

---

## `AGENTS.md` (raíz)

```markdown
# SupplyCycle Monorepo

Monorepo con 3 proyectos independientes:
- `backend/` — API Express + Prisma + PostgreSQL
- `mobile/` — App React Native + Expo
- `whatsapp-bot/` — Bot WhatsApp con BuilderBot + Meta API

## Reglas generales
- Usar `@backend` para cambios en backend/
- Usar `@mobile` para cambios en mobile/
- Usar `@whatsapp-bot` para cambios en whatsapp-bot/
- NO hacer cambios de configuración git ni commits
- Preguntar antes de editar archivos (edit: ask global)
```

---

## `backend/AGENTS.md`

```markdown
# Backend — Express + Prisma + PostgreSQL

## Stack
Node.js, TypeScript 6 (ESModules, NodeNext), Express 5, Prisma 7 + PostgreSQL (@prisma/adapter-pg), Zod 4, bcrypt, jsonwebtoken, pino, morgan, helmet, cors

## Comandos
- Dev: `npm run dev` (tsx watch)
- Build: `npm run build` (tsc)
- Prisma migrate: `npx prisma migrate dev --name <name>`
- Prisma generate: `npx prisma generate`

## Convenciones
- imports ESM con extensión .js
- type imports con verbatimModuleSyntax
- Prisma client singleton en `prisma/prisma.ts`
- Schema provider: postgresql
```

---

## `mobile/AGENTS.md`

```markdown
# Mobile — React Native + Expo SDK 54

## Stack
Expo SDK 54, React Native 0.81, Expo Router 6, @react-navigation (bottom-tabs + native-stack), react-native-reanimated, react-native-gesture-handler, TypeScript ~5.9

## Comandos
- Start: `npm start`
- Android: `npm run android`
- iOS: `npm run ios`
- Lint: `npm run lint`

## Convenciones
- Path alias `@/` → raíz de mobile
- Componentes UI en `components/ui/`
- Temas en `constants/theme.ts`
- Hooks en `hooks/`
- Pantallas/rutas en `app/` (Expo Router)
```

---

## `whatsapp-bot/AGENTS.md`

```markdown
# WhatsApp Bot — BuilderBot + Meta API

## Stack
BuilderBot 1.4.1 (@builderbot/bot, @builderbot/provider-meta, @builderbot/database-postgres), TypeScript 5.4, Rollup, nodemon + tsx

## Comandos
- Dev: `npm run dev` (lint + nodemon + tsx)
- Build: `npm run build` (rollup -c → dist/app.js)
- Start: `npm run start` (node dist/app.js)
- Lint: `npm run lint` (eslint + typescript-eslint)

## Convenciones
- ESLint con plugin builderbot + typescript-eslint
- Path alias `~/` → `src/`
- Provider Meta: jwtToken, numberId, verifyToken, v18.0
- DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT
```

---

Todo listo para implementar. ¿Aprobás los archivos o querés cambiar algo?

---

## User

Ahora dame alguna rules de ejemplo

---

## Assistant (Plan · Big Pickle · 16.2s)

_Thinking:_

The user wants example rules files in the `rules/` directories. Let me think about what kind of rules would be useful for each project. These would be modular, reusable rule files that complement the AGENTS.md.

Common patterns for rules:
- Coding style / code conventions
- Git commit conventions
- Testing patterns
- Architecture decisions
- PR review checklist
- Error handling patterns
- Security guidelines

Let me provide examples of useful rule files for each project.

Acá van ejemplos de reglas modulares que complementan los `AGENTS.md`. Se cargan automáticamente via `instructions` en el `opencode.json`.

---

## `backend/rules/coding-standards.md`

```markdown
# Backend Coding Standards

## Estructura de features
- Cada feature tiene su propia carpeta en `src/features/<feature-name>/`
- Archivos: `controller.ts`, `service.ts`, `routes.ts`, `schema.ts`, `types.ts`
- No mezclar responsabilidades entre capas

## Rutas Express
- Usar `express.Router()` en cada feature
- Montar en `app.ts` con `app.use('/api/v1/<recurso>', router)`
- Versionado: `/api/v1/`

## Prisma
- Siempre usar `prisma/prisma.ts` (singleton), no crear nuevos clientes
- Transacciones con `prisma.$transaction()`
- Migraciones con nombres descriptivos: `add_user_roles`

## Errores
- Middleware global de errores en `src/middleware/error-handler.ts`
- Usar Zod para validación de inputs
- Errores de negocio → clases custom que extienden Error
```

---

## `backend/rules/testing.md`

```markdown
# Backend Testing Guidelines

- Tests unitarios con Vitest
- Tests de integración con supertest
- Mockear Prisma con `vitest-mock-prisma`
- Nombrar archivos: `*.test.ts` o `*.spec.ts`
-覆盖率 minima: 80%
```

---

## `mobile/rules/ui-patterns.md`

```markdown
# Mobile UI Patterns

## Componentes
- UI atómicos en `components/ui/` (Button, Card, Input, etc.)
- Componentes compuestos en `components/`
- Cada componente es `export default function`

## Estilos
- Usar StyleSheet.create() en cada componente
- Colores y spacing desde `constants/theme.ts`
- Dark mode via `useColorScheme()` hook

## Navegación
- Expo Router file-based en `app/`
- Nuevas rutas = nuevo archivo en `app/`
- Tabs en `app/(tabs)/`
- Modales en `app/modal.tsx`
```

---

## `mobile/rules/api-integration.md`

```markdown
# Mobile API Integration

- Llamadas a backend via fetch nativo
- Base URL desde variable de entorno `EXPO_PUBLIC_API_URL`
- Tipos compartidos con backend (copiar interfaces)
- Manejo de errores: try/catch + feedback visual
- Loading states con ActivityIndicator
```

---

## `whatsapp-bot/rules/flows.md`

```markdown
# WhatsApp Bot Flows

## Convenciones de Flows
- Cada flow en su propio archivo dentro de `src/flows/`
- Nombres: `welcome.flow.ts`, `register.flow.ts`
- Keywords siempre en inglés
- Usar `addKeyword` con array de strings o `utils.setEvent()`
- Flows anidados van como último argumento de `addAnswer`

## State Management
- Usar `state.update()` y `state.get()` en lugar de variables globales
- State persiste automáticamente en PostgreSQL

## Endpoints HTTP
- Provider expone endpoints automáticos en el puerto configurado
- No agregar Express aparte
- Usar `handleCtx` wrapper para acceso a bot
```

---

## `whatsapp-bot/rules/deployment.md`

```markdown
# WhatsApp Bot Deploy

- Build: `npm run build` → genera `dist/app.js`
- Dockerfile incluido para containerización
- Variables requeridas: jwtToken, numberId, verifyToken (Meta), y POSTGRES_*
- Puerto default: 3008
```

---

## Uso en la práctica

Con `"instructions": ["backend/rules/*.md", ...]` en el `opencode.json`, cada vez que uses `@backend` el agente carga automáticamente tanto el `AGENTS.md` del backend como **todas** las reglas de `backend/rules/`. Podés tener tantos archivos `.md` como quieras y se inyectan todos en contexto.

¿Querés que agregue/quíte alguna rule en particular, o algún tema específico (seguridad, performance, etc.)?

---

## User

Fijate si tengo todo configurado, si es asi quiero empezar a agregar skills, cuando agregue skills decime que tengo que hacer paso a paso

---

## Assistant (Plan · Big Pickle · 5.5s)

_Thinking:_

The user wants me to check if everything is configured properly, and then they want to know step-by-step how to add skills. Let me check what exists in the project right now - look for any existing opencode config, agents, skills, etc.

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/opencode.json"
}
```

**Output:**
```
E:\Repo\SupplyCycle\opencode.json
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/.opencode/**"
}
```

**Output:**
```
E:\Repo\SupplyCycle\.opencode\agents\whatsapp-bot.md
E:\Repo\SupplyCycle\.opencode\agents\mobile.md
E:\Repo\SupplyCycle\.opencode\agents\backend.md
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/rules/*.md"
}
```

**Output:**
```
E:\Repo\SupplyCycle\whatsapp-bot\rules\flows.md
E:\Repo\SupplyCycle\backend\rules\testing.md
E:\Repo\SupplyCycle\backend\rules\coding-standards.md
E:\Repo\SupplyCycle\mobile\rules\ui-patterns.md
E:\Repo\SupplyCycle\mobile\rules\api-integration.md
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/AGENTS.md"
}
```

**Output:**
```
E:\Repo\SupplyCycle\whatsapp-bot\AGENTS.md
E:\Repo\SupplyCycle\mobile\AGENTS.md
E:\Repo\SupplyCycle\backend\AGENTS.md
E:\Repo\SupplyCycle\AGENTS.md
```

---

## Assistant (Plan · Big Pickle · 5.1s)

_Thinking:_

Everything is in place:

1. `opencode.json` - exists at root
2. `AGENTS.md` - exists at root + each subproject
3. `.opencode/agents/` - has `backend.md`, `mobile.md`, `whatsapp-bot.md`
4. `rules/` - has rules files in each subproject

Let me verify the opencode.json content is correct by reading it.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\opencode.json"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\opencode.json</path>
<type>file</type>
<content>
1: {
2:   "$schema": "https://opencode.ai/config.json",
3:   "instructions": [
4:     "AGENTS.md",
5:     "backend/AGENTS.md",
6:     "backend/rules/*.md",
7:     "mobile/AGENTS.md",
8:     "mobile/rules/*.md",
9:     "whatsapp-bot/AGENTS.md",
10:     "whatsapp-bot/rules/*.md"
11:   ],
12:   "permission": {
13:     "edit": "ask",
14:     "bash": {
15:       "*": "ask"
16:     }
17:   },
18:   "agent": {
19:     "backend": {
20:       "mode": "primary",
21:       "description": "Desarrolla en backend (Express + Prisma + PostgreSQL)",
22:       "model": "anthropic/claude-sonnet-4-20250514",
23:       "color": "#68A063",
24:       "prompt": "{file:.opencode/agents/backend.md}",
25:       "permission": {
26:         "edit": "allow",
27:         "bash": {
28:           "*": "ask",
29:           "cd backend && *": "allow",
30:           "npm run dev": "allow",
31:           "npm run build": "allow",
32:           "npx tsx*": "allow",
33:           "npx prisma*": "allow"
34:         }
35:       }
36:     },
37:     "mobile": {
38:       "mode": "primary",
39:       "description": "Desarrolla en mobile (React Native / Expo)",
40:       "model": "anthropic/claude-sonnet-4-20250514",
41:       "color": "#61DAFB",
42:       "prompt": "{file:.opencode/agents/mobile.md}",
43:       "permission": {
44:         "edit": "allow",
45:         "bash": {
46:           "*": "ask",
47:           "cd mobile && *": "allow",
48:           "npm run lint": "allow",
49:           "npx expo*": "allow"
50:         }
51:       }
52:     },
53:     "whatsapp-bot": {
54:       "mode": "primary",
55:       "description": "Desarrolla en whatsapp-bot (BuilderBot + Meta API)",
56:       "model": "anthropic/claude-sonnet-4-20250514",
57:       "color": "#25D366",
58:       "prompt": "{file:.opencode/agents/whatsapp-bot.md}",
59:       "permission": {
60:         "edit": "allow",
61:         "bash": {
62:           "*": "ask",
63:           "cd whatsapp-bot && *": "allow",
64:           "npm run dev": "allow",
65:           "npm run build": "allow",
66:           "npm run lint": "allow"
67:         }
68:       }
69:     },
70:     "plan": {
71:       "mode": "primary",
72:       "permission": {
73:         "edit": "deny",
74:         "bash": "deny"
75:       }
76:     }
77:   }
78: }

(End of file - total 78 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\.opencode\\agents\\backend.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\.opencode\agents\backend.md</path>
<type>file</type>
<content>
1: Eres un especialista en backend. Trabajas exclusivamente dentro de `backend/`.
2: ## Stack
3: - **Runtime:** Node.js, TypeScript 6, ESModules (NodeNext)
4: - **Framework:** Express 5
5: - **ORM:** Prisma 7 + PostgreSQL via @prisma/adapter-pg
6: - **Validación:** Zod 4
7: - **Auth:** bcrypt + jsonwebtoken
8: - **Logging:** pino + morgan
9: - **Seguridad:** helmet + cors
10: ## Scripts
11: - `npm run dev` → `tsx watch src/server.ts`
12: - `npm run build` → `tsc`
13: - `npm run start` → `node dist/server.js`
14: - `npx prisma migrate dev --name <name>` → migraciones
15: - `npx prisma studio` → UI
16: ## Estructura
17: src/
18: ├── app.ts         # App Express
19: ├── server.ts      # Entry point (dotenv + listen en 0.0.0.0)
20: ├── config/
21: ├── constants/
22: ├── features/
23: ├── lib/
24: ├── middleware/
25: └── utils/
26: prisma/
27: ├── schema.prisma  # provider: postgresql
28: └── prisma.ts      # Cliente singleton con adapter-pg
29: ## Convenciones
30: - `verbatimModuleSyntax` → usar `import type` en lugar de `import` para tipos
31: - imports ESM con extensión `.js` en rutas locales
32: - `noUncheckedIndexedAccess` activo → siempre checkear optional chaining
33: - Prisma client generado en `generated/prisma/`

(End of file - total 33 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\.opencode\\agents\\mobile.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\.opencode\agents\mobile.md</path>
<type>file</type>
<content>
1: Eres un especialista en mobile. Trabajas exclusivamente dentro de `mobile/`.
2: ## Stack
3: - **Framework:** React Native 0.81 + Expo SDK 54
4: - **Router:** Expo Router 6 (file-based routing en app/)
5: - **Navegación:** @react-navigation (bottom-tabs + native-stack)
6: - **Animaciones:** react-native-reanimated
7: - **Gestos:** react-native-gesture-handler + react-native-safe-area-context
8: ## Scripts
9: - `npm start` → `expo start`
10: - `npm run android` → build APK
11: - `npm run ios` → build IPA
12: - `npm run web` → web version
13: - `npm run lint` → `expo lint`
14: ## Estructura
15: app/             # Expo Router (file-based)
16: ├── _layout.tsx
17: ├── (tabs)/
18: │   ├── _layout.tsx
19: │   ├── index.tsx
20: │   └── explore.tsx
21: └── modal.tsx
22: components/      # Reutilizables (themed-text, ui/, etc.)
23: constants/       # theme.ts (colores, estilos)
24: features/        # Módulos por feature
25: hooks/           # use-color-scheme, use-theme-color
26: ## Convenciones
27: - Path alias `@/` → raíz de `mobile/`
28: - Usar `useColorScheme()` de `@/hooks/use-color-scheme` para dark/light mode
29: - Componentes de UI atómicos en `components/ui/`
30: - Temas en `constants/theme.ts`

(End of file - total 30 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\.opencode\\agents\\whatsapp-bot.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\.opencode\agents\whatsapp-bot.md</path>
<type>file</type>
<content>
1: Eres un especialista en chatbots de WhatsApp. Trabajas exclusivamente dentro de `whatsapp-bot/`.
2: ## Stack
3: - **Framework:** BuilderBot 1.4.1 (@builderbot/bot)
4: - **Provider:** Meta WhatsApp API (@builderbot/provider-meta)
5: - **DB:** PostgreSQL (@builderbot/database-postgres)
6: - **Build:** Rollup + rollup-plugin-typescript2
7: - **Runtime:** TypeScript 5.4, ES2022 modules
8: - **Dev:** nodemon + tsx
9: ## Scripts
10: - `npm run dev` → lint + nodemon con tsx (src/app.ts)
11: - `npm run build` → `npx rollup -c` → dist/app.js
12: - `npm run start` → `node ./dist/app.js`
13: - `npm run lint` → eslint + typescript-eslint
14: ## Estructura
15: src/
16: └── app.ts              # Bot entry point
17: assets/
18: └── sample.png          # Media de ejemplo
19: ## Arquitectura
20: El bot usa **flows** (conversaciones modulares):
21: - `welcomeFlow` → saludo + keywords (hi/hello/hola)
22: - `discordFlow` → subflow anidado con captura de input
23: - `registerFlow` → captura nombre/edad con state
24: - `fullSamplesFlow` → envía media (image, video, audio, file)
25: Endpoints HTTP expuestos por el provider:
26: - POST `/v1/messages` → enviar mensajes
27: - POST `/v1/register` → disparar REGISTER_FLOW
28: - POST `/v1/samples` → disparar SAMPLES
29: - POST `/v1/blacklist` → add/remove de blacklist
30: - GET `/v1/blacklist/list` → listar blacklist
31: Provider config: jwtToken, numberId, verifyToken, version v18.0
32: ## Convenciones
33: - ESLint con plugin builderbot + typescript-eslint
34: - `@typescript-eslint/no-explicit-any: off` (permitido por el framework)
35: - Path alias `~/` → `src/`
36: - Variables de entorno para DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, etc.

(End of file - total 36 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\AGENTS.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\AGENTS.md</path>
<type>file</type>
<content>
1: Monorepo con 3 proyectos independientes:
2: - `backend/` — API Express + Prisma + PostgreSQL
3: - `mobile/` — App React Native + Expo
4: - `whatsapp-bot/` — Bot WhatsApp con BuilderBot + Meta API
5: ## Reglas generales
6: - Usar `@backend` para cambios en backend/
7: - Usar `@mobile` para cambios en mobile/
8: - Usar `@whatsapp-bot` para cambios en whatsapp-bot/
9: - NO hacer cambios de configuración git ni commits
10: - Preguntar antes de editar archivos (edit: ask global)

(End of file - total 10 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\AGENTS.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\AGENTS.md</path>
<type>file</type>
<content>
1: # Backend — Express + Prisma + PostgreSQL
2: ## Stack
3: Node.js, TypeScript 6 (ESModules, NodeNext), Express 5, Prisma 7 + PostgreSQL (@prisma/adapter-pg), Zod 4, bcrypt, jsonwebtoken, pino, morgan, helmet, cors
4: ## Comandos
5: - Dev: `npm run dev` (tsx watch)
6: - Build: `npm run build` (tsc)
7: - Prisma migrate: `npx prisma migrate dev --name <name>`
8: - Prisma generate: `npx prisma generate`
9: ## Convenciones
10: - imports ESM con extensión .js
11: - type imports con verbatimModuleSyntax
12: - Prisma client singleton en `prisma/prisma.ts`
13: - Schema provider: postgresql

(End of file - total 13 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\AGENTS.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\AGENTS.md</path>
<type>file</type>
<content>
1: # Mobile — React Native + Expo SDK 54
2: ## Stack
3: Expo SDK 54, React Native 0.81, Expo Router 6, @react-navigation (bottom-tabs + native-stack), react-native-reanimated, react-native-gesture-handler, TypeScript ~5.9
4: ## Comandos
5: - Start: `npm start`
6: - Android: `npm run android`
7: - iOS: `npm run ios`
8: - Lint: `npm run lint`
9: ## Convenciones
10: - Path alias `@/` → raíz de mobile
11: - Componentes UI en `components/ui/`
12: - Temas en `constants/theme.ts`
13: - Hooks en `hooks/`
14: - Pantallas/rutas en `app/` (Expo Router)

(End of file - total 14 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\AGENTS.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\AGENTS.md</path>
<type>file</type>
<content>
1: # WhatsApp Bot — BuilderBot + Meta API
2: ## Stack
3: BuilderBot 1.4.1 (@builderbot/bot, @builderbot/provider-meta, @builderbot/database-postgres), TypeScript 5.4, Rollup, nodemon + tsx
4: ## Comandos
5: - Dev: `npm run dev` (lint + nodemon + tsx)
6: - Build: `npm run build` (rollup -c → dist/app.js)
7: - Start: `npm run start` (node dist/app.js)
8: - Lint: `npm run lint` (eslint + typescript-eslint)
9: ## Convenciones
10: - ESLint con plugin builderbot + typescript-eslint
11: - Path alias `~/` → `src/`
12: - Provider Meta: jwtToken, numberId, verifyToken, v18.0
13: - DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT

(End of file - total 13 lines)
</content>
```

---

## Assistant (Plan · Big Pickle · 3.9s)

_Thinking:_

Let me also read the rules files to verify they exist.

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\rules\\coding-standards.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\rules\coding-standards.md</path>
<type>file</type>
<content>
1: # Backend Coding Standards
2: ## Estructura de features
3: - Cada feature tiene su propia carpeta en `src/features/<feature-name>/`
4: - Archivos: `controller.ts`, `service.ts`, `routes.ts`, `schema.ts`, `types.ts`
5: - No mezclar responsabilidades entre capas
6: ## Rutas Express
7: - Usar `express.Router()` en cada feature
8: - Montar en `app.ts` con `app.use('/api/v1/<recurso>', router)`
9: - Versionado: `/api/v1/`
10: ## Prisma
11: - Siempre usar `prisma/prisma.ts` (singleton), no crear nuevos clientes
12: - Transacciones con `prisma.$transaction()`
13: - Migraciones con nombres descriptivos: `add_user_roles`
14: ## Errores
15: - Middleware global de errores en `src/middleware/error-handler.ts`
16: - Usar Zod para validación de inputs
17: - Errores de negocio → clases custom que extienden Error

(End of file - total 17 lines)
</content>

<system-reminder>
Instructions from: E:\Repo\SupplyCycle\backend\AGENTS.md
# Backend — Express + Prisma + PostgreSQL
## Stack
Node.js, TypeScript 6 (ESModules, NodeNext), Express 5, Prisma 7 + PostgreSQL (@prisma/adapter-pg), Zod 4, bcrypt, jsonwebtoken, pino, morgan, helmet, cors
## Comandos
- Dev: `npm run dev` (tsx watch)
- Build: `npm run build` (tsc)
- Prisma migrate: `npx prisma migrate dev --name <name>`
- Prisma generate: `npx prisma generate`
## Convenciones
- imports ESM con extensión .js
- type imports con verbatimModuleSyntax
- Prisma client singleton en `prisma/prisma.ts`
- Schema provider: postgresql
</system-reminder>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\backend\\rules\\testing.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\backend\rules\testing.md</path>
<type>file</type>
<content>
1: # Backend Testing Guidelines
2: - Tests unitarios con Vitest
3: - Tests de integración con supertest
4: - Mockear Prisma con `vitest-mock-prisma`
5: - Nombrar archivos: `*.test.ts` o `*.spec.ts`
6: - Cobertura minima: 80%

(End of file - total 6 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\rules\\ui-patterns.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\rules\ui-patterns.md</path>
<type>file</type>
<content>
1: # Mobile UI Patterns
2: ## Componentes
3: - UI atómicos en `components/ui/` (Button, Card, Input, etc.)
4: - Componentes compuestos en `components/`
5: - Cada componente es `export default function`
6: ## Estilos
7: - Usar StyleSheet.create() en cada componente
8: - Colores y spacing desde `constants/theme.ts`
9: - Dark mode via `useColorScheme()` hook
10: ## Navegación
11: - Expo Router file-based en `app/`
12: - Nuevas rutas = nuevo archivo en `app/`
13: - Tabs en `app/(tabs)/`
14: - Modales en `app/modal.tsx`

(End of file - total 14 lines)
</content>

<system-reminder>
Instructions from: E:\Repo\SupplyCycle\mobile\AGENTS.md
# Mobile — React Native + Expo SDK 54
## Stack
Expo SDK 54, React Native 0.81, Expo Router 6, @react-navigation (bottom-tabs + native-stack), react-native-reanimated, react-native-gesture-handler, TypeScript ~5.9
## Comandos
- Start: `npm start`
- Android: `npm run android`
- iOS: `npm run ios`
- Lint: `npm run lint`
## Convenciones
- Path alias `@/` → raíz de mobile
- Componentes UI en `components/ui/`
- Temas en `constants/theme.ts`
- Hooks en `hooks/`
- Pantallas/rutas en `app/` (Expo Router)
</system-reminder>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\mobile\\rules\\api-integration.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\mobile\rules\api-integration.md</path>
<type>file</type>
<content>
1: # Mobile API Integration
2: - Llamadas a backend via fetch nativo
3: - Base URL desde variable de entorno `EXPO_PUBLIC_API_URL`
4: - Tipos compartidos con backend (copiar interfaces)
5: - Manejo de errores: try/catch + feedback visual
6: - Loading states con ActivityIndicator
7: ---

(End of file - total 7 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\whatsapp-bot\\rules\\flows.md"
}
```

**Output:**
```
<path>E:\Repo\SupplyCycle\whatsapp-bot\rules\flows.md</path>
<type>file</type>
<content>
1: # WhatsApp Bot Flows
2: ## Convenciones de Flows
3: - Cada flow en su propio archivo dentro de `src/flows/`
4: - Nombres: `welcome.flow.ts`, `register.flow.ts`
5: - Keywords siempre en inglés
6: - Usar `addKeyword` con array de strings o `utils.setEvent()`
7: - Flows anidados van como último argumento de `addAnswer`
8: ## State Management
9: - Usar `state.update()` y `state.get()` en lugar de variables globales
10: - State persiste automáticamente en PostgreSQL
11: ## Endpoints HTTP
12: - Provider expone endpoints automáticos en el puerto configurado
13: - No agregar Express aparte
14: - Usar `handleCtx` wrapper para acceso a bot

(End of file - total 14 lines)
</content>

<system-reminder>
Instructions from: E:\Repo\SupplyCycle\whatsapp-bot\AGENTS.md
# WhatsApp Bot — BuilderBot + Meta API
## Stack
BuilderBot 1.4.1 (@builderbot/bot, @builderbot/provider-meta, @builderbot/database-postgres), TypeScript 5.4, Rollup, nodemon + tsx
## Comandos
- Dev: `npm run dev` (lint + nodemon + tsx)
- Build: `npm run build` (rollup -c → dist/app.js)
- Start: `npm run start` (node dist/app.js)
- Lint: `npm run lint` (eslint + typescript-eslint)
## Convenciones
- ESLint con plugin builderbot + typescript-eslint
- Path alias `~/` → `src/`
- Provider Meta: jwtToken, numberId, verifyToken, v18.0
- DB: POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_NAME, POSTGRES_DB_PASSWORD, POSTGRES_DB_PORT
</system-reminder>
```

---

## Assistant (Plan · Big Pickle · 12.4s)

_Thinking:_

Everything is in place and looks correct. Now the user wants to know how to add skills step by step. Let me provide a clear step-by-step guide based on the OpenCode docs for skills:

From the docs:
- Skills are defined in `.opencode/skills/<name>/SKILL.md`
- Each SKILL.md must have YAML frontmatter with `name` and `description`
- The `name` must be lowercase alphanumeric with hyphens, 1-64 chars
- The `description` must be 1-1024 chars
- Skills are loaded on-demand via the `skill` tool
- Agents see available skills and can load the full content when needed
- You can configure permissions for skills in opencode.json

Let me present the step-by-step guide.

Todo está configurado correctamente. Resumen de lo que existe:

| Archivo | Estado |
|---|---|
| `opencode.json` | ✅ 4 agentes (backend, mobile, whatsapp-bot, plan) |
| `.opencode/agents/backend.md` | ✅ Prompt backend |
| `.opencode/agents/mobile.md` | ✅ Prompt mobile |
| `.opencode/agents/whatsapp-bot.md` | ✅ Prompt whatsapp-bot |
| `AGENTS.md` (raíz) | ✅ Reglas globales |
| `backend/AGENTS.md` | ✅ Reglas backend |
| `mobile/AGENTS.md` | ✅ Reglas mobile |
| `whatsapp-bot/AGENTS.md` | ✅ Reglas bot |
| `backend/rules/coding-standards.md` | ✅ |
| `backend/rules/testing.md` | ✅ |
| `mobile/rules/ui-patterns.md` | ✅ |
| `mobile/rules/api-integration.md` | ✅ |
| `whatsapp-bot/rules/flows.md` | ✅ |

---

## Paso a paso para agregar Skills

### 1. Crear la carpeta del skill

```
.opencode/skills/<nombre-del-skill>/
```

El nombre debe ser lowercase alfanumérico con guiones (`prisma-migrate`, `expo-build`, `git-release`), de 1 a 64 caracteres, y coincidir con el nombre del directorio.

### 2. Crear `SKILL.md` adentro con frontmatter YAML

```
.opencode/skills/prisma-migrate/SKILL.md
```

```markdown
---
name: prisma-migrate
description: Genera y ejecuta migraciones de Prisma de forma segura
---

## Qué hace
- Crea migraciones con `npx prisma migrate dev --name <desc>`
- Verifica el estado con `npx prisma migrate status`
- Formatea nombres descriptivos en inglés: `add_user_roles`

## Cuándo usarlo
Cuando necesites crear, aplicar o revertir migraciones de base de datos.
Siempre preguntar qué nombre ponerle a la migración antes de ejecutar.
```

### 3. Hacer visible para los agentes

En `opencode.json`, agregar permisos de skill por agente:

```json
"backend": {
  ...
  "permission": {
    ...
    "skill": {
      "prisma-migrate": "allow",
      "db-*": "allow"
    }
  }
}
```

Si no ponés nada por defecto los skills con `*` son `allow`. Podés restringir con `"*": "deny"` global y habilitar solo los que quieras.

### 4. (Opcional) Skills globales reutilizables

En `~/.config/opencode/skills/<nombre>/SKILL.md` — disponibles en todos tus proyectos.

### 5. Usar el skill

Cuando el agente necesite hacer una migración, invoca el skill automáticamente viendo la descripción disponible. También lo podés forzar con `@skill:prisma-migrate` en tu prompt.

---

### Ejemplos de skills útiles para tu proyecto

| Carpeta | Descripción |
|---|---|
| `.opencode/skills/prisma-migrate/` | Migraciones seguras de Prisma |
| `.opencode/skills/supply-flow/` | Crear un flow nuevo en BuilderBot (código boilerplate) |
| `.opencode/skills/add-screen/` | Crear pantalla + ruta en Expo Router |
| `.opencode/skills/add-api-endpoint/` | Crear endpoint Express + schema Zod + ruta |
| `.opencode/skills/git-release/` | Preparar release notes y tag (cuando actives git) |

¿Querés que te proponga el contenido exacto de alguno de estos skills para implementarlo?

---

## User

Quiero asignarle a cada agente skills por defecto configurados como hago eso ? 

---

## Assistant (Plan · Big Pickle · 16.7s)

_Thinking:_

The user wants to assign default skills to each agent. Let me look at the OpenCode docs again to understand how to configure skills per agent.

From the docs I already read:

**Override per agent:**
```yaml
# For custom agents (in agent frontmatter):
---
permission:
  skill:
    "documents-*": "allow"
---
```

```json
# For built-in agents (in opencode.json):
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

**Configure permissions:**
```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

So the way to assign skills to agents is through `permission.skill` in each agent's config. You can:
1. Globally set `"skill": { "*": "allow" }` or `"*": "deny"`
2. Per agent, override with specific patterns

But there's a key concept: skills are **discovered** by the agent via the `skill` tool. The agent sees available skills and loads them on-demand. So "assigning by default" means:
- Making the skill visible (not denied) so the agent can choose to load it
- Or potentially having the agent prompt instruct it to always load certain skills

Actually, looking at the docs more carefully:

> Control which skills agents can access using pattern-based permissions in `opencode.json`:
> - `allow` → Skill loads immediately
> - `deny` → Skill hidden from agent, access rejected
> - `ask` → User prompted for approval before loading

Wait, "Skill loads immediately" for `allow`? So when set to `allow`, the skill is automatically loaded into context? That's interesting. Let me re-read...

> Permission | Behavior
> `allow` | Skill loads immediately
> `deny` | Skill hidden from agent, access rejected
> `ask` | User prompted for approval before loading

So if I set `permission.skill` to `allow`, the skill content gets loaded immediately into the agent's context. That means the agent has the skill's instructions available from the start.

So the way to assign default skills to agents is:
1. Create the skill `.opencode/skills/<name>/SKILL.md`
2. In the agent's `permission.skill`, set the skill pattern to `"allow"`
3. The skill loads immediately into that agent's context

This is perfect for what the user wants. Let me present a clear plan.

For the agents:

**backend** - should have skills like:
- `prisma-migrate` - migration management
- `add-endpoint` - create new API endpoint boilerplate

**mobile** - should have skills like:
- `add-screen` - create new screen/route
- `expo-build` - build commands

**whatsapp-bot** - should have skills like:
- `add-flow` - create new BuilderBot flow
- `deploy-bot` - deployment steps

Let me think about what skills to propose and how to configure them.

Actually, let me present the plan and ask the user what skills they want, rather than assuming. But the user asked "como hago eso" (how do I do that), so I should explain the mechanism and propose examples.

Let me give them:
1. The mechanism explanation
2. Proposed skills per agent with configuration
3. What each skill file would contain

Se configura mediante `permission.skill` dentro de cada agente en `opencode.json`. Cuando un skill tiene `"allow"`, **se carga inmediatamente** en el contexto del agente al arrancar.

---

## Mecanismo

```json
{
  "agent": {
    "backend": {
      ...
      "permission": {
        "skill": {
          "prisma-migrate": "allow",
          "add-endpoint": "allow"
        }
      }
    }
  }
}
```

Esto le dice al agente "tenés estos skills disponibles y cargalos ya". Si querés que un skill esté disponible pero no se cargue automáticamente (solo bajo demanda), se configura como `"ask"`.

---

## Propuesta para tu proyecto

```
.opencode/skills/
├── prisma-migrate/
│   └── SKILL.md
├── add-flow/
│   └── SKILL.md
└── add-screen/
    └── SKILL.md
```

### `opencode.json` — asignación por agente

```json
"agent": {
  "backend": {
    ...
    "permission": {
      "skill": {
        "prisma-migrate": "allow",
        "add-endpoint": "allow"
      }
    }
  },
  "mobile": {
    ...
    "permission": {
      "skill": {
        "add-screen": "allow",
        "expo-build": "allow"
      }
    }
  },
  "whatsapp-bot": {
    ...
    "permission": {
      "skill": {
        "add-flow": "allow",
        "deploy-bot": "allow"
      }
    }
  }
}
```

Si además querés un "deny" global para que ningún skill se cargue sin explicitarlo:

```json
"permission": {
  "skill": { "*": "deny" }
}
```

---

### Contenido de ejemplo para cada skill

**`.opencode/skills/prisma-migrate/SKILL.md`**
```markdown
---
name: prisma-migrate
description: Genera y ejecuta migraciones de Prisma
---

## Pasos
1. `npx prisma migrate dev --name <desc_en_ingles>`
2. Verificar con `npx prisma migrate status`
3. Si hay errores, revisar schema.prisma y reintentar

## Reglas
- Nombre descriptivo en inglés: `add_user_roles`, `create_orders_table`
- No borrar migraciones de otros devs
```

**`.opencode/skills/add-screen/SKILL.md`**
```markdown
---
name: add-screen
description: Crea pantalla + ruta en Expo Router
---

## Pasos
1. Crear archivo en `app/<ruta>.tsx`
2. Si va en tabs, crear dentro de `app/(tabs)/`
3. Usar layout de `_layout.tsx` existente
4. Estilos con `constants/theme.ts`
```

**`.opencode/skills/add-flow/SKILL.md`**
```markdown
---
name: add-flow
description: Crea un flow nuevo en BuilderBot
---

## Pasos
1. Crear `src/flows/<name>.flow.ts`
2. Exportar flow con `addKeyword` + `addAnswer`
3. Importar y agregar en `createFlow([...])` en `app.ts`
```

---

¿Querés que ajuste los nombres de los skills, agregue/quíte alguno, o definamos el contenido exacto de cada `SKILL.md` antes de implementar?

---

## User

Dame el json completos con los skills cargados por agente, ademas quiero que ningun skill salvo los que yo diga se puedan cargar automaticamente

---

## Assistant (Plan · Big Pickle · 9.9s)

_Thinking:_

The user wants:
1. The complete `opencode.json` with skills configured per agent
2. A global `"skill": { "*": "deny" }` so no skills auto-load except the ones explicitly allowed per agent

Since I'm in plan mode, I'll just present the JSON. I won't make any edits.

Let me draft the complete JSON with all agents and their skills.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "AGENTS.md",
    "backend/AGENTS.md",
    "backend/rules/*.md",
    "mobile/AGENTS.md",
    "mobile/rules/*.md",
    "whatsapp-bot/AGENTS.md",
    "whatsapp-bot/rules/*.md"
  ],
  "permission": {
    "edit": "ask",
    "bash": { "*": "ask" },
    "skill": { "*": "deny" }
  },
  "agent": {
    "backend": {
      "mode": "primary",
      "description": "Desarrolla en backend (Express + Prisma + PostgreSQL)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#68A063",
      "prompt": "{file:.opencode/agents/backend.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd backend && *": "allow",
          "npm run dev": "allow",
          "npm run build": "allow",
          "npx tsx*": "allow",
          "npx prisma*": "allow"
        },
        "skill": {
          "prisma-migrate": "allow",
          "add-endpoint": "allow"
        }
      }
    },
    "mobile": {
      "mode": "primary",
      "description": "Desarrolla en mobile (React Native / Expo)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#61DAFB",
      "prompt": "{file:.opencode/agents/mobile.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd mobile && *": "allow",
          "npm run lint": "allow",
          "npx expo*": "allow"
        },
        "skill": {
          "add-screen": "allow",
          "expo-build": "allow"
        }
      }
    },
    "whatsapp-bot": {
      "mode": "primary",
      "description": "Desarrolla en whatsapp-bot (BuilderBot + Meta API)",
      "model": "anthropic/claude-sonnet-4-20250514",
      "color": "#25D366",
      "prompt": "{file:.opencode/agents/whatsapp-bot.md}",
      "permission": {
        "edit": "allow",
        "bash": {
          "*": "ask",
          "cd whatsapp-bot && *": "allow",
          "npm run dev": "allow",
          "npm run build": "allow",
          "npm run lint": "allow"
        },
        "skill": {
          "add-flow": "allow",
          "deploy-bot": "allow"
        }
      }
    },
    "plan": {
      "mode": "primary",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  }
}
```

---

## Skills que referencié

| Skill | Agente | Ubicación |
|---|---|---|
| `prisma-migrate` | backend | `.opencode/skills/prisma-migrate/SKILL.md` |
| `add-endpoint` | backend | `.opencode/skills/add-endpoint/SKILL.md` |
| `add-screen` | mobile | `.opencode/skills/add-screen/SKILL.md` |
| `expo-build` | mobile | `.opencode/skills/expo-build/SKILL.md` |
| `add-flow` | whatsapp-bot | `.opencode/skills/add-flow/SKILL.md` |
| `deploy-bot` | whatsapp-bot | `.opencode/skills/deploy-bot/SKILL.md` |

Cada uno necesita su carpeta con `SKILL.md` adentro. ¿Querés que te escriba el contenido exacto de cada `SKILL.md` antes de implementar todo?

---

## User

como testeo que la configuracion esta correcta ? 

---

## Assistant (Plan · Big Pickle · 8.4s)

_Thinking:_

The user wants to know how to test/validate that the OpenCode configuration is correct. Since I'm in plan mode, I can only read and suggest commands they can run.

OpenCode tiene varios comandos para verificar la configuración sin necesidad de hacer nada destructivo:

---

### 1. Validar sintaxis del JSON

```bash
opencode check
```

Valida que `opencode.json` y todos los archivos referenciados existen y tienen formato correcto.

### 2. Ver resolución completa de la config

```bash
opencode debug config
```

Muestra la configuración final mergeada (global + proyecto + agentes + skills). Ahí ves si los `instructions`, `prompt` y `permission.skill` se resolvieron bien.

### 3. Listar skills detectados

```bash
opencode debug config --skills
```

Muestra qué skills encontró y su estado (allow/deny/ask) por agente.

### 4. Iniciar OpenCode y probar

```bash
opencode
```

Una vez dentro:
- **Tab** para ciclar entre agentes (build, plan, backend, mobile, whatsapp-bot)
- Escribí `@` para ver la lista de subagentes disponibles
- Si los skills están cargados, el agente los va a mencionar en su contexto inicial

### 5. Si querés ver qué archivos instructions cargó

```bash
opencode run "Listá los archivos de configuración que tenés cargados"
```

---

En resumen: `opencode check` primero, y si no reporta errores, `opencode` directamente y probás con Tab y @.

---

## User

Dame un .md explicando todo lo que fuimos hablando con lo relacionado a la configuracion de los agentes que permite y que no permite hacer la configuraciona actual de los agentes, quiero que me dejes ese .md en la carpeta docs. explicacion detallada para que lo entienda un equipo de desarrollo explica que hace cada archivo y para que sirve

---

## Assistant (Build · Big Pickle · 3.4s)

_Thinking:_

The user wants me to create a detailed `.md` file in the `docs/` folder explaining everything we've discussed about the agent configuration. Let me first check if `docs/` exists.

**Tool: glob**

**Input:**
```json
{
  "pattern": "docs/"
}
```

**Output:**
```
No files found
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "docs/**"
}
```

**Output:**
```
No files found
```

---

## Assistant (Build · Big Pickle · 46.4s)

_Thinking:_

The docs folder doesn't exist yet. I need to create it and write the file. Let me write a comprehensive markdown file explaining everything.

**Tool: write**

**Input:**
```json
{
  "filePath": "E:\\Repo\\SupplyCycle\\docs\\agent-configuration.md",
  "content": "# Configuración de Agentes OpenCode — SupplyCycle\n\n## Índice\n\n1. [Arquitectura general](#1-arquitectura-general)\n2. [Estructura de carpetas](#2-estructura-de-carpetas)\n3. [Archivos de reglas (AGENTS.md)](#3-archivos-de-reglas-agentsmd)\n4. [Archivos de reglas modulares (rules/)](#4-archivos-de-reglas-modulares-rules)\n5. [Configuración principal (opencode.json)](#5-configuración-principal-opencodejson)\n6. [Definición de agentes](#6-definición-de-agentes)\n   - [Agente backend](#61-agente-backend)\n   - [Agente mobile](#62-agente-mobile)\n   - [Agente whatsapp-bot](#63-agente-whatsapp-bot)\n   - [Agente plan](#64-agente-plan)\n7. [Prompts de agentes (.opencode/agents/)](#7-prompts-de-agentes-opencodeagents)\n8. [Skills (.opencode/skills/)](#8-skills-opencodeskills)\n9. [Permisos detallados](#9-permisos-detallados)\n10. [Qué puede y no puede hacer cada agente](#10-qué-puede-y-no-puede-hacer-cada-agente)\n11. [Flujo de trabajo diario](#11-flujo-de-trabajo-diario)\n12. [Comandos de verificación](#12-comandos-de-verificación)\n\n---\n\n## 1. Arquitectura general\n\nSupplyCycle es un monorepo con 3 proyectos independientes. Usamos **OpenCode** como agente de IA para desarrollo, con agentes especializados por proyecto, cada uno con su propio stack, reglas, skills y permisos.\n\nCada agente conoce solo su proyecto, tiene acceso controlado a comandos bash y edición de archivos, y carga automáticamente skills reutilizables para tareas repetitivas.\n\n### Agentes definidos\n\n| Agente | Proyecto | Stack principal |\n|--------|----------|-----------------|\n| `backend` | `backend/` | Express 5 + Prisma 7 + PostgreSQL |\n| `mobile` | `mobile/` | React Native 0.81 + Expo SDK 54 |\n| `whatsapp-bot` | `whatsapp-bot/` | BuilderBot 1.4.1 + Meta API |\n| `plan` | — | Solo lectura (modo planificación) |\n| `build` | — | Por defecto (sin restricciones) |\n| `explore` | — | Solo lectura (exploración rápida) |\n\n---\n\n## 2. Estructura de carpetas\n\n```\nSupplyCycle/\n├── opencode.json                    # Configuración principal de OpenCode\n├── AGENTS.md                        # Reglas globales del monorepo\n│\n├── .opencode/\n│   ├── agents/                      # Prompts personalizados por agente\n│   │   ├── backend.md\n│   │   ├── mobile.md\n│   │   └── whatsapp-bot.md\n│   └── skills/                      # Skills reutilizables\n│       ├── prisma-migrate/SKILL.md\n│       ├── add-endpoint/SKILL.md\n│       ├── add-screen/SKILL.md\n│       ├── expo-build/SKILL.md\n│       ├── add-flow/SKILL.md\n│       └── deploy-bot/SKILL.md\n│\n├── backend/\n│   ├── AGENTS.md                    # Reglas específicas del backend\n│   └── rules/                       # Reglas modulares\n│       ├── coding-standards.md\n│       └── testing.md\n│\n├── mobile/\n│   ├── AGENTS.md                    # Reglas específicas de mobile\n│   └── rules/\n│       ├── ui-patterns.md\n│       └── api-integration.md\n│\n└── whatsapp-bot/\n    ├── AGENTS.md                    # Reglas específicas del bot\n    └── rules/\n        └── flows.md\n```\n\n---\n\n## 3. Archivos de reglas (AGENTS.md)\n\nCada `AGENTS.md` es la puerta de entrada de reglas para OpenCode. Se cargan automáticamente cuando el agente trabaja en ese directorio.\n\n### AGENTS.md raíz — Reglas globales del monorepo\n\n```markdown\nMonorepo con 3 proyectos independientes:\n- `backend/` — API Express + Prisma + PostgreSQL\n- `mobile/` — App React Native + Expo\n- `whatsapp-bot/` — Bot WhatsApp con BuilderBot + Meta API\n\n## Reglas generales\n- Usar @backend para cambios en backend/\n- Usar @mobile para cambios en mobile/\n- Usar @whatsapp-bot para cambios en whatsapp-bot/\n- NO hacer cambios de configuración git ni commits\n- Preguntar antes de editar archivos (edit: ask global)\n```\n\n**Propósito:** Todo agente que arranque en la raíz lee esto primero. Le dice qué proyecto existe, cómo dirigir cambios y qué reglas aplicar globalmente.\n\n### AGENTS.md por proyecto\n\nCada subproyecto tiene el suyo con información detallada de su stack:\n\n**`backend/AGENTS.md`** — Stack exacto, comandos de dev/build/prisma, convenciones de imports ESM y tipos.\n\n**`mobile/AGENTS.md`** — Stack Expo + React Navigation + Reanimated, comandos start/android/ios/lint, convenciones de path alias y componentes UI.\n\n**`whatsapp-bot/AGENTS.md`** — Stack BuilderBot + Meta Provider + PostgreSQL, comandos dev/build/start/lint, variables de entorno requeridas.\n\n> **¿Por qué separar?** OpenCode carga SOLO el `AGENTS.md` del proyecto en el que estás trabajando gracias a la configuración en `opencode.json`.\n\n---\n\n## 4. Archivos de reglas modulares (rules/)\n\nSon archivos `.md` dentro de `rules/` que se cargan como reglas adicionales. Sirven para desacoplar temas específicos y mantener los `AGENTS.md` livianos.\n\n### Cómo se cargan\n\n```json\n\"instructions\": [\n  \"AGENTS.md\",\n  \"backend/AGENTS.md\",\n  \"backend/rules/*.md\",\n  \"mobile/AGENTS.md\",\n  \"mobile/rules/*.md\",\n  \"whatsapp-bot/AGENTS.md\",\n  \"whatsapp-bot/rules/*.md\"\n]\n```\n\nEl glob `*/*.md` carga **todos** los archivos markdown dentro de la carpeta `rules/` automáticamente. No hace falta registrar cada uno manualmente.\n\n### Reglas existentes\n\n| Archivo | Qué cubre |\n|---------|-----------|\n| `backend/rules/coding-standards.md` | Estructura de features, rutas Express versionadas, uso de Prisma singleton, manejo de errores con Zod |\n| `backend/rules/testing.md` | Framework de tests (Vitest), mocks de Prisma, cobertura mínima 80% |\n| `mobile/rules/ui-patterns.md` | Componentes atómicos en `components/ui/`, StyleSheet.create(), dark mode con hook |\n| `mobile/rules/api-integration.md` | Fetch nativo con `EXPO_PUBLIC_API_URL`, manejo de errores y loading states |\n| `whatsapp-bot/rules/flows.md` | Convenciones de flows (keywords, state, endpoints HTTP), estructura de archivos |\n\n---\n\n## 5. Configuración principal (opencode.json)\n\nEs el archivo central que orquesta todo: permisos globales, definición de agentes, carga de instrucciones y asignación de skills.\n\n### Secciones clave\n\n#### `instructions`\nLista de archivos que OpenCode carga como contexto. Soporta rutas directas y globs (`*.md`). El orden importa: los primeros archivos tienen más peso.\n\n#### `permission` (global)\nDefine permisos por defecto para **todos** los agentes:\n\n```json\n\"permission\": {\n  \"edit\": \"ask\",       # Siempre preguntar antes de editar\n  \"bash\": { \"*\": \"ask\" },  # Preguntar antes de ejecutar comandos\n  \"skill\": { \"*\": \"deny\" } # Ningún skill se carga sin explicitarlo\n}\n```\n\n#### `agent`\nDefine cada agente especializado con su modelo, color, prompt y permisos específicos.\n\n---\n\n## 6. Definición de agentes\n\n### 6.1 Agente backend\n\n```json\n\"backend\": {\n  \"mode\": \"primary\",\n  \"description\": \"Desarrolla en backend (Express + Prisma + PostgreSQL)\",\n  \"model\": \"anthropic/claude-sonnet-4-20250514\",\n  \"color\": \"#68A063\",\n  \"prompt\": \"{file:.opencode/agents/backend.md}\",\n  \"permission\": {\n    \"edit\": \"allow\",\n    \"bash\": {\n      \"*\": \"ask\",\n      \"cd backend && *\": \"allow\",\n      \"npm run dev\": \"allow\",\n      \"npm run build\": \"allow\",\n      \"npx tsx*\": \"allow\",\n      \"npx prisma*\": \"allow\"\n    },\n    \"skill\": { \"prisma-migrate\": \"allow\", \"add-endpoint\": \"allow\" }\n  }\n}\n```\n\n**Permisos:**\n\n| Acción | Comportamiento |\n|--------|---------------|\n| Editar archivos | ✅ Permitido (sin preguntar) — el global ya pide confirmación general |\n| `cd backend && *` | ✅ Permitido directamente |\n| `npm run dev` / `npm run build` | ✅ Permitido directamente |\n| `npx prisma *` | ✅ Permitido (migraciones, generate, studio) |\n| `npx tsx *` | ✅ Permitido (ejecución de scripts) |\n| Cualquier otro comando | ❌ Pregunta antes de ejecutar |\n| Skills `prisma-migrate` y `add-endpoint` | ✅ Se cargan automáticamente al iniciar el agente |\n| Cualquier otro skill | ❌ Bloqueado globalmente |\n\n### 6.2 Agente mobile\n\n```json\n\"mobile\": {\n  \"mode\": \"primary\",\n  \"description\": \"Desarrolla en mobile (React Native / Expo)\",\n  \"model\": \"anthropic/claude-sonnet-4-20250514\",\n  \"color\": \"#61DAFB\",\n  \"prompt\": \"{file:.opencode/agents/mobile.md}\",\n  \"permission\": {\n    \"edit\": \"allow\",\n    \"bash\": {\n      \"*\": \"ask\",\n      \"cd mobile && *\": \"allow\",\n      \"npm run lint\": \"allow\",\n      \"npx expo*\": \"allow\"\n    },\n    \"skill\": { \"add-screen\": \"allow\", \"expo-build\": \"allow\" }\n  }\n}\n```\n\n**Permisos:**\n\n| Acción | Comportamiento |\n|--------|---------------|\n| Editar archivos | ✅ Permitido |\n| `cd mobile && *` | ✅ Permitido |\n| `npm run lint` | ✅ Permitido |\n| `npx expo *` | ✅ Permitido (start, android, ios, web) |\n| Cualquier otro comando | ❌ Pregunta |\n| Skills `add-screen` y `expo-build` | ✅ Se cargan automáticamente |\n\n### 6.3 Agente whatsapp-bot\n\n```json\n\"whatsapp-bot\": {\n  \"mode\": \"primary\",\n  \"description\": \"Desarrolla en whatsapp-bot (BuilderBot + Meta API)\",\n  \"model\": \"anthropic/claude-sonnet-4-20250514\",\n  \"color\": \"#25D366\",\n  \"prompt\": \"{file:.opencode/agents/whatsapp-bot.md}\",\n  \"permission\": {\n    \"edit\": \"allow\",\n    \"bash\": {\n      \"*\": \"ask\",\n      \"cd whatsapp-bot && *\": \"allow\",\n      \"npm run dev\": \"allow\",\n      \"npm run build\": \"allow\",\n      \"npm run lint\": \"allow\"\n    },\n    \"skill\": { \"add-flow\": \"allow\", \"deploy-bot\": \"allow\" }\n  }\n}\n```\n\n**Permisos:**\n\n| Acción | Comportamiento |\n|--------|---------------|\n| Editar archivos | ✅ Permitido |\n| `cd whatsapp-bot && *` | ✅ Permitido |\n| `npm run dev` / `build` / `lint` | ✅ Permitido |\n| Cualquier otro comando | ❌ Pregunta |\n| Skills `add-flow` y `deploy-bot` | ✅ Se cargan automáticamente |\n\n### 6.4 Agente plan\n\n```json\n\"plan\": {\n  \"mode\": \"primary\",\n  \"permission\": { \"edit\": \"deny\", \"bash\": \"deny\" }\n}\n```\n\n**Propósito:** Modo de solo lectura para analizar código, planificar features y revisar cambios sin riesgo de modificar nada.\n\n---\n\n## 7. Prompts de agentes (.opencode/agents/)\n\nCada agente tiene un archivo de prompt que se inyecta en su contexto vía `\"prompt\": \"{file:...}\"`. Estos prompts son instrucciones detalladas sobre el stack, estructura y convenciones del proyecto.\n\n### Ejemplo: `.opencode/agents/backend.md`\n\nContiene:\n- Stack tecnológico exacto con versiones\n- Scripts de desarrollo y build\n- Árbol de directorios con propósito de cada carpeta\n- Convenciones de código (type imports, ESM, Prisma singleton)\n\n### Ejemplo: `.opencode/agents/mobile.md`\n\nContiene:\n- Versiones de Expo, React Native y librerías clave\n- Comandos disponibles (start, android, ios, web)\n- Estructura de rutas (Expo Router file-based)\n- Convenciones de componentes y estilos\n\n### Ejemplo: `.opencode/agents/whatsapp-bot.md`\n\nContiene:\n- Stack BuilderBot + Meta Provider + PostgreSQL\n- Flujos existentes (welcome, register, samples)\n- Endpoints HTTP expuestos por el provider\n- Variables de entorno requeridas para conexión\n\n> **Nota:** El prompt del agente NO es lo mismo que `AGENTS.md`. El prompt es la identidad del agente (quién es, qué sabe), mientras que `AGENTS.md` son reglas del proyecto (cómo se hacen las cosas).\n\n---\n\n## 8. Skills (.opencode/skills/)\n\nLos skills son instrucciones reutilizables para tareas específicas. Se cargan automáticamente cuando el agente los necesita, siempre y cuando estén en `\"allow\"` en la configuración.\n\n### Estructura de un skill\n\n```\n.opencode/skills/<nombre>/\n└── SKILL.md\n```\n\nEl `SKILL.md` debe tener frontmatter YAML con `name` y `description`:\n\n```markdown\n---\nname: prisma-migrate\ndescription: Genera y ejecuta migraciones de Prisma de forma segura\n---\n\n## Pasos\n1. `npx prisma migrate dev --name <descripcion>`\n2. Verificar con `npx prisma migrate status`\n3. Revisar schema.prisma si hay errores\n\n## Reglas\n- Nombre en inglés: add_user_roles, create_orders_table\n- No borrar migraciones existentes\n```\n\n### Skills asignados por agente\n\n| Skill | Qué hace | Disponible en |\n|-------|----------|---------------|\n| `prisma-migrate` | Crear/ejecutar migraciones Prisma | backend |\n| `add-endpoint` | Crear endpoint Express + Zod + pruebas | backend |\n| `add-screen` | Crear pantalla Expo Router + layout | mobile |\n| `expo-build` | Build para Android/iOS con config | mobile |\n| `add-flow` | Crear flow BuilderBot + registro | whatsapp-bot |\n| `deploy-bot` | Build + Docker + deploy del bot | whatsapp-bot |\n\n### ¿Cómo se activan?\n\nCuando un skill tiene `\"allow\"`, el agente lo ve disponible en su contexto y puede invocarlo automáticamente cuando detecta que la tarea coincide con la descripción del skill.\n\nSi un skill tiene `\"ask\"`, el agente le preguntará al usuario antes de cargarlo.\nSi tiene `\"deny\"`, el skill es invisible para el agente.\n\n---\n\n## 9. Permisos detallados\n\n### Niveles de permiso\n\n| Valor | Significado |\n|-------|-------------|\n| `\"allow\"` | Se ejecuta sin preguntar |\n| `\"ask\"` | Pregunta al usuario antes de ejecutar |\n| `\"deny\"` | Bloqueado, no se puede ejecutar |\n\n### Jerarquía de resolución\n\n1. **Permiso global** → aplica a todos los agentes por defecto\n2. **Permiso del agente** → sobreescribe al global para ese agente específico\n3. **Patrones específicos** → las reglas más específicas (ej: `\"cd backend && *\"`) tienen prioridad sobre las genéricas (ej: `\"*\"`)\n\n### Permisos globales actuales\n\n```json\n{\n  \"edit\": \"ask\",\n  \"bash\": { \"*\": \"ask\" },\n  \"skill\": { \"*\": \"deny\" }\n}\n```\n\nEsto significa:\n- **Ningún agente** edita archivos o ejecuta comandos sin preguntar (a menos que lo sobreescriba explícitamente en su configuración)\n- **Ningún skill** se carga sin estar explicitado como `allow` en algún agente\n\n### Permisos por tipo de acción\n\n| Tool | Qué controla |\n|------|-------------|\n| `read` | Leer archivos |\n| `edit` | Escribir, editar, aplicar parches |\n| `bash` | Ejecutar comandos en terminal |\n| `glob` | Buscar archivos por patrón |\n| `grep` | Buscar contenido en archivos |\n| `webfetch` | Fetch a URLs |\n| `websearch` | Búsqueda web |\n| `skill` | Cargar skills |\n| `todowrite` | Escribir en la todo list |\n\n---\n\n## 10. Qué puede y no puede hacer cada agente\n\n### backend\n\n| ✅ Puede | ❌ No puede |\n|---------|------------|\n| Editar cualquier archivo en `backend/` | Editar archivos fuera de `backend/` sin preguntar |\n| Ejecutar `npm run dev`, `npm run build` | Ejecutar `git` commands |\n| Ejecutar `npx prisma migrate`, `npx prisma generate` | Ejecutar scripts fuera del context del backend |\n| Ejecutar `npx tsx` scripts | Modificar `opencode.json` sin preguntar |\n| Cargar skills `prisma-migrate` y `add-endpoint` | Borrar directorios críticos sin preguntar |\n| Trabajar en la raíz del proyecto (para leer configs globales) | Hacer cambios en `mobile/` o `whatsapp-bot/` sin preguntar |\n\n### mobile\n\n| ✅ Puede | ❌ No puede |\n|---------|------------|\n| Editar cualquier archivo en `mobile/` | Editar archivos fuera de `mobile/` sin preguntar |\n| Ejecutar `npm run lint` | Ejecutar `git` commands |\n| Ejecutar `npx expo start`, `npx expo build:*` | Ejecutar scripts de backend o bot |\n| Cargar skills `add-screen` y `expo-build` | Ejecutar Prisma commands |\n| Trabajar en la raíz del proyecto (para leer configs) | Modificar `opencode.json` sin preguntar |\n\n### whatsapp-bot\n\n| ✅ Puede | ❌ No puede |\n|---------|------------|\n| Editar cualquier archivo en `whatsapp-bot/` | Editar archivos fuera de `whatsapp-bot/` sin preguntar |\n| Ejecutar `npm run dev`, `npm run build`, `npm run lint` | Ejecutar `git` commands |\n| Cargar skills `add-flow` y `deploy-bot` | Ejecutar comandos de Expo o Prisma |\n| Trabajar en la raíz del proyecto (para leer configs) | Modificar `opencode.json` sin preguntar |\n\n### plan (todos los agentes en modo plan)\n\n| ✅ Puede | ❌ No puede |\n|---------|------------|\n| Leer cualquier archivo | Editar cualquier archivo |\n| Buscar con glob y grep | Ejecutar comandos bash |\n| Navegar la estructura del proyecto | Cargar skills |\n| Hacer preguntas al usuario | Modificar archivos de configuración |\n\n---\n\n## 11. Flujo de trabajo diario\n\n### Cómo cambiar entre agentes\n\n```bash\n# Abrir OpenCode en la raíz\nopencode\n```\n\nDentro del TUI:\n- **Tab** para ciclar entre agentes: build → plan → backend → mobile → whatsapp-bot\n- Escribir `@backend`, `@mobile`, `@whatsapp-bot` para invocar un subagente directamente\n\n### Cómo pedir cambios\n\n**\"Agregar un endpoint de usuarios en el backend\"** → Úsá `@backend`\n\n**\"Crear pantalla de perfil en la app\"** → Úsá `@mobile`\n\n**\"Agregar flow de bienvenida al bot\"** → Úsá `@whatsapp-bot`\n\n### Cómo planificar sin riesgos\n\nCambiá al agente `plan` con Tab y describí lo que querés hacer. El agente analizará el código y te dará un plan sin modificar nada.\n\n### Cómo editar fuera del proyecto asignado\n\nSi necesitás que `@mobile` toque un archivo en `backend/`, el agente te va a preguntar antes porque no tiene permiso `allow` para editar fuera de `mobile/`. Esto es deliberado para evitar cambios accidentales.\n\n---\n\n## 12. Comandos de verificación\n\n```bash\n# Validar que la config es correcta\nopencode check\n\n# Ver la config final mergeada\nopencode debug config\n\n# Listar skills detectados y su estado por agente\nopencode debug config --skills\n\n# Ver qué archivos de instrucciones cargó el agente\nopencode run \"Listá los archivos de configuración cargados\"\n```\n\n---\n\n## Resumen visual\n\n```\n                    ┌─────────────────────────────────┐\n                    │        opencode.json             │\n                    │  Instrucciones + Permisos +      │\n                    │  Definición de agentes + Skills  │\n                    └──────────┬──────────────────────┘\n                               │\n          ┌────────────────────┼────────────────────┐\n          ▼                    ▼                    ▼\n   ┌────────────┐      ┌────────────┐      ┌──────────────┐\n   │  backend   │      │   mobile   │      │ whatsapp-bot │\n   │ (primary)  │      │ (primary)  │      │  (primary)   │\n   ├────────────┤      ├────────────┤      ├──────────────┤\n   │ Prompt:    │      │ Prompt:    │      │ Prompt:      │\n   │ backend.md │      │ mobile.md  │      │ whatsapp.md  │\n   │            │      │            │      │              │\n   │ Skills:    │      │ Skills:    │      │ Skills:      │\n   │ • migrate  │      │ • screen   │      │ • add-flow   │\n   │ • endpoint │      │ • expo-    │      │ • deploy     │\n   │            │      │   build    │      │              │\n   │ Rules:     │      │ Rules:     │      │ Rules:       │\n   │ • coding   │      │ • ui       │      │ • flows      │\n   │ • testing  │      │ • api      │      │              │\n   └────────────┘      └────────────┘      └──────────────┘\n                               │\n                    ┌──────────┴──────────┐\n                    ▼                     ▼\n             ┌──────────┐          ┌──────────┐\n             │   plan   │          │  build   │\n             │(read-only)│          │ (default)│\n             └──────────┘          └──────────┘\n```\n\n---\n\n*Documentación generada para el equipo de desarrollo SupplyCycle.*\n*Última actualización: Mayo 2026*\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Big Pickle · 4.2s)

_Thinking:_

The file was written successfully to `E:\Repo\SupplyCycle\docs\agent-configuration.md`. Let me verify it by reading it to make sure everything looks good.

Creado en `docs/agent-configuration.md`. Cubre:

1. Arquitectura general de agentes
2. Estructura de carpetas explicada
3. Propósito de cada archivo (AGENTS.md, rules/, prompts, skills, opencode.json)
4. Definición detallada de cada agente con permisos
5. Qué puede y no puede hacer cada uno (tabla comparativa)
6. Flujo de trabajo diario para el equipo
7. Comandos de verificación

---

