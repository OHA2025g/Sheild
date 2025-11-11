from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
import logging
from pathlib import Path
import asyncio
import uuid

# Import custom modules
from models import *
from auth import *
from database import db, init_database

ROOT_DIR = Path(__file__).parent

# Create the main app
app = FastAPI(title="Shield Foundation API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await init_database()

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Shield Foundation API is running", "status": "healthy"}

# PUBLIC ENDPOINTS

@api_router.post("/contact", response_model=MessageResponse)
async def submit_contact_form(contact_data: ContactCreate):
    """Submit a contact form"""
    try:
        contact = Contact(**contact_data.dict())
        await db.contacts.insert_one(contact.dict())
        logger.info(f"New contact form submitted: {contact.email}")
        return MessageResponse(message="Thank you for your message. We will get back to you soon!")
    except Exception as e:
        logger.error(f"Contact form submission failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

@api_router.post("/volunteer", response_model=MessageResponse)
async def submit_volunteer_form(volunteer_data: VolunteerCreate):
    """Submit a volunteer application"""
    try:
        volunteer = Volunteer(**volunteer_data.dict())
        await db.volunteers.insert_one(volunteer.dict())
        logger.info(f"New volunteer application: {volunteer.email}")
        return MessageResponse(message="Thank you for registering as a volunteer!")
    except Exception as e:
        logger.error(f"Volunteer application failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit volunteer application")

@api_router.post("/newsletter/subscribe", response_model=MessageResponse)
async def subscribe_newsletter(newsletter_data: NewsletterSubscribe):
    """Subscribe to newsletter"""
    try:
        # Check if email already exists
        existing = await db.newsletters.find_one({"email": newsletter_data.email})
        if existing:
            if existing.get("is_active"):
                return MessageResponse(message="You are already subscribed to our newsletter!")
            else:
                # Reactivate subscription
                await db.newsletters.update_one(
                    {"email": newsletter_data.email},
                    {"$set": {"is_active": True, "subscribed_at": datetime.utcnow()}}
                )
                return MessageResponse(message="Welcome back! Your newsletter subscription has been reactivated.")
        
        newsletter = Newsletter(**newsletter_data.dict())
        await db.newsletters.insert_one(newsletter.dict())
        logger.info(f"New newsletter subscription: {newsletter.email}")
        return MessageResponse(message="Successfully subscribed to newsletter!")
    except Exception as e:
        logger.error(f"Newsletter subscription failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to subscribe to newsletter")

@api_router.get("/news")
async def get_published_news():
    """Get all published news articles"""
    try:
        news_cursor = db.news.find({"status": "published"}).sort("created_at", -1)
        news_list = []
        async for news_item in news_cursor:
            news_list.append({
                "id": news_item.get("id", str(news_item["_id"])),
                "title": news_item["title"],
                "content": news_item["content"],
                "author": news_item.get("author", "Unknown"),
                "status": news_item["status"],
                "date": news_item.get("created_at").isoformat() if news_item.get("created_at") else None,
            })
        return news_list
    except Exception as e:
        logger.error(f"Failed to fetch news: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch news")

@api_router.get("/news/{news_id}")
async def get_news_by_id(news_id: str):
    """Get a single published news article by ID"""
    try:
        news_item = await db.news.find_one({"id": news_id})
        if not news_item:
            raise HTTPException(status_code=404, detail="News not found")

        return {
            "id": news_item.get("id", str(news_item["_id"])),
            "title": news_item["title"],
            "content": news_item["content"],
            "author": news_item.get("author", "Unknown"),
            "status": news_item["status"],
            "date": news_item["created_at"].isoformat() if news_item.get("created_at") else None,
        }
    except HTTPException:
        raise  # re-raise so FastAPI sends the correct response
    except Exception as e:
        logger.error(f"Failed to fetch news by id {news_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch news article")



# BLOG ENDPOINTS

@api_router.get("/blogs")
async def get_published_blogs():
    """Get all published blogs (public endpoint)"""
    try:
        blogs_cursor = db.blogs.find({"status": "published"}).sort("created_at", -1)
        blogs_list = []
        async for blog_item in blogs_cursor:
            blogs_list.append({
            "id": blog_item.get("id", str(blog_item["_id"])),
            "title": blog_item["title"],
            "excerpt": blog_item.get("excerpt", ""),
            "content": blog_item["content"],
            "category": blog_item.get("category", ""),
            "tags": blog_item.get("tags", []),
            "image": blog_item.get("image"),
            "author": blog_item["author"],
            "publishDate": blog_item["created_at"].isoformat() if blog_item.get("created_at") else None,
            "status": blog_item["status"]
            })
        return blogs_list
    except Exception as e:
        logger.error(f"Failed to fetch blogs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blogs")

@api_router.get("/blogs/{blog_id}")
async def get_blog(blog_id: str):
    """Get a single published blog by ID (public endpoint)"""
    try:
        blog_item = await db.blogs.find_one({"id": blog_id, "status": "published"})
        if not blog_item:
            raise HTTPException(status_code=404, detail="Blog not found")

        return {
            "id": blog_item.get("id", str(blog_item["_id"])),
            "title": blog_item["title"],
            "excerpt": blog_item.get("excerpt", ""),
            "content": blog_item["content"],
            "category": blog_item.get("category", ""),
            "tags": blog_item.get("tags", []),
            "image": blog_item.get("image"),
            "author": blog_item["author"],
            "publishDate": blog_item["created_at"].isoformat() if blog_item.get("created_at") else None,
            "status": blog_item["status"]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch blog {blog_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog")



@api_router.get("/impact-stats")
async def get_impact_stats():
    """Get current impact statistics"""
    try:
        stats = await db.impact_stats.find_one({}, sort=[("updated_at", -1)])
        if not stats:
            # Return default stats if none exist
            return {
                "youthTrained": 1300,
                "youthPlaced": 1000, 
                "seniorsSupported": 6000,
                "womenEmpowered": 200
            }
        return {
            "youthTrained": stats.get("youth_trained", 1300),
            "youthPlaced": stats.get("youth_placed", 1000),
            "seniorsSupported": stats.get("seniors_supported", 6000),
            "womenEmpowered": stats.get("women_empowered", 200)
        }
    except Exception as e:
        logger.error(f"Failed to fetch impact stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch impact statistics")

# ADMIN ENDPOINTS

@api_router.post("/admin/login", response_model=LoginResponse)
async def admin_login(login_data: AdminLogin):
    """Admin login"""
    try:
        admin_user = await db.admin_users.find_one({"username": login_data.username})
        if not admin_user or not verify_password(login_data.password, admin_user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Update last login
        await db.admin_users.update_one(
            {"username": login_data.username},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create access token
        token = create_access_token({
            "sub": admin_user["username"],
            "role": admin_user["role"]
        })
        
        user_data = AdminUser(
            id=str(admin_user.get("_id")),
            username=admin_user["username"],
            name=admin_user["name"],
            role=admin_user["role"],
            created_at=admin_user.get("created_at", datetime.utcnow()),
            last_login=datetime.utcnow()
        )
        
        return LoginResponse(
            message="Login successful",
            user=user_data,
            token=token
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Admin login failed: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.get("/admin/contacts")
async def get_contacts(current_user: dict = Depends(admin_required)):
    """Get all contact form submissions"""
    try:
        contacts_cursor = db.contacts.find({}).sort("created_at", -1)
        contacts_list = []
        async for contact in contacts_cursor:
            contacts_list.append({
                "id": contact.get("id", str(contact["_id"])),
                "name": contact["name"],
                "email": contact["email"],
                "phone": contact.get("phone"),
                "subject": contact["subject"],
                "message": contact["message"],
                "inquiry_type": contact.get("inquiry_type"),
                "created_at": contact["created_at"].isoformat(),
                "status": contact.get("status", "new")
            })
        return contacts_list
    except Exception as e:
        logger.error(f"Failed to fetch contacts: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contacts")

@api_router.get("/admin/volunteers")
async def get_volunteers(current_user: dict = Depends(admin_required)):
    """Get all volunteer applications"""
    try:
        volunteers_cursor = db.volunteers.find({}).sort("created_at", -1)
        volunteers_list = []
        async for volunteer in volunteers_cursor:
            volunteers_list.append({
                "id": volunteer.get("id", str(volunteer["_id"])),
                "name": volunteer["name"],
                "email": volunteer["email"],
                "phone": volunteer["phone"],
                "skills": volunteer.get("skills"),
                "availability": volunteer["availability"],
                "interests": volunteer["interests"],
                "experience": volunteer.get("experience"),
                "created_at": volunteer["created_at"].isoformat(),
                "status": volunteer.get("status", "pending")
            })
        return volunteers_list
    except Exception as e:
        logger.error(f"Failed to fetch volunteers: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch volunteers")

@api_router.get("/admin/newsletters")
async def get_newsletter_subscribers(current_user: dict = Depends(admin_required)):
    """Get all newsletter subscribers"""
    try:
        newsletters_cursor = db.newsletters.find({"is_active": True}).sort("subscribed_at", -1)
        newsletters_list = []
        async for newsletter in newsletters_cursor:
            newsletters_list.append({
                "id": newsletter.get("id", str(newsletter["_id"])),
                "email": newsletter["email"],
                "subscribed_at": newsletter["subscribed_at"].isoformat(),
                "is_active": newsletter["is_active"]
            })
        return newsletters_list
    except Exception as e:
        logger.error(f"Failed to fetch newsletter subscribers: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch newsletter subscribers")

@api_router.post("/admin/news", response_model=MessageResponse)
async def create_news(news_data: NewsCreate, current_user: dict = Depends(admin_required)):
    """Create a new news article"""
    try:
        news = News(**news_data.dict(), author=current_user["username"])
        await db.news.insert_one(news.dict())
        logger.info(f"News article created: {news.title}")
        return MessageResponse(message="News article created successfully!")
    except Exception as e:
        logger.error(f"Failed to create news: {e}")
        raise HTTPException(status_code=500, detail="Failed to create news article")

@api_router.put("/admin/news/{news_id}", response_model=MessageResponse)
async def update_news(news_id: str, news_data: NewsUpdate, current_user: dict = Depends(admin_required)):
    """Update a news article"""
    try:
        update_data = {k: v for k, v in news_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.news.update_one(
            {"id": news_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="News article not found")
            
        logger.info(f"News article updated: {news_id}")
        return MessageResponse(message="News article updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update news: {e}")
        raise HTTPException(status_code=500, detail="Failed to update news article")

@api_router.delete("/admin/news/{news_id}", response_model=MessageResponse)
async def delete_news(news_id: str, current_user: dict = Depends(admin_required)):
    """Delete a news article"""
    try:
        result = await db.news.delete_one({"id": news_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="News article not found")
            
        logger.info(f"News article deleted: {news_id}")
        return MessageResponse(message="News article deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete news: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete news article")

@api_router.get("/admin/news")
async def get_all_news(current_user: dict = Depends(admin_required)):
    """Get all news articles (including drafts)"""
    try:
        news_cursor = db.news.find({}).sort("created_at", -1)
        news_list = []
        async for news_item in news_cursor:
            news_list.append({
            "id": news_item.get("id", str(news_item["_id"])),
            "title": news_item["title"],
            "content": news_item["content"],
            "status": news_item["status"],
            "author": news_item["author"],
            "date": news_item["created_at"].isoformat(),
            "updated_at": news_item.get("updated_at", news_item["created_at"]).isoformat()
            })
        return news_list
    except Exception as e:
        logger.error(f"Failed to fetch all news: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch news")

@api_router.post("/admin/blogs", response_model=MessageResponse)
async def create_blog(blog_data: BlogCreate, current_user: dict = Depends(admin_required)):
    """Create a new blog post (admin only)"""
    try:
        blog = Blog(**blog_data.dict(), author=current_user["username"])
        await db.blogs.insert_one(blog.dict())
        logger.info(f"Blog created: {blog.title}")
        return MessageResponse(message="Blog created successfully!")
    except Exception as e:
        logger.error(f"Failed to create blog: {e}")
        raise HTTPException(status_code=500, detail="Failed to create blog")


@api_router.get("/admin/blogs")
async def get_all_blogs(current_user: dict = Depends(admin_required)):
    """Get all blogs (including drafts) for admin"""
    try:
        blogs_cursor = db.blogs.find({}).sort("created_at", -1)
        blogs_list = []
        async for blog_item in blogs_cursor:
            blogs_list.append({
            "id": blog_item.get("id", str(blog_item["_id"])),
            "title": blog_item["title"],
            "excerpt": blog_item.get("excerpt", ""),
            "content": blog_item["content"],
            "category": blog_item.get("category", ""),
            "tags": blog_item.get("tags", []),
            "image": blog_item.get("image"),
            "status": blog_item["status"],
            "author": blog_item["author"],
            "date": blog_item["created_at"].isoformat(),
            "updated_at": blog_item.get("updated_at", blog_item["created_at"]).isoformat()
            })
        return blogs_list
    except Exception as e:
        logger.error(f"Failed to fetch blogs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blogs")


@api_router.put("/admin/blogs/{blog_id}", response_model=MessageResponse)
async def update_blog(blog_id: str, blog_data: BlogUpdate, current_user: dict = Depends(admin_required)):
    """Update a blog post (admin only)"""
    try:
        update_data = {k: v for k, v in blog_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()

        result = await db.blogs.update_one(
            {"id": blog_id},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Blog not found")

        logger.info(f"Blog updated: {blog_id}")
        return MessageResponse(message="Blog updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update blog: {e}")
        raise HTTPException(status_code=500, detail="Failed to update blog")


@api_router.delete("/admin/blogs/{blog_id}", response_model=MessageResponse)
async def delete_blog(blog_id: str, current_user: dict = Depends(admin_required)):
    """Delete a blog post (admin only)"""
    try:
        result = await db.blogs.delete_one({"id": blog_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Blog not found")

        logger.info(f"Blog deleted: {blog_id}")
        return MessageResponse(message="Blog deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete blog: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete blog")
    
@api_router.put("/admin/impact-stats", response_model=MessageResponse)
async def update_impact_stats(stats_data: ImpactStatsUpdate, current_user: dict = Depends(admin_required)):
    """Update impact statistics"""
    try:
        update_data = {k: v for k, v in stats_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        update_data["updated_by"] = current_user["username"]
        
        # Upsert - update if exists, create if doesn't
        await db.impact_stats.update_one(
            {},
            {"$set": update_data},
            upsert=True
        )
        
        logger.info(f"Impact stats updated by {current_user['username']}")
        return MessageResponse(message="Impact statistics updated successfully!")
    except Exception as e:
        logger.error(f"Failed to update impact stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to update impact statistics")

@api_router.get("/admin/site-content")
async def get_site_content(current_user: dict = Depends(admin_required)):
    """Get current site content"""
    try:
        content = await db.site_content.find_one({}, sort=[("updated_at", -1)])
        if not content:
            # Return default content structure if none exists
            return {"content": {}}
        return {"content": content.get("content", {})}
    except Exception as e:
        logger.error(f"Failed to fetch site content: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch site content")

@api_router.put("/admin/site-content", response_model=MessageResponse)
async def update_site_content(content_data: SiteContentUpdate, current_user: dict = Depends(admin_required)):
    """Update site content"""
    try:
        update_data = {
            "content": content_data.content,
            "updated_at": datetime.utcnow(),
            "updated_by": current_user["username"]
        }
        
        # Upsert - update if exists, create if doesn't
        await db.site_content.update_one(
            {},
            {"$set": update_data},
            upsert=True
        )
        
        logger.info(f"Site content updated by {current_user['username']}")
        return MessageResponse(message="Site content updated successfully!")
    except Exception as e:
        logger.error(f"Failed to update site content: {e}")
        raise HTTPException(status_code=500, detail="Failed to update site content")

@api_router.put("/admin/contact-info", response_model=MessageResponse)
async def update_contact_info(contact_data: ContactInfoUpdate, current_user: dict = Depends(admin_required)):
    """Update contact information"""
    try:
        # Get current site content
        current_content = await db.site_content.find_one({}, sort=[("updated_at", -1)])
        if not current_content:
            current_content = {"content": {}}
        
        # Update contact info in the content structure
        content = current_content.get("content", {})
        if "contact" not in content:
            content["contact"] = {}
        if "contactInfo" not in content["contact"]:
            content["contact"]["contactInfo"] = {}
        
        # Update only provided fields
        contact_info = content["contact"]["contactInfo"]
        if contact_data.email is not None:
            contact_info["email"] = contact_data.email
        if contact_data.phone is not None:
            contact_info["phone"] = contact_data.phone
        if contact_data.address is not None:
            contact_info["address"] = contact_data.address
        
        # Save updated content
        update_data = {
            "content": content,
            "updated_at": datetime.utcnow(),
            "updated_by": current_user["username"]
        }
        
        await db.site_content.update_one(
            {},
            {"$set": update_data},
            upsert=True
        )
        
        logger.info(f"Contact info updated by {current_user['username']}")
        return MessageResponse(message="Contact information updated successfully!")
    except Exception as e:
        logger.error(f"Failed to update contact info: {e}")
        raise HTTPException(status_code=500, detail="Failed to update contact information")

@api_router.get("/site-content")
async def get_public_site_content():
    """Get current site content for public pages (no authentication required)"""
    try:
        content = await db.site_content.find_one({}, sort=[("updated_at", -1)])
        if not content:
            # Return empty content structure if none exists
            return {"content": {}}
        return {"content": content.get("content", {})}
    except Exception as e:
        logger.error(f"Failed to fetch public site content: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch site content")

# Success Stories Endpoints
@api_router.get("/success-stories")
async def get_success_stories():
    """Get all active success stories (no authentication required)"""
    try:
        stories = await db.success_stories.find(
            {"is_active": True}, 
            sort=[("order", 1), ("created_at", -1)]
        ).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for story in stories:
            story["_id"] = str(story["_id"])
            
        return {"stories": stories}
    except Exception as e:
        logger.error(f"Failed to fetch success stories: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch success stories")

@api_router.get("/admin/success-stories")
async def get_admin_success_stories(current_user: dict = Depends(admin_required)):
    """Get all success stories for admin management"""
    try:
        stories = await db.success_stories.find({}, sort=[("order", 1), ("created_at", -1)]).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for story in stories:
            story["_id"] = str(story["_id"])
            
        return {"stories": stories}
    except Exception as e:
        logger.error(f"Failed to fetch admin success stories: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch success stories")

@api_router.post("/admin/success-stories", response_model=MessageResponse)
async def create_success_story(story_data: SuccessStoryCreate, current_user: dict = Depends(admin_required)):
    """Create a new success story"""
    try:
        story_dict = story_data.dict()
        story_dict["id"] = str(uuid.uuid4())
        story_dict["created_at"] = datetime.utcnow()
        story_dict["updated_at"] = datetime.utcnow()
        
        result = await db.success_stories.insert_one(story_dict)
        
        logger.info(f"Success story created by {current_user['username']}: {story_dict['name']}")
        return MessageResponse(message="Success story created successfully!")
    except Exception as e:
        logger.error(f"Failed to create success story: {e}")
        raise HTTPException(status_code=500, detail="Failed to create success story")

@api_router.put("/admin/success-stories/{story_id}", response_model=MessageResponse)
async def update_success_story(story_id: str, story_data: SuccessStoryUpdate, current_user: dict = Depends(admin_required)):
    """Update a success story"""
    try:
        update_data = {k: v for k, v in story_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.success_stories.update_one(
            {"id": story_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Success story not found")
        
        logger.info(f"Success story updated by {current_user['username']}: {story_id}")
        return MessageResponse(message="Success story updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update success story: {e}")
        raise HTTPException(status_code=500, detail="Failed to update success story")

@api_router.delete("/admin/success-stories/{story_id}", response_model=MessageResponse)
async def delete_success_story(story_id: str, current_user: dict = Depends(admin_required)):
    """Delete a success story"""
    try:
        result = await db.success_stories.delete_one({"id": story_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Success story not found")
        
        logger.info(f"Success story deleted by {current_user['username']}: {story_id}")
        return MessageResponse(message="Success story deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete success story: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete success story")

# Leadership Team Endpoints
@api_router.get("/leadership-team")
async def get_leadership_team():
    """Get all active leadership team members (no authentication required)"""
    try:
        members = await db.leadership_team.find(
            {"is_active": True}, 
            sort=[("category", 1), ("order", 1), ("created_at", -1)]
        ).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for member in members:
            member["_id"] = str(member["_id"])
            # Ensure category exists (for backward compatibility)
            if "category" not in member:
                member["category"] = "Trustee"
            
        return {"members": members}
    except Exception as e:
        logger.error(f"Failed to fetch leadership team: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch leadership team")

@api_router.get("/admin/leadership-team")
async def get_admin_leadership_team(current_user: dict = Depends(admin_required)):
    """Get all leadership team members for admin management"""
    try:
        members = await db.leadership_team.find({}, sort=[("category", 1), ("order", 1), ("created_at", -1)]).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for member in members:
            member["_id"] = str(member["_id"])
            # Ensure category exists (for backward compatibility)
            if "category" not in member:
                member["category"] = "Trustee"
            
        return {"members": members}
    except Exception as e:
        logger.error(f"Failed to fetch admin leadership team: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch leadership team")

@api_router.post("/admin/leadership-team", response_model=MessageResponse)
async def create_team_member(member_data: TeamMemberCreate, current_user: dict = Depends(admin_required)):
    """Create a new team member"""
    try:
        member_dict = member_data.dict()
        member_dict["id"] = str(uuid.uuid4())
        member_dict["created_at"] = datetime.utcnow()
        member_dict["updated_at"] = datetime.utcnow()
        
        result = await db.leadership_team.insert_one(member_dict)
        
        logger.info(f"Team member created by {current_user['username']}: {member_dict['name']}")
        return MessageResponse(message="Team member created successfully!")
    except Exception as e:
        logger.error(f"Failed to create team member: {e}")
        raise HTTPException(status_code=500, detail="Failed to create team member")

@api_router.put("/admin/leadership-team/{member_id}", response_model=MessageResponse)
async def update_team_member(member_id: str, member_data: TeamMemberUpdate, current_user: dict = Depends(admin_required)):
    """Update a team member"""
    try:
        update_data = {k: v for k, v in member_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.leadership_team.update_one(
            {"id": member_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
        
        logger.info(f"Team member updated by {current_user['username']}: {member_id}")
        return MessageResponse(message="Team member updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update team member: {e}")
        raise HTTPException(status_code=500, detail="Failed to update team member")

@api_router.delete("/admin/leadership-team/{member_id}", response_model=MessageResponse)
async def delete_team_member(member_id: str, current_user: dict = Depends(admin_required)):
    """Delete a team member"""
    try:
        result = await db.leadership_team.delete_one({"id": member_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
        
        logger.info(f"Team member deleted by {current_user['username']}: {member_id}")
        return MessageResponse(message="Team member deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete team member: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete team member")

# Page Sections Endpoints
@api_router.get("/page-sections/{page}")
async def get_page_sections(page: str):
    """Get all active sections for a specific page (no authentication required)"""
    try:
        sections = await db.page_sections.find(
            {"page": page, "is_active": True}, 
            sort=[("order", 1), ("created_at", -1)]
        ).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for section in sections:
            section["_id"] = str(section["_id"])
            
        return {"sections": sections}
    except Exception as e:
        logger.error(f"Failed to fetch page sections for {page}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch page sections")

@api_router.get("/admin/page-sections/{page}")
async def get_admin_page_sections(page: str, current_user: dict = Depends(admin_required)):
    """Get all sections for a specific page for admin management"""
    try:
        sections = await db.page_sections.find(
            {"page": page}, 
            sort=[("order", 1), ("created_at", -1)]
        ).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for section in sections:
            section["_id"] = str(section["_id"])
            
        return {"sections": sections}
    except Exception as e:
        logger.error(f"Failed to fetch admin page sections for {page}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch page sections")

@api_router.post("/admin/page-sections", response_model=MessageResponse)
async def create_page_section(section_data: PageSectionCreate, current_user: dict = Depends(admin_required)):
    """Create a new page section"""
    try:
        section_dict = section_data.dict()
        section_dict["id"] = str(uuid.uuid4())
        section_dict["created_at"] = datetime.utcnow()
        section_dict["updated_at"] = datetime.utcnow()
        
        result = await db.page_sections.insert_one(section_dict)
        
        logger.info(f"Page section created by {current_user['username']}: {section_dict['page']}/{section_dict['section']}")
        return MessageResponse(message="Page section created successfully!")
    except Exception as e:
        logger.error(f"Failed to create page section: {e}")
        raise HTTPException(status_code=500, detail="Failed to create page section")

@api_router.put("/admin/page-sections/{section_id}", response_model=MessageResponse)
async def update_page_section(section_id: str, section_data: PageSectionUpdate, current_user: dict = Depends(admin_required)):
    """Update a page section"""
    try:
        update_data = {k: v for k, v in section_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.page_sections.update_one(
            {"id": section_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Page section not found")
        
        logger.info(f"Page section updated by {current_user['username']}: {section_id}")
        return MessageResponse(message="Page section updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update page section: {e}")
        raise HTTPException(status_code=500, detail="Failed to update page section")

@api_router.delete("/admin/page-sections/{section_id}", response_model=MessageResponse)
async def delete_page_section(section_id: str, current_user: dict = Depends(admin_required)):
    """Delete a page section"""
    try:
        result = await db.page_sections.delete_one({"id": section_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Page section not found")
        
        logger.info(f"Page section deleted by {current_user['username']}: {section_id}")
        return MessageResponse(message="Page section deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete page section: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete page section")

# Gallery Items Endpoints
@api_router.get("/gallery-items")
async def get_gallery_items():
    """Get all active gallery items (no authentication required)"""
    try:
        items = await db.gallery_items.find(
            {"is_active": True}, 
            sort=[("order", 1), ("created_at", -1)]
        ).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for item in items:
            item["_id"] = str(item["_id"])
            
        return {"items": items}
    except Exception as e:
        logger.error(f"Failed to fetch gallery items: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch gallery items")

@api_router.get("/admin/gallery-items")
async def get_admin_gallery_items(current_user: dict = Depends(admin_required)):
    """Get all gallery items for admin management"""
    try:
        items = await db.gallery_items.find({}, sort=[("order", 1), ("created_at", -1)]).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for item in items:
            item["_id"] = str(item["_id"])
            
        return {"items": items}
    except Exception as e:
        logger.error(f"Failed to fetch admin gallery items: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch gallery items")

@api_router.post("/admin/gallery-items", response_model=MessageResponse)
async def create_gallery_item(item_data: GalleryItemCreate, current_user: dict = Depends(admin_required)):
    """Create a new gallery item"""
    try:
        item_dict = item_data.dict()
        item_dict["id"] = str(uuid.uuid4())
        item_dict["created_at"] = datetime.utcnow()
        item_dict["updated_at"] = datetime.utcnow()
        
        result = await db.gallery_items.insert_one(item_dict)
        
        logger.info(f"Gallery item created by {current_user['username']}: {item_dict['title']}")
        return MessageResponse(message="Gallery item created successfully!")
    except Exception as e:
        logger.error(f"Failed to create gallery item: {e}")
        raise HTTPException(status_code=500, detail="Failed to create gallery item")

@api_router.put("/admin/gallery-items/{item_id}", response_model=MessageResponse)
async def update_gallery_item(item_id: str, item_data: GalleryItemUpdate, current_user: dict = Depends(admin_required)):
    """Update a gallery item"""
    try:
        update_data = {k: v for k, v in item_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.gallery_items.update_one(
            {"id": item_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Gallery item not found")
        
        logger.info(f"Gallery item updated by {current_user['username']}: {item_id}")
        return MessageResponse(message="Gallery item updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update gallery item: {e}")
        raise HTTPException(status_code=500, detail="Failed to update gallery item")

@api_router.delete("/admin/gallery-items/{item_id}", response_model=MessageResponse)
async def delete_gallery_item(item_id: str, current_user: dict = Depends(admin_required)):
    """Delete a gallery item"""
    try:
        result = await db.gallery_items.delete_one({"id": item_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Gallery item not found")
        
        logger.info(f"Gallery item deleted by {current_user['username']}: {item_id}")
        return MessageResponse(message="Gallery item deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete gallery item: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete gallery item")

# USER MANAGEMENT ENDPOINTS
@api_router.get("/admin/users")
async def get_users(current_user: dict = Depends(admin_required)):
    """Get all users for admin management"""
    try:
        # Only super_admin can manage users
        if current_user.get("role") != "super_admin":
            raise HTTPException(status_code=403, detail="Only super admins can manage users")
        
        users = await db.admin_users.find({}, {"password": 0}).sort("created_at", -1).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for user in users:
            user["_id"] = str(user["_id"])
            
        return {"users": users}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch users: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@api_router.post("/admin/users", response_model=MessageResponse)
async def create_user(user_data: UserCreate, current_user: dict = Depends(admin_required)):
    """Create a new user"""
    try:
        # Only super_admin can create users
        if current_user.get("role") != "super_admin":
            raise HTTPException(status_code=403, detail="Only super admins can create users")
        
        # Check if username already exists
        existing = await db.admin_users.find_one({"username": user_data.username})
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Check if email already exists
        existing_email = await db.admin_users.find_one({"email": user_data.email})
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Hash password and create user
        user_dict = user_data.dict()
        user_dict["id"] = str(uuid.uuid4())
        user_dict["password"] = hash_password(user_data.password)
        user_dict["is_active"] = True
        user_dict["created_at"] = datetime.utcnow()
        
        result = await db.admin_users.insert_one(user_dict)
        
        logger.info(f"User created by {current_user['username']}: {user_dict['username']}")
        return MessageResponse(message="User created successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create user: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")

@api_router.put("/admin/users/{user_id}", response_model=MessageResponse)
async def update_user(user_id: str, user_data: UserUpdate, current_user: dict = Depends(admin_required)):
    """Update a user"""
    try:
        # Only super_admin can update users, or users can update themselves (limited fields)
        if current_user.get("role") != "super_admin" and current_user.get("id") != user_id:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        update_data = {k: v for k, v in user_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        # Non-super-admin users can only update their own name and email
        if current_user.get("role") != "super_admin":
            allowed_fields = {"name", "email", "updated_at"}
            update_data = {k: v for k, v in update_data.items() if k in allowed_fields}
        
        if update_data.get("email"):
            # Check if new email already exists for another user
            existing = await db.admin_users.find_one({"email": update_data["email"], "id": {"$ne": user_id}})
            if existing:
                raise HTTPException(status_code=400, detail="Email already exists")
        
        result = await db.admin_users.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"User updated by {current_user['username']}: {user_id}")
        return MessageResponse(message="User updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update user: {e}")
        raise HTTPException(status_code=500, detail="Failed to update user")

@api_router.put("/admin/users/{user_id}/password", response_model=MessageResponse)
async def update_user_password(user_id: str, password_data: UserPasswordUpdate, current_user: dict = Depends(admin_required)):
    """Update user password"""
    try:
        # Users can only update their own password
        if current_user.get("id") != user_id:
            raise HTTPException(status_code=403, detail="Can only update your own password")
        
        # Verify current password
        user = await db.admin_users.find_one({"id": user_id})
        if not user or not verify_password(password_data.current_password, user["password"]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Hash new password and update
        new_password_hash = hash_password(password_data.new_password)
        result = await db.admin_users.update_one(
            {"id": user_id},
            {"$set": {"password": new_password_hash, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"Password updated for user: {user_id}")
        return MessageResponse(message="Password updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update password: {e}")
        raise HTTPException(status_code=500, detail="Failed to update password")

@api_router.delete("/admin/users/{user_id}", response_model=MessageResponse)
async def delete_user(user_id: str, current_user: dict = Depends(admin_required)):
    """Delete a user"""
    try:
        # Only super_admin can delete users
        if current_user.get("role") != "super_admin":
            raise HTTPException(status_code=403, detail="Only super admins can delete users")
        
        # Prevent deleting yourself
        if current_user.get("id") == user_id:
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
        # Check if this is the only super_admin
        super_admin_count = await db.admin_users.count_documents({"role": "super_admin"})
        user_to_delete = await db.admin_users.find_one({"id": user_id})
        
        if user_to_delete and user_to_delete.get("role") == "super_admin" and super_admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the only super admin")
        
        result = await db.admin_users.delete_one({"id": user_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"User deleted by {current_user['username']}: {user_id}")
        return MessageResponse(message="User deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete user: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete user")

# SITE SETTINGS/BRANDING ENDPOINTS
@api_router.get("/site-settings")
async def get_site_settings():
    """Get current site settings (no authentication required)"""
    try:
        settings = await db.site_settings.find_one({}, sort=[("updated_at", -1)])
        if not settings:
            # Return default settings if none exist
            return {
                "logo_url": None,
                "favicon_url": None,
                "site_title": "Shield Foundation",
                "site_description": "Adding Life to Years",
                "primary_color": "#2563eb",
                "secondary_color": "#eab308",
                "accent_color": "#ffffff",
                "facebook_url": None,
                "instagram_url": None,
                "youtube_url": None,
                "twitter_url": None,
                "linkedin_url": None
            }
        return {
            "logo_url": settings.get("logo_url"),
            "favicon_url": settings.get("favicon_url"),
            "site_title": settings.get("site_title", "Shield Foundation"),
            "site_description": settings.get("site_description", "Adding Life to Years"),
            "primary_color": settings.get("primary_color", "#2563eb"),
            "secondary_color": settings.get("secondary_color", "#eab308"),
            "accent_color": settings.get("accent_color", "#ffffff"),
            "facebook_url": settings.get("facebook_url"),
            "instagram_url": settings.get("instagram_url"),
            "youtube_url": settings.get("youtube_url"),
            "twitter_url": settings.get("twitter_url"),
            "linkedin_url": settings.get("linkedin_url")
        }
    except Exception as e:
        logger.error(f"Failed to fetch site settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch site settings")

@api_router.get("/admin/site-settings")
async def get_admin_site_settings(current_user: dict = Depends(admin_required)):
    """Get current site settings for admin management"""
    try:
        settings = await db.site_settings.find_one({}, sort=[("updated_at", -1)])
        if not settings:
            # Return default settings if none exist
            return {
                "logo_url": None,
                "favicon_url": None,
                "site_title": "Shield Foundation",
                "site_description": "Adding Life to Years",
                "primary_color": "#2563eb",
                "secondary_color": "#eab308",
                "accent_color": "#ffffff",
                "facebook_url": None,
                "instagram_url": None,
                "youtube_url": None,
                "twitter_url": None,
                "linkedin_url": None
            }
        
        # Convert ObjectId to string for JSON serialization
        settings["_id"] = str(settings["_id"])
        return settings
    except Exception as e:
        logger.error(f"Failed to fetch admin site settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch site settings")

@api_router.put("/admin/site-settings", response_model=MessageResponse)
async def update_site_settings(settings_data: SiteSettingsUpdate, current_user: dict = Depends(admin_required)):
    """Update site settings"""
    try:
        update_data = {k: v for k, v in settings_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        update_data["updated_by"] = current_user["username"]
        
        # Upsert - update if exists, create if doesn't
        await db.site_settings.update_one(
            {},
            {"$set": update_data},
            upsert=True
        )
        
        logger.info(f"Site settings updated by {current_user['username']}")
        return MessageResponse(message="Site settings updated successfully!")
    except Exception as e:
        logger.error(f"Failed to update site settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to update site settings")

# ENHANCED PAGE SECTIONS ENDPOINTS (For detailed CMS)
@api_router.get("/detailed-page-sections/{page}")
async def get_detailed_page_sections(page: str):
    """Get all active detailed sections for a specific page (no authentication required)"""
    try:
        sections = await db.detailed_page_sections.find(
            {"page": page, "is_active": True}, 
            sort=[("order", 1), ("created_at", -1)]
        ).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for section in sections:
            section["_id"] = str(section["_id"])
            
        return {"sections": sections}
    except Exception as e:
        logger.error(f"Failed to fetch detailed page sections for {page}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch page sections")

@api_router.get("/admin/detailed-page-sections/{page}")
async def get_admin_detailed_page_sections(page: str, current_user: dict = Depends(admin_required)):
    """Get all detailed sections for a specific page for admin management"""
    try:
        sections = await db.detailed_page_sections.find(
            {"page": page}, 
            sort=[("order", 1), ("created_at", -1)]
        ).to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for section in sections:
            section["_id"] = str(section["_id"])
            
        return {"sections": sections}
    except Exception as e:
        logger.error(f"Failed to fetch admin detailed page sections for {page}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch page sections")

@api_router.post("/admin/detailed-page-sections", response_model=MessageResponse)
async def create_detailed_page_section(section_data: DetailedPageSectionCreate, current_user: dict = Depends(admin_required)):
    """Create a new detailed page section"""
    try:
        section_dict = section_data.dict()
        section_dict["id"] = str(uuid.uuid4())
        section_dict["created_at"] = datetime.utcnow()
        section_dict["updated_at"] = datetime.utcnow()
        
        result = await db.detailed_page_sections.insert_one(section_dict)
        
        logger.info(f"Detailed page section created by {current_user['username']}: {section_dict['page']}/{section_dict['section']}")
        return MessageResponse(message="Page section created successfully!")
    except Exception as e:
        logger.error(f"Failed to create detailed page section: {e}")
        raise HTTPException(status_code=500, detail="Failed to create page section")

@api_router.put("/admin/detailed-page-sections/{section_id}", response_model=MessageResponse)
async def update_detailed_page_section(section_id: str, section_data: DetailedPageSectionUpdate, current_user: dict = Depends(admin_required)):
    """Update a detailed page section"""
    try:
        update_data = {k: v for k, v in section_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.detailed_page_sections.update_one(
            {"id": section_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Page section not found")
        
        logger.info(f"Detailed page section updated by {current_user['username']}: {section_id}")
        return MessageResponse(message="Page section updated successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update detailed page section: {e}")
        raise HTTPException(status_code=500, detail="Failed to update page section")

@api_router.delete("/admin/detailed-page-sections/{section_id}", response_model=MessageResponse)
async def delete_detailed_page_section(section_id: str, current_user: dict = Depends(admin_required)):
    """Delete a detailed page section"""
    try:
        result = await db.detailed_page_sections.delete_one({"id": section_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Page section not found")
        
        logger.info(f"Detailed page section deleted by {current_user['username']}: {section_id}")
        return MessageResponse(message="Page section deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete detailed page section: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete page section")

# DATABASE MANAGEMENT ENDPOINTS
@api_router.get("/admin/database/stats")
async def get_database_stats(current_user: dict = Depends(admin_required)):
    """Get overall database statistics"""
    try:
        collections = await db.list_collection_names()
        
        total_documents = 0
        collection_stats = []
        
        for collection_name in collections:
            count = await db[collection_name].count_documents({})
            total_documents += count
            
            collection_stats.append({
                "collection": collection_name,
                "count": count,
                "size": 0  # Size calculation disabled for compatibility
            })
        
        # Sort by document count descending
        collection_stats.sort(key=lambda x: x["count"], reverse=True)
        
        logger.info(f"Database stats retrieved by {current_user['username']}")
        return {
            "total_collections": len(collections),
            "total_documents": total_documents,
            "collection_stats": collection_stats
        }
    except Exception as e:
        logger.error(f"Failed to get database stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve database statistics")

@api_router.get("/admin/database/collections")
async def get_database_collections(current_user: dict = Depends(admin_required)):
    """Get all database collections and their document counts"""
    try:
        collections = await db.list_collection_names()
        
        # Define collection display names and descriptions
        collection_info = {
            "admin_users": {"name": "Admin Users", "description": "System administrators and users"},
            "contacts": {"name": "Contact Messages", "description": "Contact form submissions from website visitors"},
            "volunteers": {"name": "Volunteer Applications", "description": "Volunteer application submissions"},
            "newsletters": {"name": "Newsletter Subscribers", "description": "Email newsletter subscribers"},
            "news": {"name": "News & Blog Posts", "description": "News articles and blog posts"},
            "impact_stats": {"name": "Impact Statistics", "description": "Foundation impact metrics and statistics"},
            "site_content": {"name": "Site Content", "description": "CMS content for website pages"},
            "success_stories": {"name": "Success Stories", "description": "Success story carousel items"},
            "leadership_team": {"name": "Leadership Team", "description": "Team member profiles"},
            "page_sections": {"name": "Page Sections", "description": "Configurable page sections"},
            "gallery_items": {"name": "Gallery Items", "description": "Gallery photos and media items"}
        }
        
        result = []
        for collection_name in collections:
            count = await db[collection_name].count_documents({})
            info = collection_info.get(collection_name, {
                "name": collection_name.replace("_", " ").title(),
                "description": f"Collection: {collection_name}"
            })
            
            result.append({
                "collection": collection_name,
                "name": info["name"],
                "description": info["description"],
                "count": count
            })
        
        # Sort by collection name for consistency
        result.sort(key=lambda x: x["collection"])
        
        logger.info(f"Database collections retrieved by {current_user['username']}")
        return {"collections": result}
    except Exception as e:
        logger.error(f"Failed to get database collections: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve database collections")

@api_router.get("/admin/database/{collection_name}")
async def get_collection_data(collection_name: str, limit: int = 100, skip: int = 0, current_user: dict = Depends(admin_required)):
    """Get data from a specific collection"""
    try:
        # Validate collection exists
        collections = await db.list_collection_names()
        if collection_name not in collections:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        # Get collection data with pagination
        cursor = db[collection_name].find({}).skip(skip).limit(limit)
        
        # Sort by created_at if available, otherwise by _id
        try:
            cursor = cursor.sort("created_at", -1)
        except:
            cursor = cursor.sort("_id", -1)
        
        documents = await cursor.to_list(length=limit)
        
        # Convert ObjectIds to strings for JSON serialization
        for doc in documents:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
        
        # Get total count for pagination
        total_count = await db[collection_name].count_documents({})
        
        logger.info(f"Collection {collection_name} data retrieved by {current_user['username']}")
        return {
            "collection": collection_name,
            "documents": documents,
            "total_count": total_count,
            "limit": limit,
            "skip": skip,
            "has_more": (skip + limit) < total_count
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get collection data for {collection_name}: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve collection data")

@api_router.delete("/admin/database/{collection_name}/{document_id}")
async def delete_document(collection_name: str, document_id: str, current_user: dict = Depends(admin_required)):
    """Delete a document from a collection"""
    try:
        # Validate collection exists
        collections = await db.list_collection_names()
        if collection_name not in collections:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        # Prevent deletion of admin users (safety measure)
        if collection_name == "admin_users":
            raise HTTPException(status_code=403, detail="Cannot delete admin users through this interface")
        
        # Try to delete by 'id' field first (our custom UUID), then by '_id' (MongoDB ObjectId)
        result = await db[collection_name].delete_one({"id": document_id})
        
        if result.deleted_count == 0:
            # Try with _id if id field doesn't work
            from bson import ObjectId
            try:
                result = await db[collection_name].delete_one({"_id": ObjectId(document_id)})
            except:
                result = await db[collection_name].delete_one({"_id": document_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Document not found")
        
        logger.info(f"Document {document_id} deleted from {collection_name} by {current_user['username']}")
        return MessageResponse(message="Document deleted successfully!")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete document {document_id} from {collection_name}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete document")


app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    pass
