// File: apps/api/prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient()

// IMPORTANT: Path to your JSON file relative to the script's location (apps/api/prisma)
// We need to go up two levels (../../) to reach the root, then into the data folder.
const DATA_PATH = path.resolve(process.cwd(), '../../data/Analytics_Test_Data.json');

async function main() {
  console.log('Start seeding...')
  
  const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
  const invoicesData = JSON.parse(rawData);

  // --- Clean existing data (safe to run multiple times) ---
  await prisma.payment.deleteMany({});
  await prisma.lineItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.customer.deleteMany({});
  // --------------------------------------------------------

  for (const invoice of invoicesData) {
    
    // 1. Handle Vendor (Create if new, connect if existing)
    const vendor = await prisma.vendor.upsert({
      where: { vendor_id: invoice.vendor.id },
      update: {},
      create: {
        vendor_id: invoice.vendor.id,
        name: invoice.vendor.name,
        email: invoice.vendor.email,
        address: invoice.vendor.address,
      },
    });

    // 2. Handle Customer (Create if new, connect if existing)
    const customer = await prisma.customer.upsert({
      where: { customer_id: invoice.customer.id },
      update: {},
      create: {
        customer_id: invoice.customer.id,
        name: invoice.customer.name,
        email: invoice.customer.email,
      },
    });
    
    // 3. Create the core Invoice record
    const createdInvoice = await prisma.invoice.create({
      data: {
        invoice_number: invoice.invoice_number,
        status: invoice.status,
        issue_date: new Date(invoice.issue_date),
        due_date: new Date(invoice.due_date),
        total_amount: parseFloat(String(invoice.total_amount)), 
        category: invoice.category,
        document_url: invoice.document_url,
        
        // Connect Foreign Keys
        vendor_id: vendor.id,
        customer_id: customer.id,
        
        // 4. Create Nested Line Items
        lineItems: {
          createMany: {
            data: invoice.line_items.map((item: any) => ({
              description: item.description,
              quantity: item.quantity,
              unit_price: parseFloat(String(item.unit_price)),
              total: parseFloat(String(item.total)),
            })),
          },
        },
        
        // 5. Create Nested Payment Record (if payment data exists)
        payments: invoice.payment ? {
          create: {
            payment_date: invoice.payment.date ? new Date(invoice.payment.date) : null,
            amount_paid: parseFloat(String(invoice.payment.amount || '0')),
            payment_method: invoice.payment.method || null,
          }
        } : undefined, // Skip if payment object is null
      },
    });
    console.log(`Created invoice: ${createdInvoice.invoice_number}`);
  }
  
  console.log('Seeding finished successfully.')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })