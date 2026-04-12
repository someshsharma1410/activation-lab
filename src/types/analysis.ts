export type Severity = 'high' | 'medium' | 'low'
export type Confidence = 'high' | 'medium' | 'low'
export type Effort = 'low' | 'medium' | 'high'
export type Framework = 'TTV' | 'Funnel' | 'Aha' | 'CogLoad' | 'Skippable'

export interface ExpectedLift {
  low: number
  mid: number
  high: number
}

export interface FrictionPoint {
  id: string
  title: string
  summary: string
  description: string
  hypothesis: string
  recommended_test: string
  expected_lift: ExpectedLift
  lift_context: string
  confidence: Confidence
  severity: Severity
  effort: Effort
  framework: Framework
  risk: string
  sequence_order: number
}

export interface AnalysisSummary {
  total_friction_points: number
  top_recommendation: string
  average_expected_lift: number
}

export interface AnalysisResult {
  friction_points: FrictionPoint[]
  summary: AnalysisSummary
}
