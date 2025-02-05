import {Body, Request, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Param} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {RegisterDto} from "../users/dto/register.dto";
import {LoginDto} from "../users/dto/login.dto";
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UsersService} from "../users/users.service";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'test@test.com' },
                password: { type: 'string', example: 'Test1234'},
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User succesfully registered',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Email already exists',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
    })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Public()
    @ApiOperation({ summary: 'Login an existing user and generate JWT token' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'test@test.com' },
                password: { type: 'string', example: 'Test1234'},
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully logged in, JWT token generated',
        schema: {
            example: {
                access_token: 'jwt-token-here',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid email or password',
    })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Get('user/:id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user details by ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully fetched the user details',
        schema: {
            example: {
                id: 1,
                email: 'test@test.com',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access, invalid or expired token',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found',
    })
    getUser(@Param('id') id: string){
        return this.usersService.findOneById(Number(id));
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getConnectedUser(@Request() req){
        return await this.usersService.findOneById(req.user.id);
    }
}
