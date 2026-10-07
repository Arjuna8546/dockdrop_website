// TODO: native Malayalam review before launch
// (The Malayalam SR descriptions, stage names and aria labels are first-pass translations: review them.)

/**
 * @typedef {Object} CopyEntry
 * @property {string} ml
 * @property {string} en
 */

/** All user-facing strings, `{ ml, en }`. Read with `t(key)` from useLanguage. */
/** @type {Object<string, CopyEntry>} */
export const COPY = {
  // ---------- meta (15.3) ----------
  'meta.title': {
    ml: 'DockDrop · കേരളത്തിലെ വിതരണക്കാർക്കുള്ള വാൻ സെയിൽസ് ആപ്പ്, മലയാളത്തിൽ',
    en: 'DockDrop · Van sales app for Kerala distributors, in Malayalam',
  },
  'meta.description': {
    ml: 'കേരളത്തിലെ വിതരണക്കാർക്കുള്ള വാൻ സെയിൽസ് ആപ്പ്, മലയാളത്തിൽ. ബില്ലിംഗ്, സ്റ്റോക്ക്, കട ബാക്കി, ഡേ-എൻഡ് എല്ലാം ഒരൊറ്റ ആപ്പിൽ.',
    en: 'Van sales app for Kerala distributors, in Malayalam. Billing, stock, shop dues and day-end, all in one app.',
  },

  // ---------- 14.1 UI ----------
  scrollHint: { ml: 'താഴേക്ക് സ്ക്രോൾ ചെയ്യൂ', en: 'Scroll' },
  swipeHint: { ml: 'മുകളിലേക്ക് സ്വൈപ്പ് ചെയ്യൂ', en: 'Swipe up' },
  skipToContent: { ml: 'പ്രധാന ഉള്ളടക്കത്തിലേക്ക് പോകുക', en: 'Skip to main content' },
  skip: { ml: 'കഥ ഒഴിവാക്കുക', en: 'Skip the story' },
  whatsapp: { ml: 'WhatsApp', en: 'WhatsApp' },
  freeTrial: { ml: 'സൗജന്യമായി പരീക്ഷിക്കാം', en: 'Start free trial' },
  rewindBtn: { ml: 'ഇതേ ദിവസം DockDrop-ൽ കാണാം', en: 'See the same day with DockDrop' },

  // ---------- aria labels / a11y ----------
  'aria.langToggle': { ml: 'ഭാഷ: മലയാളം / ഇംഗ്ലീഷ്', en: 'Language: Malayalam / English' },
  'aria.langMl': { ml: 'മലയാളം', en: 'Malayalam' },
  'aria.langEn': { ml: 'ഇംഗ്ലീഷ്', en: 'English' },
  'aria.dots': { ml: 'കഥയുടെ ഭാഗങ്ങൾ', en: 'Story sections' },
  'aria.goTo': { ml: 'ഈ ഭാഗത്തേക്ക് പോകുക:', en: 'Go to:' },
  'aria.home': { ml: 'DockDrop, തുടക്കത്തിലേക്ക്', en: 'DockDrop, back to the start' },
  'aria.whatsapp': { ml: 'WhatsApp-ൽ സംസാരിക്കുക', en: 'Chat on WhatsApp' },
  'aria.story': { ml: 'ഒരു വിതരണക്കാരന്റെ ഒരു ദിവസം', en: "A distributor's day" },
  'aria.slide': { ml: 'ഭാഗം', en: 'slide' },
  'aria.footer': { ml: 'ഫൂട്ടർ ലിങ്കുകൾ', en: 'Footer links' },

  // ---------- stage names (live region, aria-label) ----------
  'stage.a1.name': { ml: 'ബിൽ ബുക്ക്', en: 'The bill book' },
  'stage.a2.name': { ml: 'ലോഡിങ്, പേപ്പർ രീതി', en: 'Loading, the paper way' },
  'stage.a3.name': { ml: 'റൂട്ട്, പേപ്പർ രീതി', en: 'Route, the paper way' },
  'stage.a4.name': { ml: 'രാത്രിയിലെ കണക്ക്, പേപ്പർ രീതി', en: 'Night settlement, the paper way' },
  'stage.t.name': { ml: 'എല്ലാ ദിവസവും', en: 'Every day' },
  'stage.b1.name': { ml: 'ഫോണിൽ DockDrop', en: 'DockDrop on the phone' },
  'stage.b2.name': { ml: 'ലോഡിങ്, DockDrop രീതി', en: 'Loading, the DockDrop way' },
  'stage.b3.name': { ml: 'റൂട്ട്, DockDrop രീതി', en: 'Route, the DockDrop way' },
  'stage.b4.name': { ml: 'ഡേ-എൻഡ്, DockDrop രീതി', en: 'Settlement, the DockDrop way' },

  // ---------- 14.2 stage captions ----------
  'stage.a1.time': { ml: '10:30 PM', en: '10:30 PM' },
  'stage.a1.caption': { ml: 'ഇത് നിങ്ങളുടെ ബിൽ ബുക്ക് അല്ലേ?', en: "Isn't this your bill book?" },
  'stage.a1.subline': {
    ml: 'കൈകൊണ്ട് എഴുതിയ ബില്ലുകൾ, നോട്ടുബുക്കിലെ കടം, രാത്രി മുഴുവൻ ബിൽ കോപ്പി ചോദിച്ചുള്ള മെസേജുകൾ.',
    en: 'Bills written by hand, dues in a notebook, and messages asking for bill copies all night.',
  },
  'stage.a2.time': { ml: '6:30 AM · ലോഡിങ്', en: '6:30 AM · Loading' },
  'stage.a2.caption': { ml: 'ഇന്നലത്തെ ബില്ല് നോക്കി ഇന്നത്തെ ലോഡ്.', en: "Today's load, by looking at yesterday's bill." },
  'stage.a2.subline': {
    ml: 'സ്റ്റോക്ക് ലിസ്റ്റ് ഇല്ല. പഴയ ബില്ല് നോക്കി ഊഹിച്ചുള്ള ലോഡ്, ഒരു പെട്ടി കയറാതെ പോകുന്നു.',
    en: 'No stock list. The load is a guess from old bills, and one box gets left behind.',
  },
  'stage.a3.time': { ml: '8:00 AM → 6:00 PM · റൂട്ട്', en: '8:00 AM → 6:00 PM · Route' },
  'stage.a3.caption': { ml: 'ഓരോ കടയിലും ഇതേ കഥ.', en: 'The same story at every shop.' },
  'stage.a3.subline': {
    ml: 'ഓരോ കടയിലും: വാനിൽ സാധനം തിരയുക, ബില്ലെഴുതുക, കോപ്പി കീറിക്കൊടുക്കുക, കടം കുറിക്കുക. വീണ്ടും വീണ്ടും.',
    en: 'At every stop: search the van, write the bill, tear off the copy, note the credit. Again and again.',
  },
  'stage.a4.time': { ml: '11:40 PM', en: '11:40 PM' },
  'stage.a4.caption': { ml: 'ആര് എത്ര തരാനുണ്ട്?', en: 'Who owes how much?' },
  'stage.a4.subline': {
    ml: 'രാത്രി വൈകിയും ബിൽ ബുക്ക് വീണ്ടും കൂട്ടുന്നു. പണം ഒത്തുവരുന്നില്ല, കാരണം ആർക്കും അറിയില്ല.',
    en: "Late at night, adding up the bill book again. The cash doesn't match, and nobody knows why.",
  },
  'stage.t.caption': { ml: 'എല്ലാ ദിവസവും.', en: 'Every day.' },
  'stage.t.subline': {
    ml: 'ബിൽ ബുക്ക്, കാൽക്കുലേറ്റർ, ഫോൺ വിളികൾ, ഒത്തുവരാത്ത പണം. എല്ലാ രാത്രിയും ഇതുതന്നെ.',
    en: "Bill book, calculator, phone calls, cash that doesn't match. The same, every night.",
  },
  'stage.b1.time': { ml: '6:30 AM', en: '6:30 AM' },
  'stage.b1.caption': {
    ml: 'ഓരോ വാനും ഓരോ കടയും ഓരോ രൂപയും, ഒരൊറ്റ ആപ്പിൽ.',
    en: 'One desk for every van, every shop, every rupee.',
  },
  'stage.b1.subline': {
    ml: 'രാവിലെ ആപ്പ് തുറന്നാൽ: ഇന്നത്തെ വാൻ, ഇന്നലത്തെ കളക്ഷൻ, കടം ഉള്ള എല്ലാ കടകളും.',
    en: "Open the app in the morning: today's van, yesterday's collection and every shop with dues.",
  },
  'stage.b2.time': { ml: '6:30 AM · ലോഡിങ്', en: '6:30 AM · Loading' },
  'stage.b2.caption': { ml: 'കയറ്റുമ്പോൾ തന്നെ കണക്ക്.', en: 'The count is right while loading.' },
  'stage.b2.subline': {
    ml: 'ചെക്ക്‌ലിസ്റ്റ് നോക്കി ലോഡ്: ഓരോ സാധനവും ടിക്ക്, ഒന്നും വിട്ടുപോകില്ല, ഡെലിവറി ചലാൻ റെഡി.',
    en: 'Load from a checklist: every item ticks off, nothing is left behind, and the delivery challan is ready.',
  },
  'stage.b3.time': { ml: 'ഇന്ന് · റൂട്ട്', en: 'Today · Route' },
  'stage.b3.caption': {
    ml: 'ഓരോ കടയുടെയും കടം, ഓർഡർ, രസീത്, റിട്ടേൺ. ഒന്നും വിട്ടുപോകില്ല.',
    en: "Every shop's credit, orders, receipts and returns. Nothing gets missed.",
  },
  'stage.b3.subline': {
    ml: 'ഓരോ ഓർഡറും രസീതും റിട്ടേണും പേയ്മെന്റും കടയുടെ കണക്കിൽ, നെറ്റ്‌വർക്ക് ഇല്ലെങ്കിലും.',
    en: "Every order, receipt, return and payment goes into the shop's ledger, even without network.",
  },
  'stage.b4.time': { ml: '7:05 PM', en: '7:05 PM' },
  'stage.b4.caption': { ml: 'ഡേ-എൻഡ് 2 മിനിറ്റിൽ.', en: 'Day-end in 2 minutes.' },
  'stage.b4.subline': {
    ml: 'പ്രതീക്ഷിച്ച പണം, ഓരോ കടയുടെയും ബാക്കി, ദിവസത്തെ ലാഭം, എല്ലാം ആപ്പിൽ. നോക്കി, ക്ലോസ് ചെയ്ത്, വീട്ടിലേക്ക്.',
    en: "The app shows the expected cash, every shop's dues and the day's profit. Check, close, go home.",
  },

  // ---------- SR descriptions (section 12) ----------
  'stage.a1.sr': {
    ml: 'രാത്രി ഓഫീസ് മേശയിൽ തുറന്നുവെച്ച ഒരു പേപ്പർ ബിൽ ബുക്ക്. കൈകൊണ്ട് എഴുതിയ ബില്ലുകൾ, ചുവന്ന വട്ടമിട്ട ബാക്കി തുക, മൈനസ് 2,850 കാണിക്കുന്ന കാൽക്കുലേറ്റർ, മെസേജുകൾ വരുന്ന ഒരു ഫോൺ.',
    en: 'A paper bill book open on an office table at night, with handwritten bills, a red circled balance, a calculator showing minus 2,850, and a phone receiving messages.',
  },
  'stage.a2.sr': {
    ml: 'ഗോഡൗണിൽ, ഉടമ പഴയ ബില്ലുകൾ നോക്കി ലോഡ് തീരുമാനിക്കുന്നു, ഡ്രൈവർ പെട്ടികൾ വാനിലേക്ക് കയറ്റുന്നു. ഒരു പെട്ടി ചാക്കുകൾക്ക് പിന്നിലേക്ക് വഴുതി വീഴുന്നു, ആരും ശ്രദ്ധിക്കുന്നില്ല.',
    en: 'At the godown, the owner checks old bills to decide the load while the driver carries boxes to the van. One box slips behind the sacks and nobody notices.',
  },
  'stage.a3.sr': {
    ml: 'ഡ്രൈവർ ഒരു പെട്ടിക്കടയിലും പിന്നെ ഒരു പഴക്കടയിലും പോകുന്നു. ഓരോ കടയിലും വാനിൽ സാധനം തിരയുന്നു, കൈകൊണ്ട് ബില്ലെഴുതുന്നു, കാർബൺ കോപ്പി കീറിക്കൊടുക്കുന്നു, കടം എഴുതിവെക്കുന്നു. വൈകുന്നേരമാകുമ്പോഴേക്കും ബിൽ ബുക്ക് കട്ടിയും കുഴഞ്ഞതുമാകുന്നു.',
    en: 'The driver visits shop after shop: a small petti kada, then a fruit and vegetable shop. At each one he searches the van, writes a bill by hand, tears off the carbon copy and notes the credit. The bill book gets thicker and messier as the day turns to evening.',
  },
  'stage.a4.sr': {
    ml: 'രാത്രി വൈകിയും ഉടമ ബിൽ ബുക്ക് വീണ്ടും വീണ്ടും കൂട്ടിനോക്കുന്നു. പണം ഒത്തുവരുന്നില്ല. ഡ്രൈവർക്കും അറിയില്ല. ക്ലോക്ക് 11:40 ആകുന്നു.',
    en: "Late at night the owner adds up the bill book again and again. The cash doesn't match. The driver doesn't know either. The clock reaches 11:40.",
  },
  'stage.t.sr': {
    ml: 'കലണ്ടർ പേജുകൾ കീറിപ്പോകുന്നു, ഇത് എല്ലാ ദിവസവും നടക്കുന്നു എന്ന് കാണിക്കുന്നു. സ്ലിപ്പുകൾ നിറഞ്ഞ ഫയലിനരികിൽ ഉടമ തലയിൽ കൈവെച്ച് ഇരിക്കുന്നു. പിന്നെ DockDrop ലോഗോ തെളിയുന്നു.',
    en: 'Calendar pages tear away, showing this happens every day. The owner sits with his head in his hands next to a folder stuffed with slips. Then the DockDrop logo appears.',
  },
  'stage.b1.sr': {
    ml: 'രാവിലെ. ഉടമയുടെ ഫോണിൽ DockDrop ആപ്പ്: ഇന്നത്തെ വാൻ, ഇന്നലത്തെ കളക്ഷൻ, കടം ഉള്ള കടകൾ.',
    en: "Morning. The owner holds the DockDrop app on his phone, showing today's van, yesterday's collection and shops with dues.",
  },
  'stage.b2.sr': {
    ml: 'ഉടമ ആപ്പിൽ നോക്കി വാൻ ലോഡ് ചെയ്യുന്നു. ഓരോ സാധനവും ടിക്ക് ആകുന്നു. മുമ്പ് കാണാതായ പെട്ടി ഇത്തവണ കണ്ടെത്തി കയറ്റുന്നു. ഡെലിവറി ചലാൻ തനിയെ ഉണ്ടാകുന്നു. വാൻ 6:45-ന് പുറപ്പെടുന്നു.',
    en: 'The owner loads the van from the app. Each item ticks off. The box that went missing before is caught and loaded. A delivery challan is created automatically. The van leaves at 6:45.',
  },
  'stage.b3.sr': {
    ml: 'വാൻ കടയിലെത്തുന്നു. ആപ്പിൽ ജോസഫ് സ്റ്റോർസിന്റെ മുഴുവൻ കണക്കും: കടം ₹2,850, ലിമിറ്റ് ₹10,000, പഴയ ഓർഡറുകൾ, പണമായി കിട്ടിയ രസീത്, കേടായ പാക്കറ്റിന്റെ റിട്ടേൺ, ഇന്നത്തെ ഓർഡറും UPI പേയ്മെന്റും. രസീത് പ്രിന്റ് ചെയ്യുന്നു. നെറ്റ്‌വർക്ക് ഇല്ലാത്തിടത്തും ബിൽ സേവ് ആകുന്നു.',
    en: "The van reaches the shop. The app shows Joseph Stores' whole history: credit balance ₹2,850 against a ₹10,000 limit, past orders, a cash receipt, a return for one damaged packet, and today's order paid by UPI. The receipt prints. With no network, the bill is still saved.",
  },
  'stage.b4.sr': {
    ml: 'വൈകുന്നേരം ഡ്രൈവർ പണം ഏൽപ്പിക്കുന്നു. ആപ്പ് പ്രതീക്ഷിച്ച തുക കാണിക്കുന്നു, അത് ഒത്തുവരുന്നു. ഉടമ ഓരോ കടയുടെയും ബാക്കിയും ദിവസത്തെ ലാഭവും നോക്കുന്നു, രണ്ടുപേരും 7:05-ന് വീട്ടിലേക്ക് പോകുന്നു.',
    en: "In the evening the driver hands over the cash. The app shows the expected amount, and it matches. The owner checks every shop's dues and the day's profit, and both go home at 7:05.",
  },

  // ---------- 14.3 chips ----------
  'chip.vanLoad': { ml: 'വാൻ ലോഡ്', en: 'Van load' },
  'chip.stockList': { ml: 'സ്റ്റോക്ക് ലിസ്റ്റ്', en: 'Stock list' },
  'chip.challan': { ml: 'ഡെലിവറി ചലാൻ', en: 'Delivery challan' },
  'chip.upi': { ml: 'UPI QR', en: 'UPI QR' },
  'chip.returns': { ml: 'റിട്ടേൺ', en: 'Returns' },
  'chip.offline': { ml: 'നെറ്റ് ഇല്ലെങ്കിലും', en: 'Works offline' },
  'chip.credit': { ml: 'കടവും ലിമിറ്റും', en: 'Credit & limit' },
  'chip.orders': { ml: 'പഴയ ഓർഡറുകൾ', en: 'Past orders' },
  'chip.receipts': { ml: 'രസീതുകൾ', en: 'Receipts' },
  'chip.dayEnd': { ml: 'ഡേ-എൻഡ് ചെക്ക്', en: 'Day-end check' },
  'chip.dues': { ml: 'കട ബാക്കി', en: 'Shop dues' },
  'chip.profit': { ml: 'ലാഭം', en: 'Profit' },
  'chip.reports': { ml: '17 റിപ്പോർട്ടുകൾ (Excel)', en: '17 reports (Excel)' },

  // ---------- 14.6 phone notifications (a1) ----------
  'notif1.from': { ml: 'ഡ്രൈവർ സുനിൽ', en: 'Driver Sunil' },
  'notif1.msg': {
    ml: 'ചേട്ടാ, ഇന്നത്തെ കളക്ഷൻ ₹18,400. ബാക്കി നാളെ തരാം.',
    en: "Chetta, today's collection is ₹18,400. I'll give the rest tomorrow.",
  },
  'notif2.from': { ml: 'ഷാജി ട്രേഡേഴ്സ്', en: 'Shaji Traders' },
  'notif2.msg': { ml: 'കഴിഞ്ഞ മാസത്തെ ബിൽ ഞാൻ അടച്ചതാണല്ലോ?', en: "I already paid last month's bill, didn't I?" },
  'notif3.from': { ml: 'ജോസഫ് സ്റ്റോർസ്', en: 'Joseph Stores' },
  'notif3.msg': { ml: 'ബിൽ കോപ്പി ഒന്ന് അയച്ചു തരാമോ?', en: 'Can you send me the bill copy?' },

  // ---------- 14.7 in-scene UI strings ----------
  'home.todayVan': { ml: 'ഇന്നത്തെ വാൻ · 1', en: "Today's vans · 1" },
  'home.yesterday': { ml: 'ഇന്നലത്തെ കളക്ഷൻ · ₹18,400', en: "Yesterday's collection · ₹18,400" },
  'home.duesShops': { ml: 'കടം ഉള്ള കടകൾ · 5', en: 'Shops with dues · 5' },
  'vanLoad.title': { ml: 'വാൻ ലോഡ്', en: 'Van load' },
  'vanLoad.row1': { ml: 'മഞ്ഞൾപ്പൊടി 1kg ×10', en: 'Turmeric Powder 1kg ×10' },
  'vanLoad.row2': { ml: 'മുളകുപൊടി 500g ×12', en: 'Chilli Powder 500g ×12' },
  'vanLoad.row3': { ml: 'മല്ലിപ്പൊടി 500g ×10', en: 'Coriander Powder 500g ×10' },
  'vanLoad.row4': { ml: 'ഗരം മസാല 100g ×10', en: 'Garam Masala 100g ×10' },
  'vanLoad.row5': { ml: 'സാമ്പാർ പൊടി 200g ×8', en: 'Sambar Powder 200g ×8' },
  'vanLoad.left': { ml: '1 ബാക്കി', en: '1 left' },
  'vanLoad.done': { ml: 'എല്ലാം ലോഡ് ആയി ✓', en: 'All loaded ✓' },
  'upi.amount': { ml: '₹2,140', en: '₹2,140' },
  'upi.paid': { ml: 'പണം ലഭിച്ചു ✓', en: 'Paid ✓' },
  'return.tag': { ml: 'കേടായത്', en: 'Damaged' },
  'offline.saved': { ml: 'സേവ് ചെയ്തു', en: 'Saved' },
  // b3 shop ledger (one shop's whole history; amounts add up to the balance)
  'ledger.shop': { ml: 'ജോസഫ് സ്റ്റോർസ്', en: 'Joseph Stores' },
  'ledger.balance': { ml: 'കടം ബാക്കി', en: 'Credit balance' },
  'ledger.amount': { ml: '₹2,850', en: '₹2,850' },
  'ledger.limit': { ml: 'ലിമിറ്റ് ₹10,000', en: 'Limit ₹10,000' },
  'ledger.tag.order': { ml: 'ഓർഡർ', en: 'Order' },
  'ledger.tag.receipt': { ml: 'രസീത്', en: 'Receipt' },
  'ledger.tag.return': { ml: 'റിട്ടേൺ', en: 'Return' },
  'ledger.tag.upi': { ml: 'UPI', en: 'UPI' },
  'ledger.row1': { ml: '28 സെപ്റ്റം · 12 സാധനങ്ങൾ', en: '28 Sep · 12 items' },
  'ledger.row2': { ml: '28 സെപ്റ്റം · പണമായി', en: '28 Sep · cash' },
  'ledger.row3': { ml: '1 ഒക്ടോ · 1 കേടായ പാക്കറ്റ്', en: '1 Oct · 1 damaged packet' },
  'ledger.row4': { ml: 'ഇന്ന് · 6 സാധനങ്ങൾ', en: 'Today · 6 items' },
  'ledger.row5': { ml: 'ഇന്ന് · പണം ലഭിച്ചു', en: 'Today · paid' },
  'ledger.amt1': { ml: '+₹4,120', en: '+₹4,120' },
  'ledger.amt2': { ml: '−₹1,210', en: '−₹1,210' },
  'ledger.amt3': { ml: '−₹60', en: '−₹60' },
  'ledger.amt4': { ml: '+₹2,140', en: '+₹2,140' },
  'ledger.amt5': { ml: '−₹2,140', en: '−₹2,140' },
  'ledger.done': { ml: 'എല്ലാം ഒരിടത്ത്, ഒന്നും വിട്ടുപോയില്ല', en: 'All in one place. Nothing missed.' },
  'dayEnd.title': { ml: 'ഇന്നത്തെ കണക്ക്', en: "Today's account" },
  'dayEnd.expected': { ml: 'പ്രതീക്ഷിച്ച തുക · ₹18,400', en: 'Expected · ₹18,400' },
  'dayEnd.collected': { ml: 'ലഭിച്ച തുക · ₹18,400 ✓', en: 'Collected · ₹18,400 ✓' },
  'dayEnd.stock': { ml: 'സ്റ്റോക്ക് തിരികെ ✓', en: 'Stock back ✓' },
  'dayEnd.returns': { ml: 'റിട്ടേൺ · 1', en: 'Returns · 1' },
  'dues.title': { ml: 'കട ബാക്കി', en: 'Shop dues' },
  'dues.attention': { ml: 'ശ്രദ്ധ വേണം', en: 'Needs attention' },
  'dues.shop1': { ml: 'ജോസഫ് സ്റ്റോർസ് · ₹2,850', en: 'Joseph Stores · ₹2,850' },
  'dues.shop2': { ml: 'ഷാജി ട്രേഡേഴ്സ് · ₹3,400', en: 'Shaji Traders · ₹3,400' },
  'dues.shop3': { ml: 'രാജു ബേക്കറി · ₹1,160', en: 'Raju Bakery · ₹1,160' },
  'dues.shop4': { ml: 'ബിന്ദു സൂപ്പർമാർക്കറ്റ് · ₹1,980', en: 'Bindu Supermarket · ₹1,980' },
  'dues.shop5': { ml: 'മണി ടീ സ്റ്റാൾ · ₹640', en: 'Mani Tea Stall · ₹640' },
  'calendar.month': { ml: 'ഒക്ടോ', en: 'OCT' },
  'compare.paper': { ml: 'ബിൽ ബുക്ക് · 11:40 PM', en: 'Bill book · 11:40 PM' },
  'compare.app': { ml: 'DockDrop · 7:05 PM', en: 'DockDrop · 7:05 PM' },
  'pricing.line': {
    ml: '3 വാൻ വരെ · ആളെണ്ണം നോക്കി വിലയില്ല · സെറ്റപ്പ് സൗജന്യം · എപ്പോൾ വേണമെങ്കിലും നിർത്താം',
    en: 'Up to 3 vans · not charged per person · free setup · cancel any time',
  },
  'pricing.best': { ml: 'ഏറ്റവും ലാഭം', en: 'Best value' },
  'pricing.monthly': { ml: 'പ്രതിമാസം', en: 'Monthly' },
  'pricing.halfYear': { ml: '6 മാസം', en: '6 months' },
  'pricing.yearly': { ml: 'വാർഷികം', en: 'Yearly' },
  'pricing.perMonth': { ml: '/ മാസം', en: '/ month' },
  'pricing.perHalfYear': { ml: '/ 6 മാസം', en: '/ 6 months' },
  'pricing.perYear': { ml: '/ വർഷം', en: '/ year' },
  'pricing.halfYearNote': { ml: 'മാസം ഏകദേശം ₹300', en: 'About ₹300 a month' },
  'pricing.yearlyNote': { ml: 'മാസം ഏകദേശം ₹267', en: 'About ₹267 a month' },
  'pricing.monthlyNote': { ml: 'എപ്പോൾ വേണമെങ്കിലും നിർത്താം', en: 'Stop whenever you like' },
  'wa.message': { ml: 'ഹായ്, DockDrop പരീക്ഷിക്കണം', en: "Hi, I'd like to try DockDrop" },
  'wa.trial': { ml: 'DockDrop സൗജന്യ ട്രയൽ വേണം', en: "I'd like a free trial of DockDrop" },
  'brand.name': { ml: 'DockDrop', en: 'DockDrop' },

  // ---------- 13 post-story sections ----------
  'trust.h2': { ml: 'നിങ്ങൾക്ക് വിശ്വസിക്കാം', en: 'Why you can trust DockDrop' },
  'trust.made': { ml: 'തൃശൂരിൽ നിർമ്മിച്ചത്', en: 'Made in Thrissur' },
  'trust.data': { ml: 'നിങ്ങളുടെ ഡാറ്റ നിങ്ങളുടേത്', en: 'Your data is yours' },
  'trust.malayalam': { ml: 'മലയാളത്തിൽ തന്നെ', en: 'Fully in Malayalam' },
  'trust.first': { ml: 'ആദ്യ ഉപഭോക്താവ്', en: 'Our first customer' },
  'trust.madeBody': {
    ml: 'DockDrop ഉണ്ടാക്കുന്നതും പിന്തുണയ്ക്കുന്നതും തൃശൂരിൽ നിന്നാണ്. സംശയം ഉണ്ടെങ്കിൽ സ്ഥാപകനോട് നേരിട്ട് WhatsApp-ൽ ചോദിക്കാം.',
    en: 'DockDrop is built and supported from Thrissur. Questions? Ask the founder directly on WhatsApp.',
  },
  'trust.founder': { ml: 'അർജുൻ · സ്ഥാപകൻ', en: 'Arjun · Founder' },
  'trust.dataBody': {
    ml: 'ഡാറ്റ ഇന്ത്യയിൽ സൂക്ഷിക്കുന്നു, ദിവസവും ബാക്കപ്പ് എടുക്കുന്നു. എല്ലാം എപ്പോൾ വേണമെങ്കിലും ഡൗൺലോഡ് ചെയ്യാം.',
    en: 'Stored in India and backed up daily. Download all of it, any time.',
  },
  'trust.malayalamBody': {
    ml: 'ആപ്പും ബില്ലും രസീതും മലയാളത്തിൽ. ഡ്രൈവർമാർക്കും എളുപ്പം.',
    en: 'The app, bills and receipts all work in Malayalam. Easy for drivers too.',
  },
  'trust.firstBody': {
    ml: 'തൃശൂരിലെ ഒരു സ്പൈസസ് വിതരണക്കാരൻ ദിവസവും DockDrop ഉപയോഗിക്കുന്നു.',
    en: 'A spice distributor in Thrissur uses DockDrop every day.',
  },
  'trust.screenAlt': {
    ml: 'മലയാളത്തിലുള്ള DockDrop ഡാഷ്ബോർഡ്: അറ്റാദായം, മാർജിൻ, പണം എവിടെ പോയി',
    en: 'The DockDrop dashboard in Malayalam: net profit, margin and where the money went',
  },
  'pricing.h2': { ml: 'ഒരു വില, മുഴുവൻ ബിസിനസിനും', en: 'One price for your whole business' },
  'faq.h2': { ml: 'സാധാരണ ചോദ്യങ്ങൾ', en: 'Common questions' },
  'faq.ask': { ml: 'WhatsApp-ൽ ഞങ്ങളോട് ചോദിക്കൂ', en: 'Ask us on WhatsApp' },
  'cta.h2': { ml: 'DockDrop നിങ്ങളുടെ ബിസിനസ്സിൽ സൗജന്യമായി പരീക്ഷിക്കൂ', en: 'Try DockDrop free in your business' },
  'cta.splash': { ml: 'DockDrop ആപ്പ്', en: 'The DockDrop app' },
  'cta.line': { ml: '₹349/മാസം · തൃശൂരിൽ നിർമ്മിച്ചത്', en: '₹349/month · Made in Thrissur' },
  'footer.copy': { ml: '© 2026 DockDrop', en: '© 2026 DockDrop' },
  'footer.privacy': { ml: 'സ്വകാര്യതാ നയം', en: 'Privacy' },
  'footer.terms': { ml: 'നിബന്ധനകൾ', en: 'Terms' },
  'footer.credit': { ml: 'ഫോൺ മോക്കപ്പ്: Pngtree', en: 'Phone mockup: Pngtree' },
  'footer.login': { ml: 'ലോഗിൻ', en: 'Login' },

  // ---------- 14.8 FAQ ----------
  'faq1.q': { ml: 'ഇന്റർനെറ്റ് ഇല്ലാതെ പ്രവർത്തിക്കുമോ?', en: 'Does it work without internet?' },
  'faq1.a': {
    ml: 'ഉവ്വ്. ഡ്രൈവർ ആപ്പ് നെറ്റ്‌വർക്ക് ഇല്ലാതെയും പ്രവർത്തിക്കും. നെറ്റ് തിരികെ വരുമ്പോൾ തനിയെ അപ്‌ലോഡ് ആകും, ഒന്നും ഇരട്ടിക്കില്ല.',
    en: 'Yes. The driver app works offline and uploads automatically when the signal returns, without duplicates.',
  },
  'faq2.q': { ml: 'ബിൽ പ്രിന്റ് ചെയ്യാമോ?', en: 'Can I print bills?' },
  'faq2.a': {
    ml: 'ഉവ്വ്, ബ്ലൂടൂത്ത് റസീറ്റ് പ്രിന്ററിൽ, മലയാളത്തിൽ പോലും. PDF ആയോ WhatsApp-ലോ അയക്കാം.',
    en: 'Yes, on Bluetooth receipt printers, even in Malayalam. Bills can also go as PDF or on WhatsApp.',
  },
  'faq3.q': { ml: 'Tally-യുമായി ബന്ധിപ്പിക്കാമോ?', en: 'Does it work with Tally?' },
  'faq3.a': { ml: 'ഇപ്പോൾ ഇല്ല. 17 റിപ്പോർട്ടുകളും Excel-ലേക്ക് ഡൗൺലോഡ് ചെയ്യാം.', en: 'Not yet. All 17 reports download to Excel.' },
  'faq4.q': { ml: 'എന്റെ ഡ്രൈവർമാർക്ക് ഉപയോഗിക്കാൻ പറ്റുമോ?', en: 'Will my drivers manage it?' },
  'faq4.a': {
    ml: 'ഡ്രൈവർ ആപ്പ് ലളിതമാണ്, മലയാളത്തിലാണ്. വാനിലെ സ്റ്റോക്കും റൂട്ടിലെ കടകളും മാത്രം കാണിക്കും.',
    en: "The driver app is simple and in Malayalam. It shows only the van's stock and the route's shops.",
  },
  'faq5.q': { ml: 'എത്ര വാൻ ചേർക്കാം?', en: 'How many vans can I add?' },
  'faq5.a': { ml: 'ഈ പ്ലാനിൽ 3 വാൻ വരെ.', en: 'Up to 3 vans on this plan.' },
  'faq6.q': { ml: 'എന്റെ ഡാറ്റ സുരക്ഷിതമാണോ?', en: 'Is my data safe?' },
  'faq6.a': {
    ml: 'ഡാറ്റ ഇന്ത്യയിൽ സൂക്ഷിക്കുന്നു, ദിവസവും ബാക്കപ്പ് എടുക്കുന്നു, എപ്പോൾ വേണമെങ്കിലും മുഴുവൻ ഡൗൺലോഡ് ചെയ്യാം.',
    en: 'Stored in India, backed up daily, and you can download all of it any time.',
  },
  'faq7.q': { ml: 'ഡ്രൈവർക്ക് ഏത് ഫോൺ വേണം?', en: 'Which phone does the driver need?' },
  'faq7.a': { ml: 'ഒരു Android ഫോൺ മതി.', en: 'An Android phone.' },
};

export const FAQ_KEYS = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5', 'faq6', 'faq7'];

/**
 * 14.4 Bill book pages: ALWAYS English (that's how real bill books are written).
 * Printed parts render in Inter, handwritten parts in Kalam.
 */
export const BILL_BOOK_PAGES = [
  {
    business: 'SREE DURGA SPICES & DISTRIBUTORS',
    address: 'Market Road, Thrissur · Ph: 94xx xxx xxx',
    title: 'CREDIT BILL',
    no: '0347',
    date: '04/10/2026',
    to: 'Joseph Stores, Ollur',
    items: [
      { sl: 1, item: 'Turmeric Powder 1kg', qty: 10, rate: 180, amount: '1,800' },
      { sl: 2, item: 'Chilli Powder 500g', qty: 12, rate: 135, amount: '1,620' },
      { sl: 3, item: 'Coriander Powder 500g', qty: 10, rate: 95, amount: '950' },
      { sl: 4, item: 'Garam Masala 100g', qty: 10, rate: 48, amount: '480' },
    ],
    total: '4,850',
    paid: '2,000',
    balance: '2,850',
  },
  {
    business: 'SREE DURGA SPICES & DISTRIBUTORS',
    address: 'Market Road, Thrissur · Ph: 94xx xxx xxx',
    title: 'CREDIT BILL',
    no: '0346',
    date: '04/10/2026',
    to: 'Raju Bakery',
    items: [
      { sl: 1, item: 'Sambar Powder 200g', qty: 8, rate: 55, amount: '440' },
      { sl: 2, item: 'Turmeric 1kg', qty: 4, rate: 180, amount: '720' },
    ],
    total: '1,160',
    paid: '0',
    balance: '1,160',
  },
];

/** 14.5 Receipt (b3, shop 1): follows the active language. */
export const RECEIPT = {
  ml: {
    business: 'ശ്രീ ദുർഗ സ്പൈസസ്',
    place: 'തൃശൂർ',
    meta: 'ബിൽ നം. 0348 · 05/10/2026',
    items: [
      ['മഞ്ഞൾപ്പൊടി 1kg', '×4', '₹720'],
      ['മുളകുപൊടി 500g', '×2', '₹270'],
      ['മല്ലിപ്പൊടി 500g', '×2', '₹190'],
      ['ഗരം മസാല 100g', '×1', '₹60'],
    ],
    totalLabel: 'ആകെ',
    total: '₹1,240',
    thanks: 'നന്ദി!',
  },
  en: {
    business: 'SREE DURGA SPICES',
    place: 'Thrissur',
    meta: 'Bill No. 0348 · 05/10/2026',
    items: [
      ['Turmeric Powder 1kg', '×4', '₹720'],
      ['Chilli Powder 500g', '×2', '₹270'],
      ['Coriander Powder 500g', '×2', '₹190'],
      ['Garam Masala 100g', '×1', '₹60'],
    ],
    totalLabel: 'Total',
    total: '₹1,240',
    thanks: 'Thank you!',
  },
};
