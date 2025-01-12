import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.vwhdn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
      try {
        const connection = await mongoose.connect(uri);
        console.log('DB connection success');
        return connection;
      } catch (error) {
        console.error('DB connection error:', error.message);
        throw error;
      }
    },
  },
];
