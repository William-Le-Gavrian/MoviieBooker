import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {User} from "./users/entities/user.entity";
import {ConfigModule} from "@nestjs/config";
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.HOST,
          port: 5432,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [User],
          synchronize: true,
      }),
      AuthModule,
      UsersModule,
      MoviesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
