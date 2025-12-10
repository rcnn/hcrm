import {
  DepartmentType,
  ClinicalIndicators,
} from '@/lib/types/referral';

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  warnings?: string[];
}

export interface ReferralEligibilityCheck {
  isEligible: boolean;
  recommendedDepartment?: DepartmentType;
  reasons: string[];
  warnings: string[];
  clinicalIndicators: {
    age?: number;
    myopiaProgress?: number;
    sphericalPower?: number;
    cornealThickness?: number;
  };
}

/**
 * 转诊条件校验服务
 */
export class ReferralValidationService {
  // 年龄阈值
  private readonly ADULT_AGE = 18;

  // 度数增长阈值
  private readonly MYOPIA_PROGRESS_THRESHOLD = 50; // 50度/半年

  // 角膜厚度阈值（微米）
  private readonly MIN_CORNEAL_THICKNESS = 500;

  // 角塑适应度数范围
  private readonly ORTHO_MIN_SPHERICAL = -6.0;
  private readonly ORTHO_MAX_SPHERICAL = -0.5;
  private readonly ORTHO_MAX_CYLINDRICAL = -1.5;

  // 屈光手术适应度数范围
  private readonly REFRACTIVE_MIN_SPHERICAL = -12.0;
  private readonly REFRACTIVE_MAX_SPHERICAL = -0.5;
  private readonly REFRACTIVE_MAX_CYLINDRICAL = -6.0;

  /**
   * 校验客户是否符合转诊条件
   */
  checkEligibility(
    age: number,
    clinicalIndicators: Partial<ClinicalIndicators>
  ): ReferralEligibilityCheck {
    const reasons: string[] = [];
    const warnings: string[] = [];
    const indicators = {
      age: clinicalIndicators.age || age,
      myopiaProgress: clinicalIndicators.myopiaProgress,
      sphericalPower: clinicalIndicators.sphericalPower,
      cornealThickness: clinicalIndicators.cornealThickness,
    };

    // 判断推荐科室
    let recommendedDepartment: DepartmentType | undefined;

    if (age >= this.ADULT_AGE) {
      // 成年人优先推荐屈光手术
      recommendedDepartment = 'refractive';
      reasons.push(`年龄${age}岁，符合屈光手术年龄要求（≥18岁）`);
    } else {
      // 未成年人推荐角塑
      recommendedDepartment = 'orthokeratology';
      reasons.push(`年龄${age}岁，符合角塑镜适应年龄（≤18岁）`);
    }

    // 校验度数增长
    if (clinicalIndicators.myopiaProgress !== undefined) {
      if (clinicalIndicators.myopiaProgress >= this.MYOPIA_PROGRESS_THRESHOLD) {
        warnings.push(
          `度数增长较快（${clinicalIndicators.myopiaProgress}度/半年），建议加强控制`
        );
      }
    }

    // 校验角膜厚度
    if (
      clinicalIndicators.cornealThickness !== undefined &&
      clinicalIndicators.cornealThickness < this.MIN_CORNEAL_THICKNESS
    ) {
      warnings.push(
        `角膜厚度较薄（${clinicalIndicators.cornealThickness}μm），不适合进行角膜接触镜验配`
      );
    }

    // 校验球镜度数
    if (clinicalIndicators.sphericalPower !== undefined) {
      const spherical = Math.abs(clinicalIndicators.sphericalPower);

      if (recommendedDepartment === 'orthokeratology') {
        if (
          spherical < Math.abs(this.ORTHO_MIN_SPHERICAL) ||
          spherical > Math.abs(this.ORTHO_MAX_SPHERICAL)
        ) {
          warnings.push(
            `度数超出角塑镜适应范围（${this.ORTHO_MAX_SPHERICAL}至${this.ORTHO_MIN_SPHERICAL}D）`
          );
        }
      } else if (recommendedDepartment === 'refractive') {
        if (
          spherical < Math.abs(this.REFRACTIVE_MAX_SPHERICAL) ||
          spherical > Math.abs(this.REFRACTIVE_MIN_SPHERICAL)
        ) {
          warnings.push(
            `度数超出屈光手术适应范围（${this.REFRACTIVE_MAX_SPHERICAL}至${this.REFRACTIVE_MIN_SPHERICAL}D）`
          );
        }
      }
    }

    return {
      isEligible: reasons.length > 0,
      recommendedDepartment,
      reasons,
      warnings,
      clinicalIndicators: indicators,
    };
  }

  /**
   * 校验目标科室是否合适
   */
  validateDepartment(
    department: DepartmentType,
    clinicalIndicators: Partial<ClinicalIndicators>
  ): ValidationResult {
    const age = clinicalIndicators.age || 0;
    const sphericalPower = clinicalIndicators.sphericalPower || 0;
    const cylindricalPower = clinicalIndicators.cylindricalPower || 0;

    if (department === 'orthokeratology') {
      // 校验角塑科条件
      if (age > this.ADULT_AGE) {
        return {
          isValid: false,
          reason: `角塑镜主要适用于18岁以下的青少年，当前年龄${age}岁不符合`,
        };
      }

      if (
        sphericalPower < this.ORTHO_MIN_SPHERICAL ||
        sphericalPower > this.ORTHO_MAX_SPHERICAL
      ) {
        return {
          isValid: false,
          reason: `球镜度数超出角塑镜适应范围（${this.ORTHO_MAX_SPHERICAL}至${this.ORTHO_MIN_SPHERICAL}D）`,
        };
      }

      if (Math.abs(cylindricalPower) > Math.abs(this.ORTHO_MAX_CYLINDRICAL)) {
        return {
          isValid: false,
          reason: `散光度数超出角塑镜适应范围（≤${Math.abs(this.ORTHO_MAX_CYLINDRICAL)}D）`,
        };
      }

      return {
        isValid: true,
        warnings: clinicalIndicators.cornealThickness
          ? [
              `建议角膜厚度≥${this.MIN_CORNEAL_THICKNESS}μm，当前为${clinicalIndicators.cornealThickness}μm`,
            ]
          : [],
      };
    } else {
      // 校验屈光科条件
      if (age < this.ADULT_AGE) {
        return {
          isValid: false,
          reason: `屈光手术要求年满18岁，当前年龄${age}岁不符合`,
        };
      }

      if (
        sphericalPower < this.REFRACTIVE_MIN_SPHERICAL ||
        sphericalPower > this.REFRACTIVE_MAX_SPHERICAL
      ) {
        return {
          isValid: false,
          reason: `球镜度数超出屈光手术适应范围（${this.REFRACTIVE_MAX_SPHERICAL}至${this.REFRACTIVE_MIN_SPHERICAL}D）`,
        };
      }

      if (Math.abs(cylindricalPower) > Math.abs(this.REFRACTIVE_MAX_CYLINDRICAL)) {
        return {
          isValid: false,
          reason: `散光度数超出屈光手术适应范围（≤${Math.abs(this.REFRACTIVE_MAX_CYLINDRICAL)}D）`,
        };
      }

      return {
        isValid: true,
        warnings: clinicalIndicators.cornealThickness
          ? [
              `角膜厚度检查结果：${clinicalIndicators.cornealThickness}μm`,
            ]
          : [],
      };
    }
  }

  /**
   * 获取转诊建议
   */
  getReferralAdvice(
    age: number,
    clinicalIndicators: Partial<ClinicalIndicators>
  ): {
    recommended: DepartmentType;
    confidence: number;
    reasons: string[];
  } {
    const check = this.checkEligibility(age, clinicalIndicators);

    if (!check.recommendedDepartment) {
      throw new Error('无法确定推荐科室');
    }

    // 计算置信度
    let confidence = 0.5; // 基础置信度

    if (check.reasons.length > 0) {
      confidence += 0.2;
    }

    if (check.warnings.length === 0) {
      confidence += 0.2;
    }

    if (clinicalIndicators.myopiaProgress !== undefined) {
      if (clinicalIndicators.myopiaProgress >= this.MYOPIA_PROGRESS_THRESHOLD) {
        confidence += 0.1;
      }
    }

    confidence = Math.min(confidence, 1.0);

    return {
      recommended: check.recommendedDepartment,
      confidence,
      reasons: check.reasons,
    };
  }
}

// 导出单例
export const referralValidation = new ReferralValidationService();
