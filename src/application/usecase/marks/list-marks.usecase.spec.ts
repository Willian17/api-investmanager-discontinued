import { Test, TestingModule } from '@nestjs/testing';
import { ListMarksUseCase } from './list-marks.usecase';
import { CategoryEnum } from '../../../domain/enum/CategoryEnum';
import { MarksAccessDataPort } from 'src/application/port/output/marks-access-data.port';
import Mark from 'src/domain/model/mark';

const mockMarks: Mark[] = [
  {
    id: '123',
    idUser: '123',
    category: CategoryEnum.ACOES_INTERNACIONAIS,
    percentage: 50,
  },
  {
    id: 'asdasd8',
    idUser: '123',
    category: CategoryEnum.ACOES_NACIONAIS,
    percentage: 50,
  },
];

describe('ListMarksUseCase', () => {
  let listMarksUseCase: ListMarksUseCase;
  const IDUSER = '123';

  const mockMarksAccessDataPort = {
    findAllByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListMarksUseCase,
        {
          provide: MarksAccessDataPort,
          useValue: mockMarksAccessDataPort,
        },
      ],
    }).compile();

    listMarksUseCase = module.get<ListMarksUseCase>(ListMarksUseCase);
  });

  it('should be defined', () => {
    expect(listMarksUseCase).toBeDefined();
  });

  it('should return marks empty elements', async () => {
    mockMarksAccessDataPort.findAllByUser.mockResolvedValue([]);
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
    mockMarksAccessDataPort.findAllByUser.mockResolvedValue(mockMarks);
    const result = await listMarksUseCase.execute(IDUSER);
    expect(result).toEqual([
      {
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage: 50,
        id: 'asdasd8',
      },
      {
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage: 50,
        id: '123',
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
