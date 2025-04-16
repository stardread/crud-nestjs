import { Test, TestingModule } from '@nestjs/testing';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { mockPerson, mockPersonRepository } from './persons.mock';

describe('PersonsController', () => {
  let controller: PersonsController;
  let provider: PersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController],
      providers: [
        {
          provide: PersonsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockPersonRepository),
            findOneById: jest.fn().mockResolvedValue(mockPersonRepository[0]),
            create: jest.fn().mockResolvedValue(mockPerson),
            delete: jest.fn(),
            update: jest.fn().mockResolvedValue(mockPerson),
          },
        },
      ],
    }).compile();

    controller = module.get<PersonsController>(PersonsController);
    provider = module.get<PersonsService>(PersonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const persons = await controller.getAllPersons();
      expect(persons).toEqual(mockPersonRepository);
    });
  });

  describe('findOneById', () => {
    it('should return a person by id', async () => {
      const person = await controller.getPersonById(1);
      expect(person).toEqual(mockPersonRepository[0]);
      expect(jest.spyOn(provider, 'findOneById')).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new person', async () => {
      const newPerson = await controller.createPerson(mockPerson);
      expect(newPerson).toEqual(mockPerson);
      expect(jest.spyOn(provider, 'create')).toHaveBeenCalledWith(mockPerson);
    });
  });

  describe('delete', () => {
    it('should delete a person by id', async () => {
      const id = 1;
      await controller.deletePerson(id);
      expect(jest.spyOn(provider, 'delete')).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a person by id', async () => {
      const id = 1;
      const updatedPerson = await controller.updatePerson(id, mockPerson);
      expect(updatedPerson).toEqual(mockPerson);
      expect(jest.spyOn(provider, 'update')).toHaveBeenCalledWith(
        id,
        mockPerson,
      );
    });
  });
});
