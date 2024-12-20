export const oktaConfig = {
    baseUrl: `https://${process.env.REACT_APP_OKTA_DOMAIN}.okta.com`,
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
    issuer: `https://${process.env.REACT_APP_OKTA_DOMAIN}.okta.com/oauth2/default`,
    redirectUri: `${process.env.REACT_APP_HTTPS_ENABLED === 'true' ? 'https': 'http'}://localhost:3000/login/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true
}