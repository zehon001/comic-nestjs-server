import { Test, TestingModule } from '@nestjs/testing';
import { CrawlertaskController } from './crawlertask.controller';

describe('Crawlertask Controller', () => {
  let controller: CrawlertaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlertaskController],
    }).compile();

    controller = module.get<CrawlertaskController>(CrawlertaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
