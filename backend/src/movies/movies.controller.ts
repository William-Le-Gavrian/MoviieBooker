import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import {MoviesService} from "./movies.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";

@ApiTags('Movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
export class MoviesController {

    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve movies filtered by page, title or different types of sorts' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Number of pages for pagination (default : 1)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'String for filtering films' })
    @ApiQuery({ name: 'sort', required: false, type: String, description: "Sort criteria (ex: 'popularity.asc', 'release_date.desc')" })
    getPopularMovies(@Query('page') page: number = 1, @Query('search') search?: string, @Query('sort') sort?: string) {
        return this.moviesService.getPopularMovies(page, search, sort);
    }
}
