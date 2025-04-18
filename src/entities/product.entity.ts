import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CartItem } from './cartItem.entity';

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

  @OneToMany(() => CartItem, (cartItem) => cartItem.product_id, {
    cascade: true,
  })
  carts: CartItem[];
}
