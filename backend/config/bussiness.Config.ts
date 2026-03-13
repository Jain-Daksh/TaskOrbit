export const config = {
  SALT_ROUNDS: 10,
  SMTP: {
    HOST: process.env.SMTP_HOST,
    PORT: Number(process.env.SMTP_PORT),
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASS,
    FROM_NAME: 'MyApp',
    FROM_EMAIL: 'no-reply@myapp.com',
  },
  maxWorkSpace: 5,
  maxProjectByTier: {
    Free: 5,
    Standard: 15,
    Premium: 50,
  },
};
