import {
  Referral,
  Commission,
  CommissionCalculation,
  DepartmentType,
  UserRole,
} from '@/lib/types/referral';

/**
 * 业绩计算引擎
 */
export class CommissionCalculator {
  // 基础业绩比例
  private readonly BASE_COMMISSION_RATE = 0.05; // 5%

  // 各科室业绩比例配置
  private readonly DEPARTMENT_RATES: Record<DepartmentType, number> = {
    orthokeratology: 0.05, // 角塑科 5%
    refractive: 0.06, // 屈光科 6%（稍高，因为客单价更高）
  };

  // 角色分配比例
  private readonly ROLE_SPLITS: Record<string, { referrer: number; receiver: number }> = {
    // 标准分配：发起人50%，成交人50%
    default: {
      referrer: 0.5,
      receiver: 0.5,
    },
    // 如果成交人是主管或资深员工，可以调整比例
    senior: {
      referrer: 0.4,
      receiver: 0.6,
    },
  };

  // 业绩倍数（根据成交金额调整）
  private readonly AMOUNT_MULTIPLIERS = {
    // 客单价分级
    tiers: [
      { min: 0, max: 10000, multiplier: 1.0 }, // 1万以下
      { min: 10000, max: 30000, multiplier: 1.1 }, // 1-3万 10%加成
      { min: 30000, max: 50000, multiplier: 1.2 }, // 3-5万 20%加成
      { min: 50000, max: Infinity, multiplier: 1.3 }, // 5万以上 30%加成
    ],
  };

  /**
   * 计算转诊业绩
   */
  calculate(referral: Referral): Commission {
    if (!referral.conversion) {
      throw new Error('转诊尚未成交，无法计算业绩');
    }

    const dealAmount = referral.conversion.dealAmount;
    const department = referral.targetDepartment;

    // 获取基础业绩比例
    const baseRate = this.DEPARTMENT_RATES[department] || this.BASE_COMMISSION_RATE;

    // 计算基础业绩
    const baseCommission = dealAmount * baseRate;

    // 计算倍数加成
    const multiplier = this.getAmountMultiplier(dealAmount);

    // 总业绩
    const totalCommission = baseCommission * multiplier;

    // 计算分配比例
    const split = this.getCommissionSplit(referral);

    // 分配业绩
    const commission: Commission = {
      referrerCommission: totalCommission * split.referrer,
      receiverCommission: totalCommission * split.receiver,
      total: totalCommission,
    };

    return commission;
  }

  /**
   * 计算业绩分配详情
   */
  calculateDetailed(referral: Referral): CommissionCalculation {
    if (!referral.conversion) {
      throw new Error('转诊尚未成交，无法计算业绩');
    }

    const dealAmount = referral.conversion.dealAmount;
    const department = referral.targetDepartment;

    // 基础配置
    const baseRate = this.DEPARTMENT_RATES[department] || this.BASE_COMMISSION_RATE;
    const multiplier = this.getAmountMultiplier(dealAmount);

    // 计算详情
    const calculation: CommissionCalculation = {
      referralId: referral.id,
      dealAmount,
      commissionRate: baseRate,
      commission: {
        referrer: 0, // 待计算
        receiver: 0, // 待计算
        total: 0, // 待计算
      },
      calculationDetails: {
        baseAmount: dealAmount,
        rate: baseRate,
        multipliers: multiplier,
      },
    };

    // 计算分配
    const split = this.getCommissionSplit(referral);
    const totalCommission = dealAmount * baseRate * multiplier;

    calculation.commission = {
      referrer: totalCommission * split.referrer,
      receiver: totalCommission * split.receiver,
      total: totalCommission,
    };

    return calculation;
  }

  /**
   * 根据成交金额获取倍数
   */
  private getAmountMultiplier(dealAmount: number): number {
    for (const tier of this.AMOUNT_MULTIPLIERS.tiers) {
      if (dealAmount >= tier.min && dealAmount < tier.max) {
        return tier.multiplier;
      }
    }
    return 1.0;
  }

  /**
   * 获取业绩分配比例
   */
  private getCommissionSplit(referral: Referral): { referrer: number; receiver: number } {
    // TODO: 根据角色和级别动态调整分配比例
    // 目前使用默认分配

    // 如果成交人是主管或资深员工，使用 senior 分配
    // const receiverRole = getUserRole(referral.conversion.dealOwner);
    // if (receiverRole === 'manager' || receiverRole === 'senior') {
    //   return this.ROLE_SPLITS.senior;
    // }

    return this.ROLE_SPLITS.default;
  }

  /**
   * 计算月度业绩汇总
   */
  calculateMonthlySummary(
    referrals: Referral[],
    year: number,
    month: number
  ): {
    totalReferrals: number;
    convertedReferrals: number;
    totalCommission: number;
    referrerCommission: number;
    receiverCommission: number;
    byDepartment: Record<DepartmentType, number>;
  } {
    const summary = {
      totalReferrals: referrals.length,
      convertedReferrals: 0,
      totalCommission: 0,
      referrerCommission: 0,
      receiverCommission: 0,
      byDepartment: {
        orthokeratology: 0,
        refractive: 0,
      } as Record<DepartmentType, number>,
    };

    referrals.forEach((referral) => {
      // 筛选指定月份的转诊
      const referralDate = new Date(referral.createdAt);
      if (referralDate.getFullYear() !== year || referralDate.getMonth() + 1 !== month) {
        return;
      }

      if (referral.conversion) {
        summary.convertedReferrals++;

        try {
          const commission = this.calculate(referral);
          summary.totalCommission += commission.total;
          summary.referrerCommission += commission.referrerCommission;
          summary.receiverCommission += commission.receiverCommission;
          summary.byDepartment[referral.targetDepartment] += commission.total;
        } catch (error) {
          // 忽略计算失败的转诊
          console.error('Commission calculation failed for referral:', referral.id, error);
        }
      }
    });

    return summary;
  }

  /**
   * 计算团队业绩排名
   */
  calculateTeamRanking(
    referrals: Referral[],
    userId: string
  ): {
    userId: string;
    totalReferrals: number;
    convertedReferrals: number;
    totalCommission: number;
    rank: number;
  } {
    const userReferrals = referrals.filter(
      (r) => r.referrerId === userId || r.conversion?.dealOwner === userId
    );

    const convertedReferrals = userReferrals.filter((r) => r.conversion).length;
    let totalCommission = 0;

    userReferrals.forEach((referral) => {
      if (referral.conversion) {
        try {
          const commission = this.calculate(referral);
          totalCommission += commission.total;
        } catch (error) {
          // 忽略
        }
      }
    });

    return {
      userId,
      totalReferrals: userReferrals.length,
      convertedReferrals,
      totalCommission,
      rank: 0, // 排名需要与其他用户比较后确定
    };
  }

  /**
   * 获取业绩统计报告
   */
  getPerformanceReport(
    referrals: Referral[],
    startDate: Date,
    endDate: Date
  ): {
    period: { start: Date; end: Date };
    summary: {
      totalReferrals: number;
      conversionRate: number;
      totalRevenue: number;
      totalCommission: number;
    };
    trends: Array<{
      date: string;
      referrals: number;
      conversions: number;
      commission: number;
    }>;
    byDepartment: Record<DepartmentType, {
      referrals: number;
      conversions: number;
      revenue: number;
      commission: number;
    }>;
  } {
    // 筛选时间范围内的转诊
    const filteredReferrals = referrals.filter((r) => {
      const date = new Date(r.createdAt);
      return date >= startDate && date <= endDate;
    });

    const convertedReferrals = filteredReferrals.filter((r) => r.conversion);
    const totalRevenue = convertedReferrals.reduce(
      (sum, r) => sum + (r.conversion?.dealAmount || 0),
      0
    );
    const totalCommission = convertedReferrals.reduce((sum, r) => {
      try {
        return sum + this.calculate(r).total;
      } catch {
        return sum;
      }
    }, 0);

    // 生成趋势数据（按天）
    const trendsMap = new Map<string, { referrals: number; conversions: number; commission: number }>();

    filteredReferrals.forEach((referral) => {
      const dateKey = new Date(referral.createdAt).toISOString().split('T')[0];
      const trend = trendsMap.get(dateKey) || { referrals: 0, conversions: 0, commission: 0 };

      trend.referrals++;
      if (referral.conversion) {
        trend.conversions++;
        try {
          trend.commission += this.calculate(referral).total;
        } catch {
          // 忽略
        }
      }

      trendsMap.set(dateKey, trend);
    });

    const trends = Array.from(trendsMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 按科室统计
    const byDepartment = {
      orthokeratology: { referrals: 0, conversions: 0, revenue: 0, commission: 0 },
      refractive: { referrals: 0, conversions: 0, revenue: 0, commission: 0 },
    } as Record<DepartmentType, any>;

    filteredReferrals.forEach((referral) => {
      const dept = byDepartment[referral.targetDepartment];
      dept.referrals++;

      if (referral.conversion) {
        dept.conversions++;
        dept.revenue += referral.conversion.dealAmount;
        try {
          dept.commission += this.calculate(referral).total;
        } catch {
          // 忽略
        }
      }
    });

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalReferrals: filteredReferrals.length,
        conversionRate: filteredReferrals.length > 0
          ? (convertedReferrals.length / filteredReferrals.length) * 100
          : 0,
        totalRevenue,
        totalCommission,
      },
      trends,
      byDepartment,
    };
  }
}

// 导出单例
export const commissionCalculator = new CommissionCalculator();
