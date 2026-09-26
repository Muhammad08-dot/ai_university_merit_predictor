export interface StudentInput {
  matricObtained: number;
  matricTotal: number;
  interObtained: number;
  interTotal: number;
  isHafiz: boolean;
  stream: string;
  testScores: Record<string, number>; // universityId -> predicted score percentage
  selectedPrograms: string[];
  selectedUniversityIds: string[];
}

export interface UniversityData {
  id: string;
  name: string;
  shortName: string;
  city: string;
  province: string;
  type: string;
  nationalRank: number | null;
  matricWeight: number;
  interWeight: number;
  testWeight: number;
  testName: string;
  programs: ProgramData[];
}

export interface ProgramData {
  id: string;
  name: string;
  cutoffTypical: number | null;
  seats: number | null;
}

export type Likelihood = "Safe" | "Likely" | "Borderline" | "Reach" | "Unlikely";

export interface MeritResult {
  universityId: string;
  universityName: string;
  universityShortName: string;
  city: string;
  province: string;
  type: string;
  nationalRank: number | null;
  testName: string;
  programName: string;
  programId: string;
  aggregate: number;
  cutoff: number;
  likelihood: Likelihood;
  testScoreNeeded: number;
  matricPct: number;
  interPct: number;
  testPct: number;
  matricContribution: number;
  interContribution: number;
  testContribution: number;
  hafizBonus: number;
  isAlternative?: boolean;
}

export function calculateAggregate(
  matricPct: number,
  interPct: number,
  testPct: number,
  matricWeight: number,
  interWeight: number,
  testWeight: number,
  isHafiz: boolean
): { aggregate: number; hafizBonus: number } {
  const totalWeightRaw = matricWeight + interWeight + testWeight;
  const mW = matricWeight / totalWeightRaw;
  const iW = interWeight / totalWeightRaw;
  const tW = testWeight / totalWeightRaw;

  let aggregate = matricPct * mW + interPct * iW + testPct * tW;
  let hafizBonus = 0;
  if (isHafiz) {
    hafizBonus = 2; // +2% aggregate equivalent (≈20 marks on 1100 scale)
    aggregate += hafizBonus;
  }
  aggregate = Math.min(aggregate, 100);
  return { aggregate: parseFloat(aggregate.toFixed(2)), hafizBonus };
}

export function getLikelihood(aggregate: number, cutoff: number): Likelihood {
  const diff = aggregate - cutoff;
  if (diff >= 8) return "Safe";
  if (diff >= 3) return "Likely";
  if (diff >= -2) return "Borderline";
  if (diff >= -8) return "Reach";
  return "Unlikely";
}

export function getTestScoreNeeded(
  matricPct: number,
  interPct: number,
  cutoff: number,
  matricWeight: number,
  interWeight: number,
  testWeight: number,
  isHafiz: boolean
): number {
  const totalWeightRaw = matricWeight + interWeight + testWeight;
  const mW = matricWeight / totalWeightRaw;
  const iW = interWeight / totalWeightRaw;
  const tW = testWeight / totalWeightRaw;

  const hafizBonus = isHafiz ? 2 : 0;
  if (tW === 0) return 0;
  const needed = (cutoff - hafizBonus - matricPct * mW - interPct * iW) / tW;
  return Math.max(0, Math.min(100, parseFloat(needed.toFixed(1))));
}

export function calculateResults(
  input: StudentInput,
  universities: UniversityData[]
): MeritResult[] {
  const matricPct = input.matricTotal > 0 ? Math.min(100, Math.max(0, (input.matricObtained / input.matricTotal) * 100)) : 0;
  const interPct = input.interTotal > 0 ? Math.min(100, Math.max(0, (input.interObtained / input.interTotal) * 100)) : 0;
  const results: MeritResult[] = [];

  for (const uni of universities) {
    const isSelected = input.selectedUniversityIds.length === 0 || input.selectedUniversityIds.includes(uni.id);

    const testPct = input.testScores[uni.id] ?? 70;

    const matchingPrograms = uni.programs.filter(
      (p) =>
        input.selectedPrograms.length === 0 ||
        input.selectedPrograms.includes(p.name)
    );

    for (const prog of matchingPrograms) {
      const cutoff = prog.cutoffTypical ?? 70;
      const { aggregate, hafizBonus } = calculateAggregate(
        matricPct,
        interPct,
        testPct,
        uni.matricWeight,
        uni.interWeight,
        uni.testWeight,
        input.isHafiz
      );
      const likelihood = getLikelihood(aggregate, cutoff);

      if (!isSelected && likelihood === "Unlikely") {
        continue; // Only suggest alternatives that are within reach
      }
      if (!isSelected && likelihood === "Reach") {
        continue;
      }
      const testScoreNeeded = getTestScoreNeeded(
        matricPct,
        interPct,
        cutoff,
        uni.matricWeight,
        uni.interWeight,
        uni.testWeight,
        input.isHafiz
      );

      const totalWeightRaw = uni.matricWeight + uni.interWeight + uni.testWeight;

      results.push({
        universityId: uni.id,
        universityName: uni.name,
        universityShortName: uni.shortName,
        city: uni.city,
        province: uni.province,
        type: uni.type,
        nationalRank: uni.nationalRank,
        testName: uni.testName,
        programName: prog.name,
        programId: prog.id,
        aggregate,
        cutoff,
        likelihood,
        testScoreNeeded,
        matricPct: parseFloat(matricPct.toFixed(2)),
        interPct: parseFloat(interPct.toFixed(2)),
        testPct: testPct,
        matricContribution: parseFloat(
          (matricPct * (uni.matricWeight / totalWeightRaw)).toFixed(2)
        ),
        interContribution: parseFloat(
          (interPct * (uni.interWeight / totalWeightRaw)).toFixed(2)
        ),
        testContribution: parseFloat(
          (testPct * (uni.testWeight / totalWeightRaw)).toFixed(2)
        ),
        hafizBonus,
        isAlternative: !isSelected,
      });
    }
  }

  // Sort by likelihood priority then aggregate
  const order: Record<Likelihood, number> = {
    Safe: 0,
    Likely: 1,
    Borderline: 2,
    Reach: 3,
    Unlikely: 4,
  };
  results.sort((a, b) => {
    const lo = order[a.likelihood] - order[b.likelihood];
    if (lo !== 0) return lo;
    return b.aggregate - a.aggregate;
  });

  return results;
}
