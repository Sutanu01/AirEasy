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

      if ((req as any).user) {
        proxyReq.setHeader('x-user-id', String((req as any).user.userId));
        proxyReq.setHeader('x-user-email', String((req as any).user.email));
        if (req.body) {
          req.body.userId = (req as any).user.userId;
        }
      }
      fixRequestBody(proxyReq, req);
    },
  },
});
