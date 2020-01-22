import { Test, TestingModule } from '@nestjs/testing';
import { ComicsController } from './comics.controller';

describe('Comics Controller', () => {
  let controller: ComicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComicsController],
    }).compile();

    controller = module.get<ComicsController>(ComicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
