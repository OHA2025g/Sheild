from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional
from datetime import datetime
import uuid

# Contact Models
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    inquiry_type: str = Field(..., alias="inquiryType")

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str]
    subject: str
    message: str
    inquiry_type: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")

# Volunteer Models
class VolunteerCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    skills: Optional[str] = Field(None, max_length=500)
    availability: str
    interests: List[str]
    experience: Optional[str] = Field(None, max_length=1000)

class Volunteer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    skills: Optional[str]
    availability: str
    interests: List[str]
    experience: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")

# Newsletter Models
class NewsletterSubscribe(BaseModel):
    email: EmailStr

class Newsletter(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)

# News Models
class NewsCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=20, max_length=5000)
    status: str = Field(default="draft")

    @validator('status')
    def validate_status(cls, v):
        if v not in ['draft', 'published']:
            raise ValueError('Status must be either draft or published')
        return v

class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    content: Optional[str] = Field(None, min_length=20, max_length=5000)
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['draft', 'published']:
            raise ValueError('Status must be either draft or published')
        return v

class News(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    status: str
    author: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Blog Models
class BlogCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=20, max_length=5000)
    status: str = Field(default="draft")

    @validator('status')
    def validate_status(cls, v):
        if v not in ['draft', 'published']:
            raise ValueError('Status must be either draft or published')
        return v

class BlogUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    content: Optional[str] = Field(None, min_length=20, max_length=5000)
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['draft', 'published']:
            raise ValueError('Status must be either draft or published')
        return v

class Blog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    status: str
    author: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Admin Models
class AdminLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    name: str
    role: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

# Impact Stats Models
class ImpactStatsUpdate(BaseModel):
    youth_trained: Optional[int] = Field(None, ge=0)
    youth_placed: Optional[int] = Field(None, ge=0)
    seniors_supported: Optional[int] = Field(None, ge=0)
    women_empowered: Optional[int] = Field(None, ge=0)

class ImpactStats(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    youth_trained: int = Field(default=1300)
    youth_placed: int = Field(default=1000)
    seniors_supported: int = Field(default=6000)
    women_empowered: int = Field(default=200)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str

# Response Models
class MessageResponse(BaseModel):
    message: str
    success: bool = True

class LoginResponse(BaseModel):
    message: str
    success: bool = True
    user: AdminUser
    token: str

# Site Content Models
class SiteContentUpdate(BaseModel):
    content: dict  # Flexible structure for site content

class ContactInfoUpdate(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

# Success Stories Models
class SuccessStory(BaseModel):
    id: str
    name: str
    story: str
    image: str
    achievement: str
    location: str
    program: str
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class SuccessStoryCreate(BaseModel):
    name: str
    story: str
    image: str
    achievement: str
    location: str
    program: str
    order: int = 0
    is_active: bool = True

class SuccessStoryUpdate(BaseModel):
    name: Optional[str] = None
    story: Optional[str] = None
    image: Optional[str] = None
    achievement: Optional[str] = None
    location: Optional[str] = None
    program: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Leadership Team Models
class TeamMember(BaseModel):
    id: str
    name: str
    role: str
    image: str
    description: str
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class TeamMemberCreate(BaseModel):
    name: str
    role: str
    image: str
    description: str
    order: int = 0
    is_active: bool = True

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Page Content Models for configurable sections
class PageSection(BaseModel):
    id: str
    page: str  # 'about', 'programs', 'impact', 'gallery'
    section: str  # 'journey', 'partners', 'overview', etc.
    title: str
    content: dict  # Flexible content structure
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class PageSectionCreate(BaseModel):
    page: str
    section: str
    title: str
    content: dict
    order: int = 0
    is_active: bool = True

class PageSectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[dict] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Gallery Item Models
class GalleryItem(BaseModel):
    id: str
    title: str
    description: str
    image: str
    category: str
    date: str
    type: str = "image"  # image, video
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class GalleryItemCreate(BaseModel):
    title: str
    description: str
    image: str
    category: str
    date: str
    type: str = "image"
    order: int = 0
    is_active: bool = True

class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    type: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# User Management Models
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="admin")  # admin, editor, viewer

    @validator('role')
    def validate_role(cls, v):
        if v not in ['super_admin', 'admin', 'editor', 'viewer']:
            raise ValueError('Role must be one of: super_admin, admin, editor, viewer')
        return v

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

    @validator('role')
    def validate_role(cls, v):
        if v is not None and v not in ['super_admin', 'admin', 'editor', 'viewer']:
            raise ValueError('Role must be one of: super_admin, admin, editor, viewer')
        return v

class UserPasswordUpdate(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    name: str
    email: str
    role: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

# Site Settings/Branding Models
class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    site_title: str = "Shield Foundation"
    site_description: str = "Adding Life to Years"
    primary_color: str = "#2563eb"  # blue-600
    secondary_color: str = "#eab308"  # yellow-500
    accent_color: str = "#ffffff"  # white
    # Social Media Links
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by: str

class SiteSettingsUpdate(BaseModel):
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    site_title: Optional[str] = None
    site_description: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None

# Enhanced Page Section Models for CMS
class PageSectionContent(BaseModel):
    """Flexible content structure for different types of page sections"""
    text: Optional[str] = None
    html: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    links: Optional[List[dict]] = None
    items: Optional[List[dict]] = None
    subsections: Optional[List[dict]] = None
    metadata: Optional[dict] = None

class DetailedPageSection(BaseModel):
    id: str
    page: str  # 'about', 'programs', 'impact', 'gallery'
    section: str  # 'hero', 'journey', 'partners', 'overview', etc.
    title: str
    content: PageSectionContent
    order: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class DetailedPageSectionCreate(BaseModel):
    page: str
    section: str
    title: str
    content: PageSectionContent
    order: int = 0
    is_active: bool = True

class DetailedPageSectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[PageSectionContent] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None
