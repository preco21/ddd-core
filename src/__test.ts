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

const a = new BarVO({
  name: 'foo',
  description: 'foo',
  createdAt: new Date(),
});
const b = new BarVO({
  name: 'foo',
  description: 'foo',
  createdAt: new Date(),
});

a.equals(b); // structural equality
a.getRaw();
a.toJSON();
console.log(a.getFull());

const c = new FooEntity(new FooEntityProps({
  bar: a,
}), '123');
const d = new FooEntity({
  bar: b,
}, '321');

c.equals(d); // referential equality
c.toJSON();
c.isTransient();
console.log(c.id, c.key, c.createdAt);
