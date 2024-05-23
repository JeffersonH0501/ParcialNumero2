import { Test, TestingModule } from '@nestjs/testing';
import { PropuestaController } from './propuesta.controller';

describe('PropuestaController', () => {
  let controller: PropuestaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropuestaController],
    }).compile();

    controller = module.get<PropuestaController>(PropuestaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
