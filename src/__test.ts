import { IsString } from 'class-validator';
import { Id } from './common/entity';
import { Entity } from './core/entity';
import { ObjectProps, PlainProps } from './core/object-props';
import { ValueObject } from './core/value-object';

class BarVOProps extends ObjectProps<BarVOProps> {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  createdAt!: Date;
}

class BarVO extends ValueObject<BarVOProps> {
  constructor(props: PlainProps<BarVOProps>) {
    super(new BarVOProps(props));
  }

  public getFull(): string {
    return this.props.description + this.props.name;
  }
}

class FooEntityProps extends ObjectProps<FooEntityProps> {
  bar!: BarVO;
}

class FooEntity extends Entity<FooEntityProps> {
  constructor(props: PlainProps<FooEntityProps>, id?: Id) {
    super(new FooEntityProps(props), id);
  }
}

const c = new FooEntity(new FooEntityProps({
  bar: new BarVO({
    name: '나나나',
    description: 'foo',
    createdAt: new Date(),
  }),
}), '123');
const d = new FooEntity({
  bar: new BarVO({
    name: '나나나',
    description: 'foo',
    createdAt: new Date(),
  }),
}, '321');

c.equals(d);
