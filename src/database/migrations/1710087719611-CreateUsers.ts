import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1710087719611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'public.users',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true,
          isNullable: false,
          isGenerated: true,
          generationStrategy: 'increment',
          isUnique: true,
        },
        {
          name: 'username',
          type: 'varchar',
          length: '500',
          isPrimary: false,
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'password',
          type: 'varchar',
          length: '500',
          isPrimary: false,
          isNullable: false,
        },
        {
          name: 'is_active',
          type: 'boolean',
          isPrimary: false,
          isNullable: false,
          default: true,
        },
        {
          name: 'email',
          type: 'varchar',
          length: '500',
          isPrimary: false,
          isNullable: true,
        },
        {
          name: 'last_auth',
          type: 'timestamp',
          isPrimary: false,
          isNullable: true,
          default: null,
        },
        {
          name: 'created_on',
          type: 'timestamp',
          isPrimary: false,
          isNullable: false,
          default: 'current_timestamp',
        },
        {
          name: 'modified_on',
          type: 'timestamp',
          isPrimary: false,
          isNullable: false,
          default: 'current_timestamp',
        },
        {
          name: 'created_by',
          type: 'integer',
          isPrimary: false,
          isNullable: false,
        },
        {
          name: 'modified_by',
          type: 'integer',
          isPrimary: false,
          isNullable: false,
        },
      ],
    });

    await queryRunner.createTable(table);
    await this.createRootAccount(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('public.users');
  }

  private async createRootAccount(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      "INSERT INTO public.users(id, username, password, is_active, email, created_by, modified_by) VALUES(1, 'admin', '$2b$10$8e67o7aUzyIQSQpnSKu7BukgKSlcetom7AcIxHHPtVkL4SEcJ2Qay', true, '', 1, 1)",
    );
  }
}
