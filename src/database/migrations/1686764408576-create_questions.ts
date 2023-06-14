import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateQuestions1686764408576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'question',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'criterion',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'enum',
            enum: ['AN', 'AI', 'FI', 'RT'],
            isNullable: false,
          },
          {
            name: 'idUser',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['idUser'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'user_questions',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('questions');
  }
}
