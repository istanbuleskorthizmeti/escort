export interface MapBranchConfig {
  id: string;
  name: string; // Örn: İnci Spa (Şişli Şubesi)
  address: string; // Örn: Harbiye Mah. Şişli, İstanbul
  phone: string; // Örn: +90 555 123 45 67
  websiteUrl: string; // Örn: https://istanbulescort.blog/sisli-escort
  mapEmbedUrl: string; // Google'dan aldığın "Haritayı Yerleştir" (Iframe) linki
  isVerified: boolean; // Onaylandıysa true, SMS bekliyorsa false yap
  seoDescription: string; // Bu şubenin altında görünecek SEO uyumlu gizli metin
}

/**
 * ☠️ FRANCHISE COMMAND CENTER
 * Tüm harita şubelerinin metinlerini, telefon numaralarını ve yönlendirilecek web sitelerini
 * tek bir yerden yöneteceğin Ana Merkez. Sadece burayı değiştirmen yeterli.
 */
export const MapsConfig = {
  mainBranchName: "İNCİ SPA & GÜZELLİK", // Ana markan
  
  branches: [
    {
      id: "branch_sef_1",
      name: "İnci Spa (Merkez Sefaköy)",
      address: "Kemalpaşa Mah. Sefaköy, Küçükçekmece/İstanbul",
      phone: "+90 530 000 00 00", // Sefaköy için aldığın numara
      websiteUrl: "https://istanbulescort.blog",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12041.123456789!2d28.7981984!3d41.0010908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzAzLjkiTiAyOMKwNDcnNTMuNSJF!5e0!3m2!1str!2str!4v123456789",
      isVerified: true,
      seoDescription: "Sefaköy bölgesindeki en seçkin ve profesyonel hizmet için bizi arayın."
    },
    {
      id: "branch_sisli_1",
      name: "İnci Spa (Şişli Şubesi)",
      address: "Harbiye Mah. Şişli, İstanbul",
      phone: "+90 531 111 11 11", // Şişli için aldığın sanal numara
      websiteUrl: "https://istanbulescort.blog/sisli-escort",
      mapEmbedUrl: "https://www.google.com/maps/embed?...", // Onaylanınca buraya yapıştıracaksın
      isVerified: false, // SMS onayı alınca burayı true yapacaksın
      seoDescription: "Şişli ve Nişantaşı bölgesine özel VIP hizmetlerimizle hizmetinizdeyiz."
    }
  ] as MapBranchConfig[]
};
