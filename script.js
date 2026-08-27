/* =====================================================
   Pharmacy Manager V2
   نظام إدارة الصيدلية
   يعمل محلياً باستخدام LocalStorage
===================================================== */


/* =====================================================
   البيانات
===================================================== */

let medicines =
    JSON.parse(
        localStorage.getItem("pharmacy_medicines")
    ) || [];

let sales =
    JSON.parse(
        localStorage.getItem("pharmacy_sales")
    ) || [];

let settings =
    JSON.parse(
        localStorage.getItem("pharmacy_settings")
    ) || {

        pharmacyName: "صيدليتي",

        ownerName: "",

        currency: "XAF"

    };


let currentMedicineFilter = "all";


/* =====================================================
   تشغيل التطبيق
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSettings();

        loadDarkMode();

        setDefaultReportDates();

        updateDashboard();

        renderMedicines();

        renderSales();

        updateSaleMedicineList();

        renderTopMedicines();

        setupEvents();

    }
);


/* =====================================================
   الأحداث
===================================================== */

function setupEvents() {


    const medicineForm =
        document.getElementById(
            "medicineForm"
        );


    if (medicineForm) {

        medicineForm.addEventListener(
            "submit",
            saveMedicine
        );

    }


    const saleForm =
        document.getElementById(
            "saleForm"
        );


    if (saleForm) {

        saleForm.addEventListener(
            "submit",
            registerSale
        );

    }


    const stockForm =
        document.getElementById(
            "stockForm"
        );


    if (stockForm) {

        stockForm.addEventListener(
            "submit",
            addStock
        );

    }


    const search =
        document.getElementById(
            "medicineSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            function () {

                renderMedicines(
                    this.value
                );

            }
        );

    }


    const saleMedicine =
        document.getElementById(
            "saleMedicine"
        );


    const saleQuantity =
        document.getElementById(
            "saleQuantity"
        );


    if (saleMedicine) {

        saleMedicine.addEventListener(
            "change",
            updateSalePreview
        );

    }


    if (saleQuantity) {

        saleQuantity.addEventListener(
            "input",
            updateSalePreview
        );

    }


    const backupFile =
        document.getElementById(
            "backupFile"
        );


    if (backupFile) {

        backupFile.addEventListener(
            "change",
            importBackup
        );

    }


    const darkButton =
        document.getElementById(
            "darkModeBtn"
        );


    if (darkButton) {

        darkButton.addEventListener(
            "click",
            toggleDarkMode
        );

    }

}


/* =====================================================
   حفظ البيانات
===================================================== */

function saveMedicines() {

    localStorage.setItem(
        "pharmacy_medicines",
        JSON.stringify(medicines)
    );

}


function saveSales() {

    localStorage.setItem(
        "pharmacy_sales",
        JSON.stringify(sales)
    );

}


function saveSettingsData() {

    localStorage.setItem(
        "pharmacy_settings",
        JSON.stringify(settings)
    );

}


/* =====================================================
   التنقل
===================================================== */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.remove(
                    "active"
                )
        );


    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );


                if (
                    button.dataset.page ===
                    pageId
                ) {

                    button.classList.add(
                        "active"
                    );

                }

            }
        );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   نافذة إضافة / تعديل دواء
===================================================== */

function openMedicineModal(
    id = null
) {

    const modal =
        document.getElementById(
            "medicineModal"
        );


    const form =
        document.getElementById(
            "medicineForm"
        );


    if (!modal || !form) return;


    form.reset();


    document.getElementById(
        "medicineId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "إضافة دواء";


    document.getElementById(
        "medicineMinStock"
    ).value = 10;


    if (id !== null) {

        const medicine =
            medicines.find(
                item =>
                    item.id === id
            );


        if (!medicine) return;


        document.getElementById(
            "modalTitle"
        ).textContent =
            "تعديل الدواء";


        document.getElementById(
            "medicineId"
        ).value =
            medicine.id;


        document.getElementById(
            "medicineName"
        ).value =
            medicine.name || "";


        document.getElementById(
            "medicineQuantity"
        ).value =
            medicine.quantity ?? 0;


        document.getElementById(
            "medicinePrice"
        ).value =
            medicine.price ?? 0;


        document.getElementById(
            "medicineExpiry"
        ).value =
            medicine.expiry || "";


        document.getElementById(
            "medicineCompany"
        ).value =
            medicine.company || "";


        document.getElementById(
            "medicineMinStock"
        ).value =
            medicine.minStock ?? 10;

    }


    modal.classList.add(
        "show"
    );

}


function closeMedicineModal() {

    const modal =
        document.getElementById(
            "medicineModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   حفظ الدواء
===================================================== */

function saveMedicine(
    event
) {

    event.preventDefault();


    const id =
        document.getElementById(
            "medicineId"
        ).value;


    const name =
        document.getElementById(
            "medicineName"
        ).value.trim();


    const quantity =
        Number(
            document.getElementById(
                "medicineQuantity"
            ).value
        );


    const price =
        Number(
            document.getElementById(
                "medicinePrice"
            ).value
        );


    const expiry =
        document.getElementById(
            "medicineExpiry"
        ).value;


    const company =
        document.getElementById(
            "medicineCompany"
        ).value.trim();


    const minStock =
        Number(
            document.getElementById(
                "medicineMinStock"
            ).value
        );


    if (!name) {

        alert(
            "يرجى إدخال اسم الدواء."
        );

        return;

    }


    if (
        quantity < 0 ||
        !Number.isFinite(quantity)
    ) {

        alert(
            "أدخل كمية صحيحة."
        );

        return;

    }


    if (
        price < 0 ||
        !Number.isFinite(price)
    ) {

        alert(
            "أدخل سعراً صحيحاً."
        );

        return;

    }


    if (
        minStock < 0 ||
        !Number.isFinite(minStock)
    ) {

        alert(
            "أدخل حداً أدنى صحيحاً للمخزون."
        );

        return;

    }


    const medicineData = {

        name,

        quantity,

        price,

        expiry,

        company,

        minStock

    };


    /* تعديل */

    if (id) {

        const index =
            medicines.findIndex(
                item =>
                    item.id === id
            );


        if (index !== -1) {

            medicines[index] = {

                ...medicines[index],

                ...medicineData,

                updatedAt:
                    new Date().toISOString()

            };

        }

    }


    /* إضافة */

    else {

        medicines.unshift({

            id:
                createId(),

            ...medicineData,

            createdAt:
                new Date().toISOString()

        });

    }


    saveMedicines();

    closeMedicineModal();

    updateDashboard();

    renderMedicines();

    updateSaleMedicineList();

    renderTopMedicines();


    alert(
        "تم حفظ الدواء بنجاح ✅"
    );

}


/* =====================================================
   حذف دواء
===================================================== */

function deleteMedicine(
    id
) {

    const medicine =
        medicines.find(
            item =>
                item.id === id
        );


    if (!medicine) return;


    const confirmed =
        confirm(
            `هل تريد حذف "${medicine.name}"؟`
        );


    if (!confirmed) return;


    medicines =
        medicines.filter(
            item =>
                item.id !== id
        );


    saveMedicines();

    updateDashboard();

    renderMedicines();

    updateSaleMedicineList();

    renderTopMedicines();

}


/* =====================================================
   عرض الأدوية
===================================================== */

function renderMedicines(
    search = ""
) {

    const container =
        document.getElementById(
            "medicinesContainer"
        );


    if (!container) return;


    const query =
        String(search)
            .trim()
            .toLowerCase();


    let filtered =
        medicines.filter(
            medicine => {

                const name =
                    String(
                        medicine.name || ""
                    ).toLowerCase();


                const company =
                    String(
                        medicine.company || ""
                    ).toLowerCase();


                const matchesSearch =
                    name.includes(query) ||
                    company.includes(query);


                const matchesFilter =
                    medicineMatchesFilter(
                        medicine,
                        currentMedicineFilter
                    );


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty">
                💊 لا توجد أدوية مطابقة.
            </div>
        `;

        return;

    }


    container.innerHTML =
        filtered
            .map(
                medicine => {

                    const status =
                        getMedicineStatus(
                            medicine
                        );


                    const expiryText =
                        medicine.expiry
                            ? formatDate(
                                medicine.expiry
                            )
                            : "غير محدد";


                    const companyText =
                        medicine.company
                            ? escapeHTML(
                                medicine.company
                            )
                            : "الشركة غير محددة";


                    return `

                    <div class="medicine-card">

                        <h3>
                            💊
                            ${escapeHTML(
                                medicine.name
                            )}
                        </h3>

                        <div class="medicine-company">
                            ${companyText}
                        </div>


                        <div class="medicine-info">

                            <div>
                                <span>
                                    الكمية
                                </span>

                                <strong>
                                    ${medicine.quantity}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    السعر
                                </span>

                                <strong>
                                    ${formatMoney(
                                        medicine.price
                                    )}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    الانتهاء
                                </span>

                                <strong>
                                    ${expiryText}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    الحالة
                                </span>

                                <span
                                    class="status ${status.class}">

                                    ${status.text}

                                </span>

                            </div>

                        </div>


                        <div class="card-actions">

                            <button
                                class="stock"
                                onclick="openStockModal('${medicine.id}')">

                                📦 مخزون

                            </button>


                            <button
                                class="sell"
                                onclick="quickSell('${medicine.id}')">

                                💰 بيع

                            </button>


                            <button
                                class="edit"
                                onclick="openMedicineModal('${medicine.id}')">

                                ✏️ تعديل

                            </button>


                            <button
                                class="delete"
                                onclick="deleteMedicine('${medicine.id}')">

                                🗑️ حذف

                            </button>

                        </div>

                    </div>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   فلترة الأدوية
===================================================== */

function setMedicineFilter(
    filter
) {

    currentMedicineFilter =
        filter;


    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.filter ===
                    filter
                );

            }
        );


    const search =
        document.getElementById(
            "medicineSearch"
        );


    renderMedicines(
        search
            ? search.value
            : ""
    );

}


function medicineMatchesFilter(
    medicine,
    filter
) {

    if (filter === "all") {

        return true;

    }


    const status =
        getMedicineStatus(
            medicine
        );


    if (filter === "available") {

        return (
            medicine.quantity > 0 &&
            status.class === "available"
        );

    }


    if (filter === "low") {

        return (
            medicine.quantity > 0 &&
            medicine.quantity <=
                medicine.minStock
        );

    }


    if (filter === "expired") {

        return (
            getExpiryState(
                medicine.expiry
            ) === "expired"
        );

    }


    if (filter === "expiring") {

        return (
            getExpiryState(
                medicine.expiry
            ) === "expiring"
        );

    }


    return true;

}


/* =====================================================
   حالة الدواء
===================================================== */

function getMedicineStatus(
    medicine
) {

    const expiryState =
        getExpiryState(
            medicine.expiry
        );


    if (
        expiryState === "expired"
    ) {

        return {

            class: "expired",

            text: "منتهي الصلاحية"

        };

    }


    if (
        medicine.quantity <= 0
    ) {

        return {

            class: "empty",

            text: "غير متوفر"

        };

    }


    if (
        medicine.quantity <=
        medicine.minStock
    ) {

        return {

            class: "low",

            text: "مخزون منخفض"

        };

    }


    if (
        expiryState === "expiring"
    ) {

        return {

            class: "expiring",

            text: "قرب الانتهاء"

        };

    }


    return {

        class: "available",

        text: "متوفر"

    };

}


/* =====================================================
   الصلاحية
===================================================== */

function daysUntilExpiry(
    expiry
) {

    if (!expiry) return null;


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const date =
        new Date(
            expiry +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    const difference =
        date.getTime() -
        today.getTime();


    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );

}


function getExpiryState(
    expiry
) {

    const days =
        daysUntilExpiry(
            expiry
        );


    if (days === null) {

        return "none";

    }


    if (days < 0) {

        return "expired";

    }


    if (days <= 30) {

        return "expiring";

    }


    return "valid";

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const totalMedicines =
        medicines.length;


    const totalStock =
        medicines.reduce(
            (
                total,
                medicine
            ) =>
                total +
                Number(
                    medicine.quantity
                ),

            0
        );


    const lowStock =
        medicines.filter(
            medicine =>
                medicine.quantity > 0 &&
                medicine.quantity <=
                    medicine.minStock
        ).length;


    const expiringSoon =
        medicines.filter(
            medicine =>
                getExpiryState(
                    medicine.expiry
                ) === "expiring"
        ).length;


    const expired =
        medicines.filter(
            medicine =>
                getExpiryState(
                    medicine.expiry
                ) === "expired"
        ).length;


    const stockValue =
        medicines.reduce(
            (
                total,
                medicine
            ) =>
                total +
                (
                    Number(
                        medicine.quantity
                    ) *
                    Number(
                        medicine.price
                    )
                ),

            0
        );


    setText(
        "totalMedicines",
        totalMedicines
    );


    setText(
        "totalStock",
        totalStock
    );


    setText(
        "lowStock",
        lowStock
    );


    setText(
        "expiringSoon",
        expiringSoon
    );


    setText(
        "expiredMedicines",
        expired
    );


    setText(
        "todaySales",
        formatMoney(
            getTodaySales()
        )
    );


    setText(
        "monthSales",
        formatMoney(
            getCurrentMonthSales()
        )
    );


    setText(
        "stockValue",
        formatMoney(
            stockValue
        )
    );


    renderRecentMedicines();

    renderAlerts();

    updateSalesSummary();

    renderTopMedicines();

}


/* =====================================================
   آخر الأدوية
===================================================== */

function renderRecentMedicines() {

    const container =
        document.getElementById(
            "recentMedicines"
        );


    if (!container) return;


    const recent =
        medicines.slice(
            0,
            5
        );


    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty">
                لا توجد أدوية مضافة بعد.
            </div>
        `;

        return;

    }


    container.innerHTML =
        recent
            .map(
                medicine => `

                <div class="recent-item">

                    <div>

                        <strong>
                            💊
                            ${escapeHTML(
                                medicine.name
                            )}
                        </strong>

                        <small>
                            الكمية:
                            ${medicine.quantity}
                        </small>

                    </div>

                    <strong>
                        ${formatMoney(
                            medicine.price
                        )}
                    </strong>

                </div>

                `
            )
            .join("");

}


/* =====================================================
   التنبيهات
===================================================== */

function renderAlerts() {

    const container =
        document.getElementById(
            "alertsContainer"
        );


    if (!container) return;


    const alerts = [];


    medicines.forEach(
        medicine => {

            const name =
                escapeHTML(
                    medicine.name
                );


            if (
                medicine.quantity <= 0
            ) {

                alerts.push({

                    type: "danger",

                    text:
                        `🔴 ${name} غير متوفر في المخزون.`

                });

            }


            else if (
                medicine.quantity <=
                medicine.minStock
            ) {

                alerts.push({

                    type: "warning",

                    text:
                        `🟠 ${name} مخزونه منخفض (${medicine.quantity}).`

                });

            }


            const days =
                daysUntilExpiry(
                    medicine.expiry
                );


            if (
                days !== null &&
                days < 0
            ) {

                alerts.push({

                    type: "danger",

                    text:
                        `⛔ ${name} انتهت صلاحيته.`

                });

            }


            else if (
                days !== null &&
                days >= 0 &&
                days <= 30
            ) {

                alerts.push({

                    type: "danger",

                    text:
                        `⚠️ ${name} سينتهي خلال ${days} يوم.`

                });

            }

        }
    );


    if (alerts.length === 0) {

        container.innerHTML = `
            <div class="empty">
                ✅ لا توجد تنبيهات حالياً.
            </div>
        `;

        return;

    }


    container.innerHTML =
        alerts
            .map(
                alert => `

                <div
                    class="alert-item ${alert.type}">

                    ${alert.text}

                </div>

                `
            )
            .join("");

}


/* =====================================================
   المخزون
===================================================== */

function openStockModal(
    id
) {

    const medicine =
        medicines.find(
            item =>
                item.id === id
        );


    if (!medicine) return;


    document.getElementById(
        "stockMedicineId"
    ).value =
        medicine.id;


    document.getElementById(
        "stockMedicineName"
    ).textContent =
        medicine.name;


    document.getElementById(
        "currentStock"
    ).textContent =
        medicine.quantity;


    document.getElementById(
        "stockQuantity"
    ).value = 1;


    document.getElementById(
        "stockModal"
    ).classList.add(
        "show"
    );

}


function closeStockModal() {

    document.getElementById(
        "stockModal"
    ).classList.remove(
        "show"
    );

}


function addStock(
    event
) {

    event.preventDefault();


    const id =
        document.getElementById(
            "stockMedicineId"
        ).value;


    const quantity =
        Number(
            document.getElementById(
                "stockQuantity"
            ).value
        );


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        alert(
            "أدخل كمية صحيحة."
        );

        return;

    }


    const medicine =
        medicines.find(
            item =>
                item.id === id
        );


    if (!medicine) {

        alert(
            "الدواء غير موجود."
        );

        return;

    }


    medicine.quantity +=
        quantity;


    medicine.updatedAt =
        new Date().toISOString();


    saveMedicines();

    closeStockModal();

    updateDashboard();

    renderMedicines();

    updateSaleMedicineList();


    alert(
        `تمت إضافة ${quantity} إلى مخزون ${medicine.name} ✅`
    );

}


/* =====================================================
   بيع سريع
===================================================== */

function quickSell(
    id
) {

    const medicine =
        medicines.find(
            item =>
                item.id === id
        );


    if (!medicine) return;


    if (
        medicine.quantity <= 0
    ) {

        alert(
            "هذا الدواء غير متوفر في المخزون."
        );

        return;

    }


    showPage(
        "salesSection"
    );


    const select =
        document.getElementById(
            "saleMedicine"
        );


    if (select) {

        select.value =
            medicine.id;

        updateSalePreview();

    }


    const quantity =
        document.getElementById(
            "saleQuantity"
        );


    if (quantity) {

        quantity.focus();

    }

}


/* =====================================================
   قائمة أدوية البيع
===================================================== */

function updateSaleMedicineList() {

    const select =
        document.getElementById(
            "saleMedicine"
        );


    if (!select) return;


    const current =
        select.value;


    select.innerHTML = `
        <option value="">
            اختر الدواء
        </option>
    `;


    medicines
        .filter(
            medicine =>
                medicine.quantity > 0 &&
                getExpiryState(
                    medicine.expiry
                ) !== "expired"
        )
        .forEach(
            medicine => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    medicine.id;


                option.textContent =
                    `${medicine.name} — المتوفر: ${medicine.quantity} — ${formatMoney(medicine.price)}`;


                select.appendChild(
                    option
                );

            }
        );


    if (
        medicines.some(
            medicine =>
                medicine.id === current &&
                medicine.quantity > 0
        )
    ) {

        select.value =
            current;

    }


    updateSalePreview();

}


/* =====================================================
   معاينة البيع
===================================================== */

function updateSalePreview() {

    const select =
        document.getElementById(
            "saleMedicine"
        );


    const quantityInput =
        document.getElementById(
            "saleQuantity"
        );


    const preview =
        document.getElementById(
            "salePreview"
        );


    if (
        !select ||
        !quantityInput ||
        !preview
    ) return;


    const medicine =
        medicines.find(
            item =>
                item.id ===
                select.value
        );


    if (!medicine) {

        preview.textContent =
            "اختر دواء لمعرفة إجمالي البيع";

        return;

    }


    const quantity =
        Number(
            quantityInput.value
        ) || 0;


    const total =
        medicine.price *
        quantity;


    preview.textContent =
        `💰 ${quantity} × ${formatMoney(medicine.price)} = ${formatMoney(total)}`;

}


/* =====================================================
   تسجيل البيع
===================================================== */

function registerSale(
    event
) {

    event.preventDefault();


    const medicineId =
        document.getElementById(
            "saleMedicine"
        ).value;


    const quantity =
        Number(
            document.getElementById(
                "saleQuantity"
            ).value
        );


    if (!medicineId) {

        alert(
            "اختر الدواء أولاً."
        );

        return;

    }


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        alert(
            "أدخل كمية صحيحة."
        );

        return;

    }


    const medicine =
        medicines.find(
            item =>
                item.id ===
                medicineId
        );


    if (!medicine) {

        alert(
            "الدواء غير موجود."
        );

        return;

    }


    if (
        getExpiryState(
            medicine.expiry
        ) === "expired"
    ) {

        alert(
            "لا يمكن بيع دواء منتهي الصلاحية."
        );

        return;

    }


    if (
        quantity >
        medicine.quantity
    ) {

        alert(
            "الكمية المطلوبة أكبر من المخزون."
        );

        return;

    }


    const total =
        medicine.price *
        quantity;


    medicine.quantity -=
        quantity;


    const sale = {

        id:
            createId(),

        medicineId:
            medicine.id,

        medicineName:
            medicine.name,

        quantity,

        price:
            medicine.price,

        total,

        date:
            new Date().toISOString()

    };


    sales.unshift(
        sale
    );


    saveMedicines();

    saveSales();


    event.target.reset();


    document.getElementById(
        "saleQuantity"
    ).value = 1;


    updateDashboard();

    renderMedicines();

    renderSales();

    updateSaleMedicineList();

    renderTopMedicines();


    alert(
        "تم تسجيل البيع بنجاح ✅"
    );

}


/* =====================================================
   عرض المبيعات
===================================================== */

function renderSales() {

    const container =
        document.getElementById(
            "salesList"
        );


    if (!container) return;


    if (sales.length === 0) {

        container.innerHTML = `
            <div class="empty">
                لا توجد مبيعات حتى الآن.
            </div>
        `;

        return;

    }


    container.innerHTML =
        sales
            .slice(
                0,
                50
            )
            .map(
                sale => `

                <div class="sale-item">

                    <div>

                        <strong>
                            💊
                            ${escapeHTML(
                                sale.medicineName
                            )}
                        </strong>

                        <small>
                            الكمية:
                            ${sale.quantity}
                            —
                            ${formatDateTime(
                                sale.date
                            )}
                        </small>

                    </div>

                    <strong>
                        ${formatMoney(
                            sale.total
                        )}
                    </strong>

                </div>

                `
            )
            .join("");

}


/* =====================================================
   ملخص المبيعات
===================================================== */

function updateSalesSummary() {

    const today =
        getTodayKey();


    const todaySales =
        sales.filter(
            sale =>
                getLocalDateKey(
                    sale.date
                ) === today
        );


    const total =
        todaySales.reduce(
            (
                sum,
                sale
            ) =>
                sum +
                Number(
                    sale.total
                ),

            0
        );


    const count =
        todaySales.length;


    const units =
        todaySales.reduce(
            (
                sum,
                sale
            ) =>
                sum +
                Number(
                    sale.quantity
                ),

            0
        );


    setText(
        "salesTodayTotal",
        formatMoney(total)
    );


    setText(
        "salesCount",
        count
    );


    setText(
        "salesUnitsToday",
        units
    );

}


/* =====================================================
   مبيعات اليوم
===================================================== */

function getTodaySales() {

    const today =
        getTodayKey();


    return sales
        .filter(
            sale =>
                getLocalDateKey(
                    sale.date
                ) === today
        )
        .reduce(
            (
                total,
                sale
            ) =>
                total +
                Number(
                    sale.total
                ),

            0
        );

}


/* =====================================================
   مبيعات الشهر
===================================================== */

function getCurrentMonthSales() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        now.getMonth();


    return sales
        .filter(
            sale => {

                const date =
                    new Date(
                        sale.date
                    );


                return (
                    date.getFullYear() ===
                        year &&
                    date.getMonth() ===
                        month
                );

            }
        )
        .reduce(
            (
                total,
                sale
            ) =>
                total +
                Number(
                    sale.total
                ),

            0
        );

}


/* =====================================================
   التقارير
===================================================== */

function setDefaultReportDates() {

    const from =
        document.getElementById(
            "reportFrom"
        );


    const to =
        document.getElementById(
            "reportTo"
        );


    if (!from || !to) return;


    const now =
        new Date();


    const first =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );


    from.value =
        dateToInputValue(
            first
        );


    to.value =
        dateToInputValue(
            now
        );


    generateReport();

}


function generateReport() {

    const from =
        document.getElementById(
            "reportFrom"
        ).value;


    const to =
        document.getElementById(
            "reportTo"
        ).value;


    const result =
        document.getElementById(
            "reportResult"
        );


    if (!result) return;


    if (
        !from ||
        !to
    ) {

        result.innerHTML = `
            <div class="empty">
                اختر تاريخ البداية والنهاية.
            </div>
        `;

        return;

    }


    if (from > to) {

        result.innerHTML = `
            <div class="empty">
                ⚠️ تاريخ البداية يجب أن يكون قبل تاريخ النهاية.
            </div>
        `;

        return;

    }


    const filteredSales =
        sales.filter(
            sale => {

                const date =
                    getLocalDateKey(
                        sale.date
                    );


                return (
                    date >= from &&
                    date <= to
                );

            }
        );


    const revenue =
        filteredSales.reduce(
            (
                sum,
                sale
            ) =>
                sum +
                Number(
                    sale.total
                ),

            0
        );


    const transactions =
        filteredSales.length;


    const units =
        filteredSales.reduce(
            (
                sum,
                sale
            ) =>
                sum +
                Number(
                    sale.quantity
                ),

            0
        );


    const average =
        transactions > 0
            ? revenue /
              transactions
            : 0;


    result.innerHTML = `

        <div class="report-card">

            <span>
                إجمالي المبيعات
            </span>

            <strong>
                ${formatMoney(
                    revenue
                )}
            </strong>

        </div>


        <div class="report-card">

            <span>
                عدد العمليات
            </span>

            <strong>
                ${transactions}
            </strong>

        </div>


        <div class="report-card">

            <span>
                الوحدات المباعة
            </span>

            <strong>
                ${units}
            </strong>

        </div>


        <div class="report-card">

            <span>
                متوسط العملية
            </span>

            <strong>
                ${formatMoney(
                    average
                )}
            </strong>

        </div>

    `;


    renderTopMedicines(
        filteredSales
    );

}


/* =====================================================
   أكثر الأدوية مبيعاً
===================================================== */

function renderTopMedicines(
    sourceSales = sales
) {

    const container =
        document.getElementById(
            "topMedicines"
        );


    if (!container) return;


    const map =
        {};


    sourceSales.forEach(
        sale => {

            const id =
                sale.medicineId ||
                sale.medicineName;


            if (!map[id]) {

                map[id] = {

                    name:
                        sale.medicineName,

                    quantity: 0,

                    revenue: 0

                };

            }


            map[id].quantity +=
                Number(
                    sale.quantity
                );


            map[id].revenue +=
                Number(
                    sale.total
                );

        }
    );


    const top =
        Object.values(
            map
        )
        .sort(
            (
                a,
                b
            ) =>
                b.quantity -
                a.quantity
        )
        .slice(
            0,
            10
        );


    if (top.length === 0) {

        container.innerHTML = `
            <div class="empty">
                لا توجد مبيعات لعرضها.
            </div>
        `;

        return;

    }


    container.innerHTML =
        top
            .map(
                (
                    item,
                    index
                ) => `

                <div class="top-item">

                    <div class="top-rank">
                        ${index + 1}
                    </div>

                    <div class="top-info">

                        <strong>
                            ${escapeHTML(
                                item.name
                            )}
                        </strong>

                        <small>
                            ${item.quantity}
                            وحدة مباعة
                        </small>

                    </div>

                    <strong>
                        ${formatMoney(
                            item.revenue
                        )}
                    </strong>

                </div>

                `
            )
            .join("");

}


/* =====================================================
   الإعدادات
===================================================== */

function loadSettings() {

    const pharmacyName =
        document.getElementById(
            "pharmacyName"
        );


    const ownerName =
        document.getElementById(
            "ownerName"
        );


    const currency =
        document.getElementById(
            "currency"
        );


    if (pharmacyName) {

        pharmacyName.value =
            settings.pharmacyName ||
            "صيدليتي";

    }


    if (ownerName) {

        ownerName.value =
            settings.ownerName ||
            "";

    }


    if (currency) {

        currency.value =
            settings.currency ||
            "XAF";

    }


    const header =
        document.getElementById(
            "headerPharmacyName"
        );


    if (header) {

        header.textContent =
            "💊 " +
            (
                settings.pharmacyName ||
                "صيدليتي"
            );

    }

}


function saveSettings() {

    settings = {

        pharmacyName:
            document.getElementById(
                "pharmacyName"
            ).value.trim() ||
            "صيدليتي",

        ownerName:
            document.getElementById(
                "ownerName"
            ).value.trim(),

        currency:
            document.getElementById(
                "currency"
            ).value.trim() ||
            "XAF"

    };


    saveSettingsData();

    loadSettings();

    updateDashboard();

    renderMedicines();

    renderSales();

    renderTopMedicines();

    updateSaleMedicineList();


    alert(
        "تم حفظ الإعدادات ✅"
    );

}


/* =====================================================
   الوضع الليلي
===================================================== */

function loadDarkMode() {

    const dark =
        localStorage.getItem(
            "pharmacy_dark_mode"
        );


    if (
        dark === "true"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    updateDarkModeButton();

}


function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const enabled =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "pharmacy_dark_mode",
        enabled
    );


    updateDarkModeButton();

}


function updateDarkModeButton() {

    const button =
        document.getElementById(
            "darkModeBtn"
        );


    if (!button) return;


    const enabled =
        document.body.classList.contains(
            "dark"
        );


    button.textContent =
        enabled
            ? "☀️"
            : "🌙";

}


/* =====================================================
   النسخ الاحتياطي
===================================================== */

function exportBackup() {

    const backup = {

        version: 2,

        exportedAt:
            new Date().toISOString(),

        medicines,

        sales,

        settings,

        darkMode:
            localStorage.getItem(
                "pharmacy_dark_mode"
            ) === "true"

    };


    const data =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [
                data
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `pharmacy-backup-${getTodayKey()}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    alert(
        "تم تصدير النسخة الاحتياطية بنجاح ✅"
    );

}


/* =====================================================
   استعادة النسخة الاحتياطية
===================================================== */

function importBackup(
    event
) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const backup =
                    JSON.parse(
                        reader.result
                    );


                if (
                    !backup ||
                    !Array.isArray(
                        backup.medicines
                    ) ||
                    !Array.isArray(
                        backup.sales
                    )
                ) {

                    throw new Error(
                        "invalid backup"
                    );

                }


                const confirmed =
                    confirm(
                        "سيتم استبدال البيانات الحالية بالنسخة الاحتياطية. هل تريد المتابعة؟"
                    );


                if (!confirmed) {

                    event.target.value =
                        "";

                    return;

                }


                medicines =
                    backup.medicines;


                sales =
                    backup.sales;


                settings =
                    backup.settings ||
                    {

                        pharmacyName:
                            "صيدليتي",

                        ownerName:
                            "",

                        currency:
                            "XAF"

                    };


                saveMedicines();

                saveSales();

                saveSettingsData();


                if (
                    backup.darkMode
                ) {

                    localStorage.setItem(
                        "pharmacy_dark_mode",
                        "true"
                    );

                }


                else {

                    localStorage.setItem(
                        "pharmacy_dark_mode",
                        "false"
                    );

                }


                alert(
                    "تم استعادة البيانات بنجاح ✅"
                );


                location.reload();

            }

            catch (
                error
            ) {

                alert(
                    "ملف النسخة الاحتياطية غير صالح ❌"
                );

            }

            finally {

                event.target.value =
                    "";

            }

        };


    reader.readAsText(
        file
    );

}


/* =====================================================
   حذف سجل المبيعات
===================================================== */

function clearSales() {

    if (
        sales.length === 0
    ) {

        alert(
            "لا يوجد سجل مبيعات."
        );

        return;

    }


    const confirmed =
        confirm(
            "هل تريد حذف سجل المبيعات بالكامل؟"
        );


    if (!confirmed) return;


    const doubleConfirm =
        confirm(
            "⚠️ هذا الإجراء لا يمكن التراجع عنه. هل أنت متأكد؟"
        );


    if (!doubleConfirm) return;


    sales = [];


    saveSales();

    updateDashboard();

    renderSales();

    renderTopMedicines();


    alert(
        "تم حذف سجل المبيعات ✅"
    );

}


/* =====================================================
   حذف جميع البيانات
===================================================== */

function deleteAllData() {

    const confirmed =
        confirm(
            "⚠️ سيتم حذف جميع الأدوية والمبيعات والإعدادات. هل أنت متأكد؟"
        );


    if (!confirmed) return;


    const doubleConfirm =
        confirm(
            "هذا الإجراء لا يمكن التراجع عنه. هل تريد المتابعة؟"
        );


    if (!doubleConfirm) return;


    localStorage.removeItem(
        "pharmacy_medicines"
    );


    localStorage.removeItem(
        "pharmacy_sales"
    );


    localStorage.removeItem(
        "pharmacy_settings"
    );


    localStorage.removeItem(
        "pharmacy_dark_mode"
    );


    location.reload();

}


/* =====================================================
   تنسيق المال
===================================================== */

function formatMoney(
    amount
) {

    const number =
        Number(
            amount
        ) || 0;


    return (
        number.toLocaleString(
            "ar",
            {
                maximumFractionDigits: 2
            }
        )
        +
        " " +
        (
            settings.currency ||
            "XAF"
        )
    );

}


/* =====================================================
   التاريخ المحلي
===================================================== */

function getTodayKey() {

    const now =
        new Date();


    return dateToInputValue(
        now
    );

}


function getLocalDateKey(
    value
) {

    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return dateToInputValue(
        date
    );

}


function dateToInputValue(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =====================================================
   تنسيق التاريخ
===================================================== */

function formatDate(
    date
) {

    if (!date) {

        return "غير محدد";

    }


    const parsed =
        new Date(
            date +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "غير محدد";

    }


    return parsed.toLocaleDateString(
        "ar"
    );

}


function formatDateTime(
    date
) {

    const parsed =
        new Date(
            date
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "غير محدد";

    }


    return parsed.toLocaleString(
        "ar"
    );

}


/* =====================================================
   حماية HTML
===================================================== */

function escapeHTML(
    text
) {

    return String(
        text ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =====================================================
   أدوات مساعدة
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function createId() {

    return (
        Date.now().toString(
            36
        )
        +
        Math.random()
            .toString(
                36
            )
            .substring(
                2,
                8
            )
    );

}


/* =====================================================
   إغلاق النوافذ عند الضغط خارجها
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const medicineModal =
            document.getElementById(
                "medicineModal"
            );


        const stockModal =
            document.getElementById(
                "stockModal"
            );


        if (
            medicineModal &&
            event.target ===
                medicineModal
        ) {

            closeMedicineModal();

        }


        if (
            stockModal &&
            event.target ===
                stockModal
        ) {

            closeStockModal();

        }

    }
);


/* =====================================================
   ESC لإغلاق النوافذ
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) return;


        closeMedicineModal();

        closeStockModal();

    }
);
