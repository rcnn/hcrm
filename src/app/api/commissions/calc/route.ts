import { NextRequest, NextResponse } from 'next/server';
import {
  CommissionCalculation,
} from '@/lib/types/referral';

// 获取业绩计算
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const referralId = searchParams.get('referralId');

    if (!referralId) {
      return NextResponse.json(
        {
          success: false,
          message: '缺少转诊ID参数',
        },
        { status: 400 }
      );
    }

    // TODO: 从数据库查询转诊信息
    // const referral = await getReferralById(referralId);

    // 模拟计算
    const dealAmount = 28000; // 从转诊记录中获取
    const commissionRate = 0.05; // 5% 的业绩比例

    const calculation: CommissionCalculation = {
      referralId,
      dealAmount,
      commissionRate,
      commission: {
        referrer: dealAmount * commissionRate * 0.5,
        receiver: dealAmount * commissionRate * 0.5,
        total: dealAmount * commissionRate,
      },
      calculationDetails: {
        baseAmount: dealAmount,
        rate: commissionRate,
        multipliers: 1.0,
      },
    };

    return NextResponse.json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    console.error('Error calculating commission:', error);
    return NextResponse.json(
      {
        success: false,
        message: '计算业绩失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
