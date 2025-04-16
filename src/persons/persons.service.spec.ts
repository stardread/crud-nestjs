import { Test, TestingModule } from '@nestjs/testing';
import { PersonsService } from './persons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { mockPersonRepository, mockPerson } from './persons.mock';

describe('Persons', () => {
  let provider: PersonsService;
  let repository: Repository<Person>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsService,
        {
          provide: 'PersonRepository',
          useValue: {
            find: jest.fn().mockReturnValue(mockPersonRepository),
            findOneBy: jest.fn().mockImplementation((by) => {
              const person = mockPersonRepository.find(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                (person) => person.id === by.id,
              );
              return person ? Promise.resolve(person) : Promise.resolve(null);
            }),
            save: jest
              .fn()
              .mockImplementation(
                (person: Person) =>
                  mockPersonRepository[person.id - 1] || mockPerson,
              ),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = module.get<PersonsService>(PersonsService);
    repository = module.get<Repository<Person>>(getRepositoryToken(Person));
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const persons = await provider.findAll();
      expect(persons).toEqual(mockPersonRepository);
    });
  });

  describe('findOneById', () => {
    it('should return a person by id', async () => {
      const person = await provider.findOneById(1);
      expect(person).toEqual(mockPersonRepository[0]);
      expect(jest.spyOn(repository, 'findOneBy')).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should return null if person not found', async () => {
      const person = await provider.findOneById(999);
      expect(person).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new person', async () => {
      const newPerson = await provider.create(mockPerson);
      expect(newPerson).toEqual(mockPerson);
    });
  });

  describe('delete', () => {
    it('should delete a person by id', async () => {
      const result = await provider.delete(1);
      expect(result).toBeUndefined();
      expect(jest.spyOn(repository, 'delete')).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a person by id', async () => {
      const updatedPerson = await provider.update(3, {
        phoneNumber: mockPerson.phoneNumber,
        city: mockPerson.city,
      });
      expect(updatedPerson).toEqual(mockPersonRepository[2]);
      expect(jest.spyOn(repository, 'save')).toHaveBeenCalledWith({
        id: mockPersonRepository[2].id,
        name: mockPersonRepository[2].name,
        city: mockPerson.city,
        phoneNumber: mockPerson.phoneNumber,
      });
    });

    it('should throw an error if person not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expect(
        provider.update(999, {
          phoneNumber: mockPerson.phoneNumber,
          city: mockPerson.city,
        }),
      ).rejects.toThrow('Person with id 999 not found');
    });
  });
});
