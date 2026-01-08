# 📝 Key Highlights Editing Guide

## Overview
The **Key Highlights** sections for both **Youth Skills & Livelihood** and **Senior Citizens Services** programs are now fully editable from the admin panel using the **Dynamic Items** feature.

---

## 🎯 Where to Find Key Highlights on Website

### Youth Skills & Livelihood
- **Page:** Programs (`/programs`)
- **Tab:** Youth Skills & Livelihood
- **Section:** Blue box with checkmarks labeled "Key Highlights"

### Senior Citizens Services
- **Page:** Programs (`/programs`)
- **Tab:** Senior Citizens Services
- **Section:** Yellow box with checkmarks labeled "Key Highlights"

---

## ✏️ How to Edit Key Highlights (Step-by-Step)

### Step 1: Access Admin Panel
1. Go to: **http://localhost:3000/admin**
2. Login with your credentials

### Step 2: Navigate to Advanced Page Management
1. In the left sidebar, click **"Advanced Page Management"** (🎨 icon)

### Step 3: Find the Program Section to Edit

#### For Youth Skills & Livelihood:
- Look for section titled: **"Youth Skills and Livelihood"**
- Section Identifier: `youth-skilling` or `hero`

#### For Senior Citizens Services:
- Look for section titled: **"Senior Citizens Services"**
- Section Identifier: `senior-care` or `hero`

### Step 4: Click Edit Button
- Click the **Edit** button (pencil icon) on the appropriate section

### Step 5: Add Key Highlights Using Dynamic Items

In the **Edit Section** form, scroll to the **"Dynamic Items (Lists, Features, etc.)"** section:

1. Click **"+ Add Item"** button
2. Fill in the highlight details:
   - **Title:** Can be left blank OR add a label (e.g., "Training", "Salary", "Placement")
   - **Description:** The main highlight text (e.g., "Vocational training in CRS, ITES-BPO, Nursing Assistant")
3. Leave **Image URL** blank (not needed for highlights)
4. Click **"Save"** or continue adding more items

### Step 6: Save the Section
- Click **"Update Section"** button at the bottom
- Your changes will appear immediately on the website

---

## 📋 Examples of Key Highlights

### Youth Skills & Livelihood Examples:

| Title | Description |
|-------|-------------|
| Training | Vocational training in CRS, ITES-BPO, Nursing Assistant |
| Placement | High placement rates with reputed employers |
| Salary | Average salary: ₹8,700 - ₹13,946/month |
| Skills | Soft skills and personality development |

### Senior Citizens Services Examples:

| Title | Description |
|-------|-------------|
| Health | Regular health check-ups and medical support |
| Community | Social activities and community engagement |
| Wellness | Physiotherapy and wellness programs |
| Mental Health | Mental health and counseling support |

---

## 💡 Best Practices

### 1. **Keep It Concise**
- Each highlight should be one short sentence
- Maximum 60-80 characters for readability

### 2. **Use Clear Language**
- Focus on benefits and key features
- Avoid jargon or technical terms

### 3. **Ideal Number of Highlights**
- **2-6 highlights** work best
- They display in a 2-column grid on desktop
- Stack vertically on mobile

### 4. **Title vs Description**
- **Option A:** Use only Description field (simpler)
  - Description: "Vocational training in CRS, ITES-BPO"
  - Display: ✓ Vocational training in CRS, ITES-BPO

- **Option B:** Use both Title and Description (more structured)
  - Title: "Training Programs"
  - Description: "CRS, ITES-BPO, Nursing Assistant"
  - Display: ✓ Training Programs: CRS, ITES-BPO, Nursing Assistant

### 5. **Reordering Highlights**
- Items display in the order you add them
- To reorder: delete and re-add in desired sequence
- Or edit the Display Order in section settings

---

## 🔄 How to Update Existing Highlights

### Method 1: Edit Individual Items
1. In the Edit Section form
2. Find the item in Dynamic Items list
3. Click **Edit** next to the item
4. Update Title/Description
5. Click **Update Section**

### Method 2: Remove and Re-add
1. Click **Delete** next to items you want to change
2. Add new items with updated content
3. Click **Update Section**

---

## ❌ How to Remove Highlights

### Remove All Highlights (Show Defaults)
1. In Edit Section form
2. Delete all items in "Dynamic Items" section
3. Click **Update Section**
4. Website will display default hardcoded highlights

### Remove Specific Highlights
1. Click **Delete** (🗑️) next to the item
2. Click **Update Section**

---

## 🎨 Formatting & Display

### Current Display Style:
- **Background Color:**
  - Youth: Light Blue (`bg-blue-50`)
  - Seniors: Light Yellow (`bg-yellow-50`)
- **Icon:** Green checkmark (✓) for each item
- **Layout:** 2-column grid on desktop, stacked on mobile
- **Typography:** Gray text (`text-gray-700`)

### What Gets Displayed:
```
✓ [Title]: [Description]   or   ✓ [Description only]
```

---

## 🚨 Troubleshooting

### Problem: Changes not appearing on website
**Solution:**
1. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
2. Check if section is marked as "Active (visible on site)"
3. Verify you're editing the correct section (check Section Title)

### Problem: Highlights look wrong or broken
**Solution:**
1. Ensure Title and/or Description are filled
2. Don't add HTML markup (plain text only)
3. Keep text length reasonable (under 100 characters)

### Problem: Want to restore defaults
**Solution:**
1. Delete all items in Dynamic Items section
2. Click Update Section
3. Default highlights will automatically appear

---

## 🔐 Admin Access Required

**Note:** Only users with admin privileges can edit Key Highlights through the Advanced Page Management panel.

---

## 📊 Current Default Highlights

### Youth Skills & Livelihood (Defaults)
If no items are added, these defaults show:
1. ✓ Vocational training in CRS, ITES-BPO, Nursing Assistant
2. ✓ High placement rates with reputed employers
3. ✓ Average salary: ₹8,700 - ₹13,946/month
4. ✓ Soft skills and personality development

### Senior Citizens Services (Defaults)
If no items are added, these defaults show:
1. ✓ Regular health check-ups and medical support
2. ✓ Social activities and community engagement
3. ✓ Physiotherapy and wellness programs
4. ✓ Mental health and counseling support

---

## 🎯 Quick Reference

| Action | Location | Steps |
|--------|----------|-------|
| **Edit Youth Highlights** | Admin → Advanced Page Management | Find "Youth Skills and Livelihood" → Edit → Add Dynamic Items |
| **Edit Senior Highlights** | Admin → Advanced Page Management | Find "Senior Citizens Services" → Edit → Add Dynamic Items |
| **Add New Highlight** | Edit Section Form | Dynamic Items → + Add Item → Fill fields → Update |
| **Remove Highlight** | Edit Section Form | Dynamic Items → Delete (🗑️) → Update Section |
| **Restore Defaults** | Edit Section Form | Delete all Dynamic Items → Update Section |

---

## 📞 Need Help?

If you encounter issues or need assistance:
1. Check this guide thoroughly
2. Verify admin access permissions
3. Test changes on localhost before live deployment
4. Contact technical support if problems persist

---

**Last Updated:** January 2026  
**Version:** 1.0

