import { NextRequest, NextResponse } from 'next/server';
import { ReferralAnalytics } from '@/lib/types/referral';

export const dynamic = 'force-dynamic';

// 获取转诊分析数据
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const department = searchParams.get('department');

    // 模拟分析数据
    const analytics: ReferralAnalytics = {
      summary: {
        totalReferrals: 156,
        conversionRate: 68.5,
        averageDealAmount: 24500,
      },
      trends: Array.from({ length: 12 }, (_, i) => ({
        date: `2024-${String(i + 1).padStart(2, '0')}`,
        referrals: Math.floor(Math.random() * 20) + 10,
        conversions: Math.floor(Math.random() * 15) + 5,
      })),
      topPerformers: [
        {
          userId: '1',
          userName: '张医生',
          referrals: 28,
          conversions: 18,
        },
        {
          userId: '2',
          userName: '李护士',
          referrals: 24,
          conversions: 16,
        },
        {
          userId: '3',
          userName: '王验光师',
          referrals: 22,
          conversions: 14,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching referral analytics:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取转诊分析失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
