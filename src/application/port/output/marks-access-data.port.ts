import Mark from 'src/domain/model/mark';

export abstract class MarksAccessDataPort {
  abstract findAllByUser(idUser: string): Promise<Mark[]>;
}
