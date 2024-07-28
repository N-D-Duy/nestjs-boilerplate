import * as dotenv from 'dotenv';
dotenv.config();
const dev = {
    db: {
        uri: process.env.MONGOOSE_URL,
    },
    app: {
        port: process.env.PORT || 3000
    }
};

const proc = {
    db: {
        uri: process.env.MONGOOSE_URL,
    },
    app: {
        port: process.env.PORT
    }
};

export const config = process.env.NODE_ENV === 'production' ? proc : dev;
