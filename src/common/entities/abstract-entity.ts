import { IsDate, IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('increment')
  @Index({ unique: true })
  @IsNumber()
  public id: number;

  @IsEmpty()
  @IsDate()
  @Column('timestamp without time zone', {
    name: 'created_on',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdOn: Date;

  @IsEmpty()
  @IsDate()
  @Column('timestamp without time zone', {
    name: 'modified_on',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public modifiedOn: Date;

  @IsNotEmpty()
  @IsNumber()
  @Column('integer', {
    name: 'created_by',
    select: false,
  })
  public createdBy: number;

  @IsNotEmpty()
  @IsNumber()
  @Column('integer', {
    name: 'modified_by',
    select: false,
  })
  public modifiedBy: number;
}
