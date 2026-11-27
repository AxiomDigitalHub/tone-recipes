/**
 * Free artist photos from Wikimedia Commons, keyed by artist slug.
 *
 * Each entry is the lead photo of the artist's English Wikipedia article,
 * limited to free licenses (public domain, CC0, CC BY, CC BY-SA and plain
 * attribution). The page shows a credit line under every photo, which the
 * CC licenses require. Artists without an entry keep their album art.
 *
 * Gathered Nov 27 2026 from the Wikipedia and Commons APIs.
 */

export interface ArtistPhoto {
  /** Commons file name, with underscores, no "File:" prefix. */
  file: string;
  /** Photographer or rights holder, as Commons credits them. */
  author: string;
  /** License short name, as Commons lists it. */
  license: string;
}

export const artistPhotos: Record<string, ArtistPhoto> = {
  "alex-lifeson": { file: "TaylorHawkTributeWemb030922_(174_of_281)_(52334835950)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "eric-clapton": { file: "ClaptonGingerEventim170220-38_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "jimi-hendrix": { file: "Jimi_Hendrix_(1967)_(cropped).jpg", author: "Photographer unknown", license: "Public domain" },
  "kurt-cobain": { file: "Nirvana_around_1992_(cropped).jpg", author: "P.B. Rage", license: "CC BY-SA 2.0" },
  "kirk-hammett": { file: "Kirk_Hammett_2025_Marvel_Stadium_(4).jpg", author: "4TheWynne", license: "CC BY-SA 4.0" },
  "brian-may": { file: "Brian_May_(54760284093).jpg", author: "Gage Skidmore", license: "CC BY-SA 4.0" },
  "joe-satriani": { file: "Satriani_2010_13_12_1112.jpg", author: "Shape Prior", license: "CC BY-SA 3.0" },
  "jerry-garcia": { file: "Jerry-Garcia-01cropped.jpg", author: "Carl Lender", license: "CC BY 2.0" },
  "jimmy-page": { file: "Jimmy_Page_at_the_Echo_music_award_2013.jpg", author: "Avda", license: "CC BY-SA 3.0" },
  "the-edge": { file: "U2_in_Melbourne_(49094944907)_(cropped).jpg", author: "U2start", license: "CC BY 2.0" },
  "carlos-santana": { file: "Santana_Acer_Arena_(5558151833)_(cropped).jpg", author: "Eva Rinaldi", license: "CC BY-SA 2.0" },
  "bb-king": { file: "Bbking.jpg", author: "Marco Tambara", license: "CC BY-SA 3.0" },
  "pete-townshend": { file: "Pete_Townshend_(2012).jpg", author: "Ross Belot", license: "CC BY 2.0" },
  "keith-richards": { file: "RStonesHydePark030722_(63_of_125)_(Keith_Richards).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "stevie-ray-vaughan": { file: "Stevie_Ray_Vaughan_Live_1983.jpg", author: "Bbadventure", license: "CC BY-SA 4.0" },
  "kerry-livgren": { file: "Kerry_Livgren.png", author: "Kirshner Records", license: "Public domain" },
  "johnny-marr": { file: "SuedeAudleyEnd010824_(35_of_122)_(53898504675)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "david-gilmour": { file: "DGilmourRAH111024_(21_of_63)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "john-frusciante": { file: "RHChiliPeppersSpurs210723_(9_of_90)_(53065669750)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "noel-gallagher": { file: "Noel_Gallagher_Glastonbury_2022_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "mark-knopfler": { file: "Mar-Knopfler-Pensa-Blue.jpg", author: "Sebastien.gross", license: "CC BY-SA 4.0" },
  "randy-rhoads": { file: "RandyRhoads1980.jpg", author: "Jet Records", license: "CC0" },
  "john-mayer": { file: "JohnMayerin2019.jpg", author: "Thatcommonkid", license: "CC BY-SA 4.0" },
  "tom-morello": { file: "Tom_Morello.jpg", author: "Dario De Marco", license: "Public domain" },
  "dimebag-darrell": { file: "Dimebag_at_Monsters_of_Rock_1994.jpg", author: "Martyn Goodacre", license: "CC BY 4.0" },
  "james-hetfield": { file: "James_Hetfield_2025_Marvel_Stadium_(8).jpg", author: "4TheWynne", license: "CC BY-SA 4.0" },
  "jonny-greenwood": { file: "RadioheadO2241125-118_(54953107146)_(cropped).jpg", author: "Raph_PH", license: "CC BY 4.0" },
  "tony-iommi": { file: "Tony-Iommi_2009-06-11_Chicago_photoby_Adam-Bielawski.jpg", author: "Adam Bielawski", license: "CC BY-SA 3.0" },
  "jack-white": { file: "Werchter070718_p2_(5_of_37)_(53977414178)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "angus-young": { file: "ACDCWembley030724_(115_of_169)_(53844255247)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "mike-mccready": { file: "Mike_McCready_2009.jpg", author: "Craig Carper", license: "CC BY 2.0" },
  "josh-homme": { file: "HF2024JoshHomme_2.jpg", author: "Selbymay", license: "CC BY 4.0" },
  "ed-king": { file: "Ed_King_-_Lynyrd_Skynyrd_(1973).png", author: "MCA Records", license: "Public domain" },
  "billy-gibbons": { file: "ZZ_Top_performing_at_Caesars_Windsor,_2025-06-18_20_(cropped).jpg", author: "Chris Woodrich", license: "CC BY-SA 4.0" },
  "dan-auerbach": { file: "Dan_Auerbach_performing_with_the_Black_Keys.jpg", author: "Sxanthony", license: "CC BY-SA 3.0" },
  "mark-tremonti": { file: "Mark_Tremonti_(cropped).jpg", author: "Antje Naumann", license: "CC BY-SA 3.0" },
  "don-felder": { file: "Don_Felder_Auto_Club_2023.jpg", author: "TaurusEmerald", license: "CC BY-SA 4.0" },
  "alex-turner": { file: "Alex_Turner_The_Car_2023_Tour_Image.jpg", author: "Johnwilliamson321", license: "CC BY-SA 4.0" },
  "joe-bonamassa": { file: "Joe_Bonamassa_-_2013_World_Tour_-_Meistersingerhalle_Nuernberg_-_11-03-2013_(-31534407).jpg", author: "Florian Stangl", license: "CC BY 2.0" },
  "andrew-stockdale": { file: "Deichbrand2018-Wolfmother-41.jpg", author: "Chris W. Braunschweiger", license: "CC BY-SA 4.0" },
  "ritchie-blackmore": { file: "Ritchie_Blackmore's_Rainbow_headlining_the_Stone_Free_2017_Festival_at_the_O2_(34994158240).jpg", author: "kitmasterbloke", license: "CC BY 2.0" },
  "tom-scholz": { file: "TomScholz.JPG", author: "Matt Becker", license: "CC BY 3.0" },
  "eddie-van-halen": { file: "Eddie_Van_Halen_at_the_New_Haven_Coliseum.jpg", author: "Carl Lender", license: "CC BY 2.0" },
  "gary-clark-jr": { file: "Gary_Clark,_Jr._2013.jpg", author: "Alize Tran", license: "CC BY 2.0" },
  "matt-bellamy": { file: "20180603_Nürnberg_Rock_im_Park_Muse_0382.jpg", author: "Markus Felix", license: "CC BY-SA 4.0" },
  "dave-grohl": { file: "FoosDublin210819-6_(48620330261)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "chuck-berry": { file: "Chuck_Berry_1957.jpg", author: "Universal Attractions", license: "Public domain" },
  "stephen-carpenter": { file: "Stephen_Carpenter_Deftones_Rock_im_Park_2016.jpg", author: "pitpony.photography", license: "CC BY-SA 3.0" },
  "brad-delson": { file: "Brad_Delson_-_From_Zero_Lead_Press_Photo_-_James_Minchin_III_(cropped).jpg", author: "Warner Records", license: "CC BY-SA 4.0" },
  "billy-corgan": { file: "Billy_Corgan_of_The_Smashing_Pumpkins_-_2019158213151_2019-06-07_Rock_am_Ring_-_2085_-_AK8I7435_(cropped).jpg", author: "Sven Mandel", license: "CC BY-SA 4.0" },
  "zakk-wylde": { file: "Zakk_Sabbath_(Zakk_Wylde)_-_Markthalle_Hamburg_2025_01_(cropped).jpg", author: "Frank Schwichtenberg", license: "CC BY-SA 4.0" },
  "k-k-downing": { file: "K._K._Downing._Motocultor_2024.jpg", author: "Tilly antoine", license: "CC BY-SA 4.0" },
  "glenn-tipton": { file: "Glenn_Tipton2005_(cropped).jpg", author: "Dmitry Kulikov", license: "CC BY-SA 3.0" },
  "daron-malakian": { file: "Daron_Malakian_live_2026.png", author: "Californipedia", license: "CC0" },
  "joe-walsh": { file: "Joe_Walsh_2019.jpg", author: "Derek Russell", license: "CC BY-SA 2.0" },
  "jake-e-lee": { file: "Jake_E._Lee_in_2014.jpg", author: "Nick Soveiko", license: "CC BY-SA 3.0" },
  "dean-deleo": { file: "Dean_DeLeo.jpg", author: "U.S. Army Garrison Hawaii", license: "Public domain" },
  "albert-hammond-jr": { file: "StrokesNosAlive060722-160_(52208710742)_cropped.jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "scott-gorham": { file: "Black_Star_Riders_–_Wacken_Open_Air_2014_06.jpg", author: "P. Schwichtenberg", license: "CC BY-SA 3.0" },
  "kim-thayil": { file: "Kim_Thayil_-_Fabrik_Hamburg_2018_04.jpg", author: "Frank Schwichtenberg", license: "CC BY-SA 4.0" },
  "vernon-reid": { file: "Lozlivingcolour-2016-05-31-04h35m58s185.png", author: "Alex Lozupone", license: "CC BY-SA 4.0" },
  "nick-valensi": { file: "StrokesRosendal080622_(45)_(52156439629)_cropped.jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "munky": { file: "Korn_Rock_Im_Park_2016_(12_von_14)_(1).jpg", author: "Sven Mandel", license: "CC BY-SA 3.0" },
  "bernie-leadon": { file: "Bernie_Leadon_1970.jpg", author: "Rob C. Croes (ANEFO)", license: "CC0" },
  "vivian-campbell": { file: "Vivian_Campbell_guitarist_(cropped).jpg", author: "Selbymay", license: "CC BY-SA 4.0" },
  "fast-eddie-clarke": { file: "Fast_Eddie_Clarke,_2009.jpg", author: "Llb9977", license: "Public domain" },
  "jim-root": { file: "SLIPKNOT_@_Knotfest_México_2016_(30832077306)_(cropped).jpg", author: "Factor Metal", license: "CC BY 2.0" },
  "buck-dharma": { file: "Buck_Dharma_-_Blue_Öyster_Cult_-_Wacken_Open_Air_2016.jpg", author: "Frank Schwichtenberg", license: "CC BY-SA 3.0" },
  "mick-thomson": { file: "Slipknot_-_The_Grey_Chapter_Tour_2016_-_Düsseldorf_-_01830705_-_Leonhard_Kreissig_-_Canon_EOS_5D_Mark_III_(cropped).jpg", author: "Leonhard Kreissig", license: "CC BY-SA 4.0" },
  "dan-donegan": { file: "2016_RiP_Disturbed_-_Dan_Donegan_-_by_2eight_-_8SC8794.jpg", author: "Stefan Brending", license: "CC BY-SA 3.0" },
  "wolf-hoffmann": { file: "Accept_Rockharz_2022_16_(cropped).jpg", author: "S. Bollmann", license: "Attribution" },
  "clint-lowery": { file: "Rocktoberfest_rocks_Cherry_Point_141016-M-BN069-126_(cropped).jpg", author: "Cpl. J. R. Heins", license: "Public domain" },
  "bill-kelliher": { file: "Mastodon_-_Rock_im_Park_2022_-_IMG_2508_-_1.jpg", author: "Mr. Rossi", license: "CC BY-SA 4.0" },
  "tony-rombola": { file: "2015_RiP_Godsmack_Tony_Rombola_by_2eight_-_3SC5095.jpg", author: "Stefan Brending", license: "CC BY-SA 3.0" },
  "tim-sult": { file: "2015_RiP_Clutch_Tim_Sult_by_2eight_-_3SC4772.jpg", author: "Stefan Brending", license: "CC BY-SA 3.0" },
  "zach-myers": { file: "Shinedown_-_2022156165721_2022-06-05_Rock_am_Ring_-_Sven_-_1D_X_MK_II_-_0977_-_AK8I4615_(cropped).jpg", author: "Sven Mandel", license: "CC BY-SA 4.0" },
  "john-baizley": { file: "Baroness_@_Roadburn_Festival_2017_06.jpg", author: "Grywnn", license: "CC BY-SA 4.0" },
  "jerry-horton": { file: "2023_Rock_im_Park_-_Papa_Roach_-_Jerry_Horton_-_by_2eight_-_ZSC2339_(cropped).jpg", author: "Stefan Brending", license: "CC BY-SA 4.0" },
  "jd-cronise": { file: "JohnDCronise-ObservatorySantaAnaCA-20130801.JPG", author: "Jesse Seilhan", license: "CC BY-SA 3.0" },
  "robert-fripp": { file: "Toyah_&_Robert_IOW230624_(91_of_367)_(53818508938)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "dave-mustaine": { file: "HF2022Megadeth_2.jpg", author: "Selbymay", license: "CC BY-SA 4.0" },
  "billie-joe-armstrong": { file: "GreenDayIOW230624_(307_of_367)_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "slash": { file: "Slash_live_in_London_2022_(Cropped_-_upright).jpg", author: "Kreepin Deth", license: "CC BY-SA 4.0" },
  "rivers-cuomo": { file: "RiversCuomo2026.jpg", author: "Colleen Sturtevant", license: "CC BY-SA 4.0" },
  "marty-friedman": { file: "Marty_Friedman_in_Montevideo_Music_Box,_Nov_15,_2026.png", author: "Stgrunu", license: "CC0" },
  "jerry-cantrell": { file: "2019_RiP_Alice_in_Chains_-_Jerry_Cantrell_-_by_2eight_-_8SC0327.jpg", author: "Stefan Brending", license: "CC BY-SA 4.0" },
  "george-lynch": { file: "George_Lynch_2009.jpg", author: "Toglenn", license: "CC BY-SA 3.0" },
  "andy-summers": { file: "Andy_Summers_with_guitar_2015.jpg", author: "Whoisjohngalt", license: "CC BY-SA 3.0" },
  "devin-townsend": { file: "Devin_Townsend_Project_–_Wacken_Open_Air_2014_03.jpg", author: "P. Schwichtenberg", license: "CC BY-SA 3.0" },
  "joe-perry": { file: "HollywoodVampsSSe200618-151_(43604265504).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "steve-howe": { file: "Yes_live_at_The_Cliffs_Pavillion,_Westcliff-on-Sea_(53758715449).jpg", author: "Steve Knight", license: "CC BY 2.0" },
  "steve-hackett": { file: "2024_Steve_Hackett_-_by_2eight_-_9SC4359.jpg", author: "Stefan Brending", license: "CC BY-SA 3.0 de" },
  "mike-campbell": { file: "Mike_Campbell_20251209.jpg", author: "Davidwbaker", license: "CC BY-SA 4.0" },
  "steven-wilson": { file: "HF2023PorcupineTree_3_(cropped).jpg", author: "Selbymay", license: "CC BY 4.0" },
  "kai-hansen": { file: "Gamma_Ray-10_(53871173995)_(cropped).jpg", author: "Dario De Marco", license: "Public domain" },
  "john-petrucci": { file: "DreamTheater_TonsOfRock-2025_00002.jpg", author: "Birgit Fostervold", license: "CC BY-SA 4.0" },
  "martin-barre": { file: "Martin_Barre_2013.jpg", author: "Gnagflow31", license: "CC BY-SA 3.0" },
  "adrian-smith": { file: "Adrian_Smith_–_Iron_Maiden_–_Tons_of_Rock_2026_04.jpg", author: "Birgit Fostervold", license: "CC BY-SA 4.0" },
  "jim-adkins": { file: "2018_RiP_-_Jimmy_Eat_World_-_by_2eight_-_3SC7663.jpg", author: "Stefan Brending", license: "CC BY-SA 4.0" },
  "jeff-hanneman": { file: "Jeff_Hanneman_f9e_o.jpg", author: "Victoria Morse", license: "CC BY-SA 2.0" },
  "tom-delonge": { file: "Angels&Airwaves_Hansaring_06_Tom_DeLonge_(Cropped).jpg", author: "A.Savin", license: "CC BY-SA 3.0" },
  "gary-rossington": { file: "Gary_Rossington_of_Lynyrd_Skynyrd_-_Simpleman_2011.png", author: "Jon Callas", license: "CC BY 2.0" },
  "jonny-buckland": { file: "JonnyBucklandGlasto290624_(cropped).jpg", author: "Raph_PH", license: "CC BY 2.0" },
  "chris-degarmo": { file: "Chris_DeGarmo_with_Queensrÿche_in_1992_(cropped).png", author: "TomsterStuff!", license: "CC BY 3.0" },
  "roger-fisher": { file: "Roger_Fisher_-_Heart_-_1978.jpg", author: "Jim Summaria", license: "CC BY-SA 3.0" },
  "adam-jones": { file: "Adam_Jones_by_Gage_Skidmore.jpg", author: "Gage Skidmore", license: "CC BY-SA 3.0" },
  "tosin-abasi": { file: "Tosin_Abasi_2014.jpg", author: "ArtBrom", license: "CC BY-SA 2.0" },
  "dave-murray": { file: "Soundwave_Iron_Maiden_(5508224503)_(cropped).jpg", author: "Mandy Hall", license: "CC BY 2.0" },
  "hank-shermann": { file: "Mercyful_Fate_-_2022216204342_2022-08-04_Wacken_-_Sven_-_1D_X_MK_II_-_2208_-_AK8I5057.jpg", author: "Sven Mandel", license: "CC BY-SA 4.0" },
};

const COMMONS = "https://commons.wikimedia.org/wiki/";

/** Image URL, scaled by Commons to the given width. */
export function photoSrc(p: ArtistPhoto, width = 640): string {
  return `${COMMONS}Special:FilePath/${encodeURIComponent(p.file)}?width=${width}`;
}

/** The photo's page on Commons, which carries the full credit and license. */
export function photoPage(p: ArtistPhoto): string {
  return `${COMMONS}File:${encodeURIComponent(p.file)}`;
}

/** Link to the license text, or null for public domain and plain attribution. */
export function licenseUrl(license: string): string | null {
  if (license === "CC0") return "https://creativecommons.org/publicdomain/zero/1.0/";
  const m = license.match(/^CC (BY(?:-SA)?) (\d\.\d)(?: ([a-z]{2}))?$/);
  if (!m) return null;
  const kind = m[1].toLowerCase();
  return `https://creativecommons.org/licenses/${kind}/${m[2]}/${m[3] ? `${m[3]}/` : ""}`;
}

export function getArtistPhoto(slug: string): ArtistPhoto | undefined {
  return artistPhotos[slug];
}
