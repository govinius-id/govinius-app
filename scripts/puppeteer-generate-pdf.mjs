import tmp from 'tmp';
import puppeteer from 'puppeteer';

process.on('message', async (options) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-gpu'],
      headless: true,
    });

    const tmpPath = tmp.fileSync().name;

    const page = await browser.newPage();

    await page.setContent(options.html, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.pdf({
      path: tmpPath,
      width: options.width,
      height: options.height,
      format: options.format,
      headerTemplate: '<p></p>',
      footerTemplate: '<p></p>',
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      printBackground: true,
      landscape: options.rotate === 'LANDSCAPE',
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });

    await page.close();
    await browser.close();

    global?.gc();

    process.send?.({
      data: tmpPath,
    });

    process.exit(0);
  } catch (error) {
    process.send?.({
      error: error,
    });
    process.exit(1);
  }
});
