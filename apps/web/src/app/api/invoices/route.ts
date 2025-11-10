// File: apps/web/src/app/api/invoices/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const statusFilter = searchParams.get('status'); // e.g., ?status=OVERDUE
    const searchFilter = searchParams.get('search'); // e.g., ?search=INV-2024
    
    // Base WHERE clause
    let where: any = {};
    
    if (statusFilter && statusFilter !== 'ALL') {
      where.status = statusFilter.toUpperCase();
    }

    if (searchFilter) {
      // Search by Invoice Number OR Vendor Name
      where.OR = [
        {
          invoice_number: {
            contains: searchFilter,
            mode: 'insensitive', // Case-insensitive search
          },
        },
        {
          vendor: {
            name: {
              contains: searchFilter,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      // Include the Vendor name as required by the dashboard table
      include: {
        vendor: {
          select: { name: true },
        },
      },
      orderBy: {
        issue_date: 'desc', // Default sort by date
      },
      // You can implement pagination (take/skip) here if needed later
    });

    // Format the output
    const formattedInvoices = invoices.map(invoice => ({
      vendorName: invoice.vendor.name,
      date: invoice.issue_date.toISOString().split('T')[0],
      invoiceNumber: invoice.invoice_number,
      amount: parseFloat(invoice.total_amount.toFixed(2)),
      status: invoice.status,
    }));

    return NextResponse.json(formattedInvoices);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}