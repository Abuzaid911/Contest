'use client';

import { useState, useEffect } from 'react';
import { Book, ChevronRight, ChevronLeft, Loader2, MessageSquareQuote, Moon, Star } from 'lucide-react';

// Curated collection of Ramadan-specific hadiths
const RAMADAN_HADITHS = [
  {
    id: 1,
    collection: "Sahih Al-Bukhari",
    hadithNumber: 1904,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'Whoever fasts Ramadan out of faith and in the hope of reward, his previous sins will be forgiven.'"
  },
  {
    id: 2,
    collection: "Sahih Al-Bukhari",
    hadithNumber: 1899,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: إِذَا جَاءَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ، وَغُلِّقَتْ أَبْوَابُ النَّارِ، وَصُفِّدَتِ الشَّيَاطِينُ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'When Ramadan begins, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained.'"
  },
  {
    id: 3,
    collection: "Sahih Muslim",
    hadithNumber: 1151,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: كُلُّ عَمَلِ ابْنِ آدَمَ يُضَاعَفُ الْحَسَنَةُ عَشْرُ أَمْثَالِهَا إِلَى سَبْعِمِائَةِ ضِعْفٍ. قَالَ اللهُ عَزَّ وَجَلَّ: إِلاَّ الصِّيَامَ فَإِنَّهُ لِي وَأَنَا أَجْزِي بِهِ، يَدَعُ شَهْوَتَهُ وَطَعَامَهُ مِنْ أَجْلِي",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'Every deed of the son of Adam will be multiplied, a good deed receiving a tenfold to seven hundredfold reward. Allah the Most High said: Except for fasting, for it is for Me and I will reward it. He gives up his desires and his food for My sake.'"
  },
  {
    id: 4,
    collection: "Sahih Muslim",
    hadithNumber: 1165,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: لِلصَّائِمِ فَرْحَتَانِ يَفْرَحُهُمَا: إِذَا أَفْطَرَ فَرِحَ بِفِطْرِهِ، وَإِذَا لَقِيَ رَبَّهُ فَرِحَ بِصَوْمِهِ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'The fasting person has two moments of joy: when he breaks his fast he rejoices at his breaking of the fast, and when he meets his Lord he will rejoice at his fasting.'"
  },
  {
    id: 5,
    collection: "Sunan Ibn Majah",
    hadithNumber: 1638,
    narratedBy: "Abdullah ibn Amr",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: الصِّيَامُ وَالْقُرْآنُ يَشْفَعَانِ لِلْعَبْدِ يَوْمَ الْقِيَامَةِ. يَقُولُ الصِّيَامُ: أَيْ رَبِّ، مَنَعْتُهُ الطَّعَامَ وَالشَّهْوَةَ بِالنَّهَارِ فَشَفِّعْنِي فِيهِ. وَيَقُولُ الْقُرْآنُ: مَنَعْتُهُ النَّوْمَ بِاللَّيْلِ فَشَفِّعْنِي فِيهِ. قَالَ: فَيُشَفَّعَانِ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'Fasting and the Quran will intercede for the servant on the Day of Resurrection. Fasting will say: 'O Lord, I prevented him from food and desires during the day, so let me intercede for him.' And the Quran will say: 'I prevented him from sleeping at night, so let me intercede for him.' Then they will be allowed to intercede.'"
  },
  {
    id: 6,
    collection: "Jami at-Tirmidhi",
    hadithNumber: 807,
    narratedBy: "Abu Huraira",
    hadithArabic: "أَوَّلُ لَيْلَةٍ مِنْ شَهْرِ رَمَضَانَ تُصَفَّدُ الشَّيَاطِينُ وَمَرَدَةُ الْجِنِّ، وَغُلِّقَتْ أَبْوَابُ النَّارِ فَلَمْ يُفْتَحْ مِنْهَا بَابٌ، وَفُتِّحَتْ أَبْوَابُ الْجَنَّةِ فَلَمْ يُغْلَقْ مِنْهَا بَابٌ",
    hadithEnglish: "On the first night of the month of Ramadan, the devils and rebellious jinn are chained, the gates of Hell are closed and not one of them is opened. The gates of Paradise are opened and not one of them is closed."
  },
  {
    id: 7,
    collection: "Sahih Al-Bukhari",
    hadithNumber: 1901,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: مَنْ قَامَ لَيْلَةَ الْقَدْرِ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'Whoever stands (in prayer) during Laylat al-Qadr out of faith and in the hope of reward, his previous sins will be forgiven.'"
  },
  {
    id: 8,
    collection: "Sunan An-Nasa'i",
    hadithNumber: 2106,
    narratedBy: "Abu Huraira",
    hadithArabic: "مَنْ أَفْطَرَ يَوْمًا مِنْ رَمَضَانَ مِنْ غَيْرِ رُخْصَةٍ وَلاَ مَرَضٍ لَمْ يَقْضِهِ صِيَامُ الدَّهْرِ كُلِّهِ وَإِنْ صَامَهُ",
    hadithEnglish: "Whoever breaks his fast on one day of Ramadan without a concession or without being ill, then even if he fasts for a lifetime he cannot make up for it."
  },
  {
    id: 9,
    collection: "Sahih Muslim",
    hadithNumber: 2614,
    narratedBy: "Abu Huraira",
    hadithArabic: "مَنْ أَنْفَقَ زَوْجَيْنِ فِي سَبِيلِ اللهِ نُودِيَ مِنْ أَبْوَابِ الْجَنَّةِ: يَا عَبْدَ اللهِ هَذَا خَيْرٌ، فَمَنْ كَانَ مِنْ أَهْلِ الصَّلاَةِ دُعِيَ مِنْ بَابِ الصَّلاَةِ، وَمَنْ كَانَ مِنْ أَهْلِ الْجِهَادِ دُعِيَ مِنْ بَابِ الْجِهَادِ، وَمَنْ كَانَ مِنْ أَهْلِ الصِّيَامِ دُعِيَ مِنْ بَابِ الرَّيَّانِ، وَمَنْ كَانَ مِنْ أَهْلِ الصَّدَقَةِ دُعِيَ مِنْ بَابِ الصَّدَقَةِ",
    hadithEnglish: "Whoever spends a pair (of anything) in the way of Allah will be called from the gates of Paradise: 'O slave of Allah, this is good.' Whoever is among the people of prayer will be called from the gate of prayer. Whoever is among the people of jihad will be called from the gate of jihad. Whoever is among the people of fasting will be called from the gate of Ar-Rayyan. And whoever is among the people of charity will be called from the gate of charity."
  },
  {
    id: 10,
    collection: "Sunan Abu Dawud",
    hadithNumber: 2363,
    narratedBy: "Mu'adh ibn Jabal",
    hadithArabic: "الصِّيَامُ جُنَّةٌ وَالصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
    hadithEnglish: "Fasting is a shield, and charity extinguishes sin as water extinguishes fire."
  },
  {
    id: 11,
    collection: "Sahih Al-Bukhari",
    hadithNumber: 1903,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'Whoever fasts Ramadan and then follows it with six days of Shawwal, it will be as if he fasted the entire year.'"
  },
  {
    id: 12,
    collection: "Sahih Muslim",
    hadithNumber: 1156,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: إِذَا دَخَلَ شَهْرُ رَمَضَانَ فُتِّحَتْ أَبْوَابُ الرَّحْمَةِ، وَغُلِّقَتْ أَبْوَابُ جَهَنَّمَ، وَسُلْسِلَتِ الشَّيَاطِينُ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'When the month of Ramadan begins, the gates of mercy are opened, the gates of Hell are closed, and the devils are chained.'"
  },
  {
    id: 13,
    collection: "Sahih Muslim",
    hadithNumber: 1164,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: وَالَّذِي نَفْسُ مُحَمَّدٍ بِيَدِهِ لَخُلُوفُ فَمِ الصَّائِمِ أَطْيَبُ عِنْدَ اللهِ مِنْ رِيحِ الْمِسْكِ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'By the One in whose hand is the soul of Muhammad, the breath of the fasting person is sweeter to Allah than the fragrance of musk.'"
  },
  {
    id: 14,
    collection: "Sahih Al-Bukhari",
    hadithNumber: 1928,
    narratedBy: "Aisha",
    hadithArabic: "كَانَ النَّبِيُّ صلى الله عليه وسلم إِذَا دَخَلَ الْعَشْرُ أَحْيَا اللَّيْلَ وَأَيْقَظَ أَهْلَهُ وَشَدَّ الْمِئْزَرَ",
    hadithEnglish: "When the last ten nights (of Ramadan) would come, the Prophet (ﷺ) would spend the night in worship, wake his family, and tighten his waist belt (i.e., strive harder in worship)."
  },
  {
    id: 15,
    collection: "Jami at-Tirmidhi",
    hadithNumber: 682,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: الْتَمِسُوا لَيْلَةَ الْقَدْرِ فِي الْوِتْرِ مِنَ الْعَشْرِ الأَوَاخِرِ مِنْ رَمَضَانَ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'Seek Laylat al-Qadr in the odd-numbered nights of the last ten nights of Ramadan.'"
  },
  {
    id: 16,
    collection: "Sahih Al-Bukhari",
    hadithNumber: 1078,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'Whoever stands (in prayer) in Ramadan out of faith and in the hope of reward, his previous sins will be forgiven.'"
  },
  {
    id: 17,
    collection: "Sunan Abu Dawud",
    hadithNumber: 2452,
    narratedBy: "Salman Al-Farisi",
    hadithArabic: "خَطَبَنَا رَسُولُ اللهِ صلى الله عليه وسلم فِي آخِرِ يَوْمٍ مِنْ شَعْبَانَ فَقَالَ: أَظَلَّكُمْ شَهْرٌ عَظِيمٌ، شَهْرٌ مُبَارَكٌ، فِيهِ لَيْلَةٌ خَيْرٌ مِنْ أَلْفِ شَهْرٍ. جَعَلَ اللهُ صِيَامَهُ فَرِيضَةً وَقِيَامَ لَيْلِهِ تَطَوُّعًا",
    hadithEnglish: "The Messenger of Allah (ﷺ) addressed us on the last day of Sha'ban and said: 'A great month, a blessed month, has come over you, in which there is a night better than a thousand months. Allah has made fasting during it obligatory and standing in prayer during its nights voluntary.'"
  },
  {
    id: 18,
    collection: "Sahih Muslim",
    hadithNumber: 1147,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ رَسُولُ اللهِ صلى الله عليه وسلم: أَحَبُّ الصِّيَامِ إِلَى اللهِ صِيَامُ دَاوُدَ عَلَيْهِ السَّلاَمُ، كَانَ يَصُومُ يَوْمًا وَيُفْطِرُ يَوْمًا. وَأَحَبُّ الصَّلاَةِ إِلَى اللهِ صَلاَةُ دَاوُدَ عَلَيْهِ السَّلاَمُ، كَانَ يَنَامُ نِصْفَ اللَّيْلِ وَيَقُومُ ثُلُثَهُ وَيَنَامُ سُدُسَهُ",
    hadithEnglish: "The Messenger of Allah (ﷺ) said: 'The most beloved fasting to Allah is the fasting of David, peace be upon him. He used to fast one day and break his fast the next. And the most beloved prayer to Allah is the prayer of David, peace be upon him. He used to sleep half the night, stand in prayer for a third of it, and then sleep for a sixth of it.'"
  },
  {
    id: 19,
    collection: "Sahih Muslim",
    hadithNumber: 1081,
    narratedBy: "Ibn Abbas",
    hadithArabic: "كَانَ النَّبِيُّ صلى الله عليه وسلم أَجْوَدَ النَّاسِ بِالْخَيْرِ، وَكَانَ أَجْوَدُ مَا يَكُونُ فِي رَمَضَانَ",
    hadithEnglish: "The Prophet (ﷺ) was the most generous of people, and he was most generous during Ramadan."
  },
  {
    id: 20,
    collection: "Sunan Ibn Majah",
    hadithNumber: 1752,
    narratedBy: "Anas ibn Malik",
    hadithArabic: "سُئِلَ النَّبِيُّ صلى الله عليه وسلم: أَيُّ الصَّدَقَةِ أَفْضَلُ؟ قَالَ: صَدَقَةٌ فِي رَمَضَانَ",
    hadithEnglish: "The Prophet (ﷺ) was asked: 'Which charity is best?' He said: 'Charity given during Ramadan.'"
  },
  {
    id: 21,
    collection: "Sahih Muslim",
    hadithNumber: 1167,
    narratedBy: "Abu Huraira",
    hadithArabic: "قَالَ النَّبِيُّ صلى الله عليه وسلم: رُبَّ صَائِمٍ حَظُّهُ مِنْ صِيَامِهِ الْجُوعُ وَالْعَطَشُ",
    hadithEnglish: "The Prophet (ﷺ) said: 'Perhaps a fasting person will get nothing from his fast except hunger and thirst.'"
  }
];

export default function RamadanHadith() {
  const [hadithIndex, setHadithIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Get a hadith based on the day of the month
  useEffect(() => {
    const today = new Date();
    const dayOfMonth = today.getDate() - 1; // 0-indexed
    
    // Use the day of month as index if within range, otherwise random
    if (dayOfMonth < RAMADAN_HADITHS.length) {
      setHadithIndex(dayOfMonth);
    } else {
      setHadithIndex(Math.floor(Math.random() * RAMADAN_HADITHS.length));
    }
  }, []);

  const currentHadith = RAMADAN_HADITHS[hadithIndex];

  const nextHadith = () => {
    setHadithIndex((prevIndex) => 
      prevIndex === RAMADAN_HADITHS.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevHadith = () => {
    setHadithIndex((prevIndex) => 
      prevIndex === 0 ? RAMADAN_HADITHS.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden border-2 border-primary-gold transition-all duration-300 ${isExpanded ? 'mb-8' : ''}`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer bg-white bg-opacity-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Book className="h-5 w-5 text-primary-gold mr-2 bg-primary" />
          <h3 className="font-semibold text-primary-brown font-['Amiri'] text-lg">Ramadan Hadith of the Day</h3>
        </div>
        <div className="flex items-center">
          <button 
            className="text-primary-brown hover:text-primary-gold transition-colors"
            aria-label={isExpanded ? "Collapse hadith" : "Expand hadith"}
          >
            {isExpanded ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-0'
      }`}>
        <div className="p-4">
          <div className="flex items-start mb-3">
            <MessageSquareQuote className="h-5 w-5 text-primary-gold mr-2 mt-1 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-primary-brown font-semibold">
                {currentHadith.collection} #{currentHadith.hadithNumber}
              </span>
              <span className="text-sm text-primary-brown opacity-70">
                Narrated by: {currentHadith.narratedBy}
              </span>
            </div>
          </div>
          
          <div className="mb-4 bg-sand-light bg-opacity-50 p-3 rounded-md border border-primary-gold border-opacity-20">
            <p className="text-right mb-3 font-['Amiri'] text-lg leading-loose" dir="rtl">
              {currentHadith.hadithArabic}
            </p>
            <p className="mb-2 text-primary-brown leading-relaxed">
              {currentHadith.hadithEnglish}
            </p>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={prevHadith} 
              className="text-primary-brown hover:text-primary-gold transition-colors flex items-center"
              aria-label="Previous hadith"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            <div className="flex items-center text-primary-brown opacity-70">
              <Star className="h-3 w-3 text-primary-gold mr-1" />
              <span className="text-sm">
                {hadithIndex + 1} of {RAMADAN_HADITHS.length}
              </span>
              <Star className="h-3 w-3 text-primary-gold ml-1" />
            </div>
            <button 
              onClick={nextHadith} 
              className="text-primary-brown hover:text-primary-gold transition-colors flex items-center"
              aria-label="Next hadith"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}