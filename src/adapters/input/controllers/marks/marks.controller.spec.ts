import { Test, TestingModule } from '@nestjs/testing';
import { MarksController } from './marks.controller';
import { MarksService } from 'src/application/modules/marks/marks.service';
import { ListMarksUseCasePort } from 'src/application/port/input/list-marks.usecase.port';
import { MarksResponseDTO } from './dtos/ListMarksResponseDTO';
import { CategoryEnum } from 'src/domain/enum/CategoryEnum';

const marksMock: MarksResponseDTO[] = [
  {
    id: '1',
    category: CategoryEnum.ACOES_INTERNACIONAIS,
    percentage: 50,
  },
  {
    id: '2',
    category: CategoryEnum.ACOES_NACIONAIS,
    percentage: 50,
  },
];

describe('MarksController', () => {
  let marksController: MarksController;

  const mockListMarksUseCase = {
    execute: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarksController],
      providers: [
        {
          provide: MarksService,
          useValue: jest.fn(),
        },
        {
          provide: ListMarksUseCasePort,
          useValue: mockListMarksUseCase,
        },
      ],
    }).compile();

    marksController = module.get<MarksController>(MarksController);
  });
  it('should be defined', () => {
    expect(marksController).toBeDefined();
  });

  it('list marks empty for user ', async () => {
    const idUser = '1';
    mockListMarksUseCase.execute.mockReturnValue([]);

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await marksController.findAll({ user: { sub: idUser } }, mockResponse);

    expect(mockListMarksUseCase.execute).toHaveBeenCalledWith(idUser);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith([]);
  });

  it('list marks for user ', async () => {
    const idUser = '1';
    mockListMarksUseCase.execute.mockReturnValue(marksMock);

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await marksController.findAll({ user: { sub: idUser } }, mockResponse);

    expect(mockListMarksUseCase.execute).toHaveBeenCalledWith(idUser);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(marksMock);
  });
});
