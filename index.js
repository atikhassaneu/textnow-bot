module.exports = {
  /**
   * Log into TextNow
   * @param  {object} page     Puppeteer browser page
   * @param  {string} username Account credential
   * @param  {string} password Account credential
   * @return {object}          Updated login cookies
   */
  login: async (page, username, password) => {
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

    return page.cookies()
  },

  /**
   * Select a conversation using recipient info
   * @param {object} page      Puppeteer browser page
   * @param {string} recipient Recipient contact info
   */
  selectConversation: async(page, recipient) => {
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
    const messageField = await page.waitForSelector('#text-input')
    await messageField.type(message)
    await page.keyboard.press('Enter')
    await page.waitFor(delay || 500)
  }
}
