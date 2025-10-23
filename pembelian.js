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
const shippingCost = 10000;

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
        const total = subtotal + shippingCost;
        
        document.getElementById('subtotal').textContent = formatRupiah(subtotal);
        document.getElementById('finalTotal').textContent = formatRupiah(total);
    }
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
    
    // Simpan data untuk modal
    const subtotal = currentProduct.price * quantity;
    const total = subtotal + shippingCost;
    
    orderData = {
        product: currentProduct,
        quantity: quantity,
        subtotal: subtotal,
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
    document.getElementById('finalTotal').textContent = formatRupiah(shippingCost);
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
    document.getElementById('shipping').textContent = formatRupiah(shippingCost);
    document.getElementById('finalTotal').textContent = formatRupiah(shippingCost);
});

// Export fungsi untuk digunakan di halaman lain
window.setSelectedProduct = setSelectedProduct;