import { NextRequest, NextResponse } from 'next/server';
import {
  Referral,
  MarkConversionRequest,
  Commission,
} from '@/lib/types/referral';

// 模拟转诊数据存储
const mockReferrals: Referral[] = [];

// 标记成交
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: MarkConversionRequest = await request.json();

    const referralIndex = mockReferrals.findIndex((r) => r.id === params.id);

    if (referralIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: '转诊记录不存在',
        },
        { status: 404 }
      );
    }

    // 更新成交信息
    mockReferrals[referralIndex].conversion = {
      dealAmount: body.dealAmount,
      dealDate: body.dealDate,
      dealOwner: body.dealOwner,
      products: body.products,
      discounts: body.discounts,
      notes: body.notes,
    };
    mockReferrals[referralIndex].status = 'converted';
    mockReferrals[referralIndex].updatedAt = new Date();

    // 计算业绩（简单算法：成交金额的 5% 作为总业绩）
    const totalCommission = body.dealAmount * 0.05;
    const commission: Commission = {
      referrerCommission: totalCommission * 0.5, // 50% 给转诊发起人
      receiverCommission: totalCommission * 0.5, // 50% 给成交人
      total: totalCommission,
    };

    return NextResponse.json({
      success: true,
      data: {
        id: params.id,
        conversion: mockReferrals[referralIndex].conversion,
        commission,
      },
    });
  } catch (error) {
    console.error('Error marking conversion:', error);
    return NextResponse.json(
      {
        success: false,
        message: '标记成交失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
