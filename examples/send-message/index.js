(async () => {
  const puppeteer = require('puppeteer')
  const bot = require('textnow-bot')
  const fs = require('fs').promises

  let browser = null
  let page = null

  try {
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()

    const client = await page.target().createCDPSession()
    let cookies = null

    // Provide existing saved cookies from file
    try {
      const cookiesJSON = await fs.readFile('./cookies.json')
      cookies = JSON.parse(cookiesJSON)

      // Log in and get updated cookies
      await page.setCookie(...cookies)
      cookies = await bot.login(page, client)
    }
    catch (error) {
      console.info('Unable to log in using existing cookies...')

      // Provide account credentials for fallback login
      const username = ''
      const password = ''

      cookies = await bot.login(page, client, username, password)
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

    if (page !== null) {
      await page.screenshot({ path: './error-main.jpg', type: 'jpeg' })
    }

    process.exit(1)
  }
  finally {
    if (browser !== null) {
      await browser.close()
    }
  }
})()
