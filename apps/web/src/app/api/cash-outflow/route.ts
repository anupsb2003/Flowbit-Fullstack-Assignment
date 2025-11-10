// File: apps/web/src/app/api/cash-outflow/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // We only want to forecast future or currently due/overdue amounts.
    const today = new Date();
    
    // Aggregate all invoice totals grouped by their due date
    const rawResults = await prisma.invoice.groupBy({
      by: ['due_date'],
      _sum: {
        total_amount: true,
      },
      where: {
        status: { not: 'PAID' }, // Only consider invoices that haven't been paid
      },
      orderBy: {
        due_date: 'asc',
      },
    });

    // Map results to a standard format for the chart
    const cashOutflow = rawResults.map(r => ({
      dueDate: r.due_date.toISOString().split('T')[0],
      expectedOutflow: parseFloat((r._sum.total_amount || 0).toFixed(2)),
    }));

    return NextResponse.json(cashOutflow);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch cash outflow forecast' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}