import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Demo Company',
      legalName: 'Demo Company Ltd.',
      taxId: '123456789',
      address: '123 Main St, Tel Aviv',
      phone: '+972-3-1234567',
    },
  });

  console.log('Created company:', company.id);

  // Create category
  const category = await prisma.category.create({
    data: {
      companyId: company.id,
      name: 'עגבניות',
      nameEn: 'Tomatoes',
      hsCodeDefault: '0702.00.00',
      description: 'Fresh tomatoes',
    },
  });

  console.log('Created category:', category.id);

  // Create product
  const product = await prisma.product.create({
    data: {
      categoryId: category.id,
      name: 'עגבניות שרי',
      nameEn: 'Cherry Tomatoes',
      variety: 'Cherry',
      packagingType: '12kg carton',
      coldTreatmentRequired: true,
      storageConditions: '2-4°C',
    },
  });

  console.log('Created product:', product.id);

  // Create suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      companyId: company.id,
      name: 'Supplier One',
      email: 'supplier1@example.com',
      phone: '+972-50-1234567',
      country: 'Spain',
      defaultIncoterm: 'FOB',
      reeferCapable: true,
      bankAccountMasked: '****1234',
      bankName: 'Bank of Spain',
      categories: {
        connect: { id: category.id },
      },
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      companyId: company.id,
      name: 'Supplier Two',
      email: 'supplier2@example.com',
      phone: '+972-50-7654321',
      country: 'Netherlands',
      defaultIncoterm: 'CIF',
      reeferCapable: false,
      bankAccountMasked: '****5678',
      categories: {
        connect: { id: category.id },
      },
    },
  });

  console.log('Created suppliers:', supplier1.id, supplier2.id);

  // Create users
  const ownerPassword = await bcrypt.hash('password123', 10);
  const owner = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      name: 'Owner User',
      passwordHash: ownerPassword,
      role: 'OWNER',
      companyId: company.id,
    },
  });

  const staffPassword = await bcrypt.hash('password123', 10);
  const staff = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      name: 'Staff User',
      passwordHash: staffPassword,
      role: 'STAFF',
      companyId: company.id,
    },
  });

  const supplierPassword = await bcrypt.hash('password123', 10);
  const supplierUser = await prisma.user.create({
    data: {
      email: 'supplier1@example.com',
      name: 'Supplier User',
      passwordHash: supplierPassword,
      role: 'SUPPLIER',
      companyId: company.id,
      supplierId: supplier1.id,
    },
  });

  console.log('Created users');

  // Create RFQ
  const rfq = await prisma.rFQ.create({
    data: {
      companyId: company.id,
      rfqNumber: 'RFQ-001',
      title: 'RFQ for Cherry Tomatoes',
      originPort: 'Valencia',
      destPort: 'Haifa',
      incoterm: 'FOB',
      lines: {
        create: {
          productId: product.id,
          quantity: 1000,
          unit: 'kg',
        },
      },
    },
    include: {
      lines: true,
    },
  });

  console.log('Created RFQ:', rfq.id);
  const rfqLine = rfq.lines[0];
  if (!rfqLine) {
    throw new Error('RFQ line not created');
  }

  // Create Quote
  const quote = await prisma.quote.create({
    data: {
      companyId: company.id,
      rfqId: rfq.id,
      supplierId: supplier1.id,
      quoteNumber: 'QUOTE-001',
      incoterm: 'FOB',
      leadTimeDays: 14,
      status: 'PENDING',
      lines: {
        create: {
          rfqLineId: rfqLine.id,
          productId: product.id,
          unitPrice: 2.5,
          currency: 'USD',
          quantity: 1000,
          total: 2500,
        },
      },
    },
  });

  console.log('Created Quote:', quote.id);

  // Create PO
  const po = await prisma.purchaseOrder.create({
    data: {
      companyId: company.id,
      quoteId: quote.id,
      supplierId: supplier1.id,
      poNumber: 'PO-001',
      incoterm: 'FOB',
      originPort: 'Valencia',
      destPort: 'Haifa',
      lines: {
        create: {
          productId: product.id,
          quantity: 1000,
          unit: 'kg',
          unitPrice: 2.5,
          currency: 'USD',
          total: 2500,
        },
      },
    },
  });

  console.log('Created PO:', po.id);

  // Create Invoice
  const invoice = await prisma.invoice.create({
    data: {
      companyId: company.id,
      poId: po.id,
      supplierId: supplier1.id,
      number: 'INV-001',
      date: new Date(),
      total: 2500,
      currency: 'USD',
      status: 'PENDING',
    },
  });

  console.log('Created Invoice:', invoice.id);

  // Create Shipment
  const shipment = await prisma.shipment.create({
    data: {
      companyId: company.id,
      supplierId: supplier1.id,
      shipmentNumber: 'SHIP-001',
      incoterm: 'FOB',
      originPort: 'Valencia',
      destPort: 'Haifa',
      carrier: 'Maersk',
      trackingUrl: 'https://example.com/track/123',
      reeferSetpointC: 2,
      rhPercent: 85,
      tempRangeMin: 0,
      tempRangeMax: 4,
      etd: new Date('2024-02-01'),
      eta: new Date('2024-02-15'),
      status: 'BOOKED',
      containers: {
        create: {
          containerNo: 'ABCD1234567',
          sealNo: 'SEAL001',
          type: 'REEFER',
          grossWeight: 12000,
          isReefer: true,
        },
      },
    },
  });

  console.log('Created Shipment:', shipment.id);

  // Create TariffRate
  const tariffRate = await prisma.tariffRate.create({
    data: {
      hsCode: '0702.00.00',
      country: 'IL',
      dutyPercent: 8,
      vatPercent: 17,
      lastSyncedAt: new Date(),
    },
  });

  console.log('Created TariffRate:', tariffRate.id);

  // Create LandedCostCalc
  const landedCost = await prisma.landedCostCalc.create({
    data: {
      inputs: {
        basePrice: 2.5,
        quantity: 1000,
        freight: 500,
        insurance: 50,
        portFee: 100,
        clearanceFee: 200,
        truckingFee: 150,
        reeferSurcharge: 100,
        fxRate: 3.65,
        hsCode: '0702.00.00',
        country: 'IL',
        insuranceRatePercent: 1,
        perishabilityRiskFactor: 0.05,
      },
      outputs: {
        baseCostLocal: 9125,
        freightLocal: 1825,
        insuranceLocal: 91.25,
        dutyAmount: 730,
        vatAmount: 1669.8,
        portFeeLocal: 365,
        clearanceFeeLocal: 730,
        truckingFeeLocal: 547.5,
        reeferSurchargeLocal: 365,
        perishabilityAdjustment: 456.25,
        totalLandedCost: 15914.8,
        perUnitLandedCost: 15.91,
      },
      fxRate: 3.65,
      insuranceRatePercent: 1,
      perishabilityRiskFactor: 0.05,
    },
  });

  console.log('Created LandedCostCalc:', landedCost.id);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

