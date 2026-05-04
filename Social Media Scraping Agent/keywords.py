import re

keywords = {

    "universities": [
        # English
        "Nile University", "Cairo University", "Ain Shams University",
        "Alexandria University", "Helwan University", "Mansoura University",
        "Zagazig University", "Tanta University", "Assiut University",
        "Suez Canal University", "Benha University", "Fayoum University",
        "Minia University", "Sohag University", "South Valley University",
        "Beni Suef University", "Kafr El Sheikh University", "Damietta University",
        "Port Said University", "Arish University", "Luxor University",
        "GUC", "German University Cairo", "AUC", "American University Cairo",
        "BUE", "British University Egypt", "MSA University", "Modern Sciences Arts",
        "AAST", "Arab Academy", "Future University", "Misr International University",
        "MIU", "Pharos University", "MTI University", "October University",
        "6 October University", "Modern Academy", "Canadian International College",
        "CIC", "Sinai University", "Galala University", "King Salman University",
        "Egyptian Chinese University", "Newgiza University", "NGU",
        "Delta University", "Badr University", "Merit University",
        "Egyptian Russian University", "ERU", "October 6 University",
        # Arabic
        "جامعة النيل", "جامعة القاهرة", "جامعة عين شمس", "جامعة الإسكندرية",
        "جامعة حلوان", "جامعة المنصورة", "جامعة الزقازيق", "جامعة طنطا",
        "جامعة أسيوط", "جامعة قناة السويس", "جامعة بنها", "جامعة الفيوم",
        "جامعة المنيا", "جامعة سوهاج", "جامعة جنوب الوادي", "جامعة بني سويف",
        "جامعة كفر الشيخ", "جامعة دمياط", "جامعة بورسعيد", "جامعة العريش",
        "جامعة الأقصر", "الجامعة الألمانية", "الجامعة الأمريكية", "الجامعة البريطانية",
        "جامعة المستقبل", "جامعة مصر الدولية", "جامعة فاروس", "جامعة أكتوبر",
        "جامعة 6 أكتوبر", "الأكاديمية الحديثة", "جامعة سيناء", "جامعة الجلالة",
        "جامعة الملك سلمان", "جامعة نيو جيزة", "جامعة دلتا", "جامعة بدر",
        "جامعة ميريت", "الجامعة المصرية الروسية", "الجامعة المصرية الصينية",
        "الأكاديمية العربية", "الجامعة", "جامعة",
        # Arabizi
        "Game3et el Nil", "Game3et Cairo", "Game3et Ain Shams",
        "Game3et Eskandarya", "Game3et Mansoura", "Game3et Helwan",
        "Game3et Zakazik", "el game3a", "game3a",
    ],

    "faculties": [
        # English
        "Faculty of Engineering", "Faculty of Computer Science",
        "Faculty of Information Technology", "Faculty of Business",
        "Faculty of Medicine", "Faculty of Pharmacy", "Faculty of Law",
        "Faculty of Arts", "Faculty of Science", "Faculty of Economics",
        "Faculty of Mass Communication", "Faculty of Architecture",
        "Faculty of Dentistry", "Faculty of Nursing", "Faculty of Education",
        "Faculty of Fine Arts", "Faculty of Agriculture", "Faculty of Veterinary",
        "Faculty of Tourism", "Faculty of Physical Therapy",
        "ITCS", "Information Technology and Computer Science",
        "AI department", "Artificial Intelligence department",
        "Computer Engineering", "Software Engineering", "Data Science department",
        "Cybersecurity department", "Networks department",
        # Arabic
        "كلية الهندسة", "كلية علوم الحاسب", "كلية تكنولوجيا المعلومات",
        "كلية إدارة الأعمال", "كلية الطب", "كلية الصيدلة", "كلية الحقوق",
        "كلية الآداب", "كلية العلوم", "كلية الاقتصاد", "كلية الإعلام",
        "كلية العمارة", "كلية طب الأسنان", "كلية التمريض", "كلية التربية",
        "كلية الفنون الجميلة", "كلية الزراعة", "كلية البيطرة",
        "كلية السياحة", "كلية العلاج الطبيعي",
        "قسم الذكاء الاصطناعي", "قسم علوم الحاسب", "قسم هندسة البرمجيات",
        "قسم أمن المعلومات", "قسم الشبكات", "قسم علم البيانات",
        "تكنولوجيا المعلومات وعلوم الحاسب", "الكلية", "القسم",
        # Arabizi
        "kolyet el handasa", "kolyet computer science", "kolyet el tibb",
        "kolyet el 3olom", "kolyet el edara", "el kolya", "el 2esm",
        "2esm el AI", "2esm computer", "2esm el software",
    ],

    "tech_trends": [
        # English
        "Artificial Intelligence", "Machine Learning", "Deep Learning",
        "Neural Networks", "Large Language Models", "Generative AI",
        "Natural Language Processing", "Computer Vision",
        "Reinforcement Learning", "Data Science", "Big Data",
        "Data Engineering", "Data Analytics", "Business Intelligence",
        "Cloud Computing", "Edge Computing", "Embedded Systems",
        "Quantum Computing", "Augmented Reality", "Virtual Reality",
        "Digital Transformation", "Prompt Engineering", "Vector Database",
        "Full Stack", "Mobile Development", "Ethical Hacking",
        "Penetration Testing", "Information Security",
        "ChatGPT", "GPT-4", "Gemini", "LLaMA",
        "AWS", "Azure", "Google Cloud", "DevOps", "MLOps",
        "Kubernetes", "Docker", "Microservices", "Cybersecurity",
        "Blockchain", "Cryptocurrency", "Web3", "Robotics", "Automation",
        "Fintech", "Healthtech", "Edtech", "Fine-tuning",
        "React", "Flutter", "Python", "Rust",
        "GraphQL", "Serverless", "IoT", "5G", "RAG",
        "LLM", "GenAI", "NLP", "MLOps", "RPA",
        # Arabic
        "الذكاء الاصطناعي", "تعلم الآلة", "التعلم العميق", "الشبكات العصبية",
        "معالجة اللغة الطبيعية", "رؤية الحاسوب", "علم البيانات",
        "البيانات الضخمة", "الحوسبة السحابية", "أمن المعلومات",
        "الأمن السيبراني", "إنترنت الأشياء", "البلوكشين",
        "الواقع المعزز", "الواقع الافتراضي", "الميتافيرس",
        "الروبوتات", "الأتمتة", "التحول الرقمي", "هندسة البيانات",
        "ذكاء اصطناعي توليدي", "نماذج لغوية كبيرة", "هندسة البرمجيات",
        "تطوير التطبيقات", "تقنية", "برمجة",
        # Arabizi
        "machine learning", "deep learning", "data science", "cloud",
        "cybersecurity", "blockchain", "el zaka2 el estna3y",
        "ta3alom el ala", "ta3lom 3amik", "amn el ma3lomat",
        "howsaba sa7abya", "big data", "data analytics", "barmaga",
    ],

    "opportunities": [
        # English
        "internship", "scholarship", "grant", "fellowship",
        "exchange program", "study abroad", "job offer", "career fair",
        "job fair", "bootcamp", "certification", "hackathon",
        "partnership", "collaboration", "research opportunity", "funding",
        "incubator", "accelerator", "mentorship", "networking",
        "remote work", "freelance", "in demand", "market need",
        "growing field", "emerging technology", "new program",
        "new track", "expanding", "opportunities abroad", "global demand",
        "hiring", "recruitment", "workshop", "training", "competition",
        "award", "startup", "investment",
        # Arabic
        "فرصة عمل", "فرصة", "منحة دراسية", "منحة", "تدريب صيفي", "تدريب",
        "برنامج تبادل", "دراسة بالخارج", "معرض توظيف", "ورشة عمل",
        "بوتكامب", "شهادة معتمدة", "مؤتمر", "هاكاثون", "مسابقة",
        "جائزة", "شراكة", "تعاون", "تمويل", "بحث علمي",
        "ريادة أعمال", "حاضنة أعمال", "مسرّع أعمال", "استثمار",
        "إرشاد مهني", "تواصل مهني", "عمل عن بعد", "فريلانس",
        "مجال واعد", "تقنية ناشئة", "برنامج جديد", "توسع",
        "فرص بالخارج", "طلب متزايد",
        # Arabizi
        "forsa 3amal", "forsa", "men7a", "tadreeb", "bootcamp",
        "sha hada", "mo2tamar", "hakathon", "mosa2aba",
        "sha raka", "tamweel", "startup", "freelance", "remote",
        "forsa barra", "matloob", "magal wa2ed",
    ],

    "threats": [
        # English
        "brain drain", "emigration", "leaving Egypt", "going abroad",
        "market saturation", "unemployment", "no jobs", "low salary",
        "underpaid", "outdated curriculum", "weak curriculum",
        "no internship", "no practical experience", "theoretical only",
        "poor quality", "economic crisis", "inflation", "devaluation",
        "no research", "dropout", "corruption", "unfair",
        "no labs", "poor infrastructure", "overcrowded",
        "expensive tuition", "tuition fees",
        # Arabic — use substrings for Arabic (no \b support)
        "هجرة الأدمغة", "هجرة", "السفر للخارج", "تشبع سوق العمل",
        "بطالة", "مفيش شغل", "مرتب منخفض", "مناهج قديمة",
        "مناهج ضعيفة", "مفيش تدريب", "مفيش خبرة عملية",
        "نظري بس", "جودة ضعيفة", "رسوم دراسية مرتفعة", "رسوم دراسية",
        "أزمة اقتصادية", "تضخم", "انهيار العملة",
        "مفيش بحث علمي", "أساتذة ضعاف", "فساد", "واسطة",
        "ظلم", "مفيش معامل", "بنية تحتية ضعيفة", "ازدحام",
        "رسوب", "غش", "مفيش فرص", "ضعيف",
        # Arabizi
        "hegra", "brain drain", "msafer barra", "mafesh shoghl",
        "batala", "morateeb we7sha", "mafesh tadreeb",
        "nazary bas", "rsom 3alya", "azma e2tesadya", "ghesh",
        "wasata", "zolm", "mafesh labs", "mafesh foras",
    ],

    "education_nouns": [
        # English
        "course", "lecture", "professor", "exam", "assignment",
        "project", "thesis", "graduation", "semester", "GPA",
        "credit hours", "major", "elective", "curriculum", "syllabus",
        "lab", "research", "graduate", "undergraduate", "postgraduate",
        "masters", "PhD", "bachelor", "diploma", "certificate",
        "department", "campus", "library", "registration", "enrollment",
        "academic year", "schedule", "tuition",
        # Arabic
        "مادة دراسية", "مادة", "محاضرة", "دكتور", "أستاذ", "امتحان",
        "واجب", "مشروع تخرج", "مشروع", "رسالة ماجستير", "رسالة",
        "تخرج", "ترم", "مجموع", "تخصص", "اختياري", "منهج دراسي",
        "منهج", "كتاب", "معمل", "بحث علمي", "بحث",
        "خريج", "دراسات عليا", "ماجستير", "دكتوراه",
        "بكالوريوس", "دبلوم", "شهادة", "حرم جامعي",
        "مكتبة", "تسجيل", "قبول", "ساعات معتمدة", "جدول دراسي",
        # Arabizi
        "mada", "mohadra", "doktora", "ostaz", "emte7an", "waged",
        "mashroo3", "resala", "takhrog", "term", "takhasos",
        "menhag", "ma3mal", "ba7s", "khareg", "masters",
        "bkalorios", "diploma", "campus", "maktaba", "tasegl",
    ],

    "career_nouns": [
        # English
        "job", "salary", "income", "employer", "hiring", "layoff",
        "promotion", "remote work", "hybrid work", "startup", "corporate",
        "freelance", "full time", "part time", "experience",
        "portfolio", "resume", "interview", "offer letter",
        "LinkedIn", "Wuzzuf", "Forasna", "software engineer",
        "data scientist", "AI engineer", "product manager",
        "UX designer", "DevOps engineer", "security analyst",
        "network engineer", "cloud architect",
        # Arabic
        "شغل", "وظيفة", "مسار مهني", "راتب", "دخل", "شركة",
        "صاحب عمل", "موظف", "توظيف", "فصل من العمل", "ترقية",
        "زيادة راتب", "عمل عن بعد", "ستارت أب", "فريلانس",
        "دوام كامل", "دوام جزئي", "خبرة عملية", "خبرة", "بورتفوليو",
        "سيرة ذاتية", "مقابلة عمل", "عرض عمل",
        "مهندس برمجيات", "عالم بيانات", "مهندس ذكاء اصطناعي",
        # Arabizi
        "shoghl", "wazifa", "rateb", "sherka", "mowazaf",
        "tawzeef", "tar2ya", "remote", "startup", "freelance",
        "khibra", "portfolio", "CV", "mo2abla", "offer letter",
    ],

    "sentiment_verbs": [
        # English
        "recommend", "warn", "avoid", "prefer", "regret", "complain",
        "praise", "compare", "transfer", "apply", "reject",
        "struggle", "improve", "decline", "grow", "hire", "fire",
        "promote", "invest", "launch", "expand", "compete", "collaborate",
        # Arabic
        "بنصح", "بحذر", "بفضل", "بكره", "بندم", "بشتكي",
        "بمدح", "بقارن", "بنقل", "بقدم على", "برفض",
        "بتعب", "بتحسن", "بتراجع", "بينمو", "بيوظف", "بيطرد",
        "بيرقي", "بيستثمر", "بيطلق", "بيتوسع", "بيتنافس", "بيتعاون",
        "اتخرجت", "اتعينت", "قدمت على", "اتقبلت", "اترفضت",
        "عايز اشتغل", "عايز اتخرج", "عايز اتعلم", "نصيحتي",
        # Arabizi
        "ben2a7", "ba7zar", "bafadel", "bakra", "bandm",
        "beshteky", "bamda7", "ba2arn", "ba2addem", "barfod",
        "bange7", "bat3ab", "bete7ssen", "beyetrase3",
        "bywazef", "byetard", "nas7ety", "ra2y",
    ],

    "comparison_phrases": [
        # English
        "better than", "worse than", "compared to", "unlike",
        "more advanced", "more practical", "more theoretical",
        "higher ranked", "more expensive", "better reputation",
        "stronger alumni", "ahead of", "behind",
        # Arabic
        "أحسن من", "أسوأ من", "مقارنة بـ", "على عكس",
        "أقوى من", "أضعف من", "أكثر عملية", "أكثر نظرية",
        "سمعة أحسن", "خريجين أقوى", "متقدم عن", "متأخر عن",
        "أحسن من", "أقل من", "أغلى من",
        # Arabizi
        "a7san men", "awsa2 men", "mo2aranan be",
        "a2wa men", "ad3af men", "sem3a a7san", "kharegen a2wa",
    ],
}


def _is_arabic(word: str) -> bool:
    """Returns True if the word contains Arabic script characters."""
    return bool(re.search(r'[\u0600-\u06FF]', word))


def _build_pattern(word: str) -> re.Pattern:
    """
    Build a regex pattern appropriate for the script:
    - Arabic script  → simple substring match (re.search) — \b doesn't work for Arabic
    - Multi-word Latin phrase → case-insensitive substring
    - Short ALL-CAPS acronym (<=4 chars) → word boundary, case-sensitive
    - Everything else → word boundary, case-insensitive
    """
    escaped = re.escape(word)
    if _is_arabic(word):
        return re.compile(escaped)
    if len(word.split()) > 1:
        return re.compile(escaped, re.IGNORECASE)
    if word.isupper() and len(word) <= 4:
        return re.compile(r'\b' + escaped + r'\b')
    return re.compile(r'\b' + escaped + r'\b', re.IGNORECASE)


# Pre-compile all patterns once at import time
_compiled: dict[str, list[tuple[str, re.Pattern]]] = {
    cat: [(w, _build_pattern(w)) for w in words]
    for cat, words in keywords.items()
}


def is_relevant(text: str) -> bool:
    """
    Layer 1 relevance filter.
    Returns True if the text matches at least one keyword from any category.
    """
    for cat_patterns in _compiled.values():
        for _, pattern in cat_patterns:
            if pattern.search(text):
                return True
    return False


def get_matched_categories(text: str) -> list[str]:
    """Returns which keyword categories matched — for JSON store enrichment."""
    matched = []
    for cat, cat_patterns in _compiled.items():
        for _, pattern in cat_patterns:
            if pattern.search(text):
                matched.append(cat)
                break
    return matched


def get_matched_keywords(text: str) -> list[str]:
    """Returns exact matched keywords — for frequency analysis in dashboard."""
    matched = []
    for cat_patterns in _compiled.values():
        for word, pattern in cat_patterns:
            if pattern.search(text):
                matched.append(word)
    return matched


if __name__ == "__main__":
    for cat, words in keywords.items():
        print(f"  {cat}: {len(words)} keywords")
    print(f"\nTotal categories : {len(keywords)}")
    print(f"Total keywords   : {sum(len(v) for v in keywords.values())}")

    print("\n--- Relevance tests ---")
    tests = [
        ("RELEVANT",   "فيه internship في شركة كبيرة للي بيتخرج من جامعة النيل"),
        ("RELEVANT",   "ana mesh 3aref akhtaar el takhasos el sa7 bein AI w cybersecurity"),
        ("IRRELEVANT", "Happy birthday to my friend!"),
        ("RELEVANT",   "الهجرة هي الحل الوحيد بعد التخرج مفيش فرص في مصر"),
        ("IRRELEVANT", "who wants to go to the movies tonight?"),
        ("RELEVANT",   "GUC 3andohom partnership ma3 Valeo da advantage kbeer"),
        ("RELEVANT",   "machine learning byet3alem 3la data kteer"),
        ("IRRELEVANT", "el akl fi el cafeteria we7esh awy el naharda"),
        ("RELEVANT",   "مفيش شغل في مصر والكل بيفكر في الهجرة"),
        ("RELEVANT",   "el ITCS faculty fel game3a di a7san men el GUC"),
    ]
    all_pass = True
    for expected, post in tests:
        result  = "RELEVANT" if is_relevant(post) else "IRRELEVANT"
        cats    = get_matched_categories(post)
        kws     = get_matched_keywords(post)
        status  = "OK" if result == expected else "FAIL"
        if status == "FAIL":
            all_pass = False
        print(f"  [{status}] expected={expected} got={result}")
        print(f"       cats    : {cats}")
        print(f"       keywords: {kws[:4]}")
        print(f"       post    : {post[:70]}")
        print()
    print("All tests passed!" if all_pass else "Some tests FAILED — review above.")