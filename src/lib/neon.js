import { Client } from 'pg';

export const neonConfig = {
  connectionString: process.env.REACT_APP_NEON_DATABASE_URL
};

export const getNeonClient = () => {
    return new Client({
        connectionString: neonConfig.connectionString
    });
};
