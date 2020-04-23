# TextNow Bot

<!-- [START badges] -->
[![npm](https://img.shields.io/npm/v/textnow-bot)](https://www.npmjs.com/package/textnow-bot)
[![Node.js](https://img.shields.io/badge/environment-Node.js-brightgreen)](#)
[![Puppeteer](https://img.shields.io/badge/API-Puppeteer-brightgreen)](#)
[![license](https://img.shields.io/github/license/george-lim/textnow-bot)](https://github.com/george-lim/textnow-bot/blob/master/LICENSE)
<!-- [END badges] -->

> TextNow Bot is a Node library that allows TextNow messages to be sent programmatically. All communication is handled through the [Puppeteer API](https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md).

<!-- [START getstarted] -->
## Getting Started

### Installation

To use TextNow Bot in your project, run:

```bash
npm install textnow-bot puppeteer
# or "yarn add textnow-bot puppeteer"
```

### Usage

An [example project](https://github.com/george-lim/textnow-bot/blob/master/examples/send-message) is provided to demonstrate how TextNow Bot can be used alongside Puppeteer to send a message.

Note: SSO login is currently unsupported.

Execute script on the command line:
```bash
cd examples/send-message
npm install
# or "yarn install"
node .
```
<!-- [END getstarted] -->
