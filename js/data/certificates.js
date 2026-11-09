/* ============================================================
   CERTIFICATES DATA
   ============================================================
   HOW TO ADD / REPLACE A CERTIFICATE:

   1. Drop your certificate image into:  img/certificates/
      (PNG, JPG or SVG — landscape images around 1200x840 look best)

   2. Add (or edit) an entry in the list below:

        {
          title:   "Your certificate title",
          issuer:  "Issuing organisation",
          year:    "2026",
          image:   "img/certificates/your-file.png",
        }

   The section layout, hover effects and lightbox are generated
   automatically — no styling changes needed.

   The entries below are empty PLACEHOLDER slots waiting for your
   real certificate images. Replace them and delete any slots you
   do not need.
   ============================================================ */

const CERTIFICATES = [
  {
    title: "University Cup",
    issuer: "Entelect",
    year: "2026",
    image: "img/certificates/certificate-1.png",
    placeholder: true,
  },
  {
    title: "GenAI course",
    issuer: "WeThinkCode_",
    year: "2026",
    image: "img/certificates/certificate-3.png",
    placeholder: true,
  },
  {
    title: "AMD Developer",
    issuer: "LAB LAB",
    year: "2026",
    image: "img/certificates/certificate-2.jpeg",
    placeholder: true,
  },
];
