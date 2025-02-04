import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {UsersService} from "../users/users.service";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstant} from "./constants";

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      JwtModule.register({
        global: true,
        secret: jwtConstant.secret,
        signOptions: { expiresIn: '300s'},
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService]
})
export class AuthModule {}
