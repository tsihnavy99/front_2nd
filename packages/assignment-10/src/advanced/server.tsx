// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { App } from './App.tsx';

const app = express();
const port = 3333;

const cache = new Map(); // 캐시 저장소

// 서버 시작 시 연산 수행
initialize();

app.get('*', async (req, res) => {
  const url = req.url;
  const cachedResult = await getCachedAppResult(url);
  if (cachedResult) {
    res.send(renderHtml(cachedResult));
    return;
  }

  const appResult = preRenderApp(url);
  cache.set(url, appResult);
  res.send(renderHtml(appResult));
});

function initialize() {
  // 모든 URL에 대해 고비용 연산 수행 및 결과 캐싱
  const urls = ['/'];
  for (const url of urls) {
    const appResult = preRenderApp(url);
    cache.set(url, appResult);
  }
}

function getCachedAppResult(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  return null;
}

function preRenderApp(url: string) {
  const app = ReactDOMServer.renderToString(<App url={url} />);
  return app;
}

function renderHtml(appResult: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple SSR</title>
    </head>
    <body>
      <div id="root">${appResult}</div>
    </body>
    </html>
  `;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
