import { useState, useEffect } from "react";

function getStored() {
  return {
    nameAr: localStorage.getItem("brandingNameAr") || "مجمع الشفاء",
    nameEn: localStorage.getItem("brandingNameEn") || "Al Shifa Medical",
    logo: localStorage.getItem("brandingLogo") || null,
  };
}

export function useBranding() {
  const [branding, setBranding] = useState(getStored);

  useEffect(() => {
    function handler() {
      setBranding(getStored());
    }
    window.addEventListener("brandingChanged", handler);
    return () => window.removeEventListener("brandingChanged", handler);
  }, []);

  return branding;
}

export function saveBranding({ nameAr, nameEn, logo }) {
  if (nameAr !== undefined) localStorage.setItem("brandingNameAr", nameAr);
  if (nameEn !== undefined) localStorage.setItem("brandingNameEn", nameEn);
  if (logo !== undefined) {
    if (logo) localStorage.setItem("brandingLogo", logo);
    else localStorage.removeItem("brandingLogo");
  }
  window.dispatchEvent(new Event("brandingChanged"));
}
