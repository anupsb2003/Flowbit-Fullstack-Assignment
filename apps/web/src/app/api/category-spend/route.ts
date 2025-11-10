// File: apps/web/src/app/api/category-spend/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Aggregate and group invoices by category, summing the total_amount
    const spendByCategoryRaw = await prisma.invoice.groupBy({
      by: ['category'],
      _sum: {
        total_amount: true,
      },
      where: {
        status: { not: 'DRAFT' },
      },
      orderBy: {
        _sum: {
          total_amount: 'desc', // Order by highest spend
        },
      },
    });

    // Map the results to a clean array
    const spendByCategory = spendByCategoryRaw.map(r => ({
      category: r.category,
      totalSpend: parseFloat((r._sum.total_amount || 0).toFixed(2)),
    }));

    return NextResponse.json(spendByCategory);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch category spend' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}