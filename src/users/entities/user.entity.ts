import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsDate,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract-entity';

@Entity({
  schema: 'public',
  name: 'users',
})
export class User extends AbstractEntity {
  @MaxLength(500)
  @IsNotEmpty()
  @Column('character varying', {
    name: 'username',
    length: 500,
  })
  public username: string;

  @MaxLength(500)
  @IsNotEmpty()
  @Column('character varying', {
    name: 'password',
    length: 500,
  })
  @Exclude()
  public password: string;

  @IsOptional()
  @IsBoolean()
  @Column('boolean', {
    name: 'is_active',
    default: true,
  })
  public isActive: boolean;

  @MaxLength(500)
  @IsNotEmpty()
  @Column('character varying', {
    name: 'email',
    length: 500,
  })
  public email: string;

  @IsDate()
  @Column('timestamp without time zone', {
    name: 'last_auth',
    default: () => null,
  })
  public lastAuth: Date;
}
