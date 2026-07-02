import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { ServerConfig } from '../../config/index.js';

export const flightsServiceProxy = createProxyMiddleware({
  target: ServerConfig.FLIGHTS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api/v1${path}`,
  on: {
    proxyReq: fixRequestBody,
  },
});

export const bookingServiceProxy = createProxyMiddleware({
  target: ServerConfig.BOOKING_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api/v1${path}`,
  on: {
    proxyReq: (proxyReq: any, req: any, res: any) => {

      if (req.body && (req as any).user) {
        req.body.userId = (req as any).user.userId;
      }
      fixRequestBody(proxyReq, req);
    },
  },
});
