import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MoviesService {
    private readonly apiUrl: string | undefined;
    private readonly bearerToken: string | undefined;

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
    ) {
        this.apiUrl = this.configService.get<string>('TMDB_API_URL');
        this.bearerToken = this.configService.get<string>('TMDB_API_TOKEN');
    }

    async getPopularMovies(page: number = 1, search?: string, sort?: string) {
        try {
            const endpoint = search ? '/search/movie' : (sort ? '/discover/movie' : '/movie/popular');
            const params: any = { page }

            if (search) params.query = search;
            if (sort) params.sort_by = sort;

            const response = await this.httpService.axiosRef.get(`${this.apiUrl}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                    Accept: 'application/json',
                },
                params: params,
            });
            return response.data;
        } catch (error) {
            console.error('Error while retrieving the movies', error);
            throw error;
        }
    }
}
