import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UnauthorizedException} from "@nestjs/common";

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    const mockUsersService = {
        findOneByEmail: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerDto = { email: 'test@example.com', password: 'password123' };
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const newUser = { id: 1, email: registerDto.email, password: hashedPassword };

            mockUsersService.findOneByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue(newUser);

            const result = await authService.register(registerDto);
            expect(result).toEqual(newUser);
            expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerDto.email);
            expect(mockUsersService.create).toHaveBeenCalledWith({
                email: registerDto.email,
                password: expect.any(String),
            });
        });

        // it('should throw an error if email already exists', async () => {
        //     const registerDto = { email: 'test@example.com', password: 'password123' };
        //     const existingUser = { id: 1, email: registerDto.email, password: 'hashedPassword' };
        //
        //     mockUsersService.findOneByEmail.mockResolvedValue(existingUser);
        //
        //     await expect(authService.register(registerDto)).rejects.toThrow(UnauthorizedException);
        //     expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerDto.email);
        //     expect(mockUsersService.create).not.toHaveBeenCalled();
        // });
    });

    describe('login', () => {
        it('should login successfully and return a JWT', async () => {
            const loginDto = { email: 'test@example.com', password: 'password123' };
            const user = { id: 1, email: loginDto.email, password: await bcrypt.hash(loginDto.password, 10) };

            mockUsersService.findOneByEmail.mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

            const result = await authService.login(loginDto);
            expect(result).toEqual({ access_token: 'fake-jwt-token' });
            expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
            expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id, email: user.email });
        });

        // it('should throw an error if user does not exist', async () => {
        //     const loginDto = { email: 'notfound@example.com', password: 'password123' };
        //     mockUsersService.findOneByEmail.mockResolvedValue(null);
        //
        //     await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
        //     expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
        //     expect(jwtService.signAsync).not.toHaveBeenCalled();
        // });
        //
        // it('should throw an error if password is incorrect', async () => {
        //     const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
        //     const user = { id: 1, email: loginDto.email, password: await bcrypt.hash('password123', 10) };
        //
        //     mockUsersService.findOneByEmail.mockResolvedValue(user);
        //     jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
        //
        //     await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
        //     expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
        //     expect(jwtService.signAsync).not.toHaveBeenCalled();
        // });
    });
});
