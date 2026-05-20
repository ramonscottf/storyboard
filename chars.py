import json, urllib.request
ACCT="77f3d6611f5ceab7651744268d434342"; DB="790c1af9-b1ae-4bdb-9422-507c5eebaa8e"
H={"X-Auth-Email":"ramonscottf@gmail.com","X-Auth-Key":"b6bc70427e86661fc4fd23e84821f79f43d31","Content-Type":"application/json"}
def run(sql,p=None,label=""):
    req=urllib.request.Request(f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{DB}/query",
        data=json.dumps({"sql":sql,"params":p or []}).encode(),headers=H,method="POST")
    d=json.loads(urllib.request.urlopen(req,timeout=30).read())
    print(("  ok  " if d.get("success") else " FAIL ")+label)
    if not d.get("success"): print(d.get("errors")); raise SystemExit(1)
    return d

CEL=("RENDER: cel-animation character drawn ON TOP of a soft painted background (Studio-Ghibli convention). "
"Clean confident ink linework, flat color fills, simple soft shading. Cartoon face on a real-proportioned body: "
"small dot-eyes with one bright catchlight, inked brows, peach skin with a round cheek blush, hair/beard as soft "
"wash shapes, mouth a single soft curve. Match 'CHAR STYLE — The Man Close-Up'. Character carries MORE line "
"definition and sharper edges than the background; background stays loose and low-detail. 3:2 landscape.")
SHEET=("MODEL-SHEET USE: this is the locked character reference (Flow Ingredient). Generate one clean ¾-front hero "
"render on a soft neutral cream watercolor backdrop (full figure visible), then use Flow's Images tab "
"(adjust camera angle / pose) to spin front, profile, and back from this same render so identity holds.")

C = {
"doug": dict(
 name="Doug — The Volunteer",
 desc=("ROLE: the Giving Machine host — accurate to the real program, where volunteers welcome visitors at the kiosks. "
  "He witnesses the moment that becomes the legend. Not a saint, not a salesman — a regular kind man on a cold night, "
  "who will tell this story for the rest of his life. EMOTIONAL INTENT: warmth without pity; he treats the stranger as an equal.\n\n"
  "AGE/BUILD: late 60s, average build, comfortable in himself. FACE: white short-cropped beard, kind eyes, easy unforced smile. "
  "HAIR: short grey under a cap. WARDROBE: grey wool herringbone flat cap, tan canvas chore coat, scarf, gloves off so his hands "
  "can gesture. PALETTE: warm tans, oatmeal, soft grey. POSTURE: relaxed, hands often in coat pockets or gesturing plainly; "
  "he leans in to listen, never looms."),
 prompt=("CHARACTER REFERENCE — DOUG, the Giving Machine volunteer host. Late 60s, average build, white short-cropped beard, "
  "kind eyes, easy smile. Grey wool herringbone flat cap, tan canvas chore coat, scarf. Standing relaxed, hands in coat "
  "pockets, mid-explaining gesture. Warm tan/oatmeal palette.\n\n"+CEL+"\n\n"+SHEET)),

"angel": dict(
 name="The Lunch Angel — The Stranger",
 desc=("ROLE: the heart of Act 1. He approaches the Giving Machines on a winter night, learns ten dollars feeds a kid, walks "
  "away, comes back with a folded $20 and the line that titles the film: 'Let's get two, then. Somebody did this for me.' "
  "He is the grown version of The Boy — same hazel eyes. DIGNITY NOTE (the ethical foundation of the whole film): he must "
  "NEVER look pitiful, dirty, or theatrical. He looks like someone's brother who had a hard year. Render him with the SAME "
  "warmth and care as the volunteer — the audience should feel kinship, not pity.\n\n"
  "AGE/BUILD: mid-to-late 40s, lean, slightly hunched against the cold. FACE: weathered, high cheekbones, warm intelligent "
  "HAZEL eyes (dignity and gentleness there); dark hair flecked grey at the temples, a little long and uneven; short "
  "untrimmed dark beard, a few weeks' growth. WARDROBE: heavy dark-olive winter coat worn at cuffs and collar; faded "
  "red-brown plaid flannel over a thermal henley; grey knit beanie pulled low; dark well-worn jeans; scuffed but solid work "
  "boots; a small canvas messenger bag or rolled bedroll over one shoulder — NEVER a trash bag. PALETTE: olive, oxblood "
  "plaid, charcoal grey. POSTURE: hands deep in pockets, shoulders forward against the cold; moves carefully, deliberately — "
  "a man used to being watched and judged."),
 prompt=("CHARACTER REFERENCE — THE MAN / THE LUNCH ANGEL. Mid-40s, lean, slightly hunched against cold. Weathered face, high "
  "cheekbones, warm HAZEL eyes with gentle dignity. Dark hair flecked grey, a little long; short untrimmed dark beard. "
  "Heavy dark-olive winter coat worn at cuffs; faded red-brown plaid flannel + thermal henley; grey knit beanie pulled low; "
  "well-worn jeans; scuffed work boots; small canvas messenger bag over one shoulder. Hands in pockets, deliberate. He looks "
  "like someone's brother who had a hard year — dignified, never pitiful or dirty.\n\n"+CEL+"\n\n"+SHEET)),

"boy": dict(
 name="The Boy — Flashback (1980s)",
 desc=("ROLE: the keystone. He is the man, 35 years earlier — the kid a stranger once fed. Shown in the #7 flashback and again "
  "in the #23 loop. His eyes must read as the SAME eyes as The Lunch Angel — that recognition is the engine of the film.\n\n"
  "AGE/BUILD: 8–9, small, slightly built. FACE: brown hair, warm HAZEL dot-eyes echoing the Man's; soft cheek blush; a mouth "
  "just beginning to open into relief. WARDROBE: slightly oversized hand-me-down shirt (1980s), plain. PALETTE: warm sepia "
  "memory tones (matches Movement I), softer/yellower than present-day. POSTURE: alone at a cafeteria table, hands in lap, "
  "looking up as a tray slides in from off-frame."),
 prompt=("CHARACTER REFERENCE — THE BOY (1980s flashback). 8–9 years old, small, brown hair, warm HAZEL dot-eyes (the SAME eyes "
  "as The Man), soft cheek blush, mouth just opening into relief. Slightly oversized hand-me-down 1980s shirt. WARM SEPIA "
  "MEMORY TONE, softer and yellower than the present-day scenes.\n\n"+CEL+"\n\n"+SHEET)),

"mateo": dict(
 name="Mateo",
 desc=("ROLE: the child at the heart of the present-day story. Eight, a Davis County student, whose family is behind and afraid "
  "of attention, so he doesn't eat. He is not the Man and not the Boy — he is the NEXT one, the kid we feed today who could be "
  "the somebody who comes back. EMOTIONAL INTENT: not crying, not pitiful — QUIET. Patient. Careful. The kind of patient that "
  "doesn't belong on an eight-year-old; an eight-year-old practicing invisibility.\n\n"
  "AGE/BUILD: 8, real-proportioned. FACE: brown hair, DARK eyes (his own — distinct from the hazel thread), soft cheek blush, "
  "a small calm mouth-line. WARDROBE: a slightly oversized sweatshirt, ordinary. PALETTE: brighter, more saturated present-day "
  "daylight (NOT memory tone). POSTURE: backpack still on his shoulders, hands folded in his lap, looking down at the empty "
  "table where a tray would go."),
 prompt=("CHARACTER REFERENCE — MATEO. 8 years old, real-proportioned, brown hair, DARK dot-eyes, soft cheek blush, small calm "
  "mouth. Slightly oversized ordinary sweatshirt, backpack still on shoulders. Quiet, patient, careful expression. BRIGHTER "
  "SATURATED PRESENT-DAY DAYLIGHT tone (not sepia memory).\n\n"+CEL+"\n\n"+SHEET)),

"machines": dict(
 name="The Giving Machines — Light the World",
 desc=("ROLE: the third, silent character of Act 1 — MORE than background. The warm, glowing source of the mercy the whole film "
  "is about; the still point the Man walks toward; the place a stranger learns what ten dollars can do. Treat them with "
  "reverence, not as set dressing. Their GLOW is their expression — the 'Light of the World' motif made literal.\n\n"
  "WHAT THEY ARE (accuracy is non-negotiable — this film hopes the Church may share it): the real Light the World Giving "
  "Machines of The Church of Jesus Christ of Latter-day Saints. A row of THREE cherry-red kiosks shaped like vending machines, "
  "but instead of snacks the illuminated faces show grids of donation CARDS (food, clean water, clothing, education, livestock). "
  "Official 'Giving Machines' wordmark; cherry/cardinal red bodies; warm internal light spilling out. The Church covers all "
  "costs so 100% of every donation goes to charity (context for tone, not shown on screen). In our story, one card on the "
  "machine is the school-lunch donation — the seed of Lunch Angels.\n\n"
  "PALETTE: cherry red + warm gold glow against lavender-blue snowy night. PRESENCE: they sit in fresh snow, light pooling on "
  "wet pavement; rendered crisper and more luminous than the loose painted village behind them — they read as a character, not "
  "scenery."),
 prompt=("CHARACTER REFERENCE — THE GIVING MACHINES (Light the World, The Church of Jesus Christ of Latter-day Saints). A row of "
  "THREE cherry-red kiosks shaped like vending machines, illuminated front faces showing a grid of donation CARDS (food, water, "
  "clothing, education, livestock); accurate official 'Giving Machines' wordmark across the top; warm golden internal glow "
  "spilling onto fresh snow and wet pavement; lavender-blue snowy village night behind. One donation card subtly highlighted as "
  "the school-lunch option. The machines are the HERO element: render them crisp, luminous, reverent — clearly a presence, not "
  "scenery — while the village behind stays loose painterly.\n\n"+CEL.replace('Cartoon face on a real-proportioned body','(object, not a person — no face)').replace("Match 'CHAR STYLE — The Man Close-Up'. ","")+"\n\n"
  "MODEL-SHEET USE: lock a hero front render of the three machines, a ¾ angle, and one tight detail of the illuminated "
  "school-lunch donation card. The glow is the 'expression' — keep it consistent across angles.")),
}

NOW=1779000000000
order=["doug","angel","boy","mateo"]
for cid in order:
    c=C[cid]
    run("UPDATE characters SET name=?, description=?, chatgpt_prompt=?, updated_at=?, updated_by='skippy' WHERE id=?",
        [c['name'],c['desc'],c['prompt'],NOW,cid], f"UPDATE {cid}")
m=C["machines"]
run("INSERT INTO characters (id,name,description,chatgpt_prompt,notes,status,updated_at,updated_by) VALUES ('machines',?,?,?,?, 'pending', ?, 'skippy')",
    [m['name'],m['desc'],m['prompt'],"Brand accuracy non-negotiable (Church pickup goal). Foreground character: crisper/more luminous than the loose painted village.",NOW], "INSERT machines")
print("\nDONE — 4 updated, 1 inserted.")
