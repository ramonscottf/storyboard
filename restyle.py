import json, urllib.request
ACCT="77f3d6611f5ceab7651744268d434342"; DB="790c1af9-b1ae-4bdb-9422-507c5eebaa8e"
H={"X-Auth-Email":"ramonscottf@gmail.com","X-Auth-Key":"b6bc70427e86661fc4fd23e84821f79f43d31","Content-Type":"application/json"}
def run(sql,params=None,label=""):
    req=urllib.request.Request(f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{DB}/query",
        data=json.dumps({"sql":sql,"params":params or []}).encode(),headers=H,method="POST")
    d=json.loads(urllib.request.urlopen(req,timeout=30).read())
    print(("  ok  " if d.get("success") else " FAIL ")+label)
    if not d.get("success"): print(d.get("errors")); raise SystemExit(1)
    return d

CANON = ("\n\n— STYLE RESET 2026-05-19 · TWO-LAYER RULE (overrides anything above if in conflict) —\n"
"This film is CEL ANIMATION OVER PAINTED BACKGROUNDS (the Studio-Ghibli convention).\n"
"LAYER 1 / BACKGROUND: loose impressionist watercolor + gouache. Soft, atmospheric, LOW detail. "
"Background objects (windows, tables, boards, buildings, crowds) are SUGGESTED with washes and color — "
"no crisp outlines, no fine detail. Like a painting set behind the actors.\n"
"LAYER 2 / MAIN CHARACTER(S): clean traditional 2D cel animation drawn ON TOP — confident ink linework, "
"flat color fills, simple soft shading, expressive-but-simple features. Match the "
"'CHAR STYLE — The Man Close-Up' reference exactly.\n"
"FIGURE–GROUND RULE (the whole point): the character ALWAYS carries more line definition and sharper "
"edges than the background. The background is ALWAYS looser/less-detailed than the character on it. "
"If character and background read at the same level of detail, it is WRONG — loosen the background "
"(this is the 'Boy in Cafeteria' failure: great character, background too tight).")

# fetch shots, append canon to illustrated shots only (skip audio + pure typography comps)
rows=run("SELECT id,shot_type,coalesce(chatgpt_prompt,'') p FROM shots ORDER BY id","",
         "fetch shots")['result'][0]['results']
SKIP_COMPS={15,19,23,24}  # transition / numbers / loop / end card = edit comps, rule N/A
applied=0
for r in rows:
    sid=r['id']; st=(r['shot_type'] or '')
    if st=='audio' or sid in SKIP_COMPS: 
        print(f"  skip #{sid} ({st or 'comp'})"); continue
    if "STYLE RESET 2026-05-19" in r['p']:
        print(f"  already #{sid}"); continue
    newp = r['p'] + CANON
    run("UPDATE shots SET chatgpt_prompt=?, updated_by='skippy' WHERE id=?",[newp,sid],f"restyle #{sid}")
    applied+=1
print(f"\nApplied two-layer canon to {applied} illustrated shots.")
