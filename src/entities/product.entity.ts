import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CartItemEntity } from './cart-item.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'integer' })
  price: number;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product, {
    cascade: true,
  })
  carts: CartItemEntity[];
}
