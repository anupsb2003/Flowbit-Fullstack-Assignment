// File: apps/web/src/app/api/stats/route.ts (Paste this full content)

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Helper to calculate start of the current year (YTD)
const startOfYear = new Date(new Date().getFullYear(), 0, 1);

export async function GET() {
  try {
    // 1. Total Spend (YTD)
    const totalSpendResult = await prisma.invoice.aggregate({
      _sum: { total_amount: true },
      where: {
        issue_date: {
          gte: startOfYear,
        },
        status: { not: 'DRAFT' },
      },
    });
    const totalSpendYTD = totalSpendResult._sum.total_amount || 0;

    // 2. Total Invoices Processed
    const totalInvoicesProcessed = await prisma.invoice.count({
      where: { status: { not: 'DRAFT' } },
    });

    // 3. Documents Uploaded
    const documentsUploaded = await prisma.invoice.count({
      where: { document_url: { not: null } },
    });

    // 4. Average Invoice Value
    const averageInvoiceResult = await prisma.invoice.aggregate({
      _avg: { total_amount: true },
      where: { status: { not: 'DRAFT' } },
    });
    const averageInvoiceValue = averageInvoiceResult._avg.total_amount || 0;


    const stats = {
      totalSpendYTD: parseFloat(totalSpendYTD.toFixed(2)),
      totalInvoicesProcessed,
      documentsUploaded,
      averageInvoiceValue: parseFloat(averageInvoiceValue.toFixed(2)),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}