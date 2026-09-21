/**
 * Every Urdu/Arabic string on the site, verified against primary sources on 2026-09-20.
 * Urdu uses Urdu code points (ہ U+06C1, ی U+06CC, ک U+06A9, ے U+06D2, digits U+06F0–06F9).
 * Quranic Arabic keeps Arabic code points so Naskh fonts (Amiri Quran) shape it correctly.
 * Edit here, never inside components.
 */
export const invite = {
  bismillah: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
  salam: "السلام علیکم ورحمۃ اللہ وبرکاتہ",
  title: "دعوتِ نکاح",
  titleLatin: "Nikkah Invitation",
  coupleShort: "ساجد و ایمن",
  coupleLatin: "Sajid & Aiman",
  gate: {
    line1: "دعوت نامۂ نکاح",
    open: "دعوت نامہ کھولیں",
    skip: "آگے بڑھیں",
  },

  verse: {
    /** Ar-Rum 30:21, Imlaei script (web-font safe), complete ayah. */
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    ref: "سورۃ الروم: ۳۰:۲۱",
    urdu: "اور اُس کی نشانیوں میں سے یہ ہے کہ اُس نے تمہارے ہی لیے تم میں سے جوڑے پیدا کیے تاکہ تم اُن سے سکون حاصل کرو، اور اُس نے تمہارے درمیان محبت اور رحمت پیدا کر دی۔",
  },

  dua: {
    /** Sunan Abi Dawud 2130 / Jami' at-Tirmidhi 1091 (hasan sahih), authentic singular wording. */
    arabic: "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    urdu: "اللہ تعالیٰ تمہیں برکت دے، تم پر برکت نازل فرمائے اور تم دونوں کو خیر پر جمع رکھے۔",
  },

  groom: { name: "ساجد راجپوت", parent: "ولد شاہد راجپوت", honorific: "سلّمہٗ", latin: "Sajid Rajput" },
  bride: { name: "ایمن خان", parent: "بنت نعیم خان", honorific: "سلّمہا", latin: "Aiman Khan" },

  body: {
    intro: "اللہ تعالیٰ کے فضل و کرم اور اس کی رضا سے، سنّتِ رسول ﷺ کی پیروی میں، ہم اپنے عزیز فرزندِ ارجمند",
    and: "اور اپنی عزیزہ دخترِ نیک اختر",
    outro: "کی تقریبِ نکاح میں آپ کو بصد احترام مدعو کرتے ہیں۔",
    tagline: "دو دل، دو خاندان، ایک دعا",
  },

  when: {
    heading: "تاریخ و وقت",
    day: "بروز جمعہ",
    gregorian: "۱۶ اکتوبر ۲۰۲۶ء",
    dayNum: "16",
    monthYear: "اکتوبر ۲۰۲۶ء",
    hijri: "بمطابق ۵ جمادی الاوّل ۱۴۴۸ھ",
    hijriNote: "(رؤیتِ ہلال کے مطابق)",
    time: "بعد نمازِ عصر",
    latin: "Friday, 16 October 2026 · after Asr",
  },

  where: {
    heading: "مقام",
    name: "مسجدِ قبا",
    address: "ناصر پارک، توحید روڈ، لاہور",
    latin: "Masjid-e-Quba, Nasir Park, Tauheed Road, Lahore",
    directions: "راستہ معلوم کریں",
    openMap: "نقشہ دیکھیں",
    appleMaps: "ایپل میپس",
    qrCaption: "مقام کا QR کوڈ اسکین کریں",
    qrDownload: "QR ڈاؤن لوڈ کریں",
    showMap: "نقشہ دکھائیں",
  },

  timeline: [{ label: "آمد" }, { label: "نمازِ عصر" }, { label: "نکاح" }],
  essentials: { parts: ["۱۶ اکتوبر", "بعد نمازِ عصر", "مسجدِ قبا"], route: "راستہ" },
  eyebrows: { verse: "آیتِ قرآنی", when: "تاریخ و وقت", where: "مقام", note: "گزارش", dua: "دعا", countdown: "الٹی گنتی", calendar: "کیلنڈر", share: "شیئر" },
  note: {
    heading: "گزارش",
    text: "تمام معزز مہمانوں سے مؤدبانہ درخواست ہے کہ نمازِ عصر سے قبل تشریف لے آئیں۔ نمازِ عصر باجماعت ادا کرنے کے بعد، ان شاء اللہ، نکاح کی تقریب کا آغاز ہوگا۔",
    short: "براہِ کرم اذانِ عصر سے پہلے پہنچیں",
    punctual: "وقت کی پابندی کی درخواست ہے۔",
  },

  countdown: {
    heading: "مبارک گھڑی میں باقی وقت",
    units: { days: "دن", hours: "گھنٹے", minutes: "منٹ", seconds: "سیکنڈ" },
    zero: "الحمدللہ! مبارک گھڑی آن پہنچی",
    after: "نکاح مکمل ہوا — الحمدللہ",
  },

  calendar: {
    heading: "کیلنڈر میں شامل کریں",
    google: "گوگل کیلنڈر",
    apple: "ایپل / آئی فون",
    outlook: "آؤٹ لک",
    yahoo: "یاہو",
    ics: "iCal فائل",
    hint: "آئی فون پر «ایپل / آئی فون» دبائیں — کیلنڈر خود کھل جائے گا",
  },

  share: {
    heading: "دعوت نامہ آگے بھیجیں",
    whatsapp: "واٹس ایپ پر بھیجیں",
    share: "شیئر کریں",
    copy: "لنک کاپی کریں",
    copied: "لنک کاپی ہو گیا ✓",
    text: "السلام علیکم! ساجد راجپوت اور ایمن خان کے نکاح کی مبارک تقریب میں آپ مدعو ہیں۔\nبروز جمعہ، ۱۶ اکتوبر ۲۰۲۶ء، بعد نمازِ عصر\nمسجدِ قبا، ناصر پارک، توحید روڈ، لاہور\n\nتفصیلات:",
  },

  sher: {
    lines: [
      "دعا ہے یہ رشتہ محبت سے مہکتا رہے،",
      "ہر قدم پہ رب کا کرم ساتھ چلتا رہے،",
      "سکونِ دل ہو، رحمتیں ہوں ہر گھڑی،",
      "یہ ساتھ عمر بھر خوشیوں سے بھرا رہے۔",
    ],
  },

  closing: {
    line1: "آپ کی تشریف آوری ہمارے لیے باعثِ مسرت و افتخار ہوگی۔",
    line2: "نوبیاہتا جوڑے کے لیے دعاؤں کی درخواست ہے۔",
    from: "منجانب: راجپوت و خان خاندان",
    fromDetail: "شاہد راجپوت اور نعیم خان (مع اہل و عیال)",
    signoff: "طالبِ دعا",
  },

  ui: {
    music: "نشید",
    musicOn: "نشید سنیں",
    musicOff: "خاموش کریں",
    close: "بند کریں",
    scroll: "نیچے دیکھیں",
    madeWith: "محبت سے تیار کردہ",
    footerLatin: "Nikkah Invitation · Friday 16 October 2026 · Lahore",
    contactPrompt: "ایسا دعوت نامہ بنوانا ہے؟",
    /** Display form stays Latin-digit and LTR so the number is dialable as written. */
    contactNumber: "+92 320 8402391",
    contactTel: "+923208402391",
    contactWhatsapp: "واٹس ایپ",
    /** wa.me wants the number bare — no plus, no spaces. */
    contactWaNumber: "923208402391",
    /** Prefilled WhatsApp opener; encoded at the call site. */
    contactWaText: "السلام علیکم! مجھے ایسا دعوت نامہ بنوانا ہے۔",
  },
} as const;
