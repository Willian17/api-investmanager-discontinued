import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAnswers1687526053021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'answers',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'response',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'idActive',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'idQuestion',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['idActive'],
        referencedColumnNames: ['id'],
        referencedTableName: 'actives',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'active_answers',
      }),
    );

    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['idQuestion'],
        referencedColumnNames: ['id'],
        referencedTableName: 'questions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'question_answers',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('answers');
  }
}
