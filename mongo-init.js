// mongo-init.js
// Translated from seed_database.py

print("🌱 Starting database seeding...");
db = db.getSiblingDB('shield_foundation');

// --- Create necessary collections ---
db.createCollection('impact_stats');
db.createCollection('success_stories');
db.createCollection('gallery_items');
db.createCollection('leadership_team');
db.createCollection('site_settings');
db.createCollection('news');
db.createCollection('detailed_page_sections');
db.createCollection('admin_users');
db.createCollection('contacts');
db.createCollection('volunteers');
db.createCollection('newsletters');


// --- Seed Impact Statistics ---
print("📊 Seeding impact statistics...");
db.impact_stats.deleteMany({});
db.impact_stats.insertOne({
    "youthTrained": 1470,
    "youthPlaced": 1090,
    "seniorsSupported": 7000,
    "womenEmpowered": 300,
    "updated_at": new Date()
});

// --- Seed Success Stories ---
print("🌟 Seeding success stories...");
db.success_stories.deleteMany({});
db.success_stories.insertMany([
    {
        "name": "Priya Sharma",
        "story": "After completing our digital marketing training program, I secured a position at a growing startup in Mumbai. The skills I learned here changed my life and gave me confidence to pursue my career goals.",
        "achievement": "Digital Marketing Professional",
        "program": "Youth Skilling Program",
        "location": "Mumbai, Maharashtra",
        "image": "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400",
        "is_active": true,
        "created_at": new Date()
    },
    {
        "name": "Rajesh Kumar",
        "story": "The entrepreneurship program helped me start my own small business in electronics repair. Now I employ two other youth from my community and we're expanding every month.",
        "achievement": "Small Business Owner",
        "program": "Entrepreneurship Development",
        "location": "Dharavi, Mumbai",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        "is_active": true,
        "created_at": new Date()
    },
    {
        "name": "Anita Devi",
        "story": "Through the senior care program, I regained my health and confidence. The regular checkups and physiotherapy sessions have greatly improved my quality of life.",
        "achievement": "Health Recovery",
        "program": "Senior Citizen Care",
        "location": "Mumbai, Maharashtra",
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        "is_active": true,
        "created_at": new Date()
    }
]);

// --- Seed Gallery Items ---
print("🖼️ Seeding gallery items...");
db.gallery_items.deleteMany({});
db.gallery_items.insertMany([
    {
        "title": "Youth Training Session",
        "description": "Students participating in digital skills training program",
        "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        "category": "Training",
        "date": "2024-01-15",
        "type": "image",
        "order": 1,
        "is_active": true,
        "created_at": new Date()
    },
    {
        "title": "Senior Citizen Health Camp",
        "description": "Medical checkup and physiotherapy session for elderly community members",
        "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
        "category": "Healthcare",
        "date": "2024-01-20",
        "type": "image",
        "order": 2,
        "is_active": true,
        "created_at": new Date()
    },
    {
        "title": "Community Workshop",
        "description": "Interactive workshop on entrepreneurship and business skills",
        "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        "category": "Workshop",
        "date": "2024-01-25",
        "type": "image",
        "order": 3,
        "is_active": true,
        "created_at": new Date()
    },
    {
        "title": "Graduation Ceremony",
        "description": "Proud graduates receiving certificates after successful program completion",
        "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        "category": "Events",
        "date": "2024-02-01",
        "type": "image",
        "order": 4,
        "is_active": true,
        "created_at": new Date()
    }
]);

// --- Seed Leadership Team ---
print("👥 Seeding leadership team...");
db.leadership_team.deleteMany({});
db.leadership_team.insertMany([
    {
        "name": "Mrs. Swati Ingole",
        "role": "Founder & Director",
        "description": "Passionate social entrepreneur with over 15 years of experience in community development and youth empowerment. Founded Shield Foundation to bridge the gap between education and employment.",
        "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
        "order": 1,
        "is_active": true,
        "created_at": new Date()
    },
    {
        "name": "Rajesh Patel",
        "role": "Program Manager",
        "description": "Experienced program manager specializing in skill development and livelihood programs. Oversees training curriculum and placement activities.",
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        "order": 2,
        "is_active": true,
        "created_at": new Date()
    },
    {
        "name": "Dr. Meera Joshi",
        "role": "Healthcare Coordinator",
        "description": "Medical professional coordinating senior citizen care programs. Ensures quality healthcare delivery and community health initiatives.",
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        "order": 3,
        "is_active": true,
        "created_at": new Date()
    }
]);

// --- Seed Site Settings ---
print("⚙️ Seeding site settings...");
db.site_settings.deleteMany({});
db.site_settings.insertOne({
    "logo_url": null,
    "favicon_url": null,
    "site_title": "Shield Foundation",
    "site_description": "Adding Life to Years",
    "primary_color": "#2563eb",
    "secondary_color": "#eab308",
    "accent_color": "#ffffff",
    "facebook_url": null,
    "instagram_url": null,
    "youtube_url": null,
    "twitter_url": null,
    "linkedin_url": null,
    "updated_at": new Date(),
    "updated_by": "system"
});

// --- Seed News/Blog Posts ---
print("📰 Seeding blog posts...");
db.news.deleteMany({});
db.news.insertMany([
    {
        "title": "Youth Empowerment Through Skill Development",
        "content": "Our comprehensive youth training program continues to create pathways to employment for young people in Mumbai's underserved communities. Through partnerships and innovative curriculum, we're bridging the skills gap.",
        "excerpt": "Learn how our youth training programs are creating employment opportunities and transforming lives in Mumbai's communities.",
        "author": "Shield Foundation Team",
        "category": "Youth Development",
        "tags": ["youth", "training", "employment"],
        "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        "status": "published",
        "created_at": new Date(),
        "published_at": new Date()
    },
    {
        "title": "Senior Citizen Care: A Holistic Approach",
        "content": "Our senior citizen care program provides comprehensive healthcare and social support services. From regular health checkups to community engagement activities, we ensure our elderly community members live with dignity.",
        "excerpt": "Discover how our holistic approach to senior care is improving the quality of life for elderly community members.",
        "author": "Dr. Meera Joshi",
        "category": "Healthcare",
        "tags": ["seniors", "healthcare", "community"],
        "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
        "status": "published",
        "created_at": new Date(),
        "published_at": new Date()
    }
]);

// --- Seed Page Sections ---
print("📄 Seeding page sections...");
db.detailed_page_sections.deleteMany({});
const all_sections = [
    {
        "page": "about",
        "section": "journey",
        "title": "Our Journey",
        "content": {
            "text": "Since 2018, Shield Foundation has been dedicated to creating sustainable change in Mumbai's underserved communities. Our journey began with a simple mission: to add life to years and create meaningful opportunities for all.",
            "items": [
                {"title": "2018 - Foundation Established", "description": "Shield Foundation founded by Mrs. Swati Ingole with the mission to serve vulnerable communities."},
                {"title": "2019 - First Training Center", "description": "Launched our first youth training center focusing on digital skills and employability."},
                {"title": "2020 - Senior Care Program", "description": "Started comprehensive senior citizen services in Dharavi with medical and social support."},
                {"title": "2021 - 1000 Youth Milestone", "description": "Achieved the milestone of training and placing 1000+ youth in meaningful employment."},
                {"title": "2024 - Expansion Planning", "description": "Initiated expansion plans to serve more communities across Maharashtra."}
            ]
        },
        "order": 1,
        "is_active": true,
        "created_at": new Date(),
        "updated_at": new Date()
    },
    {
        "page": "about",
        "section": "partners",
        "title": "Our Partners",
        "content": {
            "text": "We collaborate with leading organizations to maximize our impact and reach more communities in need.",
            "items": [
                {"title": "Tech Mahindra Foundation", "description": "Strategic partnership for youth skilling and livelihood programs"},
                {"title": "ARCIL", "description": "Collaboration for physiotherapy and rehabilitation services"},
                {"title": "ONGC", "description": "Corporate partnership for community development initiatives"},
                {"title": "UNICEF/MDACS", "description": "Program support for child and youth welfare activities"}
            ]
        },
        "order": 2,
        "is_active": true,
        "created_at": new Date(),
        "updated_at": new Date()
    },
    {
        "page": "programs",
        "section": "youth_skilling",
        "title": "Youth Skilling & Livelihoods",
        "content": {
            "text": "Our flagship youth program provides comprehensive training that bridges the gap between education and employment for underserved youth in Mumbai's communities.",
            "image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
            "items": [
                {"title": "Multi-skilling Training", "description": "Training in various trades including digital marketing, computer literacy, and soft skills"},
                {"title": "Industry Alignment", "description": "Curriculum developed in partnership with industry experts to meet current job market demands"},
                {"title": "Job Placement Support", "description": "Comprehensive career guidance and placement assistance with partner organizations"},
                {"title": "Entrepreneurship Development", "description": "Support for youth interested in starting their own businesses and becoming job creators"}
            ]
        },
        "order": 1,
        "is_active": true,
        "created_at": new Date(),
        "updated_at": new Date()
    },
    {
        "page": "programs",
        "section": "senior_care",
        "title": "Senior Citizen Care",
        "content": {
            "text": "Comprehensive healthcare and social support services for senior citizens, ensuring they live with dignity and receive the care they deserve.",
            "image_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
            "items": [
                {"title": "Regular Health Checkups", "description": "Monthly medical consultations and health monitoring for early intervention"},
                {"title": "Physiotherapy Services", "description": "Professional physiotherapy sessions to improve mobility and reduce pain"},
                {"title": "Social Activities", "description": "Community engagement programs to combat isolation and promote mental wellbeing"},
                {"title": "Emergency Support", "description": "24/7 emergency assistance and coordination with healthcare providers"}
            ]
        },
        "order": 2,
        "is_active": true,
        "created_at": new Date(),
        "updated_at": new Date()
    },
    {
        "page": "impact",
        "section": "community_transformation",
        "title": "Community Transformation",
        "content": {
            "text": "Our programs create ripple effects of positive change that extend far beyond individual beneficiaries, transforming entire communities.",
            "items": [
                {"title": "Skills Development", "description": "Comprehensive training programs that equip youth with market-relevant skills"},
                {"title": "Healthcare Access", "description": "Improved healthcare access and quality of life for senior citizens"},
                {"title": "Economic Empowerment", "description": "Creating pathways to sustainable livelihoods and economic independence"},
                {"title": "Community Building", "description": "Strengthening social bonds and community support networks"}
            ]
        },
        "order": 1,
        "is_active": true,
        "created_at": new Date(),
        "updated_at": new Date()
    }
];
db.detailed_page_sections.insertMany(all_sections);

print("✅ Database seeding completed successfully!");