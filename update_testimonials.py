"""
Script to update/add testimonials to the database
This will update existing testimonials or add new ones if they don't exist
"""
import asyncio
import sys
from pathlib import Path
from datetime import datetime
import uuid

# Add backend directory to path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

from database import db

async def update_testimonials():
    """Update or add testimonials to the database"""
    try:
        testimonials_data = [
            {
                "name": "Dr. Daksha Pandit",
                "role": "Advisory Board Member",
                "company": "Master Trainer - Respite Care Givers Training",
                "content": "I know the founder trustee of Shield Foundation since 2002. I found her very hard working, sincere, trustworthy, and committed for her work. Since 2010, I have provided technical inputs for the projects of Shield Foundation, whenever required. The organization is conducting research based projects for the cause of elderly. All their services for senior citizens are free of cost and need based. I am on the advisory board of organization and motivated to support this organization honorary basis due to the extremely dedicated and motivated team. In the short span the organization has developed the capacity to reach out to 900-1000 elderly/ year. They have won the confidence of community with their dedication in work. Therefore, there is a big list of their regular beneficiaries, who regularly visits the organization and shares their grievances to team of Shield. The organization has trained 60 respite care givers and placed half of them for job. The highest salary, the 'respite care giver' earning after her training is 10, 000/-. They were trained under the training programme, designed by Shield of 'Respite Care Givers training'. I am amongst the master trainers for this programme. I wish the organization the very good success in their endevour.",
                "image": None,
                "rating": 5,
                "order": 1,
                "is_active": True,
            },
            {
                "name": "Dr. Nilesh Shah",
                "role": "Master Trainer",
                "company": "Respite Care Givers Training Programme",
                "content": "I know the founder trustee of shield foundation since last 7 years, due to her work for the cause of elderly. I am associated with the organization since 2010. The organization is keen to provide medical assistance for physical and mental illnesses of elderly. They frequently organize workshops on those issues. In the 2011, we have initiated 'Memory Screening Clinic' in collaboration with Shield and identified approx 15 – 20 cases with dementia/Alzheimers with their assistance. I am amongst the 'Master Trainers' for their training programme ' Respite care givers training programme'. Organisation has provided the job for almost 30 care givers. The highest salary of the care giver is Rs.10, 000/-. With this programme, they are providing livelihood opportunity for the poor and illiterate women and the caring and trained care giver for the elderly. I wish a great success for this organization.",
                "image": None,
                "rating": 5,
                "order": 2,
                "is_active": True,
            },
            {
                "name": "Kavita Lunkad",
                "role": "Member",
                "company": "Progressive Ladies Assn",
                "content": "Since last one year, I am associated with this organization. We have supported their training programme of care givers in 2012. Unfortunately during the same period, I was identified as a patient of 'Motor Neuron Disorder'. Shield has helped me to deal with my health problem by providing a care giver. The care givers are well trained and well mannered. The organization also provided support, when I need replacement for care giver. Swati Ingole is very sincere, dedicated, trustworthy and keen to understand the requirement of the patient. She personally derives time to meet people for this purpose. She is keen to learn and add new things as per the patient's requirement in the course. I wish all the success for this organization.",
                "image": None,
                "rating": 5,
                "order": 3,
                "is_active": True,
            },
            {
                "name": "Dr. Chandrashekhar",
                "role": "Eye Care Specialist",
                "company": None,
                "content": "I am associated with the organization since 2011. We provide 'Eye Care Services' for the elderly enrolled with this organization. The team of Shield is very hard working and committed for the cause. We have provided free eye care services for 300 people in 3 years period with the support of this organization. The organization is doing follow up for each and every case. The staff brings the elderly patients personally at our hospital and also arrange for food and medicines for needy cases.",
                "image": None,
                "rating": 5,
                "order": 4,
                "is_active": True,
            }
        ]

        updated_count = 0
        added_count = 0
        
        for testimonial_data in testimonials_data:
            # Check if testimonial exists by name
            existing = await db.testimonials.find_one({"name": testimonial_data["name"]})
            
            if existing:
                # Update existing testimonial
                testimonial_data["id"] = existing.get("id", str(uuid.uuid4()))
                testimonial_data["updated_at"] = datetime.utcnow()
                # Preserve created_at if it exists
                if "created_at" in existing:
                    testimonial_data["created_at"] = existing["created_at"]
                else:
                    testimonial_data["created_at"] = datetime.utcnow()
                
                await db.testimonials.update_one(
                    {"name": testimonial_data["name"]},
                    {"$set": testimonial_data}
                )
                updated_count += 1
                print(f"✓ Updated testimonial by {testimonial_data['name']}")
            else:
                # Add new testimonial
                testimonial_data["id"] = str(uuid.uuid4())
                testimonial_data["created_at"] = datetime.utcnow()
                testimonial_data["updated_at"] = datetime.utcnow()
                
                await db.testimonials.insert_one(testimonial_data)
                added_count += 1
                print(f"✓ Added testimonial by {testimonial_data['name']}")

        total_count = await db.testimonials.count_documents({"is_active": True})
        print(f"\n✅ Successfully processed testimonials!")
        print(f"   - Updated: {updated_count}")
        print(f"   - Added: {added_count}")
        print(f"   - Total active testimonials: {total_count}")
        
    except Exception as e:
        print(f"❌ Error updating testimonials: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    asyncio.run(update_testimonials())

