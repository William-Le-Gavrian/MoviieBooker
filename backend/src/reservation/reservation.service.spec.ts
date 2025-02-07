import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
    let reservationService: ReservationService;
    let reservationRepository: Repository<Reservation>;

    const mockReservationRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        remove: jest.fn(),
        manager: {
            save: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationService,
                { provide: getRepositoryToken(Reservation), useValue: mockReservationRepository },
            ],
        }).compile();

        reservationService = module.get<ReservationService>(ReservationService);
        reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    });

    it('should be defined', () => {
        expect(reservationService).toBeDefined();
    });

    describe('createReservation', () => {
        it('should create a new reservation successfully', async () => {
            const user: User = { id: 1, email:"test@test.com", password: "test1234", reservations: [] };
            const reservationDto = { movieId: 1, timeStart: new Date('2025-02-05T20:00:00.000Z') };
            const mockReservation = { id: 1, ...reservationDto, timeEnd: new Date(), user };

            mockReservationRepository.findOne.mockResolvedValue(null);
            mockReservationRepository.create.mockReturnValue(mockReservation);
            mockReservationRepository.save.mockResolvedValue(mockReservation);
            mockReservationRepository.manager.save.mockResolvedValue(mockReservation);

            const result = await reservationService.createReservation(user, reservationDto);
            expect(result).toEqual(mockReservation);
            expect(mockReservationRepository.create).toHaveBeenCalledWith({
                movieId: reservationDto.movieId,
                timeStart: expect.any(Date),
                timeEnd: expect.any(Date),
                user,
            });
            expect(mockReservationRepository.save).toHaveBeenCalledWith(mockReservation);
        });

        it('should throw a ConflictException if a reservation already exists for the time slot', async () => {
            const user: User = { id: 1, email:"test@test.com", password: "test1234", reservations: [] } as User;
            const reservationDto = { movieId: 1, timeStart: new Date('2025-02-05T20:00:00.000Z') };
            const existingReservation = { id: 1, ...reservationDto, timeEnd: new Date(), user };

            mockReservationRepository.findOne.mockResolvedValue(existingReservation);

            await expect(reservationService.createReservation(user, reservationDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('getReservationsByUser', () => {
        it('should return reservations for the given user', async () => {
            const user: User = { id: 1 } as User;
            const mockReservations = [
                { id: 1, movieId: 1, timeStart: new Date('2025-02-05T20:00:00.000Z'), timeEnd: new Date('2025-02-05T22:00:00.000Z') },
            ];

            mockReservationRepository.find.mockResolvedValue(mockReservations);

            const result = await reservationService.getReservationsByUser(user);
            expect(result).toEqual(mockReservations);
            expect(mockReservationRepository.find).toHaveBeenCalledWith({
                where: { user: { id: user.id } },
                order: { timeStart: 'ASC' },
            });
        });
    });

    describe('deleteReservation', () => {
        it('should delete a reservation successfully', async () => {
            const user: User = { id: 1 } as User;
            const reservationId = 1;
            const mockReservation = { id: reservationId, user };

            mockReservationRepository.findOne.mockResolvedValue(mockReservation);
            mockReservationRepository.remove.mockResolvedValue(undefined);

            const result = await reservationService.deleteReservation(user, reservationId);
            expect(result).toEqual({ message: 'Reservation successfully deleted' });
            expect(mockReservationRepository.remove).toHaveBeenCalledWith(mockReservation);
        });

        it('should throw NotFoundException if reservation does not exist', async () => {
            const user: User = { id: 1 } as User;
            const reservationId = 1;

            mockReservationRepository.findOne.mockResolvedValue(null);

            await expect(reservationService.deleteReservation(user, reservationId)).rejects.toThrow(NotFoundException);
        });
    });
});
