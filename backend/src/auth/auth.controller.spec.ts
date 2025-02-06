import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {AuthService} from "./auth.service";
import {UsersService} from "../users/users.service";
import {NotFoundException} from "@nestjs/common";

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
            login: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
          }
        },
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          }
        }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return the user object', async () => {
      const registerDto = {email: 'test@test.com', password: 'test1234'};
      const result = await authService.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });
  });

  describe('login', () => {
    it('should login a user and return a JWT token', async () => {
      const loginDto = {email: 'test@test.com', password: 'test1234'};
      const result = await authService.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ access_token: 'jwt_token' });
    });
  });

  describe('getUser', () => {
    it('should return the user object', async () => {
      const userId = 1;
      const expectedUser = { id: 1, email: 'test@test.com', password: 'hashed_password', reservations:[] };

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(expectedUser);

      const result = await authController.getUser(userId.toString());

      expect(usersService.findOneById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('getConnectedUser', () => {
    it('should return the connected user', async () => {
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashed_password', reservations: [] };
      const mockRequest = { user: { id: 1 } };

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(mockUser);

      const result = await authController.getConnectedUser(mockRequest as any);

      expect(usersService.findOneById).toHaveBeenCalledWith(1);

      expect(result).toEqual(mockUser);
    });
  });

});
