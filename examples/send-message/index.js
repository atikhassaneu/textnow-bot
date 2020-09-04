(async () => {
  const puppeteer = require('puppeteer')
  const textnow = require('textnow-bot')
  const fs = require('fs').promises

  let browser = null
  let page = null

  // Account credentials
  const username = ''
  const password = ''
  // Recipient info
  const recipient = ''
  // Message info
  const message = 'hello world'

  try {
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
    const client = await page.target().createCDPSession()
    let cookies = null

    // Import cookies from file
    try {
      console.debug('Importing existing cookies...')
      const cookiesJSON = await fs.readFile('./cookies.json')
      cookies = JSON.parse(cookiesJSON)
    }
    catch (exception) {
      console.debug('Failed to import existing cookies.')
    }

    // Log into TextNow and get cookies
    try {
      console.debug('Logging in with existing cookies...')
      await page.setCookie(...cookies)
      cookies = await textnow.logIn(page, client)
    }
    catch (exception) {
      console.debug('Failed to log in with existing cookies.')
      console.debug('Logging in with account credentials...')
      cookies = await textnow.logIn(page, client, username, password)
    }

    // Save cookies to file
    console.debug('Successfully logged into TextNow!')
    await fs.writeFile('./cookies.json', JSON.stringify(cookies))

    // Select a conversation using recipient info
    console.debug('Selecting conversation...')
    await textnow.selectConversation(page, recipient)

    // Send a message to the current recipient
    console.debug('Sending message...')
    await textnow.sendMessage(page, message)

    console.debug('Message sent!')
    await browser.close()
  }
  catch (exception) {
    console.error(exception)

    if (page) {
      await page.screenshot({ path: './error-screenshot.jpg', type: 'jpeg' })
    }

    if (browser) {
      await browser.close()
    }

    process.exit(1)
  }
})()
