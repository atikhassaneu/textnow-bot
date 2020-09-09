/**
 * Log into TextNow and get cookies
 * @param  {object} page     Puppeteer browser page
 * @param  {object} client   Puppeteer CDPSession
 * @param  {string} username Optional account credential
 * @param  {string} password Optional account credential
 * @return {object}          Updated login cookies
 */
module.exports.logIn = async (page, client, username, password) => {
  await Promise.all([
    page.goto('https://www.textnow.com/login'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  if (username && password) {
    await page.type('#txt-username', username);
    await page.type('#txt-password', password);

    const logInButton = await page.waitForSelector('#btn-login');
    await Promise.all([
      logInButton.click(),
      page.waitForNavigation()
    ]);

    const cookies = (await client.send('Network.getAllCookies')).cookies;
    return cookies;
  }

  const isLoggedIn = page.url().includes('/messaging');

  if (!isLoggedIn) {
    throw new Error('Detected invalid or expired cookies');
  }

  const cookies = (await client.send('Network.getAllCookies')).cookies;
  return cookies;
}

/**
 * Select a conversation using recipient info
 * @param {object} page      Puppeteer browser page
 * @param {string} recipient Recipient info
 */
module.exports.selectConversation = async(page, recipient) => {
  await Promise.all([
    page.goto('https://www.textnow.com/messaging'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  await page.$eval('#newText', element => element.click());

  const recipientField = await page.waitForSelector('.newConversationTextField');
  await recipientField.type(recipient);
  await page.keyboard.press('Enter');
}

/**
 * Send a message to the current recipient
 * @param {object} page    Puppeteer browser page
 * @param {string} message Message content
 * @param {number} delay   Optional delay after sending message (ms)
 */
module.exports.sendMessage = async (page, message, delay) => {
  const messageField = await page.waitForSelector('#text-input');
  await messageField.type(message);
  await page.keyboard.press('Enter');
  await page.waitFor(delay || 500);
}
