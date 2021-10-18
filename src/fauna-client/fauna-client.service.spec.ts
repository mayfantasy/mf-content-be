import { Test, TestingModule } from '@nestjs/testing';
import { FaunaClientService } from './fauna-client.service';

describe('FaunaClientService', () => {
  let service: FaunaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaunaClientService],
    }).compile();

    service = module.get<FaunaClientService>(FaunaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
