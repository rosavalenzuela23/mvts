import { Test, TestingModule } from '@nestjs/testing';
import { EstacionCentralService } from './estacion-central.service';

describe('EstacionCentralService', () => {
  let service: EstacionCentralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstacionCentralService],
    }).compile();

    service = module.get<EstacionCentralService>(EstacionCentralService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
