export const isDevelopment = process.env.NODE_ENV !== 'production'

export const baseUrl = !isDevelopment && process.env.NEXT_PUBLIC_API_BASEURL_PRODUCTION
    ? process.env.NEXT_PUBLIC_API_BASEURL_PRODUCTION
    : 'http://localhost:5000/api'

export const client_baseUrl = !isDevelopment && process.env.NEXT_PUBLIC_CLIENT_BASEURL_PRODUCTION
    ? process.env.NEXT_PUBLIC_CLIENT_BASEURL_PRODUCTION
    : 'http://localhost:3000'