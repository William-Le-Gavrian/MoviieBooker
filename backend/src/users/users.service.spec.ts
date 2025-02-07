import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

describe('UsersService', () => {
    let usersService: UsersService;
    let userRepository: Repository<User>;

    const mockUserRepository = {
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useValue: mockUserRepository },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
    });

    describe('findOneById', () => {
        it('should return a user if found', async () => {
            const mockUser = { id: 1, email: 'test@example.com' } as User;
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await usersService.findOneById(1);
            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw UnauthorizedException if user is not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(usersService.findOneById(1)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('findOneByEmail', () => {
        it('should return a user by email', async () => {
            const mockUser = { id: 1, email: 'test@example.com' } as User;
            mockUserRepository.findOneBy.mockResolvedValue(mockUser);

            const result = await usersService.findOneByEmail('test@example.com');
            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
        });

        it('should return null if user is not found', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            const result = await usersService.findOneByEmail('notfound@example.com');
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create and return a user', async () => {
            const registerDto: RegisterDto = { email: 'new@example.com', password: 'hashedPassword' };
            const mockUser = { id: 1, ...registerDto } as User;

            mockUserRepository.save.mockResolvedValue(mockUser);

            const result = await usersService.create(registerDto);
            expect(result).toEqual(mockUser);
            expect(mockUserRepository.save).toHaveBeenCalledWith(registerDto);
        });
    });
});
