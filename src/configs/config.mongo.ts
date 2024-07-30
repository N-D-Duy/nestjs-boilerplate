import * as dotenv from 'dotenv';
dotenv.config();
const dev = {
    db: {
        uri: process.env.MONGOOSE_URL,
    },
    app: {
        port: process.env.DEV_PORT || 3000
    }
};

const proc = {
    db: {
        uri: process.env.MONGOOSE_URL,
    },
    app: {
        port: process.env.PROD_PORT
    }
};

export const config = process.env.NODE_ENV === 'production' ? proc : dev;
