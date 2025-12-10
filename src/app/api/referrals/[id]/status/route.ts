import { NextRequest, NextResponse } from 'next/server';
import {
  Referral,
  UpdateReferralStatusRequest,
} from '@/lib/types/referral';

// 模拟转诊数据存储
const mockReferrals: Referral[] = [];

// 更新转诊状态
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateReferralStatusRequest = await request.json();

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

    // 更新状态
    mockReferrals[referralIndex].status = body.status;
    if (body.notes) {
      mockReferrals[referralIndex].notes = body.notes;
    }
    mockReferrals[referralIndex].updatedAt = new Date();

    return NextResponse.json({
      success: true,
      data: {
        id: params.id,
        status: body.status,
        updatedAt: mockReferrals[referralIndex].updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating referral status:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新转诊状态失败',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
