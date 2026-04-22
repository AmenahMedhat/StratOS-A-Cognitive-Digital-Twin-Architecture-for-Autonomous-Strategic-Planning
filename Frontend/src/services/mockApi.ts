/**
 * Mock API service — mirrors the contract your Python backend will expose.
 * Swap each function body for a real fetch() call when the backend is ready.
 *
 * Pattern: every function returns a Promise that resolves after a realistic
 * delay, so loading states and skeleton UIs are tested in development.
 */

import type {
  DashboardData,
  InsightCard,
  Meeting,
  ResearchIntelligence,
  GapAnalysis,
  TeamMember,
  OrganizationProfile,
  SimulationResult,
  SwotCategory,
} from "@/types";

const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_INSIGHTS: InsightCard[] = [
  {
    id: "opp-1",
    category: "opportunity",
    title: "AI Integration in Curriculum",
    description: "Growing demand for AI-focused programs across all departments creates an expansion opportunity.",
    pillar_tag: "Pillar 12: Digital Transformation",
    impact_level: "high",
    confidence_score: 87,
    reference_count: 8,
    created_at: new Date(Date.now() - 4 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "statistical",
      explanation: "Enrollment requests for AI-adjacent electives increased 34% YoY across 6 Egyptian universities. Industry partnership inquiries involving AI curriculum rose from 3 to 11 in the past 18 months.",
      data_points: { enrollment_growth_pct: 34, industry_inquiries: 11, benchmark_universities: 6 },
    },
  },
  {
    id: "opp-2",
    category: "opportunity",
    title: "International Partnership Programs",
    description: "Potential collaborations with top global universities identified via research co-authorship networks.",
    pillar_tag: "Pillar 9: International Partnerships",
    impact_level: "high",
    confidence_score: 82,
    reference_count: 6,
    created_at: new Date(Date.now() - 12 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "raw_text",
      source_document: "NAQAAE_Manual_v3.pdf",
      explanation: "Co-authorship analysis identified 14 publications with institutions ranked in the global top 200. Three universities have open MoU frameworks. Pillar 9 benchmark requires at least 2 active international agreements.",
      data_points: { co_authored_papers: 14, open_mou_universities: 3, required_agreements: 2 },
    },
  },
  {
    id: "opp-3",
    category: "opportunity",
    title: "Industry Collaboration Growth",
    description: "Tech companies are actively seeking academic partnerships for R&D projects.",
    pillar_tag: "Pillar 8: Community Engagement",
    impact_level: "medium",
    confidence_score: 79,
    reference_count: 5,
    created_at: new Date(Date.now() - 24 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "statistical",
      explanation: "Market scan: 7 major tech companies in Egypt listed 'academic R&D partnerships' as a 2026 strategic priority. Current engagement score: 2/10 on NAQAAE Pillar 8 rubric.",
      data_points: { companies_seeking_partnerships: 7, current_pillar_score: 2, max_score: 10 },
    },
  },
  {
    id: "opp-4",
    category: "opportunity",
    title: "Digital Learning Expansion",
    description: "Post-pandemic shift creating new online program opportunities at scale.",
    pillar_tag: "Pillar 5: Student Learning Outcomes",
    impact_level: "medium",
    confidence_score: 75,
    reference_count: 4,
    created_at: new Date(Date.now() - 24 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "statistical",
      explanation: "Online enrollment in MENA HEIs grew 61% between 2022-2025. Nile University's online capacity is currently 12% of total headcount, vs. a sector average of 28%.",
      data_points: { sector_online_growth_pct: 61, nu_online_capacity_pct: 12, sector_avg_pct: 28 },
    },
  },
  {
    id: "opp-5",
    category: "opportunity",
    title: "Research Grant Availability",
    description: "New government initiatives for STEM funding are under-utilised.",
    pillar_tag: "Pillar 7: Research & Innovation",
    impact_level: "medium",
    confidence_score: 71,
    reference_count: 3,
    created_at: new Date(Date.now() - 48 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "calculation",
      formula: "Grant_Utilisation = Applications_Submitted / Available_Grants × 100",
      explanation: "STDF and ITIDA combined have EGP 120M in unclaimed STEM grants for 2026. Current application rate: 2 submissions vs. 18 available windows.",
      data_points: { available_budget_m: 120, submitted_applications: 2, available_windows: 18 },
    },
  },
  {
    id: "thr-1",
    category: "threat",
    title: "Regional Competition Increase",
    description: "Other Egyptian universities expanding rapidly, threatening student recruitment.",
    pillar_tag: "Pillar 2: Strategic Planning",
    impact_level: "critical",
    confidence_score: 91,
    reference_count: 7,
    created_at: new Date(Date.now() - 6 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "statistical",
      explanation: "4 new private universities received accreditation in Greater Cairo in 2025. Combined projected intake: 12,000 students/year in engineering/CS — directly overlapping Nile University's core programmes.",
      data_points: { new_universities: 4, competing_intake: 12000, overlap_score_pct: 78 },
    },
  },
  {
    id: "thr-2",
    category: "threat",
    title: "Funding Uncertainty",
    description: "Economic pressures affecting education budgets and tuition sustainability.",
    pillar_tag: "Pillar 11: Financial Sustainability",
    impact_level: "high",
    confidence_score: 84,
    reference_count: 5,
    created_at: new Date(Date.now() - 24 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "calculation",
      formula: "Revenue_Risk_Index = (Tuition_Revenue / Total_Revenue) × Inflation_Multiplier",
      explanation: "Tuition accounts for 73% of operating revenue. With EGP inflation at 32%, real purchasing power of tuition has declined 18% since 2023. Endowment-to-operating ratio: 0.12 (sector norm: 0.45).",
      data_points: { tuition_revenue_pct: 73, inflation_rate_pct: 32, endowment_ratio: 0.12, sector_norm: 0.45 },
    },
  },
  {
    id: "thr-3",
    category: "threat",
    title: "Faculty Retention Challenges",
    description: "Brain drain to international institutions is accelerating.",
    pillar_tag: "Pillar 4: Faculty Development",
    impact_level: "high",
    confidence_score: 78,
    reference_count: 4,
    created_at: new Date(Date.now() - 24 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "calculation",
      formula: "Senior_Turnover = Senior_Exits / Total_Senior_Faculty × 100",
      explanation: "5 associate/full professors departed in the past 18 months — 3 to Gulf universities, 2 to European institutions. Senior faculty turnover rate: 14% vs. NAQAAE recommended ceiling of 8%.",
      data_points: { senior_exits: 5, total_senior_faculty: 36, turnover_rate_pct: 14, benchmark_pct: 8 },
    },
  },
  {
    id: "thr-4",
    category: "threat",
    title: "Regulatory Changes Impact",
    description: "New NAQAAE requirements raising compliance burden significantly.",
    pillar_tag: "Pillar 3: Quality Assurance Systems",
    impact_level: "medium",
    confidence_score: 69,
    reference_count: 3,
    created_at: new Date(Date.now() - 36 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "raw_text",
      source_document: "NAQAAE_Circular_2025_14.pdf",
      explanation: "NAQAAE Circular 2025/14 introduces 23 new self-study report requirements effective Jan 2026. Current QA team capacity: 2.5 FTE. Estimated additional workload: 380 person-hours.",
      data_points: { new_requirements: 23, qa_fte: 2.5, additional_hours: 380 },
    },
  },
  {
    id: "thr-5",
    category: "threat",
    title: "Technology Disruption Pace",
    description: "Rapid AI/GenAI advances are outpacing curriculum update cycles.",
    pillar_tag: "Pillar 6: Curriculum Design",
    impact_level: "medium",
    confidence_score: 65,
    reference_count: 2,
    created_at: new Date(Date.now() - 48 * 3600_000).toISOString(),
    data_source: "mock",
    is_validated: false,
    ai_suggestion: true,
    evidence: {
      type: "statistical",
      explanation: "Average curriculum update cycle: 3 years. Key GenAI frameworks (e.g., LangChain, LlamaIndex) have major breaking changes every 6 months. Gap: 24+ months of curriculum lag behind industry.",
      data_points: { curriculum_cycle_months: 36, tech_change_cycle_months: 6, lag_months: 24 },
    },
  },
];

const MOCK_MEETINGS: Meeting[] = [
  {
    id: "mtg-1",
    title: "Q1 Strategic Planning Session",
    type: "Board Meeting",
    date: "2026-01-15T10:00:00",
    duration_minutes: 135,
    participants: ["Dr. Chen", "Prof. Ahmed", "Dr. Hassan", "Sarah M."],
    ai_summary: "Reviewed Q4 performance metrics and established strategic priorities for 2026. Key focus areas include research output expansion, international partnerships, and digital transformation initiatives.",
    key_decisions: [
      "Research budget increased by 15% for STEM programs",
      "New partnership framework with European universities",
      "Digital infrastructure upgrade timeline confirmed",
      "Faculty recruitment targets set for Fall 2026",
    ],
    action_items: [
      { id: "ai-1", description: "Draft partnership proposal for EU universities", assignee: "Dr. Chen", is_completed: false },
      { id: "ai-2", description: "Review infrastructure upgrade RFPs", assignee: "Prof. Ahmed", is_completed: true },
      { id: "ai-3", description: "Finalize faculty recruitment criteria", assignee: "Dr. Hassan", is_completed: false },
    ],
    has_recording: true,
    has_transcript: true,
    data_source: "mock",
  },
  {
    id: "mtg-2",
    title: "Engineering Faculty Review",
    type: "Department",
    date: "2026-01-14T14:00:00",
    duration_minutes: 90,
    participants: ["Dr. Hassan", "Prof. Ahmed", "Dr. Layla"],
    ai_summary: "Reviewed Q4 faculty performance, discussed curriculum alignment with industry needs, and assessed student satisfaction metrics across all engineering programmes.",
    key_decisions: [
      "Introduce industry mentorship programme in Q2",
      "Update capstone project requirements",
    ],
    action_items: [
      { id: "ai-4", description: "Contact 5 industry partners for mentorship", assignee: "Dr. Hassan", is_completed: false },
      { id: "ai-5", description: "Revise capstone rubric", assignee: "Prof. Ahmed", is_completed: true },
    ],
    has_recording: false,
    has_transcript: true,
    data_source: "mock",
  },
  {
    id: "mtg-3",
    title: "Budget Committee Meeting",
    type: "Committee",
    date: "2026-01-18T09:00:00",
    duration_minutes: 60,
    participants: ["Dr. Chen", "Finance Officer", "Dr. Layla"],
    ai_summary: "Allocated Q1 budget across departments, reviewed CAPEX requests for lab equipment, and approved emergency maintenance fund.",
    key_decisions: [
      "Lab equipment CAPEX of EGP 2.4M approved",
      "Freeze on non-critical hiring until Q2",
    ],
    action_items: [],
    has_recording: false,
    has_transcript: false,
    data_source: "mock",
  },
];

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: "tm-1", name: "Dr. Sarah Chen", email: "s.chen@nileuniversity.edu.eg", role: "Admin", avatar_initials: "SC", joined_at: "2024-01-01" },
  { id: "tm-2", name: "Prof. Ahmed Hassan", email: "a.hassan@nileuniversity.edu.eg", role: "Editor", avatar_initials: "AH", joined_at: "2024-03-15" },
  { id: "tm-3", name: "Dr. Layla Omar", email: "l.omar@nileuniversity.edu.eg", role: "Viewer", avatar_initials: "LO", joined_at: "2024-06-01" },
  { id: "tm-4", name: "Mohamed Ali", email: "m.ali@nileuniversity.edu.eg", role: "Editor", avatar_initials: "MA", joined_at: "2025-01-10" },
];

// ─── API functions (swap bodies for real fetch() calls) ─────────────────────────

export async function fetchDashboardData(): Promise<DashboardData> {
  await delay(900);
  return {
    compliance: {
      overall_score: 68,
      next_submission_date: "2026-09-01",
      days_remaining: 133,
      pillar_scores: {
        "Pillar 1": 80, "Pillar 2": 65, "Pillar 3": 72, "Pillar 4": 55,
        "Pillar 5": 70, "Pillar 6": 60, "Pillar 7": 75, "Pillar 8": 40,
        "Pillar 9": 50, "Pillar 10": 85, "Pillar 11": 55, "Pillar 12": 62,
      },
      last_updated: new Date().toISOString(),
      data_source: "mock",
    },
    kpis: [
      { id: "k1", label: "Total Faculty", value: 142, trend: "up", trend_value: 3, status: "good", data_source: "mock" },
      { id: "k2", label: "Student-Faculty Ratio", value: "18:1", trend: "stable", status: "warning", data_source: "mock" },
      { id: "k3", label: "Active Risks", value: 7, trend: "up", trend_value: 2, status: "critical", data_source: "mock" },
      { id: "k4", label: "Research Output", value: 34, unit: "papers", trend: "up", trend_value: 8, status: "good", data_source: "mock" },
      { id: "k5", label: "Compliance Score", value: 68, unit: "%", trend: "up", trend_value: 4, status: "warning", data_source: "mock" },
      { id: "k6", label: "Faculty Retention", value: 86, unit: "%", trend: "down", trend_value: 5, status: "warning", data_source: "mock" },
    ],
    swot_summary: {
      strengths: [],
      weaknesses: [],
      opportunities: MOCK_INSIGHTS.filter((i) => i.category === "opportunity"),
      threats: MOCK_INSIGHTS.filter((i) => i.category === "threat"),
    },
    recent_meetings: MOCK_MEETINGS.slice(0, 3),
    last_simulation: {
      query: "What if we increase R&D budget by 15%?",
      outcomes: [
        { label: "Best Case", percentage_change: 28, probability: 0.15, description: "Significant research output improvement" },
        { label: "Most Probable", percentage_change: 12, probability: 0.65, description: "Moderate gains in H-index and publications" },
        { label: "Worst Case", percentage_change: -5, probability: 0.20, description: "Budget misallocation with minimal returns" },
      ],
      confidence: 76,
      simulated_at: new Date(Date.now() - 2 * 3600_000).toISOString(),
      iterations: 10000,
    },
    sync_status: "up_to_date",
  };
}

export async function fetchInsights(category?: SwotCategory): Promise<InsightCard[]> {
  await delay(700);
  return category ? MOCK_INSIGHTS.filter((i) => i.category === category) : MOCK_INSIGHTS;
}

export async function fetchMeetings(): Promise<Meeting[]> {
  await delay(600);
  return MOCK_MEETINGS;
}

export async function fetchMeeting(id: string): Promise<Meeting | null> {
  await delay(400);
  return MOCK_MEETINGS.find((m) => m.id === id) ?? null;
}

export async function fetchResearchIntelligence(): Promise<ResearchIntelligence> {
  await delay(1000);
  return {
    nile_university: {
      university_name: "Nile University",
      publications: 0,
      h_index: 0,
      total_citations: 0,
      h_index_history: [],
    },
    competitors: [
      {
        university_name: "Cairo University",
        rank: 1,
        publications: 1240,
        h_index: 48,
        total_citations: 32000,
        h_index_history: [
          { year: 2019, value: 38 }, { year: 2020, value: 40 }, { year: 2021, value: 42 },
          { year: 2022, value: 44 }, { year: 2023, value: 46 }, { year: 2024, value: 48 },
        ],
      },
      {
        university_name: "AUC",
        rank: 2,
        publications: 890,
        h_index: 41,
        total_citations: 21000,
        h_index_history: [
          { year: 2019, value: 34 }, { year: 2020, value: 36 }, { year: 2021, value: 37 },
          { year: 2022, value: 38 }, { year: 2023, value: 40 }, { year: 2024, value: 41 },
        ],
      },
    ],
    data_source: "mock",
  };
}

export async function fetchGapAnalysis(): Promise<GapAnalysis> {
  await delay(800);
  const pillars = [
    { short: "Leadership", score: 80 },
    { short: "Strategy", score: 65 },
    { short: "QA Systems", score: 72 },
    { short: "Faculty", score: 55 },
    { short: "Learning", score: 70 },
    { short: "Curriculum", score: 60 },
    { short: "Research", score: 75 },
    { short: "Community", score: 40 },
    { short: "Intl. Partners", score: 50 },
    { short: "Infrastructure", score: 85 },
    { short: "Finance", score: 55 },
    { short: "Digital", score: 62 },
  ];
  return {
    pillars: pillars.map((p, i) => ({
      pillar: `Pillar ${i + 1}: ${["Leadership & Governance","Strategic Planning","Quality Assurance Systems","Faculty Development","Student Learning Outcomes","Curriculum Design","Research & Innovation","Community Engagement","International Partnerships","Physical Infrastructure","Financial Sustainability","Digital Transformation"][i]}` as any,
      pillar_short: p.short,
      current_score: p.score,
      benchmark_score: 100,
      gap: 100 - p.score,
    })),
    overall_gap: 34,
    critical_pillars: ["Community Engagement", "International Partnerships", "Faculty Development"],
    data_source: "mock",
  };
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  await delay(500);
  return MOCK_TEAM_MEMBERS;
}

export async function updateTeamMemberRole(id: string, role: TeamMember["role"]): Promise<TeamMember> {
  await delay(400);
  const member = MOCK_TEAM_MEMBERS.find((m) => m.id === id);
  if (!member) throw new Error("Member not found");
  return { ...member, role };
}

export async function fetchOrganizationProfile(): Promise<OrganizationProfile> {
  await delay(500);
  return {
    name: "Nile University",
    type: "Private Technical University",
    accreditation_body: "NAQAAE",
    admin_email: "s.chen@nileuniversity.edu.eg",
    uploaded_documents: [
      { id: "doc-1", name: "NAQAAE_Manual_v3.pdf", type: "Accreditation Manual", uploaded_at: "2025-11-01", status: "saved", size_kb: 4200 },
      { id: "doc-2", name: "Self_Study_Report_2025.pdf", type: "Self-Study Report", uploaded_at: "2025-12-15", status: "saved", size_kb: 8900 },
      { id: "doc-3", name: "Faculty_Handbook_2026.pdf", type: "Faculty Handbook", uploaded_at: "2026-01-10", status: "processing", size_kb: 1200 },
    ],
  };
}

export async function runSimulation(query: string): Promise<SimulationResult> {
  await delay(2500);
  const base = Math.random() * 30;
  return {
    query,
    outcomes: [
      { label: "Best Case", percentage_change: +(base + 10 + Math.random() * 10).toFixed(1), probability: 0.15 },
      { label: "Most Probable", percentage_change: +(base + Math.random() * 8).toFixed(1), probability: 0.65 },
      { label: "Worst Case", percentage_change: +(-5 - Math.random() * 10).toFixed(1), probability: 0.20 },
    ],
    confidence: Math.floor(60 + Math.random() * 35),
    simulated_at: new Date().toISOString(),
    iterations: 10000,
  };
}

export async function sendChatMessage(messages: { role: string; content: string }[]): Promise<string> {
  await delay(1500);
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
  if (lastMsg.includes("swot")) return "Based on your current NAQAAE data, your top opportunity is **AI Integration in Curriculum** (87% confidence) and your most critical threat is **Regional Competition Increase** (91% confidence). Would you like a deeper analysis of either?";
  if (lastMsg.includes("compliance") || lastMsg.includes("score")) return "Your current overall compliance score is **68%**, which is 32 points below the NAQAAE benchmark. The largest gaps are in Community Engagement (Pillar 8: 40%), International Partnerships (Pillar 9: 50%), and Faculty Development (Pillar 4: 55%). Shall I simulate what closing these gaps would look like?";
  if (lastMsg.includes("faculty") || lastMsg.includes("retention")) return "Faculty retention is at **86%** and declining. The senior turnover rate of 14% exceeds the NAQAAE recommended ceiling of 8%. I recommend reviewing the compensation benchmarking data and initiating a retention programme for associate and full professors.";
  return "I've analysed your latest strategic data. Your compliance score stands at 68%, with notable risks in faculty retention and regional competition. I can run a detailed simulation on any specific scenario — just describe the change you want to model.";
}
