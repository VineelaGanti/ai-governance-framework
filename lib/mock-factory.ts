import { z } from "zod";

export const sensorDataSchema = z.object({
  motorSpeed: z.number().min(0).max(100),
  powerConsumption: z.number().min(0),
  temperature: z.number(),
  timestamp: z.number(),
});

export type SensorData = z.infer<typeof sensorDataSchema>;

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

const BASE_LOAD_WATTS = 50;
const MAX_POWER_WATTS = 1000;
const AMBIENT_TEMP_C = 22;
const HEAT_RATE_PER_KW_MS = 0.002;
const COOL_RATE_PER_MS = 0.001;
const MIN_TEMP_C = 15;
const MAX_TEMP_C = 95;

export function powerFromSpeed(motorSpeed: number): number {
  if (motorSpeed <= 0) return 0;
  const ratio = motorSpeed / 100;
  return BASE_LOAD_WATTS + ratio * ratio * (MAX_POWER_WATTS - BASE_LOAD_WATTS);
}

export function nextTemperature(
  powerConsumptionWatts: number,
  currentTempC: number,
  deltaMs: number
): number {
  const powerKw = powerConsumptionWatts / 1000;
  const heatGain = powerKw * HEAT_RATE_PER_KW_MS * deltaMs;
  const cooling = (currentTempC - AMBIENT_TEMP_C) * COOL_RATE_PER_MS * deltaMs * (powerKw < 0.1 ? 2 : 1);
  const next = currentTempC + heatGain - cooling;
  if (next < MIN_TEMP_C) return MIN_TEMP_C;
  if (next > MAX_TEMP_C) return MAX_TEMP_C;
  return Math.round(next * 10) / 10;
}

export type GenerateSensorDataOptions = {
  previousTemperature?: number;
  previousTimestamp?: number;
  motorSpeed?: number;
};

export function generateSensorData(options: GenerateSensorDataOptions = {}): SensorData {
  const now = Date.now();
  const prevTemp = options.previousTemperature ?? AMBIENT_TEMP_C;
  const prevTs = options.previousTimestamp ?? now - 5000;
  const deltaMs = Math.min(now - prevTs, 10000);

  const motorSpeed = options.motorSpeed ?? 30 + Math.floor(Math.random() * 50);
  const powerConsumption = Math.round(powerFromSpeed(motorSpeed));
  const temperature = nextTemperature(powerConsumption, prevTemp, deltaMs);

  return {
    motorSpeed,
    powerConsumption,
    temperature,
    timestamp: now,
  };
}

const POWER_TOLERANCE = 0.15;

export function validateDataIntegrity(
  data: SensorData,
  previous?: { temperature: number; timestamp: number }
): ValidationResult {
  if (data.motorSpeed >= 99 && data.powerConsumption < 1) {
    return { valid: false, error: "Physical Impossibility: full speed with no power" };
  }
  if (data.motorSpeed > 0 && data.powerConsumption < 1) {
    return { valid: false, error: "Physical Impossibility: motor running with zero power" };
  }

  const expectedPower = powerFromSpeed(data.motorSpeed);
  const minPower = expectedPower * (1 - POWER_TOLERANCE);
  const maxPower = expectedPower * (1 + POWER_TOLERANCE) + 1;
  if (data.powerConsumption < minPower || data.powerConsumption > maxPower) {
    return {
      valid: false,
      error: `Physical Impossibility: power ${data.powerConsumption}W inconsistent with speed ${data.motorSpeed}% (expected ~${Math.round(expectedPower)}W)`,
    };
  }

  if (!previous) return { valid: true };
  const deltaMs = Math.min(data.timestamp - previous.timestamp, 10000);
  const expectedTemp = nextTemperature(data.powerConsumption, previous.temperature, deltaMs);
  const tempDiff = Math.abs(data.temperature - expectedTemp);
  if (tempDiff > 5) {
    return {
      valid: false,
      error: `Temperature ${data.temperature}°C inconsistent with power/time (expected ~${expectedTemp.toFixed(1)}°C)`,
    };
  }
  return { valid: true };
}

const parseSensorData(raw: unknown): SensorData {
  return sensorDataSchema.parse(raw);
}

export default parseSensorData;