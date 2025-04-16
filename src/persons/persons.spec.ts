import { Test, TestingModule } from '@nestjs/testing';
import { PersonsService } from './persons.service';

describe('Persons', () => {
  let provider: PersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonsService],
    }).compile();

    provider = module.get<PersonsService>(PersonsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
