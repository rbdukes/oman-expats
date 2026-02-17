const { PrismaClient } = require('@prisma/client');
const { hash } = require('@node-rs/argon2');

const prisma = new PrismaClient();

async function initializeDatabase() {
  console.log('Checking database initialization...');

  try {
    // Check if already initialized
    const existingCategories = await prisma.category.count();
    
    if (existingCategories > 0) {
      console.log('Database already initialized');
      console.log(`Found ${existingCategories} categories`);
      return;
    }

    console.log('Initializing database with seed data...');

    // Create admin user
    const adminEmail = "admin@omanexpat.com";
    const adminPassword = "OmanExpat@2024!";
    const hashedPassword = await hash(adminPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        displayName: "Oman Expats Admin",
        role: "admin",
        status: "active",
        emailVerified: true,
        bio: "Welcome to Oman Expats! I'm here to help you navigate life in Oman.",
      },
    });
    console.log('Created admin user');

    // Create categories with subcategories
    const categoriesData = [
      {
        name: "Moving to Oman",
        slug: "moving-to-oman",
        description: "Visa, residency, work permits & immigration help",
        icon: "Plane",
        color: "#C41E3A",
        order: 1,
        subcategories: ["Visa & Residency", "Work Permits", "Family Sponsorship", "PRO Services", "Immigration Updates"],
        welcomeTitle: "Welcome to Moving to Oman! 🇴🇲",
        welcomeContent: `Hello and welcome to the Moving to Oman section!

Whether you're planning your move or have just arrived, this community is here to help you navigate the process of relocating to Oman.

**Important Guidelines:**
• Keep all discussions professional and respectful
• No shouting (using ALL CAPS) - it's considered rude
• Share accurate information and cite official sources when possible
• Be patient and helpful to newcomers

**Common Topics:**
- Visa types and requirements
- Residency permit processes
- Work permit applications
- Family visa sponsorship
- Document attestation

If you have questions, feel free to start a new thread. Our community members have a wealth of experience and are happy to help!

Stay professional, stay helpful! 🤝`
      },
      {
        name: "Employment & Business",
        slug: "employment-business",
        description: "Jobs, business setup & networking opportunities",
        icon: "Briefcase",
        color: "#228B22",
        order: 2,
        subcategories: ["Job Board", "CV Posting", "Business Setup", "Free Zones", "Networking Events"],
        welcomeTitle: "Welcome to Employment & Business! 💼",
        welcomeContent: `Welcome to the Employment & Business section!

This is your hub for career opportunities, business discussions, and professional networking in Oman.

**Community Guidelines:**
• Post job vacancies in the correct format
• No discrimination in job posts
• Keep discussions professional
• No spam or self-promotion without permission
• NO SHOUTING - maintain professional tone

**What you'll find here:**
- Job vacancies across industries
- Business setup guidance
- Free zone information
- Networking opportunities
- Career advice

**Job Posting Format:**
- Position title
- Company name
- Location
- Salary range (if applicable)
- Requirements
- How to apply

Good luck with your career or business endeavors! 🚀`
      },
      {
        name: "Housing & Real Estate",
        slug: "housing-real-estate",
        description: "Apartments, villas & property listings",
        icon: "Building2",
        color: "#1E90FF",
        order: 3,
        subcategories: ["Apartments for Rent", "Villas for Rent", "Property for Sale", "Roommate Finder"],
        welcomeTitle: "Welcome to Housing & Real Estate! 🏠",
        welcomeContent: `Welcome to the Housing & Real Estate section!

Find your perfect home in Oman or connect with others looking for accommodation.

**Posting Guidelines:**
• Include location, price, and contact info
• Post real photos (no misleading images)
• Update when property is no longer available
• Be honest about property conditions
• NO SHOUTING or aggressive language

**Recommended Post Format:**
- Location (area/city)
- Property type (apartment/villa)
- Number of bedrooms
- Monthly rent or sale price
- Amenities
- Contact details

**Tips for Renters:**
- Always view before paying
- Check the contract carefully
- Verify the landlord's ownership
- Understand the payment schedule

Happy house hunting! 🏡`
      },
      {
        name: "Transport & Driving",
        slug: "transport-driving",
        description: "Driving licenses, cars & public transport",
        icon: "Car",
        color: "#FFB800",
        order: 4,
        subcategories: ["Driving License", "Car Sales", "Car Rentals", "Public Transport"],
        welcomeTitle: "Welcome to Transport & Driving! 🚗",
        welcomeContent: `Welcome to the Transport & Driving section!

Everything you need to know about getting around in Oman.

**Topics Covered:**
- Obtaining an Omani driving license
- License conversion from other countries
- Buying and selling cars
- Car rentals and leasing
- Public transportation options

**Guidelines:**
• Share experiences, not legal advice
• Be respectful to all community members
• No shouting or aggressive behavior
• Keep discussions on-topic

**Useful Tips:**
- International licenses are valid for 3 months
- Check ROP website for official requirements
- Always test drive before purchasing
- Verify vehicle history before buying

Drive safely! 🛣️`
      },
      {
        name: "Medical & Health",
        slug: "medical-health",
        description: "Hospitals, clinics & insurance providers",
        icon: "Stethoscope",
        color: "#FF69B4",
        order: 5,
        subcategories: ["Hospitals", "Clinics", "Insurance Providers", "Pharmacies", "Emergency Services"],
        welcomeTitle: "Welcome to Medical & Health! 🏥",
        welcomeContent: `Welcome to the Medical & Health section!

Your guide to healthcare services in Oman.

**Important Notice:**
This forum is for sharing experiences and general information only. It is NOT a substitute for professional medical advice. Always consult a qualified healthcare provider for medical concerns.

**Community Guidelines:**
• Share honest reviews of healthcare providers
• Respect patient privacy
• No medical advice (only share experiences)
• Maintain professional tone
• NO SHOUTING

**Topics:**
- Hospital reviews and recommendations
- Health insurance discussions
- Pharmacy locations
- Emergency services information
- Specialist referrals

**Emergency Numbers:**
- Police: 9999
- Ambulance: 9999
- Fire: 9999

Stay healthy! 💊`
      },
      {
        name: "Family & Lifestyle",
        slug: "family-lifestyle",
        description: "Schools, activities & community events",
        icon: "Users",
        color: "#8A2BE2",
        order: 6,
        subcategories: ["Schools & Education", "Kids Activities", "Family Events", "Women's Community", "Pet Owners"],
        welcomeTitle: "Welcome to Family & Lifestyle! 👨‍👩‍👧‍👦",
        welcomeContent: `Welcome to the Family & Lifestyle section!

Connect with other families and discover activities for all ages in Oman.

**Topics:**
- Schools and education options
- Kids activities and classes
- Family-friendly places
- Women's groups and activities
- Pet owners community

**Guidelines:**
• Be family-friendly in all posts
• Respect diverse family structures
• Share constructive feedback about services
• No shouting or negative language
• Protect children's privacy in photos

**Popular Discussions:**
- School reviews and recommendations
- Best parks and beaches for families
- Birthday party venues
- After-school activities
- Family weekend ideas

Enjoy family life in Oman! 🎈`
      },
      {
        name: "Shopping & Services",
        slug: "shopping-services",
        description: "Supermarkets, furniture & domestic help",
        icon: "ShoppingCart",
        color: "#FF8C00",
        order: 7,
        subcategories: ["Supermarkets", "Furniture & Home", "Domestic Services", "Beauty & Wellness", "Electronics"],
        welcomeTitle: "Welcome to Shopping & Services! 🛒",
        welcomeContent: `Welcome to the Shopping & Services section!

Your guide to shopping and finding services in Oman.

**Topics:**
- Where to buy specific items
- Service provider recommendations
- Price comparisons
- Sales and promotions
- Business reviews

**Guidelines:**
• Share honest reviews
• No spam or promotional posts without approval
• Respect business owners and workers
• Professional language only
• NO SHOUTING in posts

**Posting Tips:**
- Include location and contact info
- Share your personal experience
- Be specific about what you're looking for
- Update when you find what you need

Happy shopping! 🛍️`
      },
      {
        name: "Classifieds",
        slug: "classifieds",
        description: "Buy, sell, jobs & services marketplace",
        icon: "Tag",
        color: "#20B2AA",
        order: 8,
        subcategories: ["Jobs Offered", "Jobs Wanted", "For Sale", "Services", "Free Items"],
        welcomeTitle: "Welcome to Classifieds! 📦",
        welcomeContent: `Welcome to the Classifieds section!

Buy, sell, and find services in our community marketplace.

**Posting Rules:**
• Include clear description and price
• Post real photos of items
• Mark items as SOLD when sold
• No illegal items or services
• No SHOUTING or aggressive selling

**Required Information:**
- Item/service description
- Price (or "Free")
- Location
- Contact method
- Photos (recommended)

**Safety Tips:**
- Meet in public places
- Verify before paying
- Check items thoroughly
- Use cash or safe payment methods
- Report suspicious activity

**Prohibited Items:**
- Illegal goods
- Counterfeit products
- Prescription medications
- Adult content

Trade safely! 💰`
      },
      {
        name: "News & Updates",
        slug: "news-updates",
        description: "Government updates & community alerts",
        icon: "Newspaper",
        color: "#4682B4",
        order: 9,
        subcategories: ["Government News", "Community Alerts", "Events Calendar", "Weather Updates", "Traffic Alerts"],
        welcomeTitle: "Welcome to News & Updates! 📰",
        welcomeContent: `Welcome to the News & Updates section!

Stay informed about what's happening in Oman.

**What You'll Find:**
- Government announcements
- Community news
- Event announcements
- Weather alerts
- Traffic updates

**Posting Guidelines:**
• Cite official sources when possible
• Verify information before sharing
• No rumors or unverified news
• Keep headlines clear and factual
• NO SHOUTING - use proper formatting

**News Categories:**
- Official government updates
- Community events
- Emergency alerts
- Weather warnings
- Road closures and traffic

**Remember:**
- Share from official sources
- Fact-check before posting
- Update outdated information
- Be respectful in discussions

Stay informed! 📱`
      },
      {
        name: "General Discussion",
        slug: "general-discussion",
        description: "Introductions, advice & off-topic chat",
        icon: "MessageSquare",
        color: "#708090",
        order: 10,
        subcategories: ["Introductions", "Ask the Community", "Off-Topic", "Suggestions & Feedback"],
        welcomeTitle: "Welcome to General Discussion! 💬",
        welcomeContent: `Welcome to the General Discussion section!

This is your space to connect, introduce yourself, and chat with the community.

**Introduce Yourself!**
Tell us about yourself:
- Where are you from?
- What brought you to Oman?
- What are your interests?
- How can the community help you?

**Guidelines:**
• Be welcoming to new members
• Keep discussions respectful
• No political or religious debates
• No spam or self-promotion
• NO SHOUTING - be polite!

**What to Post:**
- Introductions
- General questions about life in Oman
- Community suggestions
- Off-topic (but appropriate) discussions
- Meet-up proposals

**Topics to Avoid:**
- Politics
- Religion
- Controversial debates
- Personal attacks

Let's build a friendly community! 🤝`
      },
      {
        name: "Guides & Knowledge Base",
        slug: "guides-knowledge-base",
        description: "Cost of living, banking & relocation guides",
        icon: "BookOpen",
        color: "#2F4F4F",
        order: 11,
        subcategories: ["Cost of Living", "Banking & Finance", "Legal Guide", "Cultural Guide", "Travel Guide"],
        welcomeTitle: "Welcome to Guides & Knowledge Base! 📚",
        welcomeContent: `Welcome to the Guides & Knowledge Base section!

Comprehensive guides to help you navigate life in Oman.

**Topics Covered:**
- Cost of living breakdowns
- Banking and finance setup
- Legal procedures and requirements
- Omani culture and customs
- Travel and tourism guides

**Guidelines:**
• Share accurate, verified information
• Update guides when rules change
• Cite official sources when possible
• Keep formatting clean and readable
• NO SHOUTING - use proper formatting

**How to Contribute:**
1. Write comprehensive guides
2. Include step-by-step processes
3. Add links to official resources
4. Keep information current

**Guide Format:**
- Clear title
- Introduction
- Step-by-step instructions
- Tips and warnings
- Related resources

Knowledge is power! 🎓`
      },
    ];

    for (const catData of categoriesData) {
      // Create category
      const category = await prisma.category.create({
        data: {
          name: catData.name,
          slug: catData.slug,
          description: catData.description,
          icon: catData.icon,
          color: catData.color,
          order: catData.order,
        },
      });

      // Create subcategories
      for (let i = 0; i < catData.subcategories.length; i++) {
        const subName = catData.subcategories[i];
        await prisma.category.create({
          data: {
            name: subName,
            slug: `${catData.slug}-${subName.toLowerCase().replace(/\s+/g, '-')}`,
            parentId: category.id,
            order: i,
          },
        });
      }

      // Create welcome thread
      const welcomeThread = await prisma.thread.create({
        data: {
          title: catData.welcomeTitle,
          slug: `welcome-${catData.slug}-${Date.now()}`,
          content: catData.welcomeContent,
          authorId: admin.id,
          categoryId: category.id,
          isPinned: true,
          status: "published",
        },
      });

      console.log(`Created category: ${catData.name} with welcome thread`);
    }

    // Create sample threads for engagement
    const sampleThreads = [
      {
        title: "New to Oman? Start Here! 👋",
        content: `Hi everyone!

If you're new to Oman, welcome! This beautiful country has so much to offer expats from around the world.

**Quick Tips for Newcomers:**
1. Get your residence visa sorted first
2. Open a local bank account
3. Get a local SIM card (Omantel or Ooredoo)
4. Explore the souqs and malls
5. Try the local Omani cuisine!

Feel free to ask questions - our community is here to help!

**Remember:** Keep all discussions professional and respectful. No shouting (ALL CAPS) please!

Welcome to Oman! 🇴🇲`,
        categoryName: "moving-to-oman",
      },
      {
        title: "Best Restaurants in Muscat - Share Your Favorites! 🍽️",
        content: `Let's create a list of the best restaurants in Muscat!

I'll start:
- **Kargeen Caffe** - Great Omani/Arabic food with a nice atmosphere
- **The Restaurant at The Chedi** - Fine dining with beach views
- **Bait Al Luban** - Authentic Omani cuisine
- **Mumtaz Mahal** - Excellent Indian food

What are your favorites? Share below!

**Rules:**
- One recommendation per comment
- Include location
- Be specific about what's good
- Professional reviews only, no shouting!`,
        categoryName: "general-discussion",
      },
      {
        title: "Cost of Living in Oman - 2024 Update 💰",
        content: `Here's a breakdown of typical costs in Oman (updated for 2024):

**Housing (Monthly):**
- 1BR Apartment in Muscat: 200-350 OMR
- 2BR Apartment: 300-500 OMR
- 3BR Villa: 400-800 OMR

**Utilities (Monthly):**
- Electricity: 10-30 OMR
- Water: 3-8 OMR
- Internet: 15-25 OMR

**Groceries (Monthly for 1 person):**
- Basic shopping: 50-100 OMR

**Transportation:**
- Petrol: Very affordable (~0.2 OMR/liter)
- Used car: 2,000-10,000 OMR

**Education:**
- Private school fees vary widely (1,500-5,000 OMR/year)

Please add your experiences and updates below! Remember to keep posts professional - no shouting! 🤝`,
        categoryName: "guides-knowledge-base",
      },
    ];

    for (const threadData of sampleThreads) {
      const category = await prisma.category.findFirst({
        where: { slug: threadData.categoryName },
      });

      if (category) {
        await prisma.thread.create({
          data: {
            title: threadData.title,
            slug: threadData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
            content: threadData.content,
            authorId: admin.id,
            categoryId: category.id,
            isFeatured: true,
            status: "published",
          },
        });
        console.log(`Created sample thread: ${threadData.title}`);
      }
    }

    // Create site settings
    await prisma.setting.create({ data: { key: "site_name", value: "Oman Expats" } });
    await prisma.setting.create({ data: { key: "site_description", value: "Your trusted community for expatriates in Oman" } });
    await prisma.setting.create({ data: { key: "site_rules", value: "1. Be respectful 2. No shouting 3. No spam 4. Stay on topic 5. Help others" } });
    console.log('Created site settings');

    // Create announcement
    await prisma.announcement.create({
      data: {
        title: "Welcome to Oman Expats! 🎉",
        content: "Your trusted community for expatriates in Oman. Join discussions, find housing, jobs, and connect with fellow expats!",
        type: "info",
        isActive: true,
      },
    });
    console.log('Created announcement');

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();
