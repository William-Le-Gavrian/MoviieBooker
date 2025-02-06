import {Body, Request, Controller, Param, Post, UseGuards, Get, Delete} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ReservationDto} from "./dto/reservation.dto";
import {ReservationService} from "./reservation.service";
import {UsersService} from "../users/users.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";


@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService,
        private readonly userService: UsersService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new reservation of a movie for a user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                movieId: { type: 'number', example: 1 },
                timeStart: { type: 'string', example: '2025-02-05T20:00:00.000Z' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Successfully created a reservation',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request, invalid data',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict, reservation already exists for this time slot',
    })
    async createReservation(@Request() req, @Body() reservationDto: ReservationDto) {

        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.createReservation(user, reservationDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all reservations for the logged-in user' })
    @ApiResponse({
        status: 200,
        description: 'Successfully fetched all reservations',
        schema: {
            example: [
                {
                    id: 1,
                    movieId: 1,
                    timeStart: '2025-02-05T20:00:00.000Z',
                    timeEnd: '2025-02-05T22:00:00.000Z',
                },
            ],
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized, invalid or expired token',
    })
    async getReservations(@Request() req) {
        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.getReservationsByUser(user)
    }

    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Cancel a reservation for a user by its ID' })
    @ApiResponse({
        status: 200,
        description: 'Successfully cancelled the reservation',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request, invalid reservation ID',
    })
    @ApiResponse({
        status: 404,
        description: 'Reservation not found',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized, invalid or expired token',
    })
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async cancelReservation(@Request() req, @Param('id') reservationId: string) {
        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.deleteReservation(user, Number(reservationId));
    }
}
