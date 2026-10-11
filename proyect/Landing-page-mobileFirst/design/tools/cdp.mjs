// Minimal Chrome DevTools Protocol client for Phase 0 measurements.
// No dependencies: Node >= 22 (global WebSocket/fetch) + a local Chrome install.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    const listeners = new Set();
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej, method } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(`${method}: ${msg.error.message}`));
        else res(msg.result);
      } else if (msg.method) {
        for (const l of listeners) l(msg);
      }
    };
    ws.onerror = reject;
    ws.onopen = () =>
      resolve({
        send(method, params = {}, sessionId) {
          const mid = ++id;
          ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
          return new Promise((res, rej) => pending.set(mid, { res, rej, method }));
        },
        on(fn) {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
        ws,
      });
  });
}

export async function launch({ port = 9333 } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'phase0-chrome-'));
  const proc = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${dir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-sync',
      '--hide-scrollbars',
      '--mute-audio',
      '--autoplay-policy=no-user-gesture-required',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
  let version;
  for (let i = 0; i < 75 && !version; i++) {
    try {
      version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    } catch {
      await sleep(200);
    }
  }
  if (!version) throw new Error('Chrome did not start');
  const browser = await connect(version.webSocketDebuggerUrl);
  browser.version = version;
  browser.close = async () => {
    try {
      await browser.send('Browser.close');
    } catch {}
    proc.kill();
    await sleep(800);
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {}
  };
  return browser;
}

export async function newPage(browser, { isolated = true } = {}) {
  let browserContextId;
  if (isolated) ({ browserContextId } = await browser.send('Target.createBrowserContext'));
  const { targetId } = await browser.send('Target.createTarget', {
    url: 'about:blank',
    browserContextId,
  });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const inflight = new Map();
  const page = {
    browserContextId,
    targetId,
    sessionId,
    send: (m, p) => browser.send(m, p, sessionId),
    on: (method, fn) =>
      browser.on((msg) => {
        if (msg.sessionId === sessionId && msg.method === method) fn(msg.params);
      }),
    inflight,
    async close() {
      await browser.send('Target.closeTarget', { targetId }).catch(() => {});
      if (browserContextId)
        await browser.send('Target.disposeBrowserContext', { browserContextId }).catch(() => {});
    },
  };
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Network.enable');
  page.on('Network.requestWillBeSent', (p) => {
    if (p.type !== 'Media' && p.type !== 'WebSocket') inflight.set(p.requestId, p.request.url);
  });
  page.on('Network.loadingFinished', (p) => inflight.delete(p.requestId));
  page.on('Network.loadingFailed', (p) => inflight.delete(p.requestId));
  return page;
}

export async function setViewport(page, width, { height, mobile } = {}) {
  const isMobile = mobile ?? width < 768;
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: height ?? (isMobile ? 844 : 800),
    deviceScaleFactor: 1,
    mobile: isMobile,
  });
  await page.send('Emulation.setTouchEmulationEnabled', { enabled: isMobile });
}

export async function waitIdle(page, { quietMs = 800, maxMs = 20000 } = {}) {
  const start = Date.now();
  let quietSince = Date.now();
  while (Date.now() - start < maxMs) {
    if (page.inflight.size > 0) quietSince = Date.now();
    else if (Date.now() - quietSince >= quietMs) return true;
    await sleep(100);
  }
  return false;
}

export async function goto(page, url, opts = {}) {
  const loaded = new Promise((r) => {
    const off = page.on('Page.loadEventFired', () => {
      off();
      r();
    });
  });
  await page.send('Page.navigate', { url });
  await Promise.race([loaded, sleep(30000)]);
  await waitIdle(page, opts);
}

export async function evaluate(page, expression) {
  const { result, exceptionDetails } = await page.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails)
    throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  return result.value;
}

export async function autoScroll(page, { stepMs = 300 } = {}) {
  await evaluate(
    page,
    `(async () => {
      const sleep = (ms) => new Promise(r => setTimeout(r, ms));
      let last = -1;
      for (let i = 0; i < 200; i++) {
        window.scrollBy(0, Math.round(window.innerHeight * 0.7));
        await sleep(${stepMs});
        const y = window.scrollY;
        if (y === last) break;
        last = y;
      }
    })()`,
  );
  await waitIdle(page, { maxMs: 15000 });
  await evaluate(page, 'window.scrollTo(0, 0)');
  await sleep(1200);
}

export async function screenshot(page, path, { fullPage = true } = {}) {
  let params = { format: 'png' };
  if (fullPage) {
    const { cssContentSize } = await page.send('Page.getLayoutMetrics');
    params = {
      ...params,
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 },
    };
  }
  const { data } = await page.send('Page.captureScreenshot', params);
  writeFileSync(path, Buffer.from(data, 'base64'));
}

export async function rectOf(page, selector, index = 0) {
  return evaluate(
    page,
    `(async () => {
      const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
      if (!el) return null;
      el.scrollIntoView({ block: 'center', inline: 'center' });
      await new Promise(r => setTimeout(r, 700));
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
    })()`,
  );
}

export async function click(page, selector, index = 0) {
  const r = await rectOf(page, selector, index);
  if (!r) throw new Error(`Not found: ${selector}[${index}]`);
  const base = { x: r.x, y: r.y, button: 'left', clickCount: 1 };
  await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.x, y: r.y });
  await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...base });
  await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...base });
  await sleep(300);
  return r;
}

export async function type(page, selector, text, index = 0) {
  await click(page, selector, index);
  await page.send('Input.insertText', { text });
  await sleep(150);
}

export async function pressKey(page, key, code = key, keyCode) {
  const p = { key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode };
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', ...p });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', ...p });
  await sleep(120);
}
