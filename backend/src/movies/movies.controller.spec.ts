import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('MoviesController', () => {
    let controller: MoviesController;
    let moviesService: MoviesService;

    beforeEach(async () => {
        const mockMoviesService = {
            getPopularMovies: jest.fn(),
        };

        const mockJwtAuthGuard = {
            canActivate: jest.fn(() => true), // Mock JwtAuthGuard to always pass
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                { provide: MoviesService, useValue: mockMoviesService },
                { provide: JwtAuthGuard, useValue: mockJwtAuthGuard },
            ],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
        moviesService = module.get<MoviesService>(MoviesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getPopularMovies', () => {
        it('should return movies data when called with default parameters', async () => {
            const mockMoviesData = { results: [], page: 1, total_results: 100 };
            jest.spyOn(moviesService, 'getPopularMovies').mockResolvedValue(mockMoviesData);

            const result = await controller.getPopularMovies(1);
            expect(result).toEqual(mockMoviesData);
            expect(moviesService.getPopularMovies).toHaveBeenCalledWith(1, undefined, undefined);
        });

        it('should return filtered movies when search query is passed', async () => {
            const mockMoviesData = { results: [], page: 1, total_results: 50 };
            const search = 'Inception';
            jest.spyOn(moviesService, 'getPopularMovies').mockResolvedValue(mockMoviesData);

            const result = await controller.getPopularMovies(1, search);
            expect(result).toEqual(mockMoviesData);
            expect(moviesService.getPopularMovies).toHaveBeenCalledWith(1, search, undefined);
        });

        it('should return sorted movies when sort query is passed', async () => {
            const mockMoviesData = { results: [], page: 1, total_results: 75 };
            const sort = 'popularity.desc';
            jest.spyOn(moviesService, 'getPopularMovies').mockResolvedValue(mockMoviesData);

            const result = await controller.getPopularMovies(1, undefined, sort);
            expect(result).toEqual(mockMoviesData);
            expect(moviesService.getPopularMovies).toHaveBeenCalledWith(1, undefined, sort);
        });

        it('should return filtered and sorted movies when both search and sort queries are passed', async () => {
            const mockMoviesData = { results: [], page: 1, total_results: 30 };
            const search = 'Avatar';
            const sort = 'release_date.desc';
            jest.spyOn(moviesService, 'getPopularMovies').mockResolvedValue(mockMoviesData);

            const result = await controller.getPopularMovies(1, search, sort);
            expect(result).toEqual(mockMoviesData);
            expect(moviesService.getPopularMovies).toHaveBeenCalledWith(1, search, sort);
        });

        it('should throw an error if service call fails', async () => {
            const error = new Error('Service error');
            jest.spyOn(moviesService, 'getPopularMovies').mockRejectedValue(error);

            try {
                await controller.getPopularMovies(1);
            } catch (e) {
                expect(e).toBe(error);
            }
        });
    });
});
