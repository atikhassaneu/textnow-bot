(async () => {
  const puppeteer = require('puppeteer')
  const bot = require('textnow-bot')
  const fs = require('fs').promises

  let browser = null

  try {
    browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    let cookies = null

    // Provide existing saved cookies from file
    try {
      const cookiesJSON = await fs.readFile('./cookies.json')
      cookies = JSON.parse(cookiesJSON)
      await page.setCookie(...cookies)
    }
    catch (error) {
      console.info('Unable to get existing cookies')
    }

    if (!cookies) {
      // Provide account credentials for login
      const username = ''
      const password = ''
      cookies = await bot.login(page, username, password)
    }

    // Save cookies to local file
    await fs.writeFile('./cookies.json', JSON.stringify(cookies))

    // Select a conversation
    const recipient = ''
    await bot.selectConversation(page, recipient)

    // Send message in conversation
    const message = 'hello world'
    const delay = 500
    await bot.sendMessage(page, message, delay)
  }
  catch (error) {
    console.error(error)
    process.exit(1)
  }
  finally {
    if (browser !== null) {
      await browser.close()
    }
  }
})()
