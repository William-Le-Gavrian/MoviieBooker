import {Body, Request, Controller, Param, Post, UseGuards, Get, Delete} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ReservationDto} from "./dto/reservation.dto";
import {ReservationService} from "./reservation.service";
import {UsersService} from "../users/users.service";


@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService,
        private readonly userService: UsersService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createReservation(@Request() req, @Body() reservationDto: ReservationDto) {

        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.createReservation(user, reservationDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getReservations(@Request() req) {
        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.getReservationsByUser(user)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async cancelReservation(@Request() req, @Param('id') reservationId: string) {
        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.deleteReservation(user, Number(reservationId));
    }
}
