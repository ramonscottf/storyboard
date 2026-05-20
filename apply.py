import json, urllib.request

ACCT="77f3d6611f5ceab7651744268d434342"
DB="790c1af9-b1ae-4bdb-9422-507c5eebaa8e"
URL=f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{DB}/query"
H={"X-Auth-Email":"ramonscottf@gmail.com","X-Auth-Key":"b6bc70427e86661fc4fd23e84821f79f43d31","Content-Type":"application/json"}

def run(sql, params=None, label=""):
    body=json.dumps({"sql":sql,"params":params or []}).encode()
    req=urllib.request.Request(URL,data=body,headers=H,method="POST")
    d=json.loads(urllib.request.urlopen(req,timeout=30).read())
    ok=d.get("success")
    print(("  ok  " if ok else " FAIL ")+ (label or sql[:50]))
    if not ok: print("    ",d.get("errors")); raise SystemExit(1)
    return d

# style boilerplate shared by all image prompts
STYLE=("STYLE: Soft impressionist watercolor BACKGROUND (heavy paper grain, deckled edges, "
"atmospheric particles, glowing lights, wet reflections, warm-cream or lavender tones, dark "
"silhouetted background figures human-proportioned but no faces). Plus REALISTICALLY PROPORTIONED "
"CHARACTERS with cartoon face detail (clean ink lines, flat washes, SMALL CARTOON DOT-EYES with one "
"tiny bright catchlight, no realistic iris, peach skin with one round cheek blush, hair/beards as "
"soft wash shapes, mouths as single curved lines). Real-shaped bodies, cartoon faces — never "
"half-half, the face commits fully. 3:2 landscape.")

FLASH_PROMPT=("Ingredients: CHAR STYLE — Boy in Cafeteria (1980s memory). THE KEYSTONE FLASHBACK — what the "
"man is remembering, shown not told. Hard cut from the man's face.\n\n"
"FRAMING: Wide-medium, the SAME composition as Mateo's table shot — a boy alone at the end of a long "
"cafeteria table — but here a lunch tray is sliding IN from the frame edge. We do not see who places it. "
"The boy looks up.\n\n"
"SHOT: THE BOY — 8–9 years old, brown hair, warm HAZEL dot-eyes with one bright catchlight — the SAME "
"eyes we just saw on the man (that is the entire point). Real-proportioned child body, cartoon face: "
"peach skin with one round cheek blush, hair as soft brown wash, mouth a small soft curve just beginning "
"to open into relief. Slightly oversized hand-me-down shirt. 1980s cafeteria detail: pale institutional "
"tile, a beige molded plastic tray sliding in, a small carton of milk, soft golden fluorescent warmth. "
"Other kids in dark soft silhouette, no faces. WARM YELLOW-AMBER MEMORY TONE — sepia-warm, matching the "
"village palette of Movement I, NOT the brighter present-day cafeteria.\n\n"+STYLE)

LOOP_PROMPT=("EDIT COMP — no new image generated. Assemble from three locked stills: winner of #6 (the man's "
"face), winner of #7 (the boy, flashback), winner of #21 (Mateo eats). Match-cut on the eyes; equalize "
"warm tone across all three; fast rhyming triptych (~1.5–2 sec each). Image-only; no text.")

# ---- 1) renumber to open id=7 and id=23 ----
run("UPDATE shots SET id = id + 100 WHERE id >= 7", label="shift 7..22 -> 107..122")
run("UPDATE shots SET id = id - 99 WHERE id BETWEEN 107 AND 121", label="land old7..old21 -> 8..22")
run("UPDATE shots SET id = id - 98 WHERE id = 122", label="land old22 -> 24")

# ---- 2) insert flashback at id=7 ----
run("""INSERT INTO shots (id,title,time_code,shot_type,aspect,description,chatgpt_prompt,flow_motion_prompt,notes,character_refs,status,updated_at,updated_by)
VALUES (7,?,?,?,?,?,?,'',?,?, 'pending', ?, 'skippy')""",
[ "The Boy — Flashback (1980s)", "0:44–0:48", "scene", "3:2",
  "FLASHBACK — what the man is remembering, shown not told. Hard cut from the man's face (#6). Same composition as Mateo's table (Movement II) — a boy alone at the end of a cafeteria table — but a lunch tray slides IN from off-frame. The boy looks up. Hold one beat on his hazel eyes — the SAME eyes as the man at the machines — then cut back. This is the seed of the loop.",
  FLASH_PROMPT,
  "KEYSTONE (decision locked 2026-05-19). ~3–4 sec, lives inside the Recognition beat so runtime barely moves. Warm-yellow MEMORY tone to match Movement I. The tray ARRIVES here (the boy gets fed) — it rhymes against Mateo's EMPTY space, where no tray has come yet. Eyes must match the man (#6) and pay off at the loop (#23).",
  "The Boy — Flashback (1980s)", 1779000000000 ], label="INSERT flashback #7")

# ---- 3) insert loop comp at id=23 ----
run("""INSERT INTO shots (id,title,time_code,shot_type,aspect,description,chatgpt_prompt,flow_motion_prompt,notes,character_refs,status,updated_at,updated_by)
VALUES (23,?,?,?,?,?,?,'',?,?, 'pending', ?, 'skippy')""",
[ "The Loop — Three Faces", "2:50–2:56", "comp", "3:2",
  "THE LOOP MADE EXPLICIT (decision locked 2026-05-19). A three-beat match-cut built in edit from existing winners: Mateo mid-bite (now) → the Boy mid-relief (1980s flashback, #7) → the Man's face at the machines (#6). Same framing, same hazel eyes, same mercy. Three kids who are the same kid. The hand that feeds is always off-frame — because the hand is the audience.",
  LOOP_PROMPT,
  "Built in After Effects/Premiere from existing winners — depends on #7 still being generated first. Leads straight into the end card (#24).",
  "Mateo, The Boy — Flashback (1980s), The Lunch Angel — The Stranger", 1779000000000 ], label="INSERT loop #23")

# ---- 4) VO lift (by NEW id) ----
vo = {
 6:  ("The man (quiet)", "Somebody did that for me once."),
 14: ("Narrator V.O.", "He walked back into the night, and we never learned his name."),
 17: ("Narrator V.O.", "Mateo's family is behind. Not by much. By enough. They've decided — the way frightened people do — that it's safer for him to be hungry than seen. So he folds his hands, and waits out the lunch hour. He's good at it."),
 19: ("On screen / Narrator", "Ten dollars buys a week. Forty, a month. Three hundred sixty dollars buys a child a year of lunches they would not otherwise eat."),
 20: ("Narrator V.O.", "Somebody slides a tray in front of him. He doesn't see who. He never will. That's the point."),
}
for sid,(who,q) in vo.items():
    run("UPDATE shots SET vo_who=?, vo_quote=?, updated_by='skippy' WHERE id=?", [who,q,sid], label=f"VO #{sid}")

# ---- 5) note updates that the loop/flashback change ----
run("UPDATE shots SET notes = notes || '  // 2026-05-19: hard cut to flashback (#7) lands on this line.' WHERE id=6", label="note #6 cut")
run("UPDATE shots SET notes = notes || '  // 2026-05-19: dissolve now also rhymes the BOY''s FULL tray (flashback #7) into Mateo''s EMPTY space — same framing, tray vs no-tray.' WHERE id=15", label="note #15 rhyme")
run("UPDATE shots SET notes = notes || '  // FACT-CHECK before final: confirm the \"one in seven / unpaid lunch balance\" figure for Davis County; swap in the real DEF number if different.' WHERE id=18", label="note #18 factcheck")

print("\nDONE.")
