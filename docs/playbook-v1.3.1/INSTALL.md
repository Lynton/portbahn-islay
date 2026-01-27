# AI Search Playbook Skill - Installation Instructions

## What You're Installing

A custom Claude skill that provides AI search optimization guidance across all your Claude interactions (claude.ai, Claude Code, API).

**Skill name:** `ai-search-playbook`  
**Version:** 1.3.1  
**Size:** ~35KB (SKILL.md + quick-reference.md + changelog)

---

## File Structure

```
/mnt/skills/user/ai-search-playbook/
├── SKILL.md                    (main skill file, ~25KB)
├── quick-reference.md          (operational guide, ~8KB)
└── changelog.md                (version history, ~2KB)
```

---

## Installation Steps

### Step 1: Create Skill Directory

In your Claude interface:

1. Navigate to **Settings → Profile → Skills**
2. Click **"Create New Skill"** or **"Upload Skill"**
3. Name the skill: `ai-search-playbook`
4. Description: "AI search optimization framework for content strategy and site architecture"

### Step 2: Upload Skill Files

**Option A: If uploading individually:**
1. Upload `SKILL.md` as the main skill file
2. Upload `quick-reference.md` as supporting documentation
3. Upload `changelog.md` as version tracking

**Option B: If uploading as directory:**
1. Create local directory: `ai-search-playbook/`
2. Place all three files in directory
3. Upload entire directory to Claude skills

### Step 3: Upload Full Playbook to Project

The skill references the complete playbook in project files:

1. Navigate to your project in Claude
2. Upload `playbook-v1.3.1.zip` to project files
3. Extract to: `/mnt/project/playbook-v1.3.1/`
4. Verify extraction: Check that README.md and all modules are present

**Note:** The skill will work without project files, but deep references require them.

---

## Verification

### Test the Skill is Active

In a new conversation:

**Test 1: Basic invocation**
```
"Use the AI Search Playbook skill. What are the core principles?"
```

Expected: Claude loads skill and summarizes entity-first architecture, query fan-out, passages over pages, etc.

**Test 2: Quick reference**
```
"Quick entity check for a property page"
```

Expected: Claude provides the 5-point entity validation checklist.

**Test 3: Decision tree**
```
"Should this be a page or a section?"
```

Expected: Claude walks through the decision tree from quick-reference.

### Test Project File Integration

```
"Reference playbook module 04-02 for chunking guidance"
```

Expected: Claude accesses `/mnt/project/playbook-v1.3.1/04-02-chunking-and-section-design.md`

---

## How to Use the Skill

### In Claude Chat (claude.ai)

**Explicit invocation:**
- "Use the AI Search Playbook skill"
- "Apply AEO guidelines to this content"
- "Check this against playbook standards"

**Implicit (Claude detects relevance):**
- "How should I structure this property page?"
- "Review this content for AI search optimization"
- "Is this entity definition clear enough?"

### In Claude Code

**Handoff pattern:**
```
Reference AI Search Playbook v1.3.1.

Key modules for this task:
- 04-02: Chunking guidelines  
- 06-02: Page design patterns
- 07-01: Pre-publish checklist

Build [deliverable] following these specs.
```

Claude Code will access skill + project files automatically.

### In API / Programmatic Use

If using Claude API with skills enabled, the skill is available in all contexts where the user profile is loaded.

---

## Maintenance

### When to Update

**Minor version updates (1.3.x):**
- Update SKILL.md version number
- Add notes to changelog.md
- No directory restructure needed

**Major version updates (1.4.0+):**
- Replace all files in skill directory
- Update project playbook files
- Review integration points

### Version Tracking

Current version tracked in:
1. SKILL.md header
2. changelog.md entries
3. README.md in project files

**Next scheduled review:** April 2026

---

## Troubleshooting

### "Skill not found"

**Check:**
1. Skill uploaded to `/mnt/skills/user/ai-search-playbook/`
2. SKILL.md present and properly formatted
3. Skill enabled in your profile settings

### "Can't access project files"

**Check:**
1. Playbook extracted to `/mnt/project/playbook-v1.3.1/`
2. File permissions allow read access
3. You're in the correct project context

### "Skill gives outdated guidance"

**Check:**
1. SKILL.md version number matches expected (v1.3.1)
2. changelog.md reflects recent updates
3. Quick-reference.md is updated version

**Solution:** Re-upload latest skill files from this package.

---

## What the Skill Provides

**Strategic guidance:**
- Entity-first architecture principles
- Query fan-out optimization strategies
- Multi-site coordination rules
- Content patterns and decision trees

**Operational support:**
- Pre-publish checklists
- Fast decision trees (30-second checks)
- Common failure mode detection
- Pattern libraries and examples

**Integration:**
- References full playbook modules in project
- Works across all Claude contexts
- Available to Claude Code for builds
- Versioned and maintained

---

## File Locations Reference

```
Skills:
/mnt/skills/user/ai-search-playbook/SKILL.md
/mnt/skills/user/ai-search-playbook/quick-reference.md
/mnt/skills/user/ai-search-playbook/changelog.md

Project files:
/mnt/project/playbook-v1.3.1/README.md
/mnt/project/playbook-v1.3.1/01-01-relevance-engineering-vs-seo.md
/mnt/project/playbook-v1.3.1/...
/mnt/project/playbook-v1.3.1/appendix-a-technical-context.md

Output files (for reference):
/mnt/user-data/outputs/SKILL.md
/mnt/user-data/outputs/quick-reference.md
/mnt/user-data/outputs/README.md
/mnt/user-data/outputs/appendix-a-technical-context.md
```

---

## Support

**For skill issues:**
- Verify version in SKILL.md header
- Check changelog.md for known issues
- Re-upload from canonical source

**For playbook content questions:**
- Reference full modules in project files
- Consult README.md for structure
- Use quick-reference.md for fast lookups

---

**Installation complete when:**
- ✅ Skill shows in Claude profile
- ✅ "Use AI Search Playbook skill" invokes correctly
- ✅ Quick reference accessible
- ✅ Project files readable by Claude Code

**Ready to use across all contexts.**
