import { Module } from '@nestjs/common';
import { databaseProviders } from 'src/database/database.providers.ts';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
