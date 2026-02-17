import { db } from "./src/lib/db";

async function seed() {
  console.log("Seeding database...");

  // Create categories
  const categories = [
    {
      name: "Moving to Oman",
      slug: "moving-to-oman",
      description: "Visa, residency, work permits & immigration",
      icon: "Home",
      color: "#C41E3A",
      order: 1,
    },
    {
      name: "Employment & Business",
      slug: "employment-business",
      description: "Jobs, business setup & networking",
      icon: "Briefcase",
      color: "#228B22",
      order: 2,
    },
    {
      name: "Housing & Real Estate",
      slug: "housing-real-estate",
      description: "Apartments, villas & property listings",
      icon: "Building",
      color: "#1E90FF",
      order: 3,
    },
    {
      name: "Transport & Driving",
      slug: "transport-driving",
      description: "Driving licenses, cars & public transport",
      icon: "Car",
      color: "#FFB800",
      order: 4,
    },
    {
      name: "Medical & Health",
      slug: "medical-health",
      description: "Hospitals, clinics & insurance providers",
      icon: "Heart",
      color: "#FF69B4",
      order: 5,
    },
    {
      name: "Family & Lifestyle",
      slug: "family-lifestyle",
      description: "Schools, activities & community events",
      icon: "Users",
      color: "#8A2BE2",
      order: 6,
    },
    {
      name: "Shopping & Services",
      slug: "shopping-services",
      description: "Supermarkets, furniture & domestic help",
      icon: "ShoppingCart",
      color: "#FF8C00",
      order: 7,
    },
    {
      name: "Classifieds",
      slug: "classifieds",
      description: "Buy, sell, jobs & services",
      icon: "Tag",
      color: "#20B2AA",
      order: 8,
    },
    {
      name: "News & Updates",
      slug: "news-updates",
      description: "Government updates & community alerts",
      icon: "Newspaper",
      color: "#4682B4",
      order: 9,
    },
    {
      name: "General Discussion",
      slug: "general-discussion",
      description: "Introductions, advice & off-topic",
      icon: "MessageSquare",
      color: "#708090",
      order: 10,
    },
    {
      name: "Guides & Knowledge Base",
      slug: "guides-knowledge-base",
      description: "Cost of living, banking & relocation guides",
      icon: "BookOpen",
      color: "#2F4F4F",
      order: 11,
    },
  ];

  for (const category of categories) {
    await db.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  console.log("Created categories");

  // Create subcategories
  const subcategories = [
    { name: "Visa & Residency", slug: "visa-residency", parentIdSlug: "moving-to-oman" },
    { name: "Work Permits", slug: "work-permits", parentIdSlug: "moving-to-oman" },
    { name: "Family Sponsorship", slug: "family-sponsorship", parentIdSlug: "moving-to-oman" },
    { name: "PRO Services", slug: "pro-services", parentIdSlug: "moving-to-oman" },
    { name: "Immigration Updates", slug: "immigration-updates", parentIdSlug: "moving-to-oman" },
    
    { name: "Job Board", slug: "job-board", parentIdSlug: "employment-business" },
    { name: "CV Posting", slug: "cv-posting", parentIdSlug: "employment-business" },
    { name: "Business Setup", slug: "business-setup", parentIdSlug: "employment-business" },
    { name: "Free Zones", slug: "free-zones", parentIdSlug: "employment-business" },
    
    { name: "Apartments for Rent", slug: "apartments-rent", parentIdSlug: "housing-real-estate" },
    { name: "Villas for Rent", slug: "villas-rent", parentIdSlug: "housing-real-estate" },
    { name: "Property Sales", slug: "property-sales", parentIdSlug: "housing-real-estate" },
    
    { name: "Hospitals", slug: "hospitals", parentIdSlug: "medical-health" },
    { name: "Clinics", slug: "clinics", parentIdSlug: "medical-health" },
    { name: "Insurance", slug: "insurance", parentIdSlug: "medical-health" },
    
    { name: "Schools & Nurseries", slug: "schools-nurseries", parentIdSlug: "family-lifestyle" },
    { name: "Universities", slug: "universities", parentIdSlug: "family-lifestyle" },
    { name: "Sports & Activities", slug: "sports-activities", parentIdSlug: "family-lifestyle" },
  ];

  for (const sub of subcategories) {
    const parent = await db.category.findUnique({
      where: { slug: sub.parentIdSlug },
    });
    
    if (parent) {
      await db.category.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, parentId: parent.id },
        create: { name: sub.name, slug: sub.slug, parentId: parent.id },
      });
    }
  }

  console.log("Created subcategories");

  // Create some articles for guides
  const articles = [
    {
      title: "Complete Relocation Checklist",
      slug: "relocation-checklist",
      content: `# Complete Relocation Checklist for Moving to Oman

## Before You Move

### Documentation
- [ ] Valid passport (6+ months validity)
- [ ] Employment contract
- [ ] Educational certificates (attested)
- [ ] Medical fitness certificate
- [ ] Police clearance certificate
- [ ] Marriage certificate (if applicable)
- [ ] Children's birth certificates

### Financial Preparation
- [ ] Open a bank account
- [ ] Arrange international money transfer
- [ ] Research cost of living
- [ ] Budget for initial expenses

## Upon Arrival

### First Week
- [ ] Complete visa processing
- [ ] Get medical check-up
- [ ] Apply for resident card
- [ ] Open local bank account
- [ ] Get local SIM card

### First Month
- [ ] Find accommodation
- [ ] Register with embassy
- [ ] Get driving license (if applicable)
- [ ] Find schools for children
- [ ] Explore your neighborhood`,
      excerpt: "Everything you need to know before moving to Oman, with a comprehensive checklist.",
      category: "visa",
      author: "Oman Expat Team",
      tags: '["relocation", "checklist", "moving"]',
      isFeatured: true,
    },
    {
      title: "Banking in Oman Guide",
      slug: "banking-guide",
      content: `# Banking in Oman: Complete Guide for Expats

## Opening a Bank Account

### Required Documents
- Passport with valid visa
- Resident card (for residents)
- Proof of address
- Letter from employer
- Passport-size photographs

## Major Banks in Oman

### Local Banks
- Bank Muscat
- National Bank of Oman
- Oman Arab Bank
- Bank Dhofar

### International Banks
- HSBC Oman
- Standard Chartered
- Bank of Beirut

## Banking Services
- Current accounts
- Savings accounts
- Credit cards
- Loans
- Online banking`,
      excerpt: "Opening accounts, transfers, and financial services for expats in Oman.",
      category: "banking",
      author: "Oman Expat Team",
      tags: '["banking", "finance", "money"]',
    },
    {
      title: "Healthcare System Overview",
      slug: "healthcare-overview",
      content: `# Healthcare System in Oman

## Public Healthcare
Oman's public healthcare system provides quality care at subsidized rates for citizens. Expats may access public facilities but typically use private healthcare.

## Private Healthcare
Most expats prefer private healthcare for faster service and English-speaking staff.

### Major Private Hospitals
- Royal Hospital
- Muscat Private Hospital
- KIMS Oman Hospital
- Aster Al Raffah Hospital

## Health Insurance
Health insurance is mandatory for all expats in Oman. Your employer must provide coverage.`,
      excerpt: "Public and private healthcare options explained for expats.",
      category: "medical",
      author: "Oman Expat Team",
      tags: '["healthcare", "hospitals", "insurance"]',
      isFeatured: true,
    },
  ];

  for (const article of articles) {
    await db.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  console.log("Created articles");

  // Create settings
  const settings = [
    { key: "site_name", value: "Oman Expat" },
    { key: "site_description", value: "Your trusted community for expatriates living in or relocating to Oman" },
    { key: "contact_email", value: "info@omanexpat.com" },
    { key: "posts_per_page", value: "20" },
    { key: "require_email_verification", value: "true" },
    { key: "moderation_enabled", value: "true" },
  ];

  for (const setting of settings) {
    await db.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  console.log("Created settings");
  console.log("Seed completed!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
