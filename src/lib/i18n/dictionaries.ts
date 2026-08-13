export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Dictionary = {
  meta: { title: string; description: string };
  nav: { backToNontatech: string };
  home: {
    heading: string;
    subtitle: string;
    tripName: string;
    tripNamePlaceholder: string;
    whosGoing: string;
    addPerson: string;
    participantsHelp: string;
    personPlaceholder: string;
    paymentInfoPlaceholder: string;
    removePerson: string;
    creating: string;
    createTrip: string;
    somethingWentWrong: string;
  };
  addBill: {
    addABill: string;
    newBill: string;
    cancel: string;
    billTitlePlaceholder: string;
    whoPaid: string;
    itemNamePlaceholder: string;
    removeItem: string;
    addItem: string;
    total: string;
    creating: string;
    createBill: string;
    somethingWentWrong: string;
  };
  paidToggle: {
    saving: string;
    paid: string;
    markAsPaid: string;
  };
  trip: {
    noBillsYet: string;
    paidBy: string;
    whoOwesWhat: string;
    nothingOwed: string;
    total: string;
    payTo: string;
    tripTotal: string;
    newTrip: string;
  };
  errors: {
    tripTitleRequired: string;
    atLeastOneParticipant: string;
    billTitleRequired: string;
    pickPayer: string;
    atLeastOneItem: string;
    payerMustBeParticipant: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: { backToNontatech: "← Back to nontatech.dev" },
    meta: {
      title: "Split Bill",
      description: "Split a bill with friends and track who's paid.",
    },
    home: {
      heading: "Split Bill",
      subtitle:
        "Start a trip, add everyone going, then add a bill for each day or expense. Share the link so everyone can check what they had and mark themselves as paid.",
      tripName: "Trip name",
      tripNamePlaceholder: "e.g. Chiang Mai Weekend",
      whosGoing: "Who's going",
      addPerson: "+ Add person",
      participantsHelp:
        "This list is shared across every bill in the trip. Payment info is optional but shows up whenever this person pays for a bill, so others know how to pay them back.",
      personPlaceholder: "Person {n}",
      paymentInfoPlaceholder:
        "Payment info (e.g. Kbank 123-4-56789-0 or PromptPay 08xxxxxxxx)",
      removePerson: "Remove person",
      creating: "Creating…",
      createTrip: "Create trip",
      somethingWentWrong: "Something went wrong",
    },
    addBill: {
      addABill: "+ Add a bill",
      newBill: "New bill",
      cancel: "Cancel",
      billTitlePlaceholder: "e.g. Day 2 lunch",
      whoPaid: "Who paid?",
      itemNamePlaceholder: "Item name",
      removeItem: "Remove item",
      addItem: "+ Add item",
      total: "Total",
      creating: "Creating…",
      createBill: "Create bill",
      somethingWentWrong: "Something went wrong",
    },
    paidToggle: {
      saving: "Saving…",
      paid: "Paid ✓",
      markAsPaid: "Mark as paid",
    },
    trip: {
      noBillsYet: "No bills yet — add the first one below.",
      paidBy: "Paid by",
      whoOwesWhat: "Who owes what",
      nothingOwed: "Nothing owed",
      total: "{amount} total",
      payTo: "→ pay {name}",
      tripTotal: "Trip total",
      newTrip: "+ New trip",
    },
    errors: {
      tripTitleRequired: "Trip title is required",
      atLeastOneParticipant: "At least one participant is required",
      billTitleRequired: "Bill title is required",
      pickPayer: "Pick who paid for this bill",
      atLeastOneItem: "At least one item is required",
      payerMustBeParticipant: "Payer must be a participant of this trip",
    },
  },
  th: {
    nav: { backToNontatech: "← กลับไป nontatech.dev" },
    meta: {
      title: "หารบิล",
      description: "หารบิลกับเพื่อน แล้วดูว่าใครจ่ายแล้วบ้าง",
    },
    home: {
      heading: "หารบิล",
      subtitle:
        "เริ่มทริป เพิ่มคนที่ไปด้วยกัน แล้วเพิ่มบิลของแต่ละวันหรือแต่ละค่าใช้จ่าย แชร์ลิงก์ให้ทุกคนเช็คได้ว่ากินอะไรไปและกดว่าจ่ายแล้ว",
      tripName: "ชื่อทริป",
      tripNamePlaceholder: "เช่น ทริปเชียงใหม่",
      whosGoing: "ใครไปบ้าง",
      addPerson: "+ เพิ่มคน",
      participantsHelp:
        "รายชื่อนี้ใช้ร่วมกันทุกบิลในทริป ข้อมูลการรับเงินไม่บังคับ แต่จะแสดงเมื่อคนนี้จ่ายบิลให้ก่อน เพื่อให้คนอื่นรู้ว่าจะโอนคืนยังไง",
      personPlaceholder: "คนที่ {n}",
      paymentInfoPlaceholder:
        "ข้อมูลการรับเงิน (เช่น กสิกร 123-4-56789-0 หรือ พร้อมเพย์ 08xxxxxxxx)",
      removePerson: "ลบคนนี้",
      creating: "กำลังสร้าง…",
      createTrip: "สร้างทริป",
      somethingWentWrong: "เกิดข้อผิดพลาด",
    },
    addBill: {
      addABill: "+ เพิ่มบิล",
      newBill: "บิลใหม่",
      cancel: "ยกเลิก",
      billTitlePlaceholder: "เช่น มื้อเที่ยงวันที่ 2",
      whoPaid: "ใครจ่าย?",
      itemNamePlaceholder: "ชื่อรายการ",
      removeItem: "ลบรายการ",
      addItem: "+ เพิ่มรายการ",
      total: "รวม",
      creating: "กำลังสร้าง…",
      createBill: "สร้างบิล",
      somethingWentWrong: "เกิดข้อผิดพลาด",
    },
    paidToggle: {
      saving: "กำลังบันทึก…",
      paid: "จ่ายแล้ว ✓",
      markAsPaid: "กดว่าจ่ายแล้ว",
    },
    trip: {
      noBillsYet: "ยังไม่มีบิล เพิ่มบิลแรกด้านล่างนี้",
      paidBy: "จ่ายโดย",
      whoOwesWhat: "ใครติดเงินใคร",
      nothingOwed: "ไม่ติดเงิน",
      total: "รวม {amount}",
      payTo: "→ จ่ายให้ {name}",
      tripTotal: "ยอดรวมทริป",
      newTrip: "+ ทริปใหม่",
    },
    errors: {
      tripTitleRequired: "กรุณาใส่ชื่อทริป",
      atLeastOneParticipant: "ต้องมีผู้ร่วมทริปอย่างน้อย 1 คน",
      billTitleRequired: "กรุณาใส่ชื่อบิล",
      pickPayer: "เลือกว่าใครจ่ายบิลนี้",
      atLeastOneItem: "ต้องมีรายการอย่างน้อย 1 รายการ",
      payerMustBeParticipant: "ผู้จ่ายต้องเป็นคนในทริปนี้",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function t(
  template: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce(
    (str, [key, value]) => str.replaceAll(`{${key}}`, String(value)),
    template
  );
}
