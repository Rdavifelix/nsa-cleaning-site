#!/usr/bin/env python3
"""Generates one page per city in the service area: src/pages/house-cleaning-<city>-ny.html

    python3 scripts/gen_cities.py

Albany has no page here on purpose. The home page is the Albany page (its title, its H1 and the
Google Business Profile all point there), and a second Albany page would compete with it for the
same searches. /service-area links Albany to the home page.

Every fact about a city below comes from a source we checked (Wikipedia, October 2026), and every
drive time was measured from the office pin on the Google Business Profile with OSRM. Nothing here
says NSA Cleaning did a particular job in a particular city: the photos are real NSA jobs, but we do
not know where each one was taken, so captions never name a city.

Edit the data, rerun the script, then check `git diff --stat src/pages` before committing: this
script owns these files, and a hand edit to a generated page is overwritten on the next run.
"""
import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "pages"
MANIFEST = json.loads((ROOT / "raw-images" / "manifest.json").read_text())
PHOTOS = {im["slug"]: im for im in MANIFEST["images"]}

OFFICE_EMBED = ("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2930.487625399074!2d-73.7029424!3d42.7357344"
                "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa1dab3add1f85aad%3A0xaf02cdd383204772"
                "!2sNSA%20Cleaning%20LLC!5e0!3m2!1sen!2sus!4v1793029067629!5m2!1sen!2sus")


def embed(pb):
    """Official Google Maps share embed ("Share > Embed a map"), region switched to the US."""
    return "https://www.google.com/maps/embed?pb=" + pb.replace("!1sen!2sbr", "!1sen!2sus")


SERVICES = {
    "recurring": ("/recurring-cleaning", "Recurring house cleaning", "weekly, bi-weekly or monthly, with the same standard every visit"),
    "deep": ("/deep-cleaning", "Deep cleaning", "top to bottom, inside the oven and fridge on request, baseboards, grout and buildup"),
    "move": ("/move-in-move-out-cleaning", "Move-in and move-out cleaning", "an empty home cleaned for the next keys, inside cabinets and appliances"),
    "airbnb": ("/airbnb-cleaning", "Airbnb and rental turnovers", "beds made, towels folded, kitchen and baths reset between guests"),
    "postcon": ("/post-construction-cleaning", "Post-construction cleaning", "dust, debris and residue cleared after a renovation or a new build"),
    "commercial": ("/commercial-cleaning", "Office and commercial cleaning", "offices, clinics, restaurants and common areas, scheduled around your hours, 24/7"),
    "power": ("/power-washing", "Power washing", "decks, siding, docks and walkways"),
    "carpet": ("/carpet-cleaning", "Carpet and upholstery cleaning", "carpet shampoo plus sofas and upholstery"),
    "painting": ("/painting", "Interior and exterior painting", "residential and commercial, with the prep and the cleanup included"),
}

EXTRA_FAQ = {
    "supplies": ("Do you bring your own cleaning supplies?",
                 "Yes. We bring all supplies and equipment unless you prefer we use yours. Pet- and family-friendly products are available, and we agree on them during the walk-through."),
    "languages": ("Do your cleaners speak Spanish or Portuguese?",
                  "Yes. We work in English, Spanish and Portuguese, so you can talk to us in the language you are most comfortable with."),
    "insured": ("Is NSA Cleaning insured?",
                "Yes. NSA Cleaning is insured. If something is damaged during a cleaning we cover it, and larger items are covered by our insurance."),
    "pets": ("Can you clean with pets in the house?",
             "Yes. We prefer pets in a crate or a closed room while we work, and friendly pets are fine. We sort it out with each client before the first visit."),
    "cancel": ("What if I need to cancel?",
               "Give us 24 hours' notice and there is no charge. Cancellations with less than 24 hours' notice carry a 30% fee."),
    "guarantee": ("What if I'm not happy with the cleaning?",
                  "Tell us. Our work comes with a satisfaction guarantee backed by our service contract, and we come back to fix what we missed."),
}

# fmt: off
CITIES = [
  dict(slug="watervliet", route="We are on 25th Street, a block off NY 32, so most of Watervliet is a few minutes from the door.", name="Watervliet", county="Albany County", pop="10,375", miles=None, minutes=None,
       photo="nsa-cleaning-branded-company-car", map=None,
       eyebrow="Albany County · Our home base",
       lead="Our office is at 321 25th St in Watervliet, so this is the city we can reach fastest. We clean apartments, houses and offices here every week, with recurring plans, deep cleans, move-outs and commercial cleaning around your hours.",
       about=("Watervliet is a city of about 10,375 people in northeastern Albany County, bordered by the town of Colonie on three sides. It is known as \"the Arsenal City\" for the Watervliet Arsenal, the oldest continuously active arsenal in the United States.",
              "Because we are based here, Watervliet is where short-notice requests are easiest for us to fit in, and where a recurring plan is simplest to keep on the same day and time."),
       focus=["recurring", "deep", "move", "commercial", "carpet", "painting"],
       local_q=("How close is NSA Cleaning to Watervliet?",
                "We are in Watervliet. Our office is at 321 25th St, Watervliet, NY 12189, a few minutes from anywhere in the city."),
       extra="cancel", near=["troy", "cohoes", "latham", "colonie"]),

  dict(slug="troy", route="We cross the Hudson on NY 2, which makes Troy the shortest drive we make.", name="Troy", county="Rensselaer County", pop="51,401", miles=1.3, minutes=4,
       photo="bedroom-hardwood-floor-after-cleaning", map="!1m18!1m12!1m3!1d93761.69052358967!2d-73.67786100000001!3d42.74493449999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de0fa74c108773%3A0x33117ef9f5a4723c!2sTroy%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028747526!5m2!1sen!2sbr",
       eyebrow="Rensselaer County · Across the river from our office",
       lead="Troy is just across the Hudson from our Watervliet office. We clean homes, apartments and rentals here, and a lot of our Troy work is move-in and move-out cleaning for tenants and landlords.",
       about=("Troy is the county seat of Rensselaer County, with about 51,401 residents. It is home to Rensselaer Polytechnic Institute, Hudson Valley Community College and Russell Sage College.",
              "With three colleges in town, apartments change hands at the start and end of every semester. That is when a move-out clean pays for itself: a tenant gets the place ready for inspection, and a landlord gets it ready for the next lease."),
       focus=["move", "recurring", "deep", "postcon", "commercial", "painting"],
       local_q=("Do you clean apartments between tenants in Troy?",
                "Yes. Move-in and move-out cleaning is one of the jobs we do most in Troy, for tenants leaving a lease and for landlords turning a unit over. We clean inside cabinets, appliances and closets so the place is ready for the next keys."),
       extra="supplies", near=["watervliet", "cohoes", "rensselaer", "east-greenbush"]),

  dict(slug="cohoes", route="We drive up NY 32 along the river to get to Cohoes.", name="Cohoes", county="Albany County", pop=None, miles=2.9, minutes=7,
       photo="bathtub-wide-after-deep-cleaning", map="!1m18!1m12!1m3!1d23429.955420304617!2d-73.70423944999999!3d42.77261005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de11e83563dead%3A0x9a300acf959eaa73!2sCohoes%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028804747!5m2!1sen!2sbr",
       eyebrow="Albany County · About 7 minutes from our office",
       lead="Cohoes is about 7 minutes from our Watervliet office. We clean houses and apartments across the city, from recurring plans to deep cleans that take care of the buildup older homes collect.",
       about=("Cohoes sits in the northeast corner of Albany County. It is called \"the Spindle City\" for the textile mills that drove its growth in the 19th century, and the Harmony Mills district is listed as a historic district.",
              "Older housing tends to hold dust in trim, radiators and corners that a weekly wipe-down never reaches. A first deep clean resets the place, and a recurring plan keeps it there."),
       focus=["deep", "recurring", "move", "carpet", "painting", "commercial"],
       local_q=("Do you do deep cleaning in older Cohoes homes?",
                "Yes. A deep clean goes into the trim, baseboards, grout and the buildup a regular clean skips. In older homes we usually recommend starting with one, then switching to a recurring plan."),
       extra="pets", near=["watervliet", "troy", "latham", "halfmoon"]),

  dict(slug="latham", route="We head west on NY 2 to get to Latham.", name="Latham", county="Albany County", pop="13,680", miles=2.5, minutes=5,
       photo="living-room-sectional-after-cleaning", map="!1m18!1m12!1m3!1d23440.923623934723!2d-73.7482275!3d42.7436095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de0dd1ddaaf189%3A0x21f90d817863ebcd!2sLatham%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028838241!5m2!1sen!2sbr",
       eyebrow="Albany County · About 5 minutes from our office",
       lead="Latham is about 5 minutes from our Watervliet office. We clean homes here on recurring plans, and we clean offices and commercial spaces along the Route 9 corridor after hours.",
       about=("Latham is a hamlet in the town of Colonie, a dense suburb north of Albany, with about 13,680 residents. U.S. Route 9, Interstate 87 and NY Route 7 all run through it.",
              "With the Northway and Route 9 running through town, Latham mixes family homes with offices and businesses. Our commercial crews work around business hours, so an office can be cleaned before it opens or after it closes."),
       focus=["recurring", "commercial", "deep", "move", "carpet", "power"],
       local_q=("Can you clean our Latham office after hours?",
                "Yes. Commercial cleaning is available 24/7, so we can clean before you open, after you close or on weekends. We agree on the schedule and the checklist during a short walk-through."),
       extra="insured", near=["colonie", "watervliet", "cohoes", "clifton-park"]),

  dict(slug="colonie", route="We get to Colonie on NY 2 and I-87.", name="Colonie", county="Albany County", pop="85,590", miles=8.6, minutes=15,
       photo="master-bedroom-swan-towels-after-cleaning", map="!1m18!1m12!1m3!1d93757.46538102753!2d-73.81447899999999!3d42.747727999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de0ce1bf7cdb8d%3A0x577610d40a5db931!2sColonie%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028886615!5m2!1sen!2sbr",
       eyebrow="Albany County · About 15 minutes from our office",
       lead="Colonie is about 15 minutes from our Watervliet office. Most of what we do here is recurring house cleaning for busy households, plus deep cleans and move-outs when a home changes hands.",
       about=("Colonie is a town in Albany County with about 85,590 residents, the most populous suburb of Albany. It takes up roughly 11% of the county and includes several hamlets.",
              "In a town this size, most of our requests are for the same thing: a dependable recurring plan for a family home. Weekly or bi-weekly visits keep a house where you want it without spending your weekend on it."),
       focus=["recurring", "deep", "move", "carpet", "commercial", "power"],
       local_q=("How often should I schedule house cleaning in Colonie?",
                "Most families pick bi-weekly. Weekly suits busy households with kids or pets, and monthly works for smaller homes that stay tidy. We usually start with a deep clean, then keep the plan on the same day and time."),
       extra="guarantee", near=["latham", "guilderland", "schenectady", "watervliet"]),

  dict(slug="schenectady", route="We drive out on NY 7 and NY 2 to get to Schenectady.", name="Schenectady", county="Schenectady County", pop="67,047", miles=13.9, minutes=29,
       photo="bathroom-hex-tile-after-deep-cleaning", map="!1m18!1m12!1m3!1d46836.48315576938!2d-73.9381435!3d42.8035646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de6dfd3575f8a5%3A0x19b2708d6f12b27a!2sSchenectady%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028895513!5m2!1sen!2sbr",
       eyebrow="Schenectady County · About 30 minutes from our office",
       lead="Schenectady is about 30 minutes from our Watervliet office. We clean homes, apartments and offices across the city, with recurring plans, deep cleans, move-outs and commercial cleaning.",
       about=("Schenectady is the county seat of Schenectady County and, with about 67,047 residents, the ninth-most populous city in New York. It is home to Union College, chartered in 1795, and it is where General Electric grew into a national company.",
              "Between a college, older city homes and a business district, Schenectady keeps our residential and commercial crews busy in about equal measure. Move-outs peak around the end of the school year, and offices book us for evening and weekend cleaning."),
       focus=["recurring", "move", "deep", "commercial", "postcon", "carpet"],
       local_q=("Do you clean offices in Schenectady?",
                "Yes. We clean offices, clinics, restaurants and building common areas in Schenectady, 24/7, scheduled around your hours. We set the scope and the checklist with you during a walk-through."),
       extra="languages", near=["guilderland", "colonie", "clifton-park", "ballston-spa"]),

  dict(slug="rensselaer", route="We come down I-787 and cross the river on US 9 to get to Rensselaer.", name="Rensselaer", county="Rensselaer County", pop="9,210", miles=8.3, minutes=15,
       photo="living-room-slat-wall-tv-after-cleaning", map="!1m18!1m12!1m3!1d46958.476520298005!2d-73.7309765!3d42.64217849999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de082c61f3d31d%3A0x717b5aebc943c61d!2sRensselaer%2C%20NY%2012144%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028904701!5m2!1sen!2sbr",
       eyebrow="Rensselaer County · About 15 minutes from our office",
       lead="Rensselaer is about 15 minutes from our Watervliet office. We clean homes and apartments here on recurring plans, and we schedule visits while you are at work so you come home to a clean place.",
       about=("Rensselaer is a city of about 9,210 people on the east bank of the Hudson, directly across from Albany. It grew into a railroad hub, and in 2020 the Albany-Rensselaer station was the ninth-busiest Amtrak station in the country.",
              "A lot of people here commute. A recurring plan set for a weekday lets us clean while the house is empty, and you never have to rearrange your day around us."),
       focus=["recurring", "deep", "move", "airbnb", "carpet", "commercial"],
       local_q=("Can you clean while I'm at work?",
                "Yes. Many of our Rensselaer clients are out during the day, so we clean then. We agree on access during the first visit, and we keep the same day and time every week or two."),
       extra="insured", near=["east-greenbush", "troy", "watervliet", "delmar"]),

  dict(slug="east-greenbush", route="We take I-787 and then I-90 east across the river to East Greenbush.", name="East Greenbush", county="Rensselaer County", pop="16,748", miles=11.4, minutes=18,
       photo="white-kitchen-quartz-island-after-cleaning", map="!1m18!1m12!1m3!1d46980.533079032364!2d-73.69511345!3d42.612947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dde286a66ba81b%3A0xc2b2fb0b7f5e994d!2sEast%20Greenbush%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028914370!5m2!1sen!2sbr",
       eyebrow="Rensselaer County · About 18 minutes from our office",
       lead="East Greenbush is about 18 minutes from our Watervliet office. We clean family homes here on recurring plans, and we take deep cleans, carpet cleaning and power washing for the outside of the house.",
       about=("East Greenbush is a town in Rensselaer County with about 16,748 residents, a suburb of Albany. It is mostly suburban along its main roads and rural in its southwestern and northeastern corners, and I-90 crosses it.",
              "Suburban homes here usually come with a deck, siding and a driveway, so we often pair an inside cleaning plan with a power washing visit in spring or fall."),
       focus=["recurring", "deep", "power", "carpet", "move", "painting"],
       local_q=("Do you power wash decks and siding in East Greenbush?",
                "Yes. We power wash decks, siding, docks and walkways. Many clients book it in spring to clear the winter, and add it to their regular house cleaning plan."),
       extra="pets", near=["rensselaer", "troy", "delmar", "watervliet"]),

  dict(slug="delmar", route="We take I-787 south and then NY 443, Delaware Avenue, into Delmar.", name="Delmar", county="Albany County", pop=None, miles=12.5, minutes=21,
       photo="bedroom-white-bedding-towel-animals-airbnb", map="!1m18!1m12!1m3!1d23485.713415801918!2d-73.82906245!3d42.62501745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dddfb2967d47a3%3A0x9ab3c4c9ab4e5d4e!2sDelmar%2C%20Bethlehem%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028923275!5m2!1sen!2sbr",
       eyebrow="Albany County · About 20 minutes from our office",
       lead="Delmar is about 20 minutes from our Watervliet office. We clean homes here on weekly and bi-weekly plans, and we handle deep cleans and move-in cleaning when a family arrives.",
       about=("Delmar is a hamlet in the town of Bethlehem, in Albany County, a suburb of the city of Albany. Delaware Avenue (NY Route 443) runs through it as its main street, and in 2005 CNN/Money Magazine named the Delmar ZIP code one of the best places to live in America.",
              "Delmar is a neighborhood people settle into, so the request we hear most is a steady recurring plan, with a deep clean first to bring the house up to standard."),
       focus=["recurring", "deep", "move", "carpet", "painting", "power"],
       local_q=("Do you offer move-in cleaning in Delmar?",
                "Yes. We clean an empty house before you unpack: inside cabinets, closets and appliances, bathrooms and floors. It is easier to do before the furniture arrives than after."),
       extra="guarantee", near=["guilderland", "east-greenbush", "rensselaer", "colonie"]),

  dict(slug="guilderland", route="We take I-87 and then US 20 west to Guilderland.", name="Guilderland", county="Albany County", pop="36,848", miles=14.0, minutes=25,
       photo="guest-bedroom-blue-curtains-airbnb-turnover", map="!1m18!1m12!1m3!1d46909.55643706152!2d-73.89959495!3d42.70695445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de74400d6dfcd3%3A0x5d92372afa64298b!2sGuilderland%2C%20NY%2012084%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028932727!5m2!1sen!2sbr",
       eyebrow="Albany County · About 25 minutes from our office",
       lead="Guilderland is about 25 minutes from our Watervliet office. We clean homes across the town on recurring plans, and we clean shops, offices and commercial spaces around their opening hours.",
       about=("Guilderland is a town of about 36,848 people in Albany County, just west of the city of Albany. It is home to Crossgates Mall, the largest indoor shopping center in the Capital District.",
              "Retail and offices need cleaning when they are closed, which is why our commercial service runs 24/7. For homes, we keep the same crew on the same schedule so you are not explaining the house to someone new every visit."),
       focus=["recurring", "commercial", "deep", "move", "carpet", "postcon"],
       local_q=("Do you clean retail stores and offices in Guilderland?",
                "Yes. We clean offices, stores, restaurants and common areas, scheduled before opening, after closing or overnight. Commercial cleaning is available 24/7."),
       extra="supplies", near=["colonie", "schenectady", "delmar", "latham"]),

  dict(slug="clifton-park", route="We take NY 7 to the Northway, I-87, and Clifton Park is a few exits up.", name="Clifton Park", county="Saratoga County", pop="38,029", miles=12.2, minutes=18,
       photo="cabin-deck-stairs-after-power-washing", map="!1m18!1m12!1m3!1d93596.24939266981!2d-73.83478405!3d42.854207949999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de134e8818c603%3A0x4d433646c523c77a!2sClifton%20Park%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028942250!5m2!1sen!2sbr",
       eyebrow="Saratoga County · About 18 minutes from our office",
       lead="Clifton Park is about 18 minutes up the Northway from our Watervliet office. We clean family homes here on recurring plans, and we add carpet cleaning and deck and siding power washing when the season calls for it.",
       about=("Clifton Park is a suburban town in southern Saratoga County and, with about 38,029 residents, the largest municipality in the county. It sits about 12 miles north of Albany and 10 miles south of Saratoga Springs.",
              "Clifton Park homes tend to be larger single-family houses with carpeted rooms and a deck out back. A bi-weekly plan covers the inside, and a carpet cleaning or a power washing visit once or twice a year covers the rest."),
       focus=["recurring", "carpet", "power", "deep", "move", "painting"],
       local_q=("Do you clean carpets in Clifton Park homes?",
                "Yes. We shampoo carpets and clean upholstery and sofas, and you can add it to a regular house cleaning visit or book it on its own."),
       extra="languages", near=["halfmoon", "malta", "latham", "ballston-spa"]),

  dict(slug="halfmoon", route="We drive up US 9 and NY 9R to get to Halfmoon.", name="Halfmoon", county="Saratoga County", pop="25,662", miles=9.0, minutes=17,
       photo="interior-painting-prep-crew", map="!1m18!1m12!1m3!1d93591.47664878593!2d-73.71764595!3d42.857357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de16c8e97410bf%3A0xfc44445fdccb043d!2sHalfmoon%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028951489!5m2!1sen!2sbr",
       eyebrow="Saratoga County · About 17 minutes from our office",
       lead="Halfmoon is about 17 minutes from our Watervliet office. We clean homes here on recurring plans, and we take post-construction cleanups, painting and move-in cleaning for houses that just changed hands or got renovated.",
       about=("Halfmoon is a town in southeastern Saratoga County with about 25,662 residents, north of Albany. Its name comes from the half-moon shape of the land north of where the Hudson and Mohawk rivers meet, and some say from Henry Hudson's ship, the Halve Maen.",
              "If you just finished a renovation, the dust is everywhere for weeks. A post-construction clean clears the residue builders leave behind, and we can paint the rooms that need it before the furniture goes back in."),
       focus=["recurring", "postcon", "painting", "move", "deep", "power"],
       local_q=("Do you clean up after a renovation in Halfmoon?",
                "Yes. Post-construction cleaning removes the dust, debris and residue left after work on a house: on floors, inside cabinets, on windows and fixtures. We can also paint, so one crew can finish the job."),
       extra="cancel", near=["clifton-park", "mechanicville", "cohoes", "malta"]),

  dict(slug="mechanicville", route="We drive up US 9 and NY 146 to get to Mechanicville.", name="Mechanicville", county="Saratoga County", pop="5,163", miles=15.2, minutes=27,
       photo="hallway-wall-trim-fresh-paint", map="!1m18!1m12!1m3!1d23381.66177241497!2d-73.68949400000001!3d42.900113000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de17b787e3e719%3A0xdf8a8a0475e76992!2sMechanicville%2C%20NY%2012118%2C%20USA!5e0!3m2!1sen!2sbr!4v1793028991745!5m2!1sen!2sbr",
       eyebrow="Saratoga County · About 27 minutes from our office",
       lead="Mechanicville is about 27 minutes from our Watervliet office. We clean homes here on recurring plans, and we paint and deep clean when a house needs more than a regular visit.",
       about=("Mechanicville is a city of about 5,163 people on the eastern border of Saratoga County, north of Albany. By area it is the smallest city in New York State, bordered by Stillwater, Halfmoon and Schaghticoke.",
              "In a small city, word travels, and most of our Mechanicville clients come through a neighbor. We keep it simple: the same crew, the same day, and a clear price before we start."),
       focus=["recurring", "deep", "painting", "move", "carpet", "power"],
       local_q=("Do you paint as well as clean in Mechanicville?",
                "Yes. We paint interiors and exteriors for homes and businesses, with the prep and the cleanup included. Many clients book painting together with a deep clean."),
       extra="insured", near=["halfmoon", "malta", "clifton-park", "cohoes"]),

  dict(slug="ballston-spa", route="We take the Northway, I-87, and then NY 67 into the village.", name="Ballston Spa", county="Saratoga County", pop="5,111", miles=24.2, minutes=35,
       photo="bathtub-shower-after-deep-cleaning", map="!1m18!1m12!1m3!1d23339.94332252393!2d-73.85332245!3d43.01001105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de40a2e76fd5fd%3A0xc5084cb096a1f90!2sBallston%20Spa%2C%20NY%2012020%2C%20USA!5e0!3m2!1sen!2sbr!4v1793029001324!5m2!1sen!2sbr",
       eyebrow="Saratoga County · About 35 minutes from our office",
       lead="Ballston Spa is about 35 minutes from our Watervliet office. We clean homes here on recurring plans, and we clean offices in the village around their hours.",
       about=("Ballston Spa is a village of about 5,111 people and the county seat of Saratoga County, southwest of Saratoga Springs. The village lies partly in the town of Ballston and partly in the town of Milton.",
              "As the county seat, the village has its share of offices alongside its homes. Our commercial service is available 24/7, and our residential plans run on the same day and time every visit."),
       focus=["recurring", "deep", "commercial", "move", "carpet", "painting"],
       local_q=("Is Ballston Spa inside your service area?",
                "Yes. Ballston Spa is about 35 minutes from our office, well within the hour we travel. Travel is included in the price, with no extra fee."),
       extra="pets", near=["malta", "saratoga-springs", "clifton-park", "schenectady"]),

  dict(slug="malta", route="We take the Northway, I-87, north to Malta.", name="Malta", county="Saratoga County", pop="17,130", miles=20.3, minutes=27,
       photo="bedroom-navy-bedding-airbnb-turnover", map="!1m18!1m12!1m3!1d23349.6794726322!2d-73.78352824999999!3d42.984383550000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de3e54fcae9891%3A0x90c15e79d1ad5e9d!2sMalta%2C%20NY%2012020%2C%20USA!5e0!3m2!1sen!2sbr!4v1793029010989!5m2!1sen!2sbr",
       eyebrow="Saratoga County · About 27 minutes from our office",
       lead="Malta is about 27 minutes from our Watervliet office. We clean homes here on recurring plans, and we clean offices and facilities for businesses that need it done outside working hours.",
       about=("Malta is a town of about 17,130 people in central Saratoga County, south of Saratoga Springs. Together with Stillwater it hosts the Luther Forest Technology Campus, and GlobalFoundries moved its headquarters there in 2021.",
              "A growing employer brings new residents and new offices. We see both: families who want a recurring plan from the start, and businesses that need their offices and common areas kept up."),
       focus=["recurring", "commercial", "move", "deep", "carpet", "power"],
       local_q=("Do you clean offices near the technology campus in Malta?",
                "Yes. We clean offices, break rooms, restrooms and common areas, scheduled around your hours, including nights and weekends. Commercial cleaning is available 24/7."),
       extra="guarantee", near=["ballston-spa", "saratoga-springs", "mechanicville", "clifton-park"]),

  dict(slug="saratoga-springs", route="We take the Northway, I-87, and then US 9 into the city.", name="Saratoga Springs", county="Saratoga County", pop="28,491", miles=28.2, minutes=39,
       photo="guest-bedroom-towel-animals-airbnb-turnover", map="!1m18!1m12!1m3!1d46640.62810988183!2d-73.771918!3d43.0616419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de384ec75bd439%3A0x641d456a1b94a2a8!2sSaratoga%20Springs%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793029020028!5m2!1sen!2sbr",
       eyebrow="Saratoga County · About 40 minutes from our office",
       lead="Saratoga Springs is about 40 minutes up the Northway from our Watervliet office. We clean homes on recurring plans, and we turn over short-term rentals between guests, with beds made and towels folded.",
       about=("Saratoga Springs is a city of about 28,491 people in Saratoga County. Its mineral springs have made it a resort destination for more than 200 years, and it is home to the Saratoga Race Course, opened in 1863, the Saratoga Performing Arts Center and Skidmore College.",
              "Visitors fill the city in racing season, and rental hosts need fast, reliable turnovers between check-out and check-in. We also deep clean homes before and after the summer, and handle student move-outs around Skidmore."),
       focus=["airbnb", "recurring", "deep", "move", "carpet", "power"],
       local_q=("Do you turn over short-term rentals in Saratoga Springs?",
                "Yes. We clean between guests: linens changed and beds made, towels folded, kitchen and bathrooms reset, trash out. Tell us your check-out and check-in times and we plan the visit around them."),
       extra="supplies", near=["wilton", "malta", "ballston-spa", "glens-falls"]),

  dict(slug="wilton", route="Most of the drive is the Northway, I-87, about 29 miles of it.", name="Wilton", county="Saratoga County", pop="17,361", miles=36.7, minutes=47,
       photo="small-bedroom-gray-bedding-airbnb-turnover", map="!1m18!1m12!1m3!1d11637.608444745947!2d-73.74428629999998!3d43.180072849999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89de33897b07c277%3A0xe9c29cc3bef60d99!2sWilton%2C%20NY%2012831%2C%20USA!5e0!3m2!1sen!2sbr!4v1793029029494!5m2!1sen!2sbr",
       eyebrow="Saratoga County · About 47 minutes from our office",
       lead="Wilton is about 47 minutes from our Watervliet office. We clean homes here on recurring plans, give newer houses a move-in clean before the boxes come in, and clean shops and offices around their hours.",
       about=("Wilton is a town of about 17,361 people in northeastern Saratoga County, bordering Saratoga Springs. It is a local economic hub with a lot of suburban development, and the Wilton Mall sits off Interstate 87 at exit 15.",
              "Newer neighborhoods mean a steady flow of move-ins. A move-in clean gets the house ready before you unpack, and a recurring plan keeps it that way."),
       focus=["recurring", "move", "commercial", "deep", "carpet", "power"],
       local_q=("Do you clean new homes before move-in in Wilton?",
                "Yes. We clean inside cabinets, closets and appliances, wipe down fixtures and floors, and clear any construction dust, so the house is ready before the furniture arrives."),
       extra="cancel", near=["saratoga-springs", "glens-falls", "queensbury", "malta"]),

  dict(slug="glens-falls", route="Almost all of the drive is the Northway, I-87, about 38 miles of it.", name="Glens Falls", county="Warren County", pop="14,830", miles=46.1, minutes=60,
       photo="log-cabin-siding-after-power-washing", map="!1m18!1m12!1m3!1d23226.26414217146!2d-73.64683805!3d43.308334499999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dfcf0d10ae2943%3A0x24ac9d702f124365!2sGlens%20Falls%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793029038865!5m2!1sen!2sbr",
       eyebrow="Warren County · About an hour from our office",
       lead="Glens Falls is about an hour from our Watervliet office, at the north end of our service area. We clean homes here on recurring plans, and we clean medical offices, clinics and other businesses around their hours.",
       about=("Glens Falls is a city of about 14,830 people in Warren County, the central city of the Glens Falls metropolitan area. Look magazine called it \"Hometown U.S.A.\" in 1944, and it is home to Glens Falls Hospital, a 410-bed community hospital.",
              "Clinics, medical offices and the businesses around them need cleaning that fits their schedule and their standards. That is the commercial work we prefer, and our crews are available 24/7."),
       focus=["commercial", "recurring", "deep", "move", "carpet", "painting"],
       local_q=("Do you clean medical offices and clinics in Glens Falls?",
                "Yes. Offices, clinics and hospitals are among the commercial jobs we prefer. We agree on the scope, the products and the schedule with you, and we can clean after hours or overnight."),
       extra="insured", near=["queensbury", "lake-george", "wilton", "saratoga-springs"]),

  dict(slug="queensbury", route="Almost all of the drive is the Northway, I-87, about 41 miles of it.", name="Queensbury", county="Warren County", pop="29,169", miles=49.9, minutes=66,
       photo="lakeside-deck-fire-table-after-power-washing", map="!1m18!1m12!1m3!1d185623.70742301736!2d-73.67954104999998!3d43.36927805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dfcf8b7e4577a3%3A0xfdbe5d3b411e8e1!2sQueensbury%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbr!4v1793029048057!5m2!1sen!2sbr",
       eyebrow="Warren County · About an hour from our office",
       lead="Queensbury is about an hour from our Watervliet office. We clean homes here on recurring plans and deep cleans, and we power wash decks, siding and docks in the warmer months.",
       about=("Queensbury is a town of about 29,169 people in southeastern Warren County. It holds the Warren County municipal center on U.S. Route 9, south of the village of Lake George, and it surrounds the city of Glens Falls on three sides.",
              "Between the lake and the mountains, a lot of Queensbury homes have decks, docks and siding that take a beating over the winter. A power washing visit in spring gets them ready for the season."),
       focus=["recurring", "power", "deep", "airbnb", "move", "carpet"],
       local_q=("Do you power wash decks and docks in Queensbury?",
                "Yes. We power wash decks, docks, siding and walkways. Spring is the busiest time for it, so book early if you want it done before the summer."),
       extra="languages", near=["glens-falls", "lake-george", "wilton", "saratoga-springs"]),

  dict(slug="lake-george", route="We take the Northway, I-87, to the south end of the lake, then US 9 into the village.", name="Lake George", county="Warren County", pop=None, miles=53.5, minutes=67,
       photo="lakeside-cabin-deck-after-power-washing", map="!1m18!1m12!1m3!1d11590.563595788584!2d-73.714319!3d43.426328999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dfc01da0053e81%3A0x3be8fcb34fcf62d2!2sLake%20George%2C%20NY%2012845%2C%20USA!5e0!3m2!1sen!2sbr!4v1793029057321!5m2!1sen!2sbr",
       eyebrow="Warren County · The north end of our service area",
       lead="Lake George is a little over an hour from our Watervliet office, at the north end of our service area. We turn over vacation rentals between guests, open and close lake houses for the season, and power wash decks and docks.",
       about=("The village of Lake George sits at the southern end of the lake, inside the town of Lake George in Warren County. The village and the area around it are a well-known summer tourist region and a historic summer colony.",
              "Summer homes and rentals here run on a season. Before it starts they need a deep clean and a power washed deck; during it, fast turnovers between guests; after it, a closing clean so the house is ready for spring."),
       focus=["airbnb", "power", "deep", "recurring", "carpet", "painting"],
       local_q=("Do you open and close lake houses for the season?",
                "Yes. We deep clean a house before the season starts, turn it over between guests during the summer, and do a closing clean when you shut it for the winter. We also power wash decks and docks."),
       extra="guarantee", near=["queensbury", "glens-falls", "wilton", "saratoga-springs"]),
]
# fmt: on

BY_SLUG = {c["slug"]: c for c in CITIES}
PRICE_APT, PRICE_HOUSE = 160, 195


def e(s):
    return html.escape(s, quote=True)


def url(c):
    return f"/house-cleaning-{c['slug']}-ny"


def img(slug, sizes, eager=False):
    im = PHOTOS[slug]
    gens = sorted(im["generated"], key=lambda g: g["width"])
    big = gens[-1]
    srcset = ", ".join(f"{g['file']} {g['width']}w" for g in gens)
    load = 'fetchpriority="high" decoding="async"' if eager else 'loading="lazy" decoding="async"'
    return (f'<img src="{big["file"]}" srcset="{srcset}" sizes="{sizes}" width="{big["width"]}" '
            f'height="{big["height"]}" alt="{e(im["alt"])}" {load}>')


def title(c):
    t = f"House Cleaning Services in {c['name']}, NY | NSA Cleaning LLC"
    return t if len(t) <= 60 else f"House Cleaning in {c['name']}, NY | NSA Cleaning LLC"


def description(c):
    first = SERVICES[c["focus"][0]][1].lower()
    second = SERVICES[c["focus"][1]][1].lower()
    where = "our home base" if c["miles"] is None else f"{c['minutes']} min from our office"
    d = (f"House cleaning in {c['name']}, NY: {first} and {second}. Insured, supplies included, "
         f"{where}. Plans from ${PRICE_APT}. Free quote.")
    if len(d) > 160:
        d = f"House cleaning in {c['name']}, NY: {first} and {second}. Insured, supplies included. Plans from ${PRICE_APT}. Free quote."
    return d


def faq(c):
    travel = ("Is there a travel fee to " + c["name"] + "?",
              "No. Our office is in " + c["name"] + ", so there is nothing to add."
              if c["miles"] is None else
              f"No. Travel is included anywhere within about an hour of our Watervliet office, and {c['name']} is "
              f"roughly {c['miles']:g} miles away. There are no travel fees.")
    price = (f"How much does house cleaning cost in {c['name']}?",
             f"Recurring plans start at ${PRICE_APT} for apartments and ${PRICE_HOUSE} for houses, depending on size and condition. "
             f"Other services are quoted for free.")
    return [travel, price, c["local_q"], EXTRA_FAQ[c["extra"]]]


def render(c):
    cname = c["name"]
    path = url(c)
    near = [BY_SLUG[s] for s in c["near"] if s in BY_SLUG]
    faqs = faq(c)
    map_src = OFFICE_EMBED if c["map"] is None else embed(c["map"])
    map_title = (f"NSA Cleaning LLC office on Google Maps, Watervliet, NY" if c["map"] is None
                 else f"Map of {cname}, NY")
    distance_line = ("Our office is here, at 321 25th St, Watervliet, NY 12189." if c["miles"] is None else
                     f"{cname} is roughly {c['miles']:g} miles by road from our office at 321 25th St, Watervliet, "
                     f"and travel is included.")

    schema = [
        "@business",
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "{{siteUrl}}/"},
            {"@type": "ListItem", "position": 2, "name": "Service Area", "item": "{{siteUrl}}/service-area"},
            {"@type": "ListItem", "position": 3, "name": cname, "item": "{{siteUrl}}" + path}]},
        {"@context": "https://schema.org", "@type": "Service",
         "name": f"House cleaning in {cname}, NY", "serviceType": "House cleaning",
         "url": "{{siteUrl}}" + path,
         "provider": {"@id": "{{siteUrl}}/#business"},
         "areaServed": {"@type": "City", "name": f"{cname}, NY",
                        "containedInPlace": {"@type": "AdministrativeArea", "name": f"{c['county']}, NY"}},
         "offers": {"@type": "Offer", "priceCurrency": "USD",
                    "priceSpecification": {"@type": "PriceSpecification", "minPrice": PRICE_APT, "priceCurrency": "USD"},
                    "description": f"Recurring cleaning from ${PRICE_APT} for apartments and ${PRICE_HOUSE} for houses"}},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]},
    ]
    meta = {"title": title(c), "description": description(c), "priority": 0.7, "schema": schema}

    svc_items = "\n".join(
        f'        <li><b><a href="{SERVICES[k][0]}">{e(SERVICES[k][1])} in {e(cname)}</a></b><span>{e(SERVICES[k][2])}.</span></li>'
        for k in c["focus"])
    faq_items = "\n".join(f"        <details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in faqs)
    near_items = "".join(f'<li><a href="{url(n)}">{e(n["name"])}</a></li>' for n in near)

    return f"""<!--@meta
{json.dumps(meta, ensure_ascii=False, indent=1)}
-->
<!-- Generated by scripts/gen_cities.py. Edit the data there and rerun; hand edits here are overwritten. -->
<style>
.city-services{{display:grid;gap:12px;margin:0;padding:0;list-style:none}}
@media(min-width:800px){{.city-services{{grid-template-columns:1fr 1fr;gap:14px 28px}}}}
.city-services li{{display:grid;gap:2px;padding:14px 0;border-top:1px solid var(--line)}}
.city-services b a{{color:var(--navy)}}
.city-services span{{color:var(--ink-2);font-size:.95rem}}
.city-facts p{{color:var(--ink-2)}}
.city-map-caption{{margin:10px 0 0;font-size:.9rem;color:var(--ink-2)}}
.city-price{{display:grid;gap:10px;max-width:760px}}
.city-price .prices{{margin:0}}
.page-hero-photo{{position:relative}}
</style>

<!-- ===== HERO ===== -->
<section class="page-hero page-hero--photo" aria-labelledby="page-title"><div class="container">
  <div>
    <p class="eyebrow">{e(c['eyebrow'])}</p>
    <h1 id="page-title">House Cleaning Services in <em>{e(cname)}, NY</em></h1>
    <p class="lead">{e(c['lead'])}</p>
    <div class="hero-cta"><a class="btn btn-primary btn-lg" href="{{{{site.quoteHref}}}}" data-quote-open data-track="cta_quote_hero">Get a Free Quote</a><a class="btn btn-ghost btn-lg" href="tel:{{{{site.business.phoneE164}}}}"><svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>Call&nbsp;{{{{{{site.business.phoneHtml}}}}}}</a></div>
    <p class="hero-note"><b>Insured</b> · Supplies included · Travel included · <span lang="es">Hablamos español</span> · <span lang="pt">Falamos português</span></p>
  </div>
  <div class="page-hero-photo">{img(c['photo'], '(min-width: 1240px) 520px, (min-width: 900px) 42vw, calc(100vw - 32px)', eager=True)}<span class="photo-tag">Real job by NSA Cleaning</span></div>
</div></section>

<!-- ===== SERVICES ===== -->
<section class="section" id="services" aria-labelledby="services-title"><div class="container">
  <div class="section-head">
    <p class="eyebrow">What we clean in {e(cname)}</p>
    <h2 id="services-title">Cleaning services in {e(cname)}, NY</h2>
    <p>In the order {e(cname)} clients ask for them most.</p>
  </div>
  <ul class="city-services">
{svc_items}
  </ul>
</div></section>

<!-- ===== LOCAL + MAP ===== -->
<section class="section section-alt" id="map" aria-labelledby="local-title"><div class="container area-grid">
  <div class="city-facts">
    <div class="section-head">
      <p class="eyebrow">{e(c['county'])}</p>
      <h2 id="local-title">Cleaning homes and businesses in {e(cname)}</h2>
    </div>
    <p>{e(c['about'][0])}</p>
    <p>{e(c['about'][1])}</p>
    <p>{e(distance_line)} {e(c['route'])}</p>
  </div>
  <div>
    <iframe class="city-map" src="{e(map_src)}" title="{e(map_title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    <p class="city-map-caption">{e(map_title)}. <a href="{{{{site.business.googleMapsUrl}}}}" rel="noopener" target="_blank">See NSA Cleaning on Google Maps</a></p>
  </div>
</div></section>

<!-- ===== PRICE ===== -->
<section class="section" id="price" aria-labelledby="price-title"><div class="container city-price">
  <p class="eyebrow">Pricing in {e(cname)}</p>
  <h2 id="price-title">House cleaning prices in {e(cname)}</h2>
  <p>Recurring house cleaning in {e(cname)} starts at <b>${PRICE_APT}</b> for apartments and <b>${PRICE_HOUSE}</b> for houses. Travel and supplies are included. Everything else is quoted for free.</p>
  <p><a class="link-arrow" href="/pricing">How our pricing works <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a></p>
</div></section>

<!-- ===== FAQ ===== -->
<section class="section section-alt" id="faq" aria-labelledby="faq-title"><div class="container">
  <div class="section-head">
    <p class="eyebrow">Questions</p>
    <h2 id="faq-title">House cleaning in {e(cname)}: common questions</h2>
  </div>
  <div class="faq">
{faq_items}
  </div>
</div></section>

<!-- ===== NEARBY ===== -->
<section class="section" id="nearby" aria-labelledby="nearby-title"><div class="container">
  <div class="section-head">
    <p class="eyebrow">Nearby</p>
    <h2 id="nearby-title">We also clean near {e(cname)}</h2>
  </div>
  <ul class="city-chips" aria-label="Cities near {e(cname)}">{near_items}<li><a href="/">Albany</a></li><li><a href="/service-area">All 21 cities and towns</a></li></ul>
</div></section>

<!-- ===== CTA ===== -->
<section class="section cta-band on-dark" aria-labelledby="cta-title"><div class="container">
  <h2 id="cta-title">Get a free cleaning quote in {e(cname)}</h2>
  <p>Tell us the service, the property and roughly when. We reply with a free quote. Travel and supplies included.</p>
  <div class="cta-actions"><a class="btn btn-white btn-lg" href="{{{{site.quoteHref}}}}" data-quote-open data-track="cta_quote_final">Get a Free Quote</a><a class="btn btn-ghost btn-lg" href="tel:{{{{site.business.phoneE164}}}}"><svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>Call&nbsp;{{{{{{site.business.phoneHtml}}}}}}</a></div>
  <p class="cta-meta">{{{{site.business.address.city}}}}, {{{{site.business.address.region}}}} · Residential {{{{site.business.hoursResidential}}}} · Commercial {{{{site.business.hoursCommercial}}}} · <a href="mailto:{{{{site.business.email}}}}">{{{{site.business.email}}}}</a></p>
</div></section>
"""


def main():
    for c in CITIES:
        assert c["photo"] in PHOTOS, f"{c['slug']}: photo {c['photo']} not in manifest"
        for k in c["focus"]:
            assert k in SERVICES, f"{c['slug']}: unknown service {k}"
        out = PAGES / f"house-cleaning-{c['slug']}-ny.html"
        out.write_text(render(c))
        print(f"  {url(c):42s} {len(title(c)):3d}t {len(description(c)):3d}d  {c['photo']}")
    print(f"\n{len(CITIES)} city pages written to src/pages/")


if __name__ == "__main__":
    main()
