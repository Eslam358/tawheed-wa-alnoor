export const adminOffice = {
  name: "الإدارة",
  phones: ["44890364", "44890763"],
  fax: "44890565",
};

export const branches = [
  {
    name: "فرع العبور",
    address: "الحي التاسع بعد كارفور - أمام محطة بسمة",
    phones: ["44890744"],
  },
  {
    name: "فرع الثورة",
    address: "شارع فيصل تقاطع ناصر الثورة مع الملك فيصل بجوار كلية التربية الرياضية",
    phones: ["37812728"],
    mobiles: ["01068536300"],
  },
  {
    name: "فرع مدينة بدر",
    address: "الحي الثالث (محطة الثالثة) خلف المركز الطبي",
    mobiles: ["01027943450"],
  },
  {
    name: "فرع بهتيم",
    address: "الشارع الجديد أمام حي شرق شبرا",
    phones: ["44729719"],
  },
];

// روابط الاتصال: أرقام الخط الأرضي بتضاف لها كود القاهرة (02)
export function telHref(number) {
  const clean = number.replace(/\s/g, "");
  return clean.startsWith("01") ? `tel:${clean}` : `tel:02${clean}`;
}
