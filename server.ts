import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { 
  EnvironmentalGoal, 
  CSRActivity, 
  ApprovalRequest, 
  Department, 
  Challenge, 
  ReportTemplate,
  DashboardMetrics
} from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory Database Stores
  let environmentalGoals: EnvironmentalGoal[] = [
    {
      id: "env-1",
      name: "Reduce Logistics Carbon",
      department: "Supply Chain",
      target_co2: 1200,
      current_co2: 1450,
      deadline: "Q4 2024",
      status: "On Track"
    },
    {
      id: "env-2",
      name: "Cut Packaging Waste",
      department: "Product Design",
      target_co2: 500,
      current_co2: 510,
      deadline: "Q2 2024",
      status: "Active"
    },
    {
      id: "env-3",
      name: "Office Energy Cut",
      department: "Facilities",
      target_co2: 800,
      current_co2: 800,
      deadline: "Q1 2024",
      status: "Completed"
    }
  ];

  let challenges: Challenge[] = [
    {
      id: "gam-1",
      name: "Reduce Energy Peak Usage",
      description: "Implement automated HVAC curtailment during peak grid demand hours to reduce overall carbon footprint.",
      xp_reward: 500,
      days_left: 14,
      category: "Environmental",
      icon: "energy_savings_leaf"
    },
    {
      id: "gam-2",
      name: "Community Volunteer Drive",
      description: "Coordinate a minimum of 100 employee volunteer hours for local community environmental cleanup initiatives.",
      xp_reward: 750,
      days_left: 30,
      category: "Social",
      icon: "diversity_3"
    },
    {
      id: "gam-3",
      name: "Supply Chain Audit",
      description: "Complete a comprehensive ESG compliance audit for top 10 Tier-1 suppliers ensuring alignment with new policy.",
      xp_reward: 1200,
      days_left: 45,
      category: "Governance",
      icon: "policy"
    }
  ];

  let joinedChallenges: string[] = [];

  let departments: Department[] = [
    {
      id: "dept-1",
      name: "Renewable Energy Operations",
      manager: "Marcus Thorne",
      manager_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAslhUp31ltr2sYyaXyejdCWobSlGM4ABZ6a0rpfsFMCTmOHEQ9Wiq9-_6s8m_w7hRG6nAkmK8f1nGkREMnkI2gkEcuoYuufBSZmqHNycI12nXj6rqUU7VL-HPUA06O3shHZJfTo9ZtW39bddEnFPMri6O4qpg3SXwcZowHqYzZJCzVT0WdhL4YB_hapvD_4YLjiPFvFUXJ2z5q6nCQwZtgLDdfmcql6k2arh7txjuI89DoxsBsqyu5",
      staff_count: 142,
      status: "Active",
      icon: "energy_savings_leaf"
    },
    {
      id: "dept-2",
      name: "Water Stewardship",
      manager: "Elena Rodriguez",
      manager_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaxG-aFV2M1Yk5Lf4UJvoKD7IeDrwFCg4ALTooYo0YAo84UbA0RTApHPjO7RJR-VSjXXlZ69dcA0xFaRyFwhbCST0zT7DCYjBE1LPlWx0DvywegRYWofMQv1Ejle-YS4Nw8NaAR1CyoIGntbR0pxe8gWUHlIliDxMcmLuQLIjdllWPUGXuM69PKvoGWRQlIaRkDY5yg00LJlDZ4seygGHnPlftLpKFpb2cWVbRiHpS4ph8oLz1DMaC",
      staff_count: 88,
      status: "Active",
      icon: "water_drop"
    },
    {
      id: "dept-3",
      name: "Social Impact & Inclusion",
      manager: "Kenji Tanaka",
      manager_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC08OHFknUmvKCD-t6d23TKcTZLS_uStIMNkn4rbJA-9alorLPkKqEnU055ZuQ3wPZRY_hrC3xtX7Y4AGtRX3puTe6FDpIFt9rGtn4AB7iWpqsyZXm45Q5yL12LRUmF5aaRR8dPxqG6sSMvLQeheBReFls5FSt4sX_nAdT7iDIlYhLJnPYGrMV5KQiRVMH1aEHUHHJNgbcN-7kaL-cMjhcwcUOvwdL9RbLn9L8CUvIuOmQrz-iFwk72",
      staff_count: 56,
      status: "Active",
      icon: "diversity_3"
    },
    {
      id: "dept-4",
      name: "Policy Compliance",
      manager: "Sarah Jenkins",
      manager_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnGFrg2nuAW7rljFUb__BFoN0GKxmycpxgKYK2EZO80rZurcsRMFIImgnWC6H20cRhXC9eTDJ4DuOSUKPleCvPjSiBiDi51wG2BR1nHTa983QT8fSz0X1yfHR9QuUQXLDAZe4rP72I36wnHMw0xllHlQGp5d3aprccPMvSiASq_h5QriYGaxtGZe85FKFlpmEH8w7rujtXbTpUM5C9M3UDIEs8pZjF0On_zYY_hSGYa0Pv86deyKEQ",
      staff_count: 31,
      status: "Maintenance",
      icon: "history_edu"
    }
  ];

  let csrActivities: CSRActivity[] = [
    {
      id: "csr-1",
      name: "Tree Plantation",
      category: "Urban Greening Initiative",
      participants_count: 14,
      joined: false,
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1Nep5zoU1wmeTGYywHjxyrLvvewYre6Ey7HgGkOlWCS4JTM19KS-OUbRwQSmKTbCXZozWBErtQnUSPrGxFFo8qOGftEx-SrBr1VsWTS6m2CYWKouvjcYZNEp4JegxZCB1DXVLnlqTIMrxGjPz0uxSVFfw2bdRFhQs7RIL1-vsW8kjYjmGqHDHocJn7zNA5uaDrSpWeKjZzZ1NGMvxKagRWTqfEUtlmh7K9G2m0md8TPlUksm7XV0w",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDikO2a5O-qwdj_KaH7ANdTeOmrRMubQIAw-oay-aTcYAlGaVywjMcsfyS5MqXb1b2AcE2_IFUWQtE2pfDanfTs7Kl4ecmZrY8zrLITkXa0pMUZ5HivC5H-kHNWf-kVEqOjoF-Ltz0bf5_3E5pXsPywLrkupPw-Duq9NU7H_asXs1TwTe422uQSevKD2Y2ordSCK-qXLVli9bm9J47_RJEdxRCgE6uNixeatxShcI2K43wcs0MVs04A"
      ]
    },
    {
      id: "csr-2",
      name: "Blood Donation",
      category: "City Hospital Drive",
      participants_count: 6,
      joined: false,
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDBObSDOxYN6jKK7E41-CS8HiyawUGO09UwezNcmpPkOhyIvyBCjsdUBw5ZD9LVH8Ce6y-SizcfONQ1VLhJ03hJ-H_ns8MwPS_VIwJCroiqB88GIVOjLEPVk_sZQml6qkIxir9OATJfgqnvnEpwMBFAQZTu2A4sFQv0-NLxBGgBA5c2m92XIvv21nt8rziR82OSWGBaxaSbAP_eRpTMSiGSwwMaRrJe8NPQym7WcJ0032TNzll9q--M"
      ]
    },
    {
      id: "csr-3",
      name: "Beach Cleanup",
      category: "Coastal Preservation",
      participants_count: 45,
      joined: false,
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDkCmmWFDZXgCGTwCaPVM3sXCowjAUpoBd1t4u5aNf1EgQFoe9u3A1GPST7CGtqmc4dSuXkBct-eBAUWdBWdUSwkE3MbFDIrynl_-6ldGWsCANA4Hhv3vmrERv9-iD7Hl92P1LlySbhjxiTvYJzrNUld7pwdG9Fr3Ieb7EEghHZ_k9spLSxdEmBIDig3A0Qvtm2Qnv2foNhDdOzWWW8eMSie-NUeJLhOR-_QNjiREIvEu2X_5xPSBlW",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDah1KoH7NTY-rgweIw3Vx2d5amVky3gzh5psP_yVlKF0MJ9Q_n2NjguJLxr7SUJxbfsNZKtmCj0D7AApkeyKzMXoHn6MnNaypacKVjvjtK3QsjgBCaBkdBdizpgbrrlSZg2nzQ-7mMGb0EV9zTPuVYhvXMsPXDsHRUTBMiFDjPw06bmxZlYufegvFJ5x0KXGy6L2baIYSyJzEBSjbllq4UPwm9NWQyjy-JEiC2wjjGuN1FjSxZUJ53",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBXxe_x7uXVI-0cJ9dtv0_lHm0_6uVH4bulw-1e4dcrfy74hL2Pd1sXs_pIjO_DYLbT_4k98rN5bSVnVpxQfHZ-9hJp0uiotvB-Jjgc49oq1wIM9Vf65Givhp6nZctsipJM_qm-1MvVtwZYpfMZpL2hYwPpkbs9dhkOPAwVPmEoC7RaJVr-qt_LVN3qoXtBmvt1lqWYohqnWfsrPD5pkbwK9gE01D1scvjeZDQBL9RDVtRv7j1qzRTh"
      ]
    },
    {
      id: "csr-4",
      name: "ESG Workshop",
      category: "Internal Education",
      participants_count: 0,
      joined: false,
      avatars: []
    }
  ];

  let approvalQueue: ApprovalRequest[] = [
    {
      id: "appr-1",
      employee_name: "Elena Rostova",
      employee_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCY3T_inOBlniPKolV7v0uM318SbMbILo6UD-c8li5MBTaI5bSrHX08mj_VtvqTQ1E9To7_Jd_T3Ie3IX0j7U6NQlCqIIn2CAkD4lREQkpj-5EQxW-kboVBAF9o7iZCoykW6YaPzywIm_D5RsD-0NTf5wJk1yeJkY4iXy0Fd2oe3_DNGXSpne5pNp00hRGTEq1KepiTftM1Ix-TK6YiSIvbPxpqmoYQIbX8fPY6uvZrNA9t3C7hOp4I",
      activity_name: "Tree Plantation",
      hours: 4.0,
      status: "Pending"
    },
    {
      id: "appr-2",
      employee_name: "Marcus Chen",
      employee_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlqEQVkPBIZDs0czrmWIL2hpwRGPZX8CxTJgJ0Nl36cAjdeFhJ9mW3rpc-_qWOqQFIE060RsDW_yNLAi8oxo2hIIKBbZF3ieG5yuibOHMvAZtyP9UMMQC1IGxjdhuIcpWnavMq8_hLcCWRP7HOElrlHqTmHvjj4bK7bVQAuj8MuKDj3MvA-vw-8g3csGQGG_hIIU0wJmL5Tm3N6lrZ-30TRUB9WYpFiUfQU-tseyzDjC-vUJy9wYNx",
      activity_name: "Beach Cleanup",
      hours: 6.5,
      status: "Pending"
    },
    {
      id: "appr-3",
      employee_name: "Aisha Patel",
      employee_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAphAt17hk4X9tSfv8y0Fvcw3OUB96GmLdyoy1T2nyKdJ5XVxqjGaNvSyhdUguu0ytHSCFdkaEJxXrPbW2NhR-YuGptvOHaGSnPe_RHU7WGOrVvyIP9DEuPuv2hhiHhoJZSmv0eoAEZO5FiEk5IjFgjX5appD0JoJ0k7L8OhCLS7iv5sLrd_0InYJLv1e2fgkVQP14VNw-JIyyq5o7qAepBmQw2mwoICGnDiomVOuDp6m9pk0tmiCsF",
      activity_name: "Blood Donation",
      hours: 2.0,
      status: "Pending"
    }
  ];

  let reports: ReportTemplate[] = [
    {
      id: "rep-1",
      name: "Environmental",
      description: "Carbon footprint, energy efficiency, and waste management metrics for Q3.",
      status: "Ready",
      category: "Environmental",
      progress: 0
    },
    {
      id: "rep-2",
      name: "Social",
      description: "Diversity, workforce safety, and community impact benchmarks.",
      status: "Updated",
      category: "Social",
      progress: 0
    },
    {
      id: "rep-3",
      name: "Governance",
      description: "Board composition, ethical compliance, and risk mitigation data.",
      status: "Review",
      category: "Governance",
      progress: 0
    },
    {
      id: "rep-4",
      name: "ESG Summary",
      description: "Holistic overview of all pillars with year-over-year growth charts.",
      status: "Master",
      category: "ESG Summary",
      progress: 0
    }
  ];

  let dashboardMetrics: DashboardMetrics = {
    overall_score: 81,
    emissions_trend: [
      { month: "Jun", emissions: 14200 },
      { month: "Jul", emissions: 13900 },
      { month: "Aug", emissions: 14100 },
      { month: "Sep", emissions: 13500 },
      { month: "Oct", emissions: 12900 },
      { month: "Nov", emissions: 12450 }
    ],
    top_departments: [
      { name: "Operations", score: 92 },
      { name: "Logistics", score: 78 },
      { name: "Corporate", score: 64 },
      { name: "Facilities", score: 45 }
    ],
    csr_allocation: [
      { category: "Community Outreach", value: 45, color: "#cba6f7" },
      { category: "Reforestation", value: 35, color: "#74c7ec" },
      { category: "Clean Energy Ed.", value: 20, color: "#fab387" }
    ],
    total_csr_usd: 2400000
  };

  // JWT/Auth Mock Middleware
  const checkAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Simulate validation
      next();
    } else {
      // If none provided, we log it and proceed for this container prototype to ensure no breaking blockers
      console.log(`[API Auth] Note: Request to ${req.path} completed without JWT. Injected automatic credentials.`);
      next();
    }
  };

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Environmental API (environmental.py)
  app.get("/api/environmental/goals", checkAuth, (req, res) => {
    res.json(environmentalGoals);
  });

  app.post("/api/environmental/goals", checkAuth, (req, res) => {
    const { name, department, target_co2, current_co2, deadline, status } = req.body;
    const newGoal: EnvironmentalGoal = {
      id: `env-${Date.now()}`,
      name: name || "New Eco Goal",
      department: department || "Facilities",
      target_co2: Number(target_co2) || 100,
      current_co2: Number(current_co2) || 0,
      deadline: deadline || "Q4 2024",
      status: status || "Active"
    };
    environmentalGoals.unshift(newGoal);
    res.status(201).json(newGoal);
  });

  app.delete("/api/environmental/goals/:id", checkAuth, (req, res) => {
    const { id } = req.params;
    environmentalGoals = environmentalGoals.filter(g => g.id !== id);
    res.json({ success: true, id });
  });

  // Gamification API (gamification.py)
  app.get("/api/gamification/challenges", checkAuth, (req, res) => {
    const enriched = challenges.map(c => ({
      ...c,
      joined: joinedChallenges.includes(c.id)
    }));
    res.json(enriched);
  });

  app.post("/api/gamification/challenges/:id/join", checkAuth, (req, res) => {
    const { id } = req.params;
    if (!joinedChallenges.includes(id)) {
      joinedChallenges.push(id);
    }
    res.json({ success: true, id, joined: true });
  });

  // Governance / Settings API (governance.py / settings.py)
  app.get("/api/governance/departments", checkAuth, (req, res) => {
    res.json(departments);
  });

  app.post("/api/governance/departments", checkAuth, (req, res) => {
    const { name, manager, staff_count, status, icon } = req.body;
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: name || "New Department",
      manager: manager || "Aakhil",
      manager_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPW7UC5Cv0EYZ_FlfjAzklxdIRH0LaSfcYwrFf9yuQGDB1083yciI2REVx4jXfP48QWtpXm5EARORXtnzPtjmuUdKJQA3iF_bU85C2lcCZ_fLCrwC7PRdBamdH1bNbn8waPjr_lkBUC-AejYTFaKZE24Re8Z54G9E585ozncUnr2OFKYQ5g75jsve51c_yO3ATsbZn9yNcqm1Qyneiuqb86-EA9DMKcKz3YdHMXrYjsdfCRhH2nHnb",
      staff_count: Number(staff_count) || 12,
      status: status || "Active",
      icon: icon || "corporate_fare"
    };
    departments.push(newDept);
    res.status(201).json(newDept);
  });

  // Social API (social.py)
  app.get("/api/social/activities", checkAuth, (req, res) => {
    res.json(csrActivities);
  });

  app.post("/api/social/activities/:id/join", checkAuth, (req, res) => {
    const { id } = req.params;
    const act = csrActivities.find(a => a.id === id);
    if (act) {
      if (!act.joined) {
        act.joined = true;
        act.participants_count += 1;
        // Add current user avatar mock
        act.avatars.push("https://lh3.googleusercontent.com/aida-public/AB6AXuCFbCeK7HoHVVPKZiXiBCiQRcErkpr00GYG9glBew8oS1tbudCC6uGNFVRkBkpFoGA49T5V8-_dhGn5wrYguXtY-2jseJwxJ2ZpXnJYNHOh_ANnUtN_aNiZ_NHXBonlQh9V0JVElCNeAXCUFi4Nu_R6inPFBpw1uLoLtRVt7UFJDNYidHI2dqiVrnwqSBnoB4_gDhKRicrMbBz2wII7eYczt1tkmPY3mem0FnLAhk8BfucVDAKmPKuv");
      }
      res.json(act);
    } else {
      res.status(404).json({ error: "Activity not found" });
    }
  });

  app.get("/api/social/approvals", checkAuth, (req, res) => {
    res.json(approvalQueue);
  });

  app.post("/api/social/approvals/:id/action", checkAuth, (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // "Approved" or "Rejected"
    const request = approvalQueue.find(a => a.id === id);
    if (request) {
      request.status = action === "Approved" ? "Approved" : "Rejected";
      // We can remove it or keep it with updated status. Let's keep it with status updated or filter out.
      // Let's keep it updated so the frontend can display the state transitions.
      res.json(request);
    } else {
      res.status(404).json({ error: "Request not found" });
    }
  });

  // Reports API (reports.py)
  app.get("/api/reports/templates", checkAuth, (req, res) => {
    res.json(reports);
  });

  app.post("/api/reports/custom", checkAuth, (req, res) => {
    const { date_range, departments, modules_included } = req.body;
    res.json({
      success: true,
      message: "Custom report builder execution started successfully.",
      config: { date_range, departments, modules_included },
      complexity: "Low",
      estimated_time: "12 Seconds",
      started_at: new Date().toISOString()
    });
  });

  // Dashboard API
  app.get("/api/dashboard/metrics", checkAuth, (req, res) => {
    res.json(dashboardMetrics);
  });

  app.post("/api/dashboard/log-carbon", checkAuth, (req, res) => {
    const { amount } = req.body;
    const carbonAmount = Number(amount) || 120;
    // Add to emissions trend last month
    if (dashboardMetrics.emissions_trend.length > 0) {
      dashboardMetrics.emissions_trend[dashboardMetrics.emissions_trend.length - 1].emissions += carbonAmount;
    }
    // Boost overall score slightly for logging carbon
    if (dashboardMetrics.overall_score < 100) {
      dashboardMetrics.overall_score += 1;
    }
    res.json({ success: true, score: dashboardMetrics.overall_score, emissions: dashboardMetrics.emissions_trend });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
