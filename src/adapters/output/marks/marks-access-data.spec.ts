import { Test, TestingModule } from '@nestjs/testing';
import { MarksAccessDataAdapter } from './marks-access-data.adapter';
import { CategoryEnum } from 'src/domain/enum/CategoryEnum';
import Mark from 'src/domain/model/mark';
import { MarkEntity } from './marks.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const marks: Mark[] = [
  {
    id: 'id_mark_crypto',
    category: CategoryEnum.CRIPTO_MOEDA,
    percentage: 10,
    idUser: 'id_user',
  },
  {
    id: 'id_mark_renda_fixa',
    category: CategoryEnum.RENDA_FIXA,
    percentage: 20,
    idUser: 'id_user',
  },
  {
    id: 'id_mark_fundos_imobiliarios',
    category: CategoryEnum.FUNDOS_IMOBILIARIOS,
    percentage: 30,
    idUser: 'id_user',
  },
];

const marksEntity = [
  {
    id: 'id_mark_crypto',
    category: CategoryEnum.CRIPTO_MOEDA,
    percentage: 10,
  },
  {
    id: 'id_mark_renda_fixa',
    category: CategoryEnum.RENDA_FIXA,
    percentage: 20,
  },
  {
    id: 'id_mark_fundos_imobiliarios',
    category: CategoryEnum.FUNDOS_IMOBILIARIOS,
    percentage: 30,
  },
];

const queryBuilderMock = {
  where: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  addGroupBy: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockReturnValue([]),
};

describe('MarksAccessDataAdapter', () => {
  let marksAccessDataAdapter: MarksAccessDataAdapter;
  let mockMarksRepository: Repository<MarkEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarksAccessDataAdapter,
        {
          provide: getRepositoryToken(MarkEntity),
          useFactory: () => ({
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
            save: jest.fn().mockResolvedValue({}),
          }),
        },
      ],
    }).compile();

    marksAccessDataAdapter = module.get<MarksAccessDataAdapter>(
      MarksAccessDataAdapter,
    );

    mockMarksRepository = module.get<Repository<MarkEntity>>(
      getRepositoryToken(MarkEntity),
    );
  });

  it('should be defined', () => {
    expect(marksAccessDataAdapter).toBeDefined();
  });

  it('should be findAllByUser return []', async () => {
    mockMarksRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(queryBuilderMock);
    const result = await marksAccessDataAdapter.findAllByUser('id_user');
    expect(result).toEqual([]);
  });

  it('should be findAllByUser return marks', async () => {
    mockMarksRepository.createQueryBuilder = jest.fn().mockReturnValue({
      ...queryBuilderMock,
      getRawMany: jest.fn().mockReturnValue(marksEntity),
    });
    const result = await marksAccessDataAdapter.findAllByUser('id_user');
    expect(result).toEqual(marks);
  });

  it('should updated marks', async () => {
    const idUser = '123';

    const marksSave = [
      {
        id: '123',
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage: 50,
        idUser,
      },
      {
        id: '1234',
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage: 50,
        idUser,
      },
    ];

    await marksAccessDataAdapter.update(marksSave);
    expect(mockMarksRepository.save).toHaveBeenCalledWith(marksSave);
  });
});
