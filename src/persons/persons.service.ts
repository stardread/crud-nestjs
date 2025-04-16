import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePersonDto } from './DTO/create-person.dto';
import { UpdatePersonDto } from './DTO/update-person.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person) private personsRepository: Repository<Person>,
  ) {}

  findAll(): Promise<Person[]> {
    return this.personsRepository.find();
  }

  findOneById(id: number): Promise<Person | null> {
    return this.personsRepository.findOneBy({ id });
  }

  create(newPersonDto: CreatePersonDto): Promise<Person> {
    const newPerson = new Person();
    newPerson.name = newPersonDto.name;
    newPerson.city = newPersonDto.city;
    newPerson.phoneNumber = newPersonDto?.phoneNumber;
    return this.personsRepository.save(newPerson);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.personsRepository.delete(id);
  }

  async update(id: number, updatedPersonDto: UpdatePersonDto): Promise<Person> {
    const existingPerson = await this.personsRepository.findOneBy({ id });
    if (!existingPerson) {
      throw new Error(`Person with id ${id} not found`);
    }
    if (updatedPersonDto.city) {
      existingPerson.city = updatedPersonDto.city;
    }
    if (updatedPersonDto.phoneNumber) {
      existingPerson.phoneNumber = updatedPersonDto.phoneNumber;
    }
    return this.personsRepository.save({
      ...existingPerson,
    });
  }
}
