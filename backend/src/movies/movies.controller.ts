import {Controller, Get, Query} from '@nestjs/common';
import {MoviesService} from "./movies.service";

@Controller('movies')
export class MoviesController {

    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    getPopularMovies(@Query('page') page: number = 1, @Query('search') search?: string, @Query('sort') sort?: string) {
        return this.moviesService.getPopularMovies(page, search, sort);
    }
}
