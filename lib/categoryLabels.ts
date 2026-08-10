const categoryLabels: Record<string, string> = {
  beauty: "Güzellik",
  fragrances: "Parfüm",
  furniture: "Mobilya",
  groceries: "Market",
  "home-decoration": "Ev Dekorasyonu",
  "kitchen-accessories": "Mutfak Aksesuarları",
  laptops: "Dizüstü Bilgisayar",
  "mens-shirts": "Erkek Gömlek",
  "mens-shoes": "Erkek Ayakkabı",
  "mens-watches": "Erkek Saat",
  "mobile-accessories": "Telefon Aksesuarları",
  motorcycle: "Motosiklet",
  "skin-care": "Cilt Bakımı",
  smartphones: "Akıllı Telefon",
  "sports-accessories": "Spor Aksesuarları",
  sunglasses: "Güneş Gözlüğü",
  tablets: "Tablet",
  tops: "Üst Giyim",
  vehicle: "Araç",
  "womens-bags": "Kadın Çanta",
  "womens-dresses": "Kadın Elbise",
  "womens-jewellery": "Kadın Mücevher",
  "womens-shoes": "Kadın Ayakkabı",
  "womens-watches": "Kadın Saat",
};

export function getCategoryLabel(slug: string): string {
  if (categoryLabels[slug]) return categoryLabels[slug];

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}