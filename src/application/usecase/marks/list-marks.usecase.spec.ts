import { Test, TestingModule } from '@nestjs/testing';
import { ListMarksUseCase } from './list-marks.usecase';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Marks } from '../../../adapters/output/marks/marks.entity';
import { CategoryEnum } from '../../../domain/enum/CategoryEnum';

const mockMarks = [
  {
    marks_category: CategoryEnum.ACOES_INTERNACIONAIS,
    marks_percentage: 50,
    marks_id: '8988',
  },
  {
    marks_category: CategoryEnum.ACOES_NACIONAIS,
    marks_percentage: 50,
    marks_id: '2554',
  },
];

// Mock repository
const mockMarksRepository = {
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    addGroupBy: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(mockMarks),
  })),
};

describe('ListMarksUseCase', () => {
  let listMarksUseCase: ListMarksUseCase;
  const IDUSER = '123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListMarksUseCase,
        {
          provide: getRepositoryToken(Marks),
          useValue: mockMarksRepository,
        },
      ],
    }).compile();

    listMarksUseCase = module.get<ListMarksUseCase>(ListMarksUseCase);
  });

  it('should be defined', () => {
    expect(listMarksUseCase).toBeDefined();
  });

  it('should return marks empty elements', async () => {
    mockMarksRepository.createQueryBuilder = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    }));

    const result = await listMarksUseCase.execute(IDUSER);
    expect(result).toEqual([
      {
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage: 0,
        id: undefined,
      },
      {
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage: 0,
        id: undefined,
      },
      {
        category: CategoryEnum.FUNDOS_IMOBILIARIOS,
        percentage: 0,
        id: undefined,
      },
      {
        category: CategoryEnum.REITS,
        percentage: 0,
        id: undefined,
      },
      {
        category: CategoryEnum.RENDA_FIXA,
        percentage: 0,
        id: undefined,
      },
      {
        category: CategoryEnum.CRIPTO_MOEDA,
        percentage: 0,
        id: undefined,
      },
    ]);
  });

  it('should return array of marks', async () => {
    mockMarksRepository.createQueryBuilder = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockMarks),
    }));

    const result = await listMarksUseCase.execute(IDUSER);
    expect(result).toEqual([
      {
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage: 50,
        id: '2554',
      },
      {
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage: 50,
        id: '8988',
      },
      {
        category: CategoryEnum.FUNDOS_IMOBILIARIOS,
        percentage: 0,
        id: undefined,
      },
      {
        category: CategoryEnum.REITS,
        percentage: 0,
        id: undefined,
      },
      {
        category: CategoryEnum.RENDA_FIXA,
        percentage: 0,
        id: undefined,
      },
      {
        category: CategoryEnum.CRIPTO_MOEDA,
        percentage: 0,
        id: undefined,
      },
    ]);
  });
});
