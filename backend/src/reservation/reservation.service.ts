import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Reservation} from "./entities/reservation.entity";
import {LessThan, MoreThan, Between, Repository} from "typeorm";
import {User} from "../users/entities/user.entity";
import {ReservationDto} from "./dto/reservation.dto";

@Injectable()
export class ReservationService {

    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
    ){}

    async createReservation(user: User, reservationDto: ReservationDto) {
        const { movieId, timeStart } = reservationDto;
        const start = new Date(timeStart)
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

        const conflict = await this.reservationRepository.findOne({
            where:[
                {
                    user: {id: user.id},
                    timeStart: Between(start, end),
                },
                {
                    user: {id: user.id},
                    timeStart: LessThan(start),
                    timeEnd: MoreThan(start),
                }
            ]
        });

        if(conflict){
            throw new ConflictException('There is already a reservation for this time slot');
        }

        try {
            const reservation = this.reservationRepository.create({
                movieId: movieId,
                timeStart: start,
                timeEnd: end,
                user: user,
            });

            return await this.reservationRepository.save(reservation);
        } catch (error) {
            throw new ConflictException(error);
        }
    }

    async getReservationsByUser(user: User): Promise<Reservation[]> {
        return await this.reservationRepository.find({
            where: {
                user: {id: user.id},
            },
            order: {
                timeStart: 'ASC',
            }
        })
    }

    async deleteReservation(user: User, reservationId: number): Promise<{ message: string }> {
        const toDeleteReservation = await this.reservationRepository.findOne({
            where: {
                id: reservationId,
                user: {id: user.id}
            },
        });

        if(!toDeleteReservation){
            throw new NotFoundException("This reservation does not exist for this user");
        }

        try{
            await this.reservationRepository.remove(toDeleteReservation);
            return { message : "Reservation successfully deleted"};
        } catch (error) {
            console.error('Error while deleting the reservation', error);
            throw error;
        }

    }
}
