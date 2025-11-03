import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MockModule } from './mock/mock.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { RfqModule } from './rfq/rfq.module';
import { QuotesModule } from './quotes/quotes.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { DocumentsModule } from './documents/documents.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ContainersModule } from './containers/containers.module';
import { TariffModule } from './tariff/tariff.module';
import { FeesModule } from './fees/fees.module';
import { LandedCostModule } from './landed-cost/landed-cost.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    AuthModule,
    MockModule,
    UsersModule,
    CompaniesModule,
    SuppliersModule,
    CategoriesModule,
    ProductsModule,
    RfqModule,
    QuotesModule,
    PurchaseOrdersModule,
    InvoicesModule,
    PaymentsModule,
    DocumentsModule,
    ShipmentsModule,
    ContainersModule,
    TariffModule,
    FeesModule,
    LandedCostModule,
    MessagesModule,
    NotificationsModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

