const DESTINATIONS=[
  {id:"goa",name:"Goa",state:"Goa",emoji:"🏖️",desc:"Beaches, shacks & sunsets",vibe:"Beach vibes",bg:"linear-gradient(135deg,#f6d365,#fda085)",tags:["beach"]},
  {id:"shimla",name:"Shimla",state:"Himachal Pradesh",emoji:"🏔️",desc:"Colonial hill station retreat",vibe:"Mountain cool",bg:"linear-gradient(135deg,#a1c4fd,#c2e9fb)",tags:["hill"]},
  {id:"manali",name:"Manali",state:"Himachal Pradesh",emoji:"❄️",desc:"Snow peaks & adventure sports",vibe:"Snow adventures",bg:"linear-gradient(135deg,#d4fc79,#96e6a1)",tags:["hill","nature"]},
  {id:"jaipur",name:"Jaipur",state:"Rajasthan",emoji:"🏯",desc:"Pink City royal heritage",vibe:"Royal & cultural",bg:"linear-gradient(135deg,#f093fb,#f5576c)",tags:["heritage"]},
  {id:"kerala",name:"Munnar",state:"Kerala",emoji:"🌿",desc:"Tea gardens & misty hills",vibe:"Tranquil green",bg:"linear-gradient(135deg,#43e97b,#38f9d7)",tags:["nature","hill"]},
  {id:"ooty",name:"Ooty",state:"Tamil Nadu",emoji:"🌸",desc:"Nilgiris colonial hill station",vibe:"Colonial charm",bg:"linear-gradient(135deg,#fbc2eb,#a6c1ee)",tags:["hill","nature"]},
  {id:"udaipur",name:"Udaipur",state:"Rajasthan",emoji:"🏰",desc:"City of Lakes & palaces",vibe:"Romantic & regal",bg:"linear-gradient(135deg,#f6d365,#fda085)",tags:["heritage"]},
  {id:"rishikesh",name:"Rishikesh",state:"Uttarakhand",emoji:"🕉️",desc:"Yoga, rafting & Ganga ghats",vibe:"Spiritual & active",bg:"linear-gradient(135deg,#667eea,#764ba2)",tags:["spiritual","nature"]},
  {id:"coorg",name:"Coorg",state:"Karnataka",emoji:"☕",desc:"Coffee estates & waterfalls",vibe:"Misty & fresh",bg:"linear-gradient(135deg,#11998e,#38ef7d)",tags:["nature"]},
  {id:"andaman",name:"Port Blair",state:"Andaman",emoji:"🐚",desc:"Island paradise & coral reefs",vibe:"Tropical escape",bg:"linear-gradient(135deg,#4facfe,#00f2fe)",tags:["beach"]},
  {id:"agra",name:"Agra",state:"Uttar Pradesh",emoji:"🕌",desc:"Taj Mahal & Mughal glory",vibe:"Iconic heritage",bg:"linear-gradient(135deg,#f093fb,#f5576c)",tags:["heritage"]},
  {id:"darjeeling",name:"Darjeeling",state:"West Bengal",emoji:"🍵",desc:"Tea trails & Kanchenjunga",vibe:"Misty mountains",bg:"linear-gradient(135deg,#a1c4fd,#c2e9fb)",tags:["hill","nature"]}
];

const ROUTES=[
  {id:"flight",icon:"✈️",name:"By Flight",desc:"Fastest for long distances",fields:[
    {id:"airline",label:"Airline",type:"select",options:["IndiGo","Air India","Vistara","SpiceJet","GoFirst","Air Asia"]},
    {id:"fclass",label:"Class",type:"select",options:["Economy","Business","First Class"]},
    {id:"airport",label:"Departure Airport",type:"text",placeholder:"e.g. BOM – Mumbai"}
  ]},
  {id:"train",icon:"🚂",name:"By Train",desc:"Scenic & comfortable rail journey",fields:[
    {id:"tclass",label:"Class",type:"select",options:["Sleeper (SL)","3 Tier AC (3A)","2 Tier AC (2A)","1st Class AC (1A)","Chair Car (CC)"]},
    {id:"station",label:"Departure Station",type:"text",placeholder:"e.g. PUNE Junction"},
    {id:"tname",label:"Train Name / No.",type:"text",placeholder:"e.g. 12127 Intercity"}
  ]},
  {id:"bus",icon:"🚌",name:"By Bus",desc:"Budget-friendly road travel",fields:[
    {id:"btype",label:"Bus Type",type:"select",options:["State Bus (MSRTC)","Luxury Volvo AC","Sleeper Coach","Mini Bus (hire)"]},
    {id:"bop",label:"Operator",type:"text",placeholder:"e.g. KSRTC / RedBus"}
  ]},
  {id:"car",icon:"🚗",name:"Private Cab / Fleet",desc:"Hire cabs or company vehicles",fields:[
    {id:"ctype",label:"Vehicle",type:"select",options:["Sedan (4 seater)","SUV (7 seater)","Tempo Traveller (12–16)","Mini Bus (20+)"]},
    {id:"cop",label:"Provider",type:"text",placeholder:"e.g. Ola Corporate / Myles"}
  ]}
];

const STAY={
  budget:[
    {id:"oyo",icon:"🏨",name:"OYO Rooms",desc:"Budget city-centre stay",price:"₹800–1,500/night"},
    {id:"zostel",icon:"🛏️",name:"Zostel Hostel",desc:"Social & affordable",price:"₹500–900/night"},
    {id:"guesthouse",icon:"🏡",name:"Local Guesthouse",desc:"Homely, authentic stay",price:"₹600–1,200/night"}
  ],
  midrange:[
    {id:"ibis",icon:"🏩",name:"Ibis / Lemon Tree",desc:"Business-friendly hotel",price:"₹2,000–3,500/night"},
    {id:"treebo",icon:"🌳",name:"Treebo Hotels",desc:"Standardised comfort",price:"₹1,800–3,000/night"},
    {id:"resort",icon:"🌊",name:"Mid-Range Resort",desc:"Amenities & pool",price:"₹2,500–4,500/night"}
  ],
  luxury:[
    {id:"taj",icon:"👑",name:"Taj / Oberoi",desc:"Iconic 5-star heritage",price:"₹8,000–20,000/night"},
    {id:"marriott",icon:"🌟",name:"Marriott / Hyatt",desc:"International luxury chain",price:"₹6,000–15,000/night"},
    {id:"boutique",icon:"🎨",name:"Boutique Heritage",desc:"Unique curated experience",price:"₹5,000–12,000/night"}
  ]
};

const ACTIVITIES={
  goa:[{icon:"🏄",name:"Water Sports",desc:"Surfing, parasailing, jet ski"},{icon:"⛵",name:"Sunset Cruise",desc:"Mandovi river cruise"},{icon:"🏛️",name:"Old Goa Churches",desc:"UNESCO heritage tour"},{icon:"🎭",name:"Casino Night",desc:"Deltin Royale"},{icon:"🛵",name:"Scooter Tour",desc:"Explore local beaches"},{icon:"🍹",name:"Beach Shack Crawl",desc:"Baga to Anjuna strip"}],
  shimla:[{icon:"🚂",name:"Toy Train Ride",desc:"Kalka–Shimla railway"},{icon:"🌄",name:"Jakhu Temple Trek",desc:"Himalaya panoramic views"},{icon:"⛷️",name:"Skiing at Kufri",desc:"Snow sports nearby"},{icon:"🏛️",name:"The Ridge Walk",desc:"Colonial promenade"},{icon:"🛍️",name:"Mall Road Shopping",desc:"Handicrafts & woolens"},{icon:"🌲",name:"Chail Sanctuary",desc:"Nature & forest walk"}],
  manali:[{icon:"❄️",name:"Rohtang Pass",desc:"Snow at 3,978m"},{icon:"🪂",name:"Paragliding",desc:"Solang Valley skies"},{icon:"🏕️",name:"Riverside Camping",desc:"Tent camping by Beas"},{icon:"🌸",name:"Hadimba Temple",desc:"Ancient deodar forest"},{icon:"🧘",name:"Old Manali Walk",desc:"Hippie cafes & art"},{icon:"🏍️",name:"Spiti Valley Drive",desc:"Bike / SUV day trip"}],
  jaipur:[{icon:"🏰",name:"Amber Fort",desc:"Royal Rajput fortress"},{icon:"🕌",name:"City Palace Tour",desc:"Royal museum & courts"},{icon:"🐘",name:"Elephant Experience",desc:"Ethical elephant sanctuary"},{icon:"🛍️",name:"Johari Bazaar",desc:"Gems, jewellery, textiles"},{icon:"🌄",name:"Nahargarh Fort",desc:"Sunset panoramic views"},{icon:"🍛",name:"Food Walk",desc:"Rajasthani culinary tour"}],
  kerala:[{icon:"🍵",name:"Tea Plantation Tour",desc:"Guided estate walk"},{icon:"🌊",name:"Eravikulam NP",desc:"Nilgiri tahr wildlife"},{icon:"🚣",name:"Mattupetty Boating",desc:"Scenic reservoir boating"},{icon:"🌿",name:"Ayurvedic Spa",desc:"Traditional wellness"},{icon:"🧗",name:"Anamudi Peak Trek",desc:"South India's highest"},{icon:"🌺",name:"Rajamala Grasslands",desc:"Rolling misty meadows"}],
  ooty:[{icon:"🚂",name:"Nilgiri Mountain Railway",desc:"UNESCO toy train"},{icon:"🌹",name:"Botanical Gardens",desc:"Colonial-era gardens"},{icon:"🚵",name:"Doddabetta Trek",desc:"Highest peak in Nilgiris"},{icon:"🛶",name:"Ooty Lake Boating",desc:"Serene paddleboat ride"},{icon:"🌾",name:"Tea Factory Visit",desc:"How Nilgiri tea is made"},{icon:"🐘",name:"Mudumalai Safari",desc:"Wildlife reserve nearby"}],
  udaipur:[{icon:"🚢",name:"Lake Pichola Cruise",desc:"Iconic sunset cruise"},{icon:"🏛️",name:"City Palace",desc:"Royal palace complex"},{icon:"🎨",name:"Bagore Ki Haveli",desc:"Folk dance & culture"},{icon:"🌺",name:"Saheliyon-ki-Bari",desc:"Garden of Ladies"},{icon:"🛍️",name:"Hathi Pol Bazaar",desc:"Miniature art & puppets"},{icon:"🌅",name:"Monsoon Palace",desc:"Hilltop sunset views"}],
  rishikesh:[{icon:"🚣",name:"White Water Rafting",desc:"Grade III–IV Ganga rapids"},{icon:"🪂",name:"Bungee Jumping",desc:"India's highest bungee 83m"},{icon:"🧘",name:"Yoga & Meditation",desc:"Retreat or drop-in class"},{icon:"🌉",name:"Laxman Jhula Walk",desc:"Iconic suspension bridge"},{icon:"🏕️",name:"Ganga Camping",desc:"Bonfire & stargazing"},{icon:"🌿",name:"Neer Garh Waterfall",desc:"Jungle trek & waterfall"}],
  coorg:[{icon:"☕",name:"Coffee Estate Tour",desc:"Plantation walk & tasting"},{icon:"💧",name:"Abbey Falls",desc:"Scenic waterfall trek"},{icon:"🐘",name:"Dubare Elephant Camp",desc:"Bathe elephants in river"},{icon:"🌿",name:"Raja's Seat",desc:"Sunset garden viewpoint"},{icon:"🧺",name:"Homestay Farm Life",desc:"Cook & live with locals"},{icon:"🚵",name:"Nagarhole Safari",desc:"Tiger reserve day trip"}],
  andaman:[{icon:"🤿",name:"Scuba Diving",desc:"Havelock Island reef"},{icon:"🏝️",name:"Radhanagar Beach",desc:"Asia's best beach"},{icon:"🌊",name:"Glass Bottom Boat",desc:"Coral reef snorkelling"},{icon:"🏛️",name:"Cellular Jail",desc:"Light & sound show"},{icon:"🦜",name:"Chidiya Tapu",desc:"Sunset bird sanctuary"},{icon:"🏄",name:"Neil Island Day Trip",desc:"Natural bridge & cycling"}],
  agra:[{icon:"🕌",name:"Taj Mahal Sunrise",desc:"UNESCO wonder"},{icon:"🏯",name:"Agra Fort",desc:"Mughal red sandstone fort"},{icon:"🌸",name:"Mehtab Bagh",desc:"Taj view across Yamuna"},{icon:"🛍️",name:"Kinari Bazaar",desc:"Marble crafts & leather"},{icon:"🍛",name:"Petha Sweet Tasting",desc:"Agra's signature sweet"},{icon:"🚗",name:"Fatehpur Sikri Trip",desc:"Abandoned Mughal capital"}],
  darjeeling:[{icon:"🌄",name:"Tiger Hill Sunrise",desc:"Kanchenjunga panorama"},{icon:"🚂",name:"Darjeeling Toy Train",desc:"UNESCO mountain railway"},{icon:"🍵",name:"Tea Estate Walk",desc:"Happy Valley / Makaibari"},{icon:"🦁",name:"Padmaja Naidu Zoo",desc:"Red panda & snow leopard"},{icon:"🧘",name:"Peace Pagoda",desc:"Japanese Buddhist stupa"},{icon:"🏔️",name:"Sandakphu Trek",desc:"Everest & Kangch views"}]
};

const FOOD={
  goa:{breakfast:[{icon:"🍳",name:"Goan Poie & Omelette",desc:"Local bread with egg fry"},{icon:"🥞",name:"Sannas & Curry",desc:"Steamed rice cakes"},{icon:"🍞",name:"Cafreal Toast",desc:"Spiced egg toast"}],lunch:[{icon:"🦞",name:"Fish Curry Rice",desc:"Classic Goan coconut curry"},{icon:"🍲",name:"Xacuti Chicken",desc:"Roasted coconut & spice"},{icon:"🦀",name:"Crab Masala",desc:"Spiced crab"}],dinner:[{icon:"🍖",name:"Pork Vindaloo",desc:"Tangy Goan pork classic"},{icon:"🫕",name:"Prawn Balchão",desc:"Prawn pickle curry"},{icon:"🍹",name:"Bebinca & Feni",desc:"Traditional Goan dessert"}]},
  shimla:{breakfast:[{icon:"🫓",name:"Sidu Bread",desc:"Stuffed Himachali bread"},{icon:"🥣",name:"Porridge & Nuts",desc:"Warming hill breakfast"},{icon:"🍳",name:"Aloo Paratha",desc:"With makhan & pickle"}],lunch:[{icon:"🍛",name:"Dham Thali",desc:"Himachali feast"},{icon:"🫘",name:"Madra Curry",desc:"Yoghurt-based chickpeas"},{icon:"🍲",name:"Trout Fish Curry",desc:"Local river trout"}],dinner:[{icon:"🥩",name:"Mutton Rogan Josh",desc:"Kashmiri slow-cooked"},{icon:"🫕",name:"Chha Gosht",desc:"Yoghurt marinated lamb"},{icon:"🍵",name:"Babru & Kheer",desc:"Himachali dessert"}]},
  manali:{breakfast:[{icon:"🥣",name:"Thukpa Noodle Soup",desc:"Tibetan warming broth"},{icon:"🫓",name:"Siddu with Ghee",desc:"Himachali bread"},{icon:"🍳",name:"Besan Cheela",desc:"Gram flour pancakes"}],lunch:[{icon:"🥟",name:"Momos & Soup",desc:"Tibetan dumplings"},{icon:"🍜",name:"Thenthuk",desc:"Thick Tibetan noodles"},{icon:"🍛",name:"Trout Curry",desc:"Beas river trout"}],dinner:[{icon:"🫕",name:"Dham Feast",desc:"Himachali rajma, kaddu"},{icon:"🥩",name:"Himachali Mutton",desc:"With yoghurt & spices"},{icon:"🍵",name:"Butter Tea",desc:"Tibetan salted chai"}]},
  jaipur:{breakfast:[{icon:"🥣",name:"Pyaaz Kachori",desc:"Flaky onion kachori"},{icon:"🫓",name:"Missi Roti",desc:"Besan-wheat flatbread"},{icon:"🍵",name:"Masala Chai",desc:"Rajasthani chai"}],lunch:[{icon:"🍛",name:"Dal Baati Churma",desc:"Rajasthan's iconic trio"},{icon:"🍲",name:"Gatte ki Sabzi",desc:"Besan dumplings in curry"},{icon:"🥘",name:"Lal Maas",desc:"Fiery Rajasthani mutton"}],dinner:[{icon:"🫕",name:"Ker Sangri",desc:"Desert beans & berries"},{icon:"🍖",name:"Tandoori Boti",desc:"Clay-oven lamb"},{icon:"🍮",name:"Ghevar Dessert",desc:"Lattice cake with rabdi"}]},
  kerala:{breakfast:[{icon:"🥞",name:"Appam & Stew",desc:"Rice hoppers with stew"},{icon:"🍳",name:"Puttu & Kadala",desc:"Steamed rice cylinders"},{icon:"🫓",name:"Dosa & Sambar",desc:"Crispy rice crêpe"}],lunch:[{icon:"🍃",name:"Kerala Sadya",desc:"Banana-leaf feast"},{icon:"🦞",name:"Karimeen Pollichathu",desc:"Pearl spot fish"},{icon:"🍲",name:"Mutton Stew & Rice",desc:"Coconut-milk stew"}],dinner:[{icon:"🦐",name:"Prawn Molee",desc:"Coconut milk prawn"},{icon:"🥥",name:"Aviyal & Matta Rice",desc:"Mixed veg coconut dish"},{icon:"🍵",name:"Payasam",desc:"Jaggery rice pudding"}]},
  ooty:{breakfast:[{icon:"🫓",name:"Nilgiri Toast",desc:"Local bakery sourdough"},{icon:"🥣",name:"Oats & Tea Honey",desc:"Mountain-fresh oats"},{icon:"🍳",name:"Idli & Chutney",desc:"South Indian classic"}],lunch:[{icon:"🍛",name:"Mutton Briyani",desc:"Dum-cooked mountain mutton"},{icon:"🥘",name:"Bisi Bele Bath",desc:"Karnataka lentil rice"},{icon:"🍲",name:"Sambar Vada Lunch",desc:"Temple-style meal"}],dinner:[{icon:"🍖",name:"BBQ Chicken",desc:"Colonial-style grill"},{icon:"🫕",name:"Varkey Curry",desc:"Nilgiri tribal dish"},{icon:"🍵",name:"Nilgiri Tea",desc:"Tea with shortbread"}]},
  udaipur:{breakfast:[{icon:"🥣",name:"Mawa Kachori",desc:"Sweet stuffed kachori"},{icon:"🫓",name:"Rabdi & Jalebi",desc:"Indulgent Rajasthani"},{icon:"🍳",name:"Poha & Chai",desc:"Flattened rice breakfast"}],lunch:[{icon:"🍛",name:"Dal Baati",desc:"Classic Rajasthani"},{icon:"🍲",name:"Bajra Roti",desc:"Rustic millet bread"},{icon:"🥘",name:"Lassi at Sukhadia",desc:"Sweet lassi"}],dinner:[{icon:"🍖",name:"Regal Thali",desc:"Palace lakeside dining"},{icon:"🫕",name:"Khichdi & Kadhi",desc:"Comfort Rajasthani"},{icon:"🍮",name:"Malpua & Rabdi",desc:"Fried pancake with cream"}]},
  rishikesh:{breakfast:[{icon:"🥣",name:"Organic Porridge",desc:"Ashram-style health bowl"},{icon:"🫓",name:"Banana Pancakes",desc:"Café by the Ganga"},{icon:"🍵",name:"Herbal Tea & Toast",desc:"Riverside café morning"}],lunch:[{icon:"🍛",name:"Thali at Chotiwala",desc:"Iconic thali"},{icon:"🥗",name:"Israeli Salad",desc:"Backpacker café fave"},{icon:"🫕",name:"Rajma Chawal",desc:"Home-style kidney beans"}],dinner:[{icon:"🍖",name:"Pahadi Chicken Curry",desc:"Mountain-style slow cooked"},{icon:"🥟",name:"Momos",desc:"Tibetan dumplings"},{icon:"🌿",name:"Sattvic Prasad Dinner",desc:"Ashram vegetarian feast"}]},
  coorg:{breakfast:[{icon:"☕",name:"Estate Coffee & Toast",desc:"Freshly roasted estate brew"},{icon:"🍳",name:"Akki Roti & Chutney",desc:"Rice flour flatbread"},{icon:"🥞",name:"Kadambuttu",desc:"Coorg steamed rice balls"}],lunch:[{icon:"🍛",name:"Pandi Curry",desc:"Coorg pork & string hoppers"},{icon:"🥘",name:"Koli Curry",desc:"Coorg jungle spice chicken"},{icon:"🍃",name:"Bamboo Shoot Curry",desc:"Local forest ingredient"}],dinner:[{icon:"🍖",name:"Coorg Curry Homestay",desc:"Traditional family dinner"},{icon:"🫕",name:"Thalipeeth",desc:"Multi-grain savoury pancake"},{icon:"🍵",name:"Black Coffee",desc:"Estate farm nightcap"}]},
  andaman:{breakfast:[{icon:"🥥",name:"Coconut Idli & Sambar",desc:"Island morning"},{icon:"🍳",name:"Egg Curry & Bread",desc:"Port Blair café"},{icon:"🥣",name:"Tropical Fruit Platter",desc:"Papaya, pineapple, banana"}],lunch:[{icon:"🦞",name:"Grilled Lobster",desc:"Havelock beach shack"},{icon:"🦐",name:"Prawn Coconut Curry",desc:"Island coastal fave"},{icon:"🐠",name:"Tuna Steak",desc:"Fresh Andaman tuna"}],dinner:[{icon:"🍖",name:"BBQ Seafood Platter",desc:"Sunset beach BBQ"},{icon:"🦀",name:"Mud Crab Masala",desc:"Spicy island crab"},{icon:"🍵",name:"Coconut Halwa",desc:"Island coconut dessert"}]},
  agra:{breakfast:[{icon:"🥣",name:"Bedmi Poori",desc:"Agra street breakfast"},{icon:"🍳",name:"Moong Dal Halwa",desc:"Rich pulse dessert"},{icon:"🫓",name:"Petha & Chai",desc:"Agra's iconic sweet"}],lunch:[{icon:"🍛",name:"Mughlai Biryani",desc:"Dum-cooked royal biryani"},{icon:"🥘",name:"Nihari Gosht",desc:"Slow-cooked Mughal stew"},{icon:"🍲",name:"Dahi Bhalla Chaat",desc:"Agra's legendary chaat"}],dinner:[{icon:"🍖",name:"Peshwari Kabab Platter",desc:"Tandoor-smoked kebabs"},{icon:"🫕",name:"Dal Makhani & Naan",desc:"Creamy black lentils"},{icon:"🍮",name:"Shahi Tukda",desc:"Royal bread pudding"}]},
  darjeeling:{breakfast:[{icon:"🍵",name:"Darjeeling Tea",desc:"World's finest first flush"},{icon:"🥟",name:"Momo & Chia Soup",desc:"Tibetan morning dumplings"},{icon:"🍳",name:"Egg Fried Rice",desc:"Indo-Chinese hill café"}],lunch:[{icon:"🫕",name:"Thukpa Noodle Soup",desc:"Tibetan mountain broth"},{icon:"🍛",name:"Gundruk & Dal Bhat",desc:"Nepali fermented greens"},{icon:"🥘",name:"Mushroom Sizzler",desc:"Hill station favourite"}],dinner:[{icon:"🍖",name:"Phagshapa Pork",desc:"Tibetan dried pork"},{icon:"🥟",name:"Kothey Momo",desc:"Crispy pan-fried dumplings"},{icon:"🍵",name:"Butter Tea & Sel Roti",desc:"Nepali ring doughnut"}]}
};

const DEFAULT_FOOD={
  breakfast:[{icon:"🍳",name:"Full Indian Breakfast",desc:"Poha, upma or paratha"},{icon:"🥣",name:"Fruit & Yoghurt",desc:"Seasonal fruits with curd"},{icon:"🫓",name:"Masala Dosa",desc:"Crispy dosa with sambar"}],
  lunch:[{icon:"🍛",name:"Regional Thali",desc:"Local specialty thali"},{icon:"🍲",name:"Dal & Sabzi",desc:"Home-style meal"},{icon:"🥘",name:"Biryani",desc:"Fragrant dum rice"}],
  dinner:[{icon:"🍖",name:"Grilled & Salad",desc:"Light dinner option"},{icon:"🫕",name:"Curry & Naan",desc:"Rich curry with bread"},{icon:"🍮",name:"Gulab Jamun",desc:"Dessert & chai"}]
};
