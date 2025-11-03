import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { Public } from './decorators/roles.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('mock')
@Controller('mock')
export class MockController {
  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get mock categories' })
  getCategories() {
    return [
      {
        id: 'cat-1',
        name: 'עגבניות',
        nameEn: 'Tomatoes',
        hsCodeDefault: '0702.00.00',
        description: 'עגבניות טריות',
        _count: { products: 5, suppliers: 2 },
      },
      {
        id: 'cat-2',
        name: 'פלפלים',
        nameEn: 'Peppers',
        hsCodeDefault: '0709.60.00',
        description: 'פלפלים טריים',
        _count: { products: 3, suppliers: 1 },
      },
    ];
  }

  @Public()
  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return {
      id,
      name: 'עגבניות',
      nameEn: 'Tomatoes',
      hsCodeDefault: '0702.00.00',
      products: [
        { id: 'prod-1', name: 'עגבניות שרי', nameEn: 'Cherry Tomatoes', variety: 'Cherry' },
        { id: 'prod-2', name: 'עגבניות רגילות', nameEn: 'Regular Tomatoes', variety: 'Standard' },
      ],
      suppliers: [
        { id: 'sup-1', name: 'Supplier One', email: 'supplier1@example.com', country: 'Spain' },
        { id: 'sup-2', name: 'Supplier Two', email: 'supplier2@example.com', country: 'Netherlands' },
      ],
    };
  }

  @Public()
  @Get('rfq')
  getRFQs() {
    return [
      {
        id: 'rfq-1',
        rfqNumber: 'RFQ-001',
        title: 'RFQ for Cherry Tomatoes',
        originPort: 'Valencia',
        destPort: 'Haifa',
        incoterm: 'FOB',
        lines: [
          { id: 'line-1', product: { name: 'עגבניות שרי' }, quantity: 1000, unit: 'kg' },
        ],
        quotes: [
          { id: 'quote-1', quoteNumber: 'QUOTE-001', supplier: { name: 'Supplier One' }, status: 'PENDING' },
        ],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  @Public()
  @Get('rfq/:id')
  getRFQ(@Param('id') id: string) {
    return {
      id,
      rfqNumber: 'RFQ-001',
      title: 'RFQ for Cherry Tomatoes',
      originPort: 'Valencia',
      destPort: 'Haifa',
      incoterm: 'FOB',
      lines: [
        {
          id: 'line-1',
          product: { id: 'prod-1', name: 'עגבניות שרי' },
          quantity: 1000,
          unit: 'kg',
          quoteLines: [
            {
              id: 'ql-1',
              quote: { id: 'quote-1', supplier: { name: 'Supplier One' } },
              unitPrice: 2.5,
              total: 2500,
            },
          ],
        },
      ],
      quotes: [
        {
          id: 'quote-1',
          quoteNumber: 'QUOTE-001',
          supplier: { name: 'Supplier One', email: 'supplier1@example.com' },
          status: 'PENDING',
          lines: [
            {
              id: 'ql-1',
              product: { name: 'עגבניות שרי' },
              quantity: 1000,
              unitPrice: 2.5,
              currency: 'USD',
              total: 2500,
            },
          ],
        },
      ],
    };
  }

  @Public()
  @Get('quotes')
  getQuotes() {
    return [
      {
        id: 'quote-1',
        quoteNumber: 'QUOTE-001',
        supplier: { name: 'Supplier One' },
        rfq: { rfqNumber: 'RFQ-001' },
        status: 'PENDING',
        lines: [
          { id: 'ql-1', product: { name: 'עגבניות שרי' }, quantity: 1000, unitPrice: 2.5, currency: 'USD', total: 2500 },
        ],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  @Public()
  @Get('quotes/:id')
  getQuote(@Param('id') id: string) {
    return {
      id,
      quoteNumber: 'QUOTE-001',
      supplier: { name: 'Supplier One', email: 'supplier1@example.com' },
      rfq: { rfqNumber: 'RFQ-001', lines: [{ id: 'line-1', product: { name: 'עגבניות שרי' } }] },
      status: 'PENDING',
      lines: [
        {
          id: 'ql-1',
          product: { name: 'עגבניות שרי' },
          quantity: 1000,
          unitPrice: 2.5,
          currency: 'USD',
          total: 2500,
        },
      ],
    };
  }

  @Public()
  @Get('po')
  getPOs() {
    return [
      {
        id: 'po-1',
        poNumber: 'PO-001',
        supplier: { name: 'Supplier One' },
        originPort: 'Valencia',
        destPort: 'Haifa',
        lines: [
          { id: 'pol-1', product: { name: 'עגבניות שרי' }, quantity: 1000, unitPrice: 2.5, currency: 'USD', total: 2500 },
        ],
        invoices: [],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  @Public()
  @Get('po/:id')
  getPO(@Param('id') id: string) {
    return {
      id,
      poNumber: 'PO-001',
      supplier: { name: 'Supplier One', email: 'supplier1@example.com' },
      quote: { quoteNumber: 'QUOTE-001' },
      lines: [
        {
          id: 'pol-1',
          product: { name: 'עגבניות שרי' },
          quantity: 1000,
          unitPrice: 2.5,
          currency: 'USD',
          total: 2500,
        },
      ],
      invoices: [],
    };
  }

  @Public()
  @Get('invoices')
  getInvoices() {
    return [
      {
        id: 'inv-1',
        number: 'INV-001',
        supplier: { name: 'Supplier One' },
        po: { poNumber: 'PO-001' },
        total: 2500,
        currency: 'USD',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  @Public()
  @Get('invoices/:id')
  getInvoice(@Param('id') id: string) {
    return {
      id,
      number: 'INV-001',
      supplier: { name: 'Supplier One', email: 'supplier1@example.com' },
      po: { poNumber: 'PO-001', lines: [{ total: 2500 }] },
      total: 2500,
      currency: 'USD',
      status: 'PENDING',
      date: new Date().toISOString(),
      payments: [],
    };
  }

  @Public()
  @Get('shipments')
  getShipments() {
    return [
      {
        id: 'ship-1',
        shipmentNumber: 'SHIP-001',
        supplier: { name: 'Supplier One' },
        originPort: 'Valencia',
        destPort: 'Haifa',
        carrier: 'Maersk',
        status: 'BOOKED',
        containers: [
          { id: 'cont-1', containerNo: 'ABCD1234567', type: 'REEFER', isReefer: true },
        ],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  @Public()
  @Get('shipments/:id')
  getShipment(@Param('id') id: string) {
    return {
      id,
      shipmentNumber: 'SHIP-001',
      supplier: { name: 'Supplier One', email: 'supplier1@example.com' },
      originPort: 'Valencia',
      destPort: 'Haifa',
      carrier: 'Maersk',
      status: 'BOOKED',
      etd: new Date('2024-02-01').toISOString(),
      eta: new Date('2024-02-15').toISOString(),
      reeferSetpointC: 2,
      rhPercent: 85,
      tempRangeMin: 0,
      tempRangeMax: 4,
      containers: [
        {
          id: 'cont-1',
          containerNo: 'ABCD1234567',
          sealNo: 'SEAL001',
          type: 'REEFER',
          grossWeight: 12000,
          isReefer: true,
        },
      ],
    };
  }

  @Public()
  @Get('suppliers')
  getSuppliers(@Query('categoryId') categoryId?: string) {
    return [
      {
        id: 'sup-1',
        name: 'Supplier One',
        email: 'supplier1@example.com',
        country: 'Spain',
        reeferCapable: true,
        defaultIncoterm: 'FOB',
      },
      {
        id: 'sup-2',
        name: 'Supplier Two',
        email: 'supplier2@example.com',
        country: 'Netherlands',
        reeferCapable: false,
        defaultIncoterm: 'CIF',
      },
    ];
  }
}

