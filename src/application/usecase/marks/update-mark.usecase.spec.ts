import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMarksUseCase } from './update-mark.usecase';
import { UpdateMarksRequestDTO } from 'src/adapters/input/controllers/marks/dtos/UpdateMarksRequestDTO';
import { CategoryEnum } from 'src/domain/enum/CategoryEnum';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { MarksAccessDataPort } from 'src/application/port/output/marks-access-data.port';

describe('UpdateMarkUseCase', () => {
  let updateMarksUseCase: UpdateMarksUseCase;

  const mockMarksAccessDataPort = {
    findAllByUser: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMarksUseCase,
        {
          provide: MarksAccessDataPort,
          useValue: mockMarksAccessDataPort,
        },
      ],
    }).compile();

    updateMarksUseCase = module.get<UpdateMarksUseCase>(UpdateMarksUseCase);
  });
  it('should be defined', () => {
    expect(UpdateMarksUseCase).toBeDefined();
  });

  it('should throw error if percentage total is greater than 100', async () => {
    const marks: UpdateMarksRequestDTO[] = [
      {
        id: '123',
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage: 100,
      },
      {
        id: '1234',
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage: 1,
      },
    ];
    try {
      await updateMarksUseCase.execute(marks, '123');
      expect(true).toBe(false);
    } catch (error: BadRequestException | any) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Porcentagem total excedida');
      expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('should throw error if percentage is less than 0', async () => {
    const marks: UpdateMarksRequestDTO[] = [
      {
        id: '123',
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage: -1,
      },
      {
        id: '1234',
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage: 50,
      },
    ];
    try {
      await updateMarksUseCase.execute(marks, '123');
      expect(true).toBe(false);
    } catch (error: BadRequestException | any) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Porcentagem invalida');
      expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('should throw error if percentage is greater than 100', async () => {
    const marks: UpdateMarksRequestDTO[] = [
      {
        id: '123',
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage: 101,
      },
      {
        id: '1234',
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage: 0,
      },
    ];
    try {
      await updateMarksUseCase.execute(marks, '123');
      expect(true).toBe(false);
    } catch (error: BadRequestException | any) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Porcentagem total excedida');
      expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('should save marks', async () => {
    const idUser = '123';
    const marks: UpdateMarksRequestDTO[] = [
      {
        id: '123',
        category: CategoryEnum.ACOES_NACIONAIS,
        percentage: 50,
      },
      {
        id: '1234',
        category: CategoryEnum.ACOES_INTERNACIONAIS,
        percentage: 50,
      },
    ];

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

    await updateMarksUseCase.execute(marks, idUser);
    expect(mockMarksAccessDataPort.update).toHaveBeenCalledWith(marksSave);
  });
});
