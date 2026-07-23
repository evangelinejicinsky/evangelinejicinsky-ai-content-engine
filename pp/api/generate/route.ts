import { NextRequest, NextResponse } from "next/server";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  intent: string;
  wordCount: number;
  keywords: string[];
  excerpt: string;
  fullText: string;
}

export async function POST(request: NextRequest) {
  try {
    const { topic, mode } = await request.json();
    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }
    const content = generateMockContent(topic, mode);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}

function generateMockContent(topic: string, mode: string): ContentItem[] {
  const base = topic.replace(/\b\w/g, (l) => l.toUpperCase());
  
  if (mode === "seo") {
    return Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      title: i === 0 ? `The Complete Guide to ${base} in 2026` : i === 1 ? `10 ${base} Strategies That Actually Work` : i === 2 ? `${base} vs Traditional Methods` : i === 3 ? `How to Start ${base} With Zero Budget` : i === 4 ? `The Biggest ${base} Mistakes` : i === 5 ? `${base} Tools: The Only 5 You Need` : i === 6 ? `Case Study: 10x Results With ${base}` : i === 7 ? `${base} Trends to Watch in 2026` : i === 8 ? `How Long Does ${base} Take to Work?` : `${base} Checklist: 30-Day Action Plan`,
      type: ["Pillar Page", "Listicle", "Comparison", "Tutorial", "Warning", "Tool Roundup", "Case Study", "Trend Report", "FAQ", "Checklist"][i],
      intent: ["Informational", "Commercial", "Commercial", "Informational", "Informational", "Commercial", "Commercial", "Informational", "Informational", "Transactional"][i],
      wordCount: [2500, 1800, 1500, 1200, 1400, 1600, 2000, 1300, 1100, 1000][i],
      keywords: [`${base}`, `${base.toLowerCase()} guide`, `best ${base.toLowerCase()}`, `${base.toLowerCase()} tips`],
      excerpt: `Expert content about ${base} - optimized for SEO and reader engagement.`,
      fullText: `# ${["The Complete Guide", "10 Strategies", "vs Traditional", "Zero Budget Start", "Biggest Mistakes", "Top 5 Tools", "Success Case Study", "2026 Trends", "Timeline Guide", "30-Day Checklist"][i]} for ${base}\n\n## Introduction\n${base} is transforming the industry in 2026.\n\n## Key Points\n1. Research and planning\n2. Implementation\n3. Optimization\n\n## Conclusion\nStart your ${base} journey today.`,
    }));
  }
  
  if (mode === "social") {
    return ["LinkedIn", "Twitter/X", "Instagram", "TikTok", "Facebook", "LinkedIn"].map((platform, i) => ({
      id: String(i + 1),
      title: `${platform} Post: ${base}`,
      type: platform,
      intent: "Engagement",
      wordCount: 80,
      keywords: [base.toLowerCase(), platform.toLowerCase()],
      excerpt: `Hook + value + CTA for ${platform}.`,
      fullText: `🚀 ${base} is changing everything!\n\nHere's what nobody's talking about:\n\n[Value for ${platform}]\n\nDrop a 🔥 if you agree.\n\n#${base.replace(/\s/g, "")} #Trending2026`,
    }));
  }
  
  return ["Welcome", "Mistake", "Case Study", "Toolkit", "Last Chance", "Update", "Final Reminder"].map((subj, i) => ({
    id: String(i + 1),
    title: `Email ${i + 1}: ${subj} - ${base}`,
    type: "Email",
    intent: i < 3 ? "Nurture" : i < 5 ? "Conversion" : "Urgency",
    wordCount: 300,
    keywords: [base.toLowerCase(), "email"],
    excerpt: `Subject: ${subj} about ${base}`,
    fullText: `Subject: ${subj} - ${base}\n\nHi [First Name],\n\n[Content about ${base}]\n\n[CTA]\n\nBest,\n[Your Name]`,
  }));
}
