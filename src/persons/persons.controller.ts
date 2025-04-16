import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Person } from './person.entity';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './DTO/create-person.dto';
import { DeleteResult } from 'typeorm';
import { UpdatePersonDto } from './DTO/update-person.dto';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}
  @Get()
  getAllPersons(): Promise<Person[]> {
    return this.personsService.findAll();
  }

  @Get(':id')
  getPersonById(@Param('id') id: number): Promise<Person | null> {
    return this.personsService.findOneById(id);
  }

  @Post()
  createPerson(@Body() newPersonDto: CreatePersonDto): Promise<Person> {
    return this.personsService.create(newPersonDto);
  }

  @Delete(':id')
  deletePerson(@Param('id') id: number): Promise<DeleteResult> {
    return this.personsService.delete(id);
  }

  @Put(':id')
  updatePerson(
    @Param('id') id: number,
    @Body() updatedPersonDto: UpdatePersonDto,
  ): Promise<Person> {
    return this.personsService.update(id, updatedPersonDto);
  }
}
