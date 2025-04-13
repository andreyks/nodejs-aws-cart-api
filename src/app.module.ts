import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItem as CartItemEntity} from './entities/cartItem.entity';
import { Cart as CartEntity} from './entities/cart.entity';
import { Order as OrderEntity } from './entities/order.entity';
import { User as UserEntity } from './entities/user.entity';

import { config } from 'dotenv';

// Load environment variables from .env file
config();

// console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_NAME);

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: [CartItemEntity, CartEntity, OrderEntity, UserEntity,],
      synchronize: true,
      // ssl: false,
    }),
    ConfigModule.forRoot()
  ],
  controllers: [
    AppController
  ],
  providers: [],
})
export class AppModule {}
