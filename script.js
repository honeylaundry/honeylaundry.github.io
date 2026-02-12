// DATABASE HARGA LENGKAP
const dbSatuan = [
  { nama: "Jaket Kulit", harga: 50000, kategori: "Atasan" },
  { nama: "Jas Pria/Wanita", harga: 35000, kategori: "Atasan" },
  { nama: "Jas Set", harga: 65000, kategori: "Atasan" },
  { nama: "Jaket Non Kulit", harga: 25000, kategori: "Atasan" },
  { nama: "Kaos T-Shirt", harga: 15000, kategori: "Atasan" },
  { nama: "Kebaya", harga: 15000, kategori: "Atasan" },
  { nama: "Kemeja Batik", harga: 25000, kategori: "Atasan" },
  { nama: "Kemeja", harga: 20000, kategori: "Atasan" },
  { nama: "Polo", harga: 20000, kategori: "Atasan" },
  { nama: "Bra", harga: 10000, kategori: "Bawahan" },
  { nama: "Celana Pendek", harga: 15000, kategori: "Bawahan" },
  { nama: "Celana Panjang", harga: 20000, kategori: "Bawahan" },
  { nama: "Lingerie", harga: 20000, kategori: "Bawahan" },
  { nama: "Rok Pendek", harga: 15000, kategori: "Bawahan" },
  { nama: "Rok Panjang", harga: 20000, kategori: "Bawahan" },
  { nama: "Kamen / Songket", harga: 15000, kategori: "Ibadah" },
  { nama: "Udeng", harga: 15000, kategori: "Ibadah" },
  { nama: "Selendang", harga: 10000, kategori: "Ibadah" },
  { nama: "Mukena", harga: 25000, kategori: "Ibadah" },
  { nama: "Hijab", harga: 20000, kategori: "Ibadah" },
  { nama: "Sajadah", harga: 25000, kategori: "Ibadah" },
  { nama: "Guling", harga: 20000, kategori: "Bantal" },
  { nama: "Bantal Jumbo", harga: 30000, kategori: "Bantal" },
  { nama: "Bantal Leher", harga: 10000, kategori: "Bantal" },
  { nama: "Bantal Sofa", harga: 15000, kategori: "Bantal" },
  { nama: "Bantal Standar", harga: 20000, kategori: "Bantal" },
  { nama: "Bed Cover Kecil", harga: 20000, kategori: "Bed Cover" },
  { nama: "Bed Cover Sedang", harga: 30000, kategori: "Bed Cover" },
  { nama: "Bed Cover Besar", harga: 40000, kategori: "Bed Cover" },
  { nama: "Selimut Tipis", harga: 10000, kategori: "Selimut" },
  { nama: "Selimut Tebal", harga: 25000, kategori: "Selimut" },
  { nama: "Sprei", harga: 10000, kategori: "Sprei" },
  { nama: "Set Sprei", harga: 15000, kategori: "Sprei" },
];

let itemSatuanTerpilih = [];
let tempItem = null;
const LAUNDRY_LAT = -8.6617;
const LAUNDRY_LON = 115.2285;

// RENDER TABEL HARGA DI AWAL
function renderTabelAwal() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = dbSatuan
    .map(
      (item) => `
        <tr><td>${item.nama}</td><td>${item.kategori}</td><td>${item.harga.toLocaleString()}</td></tr>
    `,
    )
    .join("");
}
renderTabelAwal();

// FUNGSI SEARCH TABEL
function filterTabelHarga() {
  const q = document.getElementById("searchPricelist").value.toLowerCase();
  const rows = document.querySelectorAll("#tableSatuan tbody tr");
  rows.forEach(
    (r) =>
      (r.style.display = r.innerText.toLowerCase().includes(q) ? "" : "none"),
  );
}

// ESTIMATOR LOGIC
function filterDropdownSatuan() {
  const input = document.getElementById("inputCariSatuan");
  const filter = input.value.toLowerCase();
  const dropdown = document.getElementById("dropdownRekomendasi");
  if (!filter) {
    dropdown.style.display = "none";
    return;
  }
  const matches = dbSatuan.filter((i) => i.nama.toLowerCase().includes(filter));
  if (matches.length > 0) {
    dropdown.innerHTML = matches
      .map(
        (i) =>
          `<div class="dropdown-item" onclick="pilihRekomendasi('${i.nama}', ${i.harga})">${i.nama} <span style="float:right">Rp ${i.harga.toLocaleString()}</span></div>`,
      )
      .join("");
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
}

function pilihRekomendasi(n, h) {
  document.getElementById("inputCariSatuan").value = n;
  tempItem = { nama: n, harga: h };
  document.getElementById("dropdownRekomendasi").style.display = "none";
}

function tambahItemManual() {
  if (tempItem) {
    itemSatuanTerpilih.push(tempItem);
    document.getElementById("inputCariSatuan").value = "";
    tempItem = null;
    renderCart();
    updateKalkulator();
  }
}

function renderCart() {
  document.getElementById("listSatuan").innerHTML = itemSatuanTerpilih
    .map(
      (item, i) => `
        <li style="display:flex; justify-content:space-between; padding:10px; background:white; border-radius:10px; margin-top:10px;">
            ${item.nama} <i class="fas fa-trash" onclick="hapusItem(${i})" style="color:red; cursor:pointer"></i>
        </li>`,
    )
    .join("");
}

function hapusItem(i) {
  itemSatuanTerpilih.splice(i, 1);
  renderCart();
  updateKalkulator();
}

function updateKalkulator() {
  const kg = parseFloat(document.getElementById("inputKg").value) || 0;
  const hKg = parseInt(document.getElementById("selectLayanan").value);
  const totKg = kg * hKg;
  document.getElementById("resKiloan").innerText =
    "Rp " + totKg.toLocaleString();

  let totSat = 0;
  itemSatuanTerpilih.forEach((i) => (totSat += i.harga));
  document.getElementById("resSatuan").innerText =
    "Rp " + totSat.toLocaleString();

  const d = parseFloat(document.getElementById("inputJarak").value) || 0;
  const ong = d > 2 ? 10000 : 0;
  document.getElementById("resOngkir").innerText = "Rp " + ong.toLocaleString();

  const grand = totKg + totSat + ong;
  document.getElementById("grandTotal").innerText =
    "Rp " + grand.toLocaleString();
}

// GPS
function getLokasiPelanggan() {
  const s = document.getElementById("statusLokasi");
  if (!navigator.geolocation) return;
  s.innerText = "📍 Melacak...";
  navigator.geolocation.getCurrentPosition((p) => {
    const R = 6371;
    const lat1 = p.coords.latitude,
      lon1 = p.coords.longitude;
    const dLat = ((LAUNDRY_LAT - lat1) * Math.PI) / 180;
    const dLon = ((LAUNDRY_LON - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((LAUNDRY_LAT * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    document.getElementById("inputJarak").value = d.toFixed(1);
    s.innerText = "✅ Selesai";
    updateKalkulator();
  });
}

// REVEAL ANIMATION
const observer = new IntersectionObserver(
  (ents) => {
    ents.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("active");
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

function pesanWA() {
  const t = document.getElementById("grandTotal").innerText;
  window.open(
    `https://wa.me/6282342240701?text=Halo Honey Laundry, estimasi biaya saya ${t}.`,
    "_blank",
  );
}

// LISTENERS
document.getElementById("inputKg").addEventListener("input", updateKalkulator);
document
  .getElementById("selectLayanan")
  .addEventListener("change", updateKalkulator);
document
  .getElementById("inputJarak")
  .addEventListener("input", updateKalkulator);
window.onclick = (e) => {
  if (!e.target.matches("#inputCariSatuan"))
    document.getElementById("dropdownRekomendasi").style.display = "none";
};
