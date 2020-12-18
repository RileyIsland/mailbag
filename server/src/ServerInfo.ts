export interface IServerInfo {
    imap: {
        auth: {
            pass: string,
            user: string
        },
        host: string,
        port: number
    },
    smtp: {
        auth: {
            pass: string,
            user: string
        },
        host: string,
        port: number
    }
}

export let serverInfo: IServerInfo = {
    imap: {
        auth: {
            pass: `${process.env.IMAP_AUTH_PASS}`,
            user: `${process.env.IMAP_AUTH_USER}`
        },
        host: `${process.env.IMAP_HOST}`,
        port: parseInt(`${process.env.IMAP_PORT}`)
    },
    smtp: {
        auth: {
            pass: `${process.env.SMTP_AUTH_PASS}`,
            user: `${process.env.SMTP_AUTH_USER}`
        },
        host: `${process.env.SMTP_HOST}`,
        port: parseInt(`${process.env.SMTP_PORT}`)
    }
};
