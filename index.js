module.exports = {
  /**
   * Log into TextNow and renew cookies
   * @param  {object} page     Puppeteer browser page
   * @param  {object} client   Puppeteer CDPSession
   * @param  {string} username Optional account credential
   * @param  {string} password Optional account credential
   * @return {object}          Updated login cookies
   */
  login: async (page, client, username, password) => {
    if (username && password) {
      console.info('Logging in with account credentials...')

      await Promise.all([
        page.goto('http://textnow.com/login'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
      ])

      await page.type('#txt-username', username)
      await page.type('#txt-password', password)

      const loginButton = await page.waitForSelector('#btn-login')

      await Promise.all([
        loginButton.click(),
        page.waitForNavigation()
      ])

      const cookies = (await client.send('Network.getAllCookies')).cookies
      return cookies
    }

    console.info('Logging in with existing cookies...')

    await Promise.all([
      page.goto('https://www.textnow.com/login'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ])

    const isLoggedIn = page.url().includes('/messaging')

    if (!isLoggedIn) {
      throw new Error('Existing cookies are invalid / expired')
    }

    const cookies = (await client.send('Network.getAllCookies')).cookies
    return cookies
  },

  /**
   * Select a conversation using recipient info
   * @param {object} page      Puppeteer browser page
   * @param {string} recipient Recipient contact info
   */
  selectConversation: async(page, recipient) => {
    console.info('Selecting conversation...')

    await Promise.all([
      page.goto('https://www.textnow.com/messaging'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ])

    await page.$eval('#newText', element => element.click())

    const recipientField = await page.waitForSelector('.newConversationTextField')
    await recipientField.type(recipient)
    await page.keyboard.press('Enter')
  },

  /**
   * Send a message to the current recipient
   * @param {object} page    Puppeteer browser page
   * @param {string} message Message content
   * @param {number} delay   Optional delay after sending message (ms)
   */
  sendMessage: async (page, message, delay) => {
    console.info('Sending message...')

    const messageField = await page.waitForSelector('#text-input')
    await messageField.type(message)
    await page.keyboard.press('Enter')
    await page.waitFor(delay || 500)
  }
}
