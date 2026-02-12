// --- DATABASE LENGKAP SATUAN ---
const dbSatuan = [
  { nama: "Jaket Kulit", harga: 50000 },
  { nama: "Jas Pria/Wanita", harga: 35000 },
  { nama: "Jas Set", harga: 65000 },
  { nama: "Jaket Non Kulit", harga: 25000 },
  { nama: "Kaos T-Shirt", harga: 15000 },
  { nama: "Kebaya", harga: 15000 },
  { nama: "Kemeja Batik", harga: 25000 },
  { nama: "Kemeja", harga: 20000 },
  { nama: "Polo", harga: 20000 },
  { nama: "Bra", harga: 10000 },
  { nama: "Celana Pendek", harga: 15000 },
  { nama: "Celana Panjang", harga: 20000 },
  { nama: "Lingerie", harga: 20000 },
  { nama: "Rok Pendek", harga: 15000 },
  { nama: "Rok Panjang", harga: 20000 },
  { nama: "Kamen / Songket", harga: 15000 },
  { nama: "Udeng", harga: 15000 },
  { nama: "Selendang", harga: 10000 },
  { nama: "Mukena", harga: 25000 },
  { nama: "Hijab", harga: 20000 },
  { nama: "Sajadah", harga: 25000 },
  { nama: "Guling", harga: 20000 },
  { nama: "Bantal Jumbo", harga: 30000 },
  { nama: "Bantal Leher", harga: 10000 },
  { nama: "Bantal Sofa", harga: 15000 },
  { nama: "Bantal Standar", harga: 20000 },
  { nama: "Bed Cover Kecil", harga: 20000 },
  { nama: "Bed Cover Sedang", harga: 30000 },
  { nama: "Bed Cover Besar", harga: 40000 },
  { nama: "Selimut Tipis", harga: 10000 },
  { nama: "Selimut Tebal", harga: 25000 },
  { nama: "Sprei", harga: 10000 },
  { nama: "Set Sprei", harga: 15000 },
];

let itemSatuanTerpilih = [];
let tempItem = null;
const LAUNDRY_LAT = -8.6617;
const LAUNDRY_LON = 115.2285;

// Render Tabel di Awal
function initTabel() {
  const body = document.getElementById("bodySatuan");
  body.innerHTML = dbSatuan
    .map(
      (i) => `<tr><td>${i.nama}</td><td>${i.harga.toLocaleString()}</td></tr>`,
    )
    .join("");
}
initTabel();

// Filter Search Tabel
function filterTabelHarga() {
  const q = document.getElementById("searchPricelist").value.toLowerCase();
  const rows = document.querySelectorAll("#tableSatuan tbody tr");
  rows.forEach(
    (r) =>
      (r.style.display = r.innerText.toLowerCase().includes(q) ? "" : "none"),
  );
}

// Autocomplete Logic
function filterDropdownSatuan() {
  const input = document.getElementById("inputCariSatuan");
  const filter = input.value.toLowerCase();
  const dropdown = document.getElementById("dropdownRekomendasi");
  if (!filter) {
    dropdown.style.display = "none";
    return;
  }
  const matches = dbSatuan.filter((item) =>
    item.nama.toLowerCase().includes(filter),
  );
  if (matches.length > 0) {
    dropdown.innerHTML = matches
      .map(
        (item) =>
          `<div class="dropdown-item" onclick="pilihRekomendasi('${item.nama}', ${item.harga})">${item.nama} <span style="float:right">Rp ${item.harga.toLocaleString()}</span></div>`,
      )
      .join("");
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
}

function pilihRekomendasi(nama, harga) {
  document.getElementById("inputCariSatuan").value = nama;
  tempItem = { nama, harga };
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
  const list = document.getElementById("listSatuan");
  list.innerHTML = itemSatuanTerpilih
    .map(
      (item, i) =>
        `<li>${item.nama} <i class="fas fa-trash" onclick="hapusItem(${i})" style="color:red; cursor:pointer"></i></li>`,
    )
    .join("");
}

function hapusItem(i) {
  itemSatuanTerpilih.splice(i, 1);
  renderCart();
  updateKalkulator();
}

// Kalkulasi Utama
function updateKalkulator() {
  const kg = parseFloat(document.getElementById("inputKg").value) || 0;
  const hargaKiloan = parseInt(document.getElementById("selectLayanan").value);
  const totalKiloan = kg * hargaKiloan;
  document.getElementById("resKiloan").innerText =
    "Rp " + totalKiloan.toLocaleString();

  let totalSatuan = 0;
  itemSatuanTerpilih.forEach((item) => (totalSatuan += item.harga));
  document.getElementById("resSatuan").innerText =
    "Rp " + totalSatuan.toLocaleString();

  const d = parseFloat(document.getElementById("inputJarak").value) || 0;
  const ongkir = d > 2 ? 10000 : 0;
  document.getElementById("resOngkir").innerText =
    "Rp " + ongkir.toLocaleString();

  const grand = totalKiloan + totalSatuan + ongkir;
  document.getElementById("grandTotal").innerText =
    "Rp " + grand.toLocaleString();
}

// GPS Logic
function getLokasiPelanggan() {
  const status = document.getElementById("statusLokasi");
  if (!navigator.geolocation) return;
  status.innerText = "📍 Melacak...";
  navigator.geolocation.getCurrentPosition((pos) => {
    const R = 6371;
    const lat1 = pos.coords.latitude,
      lon1 = pos.coords.longitude;
    const dLat = ((LAUNDRY_LAT - lat1) * Math.PI) / 180;
    const dLon = ((LAUNDRY_LON - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((LAUNDRY_LAT * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    document.getElementById("inputJarak").value = d.toFixed(1);
    status.innerText = "✅ Berhasil melacak";
    updateKalkulator();
  });
}

// Reveal Animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("active");
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

function pesanWA() {
  const total = document.getElementById("grandTotal").innerText;
  window.open(
    `https://wa.me/6282342240701?text=Halo Honey Laundry, estimasi biaya saya: ${total}`,
    "_blank",
  );
}

// Listeners
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
