from typing import List, Dict
from app.models.schemas import (
    UserSituation,
    RecommendedAction,
    Language
)

ACTION_POLICIES: Dict[UserSituation, Dict[Language, List[Dict]]] = {
    UserSituation.BEFORE_PAYMENT: {
        Language.EN: [
            {
                "priority": 1,
                "title": "Immediate Pause: Do Not Transfer Any Funds",
                "description": "Stop all transactions immediately. No legitimate investment opportunity disappears in hours. High-pressure deadlines are engineered to bypass critical thinking.",
                "category": "immediate_safety",
                "official_links": [{"name": "SEBI Investor Charter", "url": "https://investor.sebi.gov.in"}]
            },
            {
                "priority": 2,
                "title": "Independently Verify Advisor / Intermediary on SEBI Register",
                "description": "Never trust shared PDF certificates or registration screenshots. Search the official SEBI database directly by name or registration number. SEBI registered advisors never ask for payments to personal bank accounts.",
                "category": "verification",
                "official_links": [{"name": "SEBI Intermediary Verification Portal", "url": "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13"}]
            },
            {
                "priority": 3,
                "title": "Never Share OTPs, Passwords, or Install Remote Control Apps",
                "description": "Do not install AnyDesk, TeamViewer, or screen-sharing tools. No legitimate fund manager needs remote access to your device or your banking credentials.",
                "category": "immediate_safety",
                "official_links": [{"name": "RBI Kehta Hai - Secure Banking", "url": "https://rbikehtahai.rbi.org.in"}]
            },
            {
                "priority": 4,
                "title": "Consult a Neutral Third-Party or Trusted Family Member",
                "description": "Explain the transaction to a trusted person not involved in the group. If the counterparty demanded secrecy, treat that as a primary indicator of deceptive intent.",
                "category": "support",
                "official_links": []
            }
        ],
        Language.HI: [
            {
                "priority": 1,
                "title": "तुरंत रुकें: किसी भी खाते में पैसे ट्रांसफर न करें",
                "description": "लेनदेन तुरंत रोकें। कोई भी वैध निवेश कुछ ही घंटों में समाप्त नहीं होता। जल्दबाजी का दबाव आपको सोचने से रोकने की चाल है।",
                "category": "immediate_safety",
                "official_links": [{"name": "सेबी निवेशक चार्टर", "url": "https://investor.sebi.gov.in"}]
            },
            {
                "priority": 2,
                "title": "सेबी (SEBI) की आधिकारिक वेबसाइट पर पंजीकरण सत्यापित करें",
                "description": "व्हाट्सएप पर भेजे गए प्रमाण-पत्र या स्क्रीनशॉट पर भरोसा न करें। सेबी के आधिकारिक रजिस्टर पर खुद सर्च करें। पंजीकृत सलाहकार कभी व्यक्तिगत खातों में पैसे नहीं मांगते।",
                "category": "verification",
                "official_links": [{"name": "सेबी मध्यस्थ सत्यापन पोर्टल", "url": "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13"}]
            },
            {
                "priority": 3,
                "title": "ओटीपी (OTP), पासवर्ड न बताएं और AnyDesk इंस्टॉल न करें",
                "description": "कभी भी स्क्रीन-शेयरिंग ऐप डाउनलोड न करें। कोई भी बैंक या वित्तीय संस्थान आपके डिवाइस का रिमोट एक्सेस नहीं मांगता।",
                "category": "immediate_safety",
                "official_links": [{"name": "आरबीआई कहता है - सुरक्षित बैंकिंग", "url": "https://rbikehtahai.rbi.org.in"}]
            },
            {
                "priority": 4,
                "title": "परिवार के किसी विश्वस्त सदस्य से चर्चा करें",
                "description": "यदि सामने वाला व्यक्ति इसे गोपनीय रखने का दबाव बना रहा है, तो यह धोखाधड़ी का सबसे बड़ा संकेत है।",
                "category": "support",
                "official_links": []
            }
        ],
        Language.KN: [
            {
                "priority": 1,
                "title": "ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ: ಯಾವುದೇ ಖಾತೆಗೆ ಹಣ ವರ್ಗಾಯಿಸಬೇಡಿ",
                "description": "ವ್ಯವಹಾರವನ್ನು ಕೂಡಲೇ ಸ್ಥಗಿತಗೊಳಿಸಿ. ಯಾವುದೇ ನೈಜ ಹೂಡಿಕೆ ಅವಕಾಶವು ಗಂಟೆಗಳಲ್ಲಿ ಮುಗಿಯುವುದಿಲ್ಲ. ಆತುರದ ಒತ್ತಡವು ನಿಮ್ಮ ವಿವೇಚನೆಯನ್ನು ತಪ್ಪಿಸುವ ತಂತ್ರವಾಗಿದೆ.",
                "category": "immediate_safety",
                "official_links": [{"name": "ಸೆಬಿ ಹೂಡಿಕೆದಾರರ ಮಾರ್ಗದರ್ಶಿ", "url": "https://investor.sebi.gov.in"}]
            },
            {
                "priority": 2,
                "title": "ಸೆಬಿ (SEBI) ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಣಿಯನ್ನು ಪರಿಶೀಲಿಸಿ",
                "description": "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಕಳುಹಿಸಿದ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ನಂಬಬೇಡಿ. ಸೆಬಿ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಪರಿಶೀಲಿಸಿ. ಅಧಿಕೃತ ಸಲಹೆಗಾರರು ವೈಯಕ್ತಿಕ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ ಕೇಳುವುದಿಲ್ಲ.",
                "category": "verification",
                "official_links": [{"name": "ಸೆಬಿ ಪರಿಶೀಲನಾ ಪೋರ್ಟಲ್", "url": "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13"}]
            },
            {
                "priority": 3,
                "title": "ಒಟಿಪಿ (OTP), ಪಾಸ್‌ವರ್ಡ್ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ ಮತ್ತು AnyDesk ಸ್ಥಾಪಿಸಬೇಡಿ",
                "description": "ಯಾವುದೇ ಸ್ಕ್ರೀನ್ ಶೇರ್ ಅಪ್ಲಿಕೇಶನ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಡಿ. ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಗಳು ನಿಮ್ಮ ಮೊಬೈಲ್ ಪ್ರವೇಶ ಕೇಳುವುದಿಲ್ಲ.",
                "category": "immediate_safety",
                "official_links": [{"name": "ಆರ್‌ಬಿಐ ಜಾಗೃತಿ", "url": "https://rbikehtahai.rbi.org.in"}]
            },
            {
                "priority": 4,
                "title": "ಕುಟುಂಬದ ವಿಶ್ವಾಸಾರ್ಹ ವ್ಯಕ್ತಿಯೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ",
                "description": "ರಹಸ್ಯವಾಗಿಡಲು ಒತ್ತಾಯಿಸಿದರೆ ಅದು ವಂಚನೆಯ ನೇರ ಸಂಕೇತವಾಗಿದೆ.",
                "category": "support",
                "official_links": []
            }
        ]
    },
    UserSituation.UNDER_PRESSURE: {
        Language.EN: [
            {
                "priority": 1,
                "title": "Disengage Emotionally: Reject Coercive Threats",
                "description": "Neither SEBI, RBI, CBI, nor police initiate 'digital arrest' or demand funds via WhatsApp/Skype video calls. Cease communication immediately.",
                "category": "immediate_safety",
                "official_links": [{"name": "Cybercrime Portal Warning on Digital Arrest", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "Preserve All Digital Evidence Before Blocking",
                "description": "Take full-screen screenshots showing sender phone numbers, UPI handles, profile pictures, and chat logs. Export chat history if possible.",
                "category": "evidence_preservation",
                "official_links": []
            },
            {
                "priority": 3,
                "title": "Do Not Send 'Verification' or 'Penalty' Money",
                "description": "Never send additional funds under the promise that doing so will clear your name or unfreeze your account.",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "Dial 1930 or Visit Your Nearest Police Cyber Cell",
                "description": "Report severe extortion or impersonation threats directly to the National Cybercrime Helpline.",
                "category": "reporting",
                "official_links": [{"name": "National Cyber Crime Reporting Portal", "url": "https://cybercrime.gov.in"}]
            }
        ],
        Language.HI: [
            {
                "priority": 1,
                "title": "धमकियों से न डरें: संवाद तुरंत बंद करें",
                "description": "कोई भी सरकारी एजेंसी (CBI, पुलिस, SEBI) 'डिजिटल अरेस्ट' नहीं करती और न ही व्हाट्सएप पर पैसे मांगती है। बात करना तुरंत बंद करें।",
                "category": "immediate_safety",
                "official_links": [{"name": "साइबर क्राइम पोर्टल अलर्ट", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "ब्लॉक करने से पहले सभी सबूत सुरक्षित करें",
                "description": "फोन नंबर, यूपीआई आईडी, बैंक विवरण और संदेशों के पूरे स्क्रीनशॉट लें।",
                "category": "evidence_preservation",
                "official_links": []
            },
            {
                "priority": 3,
                "title": "खाता अनब्लॉक करने के नाम पर और पैसे न भेजें",
                "description": "अतिरिक्त पैसे भेजने से पुराना पैसा वापस नहीं आएगा, बल्कि नया नुकसान होगा।",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "1930 हेल्पलाइन पर कॉल करें या पुलिस स्टेशन जाएं",
                "description": "धमकी या जबरन वसूली की शिकायत राष्ट्रीय साइबर हेल्पलाइन 1930 पर दर्ज कराएं।",
                "category": "reporting",
                "official_links": [{"name": "राष्ट्रीय साइबर अपराध पोर्टल", "url": "https://cybercrime.gov.in"}]
            }
        ],
        Language.KN: [
            {
                "priority": 1,
                "title": "ಬೆದರಿಕೆಗೆ ಹೆದರಬೇಡಿ: ಸಂಭಾಷಣೆಯನ್ನು ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ",
                "description": "ಸಿಬಿಐ, ಪೊಲೀಸ್ ಅಥವಾ ಸೆಬಿ ಎಂದಿಗೂ ವಾಟ್ಸಾಪ್ ಕರೆ ಮೂಲಕ 'ಡಿಜಿಟಲ್ ಬಂಧನ' ಮಾಡುವುದಿಲ್ಲ ಅಥವಾ ಹಣ ಕೇಳುವುದಿಲ್ಲ. ಕರೆಗಳನ್ನು ಕಡಿತಗೊಳಿಸಿ.",
                "category": "immediate_safety",
                "official_links": [{"name": "ಸೈಬರ್ ಕ್ರೈಮ್ ಎಚ್ಚರಿಕೆ", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "ಬ್ಲಾಕ್ ಮಾಡುವ ಮೊದಲು ಎಲ್ಲಾ ಪುರಾವೆಗಳನ್ನು ಉಳಿಸಿ",
                "description": "ಕಳುಹಿಸಿದವರ ಫೋನ್ ಸಂಖ್ಯೆ, ಯುಪಿಐ ಐಡಿ ಮತ್ತು ಸಂದೇಶಗಳ ಪೂರ್ಣ ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
                "category": "evidence_preservation",
                "official_links": []
            },
            {
                "priority": 3,
                "title": "ದಂಡ ಅಥವಾ ಖಾತೆ ತೆರವು ಹೆಸರಿನಲ್ಲಿ ಮತ್ತೆ ಹಣ ನೀಡಬೇಡಿ",
                "description": "ಹೆಚ್ಚುವರಿ ಹಣ ನೀಡುವುದರಿಂದ ಹಳೆಯ ಹಣ ವಾಪಸ್ ಬರುವುದಿಲ್ಲ.",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "1930 ಸೈಬರ್ ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ",
                "description": "ಬೆದರಿಕೆಗಳ ಬಗ್ಗೆ ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಮ್ ಪೋರ್ಟಲ್ 1930 ಗೆ ದೂರು ನೀಡಿ.",
                "category": "reporting",
                "official_links": [{"name": "ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಮ್ ಪೋರ್ಟಲ್", "url": "https://cybercrime.gov.in"}]
            }
        ]
    },
    UserSituation.PAYMENT_ALREADY_SENT: {
        Language.EN: [
            {
                "priority": 1,
                "title": "Call 1930 Immediately (Golden Hour Window)",
                "description": "Dial 1930 or visit cybercrime.gov.in right away. Reporting within 2-4 hours gives the Indian financial nodal officers the highest probability of freezing the beneficiary account before cash withdrawal.",
                "category": "reporting",
                "official_links": [{"name": "National Cyber Crime Reporting Portal", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "Contact Your Remitting Bank to Dispute Transaction",
                "description": "Inform your bank's fraud desk to flag the UTR/transaction reference as fraudulent and request a recall or interbank lien on the recipient bank.",
                "category": "immediate_safety",
                "official_links": [{"name": "RBI Guidelines on Customer Liability (2017)", "url": "https://cms.rbi.org.in"}]
            },
            {
                "priority": 3,
                "title": "Beware of Secondary 'Fund Recovery' Scammers",
                "description": "Never pay third parties or alleged ethical hackers who claim they can retrieve your lost money for an advance fee. These are predatory secondary scams.",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "Assemble Formal Evidence Dossier",
                "description": "Collect: Bank account statement showing debit, UTR numbers, chat logs, UPI IDs, website URLs, and fraudulent deposit slips. File with cyber cell.",
                "category": "evidence_preservation",
                "official_links": [{"name": "SEBI SCORES Redressal", "url": "https://scores.sebi.gov.in"}]
            }
        ],
        Language.HI: [
            {
                "priority": 1,
                "title": "तुरंत 1930 पर कॉल करें (गोल्डन ऑवर)",
                "description": "पहले 2 से 4 घंटों में 1930 पर कॉल करने से साइबर सेल लाभार्थी के खाते में पैसे फ्रीज करा सकता है।",
                "category": "reporting",
                "official_links": [{"name": "राष्ट्रीय साइबर अपराध पोर्टल", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "अपने बैंक से तुरंत संपर्क कर लेन-देन ब्लॉक कराएं",
                "description": "अपने बैंक के फ्रॉड प्रभाग को यूटीआर (UTR) नंबर दें और तत्काल चार्ज-बैक या लियन (Lien) का अनुरोध करें।",
                "category": "immediate_safety",
                "official_links": [{"name": "आरबीआई शिकायत प्रणाली (CMS)", "url": "https://cms.rbi.org.in"}]
            },
            {
                "priority": 3,
                "title": "'पैसा वापस दिलाने' वाले फर्जी एजेंटों से सावधान रहें",
                "description": "इंटरनेट पर खुद को एथिकल हैकर या रिकवरी एजेंट बताने वालों को कोई अग्रिम शुल्क न दें। यह दूसरा फ्रॉड है।",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "सभी साक्ष्य (UTR, चैट, बैंक स्टेटमेंट) सुरक्षित करें",
                "description": "साइबर पुलिस में औपचारिक प्राथमिकी (FIR) दर्ज कराने के लिए सभी दस्तावेज तैयार रखें।",
                "category": "evidence_preservation",
                "official_links": [{"name": "सेबी स्कोर्स (SCORES)", "url": "https://scores.sebi.gov.in"}]
            }
        ],
        Language.KN: [
            {
                "priority": 1,
                "title": "ತಕ್ಷಣ 1930 ಗೆ ಕರೆ ಮಾಡಿ (ಗೋಲ್ಡನ್ ಅವರ್)",
                "description": "ಹಣ ವರ್ಗಾವಣೆ ಮಾಡಿದ ಮೊದಲ 2-4 ಗಂಟೆಗಳಲ್ಲಿ 1930 ಗೆ ಕರೆ ಮಾಡಿದರೆ ವಂಚಕರ ಖಾತೆಯನ್ನು ಫ್ರೀಜ್ ಮಾಡುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚು.",
                "category": "reporting",
                "official_links": [{"name": "ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಮ್ ಪೋರ್ಟಲ್", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಸಂಪರ್ಕಿಸಿ ವಹಿವಾಟು ರದ್ದುಗೊಳಿಸಲು ಕೋರಿ",
                "description": "ಬ್ಯಾಂಕ್‌ನ ವಂಚನೆ ವಿಭಾಗಕ್ಕೆ UTR ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸಿ ಮತ್ತು ಹಣ ವಾಪಸಾತಿಗೆ ಕೋರಿಕೆ ಸಲ್ಲಿಸಿ.",
                "category": "immediate_safety",
                "official_links": [{"name": "ಆರ್‌ಬಿಐ ಒಂಬುಡ್ಸ್‌ಮನ್", "url": "https://cms.rbi.org.in"}]
            },
            {
                "priority": 3,
                "title": "'ಹಣ ಮರಳಿ ಕೊಡಿಸುವ' ನಕಲಿ ಏಜೆಂಟ್‌ಗಳಿಂದ ದೂರವಿರಿ",
                "description": "ಕಳೆದುಹೋದ ಹಣವನ್ನು ಮರಳಿ ಕೊಡಿಸುತ್ತೇವೆ ಎಂದು ಮುಂಗಡ ಶುಲ್ಕ ಕೇಳುವ ಹ್ಯಾಕರ್‌ಗಳನ್ನು ಎಂದಿಗೂ ನಂಬಬೇಡಿ.",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "ಎಲ್ಲಾ ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್ ಮತ್ತು ಚಾಟ್‌ಗಳನ್ನು ಸಂರಕ್ಷಿಸಿ",
                "description": "ಸೈಬರ್ ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಅಧಿಕೃತ ದೂರು ನೀಡಲು ಪುರಾವೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",
                "category": "evidence_preservation",
                "official_links": [{"name": "ಸೆಬಿ ಸ್ಕೋರ್ಸ್ ಪೋರ್ಟಲ್", "url": "https://scores.sebi.gov.in"}]
            }
        ]
    },
    UserSituation.CREDENTIALS_DISCLOSED: {
        Language.EN: [
            {
                "priority": 1,
                "title": "Immediately Freeze or Block Net Banking & Cards",
                "description": "Call your bank's emergency hotline to lock your net-banking access, block debit/credit cards, and reset your UPI PIN.",
                "category": "immediate_safety",
                "official_links": [{"name": "RBI Consumer Awareness", "url": "https://rbikehtahai.rbi.org.in"}]
            },
            {
                "priority": 2,
                "title": "Uninstall Screen-Sharing Tools & Disconnect Internet",
                "description": "If AnyDesk or TeamViewer was downloaded, immediately disconnect Wi-Fi/mobile data and uninstall the app to sever attacker control.",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 3,
                "title": "Change Passwords on Alternate Secure Device",
                "description": "Change passwords for email, Demat, and banking portals using a separate clean device. Enable Multi-Factor Authentication (MFA).",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "Check Demat Holding Statement (CAS)",
                "description": "Login directly to NSDL/CDSL to ensure no unauthorized power-of-attorney or share transfer request was registered.",
                "category": "verification",
                "official_links": [{"name": "NSDL Investor Services", "url": "https://nsdl.co.in"}, {"name": "CDSL Grievance", "url": "https://www.cdslindia.com"}]
            }
        ],
        Language.HI: [
            {
                "priority": 1,
                "title": "नेट बैंकिंग और कार्ड तुरंत ब्लॉक कराएं",
                "description": "अपने बैंक को तुरंत कॉल करके नेट बैंकिंग लॉक कराएं, डेबिट/क्रेडिट कार्ड ब्लॉक करें और यूपीआई पिन बदलें।",
                "category": "immediate_safety",
                "official_links": [{"name": "आरबीआई उपभोक्ता जागरूकता", "url": "https://rbikehtahai.rbi.org.in"}]
            },
            {
                "priority": 2,
                "title": "रिमोट ऐप (AnyDesk आदि) तुरंत अनइंस्टॉल करें",
                "description": "इंटरनेट बंद करें और फोन से स्क्रीन-शेयरिंग ऐप हटा दें ताकि अटैकर फोन नियंत्रित न कर सके।",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 3,
                "title": "दूसरे सुरक्षित फोन से पासवर्ड बदलें",
                "description": "ईमेल और वित्तीय खातों के पासवर्ड तुरंत बदलें और टू-फैक्टर ऑथेंटिकेशन (2FA) ऑन करें।",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "डीमैट खाता और सीएएस (CAS) चेक करें",
                "description": "NSDL या CDSL पोर्टल पर जाकर जांचें कि आपके शेयरों के साथ कोई अनधिकृत लेन-देन तो नहीं हुआ।",
                "category": "verification",
                "official_links": [{"name": "एनएसडीएल पोर्टल", "url": "https://nsdl.co.in"}]
            }
        ],
        Language.KN: [
            {
                "priority": 1,
                "title": "ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಕಾರ್ಡ್‌ಗಳನ್ನು ತಕ್ಷಣ ಬ್ಲಾಕ್ ಮಾಡಿ",
                "description": "ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ತುರ್ತು ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಲಾಕ್ ಮಾಡಿ ಮತ್ತು ಯುಪಿಐ ಪಿನ್ ಬದಲಾಯಿಸಿ.",
                "category": "immediate_safety",
                "official_links": [{"name": "ಆರ್‌ಬಿಐ ಜಾಗೃತಿ", "url": "https://rbikehtahai.rbi.org.in"}]
            },
            {
                "priority": 2,
                "title": "AnyDesk ಅಥವಾ TeamViewer ತಕ್ಷಣ ಅನ್‌ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
                "description": "ಮೊಬೈಲ್ ಇಂಟರ್ನೆಟ್ ಆಫ್ ಮಾಡಿ ಮತ್ತು ರಿಮೋಟ್ ಆಕ್ಸೆಸ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 3,
                "title": "ಬೇರೆ ಸಾಧನದಿಂದ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ",
                "description": "ಇಮೇಲ್ ಮತ್ತು ಡಿಮ್ಯಾಟ್ ಖಾತೆಗಳ ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ.",
                "category": "immediate_safety",
                "official_links": []
            },
            {
                "priority": 4,
                "title": "NSDL / CDSL ನಲ್ಲಿ ಡಿಮ್ಯಾಟ್ ಪರಿಶೀಲಿಸಿ",
                "description": "ನಿಮ್ಮ ಷೇರು ಖಾತೆಯಲ್ಲಿ ಯಾವುದೇ ಅನಧಿಕೃತ ವಹಿವಾಟು ನಡೆದಿಲ್ಲ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
                "category": "verification",
                "official_links": [{"name": "ಎನ್‌ಎಸ್‌ಡಿಎಲ್ ಪೋರ್ಟಲ್", "url": "https://nsdl.co.in"}]
            }
        ]
    },
    UserSituation.SUSPECTED_RECOVERY_SCAM: {
        Language.EN: [
            {
                "priority": 1,
                "title": "Absolute Rule: Zero Advance Payments for 'Recovery'",
                "description": "No private agency or online hacker can legally reverse bank transfers or freeze criminal accounts. Only law enforcement authorities (via 1930) have legal authority to freeze accounts.",
                "category": "immediate_safety",
                "official_links": [{"name": "Cybercrime Advisory on Recovery Scams", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "File Only Through Official Government Channels",
                "description": "Ensure your case is registered on cybercrime.gov.in. Real recovery occurs through court-ordered restitution or bank dispute protocols, never via private Bitcoin transfers or gift cards.",
                "category": "reporting",
                "official_links": [{"name": "National Cyber Crime Reporting Portal", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 3,
                "title": "Report the Recovery Impersonator",
                "description": "Provide the phone number and website of the supposed recovery agent to the police cyber cell as an accomplice or secondary syndicate.",
                "category": "evidence_preservation",
                "official_links": []
            }
        ],
        Language.HI: [
            {
                "priority": 1,
                "title": "रिकवरी के नाम पर एक रुपया भी न दें",
                "description": "कोई भी प्राइवेट व्यक्ति या हैकर बैंक से पैसे वापस नहीं दिला सकता। केवल पुलिस और बैंक ही 1930 के जरिए कानूनी कार्रवाई कर सकते हैं।",
                "category": "immediate_safety",
                "official_links": [{"name": "राष्ट्रीय साइबर पोर्टल", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "केवल आधिकारिक सरकारी पोर्टल पर शिकायत करें",
                "description": "अपनी शिकायत cybercrime.gov.in पर ही दर्ज रखें। असली प्रक्रिया केवल कोर्ट और बैंक के माध्यम से होती है।",
                "category": "reporting",
                "official_links": [{"name": "साइबर क्राइम पोर्टल", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 3,
                "title": "रिकवरी एजेंट के खिलाफ भी शिकायत जोड़ें",
                "description": "पैसा वापस दिलाने का झांसा देने वाले का नंबर भी पुलिस को दें।",
                "category": "evidence_preservation",
                "official_links": []
            }
        ],
        Language.KN: [
            {
                "priority": 1,
                "title": "ಹಣ ಮರಳಿ ಕೊಡಿಸುವ ಹೆಸರಿನಲ್ಲಿ ಮುಂಗಡ ಹಣ ನೀಡಬೇಡಿ",
                "description": "ಯಾವುದೇ ಖಾಸಗಿ ವ್ಯಕ್ತಿ ಅಥವಾ ಹ್ಯಾಕರ್‌ಗೆ ಬ್ಯಾಂಕ್ ಖಾತೆ ಸೀಜ್ ಮಾಡುವ ಅಧಿಕಾರವಿಲ್ಲ. ಕೇವಲ ಪೊಲೀಸರು ಮತ್ತು ಬ್ಯಾಂಕ್ ಮಾತ್ರ ಕಾನೂನುಬದ್ಧವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸಬಹುದು.",
                "category": "immediate_safety",
                "official_links": [{"name": "ಸೈಬರ್ ಕ್ರೈಮ್ ಪೋರ್ಟಲ್", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 2,
                "title": "ಕೇವಲ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಮೂಲಕವೇ ದೂರು ದಾಖಲಿಸಿ",
                "description": "ನಿಮ್ಮ ದೂರು cybercrime.gov.in ನಲ್ಲಿ ಮಾತ್ರ ದಾಖಲಿಸಿ.",
                "category": "reporting",
                "official_links": [{"name": "ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಮ್", "url": "https://cybercrime.gov.in"}]
            },
            {
                "priority": 3,
                "title": "ನಕಲಿ ರಿಕವರಿ ಏಜೆಂಟ್ ವಿವರಗಳನ್ನು ಪೊಲೀಸರಿಗೆ ನೀಡಿ",
                "description": "ಅವರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ವೆಬ್‌ಸೈಟ್ ವಿವರಗಳನ್ನು ಸೈಬರ್ ಸೆಲ್‌ಗೆ ನೀಡಿ.",
                "category": "evidence_preservation",
                "official_links": []
            }
        ]
    },
    UserSituation.INSUFFICIENT_INFORMATION: {
        Language.EN: [
            {
                "priority": 1,
                "title": "Exercise Caution Before Proceeding",
                "description": "The provided snippet did not contain enough conclusive context to verify safety. Never commit funds without independently verifying SEBI credentials.",
                "category": "immediate_safety",
                "official_links": [{"name": "SEBI Intermediaries Verification", "url": "https://www.sebi.gov.in"}]
            },
            {
                "priority": 2,
                "title": "Submit More Context or Screenshot",
                "description": "Upload full conversation screenshots or paste the complete pitch message for a thorough risk indicator analysis.",
                "category": "verification",
                "official_links": []
            }
        ],
        Language.HI: [
            {
                "priority": 1,
                "title": "आगे बढ़ने से पहले सावधानी बरतें",
                "description": "दिए गए विवरण में स्पष्ट निष्कर्ष के लिए पर्याप्त जानकारी नहीं है। सेबी सत्यापन के बिना पैसे न भेजें।",
                "category": "immediate_safety",
                "official_links": [{"name": "सेबी आधिकारिक पोर्टल", "url": "https://www.sebi.gov.in"}]
            },
            {
                "priority": 2,
                "title": "अधिक जानकारी या स्क्रीनशॉट सबमिट करें",
                "description": "पूरी बातचीत का स्क्रीनशॉट अपलोड करें ताकि सही विश्लेषण किया जा सके।",
                "category": "verification",
                "official_links": []
            }
        ],
        Language.KN: [
            {
                "priority": 1,
                "title": "ಮುಂದುವರಿಯುವ ಮುನ್ನ ಎಚ್ಚರ ವಹಿಸಿ",
                "description": "ಒದಗಿಸಿದ ಮಾಹಿತಿಯು ಸಂಪೂರ್ಣವಾಗಿಲ್ಲ. ಸೆಬಿ ಪರಿಶೀಲನೆ ಇಲ್ಲದೆ ಯಾವುದೇ ಹಣ ಹೂಡಿಕೆ ಮಾಡಬೇಡಿ.",
                "category": "immediate_safety",
                "official_links": [{"name": "ಸೆಬಿ ಪೋರ್ಟಲ್", "url": "https://www.sebi.gov.in"}]
            },
            {
                "priority": 2,
                "title": "ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಅಥವಾ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ನೀಡಿ",
                "description": "ಸಂಪೂರ್ಣ ಸಂದೇಶ ಅಥವಾ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಮೂಲಕ ನಿಖರ ವಿಶ್ಲೇಷಣೆ ಪಡೆಯಿರಿ.",
                "category": "verification",
                "official_links": []
            }
        ]
    }
}

def resolve_recommended_actions(
    situation: UserSituation,
    language: Language = Language.EN
) -> List[RecommendedAction]:
    """
    Returns deterministic, un-overridable safety actions for the active situation and language.
    Guarantees consistent safety advice immune to prompt injections.
    """
    target_situation = situation if situation in ACTION_POLICIES else UserSituation.BEFORE_PAYMENT
    target_language = language if language in ACTION_POLICIES[target_situation] else Language.EN

    action_defs = ACTION_POLICIES[target_situation][target_language]
    actions = []

    for item in action_defs:
        actions.append(
            RecommendedAction(
                priority=item["priority"],
                title=item["title"],
                description=item["description"],
                category=item["category"],
                action_state=target_situation.value,
                official_links=item.get("official_links")
            )
        )

    return actions
