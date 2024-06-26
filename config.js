import dotenv from 'dotenv'

dotenv.config();

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    mongoMockURL: process.env.MONGO_MOCK_URL,
    sessionSecret: process.env.SESSION_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    githubPassportClientId: process.env.GITHUB_PASSPORT_CLIENTID,
    githubPassportClientSecret:process.env.GITHUB_PASSPORT_CLIENT_SECRET,
    enviroment: process.env.ENVIROMENT,
    gmailCode: process.env.GMAILCODE,
    gmailUser: process.env.GMAILUSER
}