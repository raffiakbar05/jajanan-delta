// Data produk
const products = {
    'Kue Lumpur': { price: 23000, image: 'asset/kue_lumpur.jpeg', location: 'Sidoarjo' },
    'Kerupuk Udang': { price: 15000, image: 'asset/kerupuk_udang.jpg', location: 'Sidoarjo' },
    'Kerupuk Bandeng': { price: 18000, image: 'asset/kerupuk_bandeng.jpg', location: 'Sidoarjo' },
    'Kupang Lontong': { price: 27000, image: 'asset/kupang_lontong.jpeg', location: 'Surabaya' },
    'Bandeng Presto': { price: 42000, image: 'asset/Bandeng-Presto.jpg', location: 'Sidoarjo' },
    'Bandeng Asap': { price: 50000, image: 'asset/bandeng_asap_duri_keras.jpg', location: 'Sidoarjo' },
    'Ote-ote Porong': { price: 25000, image: 'asset/ote-ote-porong.jpg', location: 'Porong' },
    'Kue Lumpur Lapindo': { price: 10000, image: 'asset/kue_lumpur_lapindo.jpg', location: 'Sidoarjo' },
    'Sate Kerang': { price: 25000, image: 'asset/sate_kerang.jpg', location: 'Sidoarjo' },
    'Telur Asin': { price: 20000, image: 'asset/telur_asin.jpeg', location: 'Tanggulangin' },
    'Petis Udang': { price: 18000, image: 'asset/petis_udang.jpeg', location: 'Sidoarjo' },
    'Kue Sus Merdeka': { price: 14000, image: 'asset/kue_sus.jpg', location: 'Sidoarjo' }
};

let currentProduct = null;
let quantity = 1;
let currentShippingCost = 0;

// Data ongkir berdasarkan kota
const shippingRates = {
    'sidoarjo': 5000,
    'surabaya': 8000,
    'malang': 12000,
    'kediri': 15000,
    'madiun': 18000,
    'jombang': 10000,
    'mojokerto': 8000,
    'gresik': 10000,
    'lamongan': 12000,
    'tuban': 15000,
    'bojonegoro': 18000,
    'ngawi': 20000,
    'magetan': 20000,
    'ponorogo': 22000,
    'pacitan': 25000,
    'trenggalek': 25000,
    'tulungagung': 20000,
    'blitar': 18000,
    'batu': 15000,
    'pasuruan': 12000,
    'probolinggo': 15000,
    'lumajang': 18000,
    'jember': 20000,
    'bondowoso': 22000,
    'situbondo': 25000,
    'banyuwangi': 28000,
    'jakarta': 25000,
    'bandung': 30000,
    'semarang': 20000,
    'yogyakarta': 22000,
    'solo': 18000,
    'denpasar': 35000
};

// Fungsi untuk format rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Fungsi untuk mengubah quantity
function changeQuantity(change) {
    quantity = Math.max(1, quantity + change);
    document.getElementById('quantity').textContent = quantity;
    updateTotal();
}

// Fungsi untuk update total
function updateTotal() {
    if (currentProduct) {
        const subtotal = currentProduct.price * quantity;
        const total = subtotal + currentShippingCost;
        
        document.getElementById('subtotal').textContent = formatRupiah(subtotal);
        
        if (currentShippingCost > 0) {
            document.getElementById('shipping').textContent = formatRupiah(currentShippingCost);
            document.getElementById('finalTotal').textContent = formatRupiah(total);
        } else {
            document.getElementById('shipping').textContent = '-';
            document.getElementById('finalTotal').textContent = formatRupiah(subtotal) + ' + Ongkir';
        }
    }
}

// Fungsi untuk menghitung ongkir berdasarkan kota
function calculateShipping(city) {
    if (!city) {
        currentShippingCost = 0;
        updateTotal();
        return currentShippingCost;
    }
    
    const cityKey = city.toLowerCase().trim();
    currentShippingCost = shippingRates[cityKey] || 15000; // Default untuk kota yang tidak terdaftar
    updateTotal();
    return currentShippingCost;
}

// Fungsi untuk set produk yang dipilih
function setSelectedProduct(productName) {
    if (products[productName]) {
        currentProduct = products[productName];
        currentProduct.name = productName;
        
        // Update UI
        document.getElementById('productImage').src = currentProduct.image;
        document.getElementById('productImage').alt = productName;
        document.getElementById('productName').textContent = productName;
        document.getElementById('productLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>${currentProduct.location}</span>`;
        document.getElementById('productPrice').textContent = formatRupiah(currentProduct.price);
        
        // Reset quantity
        quantity = 1;
        document.getElementById('quantity').textContent = quantity;
        
        updateTotal();
    }
}

let orderData = {};

// Fungsi untuk handle form submission
document.getElementById('purchaseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentProduct) {
        alert('Silakan pilih produk terlebih dahulu!');
        return;
    }
    
    // Ambil data form
    const formData = new FormData(this);
    const customerData = {
        name: formData.get('customerName'),
        phone: formData.get('customerPhone'),
        email: formData.get('customerEmail'),
        address: formData.get('customerAddress'),
        city: formData.get('customerCity'),
        notes: formData.get('customerNotes'),
        paymentMethod: formData.get('paymentMethod')
    };
    
    // Validasi wajib untuk alamat dan kota
    if (!customerData.address || customerData.address.trim() === '') {
        alert('Alamat lengkap wajib diisi!');
        document.getElementById('customerAddress').focus();
        return;
    }
    
    if (!customerData.city || customerData.city.trim() === '') {
        alert('Kota wajib diisi!');
        document.getElementById('customerCity').focus();
        return;
    }
    
    // Hitung ulang ongkir berdasarkan kota yang diisi
    calculateShipping(customerData.city);
    
    // Validasi ongkir sudah dihitung
    if (currentShippingCost === 0) {
        alert('Silakan isi kota terlebih dahulu untuk menghitung ongkir!');
        document.getElementById('customerCity').focus();
        return;
    }
    
    // Simpan data untuk modal
    const subtotal = currentProduct.price * quantity;
    const total = subtotal + currentShippingCost;
    
    orderData = {
        product: currentProduct,
        quantity: quantity,
        subtotal: subtotal,
        shipping: currentShippingCost,
        total: total,
        customer: customerData
    };
    
    // Tampilkan modal konfirmasi
    showConfirmationModal();
});

// Fungsi untuk menampilkan modal konfirmasi
function showConfirmationModal() {
    document.getElementById('modalProductName').textContent = orderData.product.name;
    document.getElementById('modalQuantity').textContent = orderData.quantity + ' pcs';
    document.getElementById('modalTotal').textContent = formatRupiah(orderData.total);
    document.getElementById('modalCustomerName').textContent = orderData.customer.name;
    document.getElementById('modalCustomerPhone').textContent = orderData.customer.phone;
    
    // Tambahkan info ongkir jika ada
    const modalBody = document.querySelector('#confirmationModal .modal-body');
    const existingShipping = modalBody.querySelector('.shipping-detail');
    if (existingShipping) {
        existingShipping.remove();
    }
    
    if (orderData.shipping > 0) {
        const shippingDetail = document.createElement('div');
        shippingDetail.className = 'shipping-detail';
        shippingDetail.innerHTML = `
            <div class="summary-item">
                <span>Ongkir ke ${orderData.customer.city}:</span>
                <span>${formatRupiah(orderData.shipping)}</span>
            </div>
        `;
        modalBody.querySelector('.order-summary').appendChild(shippingDetail);
    }
    
    document.getElementById('confirmationModal').style.display = 'block';
}

// Fungsi untuk menutup modal
function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'none';
}

// Fungsi untuk konfirmasi pesanan
function confirmOrder() {
    // Tutup modal konfirmasi
    closeModal();
    
    // Tampilkan modal sukses langsung
    setTimeout(() => {
        document.getElementById('successModal').style.display = 'block';
    }, 300);
    
    // Reset form
    resetForm();
}

// Fungsi untuk reset form
function resetForm() {
    document.getElementById('purchaseForm').reset();
    currentProduct = null;
    quantity = 1;
    document.getElementById('productName').textContent = 'Pilih Produk';
    document.getElementById('productLocation').innerHTML = '<i class="fas fa-map-marker-alt"></i> <span>-</span>';
    document.getElementById('productPrice').textContent = 'Rp 0';
    document.getElementById('productImage').src = '';
    document.getElementById('quantity').textContent = '1';
    document.getElementById('subtotal').textContent = 'Rp 0';
    document.getElementById('shipping').textContent = '-';
    document.getElementById('finalTotal').textContent = 'Rp 0 + Ongkir';
}

// Fungsi untuk lanjut belanja
function continueShopping() {
    closeModal();
    window.location.href = 'produk.html';
}

// Fungsi untuk kembali ke beranda
function goToHome() {
    closeModal();
    window.location.href = 'beranda.html';
}

// Tutup modal jika klik di luar modal
window.onclick = function(event) {
    const confirmationModal = document.getElementById('confirmationModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === confirmationModal) {
        closeModal();
    }
    if (event.target === successModal) {
        closeModal();
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah ada produk yang dipilih dari URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const selectedProduct = urlParams.get('product');
    
    if (selectedProduct && products[selectedProduct]) {
        setSelectedProduct(selectedProduct);
    }
    
    // Set initial shipping cost
    document.getElementById('shipping').textContent = '-';
    document.getElementById('finalTotal').textContent = 'Rp 0 + Ongkir';
    
    // Event listener untuk input kota
    const cityInput = document.getElementById('customerCity');
    if (cityInput) {
        cityInput.addEventListener('blur', function() {
            const city = this.value.trim();
            if (city) {
                calculateShipping(city);
            }
        });
        
        cityInput.addEventListener('input', function() {
            const city = this.value.trim();
            if (city) {
                calculateShipping(city);
            }
        });
    }
});

// Export fungsi untuk digunakan di halaman lain
window.setSelectedProduct = setSelectedProduct;