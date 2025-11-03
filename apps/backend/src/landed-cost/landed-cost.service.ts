import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TariffService } from '../tariff/tariff.service';
import { FeesService } from '../fees/fees.service';

@Injectable()
export class LandedCostService {
  constructor(
    private prisma: PrismaService,
    private tariffService: TariffService,
    private feesService: FeesService,
  ) {}

  async calculate(inputs: {
    basePrice: number;
    quantity: number;
    freight: number;
    insurance: number;
    portFee: number;
    clearanceFee: number;
    truckingFee: number;
    reeferSurcharge?: number;
    fxRate: number;
    hsCode: string;
    country: string;
    insuranceRatePercent?: number;
    perishabilityRiskFactor?: number;
  }) {
    const { basePrice, quantity, freight, insurance, portFee, clearanceFee, truckingFee, reeferSurcharge, fxRate, hsCode, country, insuranceRatePercent, perishabilityRiskFactor } = inputs;

    // Get tariff rates
    const tariffRates = await this.tariffService.findByHsCode(hsCode);
    const tariffRate = tariffRates.find((r) => r.country === country);

    if (!tariffRate) {
      throw new Error(`Tariff rate not found for HS code ${hsCode} and country ${country}`);
    }

    // Calculate base cost in local currency
    const baseCostLocal = basePrice * quantity * fxRate;

    // Calculate freight and insurance
    const freightLocal = freight * fxRate;
    const insuranceLocal = insurance || baseCostLocal * (insuranceRatePercent || 0.01);

    // Calculate duty and VAT
    const dutyAmount = baseCostLocal * (tariffRate.dutyPercent / 100);
    const vatAmount = (baseCostLocal + dutyAmount) * (tariffRate.vatPercent / 100);

    // Calculate fees
    const portFeeLocal = portFee * fxRate;
    const clearanceFeeLocal = clearanceFee * fxRate;
    const truckingFeeLocal = truckingFee * fxRate;
    const reeferSurchargeLocal = (reeferSurcharge || 0) * fxRate;

    // Calculate perishability risk adjustment
    const perishabilityAdjustment = baseCostLocal * (perishabilityRiskFactor || 0);

    // Total landed cost
    const totalLandedCost =
      baseCostLocal +
      freightLocal +
      insuranceLocal +
      dutyAmount +
      vatAmount +
      portFeeLocal +
      clearanceFeeLocal +
      truckingFeeLocal +
      reeferSurchargeLocal +
      perishabilityAdjustment;

    const perUnitLandedCost = totalLandedCost / quantity;

    const outputs = {
      baseCostLocal,
      freightLocal,
      insuranceLocal,
      dutyAmount,
      vatAmount,
      portFeeLocal,
      clearanceFeeLocal,
      truckingFeeLocal,
      reeferSurchargeLocal,
      perishabilityAdjustment,
      totalLandedCost,
      perUnitLandedCost,
    };

    // Save calculation
    const calc = await this.prisma.landedCostCalc.create({
      data: {
        inputs: inputs as any,
        outputs: outputs as any,
        fxRate,
        insuranceRatePercent: insuranceRatePercent || 0.01,
        perishabilityRiskFactor: perishabilityRiskFactor || 0,
      },
    });

    return {
      ...outputs,
      calcId: calc.id,
    };
  }
}

